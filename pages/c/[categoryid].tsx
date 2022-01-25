import Head from 'next/head'
import { DefaultLayout } from '../../modules/DefaultLayout'
import { PostList } from '../../modules/Posts'
import { DB, ssprops, sspaths } from '../../js/db'
import { Post, PublicInfo } from '../../modules/interfaces'
import { tojsonlike } from '../../js/utils'
import { getCategoryWithInfos } from '../../modules/utils'
import { Error404 } from '../../modules/Errors'
import { Infos } from '../../modules/Context/Infos'

const Render = ({ infos, posts, categoryid }: { infos:PublicInfo, posts:Post[], categoryid:string }) => {
    const currentCategory = getCategoryWithInfos(categoryid,infos)
    if (currentCategory == null){
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
            {posts.length==0?"":<hr />}
            {posts.length == 0?
                <h1 style={{textAlign:"center",margin:"100px 0"}}>
                    There are no posts for this category!
                </h1>:""}
            <PostList posts={posts} />
        </DefaultLayout>
    </Infos>)
}; export default Render

export const getStaticPaths = sspaths

export const getStaticProps = ssprops(async (context) => {
    const db = await DB()
    return {
        categoryid: context.params!.categoryid,
        posts: tojsonlike(await db.collection("posts").find({ category: context.params!.categoryid }).sort({ star:-1, end_date:-1 }).toArray())
    }
})
