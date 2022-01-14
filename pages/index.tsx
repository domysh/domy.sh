import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { DefaultLayout } from '../modules/DefaultLayout'
import { PostList } from '../modules/Posts'
import { sprops } from '../js/db'
import { Page, Post, PublicInfo } from '../modules/interfaces'
import { tojsonlike } from '../js/utils'

const Render = ({ infos, page, posts }: { infos:PublicInfo, page?:Page, posts:Post[] }) => {
    let description = "Welcome to the home page of my website!"
    let content = posts.length == 0?"## No content available!":""
    if (page != null){
        description = page.description
        content = page.content
    }
    return (
    <DefaultLayout infos={infos}>
        <Head>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
        </Head>
        <ReactMarkdown>{content}</ReactMarkdown>
        {posts.length==0?"":<hr />}
        <PostList posts={posts} infos={infos} />
    </DefaultLayout>)
}; export default Render

export const getServerSideProps = sprops(async (db) => {
    return {
        page: tojsonlike(await db.collection("pages").findOne({_id:""})),
        posts: tojsonlike(await db.collection("posts").find({ star: true }).sort({ end_date:-1 }).toArray())
    }
})
