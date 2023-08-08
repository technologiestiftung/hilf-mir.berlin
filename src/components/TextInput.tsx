import classNames from '@lib/classNames'
import React from 'react'

type TextInputPropsType = React.InputHTMLAttributes<HTMLInputElement> & {
  labelText?: string
  id?: string
}

let idCounter = 0

function TextInput({
  className,
  id = `text-input-${idCounter++}`,
  labelText,
  ...props
}: TextInputPropsType): JSX.Element {
  return (
    <>
      {labelText && (
        <label htmlFor={id} id={`${id}-label`}>
          {labelText}
        </label>
      )}
      <input
        id={id}
        className={classNames(
          className,
          `w-full border rounded-md px-4 py-2 mt-2`,
          `border-gray-20 hover:border-gray-40`,
          'transition-colors motion-reduce:transition-none',
          `focus:outline-none focus:ring-2 focus:ring-primary`,
          `focus:ring-offset-2 focus:ring-offset-white`
        )}
        type="text"
        {...props}
      />
    </>
  )
}

export default TextInput
