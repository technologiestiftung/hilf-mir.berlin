import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { LegalFooter } from '@components/LegalFooter'
import { Page } from '@common/types/nextPage'
import classNames from '@lib/classNames'
import { loadData } from '@lib/loadData'
import { FaqList } from '@components/FaqList'
import { BackButton } from '@components/BackButton'
import { useRouter } from 'next/router'
import { About } from '@components/About'
import { Footer } from '@components/Footer'

export const getStaticProps: GetStaticProps = async () => {
  const { texts } = await loadData()
  return {
    props: {
      texts,
    },
  }
}

const Info: Page = () => {
  const { query } = useRouter()

  const { back, ...restQuery } = query
  return (
    <div>
      <Head>
        <title>Info - HILF-MIR Berlin</title>
      </Head>
      <div className="min-h-screen mx-auto max-w-xl">
        <BackButton
          href={{
            pathname: typeof back === 'string' ? back : '/',
            query: restQuery,
          }}
        />
        <div
          className={classNames('p-5 md:p-8 flex flex-col gap-8 md:pt-[5vmin]')}
        >
          <h1>Über HILF-MIR Berlin</h1>
          <About />
          <div>
            <h2 className="text-3xl font-bold">FAQ</h2>
            <FaqList />
          </div>
        </div>
      </div>
      <Footer />
      <LegalFooter />
    </div>
  )
}

export default Info
