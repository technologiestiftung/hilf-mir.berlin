import { FC } from 'react'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { Card } from './Card'
import { Button } from './Button'
import { Arrow } from './icons/Arrow'
import { useUrlState } from '@lib/UrlStateContext'
import { useTexts } from '@lib/TextsContext'
import FacilitySecondaryInfos from './FacilitySecondaryInfos'

interface FacilityCarouselItemPropsType {
  facility: MinimalRecordType
}

export const FacilityCarouselItem: FC<FacilityCarouselItemPropsType> = ({
  facility,
}) => {
  const [urlState] = useUrlState()
  const texts = useTexts()

  return (
    <Card
      className="!h-full"
      title={
        <div className="line-clamp-3 leading-6 mb-2">{facility.title}</div>
      }
      header={<FacilitySecondaryInfos facility={facility} />}
      footer={
        <div className="flex justify-end">
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
            className="w-1/2"
          >
            {texts.moreInfos}
            <Arrow orientation="right" className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <p className="line-clamp-3 text-sm">{facility.description}</p>
    </Card>
  )
}
