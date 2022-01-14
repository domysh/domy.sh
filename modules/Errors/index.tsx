import Link from "next/link"
import { Button } from "react-bootstrap"
import { EmojiRender, FullScreen } from "../utils"
import style from "./style.module.scss"

export const Error404 = () => {
    return <FullScreen center>
        <EmojiRender>
            <div className={style.errorcontainer}>
                <div className={style.error_code}>
                    <h1 className={style.first_four}>4</h1>
                    <div className={style.cog_wheel}>
                        <div className={style.cog}>
                            <div className={style.top} />
                            <div className={style.down} />
                            <div className={style.left_top} />
                            <div className={style.left_down} />
                            <div className={style.right_top} />
                            <div className={style.right_down} />
                            <div className={style.left} />
                            <div className={style.right} />
                        </div>
                    </div>
                    <h1 className={style.second_four}>4</h1>
                </div>
                <p className={style.description}>I can{"'"}t find your page ☹️ <Link href="/" passHref><Button variant="secondary">Go back home</Button></Link></p>
            </div>
        </EmojiRender>
    </FullScreen>
}

export const Loading = () => {
    return <FullScreen center>
        <div className={style.error_code} style={{opacity:".5"}}>
            <div className={style.cog_wheel} style={{animationDuration:"2.5s"}}>
                <div className={style.cog}>
                    <div className={style.top} />
                    <div className={style.down} />
                    <div className={style.left_top} />
                    <div className={style.left_down} />
                    <div className={style.right_top} />
                    <div className={style.right_down} />
                    <div className={style.left} />
                    <div className={style.right} />
                </div>
            </div>
        </div>
    </FullScreen>
}