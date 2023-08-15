import { TextsMapType, useTexts } from '@lib/TextsContext'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TextInput from './TextInput'
import Checkbox from './Checkbox'
import classNames from '@lib/classNames'
import { Check } from './icons/Check'
import { Cross } from './icons/Cross'
import FacilityType from './FacilityType'
import {
  facilityTypeToKeyMap,
  getKeyByFacilityType,
} from '@lib/facilityTypeUtil'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'

type CategoriesType = Partial<{
  categorySelfHelp: boolean
  categoryAdvising: boolean
  categoryClinics: boolean
  categoryOnlineOffers: boolean
  categoryDistrictOfficeHelp: boolean
}>
interface StateType {
  text: string
  categories: CategoriesType
}

interface TextSearchProps extends StateType {
  onChange: (state: Partial<StateType>) => void
  disabled?: boolean
}

type CategoriesTextMapType = Record<keyof CategoriesType, string>

function TextSearch({
  text: initialText,
  categories,
  onChange,
  disabled = false,
}: TextSearchProps): JSX.Element {
  const texts = useTexts()
  const [text, setText] = useState(initialText || '')
  const [hasFocus, setHasFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const showSubmit = hasFocus && text !== initialText

  const setFocusTrue = useCallback(() => setHasFocus(true), [])
  const setFocusFalse = useCallback(() => setHasFocus(false), [])

  useEffect(() => {
    if (!inputRef.current) return
    const input = inputRef.current
    inputRef.current.addEventListener('focus', setFocusTrue)
    inputRef.current.addEventListener('blur', setFocusFalse)
    return () => {
      input.removeEventListener('focus', setFocusTrue)
      input.removeEventListener('blur', setFocusFalse)
    }
  }, [setFocusTrue, setFocusFalse])

  useEffect(() => {
    setText(initialText || '')
  }, [initialText])

  const checkboxes = useMemo(() => {
    const facilityTypeKeys = Object.keys(
      facilityTypeToKeyMap
    ) as MinimalRecordType['type'][]
    return facilityTypeKeys.map((type) => ({
      id: getKeyByFacilityType(type),
      type,
    }))
  }, [])

  return (
    <fieldset
      className="w-full @md:w-[324px]"
      aria-labelledby="textsearchlabel"
      disabled={disabled}
    >
      <div className="relative mb-2">
        <TextInput
          ref={inputRef}
          id="textSearch"
          min={3}
          labelText={texts.textSearchLabel}
          placeholder={texts.textSearchPlaceholder}
          onChange={(evt) => setText(evt.target.value)}
          onBlur={() => onChange({ categories, text })}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter') {
              onChange({ categories, text })
              inputRef.current?.blur()
            }
          }}
          value={text}
          disabled={disabled}
        />
        <button
          className={classNames(
            text && !showSubmit
              ? `opacity-100`
              : `opacity-0 pointer-events-none`,
            `bg-purple-50 h-[44px]`,
            `absolute bottom-px right-px px-4 py-2 rounded-r`,
            `text-purple-700 hover:bg-purple-200`,
            `transition motion-reduce:transition-none`,
            `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`,
            `focus-visible:ring-offset-2 focus-visible:ring-offset-white`,
            `focus-visible:opacity-100`
          )}
          onClick={() => {
            setText('')
            onChange({ categories, text: '' })
          }}
          tabIndex={text && !showSubmit ? 0 : -1}
        >
          <Cross className="scale-90" />
        </button>
        <button
          className={classNames(
            showSubmit ? `opacity-100` : `opacity-0 pointer-events-none`,
            `bg-purple-500 text-white h-[44px]`,
            `absolute bottom-px right-px px-4 py-2 rounded-r-sm`,
            `hover:bg-purple-400`,
            `transition motion-reduce:transition-none`,
            `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`,
            `focus-visible:ring-offset-2 focus-visible:ring-offset-white`
          )}
          onClick={() => inputRef.current?.blur()}
          tabIndex={showSubmit ? 0 : -1}
        >
          <Check className="scale-90 -mt-1" />
        </button>
      </div>
      {checkboxes.map(({ id, type }) => (
        <Checkbox
          key={id}
          id={id}
          disabled={disabled}
          onChange={(evt) => {
            onChange({
              text,
              categories: {
                ...categories,
                [id]: evt.target.checked,
              },
            })
          }}
          checked={!!categories[id]}
        >
          <FacilityType type={type} />
        </Checkbox>
      ))}
    </fieldset>
  )
}

export const getCategoriesTexts = (
  texts: TextsMapType
): CategoriesTextMapType => {
  return {
    categorySelfHelp: texts.textSearchCategorySelfHelp,
    categoryAdvising: texts.textSearchCategoryAdvising,
    categoryClinics: texts.textSearchCategoryClinics,
    categoryOnlineOffers: texts.textSearchCategoryOnlineOffers,
    categoryDistrictOfficeHelp: texts.textSearchCategoryDistrictOfficeHelp,
  }
}

export default TextSearch
