import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
const tsbLogo = '/images/tsb_logo.svg'
const cityLabLogo = '/images/citylab_logo.svg'
const senatskanzleiLogo = '/images/senatskanzlei_logo.svg'
import classNames from '@lib/classNames'

export const Footer: FC = () => {
  const texts = useTexts()
  return (
    <>
      <footer className={classNames(`border-t border-gray-20`)}>
        <section
          className={classNames(
            'flex flex-wrap gap-x-6 gap-y-7 justify-between',
            'px-5 md:px-8 py-10 md:py-12',
            `md:container md:max-w-7xl md:mx-auto md:px-8`
          )}
        >
          <div className="flex gap-x-8 md:gap-x-12">
            <div className="flex flex-col gap-y-3">
              <h4 className="text-sm">{texts.footerProjectOwnerLabel}</h4>
              <a
                href={texts.footerTSBLogoLink}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(
                  `transition-opacity hover:opacity-50`,
                  `focus:outline-none focus:ring-2 focus:ring-primary`,
                  `focus:ring-offset-2 focus:ring-offset-white`
                )}
              >
                <img
                  src={tsbLogo}
                  alt={texts.footerTSBLogoAltText}
                  className="w-28 md:w-36"
                />
              </a>
            </div>
            <div className="flex flex-col gap-y-3">
              <h4 className="text-sm">{texts.footerProjectExecutionerLabel}</h4>
              <a
                href={texts.footerCityLABLogoLink}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(
                  `transition-opacity hover:opacity-50`,
                  `focus:outline-none focus:ring-2 focus:ring-primary`,
                  `focus:ring-offset-2 focus:ring-offset-white`
                )}
              >
                <img
                  src={cityLabLogo}
                  alt={texts.footerCityLABLogoAltText}
                  className="w-32 md:w-44"
                />
              </a>
            </div>
            <div className="flex flex-col gap-y-3">
              <h4 className="text-sm">{texts.footerProjectSponsorLabel}</h4>
              <a
                href={texts.footerSentatskanzleiLogoLink}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(
                  `transition-opacity hover:opacity-50`,
                  `focus:outline-none focus:ring-2 focus:ring-primary`,
                  `focus:ring-offset-2 focus:ring-offset-white`
                )}
              >
                <img
                  src={senatskanzleiLogo}
                  alt={texts.footerSentatskanzleiLogoAltText}
                  className="w-24 md:w-28"
                />
              </a>
            </div>
          </div>
          <p className="max-w-xl lg:max-w-[325px] text-sm lg:translate-y-7">
            {texts.footerCooperationLabel}
          </p>
        </section>
      </footer>
    </>
  )
}
