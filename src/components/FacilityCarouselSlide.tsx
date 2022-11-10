import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { FC } from 'react'
import classNames from '@lib/classNames'
import Link from 'next/link'
import { useUrlState } from '@lib/UrlStateContext'
import { useRecordLabels } from '@lib/hooks/useRecordLabels'
import { useTexts } from '@lib/TextsContext'
import { PrimaryButton } from './PrimaryButton'
import { useRouter } from 'next/router'

export const FacilityCarouselSlide: FC<MinimalRecordType> = (facility) => {
  const { push } = useRouter()
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
          `p-5 block h-full`,
          `flex flex-col gap-1 bg-white group`,
          `border border-black`,
          `transition-colors`,
          `focus:ring-inset focus:ring-2 focus:ring-red`,
          `focus:outline-none focus:border-red`
        )}
      >
        <div className="max-w-[calc(100vw-40px)]">
          <h2
            className={classNames(
              'font-bold text-xl',
              `group-hover:text-red transition-colors`,
              `group-focus:text-red`
            )}
          >
            {facility.title}
          </h2>
          <ul className={classNames('mt-3', 'flex gap-1 flex-wrap')}>
            {topicsLabels.map((label) => {
              return (
                <li
                  key={label.id}
                  className={classNames(
                    `inline-block px-1.5 py-0.5 border leading-4`,
                    urlState.tags?.includes(label.id)
                      ? `bg-red text-white border-red`
                      : `text-sm border-gray-20 `
                  )}
                >
                  {label.fields.text}
                </li>
              )
            })}
          </ul>
          {targetAudienceLabels.length > 0 && (
            <div className="text-sm mt-3 leading-4">
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
          <PrimaryButton
            onClick={() => void push(`/${facility.id}`)}
            className="mt-3"
          >
            Einrichtung ansehen
          </PrimaryButton>
        </div>
      </a>
    </Link>
  )
}
