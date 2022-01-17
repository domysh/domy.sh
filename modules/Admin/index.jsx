import { Container } from "react-bootstrap"
import { Header } from "./Header"
import { ListSwitch } from "./ListSwitch"



export const AdminPage = ({ infos }) => {
    return <Container>
        <Header infos={infos} />
        <ListSwitch infos={infos} />
    </Container>
}

