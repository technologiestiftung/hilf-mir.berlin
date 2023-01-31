import { FC, useState } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'

const RadioGroupOption: FC<{ value: string; label: string }> = ({
  value,
  label,
}) => {
  return (
    <>
      <HeadlessRadioGroup.Option value={value}>
        {({ checked }) => (
          <span className={checked ? 'bg-blau text-white' : ''}>{label}</span>
        )}
      </HeadlessRadioGroup.Option>
    </>
  )
}

const PLANS: RadioGroupOptionType[] = [
  {
    value: 'startup',
    label: 'Startup',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
  },
  {
    value: 'hobby',
    label: 'Hobby',
  },
]

interface RadioGroupOptionType {
  label: string
  value: string
}

export const RadioGroup: FC<{
  label: string
  options: RadioGroupOptionType[]
  onChange?: () => void
}> = ({ label, options = PLANS, onChange = () => undefined }) => {
  const [activeOption, setActiveOption] = useState(options[0].value)

  const handleChange = (selectedValue: RadioGroupOptionType['value']): void => {
    setActiveOption(selectedValue)
    onChange && onChange()
  }

  return (
    <HeadlessRadioGroup value={activeOption} onChange={handleChange}>
      <HeadlessRadioGroup.Label>{label}</HeadlessRadioGroup.Label>
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
