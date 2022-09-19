import '../styles/globals.css'
import { TextsProvider } from '@lib/TextsContext'
import { TextsMapType } from '@lib/TextsContext'
import { NextComponentType, NextPageContext } from 'next'

interface PagePropsType {
  texts: TextsMapType
}

interface AppPropsType {
  Component: NextComponentType<NextPageContext, unknown, PagePropsType>
  pageProps: PagePropsType
}

const App = ({ Component, pageProps }: AppPropsType): JSX.Element => {
  return (
    <TextsProvider value={pageProps.texts}>
      <Component {...pageProps} />
    </TextsProvider>
  )
}

export default App
