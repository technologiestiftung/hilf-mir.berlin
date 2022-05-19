import '../styles/globals.css'
import type { AppProps } from 'next/app'

// We ignore this because that line is provided by Next and untouched so far:
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default App
