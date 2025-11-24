import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { Footer } from './Footer'
import { Header } from './Header'
import { NavBar } from './NavBar'
import { Spacer } from './utils'

export function DefaultLayout({ children }: { children: any }) {
    return <>
        <NavBar />
        <Header />
        <Spacer />
        <script defer data-domain="domy.sh" src="https://plausible.domy.sh/js/script.js"></script>
        <Container>
            {children}
        </Container>
        <Footer />
    </>
}
