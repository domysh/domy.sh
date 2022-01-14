import '../styles/index.scss'
import { EmojiRender } from '../modules/utils'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return <>
    <SessionProvider session={session}>
      <EmojiRender>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
        </Head>
        <Component {...pageProps} />
      </EmojiRender>
    </SessionProvider>
  </>
}

export default MyApp
