import '../styles/index.scss'
import { EmojiRender } from '../modules/EmojiRender'
import Head from 'next/head'
import { OverlayProvider } from '../modules/Fullscreen'
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import '@fortawesome/fontawesome-free/css/all.min.css'
import CookieConsent from 'react-cookie-consent'
import * as gtag from "../js/gtag";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  
  return <>
    <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
    <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}');
        `}
      </Script>
    <SessionProvider session={session}>
        <EmojiRender>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta itemProp="image" content="/favicon.ico" />
                <link itemProp="image" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
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