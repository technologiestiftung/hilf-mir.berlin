import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { FC } from 'react'
import classNames from '@lib/classNames'
import Link from 'next/link'
import { useUrlState } from '@lib/UrlStateContext'
import { useRecordLabels } from '@lib/hooks/useRecordLabels'
import { useTexts } from '@lib/TextsContext'
import { getLabelsSort } from '@lib/getLabelsSort'
import { Arrow } from './icons/Arrow'

export const FacilityCarouselSlide: FC<MinimalRecordType> = (facility) => {
  const [urlState] = useUrlState()
  const texts = useTexts()
  const { topicsLabels, targetAudienceLabels } = useRecordLabels(
    facility.labels
  )

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
          `border border-black justify-between`,
          `transition-colors hover:bg-gray-10`,
          `focus:ring-inset focus:ring-2 focus:ring-red`,
          `focus:outline-none focus:border-red`
        )}
      >
        <div className="max-w-[calc(100vw-40px)]">
          <h2
            className={classNames(
              'font-bold text-xl px-5 pt-5',
              `group-hover:text-red transition-colors`,
              `group-focus:text-red`
            )}
          >
            {facility.title}
          </h2>
          <ul className={classNames('overflow-x-auto mb-2')}>
            <div className="float-left pt-3 pb-0.5 mb-1 flex gap-1 mx-5 swiper-no-swiping">
              {topicsLabels.sort(getLabelsSort(urlState)).map((label) => {
                return (
                  <li
                    key={label.id}
                    className={classNames(
                      `inline-block px-1.5 py-0.5 border leading-4 whitespace-nowrap`,
                      urlState.tags?.includes(label.id)
                        ? `bg-red text-white border-red`
                        : `text-sm border-gray-20 `
                    )}
                  >
                    {label.fields.text}
                  </li>
                )
              })}
            </div>
          </ul>
          {targetAudienceLabels.length > 0 && (
            <div className="text-sm leading-4 px-5 pb-5">
              {texts.filtersSearchTargetLabelOnCard}:{' '}
              <strong>
                {targetAudienceLabels.map(({ id, fields }, idx) => (
                  <span
                    key={id}
                    className={
                      urlState.tags?.includes(id) ? `text-red` : `text-black`
                    }
                  >
                    {fields.text}
                    {idx !== targetAudienceLabels.length - 1 && ', '}
                  </span>
                ))}
              </strong>
            </div>
          )}
        </div>
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
  )
}
