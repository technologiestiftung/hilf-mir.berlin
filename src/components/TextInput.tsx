import classNames from '@lib/classNames'
import React, { forwardRef } from 'react'

type TextInputPropsType = React.InputHTMLAttributes<HTMLInputElement> & {
  labelText?: string
  id?: string
}

let idCounter = 0

const InputText = forwardRef<HTMLInputElement, TextInputPropsType>(
  (
    { className, id = `text-input-${idCounter++}`, labelText, ...props },
    ref
  ) => (
    <>
      {labelText && (
        <label htmlFor={id} id={`${id}-label`}>
          {labelText}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={classNames(
          className,
          `w-full border rounded-md px-4 py-2 mt-2 mb-0`,
          `border-gray-20 hover:border-gray-40`,
          'transition-colors motion-reduce:transition-none',
          `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`,
          `focus-visible:ring-offset-2 focus-visible:ring-offset-white`,
          `focus-visible:rounded`
        )}
        type="text"
        {...props}
      />
    </>
  )
)
InputText.displayName = 'InputText'

export default InputText
