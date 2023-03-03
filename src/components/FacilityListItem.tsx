import classNames from '@lib/classNames'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { Arrow } from './icons/Arrow'
import { Button } from './Button'
import { Phone } from './icons/Phone'
import { Globe } from './icons/Globe'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { useUrlState } from '@lib/UrlStateContext'

interface FacilityListItemPropsType {
  id: number
  title: MinimalRecordType['title']
  phone?: string
  distance?: string
  languages?: string[]
  // TODO: Ideally we shouldn't have to pass the whole facility.
  // We want the component to be purely presentational and extract
  // the logic that uses the facility object. However, this requires
  // quite some refactoring, so we're not doing this now.
  facility: MinimalRecordType
  className?: string
}

export const FacilityListItem: FC<FacilityListItemPropsType> = ({
  className = ``,
  id,
  title,
  phone,
  languages,
  facility,
  children,
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
    <li className={classNames(className)}>
      <div
        className={classNames(
          `border-b border-b-gray-20 block`,
          `flex flex-col gap-1 bg-white`
        )}
      >
        <header className={classNames(`px-5 pt-9 pb-3`)}>
          <h2 className={classNames(`font-bold text-xl`)}>{title}</h2>
          {(distance || open) && (
            <div className="flex text-lg gap-4">
              {open && (
                <small className="flex items-center text-success gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                  {texts.opened}
                </small>
              )}
              {distance && <small>{distance} km</small>}
            </div>
          )}
        </header>
        {children && <p className="px-5 pt-0 line-clamp-3">{children}</p>}
        {languages && languages.length > 0 && (
          <div className="mt-4 px-5 flex flex-nowrap gap-x-2">
            <Globe className="w-5 h-5 text-gray-40 shrink-0 translate-y-0.5" />
            <div>
              {languages.map((language, idx) => (
                <span key={language} className="text-sm text-gray-80">
                  {language}
                  {idx !== languages.length - 1 && ','}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 pb-9 px-5 flex flex-nowrap gap-3 justify-end max-w-lg">
          {phone && (
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
          <Button
            tag="a"
            href={`/${id}`}
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
      </div>
    </li>
  )
}
