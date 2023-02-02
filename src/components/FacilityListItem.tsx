import classNames from '@lib/classNames'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { useUrlState } from '@lib/UrlStateContext'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useTexts } from '@lib/TextsContext'
import Link from 'next/link'
import { FC } from 'react'
import { Arrow } from './icons/Arrow'
import { FacilityLabels } from './FacilityLabels'

interface FacilityListItemPropsType extends MinimalRecordType {
  className?: string
}

export const FacilityListItem: FC<FacilityListItemPropsType> = ({
  className = ``,
  ...record
}) => {
  const [urlState] = useUrlState()
  const { id, title, latitude, longitude, labels } = record
  const texts = useTexts()
  const { getDistanceToUser } = useDistanceToUser()
  const distance = getDistanceToUser({
    latitude,
    longitude,
  })
  const isOpened = useIsFacilityOpened(record)

  return (
    <li className={classNames(className)}>
      <Link
        href={{
          pathname: `/${id}`,
          query: { ...urlState, latitude: latitude, longitude: longitude },
        }}
      >
        <a
          className={classNames(
            `border-b border-b-gray-20 block`,
            `flex flex-col gap-1 bg-white group`,
            `transition-colors hover:bg-gray-10/50`,
            `focus:ring-inset focus:ring-2 focus:ring-primary`,
            `focus:outline-none focus:border-b-primary`
          )}
        >
          <header
            className={classNames(
              `border-b border-gray-10 p-5`,
              labels.length > 0 && `pb-3`
            )}
          >
            <h2
              className={classNames(
                `font-bold text-xl`,
                `group-hover:text-primary transition-colors`,
                `group-focus:text-primary`
              )}
            >
              {title}
            </h2>
            {(distance || isOpened) && (
              <div className="flex text-lg gap-4">
                {isOpened && (
                  <small className="flex items-center text-success gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                    {texts.opened}
                  </small>
                )}
                {distance && <small>{distance} km</small>}
              </div>
            )}
          </header>
          {record.description?.length > 1 && (
            <p className="px-5 pt-3 line-clamp-3">{record.description}</p>
          )}
          {labels.length > 0 && (
            <footer className="mt-5 pb-7 grid grid-cols-1 gap-y-3">
              <FacilityLabels labels={labels} languages={record.languages} />
            </footer>
          )}
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
    </li>
  )
}
