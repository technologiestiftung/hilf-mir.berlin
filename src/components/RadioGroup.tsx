import { FC } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'

const RadioGroupOption: FC<{ value: string; label: string }> = ({
  value,
  label,
}) => {
  return (
    <>
      <HeadlessRadioGroup.Option value={value}>
        {({ checked }) => (
          <span className={checked ? 'bg-blue-200' : ''}>{label}</span>
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
  onChange: () => void
}> = ({ label, options = PLANS, onChange = () => undefined }) => {
  return (
    <HeadlessRadioGroup value={options[0].value} onChange={onChange}>
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
