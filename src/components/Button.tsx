import { useUrlState } from '@lib/UrlStateContext'
import classNames from '@lib/classNames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'querystring'
import { FC, ReactNode } from 'react'

interface ButtonType {
  tag?: 'button' | 'a'
  scheme?: 'primary' | 'secondary' | 'link'
  size?: 'large' | 'medium' | 'small' | 'extrasmall'
  href?: string
  query?: ParsedUrlQueryInput
  onClick?: () => void
  disabled?: boolean
  icon?: ReactNode
  tooltip?: ReactNode
  className?: string
}

const getSizeClasses = (size: ButtonType['size']): string => {
  switch (size) {
    case 'large':
      return 'text-xl xs:text-2xl py-3 px-5 rounded gap-x-5'
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
  query: additionalQuery = {},
  onClick = () => undefined,
  className: additionalClassNames = '',
  disabled = false,
  icon,
  tooltip,
  children,
}) => {
  const [urlState] = useUrlState()
  const { asPath } = useRouter()
  const query = { ...urlState, ...additionalQuery, back: asPath.split('?')[0] }
  const SIZE_CLASSES = getSizeClasses(size)
  const SCHEME_CLASSES = getSchemeClasses(scheme)
  const LAYOUT_CLASSES = classNames(
    'flex items-center',
    icon ? 'justify-between' : 'justify-center'
  )

  const SHARED_CLASSES = classNames(
    'text-center group relative',
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

  const tooltipEl = tooltip && (
    <span
      className={classNames(
        `absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-full`,
        `px-2 py-1 text-white bg-black opacity-0 pointer-events-none`,
        `group-hover:opacity-100 text-sm leading-tight text-left`,
        `transition-opacity motion-reduce:transition-none`
      )}
    >
      {tooltip}
    </span>
  )

  if (isExternalLink) {
    return (
      <a href={href} className={classNames(SHARED_CLASSES)}>
        {children}
        {icon}
        {tooltipEl}
      </a>
    )
  }

  if (isInternalLink && !isButton && !disabled) {
    return (
      <Link
        href={{
          pathname: href,
          query: query,
        }}
        className={classNames(SHARED_CLASSES)}
        onClick={onClick}
      >
        {children}
        {icon}
        {tooltipEl}
      </Link>
    )
  } else {
    return (
      <button
        onClick={() => onClick()}
        className={classNames(
          SHARED_CLASSES,
          disabled &&
            'disabled:bg-gray-20 disabled:text-gray-60 disabled:cursor-not-allowed'
        )}
        disabled={disabled}
      >
        {children}
        {icon}
        {tooltipEl}
      </button>
    )
  }
}
