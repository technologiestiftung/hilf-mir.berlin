import { Html, Head, Main, NextScript } from 'next/document'

// We ignore this because that line is provided by Next and untouched so far:
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://unpkg.com/maplibre-gl@2.1.6/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
