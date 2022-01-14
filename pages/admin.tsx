import { Button } from "react-bootstrap";
import { LoginRequired, logout } from "../modules/Auth";
import { NoBots } from "../modules/utils";


export default function Render() {

    return <>
    <NoBots />
    <LoginRequired>
        Loggined! <Button variant="danger" onClick={logout}>Log Out</Button>
    </LoginRequired>
    </>
}