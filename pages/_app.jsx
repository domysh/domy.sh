import '../styles/index.scss'
import { EmojiRender } from '../modules/EmojiRender'
import Head from 'next/head'
import { OverlayProvider } from '../modules/Fullscreen'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { DefaultLayout } from '../modules/DefaultLayout'
import { Infos } from '../modules/Context/Infos'

import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-outfit',
});

function MyApp({ Component, pageProps }) {

  return <div className={`${outfit.variable} ${outfit.className}`}>
    <EmojiRender>
      <Head>
        <link rel="icon" type="image/png" sizes="196x196" href="/favicon-196.png" />
        <meta itemProp="image" content="/favicon-196.png" />
        <link itemProp="image" href="/favicon-196.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      {pageProps.infos ? (
        <Infos infos={pageProps.infos}>
          <OverlayProvider>
            <DefaultLayout>
              <Component {...pageProps} />
            </DefaultLayout>
          </OverlayProvider>
        </Infos>
      ) : (
        <OverlayProvider>
          <Component {...pageProps} />
        </OverlayProvider>
      )}
    </EmojiRender>
  </div>
} export default MyApp