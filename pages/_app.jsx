import '../styles/index.scss'
import { EmojiRender } from '../modules/EmojiRender'
import Head from 'next/head'
import { OverlayProvider } from '../modules/Fullscreen'
import { SessionProvider } from "next-auth/react"
import Script from 'next/script'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return <>
    <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
          ga('create', 'UA-172882427-1', 'auto');
          ga('send', 'pageview');
        `}
    </Script>
    <Script
      src="https://www.google-analytics.com/analytics.js"
      strategy="afterInteractive"
    />
    <SessionProvider session={session}>
        <EmojiRender>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta itemProp="image" content="/favicon.ico" />
                <link itemProp="image" href="/favicon.ico" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
            </Head>
            <OverlayProvider>
                <Component {...pageProps} />
            </OverlayProvider>
        </EmojiRender>
    </SessionProvider>
  </>
} export default MyApp