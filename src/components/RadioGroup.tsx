import { FC, ReactNode, useState } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import classNames from '@lib/classNames'

export interface RadioGroupOptionType {
  label: string | ReactNode
  value: string
}

const RadioGroupOption: FC<RadioGroupOptionType> = ({ value, label }) => {
  return (
    <>
      <HeadlessRadioGroup.Option value={value}>
        {({ active, checked }) => (
          <span
            className={classNames(
              checked
                ? 'bg-red border-red text-white hover:bg-gray-60 focus:group-hover:bg-red hover:border-gray-60'
                : 'border-gray-20 hover:bg-gray-10',
              'py-1.5 pl-2 pr-3 border flex gap-2',
              'text-left text-lg leading-6',
              active &&
                `!bg-red !text-white outline-none ring-2 ring-red ring-offset-2 ring-offset-white`,
              'cursor-pointer'
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
  onChange?: () => void
  className?: string
}

export const RadioGroup: FC<RadioGroupType> = ({
  label,
  options,
  onChange = () => undefined,
  className = '',
}) => {
  const [activeOption, setActiveOption] = useState<
    RadioGroupOptionType['value'] | undefined
  >()

  const handleChange = (selectedValue: RadioGroupOptionType['value']): void => {
    setActiveOption(selectedValue)
    onChange && onChange()
  }

  return (
    <HeadlessRadioGroup
      value={activeOption}
      onChange={handleChange}
      className={classNames(className, 'flex gap-y-3 gap-x-2 flex-wrap mb-16')}
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
