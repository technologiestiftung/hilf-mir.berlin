import classNames from '@lib/classNames'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { IconButton } from './IconButton'
import { Info } from './icons/Info'
import { Phone } from './icons/Phone'

export const MapButtons: FC = () => {
  const texts = useTexts()
  return (
    <div
      className={classNames(
        `fixed flex flex-col z-10 focus-within:z-20`,
        `top-20 lg:left-sidebarW ml-4`
      )}
    >
      <IconButton
        pathName="/sofortige-hilfe"
        className="flex text-red border-b-0 focus:border-b"
        aria-label={texts.directHelpButtonText}
      >
        <Phone />
      </IconButton>
      <IconButton
        pathName="/info"
        className="flex"
        aria-label={texts.footerInfoPageLinkText}
      >
        <Info />
      </IconButton>
    </div>
  )
}
