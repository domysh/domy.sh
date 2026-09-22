#!/usr/bin/env bash
#
# domy.sh server bootstrap
#
#   Interactive (asks what to do):
#     sh <(curl -fsSL https://domy.sh/setup.sh)
#
#   Unattended (everything, no questions):
#     sh <(curl -fsSL https://domy.sh/setup.sh) -y -k <NETBIRD_SETUP_KEY>
#
#   Run with --help for all the options.
#
# The whole script is wrapped in main() so that `curl | bash` parses it
# completely before running anything.

SETUP_URL="${SETUP_URL:-https://domy.sh/setup.sh}"

# Needs bash: when started by another shell (dash as sh, bash in POSIX
# mode, ...) re-run with bash. `sh <(curl ...)` gives a pipe as $0, which
# can't be read twice, so in that case the script is downloaded again.
if [ -z "${BASH_VERSION:-}" ] || (shopt -qo posix) 2>/dev/null; then
    command -v bash >/dev/null 2>&1 || { echo "This script needs bash" >&2; exit 1; }
    if [ -f "$0" ]; then
        exec bash "$0" "$@"
    fi
    script="$(curl -fsSL "$SETUP_URL")" && [ -n "$script" ] \
        || { echo "Could not download $SETUP_URL" >&2; exit 1; }
    exec bash -c "$script" setup.sh "$@"
fi

set -uo pipefail

KEYS_URL="https://github.com/domysh.keys"
NB_MANAGEMENT_URL="${NB_MANAGEMENT_URL:-https://vpn.domy.sh}"
NB_SETUP_KEY="${NB_SETUP_KEY:-}"
NB_UP_FLAGS=(
    --allow-server-ssh
    --enable-ssh-local-port-forwarding
    --enable-ssh-remote-port-forwarding
    --enable-ssh-sftp
    --enable-ssh-root
    --disable-ssh-auth
)
BASE_PACKAGES=(git neovim zsh btop netcat curl wget ripgrep tmux less more nft iptables)

STEPS=(firewall packages keys docker python zsh netbird)

export PATH="$PATH:/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin"

# ---------------------------------------------------------------- output ----

if [ -t 2 ]; then
    C_RESET=$'\e[0m' C_BOLD=$'\e[1m' C_DIM=$'\e[2m'
    C_RED=$'\e[31m' C_GREEN=$'\e[32m' C_YELLOW=$'\e[33m' C_BLUE=$'\e[34m'
else
    C_RESET="" C_BOLD="" C_DIM="" C_RED="" C_GREEN="" C_YELLOW="" C_BLUE=""
fi

info()  { printf '%s  ·%s %s\n' "$C_BLUE" "$C_RESET" "$*" >&2; }
ok()    { printf '%s  ✓%s %s\n' "$C_GREEN" "$C_RESET" "$*" >&2; }
warn()  { printf '%s  !%s %s\n' "$C_YELLOW" "$C_RESET" "$*" >&2; }
err()   { printf '%s  ✗%s %s\n' "$C_RED" "$C_RESET" "$*" >&2; }
die()   { err "$*"; exit 1; }
title() { printf '\n%s==> %s%s\n' "$C_BOLD" "$*" "$C_RESET" >&2; }

usage() {
    cat <<EOF
domy.sh server bootstrap

Usage: setup.sh [options]

Options:
  -y, --yes                 Don't ask anything: run every step not skipped
  -k, --setup-key KEY       NetBird setup key (or env NB_SETUP_KEY)
  -m, --management-url URL  NetBird management URL (default: $NB_MANAGEMENT_URL)
  -u, --user USER           User to configure (ssh keys, zsh, uv)
                            (default: \$SUDO_USER or the current user)
      --only STEP[,STEP]    Run only these steps
      --skip STEP[,STEP]    Skip these steps
      --no-STEP             Skip a single step (e.g. --no-docker)
  -h, --help                Show this help

Steps:
  firewall   Disable firewalld and cockpit (Fedora/RHEL family, systemd only)
  packages   Install ${BASE_PACKAGES[*]}
  keys       Add $KEYS_URL to ~/.ssh/authorized_keys
  docker     Install Docker with get.docker.com
  python     Install uv and create ~/.venv (used by the .zshrc)
  zsh        Install oh-my-zsh, write ~/.zshrc, set zsh as login shell
  netbird    Install NetBird and join the management server

Without -y every step not set by flags is asked interactively (default: yes).
If there is no terminal to ask on, the defaults are used.

Examples:
  sh <(curl -fsSL $SETUP_URL)
  sh <(curl -fsSL $SETUP_URL) -y -k XXXXXXXX
  sh <(curl -fsSL $SETUP_URL) -y --skip docker,netbird
EOF
}

# --------------------------------------------------------------- helpers ----

have() { command -v "$1" >/dev/null 2>&1; }

has_systemd() { [ -d /run/systemd/system ] && have systemctl; }

as_root() {
    if [ "$EUID" -eq 0 ]; then "$@"; else sudo "$@"; fi
}

# Run a command as the configured user, with its HOME.
as_user() {
    if [ "$TARGET_USER" = "$CURRENT_USER" ]; then
        "$@"
    elif [ "$EUID" -eq 0 ] && have runuser; then
        runuser -u "$TARGET_USER" -- env HOME="$TARGET_HOME" USER="$TARGET_USER" "$@"
    else
        sudo -u "$TARGET_USER" -H "$@"
    fi
}

TTY_OK=0
if (: </dev/tty) 2>/dev/null; then TTY_OK=1; fi

# ask_yn "question" -> 0 for yes (default), 1 for no
ask_yn() {
    local ans
    while true; do
        printf '%s?%s %s %s[Y/n]%s ' "$C_BOLD" "$C_RESET" "$1" "$C_DIM" "$C_RESET" >&2
        read -r ans </dev/tty || return 0
        case "${ans,,}" in
            ""|y|yes|s|si) return 0 ;;
            n|no) return 1 ;;
        esac
    done
}

ask_value() {
    local ans
    printf '%s?%s %s ' "$C_BOLD" "$C_RESET" "$1" >&2
    read -r ans </dev/tty || true
    printf '%s' "$ans"
}

detect_os() {
    OS_ID="unknown" OS_LIKE="" OS_NAME="unknown"
    if [ -r /etc/os-release ]; then
        # shellcheck disable=SC1091
        read -r OS_ID OS_LIKE <<<"$(. /etc/os-release; echo "${ID:-unknown}" "${ID_LIKE:-}")"
        # shellcheck disable=SC1091
        OS_NAME="$(. /etc/os-release; echo "${PRETTY_NAME:-$OS_ID}")"
    fi

    PM=""
    for pm in apt-get dnf yum pacman zypper; do
        if have "$pm"; then PM="${pm%-get}"; break; fi
    done
}

is_fedora_family() {
    [[ " $OS_ID $OS_LIKE " == *" fedora "* || " $OS_ID $OS_LIKE " == *" rhel "* ]]
}

PM_REFRESHED=0
pm_install() {
    [ -n "$PM" ] || { err "No supported package manager found"; return 1; }
    if [ "$PM_REFRESHED" -eq 0 ]; then
        case "$PM" in
            apt)    as_root env DEBIAN_FRONTEND=noninteractive apt-get update -q >/dev/null ;;
            pacman) as_root pacman -Sy --noconfirm >/dev/null ;;
            zypper) as_root zypper -n -q refresh >/dev/null ;;
        esac
        PM_REFRESHED=1
    fi
    case "$PM" in
        apt)    as_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -q "$@" ;;
        dnf)    as_root dnf install -y -q "$@" ;;
        yum)    as_root yum install -y -q "$@" ;;
        pacman) as_root pacman -S --needed --noconfirm "$@" ;;
        zypper) as_root zypper -n -q install "$@" ;;
    esac
}

# Install the package providing a command, if the command is missing.
ensure_cmd() {
    have "$1" && return 0
    info "Installing $1"
    pm_install "$(pkg_name "$1")" >/dev/null && have "$1"
}

# Logical package name -> command it provides
cmd_for() {
    case "$1" in
        neovim)  echo nvim ;;
        netcat)  echo nc ;;
        ripgrep) echo rg ;;
        *)       echo "$1" ;;
    esac
}

# Logical package name -> distro package name
pkg_name() {
    case "$PM:$1" in
        apt:netcat)             echo netcat-openbsd ;;
        pacman:netcat)          echo openbsd-netcat ;;
        zypper:netcat)          echo netcat-openbsd ;;
        dnf:netcat|yum:netcat)  echo nmap-ncat ;;
        apt:more)               echo bsdextrautils ;;
        *:more)                 echo util-linux ;;
        *:nft)                  echo nftables ;;
        dnf:iptables|yum:iptables|pacman:iptables) echo iptables-nft ;;
        *)                      echo "$1" ;;
    esac
}

# ----------------------------------------------------------------- steps ----

step_desc() {
    case "$1" in
        firewall) echo "Disable firewalld and cockpit" ;;
        packages) echo "Install base packages (${BASE_PACKAGES[*]})" ;;
        keys)     echo "Add $KEYS_URL to ~$TARGET_USER/.ssh/authorized_keys" ;;
        docker)   echo "Install Docker" ;;
        python)   echo "Install uv and create ~$TARGET_USER/.venv" ;;
        zsh)      echo "Install oh-my-zsh + .zshrc for $TARGET_USER" ;;
        netbird)  echo "Install NetBird and join $NB_MANAGEMENT_URL" ;;
    esac
}

step_firewall() {
    if ! has_systemd; then
        info "systemd is not running (container?), nothing to disable"
        return 0
    fi
    local unit
    for unit in firewalld.service cockpit.socket cockpit.service; do
        if systemctl list-unit-files --no-legend "$unit" 2>/dev/null | grep -q .; then
            if as_root systemctl disable --now "$unit" >/dev/null 2>&1; then
                ok "Disabled $unit"
            else
                warn "Could not disable $unit"
            fi
        else
            info "$unit not installed"
        fi
    done
}

step_packages() {
    [ -n "$PM" ] || { err "No supported package manager found"; return 1; }

    if [[ "$PM" == dnf || "$PM" == yum ]] && [ "$OS_ID" != fedora ]; then
        # neovim, btop & co. live in EPEL on RHEL clones
        pm_install epel-release >/dev/null 2>&1 || true
    fi

    local p missing=()
    for p in "${BASE_PACKAGES[@]}"; do
        have "$(cmd_for "$p")" || missing+=("$(pkg_name "$p")")
    done
    if [ "${#missing[@]}" -eq 0 ]; then
        ok "All packages already installed"
        return 0
    fi

    info "Installing: ${missing[*]}"
    if ! pm_install "${missing[@]}" >/dev/null 2>&1; then
        warn "Bulk install failed, installing one by one"
        for p in "${missing[@]}"; do
            pm_install "$p" >/dev/null 2>&1 || warn "Could not install $p"
        done
    fi

    local failed=()
    for p in "${BASE_PACKAGES[@]}"; do
        have "$(cmd_for "$p")" || failed+=("$p")
    done
    if [ "${#failed[@]}" -gt 0 ]; then
        err "Still missing: ${failed[*]}"
        return 1
    fi
    ok "Packages installed"
}

step_keys() {
    ensure_cmd curl || return 1

    local keys ssh_dir="$TARGET_HOME/.ssh" ak="$TARGET_HOME/.ssh/authorized_keys" added=0 key
    keys="$(curl -fsSL "$KEYS_URL")" || { err "Could not download $KEYS_URL"; return 1; }
    [ -n "$keys" ] || { err "$KEYS_URL returned no keys"; return 1; }

    as_user mkdir -p "$ssh_dir" && as_user chmod 700 "$ssh_dir" || return 1
    as_user touch "$ak" && as_user chmod 600 "$ak" || return 1

    # Don't glue the first new key to an unterminated last line
    if as_user test -s "$ak" && [ -n "$(as_user tail -c1 "$ak")" ]; then
        echo | as_user tee -a "$ak" >/dev/null
    fi

    while IFS= read -r key; do
        [ -n "$key" ] || continue
        if ! as_user grep -qxF "$key" "$ak"; then
            printf '%s\n' "$key" | as_user tee -a "$ak" >/dev/null
            added=$((added + 1))
        fi
    done <<<"$keys"

    have restorecon && as_root restorecon -R "$ssh_dir" >/dev/null 2>&1
    ok "Added $added new key(s) to $ak"
}

step_docker() {
    ensure_cmd curl || return 1

    if have docker; then
        ok "Docker already installed ($(docker --version 2>/dev/null))"
    elif [ "$PM" = pacman ]; then
        pm_install docker docker-compose docker-buildx >/dev/null || return 1
    else
        curl -fsSL https://get.docker.com | as_root sh || return 1
    fi

    if ! has_systemd; then
        warn "systemd is not running: dockerd has to be started manually"
    elif as_root systemctl enable --now docker >/dev/null 2>&1; then
        ok "Docker service enabled"
    else
        warn "Could not start the docker service"
    fi

    if [ "$TARGET_USER" != root ] && getent group docker >/dev/null 2>&1; then
        as_root usermod -aG docker "$TARGET_USER" && ok "Added $TARGET_USER to the docker group"
    fi
}

step_python() {
    ensure_cmd curl || return 1

    local uv="$TARGET_HOME/.local/bin/uv"
    if ! as_user test -x "$uv"; then
        if have uv; then
            uv="$(command -v uv)"
        else
            info "Installing uv"
            curl -LsSf https://astral.sh/uv/install.sh | as_user env UV_NO_MODIFY_PATH=1 sh >/dev/null || return 1
        fi
    fi
    ok "uv: $(as_user "$uv" --version)"

    if as_user test -f "$TARGET_HOME/.venv/bin/activate"; then
        ok "$TARGET_HOME/.venv already exists"
    else
        as_user "$uv" venv -q "$TARGET_HOME/.venv" || return 1
        ok "Created $TARGET_HOME/.venv"
    fi
}

zshrc_content() {
    cat <<'EOF'
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="gallifrey"
export TERM=xterm-256color

ls ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions &> /dev/null || git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions;
ls ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting &> /dev/null || git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

plugins=(
        git
        zsh-autosuggestions
        zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh

alias ll="ls -lah"
alias off="sudo poweroff"
export PATH=$PATH:~/.local/bin:~/.local/share/gem/ruby/3.0.0/bin

alias pip="uv pip"
alias py="python3"
export VIRTUAL_ENV_DISABLE_PROMPT=1
source ~/.venv/bin/activate

mkdir -p ~/.config/nvim

# Auto-setup NvChad if not installed
if [ ! -f "$HOME/.config/nvim/lua/chadrc.lua" ]; then
    echo "NvChad not detected. Starting clean installation..."

    # 1. Delete existing Neovim configs, caches, and states to prevent conflicts
    rm -rf "$HOME/.config/nvim"
    rm -rf "$HOME/.local/share/nvim"
    rm -rf "$HOME/.local/state/nvim"
    rm -rf "$HOME/.cache/nvim"

    # 2. Clone the NvChad starter template
    git clone https://github.com/NvChad/starter "$HOME/.config/nvim"

    # 3. Append the vimrc source command to the end of init.lua
    if [ -f "$HOME/.config/nvim/init.lua" ]; then
        # Adding a newline first ensures it doesn't get appended to the very end of an existing line
        echo "" >> "$HOME/.config/nvim/init.lua"
        echo "vim.cmd('source ~/.vimrc')" >> "$HOME/.config/nvim/init.lua"
        echo "NvChad successfully installed and init.lua updated!"
    else
        echo "Error: init.lua not found after cloning."
    fi
fi

(ls ~/.vimrc &> /dev/null) || echo "
set clipboard+=unnamedplus
au BufNewFile,BufRead *.log set filetype=log" > ~/.vimrc

(ls ~/.tmux.conf &> /dev/null) || echo "set -g mouse on" > ~/.tmux.conf
export EDITOR=nvim

alias grub-update="grub2-mkconfig -o /boot/grub2/grub.cfg"

PATH="$PATH:/usr/sbin:/sbin"
export PATH
EOF
}

step_zsh() {
    ensure_cmd curl && ensure_cmd git && ensure_cmd zsh || return 1

    local omz="$TARGET_HOME/.oh-my-zsh" zshrc="$TARGET_HOME/.zshrc" plugin
    if as_user test -d "$omz"; then
        ok "oh-my-zsh already installed"
    else
        info "Installing oh-my-zsh"
        curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh \
            | as_user env ZSH="$omz" RUNZSH=no CHSH=no KEEP_ZSHRC=yes sh -s -- --unattended >/dev/null 2>&1 \
            || { err "oh-my-zsh installation failed"; return 1; }
        ok "oh-my-zsh installed"
    fi

    for plugin in zsh-autosuggestions zsh-syntax-highlighting; do
        as_user test -d "$omz/custom/plugins/$plugin" \
            || as_user git clone -q --depth=1 "https://github.com/zsh-users/$plugin" "$omz/custom/plugins/$plugin" \
            || warn "Could not clone $plugin"
    done

    if as_user test -f "$zshrc" && [ "$(as_user cat "$zshrc")" != "$(zshrc_content)" ]; then
        local backup
        backup="$zshrc.bak.$(date +%Y%m%d%H%M%S)"
        as_user cp "$zshrc" "$backup" && info "Old .zshrc saved as $backup"
    fi
    zshrc_content | as_user tee "$zshrc" >/dev/null || return 1
    ok "Wrote $zshrc"

    local zsh_path current_shell
    zsh_path="$(grep -m1 '/zsh$' /etc/shells 2>/dev/null)"
    [ -x "$zsh_path" ] || zsh_path="$(command -v zsh)"
    grep -qxF "$zsh_path" /etc/shells 2>/dev/null || echo "$zsh_path" | as_root tee -a /etc/shells >/dev/null
    current_shell="$(getent passwd "$TARGET_USER" | cut -d: -f7)"
    if [ "$current_shell" = "$zsh_path" ]; then
        ok "zsh is already the login shell of $TARGET_USER"
    elif { have usermod && as_root usermod -s "$zsh_path" "$TARGET_USER"; } \
        || { have chsh && as_root chsh -s "$zsh_path" "$TARGET_USER"; }; then
        ok "Login shell of $TARGET_USER set to $zsh_path"
    else
        warn "Could not change the login shell of $TARGET_USER"
    fi
}

step_netbird() {
    ensure_cmd curl || return 1

    if have netbird; then
        ok "NetBird already installed ($(netbird version 2>/dev/null))"
    else
        info "Installing NetBird"
        # Without systemd the package post-install (service setup) fails,
        # but the binary is there: only the final check matters
        curl -fsSL https://pkgs.netbird.io/install.sh | as_root env SKIP_UI_APP=true sh \
            || warn "The NetBird installer reported errors"
        have netbird || { err "netbird not found after the install"; return 1; }
    fi

    if [ -z "$NB_SETUP_KEY" ]; then
        warn "No setup key given: NetBird is installed but not connected. Run:"
        warn "  sudo netbird up --management-url $NB_MANAGEMENT_URL --setup-key <KEY> ${NB_UP_FLAGS[*]}"
        return 0
    fi

    if ! has_systemd && ! as_root netbird status >/dev/null 2>&1; then
        info "systemd is not running: starting the NetBird daemon in background"
        as_root sh -c 'nohup netbird service run >/var/log/netbird.log 2>&1 &'
        sleep 3
    fi

    as_root netbird up --management-url "$NB_MANAGEMENT_URL" --setup-key "$NB_SETUP_KEY" "${NB_UP_FLAGS[@]}" \
        || return 1
    ok "NetBird connected to $NB_MANAGEMENT_URL"
}

# ------------------------------------------------------------------ main ----

main() {
    local assume_yes=0 only="" skip="" s
    declare -gA STEP_ON=()

    is_step() { [[ " ${STEPS[*]} " == *" $1 "* ]]; }
    set_steps() { # set_steps VALUE "a,b,c"
        local v="$1" list step
        IFS=',' read -ra list <<<"$2"
        for step in "${list[@]}"; do
            is_step "$step" || die "Unknown step '$step' (valid: ${STEPS[*]})"
            STEP_ON[$step]="$v"
        done
    }

    while [ $# -gt 0 ]; do
        case "$1" in
            -y|--yes) assume_yes=1 ;;
            -k|--setup-key) NB_SETUP_KEY="${2:?--setup-key needs a value}"; shift ;;
            --setup-key=*) NB_SETUP_KEY="${1#*=}" ;;
            -m|--management-url) NB_MANAGEMENT_URL="${2:?--management-url needs a value}"; shift ;;
            --management-url=*) NB_MANAGEMENT_URL="${1#*=}" ;;
            -u|--user) TARGET_USER="${2:?--user needs a value}"; shift ;;
            --user=*) TARGET_USER="${1#*=}" ;;
            --only) only="${2:?--only needs a value}"; shift ;;
            --only=*) only="${1#*=}" ;;
            --skip) skip="${skip:+$skip,}${2:?--skip needs a value}"; shift ;;
            --skip=*) skip="${skip:+$skip,}${1#*=}" ;;
            --no-*) skip="${skip:+$skip,}${1#--no-}" ;;
            -h|--help) usage; exit 0 ;;
            *) usage >&2; die "Unknown option: $1" ;;
        esac
        shift
    done

    if [ -n "$only" ]; then
        for s in "${STEPS[@]}"; do STEP_ON[$s]=0; done
        set_steps 1 "$only"
    fi
    [ -n "$skip" ] && set_steps 0 "$skip"

    # --- who & where
    CURRENT_USER="$(id -un)"
    if [ "$EUID" -ne 0 ] && ! have sudo; then
        die "Run this script as root (sudo is not installed)"
    fi
    if [ -z "${TARGET_USER:-}" ]; then
        if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != root ]; then
            TARGET_USER="$SUDO_USER"
        else
            TARGET_USER="$CURRENT_USER"
        fi
    fi
    id "$TARGET_USER" >/dev/null 2>&1 || die "User '$TARGET_USER' does not exist"
    TARGET_HOME="$(getent passwd "$TARGET_USER" | cut -d: -f6)"
    [ -n "$TARGET_HOME" ] || TARGET_HOME="$(eval echo "~$TARGET_USER")"

    detect_os

    local interactive=0
    [ "$assume_yes" -eq 0 ] && [ "$TTY_OK" -eq 1 ] && interactive=1

    printf '\n%sdomy.sh server setup%s\n' "$C_BOLD" "$C_RESET" >&2
    info "System:  $OS_NAME (${PM:-no package manager}$(has_systemd || echo ", no systemd"))"
    info "User:    $TARGET_USER ($TARGET_HOME)"
    [ "$interactive" -eq 1 ] || info "Mode:    unattended"
    echo >&2

    # --- decide what to do
    if ! is_fedora_family && [ -z "${STEP_ON[firewall]:-}" ]; then
        STEP_ON[firewall]=0
    fi
    for s in "${STEPS[@]}"; do
        [ -n "${STEP_ON[$s]:-}" ] && continue
        if [ "$interactive" -eq 1 ]; then
            if ask_yn "$(step_desc "$s")"; then STEP_ON[$s]=1; else STEP_ON[$s]=0; fi
        else
            STEP_ON[$s]=1
        fi
    done

    if [ "${STEP_ON[netbird]}" -eq 1 ] && [ -z "$NB_SETUP_KEY" ] && [ "$interactive" -eq 1 ]; then
        NB_SETUP_KEY="$(ask_value "NetBird setup key (empty = install only):")"
    fi

    title "Plan"
    for s in "${STEPS[@]}"; do
        if [ "${STEP_ON[$s]}" -eq 1 ]; then ok "$(step_desc "$s")"
        else printf '%s  -  %s (skipped)%s\n' "$C_DIM" "$(step_desc "$s")" "$C_RESET" >&2; fi
    done
    if [ "${STEP_ON[netbird]}" -eq 1 ] && [ -z "$NB_SETUP_KEY" ]; then
        warn "No NetBird setup key: NetBird will be installed but not connected"
    fi
    if [ "$interactive" -eq 1 ]; then
        echo >&2
        ask_yn "Proceed?" || die "Aborted"
    fi

    # Ask for the sudo password now, not in the middle of a step
    if [ "$EUID" -ne 0 ]; then
        if [ "$TTY_OK" -eq 1 ]; then
            # shellcheck disable=SC2024
            sudo -v </dev/tty || die "sudo is required"
        else
            sudo -n true 2>/dev/null || die "sudo needs a password but there is no terminal: run as root"
        fi
    fi

    # --- run
    local results=() any_failed=0
    for s in "${STEPS[@]}"; do
        [ "${STEP_ON[$s]}" -eq 1 ] || continue
        title "$(step_desc "$s")"
        if "step_$s" </dev/null; then
            results+=("${C_GREEN}✓${C_RESET} $s")
        else
            err "Step '$s' failed"
            results+=("${C_RED}✗${C_RESET} $s")
            any_failed=1
        fi
    done

    title "Summary"
    for s in "${results[@]}"; do printf '  %s\n' "$s" >&2; done
    if [ "${STEP_ON[zsh]}" -eq 1 ]; then
        echo >&2
        info "Log out and back in (or run: exec zsh) to start using zsh"
    fi
    return "$any_failed"
}

main "$@"
