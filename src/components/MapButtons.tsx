import classNames from '@lib/classNames'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { IconButtonLink } from './IconButton'
import { Info } from './icons/Info'
import { Phone } from './icons/Phone'

export const MapButtons: FC = () => {
  const texts = useTexts()
  return (
    <div
      className={classNames(
        `fixed flex flex-col z-10 focus-within:z-20`,
        `top-20 lg:left-sidebarW ml-4`,
        `shadow-md shadow-black/5`
      )}
    >
      <IconButtonLink
        pathName="/sofortige-hilfe"
        className="flex text-red border-b-0 focus:border-b rounded-b-none focus:rounded-b"
        aria-label={texts.directHelpButtonText}
      >
        <Phone />
      </IconButtonLink>
      <IconButtonLink
        pathName="/info"
        className="flex rounded-t-none focus:rounded-t"
        aria-label={texts.footerInfoPageLinkText}
      >
        <Info />
      </IconButtonLink>
    </div>
  )
}
