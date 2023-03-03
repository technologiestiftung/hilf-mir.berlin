import classNames from '@lib/classNames'
import { FC } from 'react'

interface ButtonType {
  tag?: 'button' | 'a'
  scheme?: 'primary' | 'secondary' | 'link'
  size?: 'large' | 'medium' | 'small' | 'extrasmall'
  href?: string
  onClick?: () => void
  className?: string
}

const getSizeClasses = (size: ButtonType['size']): string => {
  switch (size) {
    case 'large':
      return 'text-2xl py-3 px-5 rounded-lg'
    case 'small':
      return 'text-base py-2 px-3 rounded'
    case 'extrasmall':
      return 'text-sm py-1 px-2 rounded'
    // case 'secondary':
    default:
      return 'text-lg py-2 px-4 rounded'
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
  onClick,
  className: additionalClassNames = '',
  children,
}) => {
  const SIZE_CLASSES = getSizeClasses(size)
  const SCHEME_CLASSES = getSchemeClasses(scheme)

  const CLASSES = classNames(
    'text-center flex justify-center',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    SIZE_CLASSES,
    SCHEME_CLASSES,
    additionalClassNames
  )

  if (tag === 'a') {
    return (
      <a href={href} className={CLASSES}>
        {children}
      </a>
    )
  } else {
    return (
      <button
        onClick={() => onClick && onClick()}
        className={classNames(
          CLASSES,
          'disabled:bg-gray-20 disabled:text-gray-60 disabled:cursor-not-allowed'
        )}
      >
        {children}
      </button>
    )
  }
}
