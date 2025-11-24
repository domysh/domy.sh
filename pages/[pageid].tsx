import { DefaultLayout } from '../modules/DefaultLayout'
import ReactMarkdown from 'react-markdown'
import Head from 'next/head'
import { Page, PublicInfo } from '../modules/interfaces'
import { Infos } from '../modules/Context/Infos'
import { getPage, getPages, getPublicInfo } from '../lib/api'


const Render = ({ page, infos }: { page: Page, infos: PublicInfo }) => {
    return (<Infos infos={infos}>
        <DefaultLayout>
            <Head>
                <meta name="description" content={page.description} />
            </Head>
            <h1 style={{ textAlign: "center" }}>{page.name}</h1>
            <hr style={{ margin: "50px 0px" }} />
            <ReactMarkdown>{page.content}</ReactMarkdown>
        </DefaultLayout>
    </Infos>)
}; export default Render;

export const getStaticPaths = async () => {
    const pages = getPages();
    return {
        paths: pages
            .filter(p => p.id !== "" && p.id !== "index")
            .map(p => ({ params: { pageid: p.id } })),
        fallback: false
    }
}

export const getStaticProps = async (context: any) => {
    const pageid = context.params.pageid;
    const page = getPage(pageid);
    const infos = getPublicInfo();

    if (!page) return { notFound: true }

    return {
        props: {
            page,
            infos
        }
    }
}
