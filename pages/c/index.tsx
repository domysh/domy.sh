import Head from 'next/head'
import { DefaultLayout } from '../../modules/DefaultLayout'
import { sprops } from '../../js/db'
import { PublicProps } from '../../modules/interfaces'
import { CategoryList } from '../../modules/CategoryView';

const Render = ({ infos }: PublicProps) => {
    return (
    <DefaultLayout infos={infos}>
        <Head>
            <meta name="description" content="Discover more looking into the post categories" />
            <meta property="og:description" content="Discover more looking into the post categories" />
        </Head>
        <CategoryList infos={infos} />
    </DefaultLayout>)
}; export default Render

export const getServerSideProps = sprops()
