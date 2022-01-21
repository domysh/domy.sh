import style from "./style.module.scss"
import { logout } from "../Auth";
import { CircleBtn } from "./CircleBtn"
import { EditMetas, PanePopup } from "./Panes";
import { InfosContext } from "../Context/Infos";
import { useContext } from "react";

export const Header = () => {
    const infos = useContext(InfosContext)
    return <>
        <h1 className={style.header}>
            <div className={style.header_title}>
                Admin Panel - <u>{infos.meta.site_name}</u>
            </div>
            <div className={style.header_btns} >
                <PanePopup show={<EditMetas />}>
                    { open => <CircleBtn icon="fas fa-edit" variant="success" onClick={open} /> }
                </PanePopup>
                <CircleBtn onClick={logout} icon="fas fa-sign-out-alt" variant="danger" />
            </div>
        </h1>
    </>
}