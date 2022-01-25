import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { DefaultLayout } from '../modules/DefaultLayout'
import { PostList } from '../modules/Posts'
import { sprops, DB, ssprops } from '../js/db'
import { Page, Post, PublicInfo } from '../modules/interfaces'
import { tojsonlike } from '../js/utils'
import { Infos, InfosContext } from '../modules/Context/Infos'
import { useContext } from 'react'

const Render = ({ page, posts, infos }: { infos:PublicInfo, page?:Page, posts:Post[] }) => {
    let description = "Welcome to the home page of my website!"
    let content = posts.length == 0?"## No content available!":""
    if (page != null){
        description = page.description
        content = page.content
    }
    return (<Infos infos={infos}>
    <DefaultLayout>
        <Head>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
        </Head>
        <ReactMarkdown>{content}</ReactMarkdown>
        {posts.length==0?"":<hr />}
        <PostList posts={posts} />
    </DefaultLayout>
    </Infos>)
}; export default Render

export const getStaticProps = ssprops(async () => {
    const db = await DB()
    return {
        page: tojsonlike(await db.collection("pages").findOne({_id:""})),
        posts: tojsonlike(await db.collection("posts").find({ star: true }).sort({ end_date:-1 }).toArray())
    }
},5)