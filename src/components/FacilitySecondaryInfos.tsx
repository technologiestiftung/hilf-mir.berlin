import { useTexts } from '@lib/TextsContext'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import React from 'react'
import FacilityType from './FacilityType'

interface FacilitySecondaryInfosProps {
  facility: MinimalRecordType
}

function FacilitySecondaryInfos({
  facility,
}: FacilitySecondaryInfosProps): JSX.Element | null {
  const texts = useTexts()
  const open = useIsFacilityOpened(facility)
  const { getDistanceToUser } = useDistanceToUser()
  const distance = getDistanceToUser({
    latitude: facility.latitude,
    longitude: facility.longitude,
  })
  const type = facility.type
  const isOnlineOffer = facility.type === 'Online'

  if (!open && !distance && !type) return null
  return (
    <p className="flex text-lg gap-x-4 flex-wrap">
      {type && <FacilityType type={type} />}
      {distance && !isOnlineOffer && <small>{distance} km</small>}
      {open && !isOnlineOffer && (
        <small className="flex items-center text-success gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
          {texts.opened}
        </small>
      )}
    </p>
  )
}

export default FacilitySecondaryInfos
