import { sprops } from "../js/db";
import { AdminPage } from "../modules/Admin";
import { LoginRequired } from "../modules/Auth";
import { PublicProps } from "../modules/interfaces";
import { NoBots } from "../modules/utils";


export default function Render({ infos }:PublicProps) {
    return <>
    <NoBots />
    <LoginRequired>
        <AdminPage infos={infos} />
    </LoginRequired>
    </>
}

export const getServerSideProps = sprops()