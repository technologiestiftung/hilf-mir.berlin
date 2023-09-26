import {
  facilityTypeToKeyMap,
  getKeyByFacilityType,
} from '@lib/facilityTypeUtil'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import React, { useMemo } from 'react'
import Checkbox from './Checkbox'
import FacilityType from './FacilityType'

type CategoriesType = Partial<{
  categorySelfHelp: boolean
  categoryAdvising: boolean
  categoryClinics: boolean
  categoryOnlineOffers: boolean
  categoryDistrictOfficeHelp: boolean
}>

export interface StateType {
  text: string
  categories: CategoriesType
}

interface TypeCheckboxesFilterProps extends StateType {
  onChange: (state: Partial<StateType>) => void
  disabled?: boolean
}

function TypeCheckboxesFilter({
  onChange,
  disabled,
  text,
  categories,
}: TypeCheckboxesFilterProps): JSX.Element {
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
    <div>
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
    </div>
  )
}

export default TypeCheckboxesFilter
