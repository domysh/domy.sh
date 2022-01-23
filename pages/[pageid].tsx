import { DefaultLayout } from '../modules/DefaultLayout'
import ReactMarkdown from 'react-markdown'
import Head from 'next/head'
import { Page, PublicInfo } from '../modules/interfaces'
import { sprops, DB } from "../js/db"
import { tojsonlike } from "../js/utils"
import { Infos } from '../modules/Context/Infos'

const Render = ({ page, infos }:{ page:Page, infos:PublicInfo }) => {
    return (<Infos infos={infos}>
    <DefaultLayout>
        <Head>
            <meta name="description" content={page.description} />
        </Head>
        <h1 style={{textAlign:"center"}}>{page.name}</h1>
        <hr style={{margin:"50px 0px"}}/>
        <ReactMarkdown>{page.content}</ReactMarkdown>
    </DefaultLayout>
    </Infos>) 
}; export default Render;

export const getServerSideProps = sprops(async (context) => {
    const db = await DB()
    let res = await db.collection("pages").findOne({_id:context.params!.pageid})
    res = tojsonlike(res)
    if (res == null) return { notfound:true }
    return { page: res }
})
