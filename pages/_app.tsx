import '../styles/globals.css'
import { TextsProvider } from '@lib/TextsContext'
import { TextsMapType } from '@lib/TextsContext'
import { AppProps } from 'next/app'
import { Page } from '@common/types/nextPage'
import Head from 'next/head'

interface PagePropsType {
  texts: TextsMapType
}
interface AppPropsType extends AppProps {
  Component: Page
  pageProps: PagePropsType
}

const App = ({ Component, pageProps }: AppPropsType): JSX.Element => {
  const getLayout = Component.getLayout ?? ((page) => page)
  const Layout = Component.layout ?? (({ children }) => <>{children}</>)
  return (
    <TextsProvider value={pageProps.texts}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e40422" />
        <meta name="msapplication-TileColor" content="#e40422" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Layout {...pageProps}>{getLayout(<Component {...pageProps} />)}</Layout>
    </TextsProvider>
  )
}

export default App
