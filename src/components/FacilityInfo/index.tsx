import { FC } from 'react'
import { TableRowType } from '@common/types/gristData'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useIsFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { useTexts } from '@lib/TextsContext'
import { mapRecordToMinimum } from '@lib/mapRecordToMinimum'
import { BackButton } from '@components/BackButton'

interface FacilityInfoType {
  facility: TableRowType
  onClose?: () => void
}

interface TagItemType {
  question: string
  answers: string[]
}

interface OpenDaysType {
  day: string
  hours: string
}

const TagItem: FC<TagItemType> = ({ question, answers }) => {
  return (
    <div className="py-2">
      <p className="mb-2">{question}</p>
      <p>
        {answers.map((r) => {
          return (
            <span
              key={r}
              className="bg-blue-100 text-blue-800 mr-2 mb-2 px-2.5 py-0.5 rounded inline-block"
            >
              {r}
            </span>
          )
        })}
      </p>
    </div>
  )
}

const OpenDaysItem: FC<OpenDaysType> = ({ day, hours }) => {
  return (
    <div className="grid grid-cols-[80px_auto] gap-4 py-0">
      <div>{day}</div>
      {hours}
    </div>
  )
}

export const FacilityInfo: FC<FacilityInfoType> = ({ facility, children }) => {
  const texts = useTexts()
  const isOpened = useIsFacilityOpened(mapRecordToMinimum(facility))
  const distance = useDistanceToUser({
    latitude: facility.fields.lat,
    longitude: facility.fields.long2,
  })
  return (
    <>
      <BackButton href="/map" />
      <article className="h-full flex flex-col justify-between">
        <div className="p-5">
          <h1 className="mb-2">{facility.fields.Einrichtung}</h1>
          {(distance || isOpened) && (
            <div className="flex gap-4 text-lg">
              {distance && <span>{distance} km</span>}
              {isOpened && (
                <span className="text-mittelgruen flex gap-2 items-center">
                  <span className="w-2 h-2 inline-block bg-mittelgruen rounded-full"></span>
                  {texts.opened}
                </span>
              )}
            </div>
          )}
          <p className="mt-4">{facility.fields.Uber_uns}</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-0 border-t border-gray-50">
          {facility.fields.Schlagworte && (
            <TagItem
              question="Schlagworte"
              answers={facility.fields.Schlagworte.map((n) => `${n}`)}
            />
          )}
          {facility.fields.Sprachen && (
            <TagItem
              question="Welche Sprachen werden angeboten?"
              answers={facility.fields.Sprachen.split(';')}
            />
          )}
        </div>
        <div className="my-4 grid grid-cols-[1fr] gap-0 items-center">
          {facility.fields.Website && (
            <div className="grid grid-cols-[56px_auto] gap-4 py-2 first-of-type:border-t">
              <div>
                <b>Website</b>
              </div>
              <a
                href={facility.fields.Website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block underline text-blue-500 break-all"
              >
                {facility.fields.Website}
              </a>
            </div>
          )}
          {facility.fields.Website && (
            <a
              href={facility.fields.Website}
              className="mt-2 mb-4 w-full text-center inline-block p-2 bg-magenta-500 text-white"
            >
              Website besuchen
            </a>
          )}
          {facility.fields.EMail && (
            <div className="grid grid-cols-[56px_auto] gap-4 py-2">
              <div>
                <b>E-Mail</b>
              </div>
              <a
                href={`mailto:${facility.fields.EMail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block underline text-blue-500 break-all"
              >
                {facility.fields.EMail}
              </a>
            </div>
          )}
          {facility.fields.EMail && (
            <a
              href={`mailto:${facility.fields.EMail}`}
              className="mt-2 mb-4 w-full text-center inline-block p-2 bg-magenta-500 text-white"
            >
              E-Mail schreiben
            </a>
          )}
          {facility.fields.Telefonnummer && (
            <div className="grid grid-cols-[56px_auto] gap-4 py-2 border-b border-gray-50 first-of-type:border-t">
              <div>
                <b>Tel.</b>
              </div>
              <div>{facility.fields.Telefonnummer}</div>
            </div>
          )}
          {children}
        </div>
        <div className="pb-1">
          <div className="bg-gray-25 px-3 py-2">
            <h4 className="font-bold">Adresse</h4>
            <address className="not-italic">
              {facility.fields.Strasse && facility.fields.Hausnummer && (
                <p>
                  {facility.fields.Strasse} {facility.fields.Hausnummer}
                </p>
              )}
              {facility.fields.PLZ && <p>{facility.fields.PLZ} Berlin</p>}
              {facility.fields.Bezirk && <p>{facility.fields.Bezirk}</p>}
            </address>
          </div>
        </div>
        {facility.fields.Montag && (
          <div className="pb-4">
            <div className="bg-gray-25 px-3 py-2">
              <h4 className="font-bold">Öffnungszeiten</h4>
              <OpenDaysItem day="Montag" hours={facility.fields.Montag} />
              <OpenDaysItem day="Dienstag" hours={facility.fields.Dienstag} />
              <OpenDaysItem day="Mittwoch" hours={facility.fields.Mittwoch} />
              <OpenDaysItem
                day="Donnerstag"
                hours={facility.fields.Donnerstag}
              />
              <OpenDaysItem day="Freitag" hours={facility.fields.Freitag} />
              <OpenDaysItem day="Samstag" hours={facility.fields.Samstag} />
              <OpenDaysItem day="Sonntag" hours={facility.fields.Sonntag} />
            </div>
          </div>
        )}
      </article>
    </>
  )
}
