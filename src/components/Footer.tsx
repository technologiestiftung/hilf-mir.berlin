import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import tsbLogo from '../images/logos/tsb-logo.svg'
import cityLabLogo from '../images/logos/citylab-logo.svg'
import senWGPGLogo from '../images/logos/senWGPG-logo.svg'
import senatskanzleiLogo from '../images/logos/senatskanzleiLogo-logo.svg'
import classNames from '@lib/classNames'

export const Footer: FC = () => {
  const texts = useTexts()
  return (
    <>
      <footer
        className={classNames(
          `p-5 md:p-8 pt-10 md:pt-12 border-t border-gray-20`
        )}
      >
        <section
          className={classNames(
            `flex flex-wrap gap-x-8 md:gap-x-16 gap-y-5`,
            `md:container md:max-w-7xl md:mx-auto md:px-8`
          )}
        >
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerProjectOwnerLabel}</h4>
            <a
              href={texts.footerTSBLogoLink}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                `transition-opacity hover:opacity-50`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              <img {...tsbLogo} alt={texts.footerTSBLogoAltText} />
            </a>
          </div>
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerProjectExecutionerLabel}</h4>
            <a
              href={texts.footerCityLABLogoLink}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                `transition-opacity hover:opacity-50`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              <img {...cityLabLogo} alt={texts.footerCityLABLogoAltText} />
            </a>
          </div>
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerCooperationLabel}</h4>
            <a
              href={texts.footerSenWGPGLogoLink}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                `transition-opacity hover:opacity-50`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              <img {...senWGPGLogo} alt={texts.footerSenWGPGLogoAltText} />
            </a>
          </div>
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerProjectSponsorLabel}</h4>
            <a
              href={texts.footerSentatskanzleiLogoLink}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                `transition-opacity hover:opacity-50`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              <img
                {...senatskanzleiLogo}
                alt={texts.footerSentatskanzleiLogoAltText}
              />
            </a>
          </div>
        </section>
      </footer>
    </>
  )
}
