import { GristLabelType } from '@common/types/gristData'
import classNames from '@lib/classNames'
import { FC, Fragment } from 'react'
import icons from './icons/tagIcons'

export const Label: FC<{
  label: GristLabelType
  isActive: boolean
  className?: string
  onClick?: (id: number) => void
}> = ({ label, onClick = () => undefined, isActive, className = '' }) => {
  const Icon = icons[label.fields.icon as keyof typeof icons] || Fragment
  return (
    <li key={label.id} className="inline-block">
      <button
        onClick={() => onClick(label.id)}
        className={classNames(
          className,
          `py-1.5 border text-lg flex gap-2 text-left leading-6 pl-2 pr-3 group`,
          isActive && `bg-red border-red text-white`,
          !isActive && ` border-gray-20`,
          `focus:outline-none focus:ring-2 focus:ring-red`,
          `focus:ring-offset-2 focus:ring-offset-white`
        )}
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
