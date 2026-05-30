import Link from "next/link"
import { Button } from "react-bootstrap"
import { FullScreen } from "../Fullscreen"
import style from "./style.module.scss"

export const Error404 = () => {
    return <FullScreen center>
        <div className={style.errorcontainer}>
            <div className={style.bg_blob}></div>
            <h1 className={style.error_title}>404</h1>
            <h2 className={style.error_subtitle}>Page Not Found</h2>
            <p className={style.description}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/" passHref>
                <button className={style.go_home_btn}>
                    <i className="fa-solid fa-house" style={{marginRight: "10px"}}></i> Go Back Home
                </button>
            </Link>
        </div>
    </FullScreen>
}

export const Loading = () => {
    return <FullScreen center transparent>
        <div className={style.loading_container}>
            <div className={style.spinner}></div>
        </div>
    </FullScreen>
}