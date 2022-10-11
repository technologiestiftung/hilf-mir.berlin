import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { FC } from 'react'
import classNames from '@lib/classNames'

export const FacilityCarouselSlide: FC<MinimalRecordType> = (facility) => {
  return (
    <div className={classNames(`flex justify-center`)}>
      <div className="p-5 bg-white border border-black w-full max-w-[calc(100vw-40px)]">
        {facility.title}
      </div>
    </div>
  )
}
