import { MinimalRecordType } from './mapRecordToMinimum'
import colors from '../colors'
import {
  DataDrivenPropertyValueSpecification,
  ExpressionInputType,
  ExpressionSpecification,
} from 'maplibre-gl'

export const facilityTypeColorMap = {
  Beratung: colors.type.categoryAdvising,
  Selbsthilfe: colors.type.categorySelfHelp,
  Amt: colors.type.categoryDistrictOfficeHelp,
  Online: colors.type.categoryOnlineOffers,
  Klinik: colors.type.categoryClinics,
}
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

export const getFacilityTypeColor = (
  facilityType: MinimalRecordType['type']
): string => facilityTypeColorMap[facilityType]

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
