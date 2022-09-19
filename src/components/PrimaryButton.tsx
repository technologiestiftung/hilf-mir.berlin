import classNames from '@lib/classNames'
import { FC } from 'react'
import { Arrow } from './icons/Arrow'

export const PrimaryButton: FC = ({ children }) => (
  <button
    className={classNames(
      `border border-black`,
      `font-medium text-left text-2xl`,
      `grid grid-cols-[1fr,auto]`,
      `hover:bg-red hover:text-white transition-colors`
    )}
  >
    <span className="inline-block px-5 py-3">{children}</span>
    <span
      className={classNames(
        `bg-red w-14 h-14 border-l border-black`,
        `inline-flex items-center justify-center text-white`
      )}
    >
      <Arrow />
    </span>
  </button>
)