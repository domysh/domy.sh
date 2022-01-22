import { Container } from "react-bootstrap"
import { Footer } from "../Footer"
import React from "react"
import { Button } from "react-bootstrap"
import currentStyle from "./style.module.scss"
import { logout } from "../Auth";
import { EditMetas, PanePopup } from "./EditPanes";
import { InfosContext } from "../Context/Infos";
import { useContext } from "react";
import { ListSwitch } from "./Lists"

export const Header = () => {
    const infos = useContext(InfosContext)
    return <>
        <h1 className={currentStyle.header}>
            <div className={currentStyle.header_title}>
                Admin Panel - <u>{infos.meta.site_name}</u>
            </div>
            <div className={currentStyle.header_btns} >
                <PanePopup show={<EditMetas />}>
                    { open => <CircleBtn icon="fas fa-edit" variant="success" onClick={open} /> }
                </PanePopup>
                <CircleBtn onClick={logout} icon="fas fa-sign-out-alt" variant="danger" />
            </div>
        </h1>
    </>
}

export const CircleBtn = React.forwardRef<HTMLButtonElement,{ icon:string, onClick?: (p:any) => any, className?:string|null, variant:string}>(
    ({icon, className, onClick, variant, ...props}, ref)=> {
    return <Button
               ref={ref}
               onClick={onClick}
               className={`${currentStyle.btn} ${className?className:""}`}
               variant={variant}
               {...props}>
            <i className={icon} />
        </Button>
})

export const AdminPage = () => {

    return <>  
        <Header />
        <Container>
            <ListSwitch />
        </Container>
        <Footer />
    </>
}

