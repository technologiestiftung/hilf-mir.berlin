import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from '@components/LegalFooter'
import { Page } from '@common/types/nextPage'
import classNames from '@lib/classNames'
import { loadData } from '@lib/loadData'
import { FaqList } from '@components/FaqList'
import { BackButton } from '@components/BackButton'
import { useRouter } from 'next/router'
import { About } from '@components/About'

export const getStaticProps: GetStaticProps = async () => {
  const { texts } = await loadData()
  return {
    props: {
      texts,
    },
  }
}

const Info: Page = () => {
  const isMobile = useIsMobile()
  const { back } = useRouter()
  return (
    <div>
      <Head>
        <title>Info - HILF-MIR Berlin</title>
      </Head>
      <div className="min-h-screen mx-auto max-w-xl">
        <BackButton onClick={() => void back()} />
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
      {!isMobile && <LegalFooter />}
    </div>
  )
}

export default Info
