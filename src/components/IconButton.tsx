import classNames from '@lib/classNames'
import { useUrlState } from '@lib/UrlStateContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface IconButtonCommonProps {
  className?: string
  'aria-label'?: string
  tabIndex?: number
}

interface IconButtonLinkPropsType extends IconButtonCommonProps {
  pathName: string
}

interface IconButtonPropsType extends IconButtonCommonProps {
  onClick: () => void
}

const commonClasses = [
  `h-12 w-12 border border-gray-20 bg-white rounded`,
  `justify-center items-center shrink-0`,
  `hover:bg-primary hover:text-white transition-colors`,
  `focus:outline-none focus:ring-2 focus:ring-primary`,
  `focus:ring-offset-2 focus:ring-offset-white focus:z-30`,
]

export const IconButton: FC<IconButtonPropsType> = ({
  className = '',
  onClick,
  children,
  'aria-label': ariaLabel,
  tabIndex = 1,
}) => {
  return (
    <button
      tabIndex={tabIndex}
      onClick={onClick}
      className={classNames(className, ...commonClasses)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export const IconButtonLink: FC<IconButtonLinkPropsType> = ({
  className = '',
  pathName,
  children,
  'aria-label': ariaLabel,
  tabIndex = 0,
}) => {
  const [urlState] = useUrlState()
  const { asPath } = useRouter()
  const query = { ...urlState, back: asPath.split('?')[0] }
  return (
    <Link
      href={{ pathname: pathName, query }}
      tabIndex={tabIndex}
      className={classNames(className, ...commonClasses)}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  )
}
