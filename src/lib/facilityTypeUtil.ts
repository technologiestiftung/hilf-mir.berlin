import { TextsMapType } from '@lib/TextsContext'
import { MinimalRecordType } from './mapRecordToMinimum'
import colors from '../colors'
import {
  DataDrivenPropertyValueSpecification,
  ExpressionInputType,
  ExpressionSpecification,
} from 'maplibre-gl'

export const facilityTypeToKeyMap = {
  Selbsthilfe: 'selfHelp',
  Beratung: 'advising',
  Klinik: 'clinics',
  Online: 'onlineOffers',
  Amt: 'districtOfficeHelp',
}

export type FacilityType = keyof typeof facilityTypeToKeyMap
export type FacilityTypeKey = (typeof facilityTypeToKeyMap)[FacilityType]

const facilityTypes = Object.keys(facilityTypeToKeyMap) as FacilityType[]

const ucFirst = (str: string): string => {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getKeyByFacilityType = (
  facilityType: MinimalRecordType['type']
): keyof typeof colors.type => {
  if (!facilityType || typeof facilityType !== 'string') {
    return 'categoryAdvising' as keyof typeof colors.type
  }

  const key = facilityTypeToKeyMap[facilityType]
  if (!key) {
    return 'categoryAdvising' as keyof typeof colors.type
  }
  return `category${ucFirst(key)}` as keyof typeof colors.type
}

export const getColorByFacilityType = (facilityType: FacilityType): string => {
  if (!facilityType) {
    return colors.type.categoryAdvising
  }
  return colors.type[getKeyByFacilityType(facilityType)]
}

export const getTextKeyByFacilityType = (
  facilityType: MinimalRecordType['type']
): keyof TextsMapType => {
  if (!facilityType || typeof facilityType !== 'string') {
    return 'textSearchCategoryAdvising' as keyof TextsMapType
  }

  const key = facilityTypeToKeyMap[facilityType]
  if (!key) {
    return 'textSearchCategoryAdvising' as keyof TextsMapType
  }
  return `textSearchCategory${ucFirst(key)}` as keyof TextsMapType
}

const facilityTypeColorMap = facilityTypes.reduce(
  (acc, facilityType) => ({
    ...acc,
    [facilityType]: getColorByFacilityType(facilityType),
  }),
  {} as Record<FacilityType, string>
)

export function getCategoryColorMatchQuery():
  | DataDrivenPropertyValueSpecification<string>
  | undefined {
  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    '#999999',
    getFacilityTypeColorMatchQuery(),
  ]
}

function getFacilityTypeColorMatchQuery():
  | ExpressionSpecification
  | ExpressionInputType {
  return [
    'match',
    ['get', 'type'],
    ...Object.entries(facilityTypeColorMap).reduce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (acc, [key, value]) => [...acc, key, value],
      []
    ),
    colors.gray[40],
  ]
}
