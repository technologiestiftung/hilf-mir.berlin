import classNames from '@lib/classNames'
import React from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  labelText?: string
}

let idCounter = 0

function Checkbox({
  id = `Checkbox-${idCounter++}`,
  labelText,
  className,
  ...props
}: CheckboxProps): JSX.Element {
  const checkbox = (
    <input
      id={id}
      type="checkbox"
      checked
      className={classNames(
        className,
        `w-5 h-5 accent-primary border-gray-40`,
        `focus:outline-none focus:ring-2 focus:ring-primary`,
        `focus:ring-offset-2 focus:ring-offset-white focus:rounded-md`
      )}
      {...props}
    />
  )
  if (!labelText) return checkbox
  return (
    <label className="flex gap-2 items-center mb-2">
      {checkbox}
      {labelText}
    </label>
  )
}

export default Checkbox
