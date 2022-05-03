import { FC } from "react";
import { TableRowType as FacilityType } from "../common/types/gristData";
const closeIcon = "images/icon_close.svg";

interface FacilityInfoType {
  facility: FacilityType;
  onClose?: () => void;
}

interface FaqItemType {
  question: string;
  answers: string[];
}

const FaqItem: FC<FaqItemType> = ({ question, answers }) => {
  return (
    <div className="py-6 border-b last:border-0 border-gray-50">
      <p>{question}</p>
      {answers.map((r) => {
        return (
          <p key={r} className="mt-1 text-xl font-bold">
            → {r}
          </p>
        );
      })}
    </div>
  );
};

export const FacilityInfo: FC<FacilityInfoType> = ({ facility, onClose }) => {
  return (
    <article className="h-full flex flex-col gap-y-8 justify-between">
      <div className="grid gap-2 grid-cols-[1fr_auto] items-start">
        <div>
          <h2 className="text-blue-500 text-3xl">{facility.fields.Projekt}</h2>
          <h3 className="mt-1 text-base">
            {facility.fields.Zuwendungsempfanger}
          </h3>
          {facility.fields.EMail && (
            <a
              href={`mailto:${facility.fields.EMail}`}
              className="mt-8 mb-4 w-full text-center inline-block p-2 bg-magenta-500 text-white"
            >
              E-Mail schreiben
            </a>
          )}
          <div className="mt-4 grid grid-cols-1 gap-0 border-t border-gray-50">
            {facility.fields.Zielgruppe && (
              <FaqItem
                question="Für wen ist dieses Angebot besonders geeignet?"
                answers={facility.fields.Zielgruppe.split(";")}
              />
            )}
            {facility.fields.Leistung && (
              <FaqItem
                question="Welche Leistungen gibt es hier?"
                answers={facility.fields.Leistung.split(";")}
              />
            )}
          </div>
          {(facility.fields.Telefonnummer || facility.fields.EMail) && (
            <div className="my-4 grid grid-cols-[1fr] gap-0 items-center">
              {facility.fields.Website && (
                <div className="grid grid-cols-[56px_auto] gap-4 py-2 border-b border-gray-50 first-of-type:border-t">
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
              {facility.fields.EMail && (
                <div className="grid grid-cols-[56px_auto] gap-4 py-2 border-b border-gray-50">
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
              {facility.fields.Telefonnummer && (
                <div className="grid grid-cols-[56px_auto] gap-4 py-2 border-b border-gray-50">
                  <div>
                    <b>Tel.</b>
                  </div>
                  <div>{facility.fields.Telefonnummer}</div>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-2 right-2 translate-y-1 p-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={closeIcon} alt="Schließen" aria-hidden={true} />
        </button>
      </div>
      <div className="pb-4">
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
    </article>
  );
};
