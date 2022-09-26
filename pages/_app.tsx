import '../styles/globals.css'
import { TextsProvider } from '@lib/TextsContext'
import { TextsMapType } from '@lib/TextsContext'
import { AppProps } from 'next/app'
import { Page } from '@common/types/nextPage'
import { Fragment } from 'react'

interface PagePropsType {
  texts: TextsMapType
}
interface AppPropsType extends AppProps {
  Component: Page
  pageProps: PagePropsType
}

const App = ({ Component, pageProps }: AppPropsType): JSX.Element => {
  const getLayout = Component.getLayout ?? ((page) => page)
  const Layout = Component.layout ?? Fragment
  return (
    <TextsProvider value={pageProps.texts}>
      <Layout {...pageProps}>{getLayout(<Component {...pageProps} />)}</Layout>
    </TextsProvider>
  )
}

export default App
