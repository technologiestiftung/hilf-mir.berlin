import classNames from '@lib/classNames'
import Link from 'next/link'
import { ParsedUrlQueryInput } from 'querystring'
import { FC, ReactNode } from 'react'

interface ButtonType {
  tag?: 'button' | 'a'
  scheme?: 'primary' | 'secondary' | 'link'
  size?: 'large' | 'medium' | 'small' | 'extrasmall'
  href?: string
  query?: string | ParsedUrlQueryInput | null
  onClick?: () => void
  disabled?: boolean
  icon?: ReactNode
  tooltip?: ReactNode
  className?: string
}

const getSizeClasses = (size: ButtonType['size']): string => {
  switch (size) {
    case 'large':
      return 'text-2xl py-3 px-5 rounded gap-x-5'
    case 'small':
      return 'text-base py-2 px-3 rounded gap-x-2'
    case 'extrasmall':
      return 'text-sm py-1 px-2 rounded gap-x-2'
    // case 'secondary':
    default:
      return 'text-lg py-2 px-4 rounded gap-x-3'
  }
}

const getSchemeClasses = (scheme: ButtonType['scheme']): string => {
  switch (scheme) {
    case 'primary':
      return 'bg-purple-500 hover:bg-purple-400 text-white transition-colors'
    // case 'secondary':
    default:
      return 'bg-white hover:bg-gray-10 text-gray-80 border border-gray-20 transition-colors'
  }
}

export const Button: FC<ButtonType> = ({
  tag = 'button',
  scheme = 'secondary',
  size = 'medium',
  href,
  query,
  onClick = () => undefined,
  className: additionalClassNames = '',
  disabled = false,
  icon,
  tooltip,
  children,
}) => {
  const SIZE_CLASSES = getSizeClasses(size)
  const SCHEME_CLASSES = getSchemeClasses(scheme)
  const LAYOUT_CLASSES = classNames(
    'flex items-center',
    icon ? 'justify-between' : 'justify-center'
  )

  const SHARED_CLASSES = classNames(
    'text-center',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    SIZE_CLASSES,
    SCHEME_CLASSES,
    LAYOUT_CLASSES,
    additionalClassNames
  )

  const isButton = tag === 'button' && typeof onClick !== 'undefined'

  const isExternalLink =
    tag === 'a' && !(href?.startsWith('/') || href?.startsWith('#'))

  const isInternalLink = !isExternalLink

  if (isExternalLink) {
    if (tooltip)
      console.error('Tooltip is currently not supported for <a> tags.')

    return (
      <a href={href} className={SHARED_CLASSES}>
        {children}
        {icon}
      </a>
    )
  }

  if (isInternalLink && !isButton) {
    if (tooltip)
      console.error('Tooltip is currently not supported for <a> tags.')

    return (
      <Link
        href={{
          pathname: href,
          query: query,
        }}
      >
        <a className={SHARED_CLASSES}>
          {children}
          {icon}
        </a>
      </Link>
    )
  } else {
    return (
      <button
        onClick={() => onClick()}
        className={classNames(
          SHARED_CLASSES,
          'relative',
          'disabled:bg-gray-20 disabled:text-gray-60 disabled:cursor-not-allowed'
        )}
        disabled={disabled}
      >
        {children}
        {icon}
        {tooltip && (
          <span
            className={classNames(
              `absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full`,
              `px-2 py-1 text-white bg-black opacity-0 pointer-events-none`,
              `group-hover:opacity-100 transition-colors text-sm leading-tight`
            )}
          >
            {tooltip}
          </span>
        )}
      </button>
    )
  }
}