import classNames from '@lib/classNames'
import { FC } from 'react'

export const TextLink: FC<{ href: string; className?: string }> = ({
  href,
  children,
  className = '',
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={classNames(
      className,
      `cursor-pointer`,
      `underline transition-colors hover:text-primary`,
      `focus:outline-none focus:ring-2 focus:ring-primary`,
      `focus:ring-offset-2 focus:ring-offset-white`
    )}
  >
    {children}
  </a>
)
