import Head from 'next/head'
import { DefaultLayout } from '../../modules/DefaultLayout'
import { getPublicInfo } from '../../lib/api'

import { PublicInfo } from '../../modules/interfaces'
import { CategoryList } from '../../modules/CategoryView';
import { Infos } from '../../modules/Context/Infos';

const Render = ({ infos }: { infos: PublicInfo }) => {
    return (<>
            <Head>
                <meta name="description" content="Discover more looking into the post categories" />
                <meta property="og:description" content="Discover more looking into the post categories" />
            </Head>
            <CategoryList />
    </>)
}; export default Render

export const getStaticProps = async () => {
    const infos = getPublicInfo();
    return {
        props: {
            infos
        }
    }
}

