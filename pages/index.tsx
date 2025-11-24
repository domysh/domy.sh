import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { DefaultLayout } from '../modules/DefaultLayout'
import { PostList } from '../modules/Posts'
import { Page, Post, PublicInfo } from '../modules/interfaces'
import { Infos } from '../modules/Context/Infos'
import { getPublicInfo, getPage, getPosts } from '../lib/api'


const Render = ({ page, posts, infos }: { infos: PublicInfo, page?: Page, posts: Post[] }) => {
    let description = "Welcome to the home page of my website!"
    let content = posts.length == 0 ? "## No content available!" : ""
    if (page != null) {
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
            {posts.length == 0 ? "" : <hr />}
            <PostList posts={posts} />
        </DefaultLayout>
    </Infos>)
}; export default Render

export const getStaticProps = async () => {
    const infos = getPublicInfo();
    const page = getPage("index");

    const allPosts = getPosts();
    const posts = allPosts.filter(p => p.star).sort((a, b) => (new Date(b.end_date).getTime() - new Date(a.end_date).getTime()));

    return {
        props: {
            infos,
            page: page || null, // If null, Render handles it
            posts
        }
    }
}