import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import Link from 'next/link'
import classNames from '@lib/classNames'
import { useRouter } from 'next/router'

export const LegalFooter: FC = () => {
  const texts = useTexts()
  const { query } = useRouter()

  return (
    <>
      <footer className={classNames(`border-t border-gray-20`)}>
        <div
          className={classNames(
            'md:container mx-auto md:max-w-7xl',
            'px-5 py-10 lg:px-8',
            'flex gap-x-4 gap-y-3 flex-wrap justify-between'
          )}
        >
          <p className="text-sm px-2 py-0.5 rounded text-gray-60 border border-gray-10 bg-gray-10 bg-opacity-25">
            <b className="text-gray-80">{texts.disclaimerPrefix}</b>{' '}
            {texts.disclaimerContent}
          </p>
          <section
            className={classNames(
              `flex gap-x-6 gap-y-1 flex-wrap text-gray-40`,
              `justify-center sm:justify-start`
            )}
          >
            <Link
              href={{
                pathname: '/map',
                query,
              }}
              className={classNames(
                `underline transition-colors hover:text-primary`,
                `focus:outline-none focus:ring-2 focus:ring-primary`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              {texts.footerMapPageLinkText}
            </Link>
            <Link
              href={{
                pathname: '/info',
                query,
              }}
              className={classNames(
                `underline transition-colors hover:text-primary`,
                `focus:outline-none focus:ring-2 focus:ring-primary`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              {texts.footerInfoPageLinkText}
            </Link>
            <a
              className={classNames(
                `underline transition-colors hover:text-primary`,
                `focus:outline-none focus:ring-2 focus:ring-primary`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
              href={texts.footerImprintLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {texts.footerImprintLinkText}
            </a>
            <a
              className={classNames(
                `underline transition-colors hover:text-primary`,
                `focus:outline-none focus:ring-2 focus:ring-primary`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
              href={texts.footerPrivacyLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {texts.footerPrivacyLinkText}
            </a>
          </section>
        </div>
      </footer>
    </>
  )
}
