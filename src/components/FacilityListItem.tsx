import classNames from '@lib/classNames'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useTexts } from '@lib/TextsContext'
import Link from 'next/link'
import { FC } from 'react'

interface FacilityListItemPropsType extends MinimalRecordType {
  className?: string
}

export const FacilityListItem: FC<FacilityListItemPropsType> = ({
  className = ``,
  ...record
}) => {
  const { id, title, latitude, longitude, labels } = record
  const texts = useTexts()
  const distance = useDistanceToUser({
    latitude,
    longitude,
  })
  const isOpened = useIsFacilityOpened(record)

  return (
    <li className={classNames(className)}>
      <Link href={`/${id}`}>
        <a
          className={classNames(
            `border-b border-b-black block`,
            `flex flex-col gap-1`
          )}
        >
          <header className="border-b border-gray-10 p-5">
            <h2 className={classNames(`font-bold text-xl`)}>{title}</h2>
            {(distance || isOpened) && (
              <div className="flex gap-4 text-lg">
                {distance && <small>{distance} km</small>}
                {isOpened && (
                  <small className="text-mittelgruen flex gap-2 items-center">
                    <span className="w-2 h-2 inline-block bg-mittelgruen rounded-full"></span>
                    {texts.opened}
                  </small>
                )}
              </div>
            )}
          </header>
          <footer className="p-5 flex gap-2">
            {labels.map((n) => `${n}`)}
          </footer>
        </a>
      </Link>
    </li>
  )
}
