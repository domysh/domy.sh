import Head from 'next/head'
import { Container } from 'react-bootstrap'
import { Footer } from './Footer'
import { Header } from './Header'
import { NavBar } from './NavBar'
import { Spacer } from './utils'

export function DefaultLayout({ children }: { children: any }) {
    return <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />
        <Header />
        <Spacer />
        <Container style={{ flexGrow: 1 }}>
            {children}
        </Container>
        <Footer />
    </div>
}
