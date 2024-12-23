import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { Footer } from './Footer'
import { Header } from './Header'
import { NavBar } from './NavBar'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { InfosContext } from './Context/Infos'
import { Spacer } from './utils'

export function DefaultLayout({ children }: {children:any}) {
    const infos = useContext(InfosContext)
    const currentPath = useRouter().asPath
    let site_title:string = `Welcome >> ${infos.meta.site_name}`
    for (const navlink of infos.pages){
        if (currentPath === navlink.path){
            site_title = `${navlink.name} >> ${infos.meta.site_name}`
            break
        }
    }
    const favicon_url = (new URL("/favicon.ico",infos.publicurl)).href
    return (
        <>
            <Head>
                <title>{site_title}</title>
                <meta property="og:image" content={favicon_url} />
            </Head>    
            <NavBar />
            <Header />
            <Spacer />
            <script defer data-domain="domy.sh" src="https://plausible.domy.sh/js/script.js"></script>
            <Container>
                {children}
            </Container>
            <Footer />
        </>
    )
}
