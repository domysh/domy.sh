import Twemoji from "react-twemoji"

export const EmojiRender = ({children}) => {
    return (
        <Twemoji options={{ className: 'twemoji', folder: 'svg', ext: '.svg'}}>
            {children}
        </Twemoji>
    )
}