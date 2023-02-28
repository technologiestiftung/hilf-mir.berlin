import { FC, Fragment, ReactNode } from 'react'
import { Listbox as HeadlessListbox, Transition } from '@headlessui/react'
import { ChevronUpDown as ChevronUpDownIcon } from './icons/ChevronUpDown'
import { Check } from './icons/Check'

interface ListboxOptionType {
  label: string | ReactNode
  value: number
}

interface ListboxType {
  label: string
  options: ListboxOptionType[]
  activeOption: number | null
  onChange?: (selectedValue: number | null) => void
  nullSelectionLabel?: string
  className?: string
}

export const Listbox: FC<ListboxType> = ({
  label,
  options,
  activeOption,
  onChange = () => undefined,
  nullSelectionLabel = 'Keine Präferenz',
  className = '',
}) => {
  const handleChange = (selectedOption: number): void =>
    onChange(selectedOption)

  const mergedOptions = [{ label: nullSelectionLabel, value: null }, ...options]

  return (
    <div className={className}>
      <HeadlessListbox value={activeOption} onChange={handleChange}>
        <HeadlessListbox.Label className="font-bold text-lg w-full flex justify-between">
          {label}
        </HeadlessListbox.Label>
        <div className="relative mt-2">
          <HeadlessListbox.Button className="text-lg relative w-full rounded bg-white py-1 pl-3 pr-10 text-left border border-gray-20 focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer">
            <span className="block truncate">
              {mergedOptions.find((option) => option.value === activeOption)
                ?.label || nullSelectionLabel}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="w-4 h-4 text-gray-40" />
            </span>
          </HeadlessListbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessListbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 shadow-lg ring-1 ring-purple-500 ring-opacity-5 focus:outline-none">
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
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
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
