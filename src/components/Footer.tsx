import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import tsbLogo from '../images/logos/tsb-logo.svg'
import cityLabLogo from '../images/logos/citylab-logo.svg'
import senWGPGLogo from '../images/logos/senWGPG-logo.svg'
import senatskanzleiLogo from '../images/logos/senatskanzleiLogo-logo.svg'
import Link from 'next/link'
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
        <section className="flex flex-wrap gap-x-8 md:gap-x-16 gap-y-5">
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerProjectOwnerLabel}</h4>
            <img {...tsbLogo} alt={texts.footerTSBLogoAltText} />
          </div>
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerProjectExecutionerLabel}</h4>
            <img {...cityLabLogo} alt={texts.footerCityLABLogoAltText} />
          </div>
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerCooperationLabel}</h4>
            <img {...senWGPGLogo} alt={texts.footerSenWGPGLogoAltText} />
          </div>
          <div className="inline-flex flex-col gap-2">
            <h4>{texts.footerProjectSponsorLabel}</h4>
            <img
              {...senatskanzleiLogo}
              alt={texts.footerSentatskanzleiLogoAltText}
            />
          </div>
        </section>
        <section className="flex gap-8 pt-8">
          <Link href="/info">
            <a className="underline transition-colors hover:text-red">
              {texts.footerInfoPageLinkText}
            </a>
          </Link>
          <a
            className="underline transition-colors hover:text-red"
            href={texts.footerImprintLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {texts.footerImprintLinkText}
          </a>
          <a
            className="underline transition-colors hover:text-red"
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
