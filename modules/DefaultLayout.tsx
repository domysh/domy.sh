import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { Footer } from './Footer'
import { Header } from './Header'
import { NavBar } from './NavBar'
import { PublicInfo } from './interfaces'
import { useRouter } from 'next/router'

export function DefaultLayout({ infos, children }: {infos:PublicInfo, children:any}) {
    const currentPath = useRouter().asPath
    let site_title:string = `Welcome >> ${infos.meta.site_name}`
    for (const navlink of infos.pages){
        if (currentPath === navlink.path){
            site_title = `${navlink.name} >> ${infos.meta.site_name}`
            break
        }
    }
    return (
        <>
            <Head>
                <title>{site_title}</title>
                <meta itemProp="image" content="/favicon.ico"  />
                <link itemProp="image" href="/favicon.ico" />
                <meta property="og:image" content="/favicon.ico" />
            </Head>
            <NavBar infos={infos} />
            <Header infos={infos} />
            <Container>
                {children}
            </Container>
            <Footer infos={infos} />
        </>
    )
}
