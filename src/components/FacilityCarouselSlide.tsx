import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { FC } from 'react'
import classNames from '@lib/classNames'
import Link from 'next/link'
import { useUrlState } from '@lib/UrlStateContext'
import { useTexts } from '@lib/TextsContext'
import { Arrow } from './icons/Arrow'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'

export const FacilityCarouselSlide: FC<MinimalRecordType> = (facility) => {
  const [urlState] = useUrlState()
  const texts = useTexts()
  const { getDistanceToUser } = useDistanceToUser()
  const distance = getDistanceToUser({
    latitude: facility.latitude,
    longitude: facility.longitude,
  })
  const isOpened = useIsFacilityOpened(facility)

  return (
    <Link
      href={{
        pathname: `/${facility.id}`,
        query: {
          ...urlState,
          latitude: facility.latitude,
          longitude: facility.longitude,
        },
      }}
    >
      <a
        className={classNames(
          `block h-full`,
          `flex flex-col bg-white group`,
          `border border-gray-20 shadow-lg shadow-black/20 justify-between`,
          `transition-colors hover:bg-gray-10`,
          `focus:ring-inset focus:ring-2 focus:ring-primary`,
          `focus:outline-none focus:border-primary`
        )}
      >
        <div className="max-w-[calc(100vw-40px)]">
          <h2
            className={classNames(
              'font-headline font-bold text-xl px-5 pt-5',
              `group-hover:text-primary transition-colors`,
              `group-focus:text-primary inline-flex gap-x-4 flex-wrap`
            )}
          >
            {facility.title}
            {(distance || isOpened) && (
              <div className="inline-flex font-sans text-lg font-normal gap-4">
                {isOpened && (
                  <small className="inline-flex items-center font-normal text-success gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-success" />
                    {texts.opened}
                  </small>
                )}
                {distance && <small>{distance} km</small>}
              </div>
            )}
          </h2>
          {facility.description?.length > 1 && (
            <p className="px-5 pt-1 mb-5 line-clamp-2">
              {facility.description}
            </p>
          )}
        </div>
        <span
          className={classNames(
            'font-bold text-primary py-4 flex gap-2 justify-end text-right',
            'border-t border-gray-10 px-5'
          )}
        >
          {texts.openFacilityLinkText}
          <Arrow orientation="right" className="scale-75" />
        </span>
      </a>
    </Link>
  )
}
