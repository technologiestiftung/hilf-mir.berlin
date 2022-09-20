import classNames from '@lib/classNames'
import { FC, HTMLAttributes } from 'react'
import { Arrow } from './icons/Arrow'

export const PrimaryButton: FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  onClick = () => undefined,
}) => (
  <button
    onClick={onClick}
    className={classNames(
      className,
      `border border-black leading-7`,
      `font-medium text-left text-2xl`,
      `grid grid-cols-[1fr,auto] w-full`,
      `hover:bg-red hover:text-white transition-colors`,
      `focus:outline-none focus:ring-2 focus:ring-red`,
      `focus:ring-offset-2 focus:ring-offset-white`
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
