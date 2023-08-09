import { GristLabelType } from '@common/types/gristData'
import classNames from '@lib/classNames'
import { FC, Fragment } from 'react'
import icons from './icons/tagIcons'

export const Label: FC<{
  label: GristLabelType
  isActive: boolean
  className?: string
  onClick?: (id: number) => void
  isInteractive?: boolean
  disabled?: boolean
}> = ({
  label,
  onClick = () => undefined,
  isActive,
  className = '',
  isInteractive = true,
  disabled = false,
}) => {
  const Icon = icons[label.fields.icon as keyof typeof icons] || Fragment
  return (
    <li key={label.id} className="inline-block group">
      <button
        onClick={() => onClick(label.id)}
        className={classNames(
          className,
          `py-1.5 text-lg flex gap-2 text-left leading-6 pl-2 pr-3 rounded`,
          `transition motion-reduce:transition-none`,
          isActive &&
            isInteractive &&
            !disabled &&
            `bg-primary border-primary text-white hover:bg-purple-400`,
          (!isInteractive || disabled) && `ring-1 ring-inset ring-gray-20`,
          !isActive &&
            !disabled &&
            isInteractive &&
            'bg-purple-50 hover:bg-purple-200 text-purple-700',
          isInteractive &&
            !disabled && [
              `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`,
              `focus-visible:ring-offset-2 focus-visible:ring-offset-white`,
            ],
          !isInteractive && `cursor-default`
        )}
        disabled={!isInteractive || disabled}
      >
        {label.fields.icon && (
          <Icon
            className="w-6 h-6"
            aria-label={`Icon for "${label.fields.text}" label`}
          />
        )}
        <span>{label.fields.text}</span>
      </button>
    </li>
  )
}
