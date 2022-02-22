import '../styles/index.scss'
import { EmojiRender } from '../modules/EmojiRender'
import Head from 'next/head'
import { OverlayProvider } from '../modules/Fullscreen'
import { SessionProvider } from "next-auth/react"
import Script from 'next/script'
import '@fortawesome/fontawesome-free/css/all.min.css'
import CookieConsent from 'react-cookie-consent'


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
            </Head>
            <OverlayProvider>
                <Component {...pageProps} />
            </OverlayProvider>
          <CookieConsent
              location="bottom"
              buttonText="That's Ok!"
              cookieName="cookie-consent"
              style={{ background: "#0B0B0BDD", borderTop: "6px solid #000"}}
              buttonStyle={{ color: "#4e503b", fontSize: "16px" }}
            >
            This website uses cookies to enhance the user experience.
          </CookieConsent>
        </EmojiRender>
    </SessionProvider>
  </>
} export default MyApp