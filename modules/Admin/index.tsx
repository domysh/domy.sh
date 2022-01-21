import { Container } from "react-bootstrap"
import { Footer } from "../Footer"
import { Header } from "./Header"
import { ListSwitch } from "./ListSwitch"


export const AdminPage = () => {

    return <>  
        <Header />
        <Container>
            <ListSwitch />
        </Container>
        <Footer />
    </>
}

