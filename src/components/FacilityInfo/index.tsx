import { FC } from 'react'
import { TableRowType as FacilityType } from '@common/types/gristData'
const closeIcon = 'images/icon_close.svg'

interface FacilityInfoType {
  facility: FacilityType
  onClose?: () => void
}

/*
interface FaqItemType {
  question: string
  answers: string[]
}
*/

interface TagItemType {
  question: string
  answers: string[]
}

interface OpenDaysType {
  day: string
  hours: string
}

/*
const FaqItem: FC<FaqItemType> = ({ question, answers }) => {
  return (
    <div className="py-6 border-b last:border-0 border-gray-50">
      <p>{question}</p>
      {answers.map((r) => {
        return (
          <p key={r} className="mt-1 text-xl font-bold">
            → {r}
          </p>
        )
      })}
    </div>
  )
}
*/

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

export const FacilityInfo: FC<FacilityInfoType> = ({
  facility,
  onClose,
  children,
}) => {
  return (
    <article className="h-full flex flex-col gap-y-8 justify-between">
      <div className="grid gap-2 grid-cols-[1fr_auto] items-start">
        <div>
          <h2 className="text-blue-500 text-3xl">
            {facility.fields.Einrichtung}
          </h2>
          <p className="mt-4">{facility.fields.Uber_uns}</p>
          <div className="mt-4 grid grid-cols-1 gap-0 border-t border-gray-50">
            {facility.fields.Schlagworte && (
              <TagItem
                question="Schlagworte"
                answers={facility.fields.Schlagworte.split(';')}
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
        </div>
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-2 right-2 translate-y-1 p-1"
        >
          <img src={closeIcon} alt="Schließen" aria-hidden={true} />
        </button>
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
            <OpenDaysItem day="Donnerstag" hours={facility.fields.Donnerstag} />
            <OpenDaysItem day="Freitag" hours={facility.fields.Freitag} />
            <OpenDaysItem day="Samstag" hours={facility.fields.Samstag} />
            <OpenDaysItem day="Sonntag" hours={facility.fields.Sonntag} />
          </div>
        </div>
      )}
    </article>
  )
}
