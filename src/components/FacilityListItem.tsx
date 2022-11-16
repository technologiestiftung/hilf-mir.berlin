import classNames from '@lib/classNames'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { useRecordLabels } from '@lib/hooks/useRecordLabels'
import { useUrlState } from '@lib/UrlStateContext'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useTexts } from '@lib/TextsContext'
import Link from 'next/link'
import { FC } from 'react'
import { getLabelsSort } from '@lib/getLabelsSort'
import { Arrow } from './icons/Arrow'

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
  const distance = useDistanceToUser({
    latitude,
    longitude,
  })
  const isOpened = useIsFacilityOpened(record)

  const { allLabels, topicsLabels, targetAudienceLabels } =
    useRecordLabels(labels)

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
            `border-b border-b-black block`,
            `flex flex-col gap-1 bg-white group`,
            `transition-colors hover:bg-gray-10/50`,
            `focus:ring-inset focus:ring-2 focus:ring-red`,
            `focus:outline-none focus:border-b-red`
          )}
        >
          <header
            className={classNames(
              `border-b border-gray-10 p-5`,
              allLabels.length > 0 && `pb-3`
            )}
          >
            <h2
              className={classNames(
                `font-bold text-xl`,
                `group-hover:text-red transition-colors`,
                `group-focus:text-red`
              )}
            >
              {title}
            </h2>
            {(distance || isOpened) && (
              <div className="flex text-lg gap-4">
                {isOpened && (
                  <small className="flex items-center text-mittelgruen gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-mittelgruen"></span>
                    {texts.opened}
                  </small>
                )}
                {distance && <small>{distance} km</small>}
              </div>
            )}
          </header>
          <p className="px-5 pt-3 line-clamp-3">{record.description}</p>
          {allLabels.length > 0 && (
            <footer className="pb-7">
              {topicsLabels.length > 0 && (
                <div className={classNames('overflow-x-auto mb-2')}>
                  <div className="float-left pt-3 pb-0.5 mb-1 flex gap-1 mx-5">
                    {topicsLabels.sort(getLabelsSort(urlState)).map((label) => (
                      <span
                        className={classNames(
                          `inline-block px-1.5 py-0.5 border leading-4`,
                          `whitespace-nowrap`,
                          urlState.tags?.includes(label.id)
                            ? `bg-red text-white border-red`
                            : `text-sm border-gray-20 `
                        )}
                        key={label?.id}
                      >
                        {label.fields.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {targetAudienceLabels.length > 0 && (
                <div className="text-sm px-5 leading-4">
                  {texts.filtersSearchTargetLabelOnCard}:{' '}
                  <strong>
                    {targetAudienceLabels.map(({ id, fields }, idx) => (
                      <span
                        key={id}
                        className={
                          urlState.tags?.includes(id)
                            ? `text-red`
                            : `text-black`
                        }
                      >
                        {fields.text}
                        {idx !== targetAudienceLabels.length - 1 && ', '}
                      </span>
                    ))}
                  </strong>
                </div>
              )}
            </footer>
          )}
          <span
            className={classNames(
              'font-bold text-red py-4 flex gap-2 justify-end text-right',
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
