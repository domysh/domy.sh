import { sprops } from "../js/db";
import { AdminPage } from "../modules/Admin";
import { LoginRequired } from "../modules/Auth";
import { Infos } from "../modules/Context/Infos";
import { PublicInfo } from "../modules/interfaces";
import { NoBots } from "../modules/utils";


export default function Render({ infos }:{ infos:PublicInfo }) {
    return <>
    <Infos infos={infos}>
        <NoBots />
        <LoginRequired>
            <AdminPage />
        </LoginRequired>
    </Infos>
    </>
}

export const getServerSideProps = sprops()

