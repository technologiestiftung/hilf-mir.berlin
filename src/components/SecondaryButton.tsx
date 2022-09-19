import classNames from '@lib/classNames'
import { FC, ReactNode } from 'react'
import { Arrow } from './icons/Arrow'

export const SecondaryButton: FC<{
  icon?: ReactNode
}> = ({ children, icon = <Arrow /> }) => (
  <button
    className={classNames(
      `border border-black group`,
      `font-medium text-left text-2xl`,
      `grid grid-cols-[1fr,auto]`,
      `hover:bg-red hover:text-white transition-colors`
    )}
  >
    <span className="inline-block px-5 py-3">{children}</span>
    <span
      className={classNames(
        `w-14 h-14 inline-flex items-center`,
        `justify-center text-red group-hover:text-white`
      )}
    >
      {icon}
    </span>
  </button>
)
