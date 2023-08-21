import classNames from '@lib/classNames'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useTexts } from '@lib/TextsContext'
import { useUrlState } from '@lib/UrlStateContext'
import { FC } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { Arrow } from './icons/Arrow'
import { Globe } from './icons/Globe'
import { Phone } from './icons/Phone'
import { ExternalLink } from './icons/ExternalLink'
import FacilitySecondaryInfos from './FacilitySecondaryInfos'

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
  const phone: string | undefined = facility.phone?.split(',')[0]
  const isOnline = facility.type.toLowerCase() === 'online'

  return (
    <Card
      id={`facility-${facility.id}`}
      title={facility.title}
      className={classNames('pt-9 pb-9', 'border-t-0 border-x-0', className)}
      header={<FacilitySecondaryInfos facility={facility} />}
      footer={
        <div className="flex flex-nowrap gap-3 justify-end max-w-lg">
          {!isOnline && phone && (
            <Button
              tag="a"
              href={`tel:${phone}`}
              size="small"
              className="w-1/2 flex flex-nowrap gap-x-2 items-center truncate"
            >
              <Phone className="w-5 h-5 text-purple-500 shrink-0" />
              {phone}
            </Button>
          )}
          {isOnline && facility.website && (
            <Button
              tag="a"
              href={facility.website}
              size="small"
              className="w-1/2 flex flex-nowrap gap-x-2 items-center truncate"
            >
              <ExternalLink className="w-5 h-5 text-purple-500 shrink-0" />
              {texts.websiteLabel}
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
                {idx !== facility.languages.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
