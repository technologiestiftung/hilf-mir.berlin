import { TextsMapType, useTexts } from '@lib/TextsContext'
import React, { useEffect, useState } from 'react'
import TextInput from './TextInput'
import Checkbox from './Checkbox'

type CategoriesType = Partial<{
  categorySelfHelp: boolean
  categoryAdvising: boolean
  categoryClinics: boolean
  categoryOnlineOffers: boolean
  categoryDisctrictOfficeHelp: boolean
}>
interface StateType {
  text: string
  categories: CategoriesType
}

interface TextSearchProps extends StateType {
  onChange: (state: Partial<StateType>) => void
}

type CategoriesTextMapType = Record<keyof CategoriesType, string>

function TextSearch({
  text: initialText,
  categories,
  onChange,
}: TextSearchProps): JSX.Element {
  const texts = useTexts()
  const [text, setText] = useState(initialText || '')

  useEffect(() => {
    setText(initialText || '')
  }, [initialText])

  const categoriesTexts = getCategoriesTexts(texts)
  const checkboxes = Object.keys(categoriesTexts).map((categoryKey) => ({
    id: categoryKey,
    labelText: categoriesTexts[categoryKey as keyof CategoriesTextMapType],
  }))

  return (
    <fieldset
      className="w-full @md:w-[324px]"
      aria-labelledby="textSearchLabel"
    >
      <TextInput
        id="textSearch"
        className="mb-2"
        min={3}
        labelText={texts.textSearchLabel}
        placeholder={texts.textSearchPlaceholder}
        onChange={(evt) => setText(evt.target.value)}
        onBlur={() => onChange({ categories, text })}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') {
            onChange({ categories, text })
          }
        }}
        value={text}
      />
      {checkboxes.map(({ id, labelText }) => (
        <Checkbox
          key={id}
          id={id}
          labelText={labelText}
          onChange={(evt) => {
            onChange({
              text,
              categories: {
                ...categories,
                [id]: evt.target.checked,
              },
            })
          }}
          checked={!!categories[id as keyof CategoriesType]}
        />
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
    categoryDisctrictOfficeHelp: texts.textSearchCategoryDisctrictOfficeHelp,
  }
}

export default TextSearch
