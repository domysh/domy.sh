import { useState } from "react"
import { Container } from "react-bootstrap"
import { FullScreen } from "../Fullscreen"
import { Header } from "./Header"
import { ListSwitch } from "./ListSwitch"
import { PaneWindow } from "./Panes"



export const AdminPage = ({ infos }) => {
    const [overlay,setOverlay] = useState(null)

    return <Container>
        <Header infos={infos} popupShow={setOverlay} />
        <ListSwitch infos={infos} popupShow={setOverlay} />
        {overlay?
            <FullScreen center transparent>
                <PaneWindow close={()=>{setOverlay(null)}}>
                    {overlay}
                </PaneWindow>
            </FullScreen>:null}
    </Container>
}

