import classNames from '@lib/classNames'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useTexts } from '@lib/TextsContext'
import { useUrlState } from '@lib/UrlStateContext'
import { FC } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { Arrow } from './icons/Arrow'
import { Globe } from './icons/Globe'
import { Phone } from './icons/Phone'

interface FacilityListItemType {
  facility: MinimalRecordType
  className?: string
}

export const FacilityListItem: FC<FacilityListItemType> = ({
  facility,
  className = '',
}) => {
  const [urlState] = useUrlState()
  const texts = useTexts()
  const open = useIsFacilityOpened(facility)
  const { getDistanceToUser } = useDistanceToUser()
  const distance = getDistanceToUser({
    latitude: facility.latitude,
    longitude: facility.longitude,
  })

  return (
    <Card
      id={`facility-${facility.id}`}
      title={facility.title}
      className={classNames('pt-9 pb-9', 'border-t-0 border-x-0', className)}
      header={
        (distance || open) && (
          <div className="flex text-lg gap-4">
            {open && (
              <small className="flex items-center text-success gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                {texts.opened}
              </small>
            )}
            {distance && <small>{distance} km</small>}
          </div>
        )
      }
      footer={
        <div className="flex flex-nowrap gap-3 justify-end max-w-lg">
          {facility.phone?.split(',')[0] && (
            <Button
              tag="a"
              href={`tel:${facility.phone?.split(',')[0]}`}
              size="small"
              className="w-1/2 flex flex-nowrap gap-x-2 items-center truncate"
            >
              <Phone className="w-5 h-5 text-purple-500 shrink-0" />
              {facility.phone?.split(',')[0]}
            </Button>
          )}
          <Button
            tag="a"
            href={`/${facility.id}`}
            query={{
              ...urlState,
              latitude: facility.latitude,
              longitude: facility.longitude,
            }}
            size="small"
            scheme="primary"
            className="w-1/2 flex flex-nowrap gap-x-2 items-center"
          >
            {texts.moreInfos}
            <Arrow orientation="right" className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <p className="line-clamp-4">{facility.description}</p>
      {facility.languages && facility.languages.length > 0 && (
        <div className="mt-4 flex flex-nowrap gap-x-2">
          <Globe className="w-5 h-5 text-gray-40 shrink-0 translate-y-0.5" />
          <div>
            {facility.languages.map((language, idx) => (
              <span key={language} className="text-sm text-gray-80">
                {language}
                {idx !== facility.languages.length - 1 && ','}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
