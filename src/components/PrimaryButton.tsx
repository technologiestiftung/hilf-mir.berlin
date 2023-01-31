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
    onClick={(evt) => !disabled && onClick(evt)}
    className={classNames(
      className,
      `bg-primary text-white rounded leading-7 transition-colors`,
      `font-medium text-left text-2xl relative items-center`,
      `grid grid-cols-[1fr,auto] w-full group font-headline font-bold`,
      !disabled && [
        `hover:bg-white hover:text-primary border border-trasparent hover:border-primary`,
        `focus:outline-none focus:ring-2 focus:ring-primary`,
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
        `w-14 h-14`,
        `inline-flex items-center justify-center`
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
