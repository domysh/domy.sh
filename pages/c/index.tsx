import Head from 'next/head'
import { DefaultLayout } from '../../modules/DefaultLayout'
import { sprops } from '../../js/db'
import { PublicInfo, PublicProps } from '../../modules/interfaces'
import { CategoryList } from '../../modules/CategoryView';
import { Infos } from '../../modules/Context/Infos';

const Render = ({ infos }:{infos:PublicInfo}) => {
    return (<Infos infos={infos}>
    <DefaultLayout>
        <Head>
            <meta name="description" content="Discover more looking into the post categories" />
            <meta property="og:description" content="Discover more looking into the post categories" />
        </Head>
        <CategoryList />
    </DefaultLayout></Infos>)
}; export default Render

export const getServerSideProps = sprops()
