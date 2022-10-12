import classNames from '@lib/classNames'
import { useUrlState } from '@lib/UrlStateContext'
import Link from 'next/link'
import { FC } from 'react'

interface IconButtonPropsType {
  className?: string
  'aria-label'?: string
  pathName: string
}

export const IconButton: FC<IconButtonPropsType> = ({
  className = '',
  pathName,
  children,
  'aria-label': ariaLabel,
}) => {
  const [urlState] = useUrlState()
  return (
    <Link href={{ pathname: pathName, query: { ...urlState } }}>
      <a
        className={classNames(
          className,
          `h-12 w-12 border border-black bg-white`,
          `justify-center items-center shrink-0`,
          `hover:bg-red hover:text-white transition-colors`,
          `focus:outline-none focus:ring-2 focus:ring-red`,
          `focus:ring-offset-2 focus:ring-offset-white focus:z-30`
        )}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    </Link>
  )
}
