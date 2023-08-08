import { FC, Fragment, ReactNode } from 'react'
import { Listbox as HeadlessListbox, Transition } from '@headlessui/react'
import { ChevronUpDown as ChevronUpDownIcon } from './icons/ChevronUpDown'
import { Check } from './icons/Check'
import classNames from '@lib/classNames'

interface ListboxOptionType {
  label: string | ReactNode
  value: number
}

interface ListboxType {
  label: string
  options: ListboxOptionType[]
  activeValue: number | null
  onChange?: (selectedValue: number | null) => void
  nullSelectionLabel?: string
  className?: string
}

export const Listbox: FC<ListboxType> = ({
  label,
  options,
  activeValue,
  onChange = () => undefined,
  nullSelectionLabel = 'Keine Präferenz',
  className = '',
}) => {
  const handleChange = (selectedOption: number): void =>
    onChange(selectedOption)

  const mergedOptions = [{ label: nullSelectionLabel, value: null }, ...options]
  const selectedOption = mergedOptions.find(
    (option) => option.value === activeValue
  )

  return (
    <div className={classNames(className, 'w-full')}>
      <HeadlessListbox value={activeValue} onChange={handleChange}>
        <HeadlessListbox.Label
          className={classNames('w-full flex justify-between', 'text-lg')}
        >
          {label}
        </HeadlessListbox.Label>
        <div className="relative mt-2 w-full">
          <HeadlessListbox.Button
            className={classNames(
              'relative w-full py-2 pl-3 cursor-pointer',
              'text-lg text-left',
              'border rounded',
              'grid grid-cols-[1fr,auto] gap-x-2',
              'transition-colors motion-reduce:transition-none',
              selectedOption?.value
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-white text-gray-80 border-gray-20 hover:border-gray-40',
              'focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
            )}
          >
            <span className="truncate">
              {selectedOption?.label || nullSelectionLabel}
            </span>
            <span
              className={classNames(
                'pr-2',
                'w-full h-full flex items-center',
                'pointer-events-none'
              )}
            >
              <ChevronUpDownIcon
                className={classNames(
                  'w-4 h-4',
                  selectedOption?.value ? 'text-white' : 'text-gray-40'
                )}
              />
            </span>
          </HeadlessListbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessListbox.Options
              className={classNames(
                'mt-1 py-1',
                'absolute max-h-60 w-full overflow-auto',
                'rounded bg-white',
                'shadow-lg ring-1 ring-purple-500 ring-opacity-5 focus:outline-none'
              )}
            >
              {mergedOptions.map((option, optionIdx) => (
                <HeadlessListbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative text-lg cursor-pointer select-none py-1 pl-10 pr-4 ${
                      active ? 'bg-purple-50 text-purple-700' : 'text-gray-80'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-bold' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : null}
                    </>
                  )}
                </HeadlessListbox.Option>
              ))}
            </HeadlessListbox.Options>
          </Transition>
        </div>
      </HeadlessListbox>
    </div>
  )
}
