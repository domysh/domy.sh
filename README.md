<img align="center" src="public/logo.png" width="150" />
<h1>Domy.sh Website</h1>
This is the project of <a href="https://domy.sh">domy.sh</a> created using <a href="https://nextjs.org/">nextjs</a> and <a href="https://reactjs.org/">react</a>.

<h2>Server setup</h2>

`public/setup.sh` is served at <a href="https://domy.sh/setup.sh">domy.sh/setup.sh</a> and bootstraps a new server (ssh keys, packages, docker, zsh, netbird):

```bash
sh <(curl -fsSL https://domy.sh/setup.sh)                   # interactive
sh <(curl -fsSL https://domy.sh/setup.sh) -y -k <SETUP_KEY>  # unattended
```
