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
    <div className="py-6 border-b border-gray-50">
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
    <article className="h-full flex flex-col place-content-between">
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
            <div className="mt-6 grid grid-cols-[1fr] gap-4 items-center">
              {facility.fields.EMail && (
                <div>
                  <div>Website</div>
                  <a
                    href={`mailto:${facility.fields.EMail}`}
                    className="inline-block text-xl underline text-blue-500"
                  >
                    {facility.fields.EMail}
                  </a>
                </div>
              )}
              {facility.fields.Telefonnummer && (
                <div>
                  <div>Tel.</div>
                  <div className="text-xl font-bold">
                    {facility.fields.Telefonnummer}
                  </div>
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
      <div className="mt-4 p-4 bg-gray-25">
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
    </article>
  );
};
