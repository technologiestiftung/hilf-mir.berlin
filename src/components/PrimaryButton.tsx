import classNames from '@lib/classNames'
import { FC, HTMLAttributes } from 'react'
import { Arrow } from './icons/Arrow'

interface ButtonPropsType extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  tooltip?: string
}

export const PrimaryButton: FC<ButtonPropsType> = ({
  children,
  className,
  onClick = () => undefined,
  disabled = false,
  tooltip,
}) => (
  <button
    onClick={() => !disabled && onClick()}
    className={classNames(
      className,
      `border leading-7 transition-colors`,
      `font-medium text-left text-2xl relative`,
      `grid grid-cols-[1fr,auto] w-full group`,
      !disabled && [
        `border-black hover:bg-red hover:text-white `,
        `focus:outline-none focus:ring-2 focus:ring-red`,
        `focus:ring-offset-2 focus:ring-offset-white`,
      ],
      disabled && [
        `border-gray-20 text-gray-40 bg-gray-10`,
        `cursor-not-allowed`,
      ]
    )}
  >
    <span className="inline-block px-5 py-3">{children}</span>
    <span
      className={classNames(
        `w-14 h-14 border-l`,
        `inline-flex items-center justify-center`,
        !disabled && [`bg-red border-black text-white`],
        disabled && [`bg-gray-10 border-gray-20 text-gray-40`]
      )}
    >
      <Arrow />
    </span>
    {tooltip && (
      <span
        className={classNames(
          `absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full`,
          `px-2 py-1 text-white bg-black/70 opacity-0 pointer-events-none`,
          `group-hover:opacity-100 transition-colors text-sm leading-tight`
        )}
      >
        {tooltip}
      </span>
    )}
  </button>
)
