import { useTexts } from '@lib/TextsContext'
import Image from 'next/image'
import { FC } from 'react'
import introImage from '../images/intro-header.png'
import { Phone } from '@components/icons/Phone'
import { useRouter } from 'next/router'
import classNames from '@lib/classNames'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from './LegalFooter'
import { Footer } from './Footer'
import { Button } from './Button'
import { Arrow } from './icons/Arrow'

export const WelcomeScreen: FC<{
  onShowOffers: () => void
}> = ({ onShowOffers }) => {
  const texts = useTexts()
  const { push } = useRouter()
  const isMobile = useIsMobile()
  return (
    <div
      className={classNames(
        isMobile &&
          `w-screen float-left overflow-y-auto h-full overflow-x-hidden`
      )}
    >
      <div>
        <div className="h-screen lg:h-auto flex flex-col justify-between">
          <div>
            <div>
              <section className="w-full h-32 md:h-[202px] relative mb-6">
                <Image src={introImage} layout="fill" objectFit="cover" />
              </section>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-x-16 items-end p-5 pt-6 md:px-8 md:pt-12 md:mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl">
                  {texts.homeWelcomeTitle}
                </h1>
                <p
                  className="mt-4 text-lg leading-snug max-w-prose"
                  dangerouslySetInnerHTML={{ __html: texts.homeWelcomeText }}
                />
              </div>
              {!isMobile && (
                <Button
                  tag="a"
                  size="large"
                  className={classNames('font-normal', 'group')}
                  icon={<Phone className={classNames('text-purple-500')} />}
                  href="/sofortige-hilfe"
                >
                  {texts.directHelpButtonText}
                </Button>
              )}
            </div>
          </div>

          {isMobile && (
            <div className="flex flex-col p-5 pt-8 pb-20 gap-2">
              <Button
                onClick={onShowOffers}
                scheme="primary"
                size="large"
                className={classNames('group')}
                icon={
                  <Arrow
                    className={classNames(
                      'transition-transform group-hover:translate-x-0.5 group-disabled:group-hover:translate-x-0'
                    )}
                  />
                }
              >
                {texts.findOffersButtonText}
              </Button>
              <Button
                size="large"
                className="group"
                icon={<Phone className={classNames('text-purple-500')} />}
                onClick={() => void push(`/sofortige-hilfe`)}
              >
                {texts.directHelpButtonText}
              </Button>
              <a
                href={texts.moreOffersKVBLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(
                  `underline transition-colors hover:text-primary pt-3`,
                  `focus:outline-none focus:ring-2 focus:ring-primary`,
                  `focus:ring-offset-2 focus:ring-offset-white`
                )}
              >
                {texts.moreOffersKVBLinkText}
              </a>
            </div>
          )}
        </div>

        {isMobile && (
          <>
            <Footer />
            <LegalFooter />
          </>
        )}
      </div>
    </div>
  )
}
