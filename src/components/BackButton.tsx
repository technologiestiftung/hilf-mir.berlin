import classNames from '@lib/classNames'
import { useTexts } from '@lib/TextsContext'
import Link, { LinkProps } from 'next/link'
import { DOMAttributes, FC } from 'react'
import { Arrow } from './icons/Arrow'

type BackButtonPropsType =
  | {
      onClick: DOMAttributes<HTMLButtonElement>['onClick']
    }
  | {
      href: LinkProps['href']
    }

export const BackButton: FC<BackButtonPropsType> = (props) => {
  const texts = useTexts()
  const content = (
    <>
      <Arrow orientation="left" className="scale-75" />
      <span className="text-lg font-bold">{texts.backText}</span>
    </>
  )
  const commonProps = {
    className: classNames(
      `flex gap-2 p-3 items-center`,
      `transition-colors hover:text-primary`,
      `focus:outline-none focus:ring-2 focus:ring-primary`,
      `focus:ring-offset-2 focus:ring-offset-white`
    ),
    'aria-label': texts.backText,
  }
  const isLink = 'href' in props && typeof props.href !== 'undefined'
  const isButton = 'onClick' in props && typeof props.onClick !== 'undefined'
  return (
    <div className="sticky top-0 z-20 p-2 bg-white">
      {isLink && !isButton && (
        <Link {...commonProps} {...props} href={props.href || ''}>
          {content}
        </Link>
      )}
      {isButton && !isLink && (
        <button onClick={props.onClick} {...commonProps}>
          {content}
        </button>
      )}
    </div>
  )
}
