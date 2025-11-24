import Head from 'next/head'
import { DefaultLayout } from '../../modules/DefaultLayout'
import { PostList } from '../../modules/Posts'
import { PublicInfo, Post } from '../../modules/interfaces'
import { Infos } from '../../modules/Context/Infos';
import { getCategories, getPosts, getPublicInfo } from '../../lib/api';

import { getCategoryWithInfos } from '../../modules/utils'
import { Error404 } from '../../modules/Errors'

const Render = ({ infos, posts, categoryid }: { infos: PublicInfo, posts: Post[], categoryid: string }) => {
    const currentCategory = getCategoryWithInfos(categoryid, infos)
    if (currentCategory == null) {
        return <Error404 />
    }
    return (<Infos infos={infos}>
        <DefaultLayout>
            <Head>
                <meta name="description" content={currentCategory.description} />
                <meta property="og:description" content={currentCategory.description} />
            </Head>
            <h1>{currentCategory.name}</h1>
            <p>{currentCategory.description}</p>
            {posts.length == 0 ? "" : <hr />}
            {posts.length == 0 ?
                <h1 style={{ textAlign: "center", margin: "100px 0" }}>
                    There are no posts for this category!
                </h1> : ""}
            <PostList posts={posts} />
        </DefaultLayout>
    </Infos>)
}; export default Render

export const getStaticPaths = async () => {
    const categories = getCategories();
    return {
        paths: categories.map(c => ({ params: { categoryid: c.id } })),
        fallback: false
    }
}

export const getStaticProps = async (context: any) => {
    const categoryid = context.params.categoryid;
    const allPosts = getPosts();
    const posts = allPosts.filter(p => p.category === categoryid).sort((a, b) => {
        if (a.star !== b.star) return (b.star ? 1 : 0) - (a.star ? 1 : 0);
        return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
    });
    const infos = getPublicInfo();

    return {
        props: {
            categoryid,
            posts,
            infos
        }
    }
}
