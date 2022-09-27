import classNames from '@lib/classNames'
import { useTexts } from '@lib/TextsContext'
import Link, { LinkProps } from 'next/link'
import { DOMAttributes, FC } from 'react'
import { Arrow } from './icons/Arrow'

type BackButtonPropsType =
  | {
      onClick?: DOMAttributes<HTMLButtonElement>['onClick']
    }
  | Partial<LinkProps>

export const BackButton: FC<BackButtonPropsType> = (props) => {
  const texts = useTexts()
  const content = (
    <>
      <Arrow orientation="left" className="scale-75" />
      <span className="font-bold text-lg">{texts.backText}</span>
    </>
  )
  const commonProps = {
    className: classNames(
      `flex gap-2 p-3 items-center`,
      `transition-colors hover:text-red`,
      `focus:outline-none focus:ring-2 focus:ring-red`,
      `focus:ring-offset-2 focus:ring-offset-white`
    ),
    'aria-label': texts.backText,
  }
  return (
    <div className="p-2 sticky bg-white top-0 z-10">
      {'href' in props && typeof props.href !== undefined && (
        <Link {...props} href={props.href || ''}>
          <a {...commonProps}>{content}</a>
        </Link>
      )}
      {'onClick' in props && typeof props.onClick !== undefined && (
        <button onClick={props.onClick} {...commonProps}>
          {content}
        </button>
      )}
    </div>
  )
}
