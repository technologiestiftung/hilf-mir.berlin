import { FC } from 'react'
import { TableRowType } from '@common/types/gristData'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { useTexts } from '@lib/TextsContext'
import { mapRecordToMinimum } from '@lib/mapRecordToMinimum'
import { BackButton } from '@components/BackButton'
import { useRecordLabels } from '@lib/hooks/useRecordLabels'
import { getLabelRenderer } from '@lib/getLabelRenderer'
import { Phone } from '@components/icons/Phone'
import classNames from '@lib/classNames'
import { Globe } from '@components/icons/Globe'
import { Email } from '@components/icons/Email'
import { TextLink } from '@components/TextLink'
import { Geopin } from '@components/icons/Geopin'
import { getTodayKey } from '@lib/getTodayKey'
import { useUrlState } from '@lib/UrlStateContext'

interface FacilityInfoType {
  facility: TableRowType
}

interface OpenDaysType {
  day: string
  hours: string
  isActive: boolean
}

const OpenDaysItem: FC<OpenDaysType> = ({ day, hours, isActive }) => {
  return (
    <div
      className={classNames(
        `flex justify-between gap-4 py-2 px-5 -mt-1`,
        isActive && `bg-red text-white`
      )}
    >
      <div>{day}</div>
      {hours}
    </div>
  )
}

export const FacilityInfo: FC<FacilityInfoType> = ({ facility }) => {
  const [urlState] = useUrlState()
  const texts = useTexts()
  const isOpened = useIsFacilityOpened(mapRecordToMinimum(facility))
  const distance = useDistanceToUser({
    latitude: facility.fields.lat,
    longitude: facility.fields.long2,
  })
  const { allLabels, topicsLabels, targetAudienceLabels } = useRecordLabels(
    facility.fields.Schlagworte
  )

  const renderLabel = getLabelRenderer({
    activeFilters: urlState.tags || [],
  })

  const { Strasse, Hausnummer, PLZ } = facility.fields
  const addressOneLiner =
    Strasse && Hausnummer && PLZ
      ? `${Strasse} ${Hausnummer}, ${PLZ} Berlin`
      : undefined

  const infoList = [
    {
      icon: <Geopin />,
      text: addressOneLiner,
    },
    {
      icon: <Globe />,
      text: facility.fields.Website,
      href: facility.fields.Website,
    },
    {
      icon: <Email />,
      text: facility.fields.EMail,
      href: `mailto:${facility.fields.EMail}`,
    },
    {
      icon: <Phone />,
      text: facility.fields.Telefonnummer,
      href: `tel:${facility.fields.Telefonnummer}`,
    },
  ].filter(({ text }) => !!text)

  const todayKey = getTodayKey()

  return (
    <>
      <BackButton href={{ pathname: `/map`, query: { ...urlState } }} />
      <article className="h-full flex flex-col gap-8">
        <div className="px-5 pt-5">
          <h1 className="mb-2">{facility.fields.Einrichtung}</h1>
          {(distance || isOpened) && (
            <div className="flex gap-4 text-lg">
              {isOpened && (
                <span className="text-mittelgruen flex gap-2 items-center">
                  <span className="w-2 h-2 inline-block bg-mittelgruen rounded-full"></span>
                  {texts.opened}
                </span>
              )}
              {distance && <span>{distance} km</span>}
            </div>
          )}
          <p className="mt-4">{facility.fields.Uber_uns}</p>
        </div>
        {allLabels.length > 0 && (
          <div className="w-full">
            {topicsLabels.length > 0 && (
              <div className="flex gap-2 p-5 flex-wrap">
                {topicsLabels.map(renderLabel)}
              </div>
            )}
            {targetAudienceLabels.length > 0 && (
              <>
                <h2 className="px-5 font-bold text-lg mt-2">
                  {texts.filtersSearchTargetLabelOnCard}
                </h2>
                <div className="flex gap-2 p-5 pt-1 flex-wrap">
                  {targetAudienceLabels.map(renderLabel)}
                </div>
              </>
            )}
          </div>
        )}
        {infoList.length > 0 && (
          <ul className="text-lg">
            {infoList.map(({ icon, text, href }, idx) => (
              <li
                key={idx}
                className={classNames(
                  `flex gap-4 px-5 py-3 odd:bg-gray-10`,
                  `items-center`
                )}
              >
                <span className="text-red">{icon}</span>
                {href && (
                  <TextLink className="no-underline" href={href}>
                    {text}
                  </TextLink>
                )}
                {!href && <span>{text}</span>}
              </li>
            ))}
          </ul>
        )}
        {facility.fields.Montag && (
          <div className="pb-8">
            <h4 className="px-5 text-lg font-bold flex justify-between mb-5">
              Öffnungszeiten
              {isOpened && (
                <span className="text-mittelgruen flex gap-2 items-center font-normal">
                  <span className="w-2 h-2 inline-block bg-mittelgruen rounded-full"></span>
                  {texts.opened}
                </span>
              )}
            </h4>
            <OpenDaysItem
              isActive={todayKey === 'Montag'}
              day={texts.weekdayMonday}
              hours={facility.fields.Montag}
            />
            <OpenDaysItem
              isActive={todayKey === 'Dienstag'}
              day={texts.weekdayTuesday}
              hours={facility.fields.Dienstag}
            />
            <OpenDaysItem
              isActive={todayKey === 'Mittwoch'}
              day={texts.weekdayWednesday}
              hours={facility.fields.Mittwoch}
            />
            <OpenDaysItem
              isActive={todayKey === 'Donnerstag'}
              day={texts.weekdayThursday}
              hours={facility.fields.Donnerstag}
            />
            <OpenDaysItem
              isActive={todayKey === 'Freitag'}
              day={texts.weekdayFriday}
              hours={facility.fields.Freitag}
            />
            <OpenDaysItem
              isActive={todayKey === 'Samstag'}
              day={texts.weekdaySaturday}
              hours={facility.fields.Samstag}
            />
            <OpenDaysItem
              isActive={todayKey === 'Sonntag'}
              day={texts.weekdaySunday}
              hours={facility.fields.Sonntag}
            />
          </div>
        )}
      </article>
    </>
  )
}
