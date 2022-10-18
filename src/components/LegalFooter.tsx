import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import Link from 'next/link'
import classNames from '@lib/classNames'

export const LegalFooter: FC = () => {
  const texts = useTexts()
  return (
    <>
      <footer className={classNames(`py-5 md:py-8 border-t border-gray-20`)}>
        <section
          className={classNames(
            `flex gap-x-6 gap-y-4 flex-wrap text-gray-40`,
            `md:container md:max-w-7xl md:mx-auto px-5 md:px-8`
          )}
        >
          <Link href="/info">
            <a
              className={classNames(
                `underline transition-colors hover:text-red`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              {texts.footerInfoPageLinkText}
            </a>
          </Link>
          <a
            className={classNames(
              `underline transition-colors hover:text-red`,
              `focus:outline-none focus:ring-2 focus:ring-red`,
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
              `underline transition-colors hover:text-red`,
              `focus:outline-none focus:ring-2 focus:ring-red`,
              `focus:ring-offset-2 focus:ring-offset-white`
            )}
            href={texts.footerPrivacyLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {texts.footerPrivacyLinkText}
          </a>
        </section>
      </footer>
    </>
  )
}
