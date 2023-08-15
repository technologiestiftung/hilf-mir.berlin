import { useTexts } from '@lib/TextsContext'
import classNames from '@lib/classNames'
import {
  facilityTypeColorMap,
  getTextKeyByFacilityType,
} from '@lib/facilityTypeUtil'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'

function FacilityType({
  type,
}: {
  type: MinimalRecordType['type']
}): JSX.Element {
  const texts = useTexts()
  return (
    <span className="flex items-center gap-2">
      <span
        className={classNames(`inline-block w-4 h-4 rounded-full `)}
        style={{
          backgroundColor: facilityTypeColorMap[type],
        }}
      />
      <span>{texts[getTextKeyByFacilityType(type)]}</span>
    </span>
  )
}

export default FacilityType
