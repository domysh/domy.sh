import { PublicProps } from "../interfaces";
import style from "./style.module.scss"
import { logout } from "../Auth";
import { CircleBtn } from "./CircleBtn"

export const Header = ({ infos }:PublicProps) => {
    const siteinfo_edit = () => {
        alert("I wanna edit the site's informations")
    }

    return <>
        <h1 className={style.header}>
            <div className={style.header_title}>
                Admin Panel - <u>{infos.meta.site_name}</u>
            </div>
            <div className={style.header_btns} >
                <CircleBtn onClick={siteinfo_edit} icon="fas fa-edit" variant="success" />
                <CircleBtn onClick={logout} icon="fas fa-sign-out-alt" variant="danger" />
            </div>
        </h1>
    </>
}