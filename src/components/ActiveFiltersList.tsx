import { useTexts } from '@lib/TextsContext'
import { useFiltersWithActiveProp } from '@lib/hooks/useFiltersWithActiveProp'
import React from 'react'
import { getCategoriesTexts } from './TextSearch'
import {
  urlSearchCategoriesToStateSearchCategories,
  useUrlState,
} from '@lib/UrlStateContext'
import { GristLabelType } from '@common/types/gristData'
import { Button } from './Button'

function ActiveFiltersList(): JSX.Element | null {
  const texts = useTexts()
  const [urlState] = useUrlState()
  const labels = useFiltersWithActiveProp()
  const categoriesTexts = getCategoriesTexts(texts)
  const categories = urlSearchCategoriesToStateSearchCategories(
    urlState.qCategories
  )

  const categoryFilters = Object.entries(categories)
    .filter(([, isActive]) => isActive)
    .map(([key]) => ({
      id: key,
      fields: {
        text: categoriesTexts[key as keyof typeof categoriesTexts],
      },
    }))

  const allFilters = [
    ...(urlState.q ? [{ id: 'search', fields: { text: urlState.q } }] : []),
    ...categoryFilters,
    ...labels.filter((label) => label.isActive),
  ] as GristLabelType[]

  if (allFilters.length === 0) return null

  return (
    <div className="p-5 border-b border-gray-20 bg-gray-10 bg-opacity-25">
      <p className="text-sm font-bold">{texts.resultPageIntro}</p>
      <ul className="mt-2 md:mt-3 flex flex-wrap gap-1 md:gap-2">
        {allFilters.map((label) => (
          <Button
            key={label.id}
            tag="button"
            disabled={true}
            scheme="primary"
            size="extrasmall"
            className="!bg-primary !text-white !cursor-default flex gap-x-1 items-center"
          >
            {label.fields.text}
          </Button>
        ))}
      </ul>
    </div>
  )
}

export default ActiveFiltersList
