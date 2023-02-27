import { FC, ReactNode } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import classNames from '@lib/classNames'

export interface RadioGroupOptionType {
  label: string | ReactNode
  value: string | number
}

const RadioGroupOption: FC<RadioGroupOptionType> = ({ value, label }) => {
  const GENERAL_CLASSES = classNames(
    'py-1.5 pl-2 pr-3 rounded',
    'flex gap-2',
    'text-left text-lg leading-6',
    'cursor-pointer'
  )

  const CHECKED_CLASSES = classNames(
    'bg-primary text-white',
    'focus:bg-primary hover:bg-purple-400'
  )

  const UNCHECKED_CLASSES = 'bg-purple-50 hover:bg-purple-200'

  const ACTIVE_CLASSES =
    'bg-primary hover:bg-purple-400 !text-white ring-2 ring-primary ring-offset-2'

  return (
    <>
      <HeadlessRadioGroup.Option
        value={value}
        className="focus-visible:outline-none"
      >
        {({ active, checked }) => (
          <span
            className={classNames(
              GENERAL_CLASSES,
              checked ? CHECKED_CLASSES : UNCHECKED_CLASSES,
              active && ACTIVE_CLASSES
            )}
          >
            {label}
          </span>
        )}
      </HeadlessRadioGroup.Option>
    </>
  )
}

export interface RadioGroupType {
  label: string
  options: RadioGroupOptionType[]
  activeValue: RadioGroupOptionType['value']
  onChange?: (selectedValue: string) => void
  className?: string
}

export const RadioGroup: FC<RadioGroupType> = ({
  label,
  options,
  activeValue,
  onChange = () => undefined,
  className = '',
}) => {
  const handleChange = (selectedValue: string): void => onChange(selectedValue)

  return (
    <HeadlessRadioGroup
      value={typeof activeValue === 'number' ? `${activeValue}` : activeValue}
      onChange={handleChange}
      className={classNames(className, 'flex gap-y-3 gap-x-2 flex-wrap')}
    >
      <HeadlessRadioGroup.Label className="font-bold text-lg w-full flex justify-between">
        {label}
      </HeadlessRadioGroup.Label>
      {options.map((option) => {
        return (
          <RadioGroupOption
            value={option.value}
            label={option.label}
            key={option.value}
          />
        )
      })}
    </HeadlessRadioGroup>
  )
}
