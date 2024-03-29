import Twemoji from "../Twemoji"
export const EmojiRender = ({children}) => {
    return (
        <Twemoji options={{ className: 'twemoji', folder: 'svg', ext: '.svg', base:"https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/"}}>
            {children}
        </Twemoji>
    )
}