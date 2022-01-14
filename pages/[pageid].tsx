import { DefaultLayout } from '../modules/DefaultLayout'
import ReactMarkdown from 'react-markdown'
import Head from 'next/head'
import { Page, PublicInfo } from '../modules/interfaces'
import { sprops } from "../js/db"
import { tojsonlike } from "../js/utils"

const Render = ({ infos, page }:{infos:PublicInfo,page:Page}) => {
    return <DefaultLayout infos={infos}>
        <Head>
            <meta name="description" content={page.description} />
        </Head>
        <h1>{page.name}</h1>
        <ReactMarkdown>{page.content}</ReactMarkdown>
    </DefaultLayout>
}; export default Render;

export const getServerSideProps = sprops(async (db,context) => {
    let res = await db.collection("pages").findOne({_id:context.params!.pageid})
    res = tojsonlike(res)
    if (res == null) return { notfound:true }
    return { page: res }
})
