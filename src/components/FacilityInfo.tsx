import { FC } from "react";
import { TableRowType as FacilityType } from "../common/types/gristData";
const closeIcon = "images/icon_close.svg";

interface FacilityInfoType {
  facility: FacilityType;
  onClose?: () => void;
}

export const FacilityInfo: FC<FacilityInfoType> = ({ facility, onClose }) => {
  return (
    <article>
      <header className="grid gap-2 grid-cols-[1fr_auto] items-start pb-5 border-b border-gray-50">
        <div>
          <h2 className="text-blue-500 text-3xl">{facility.fields.Projekt}</h2>
          <h3 className="mt-1 text-xl">{facility.fields.Leistung}</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 pt-4 border-t border-gray-50">
            {facility.fields.Zuwendungsempfanger && (
              <p>
                Angebot von: <br />{" "}
                <strong className="text-blue-500">
                  {facility.fields.Zuwendungsempfanger}
                </strong>
              </p>
            )}
            {facility.fields.Zielgruppe && (
              <p>
                Für: <br />{" "}
                {facility.fields.Zielgruppe.split(";").map((zielgruppe) => {
                  return (
                    <span
                      key={zielgruppe}
                      className="mr-2 px-2 py-1 text-blue-500 bg-blue-50"
                    >
                      {zielgruppe.trim()}
                    </span>
                  );
                })}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="translate-y-1 p-1 border border-gray-600 rounded-full transition-colors hover:border-blue-500"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={closeIcon} alt="Schließen" aria-hidden={true} />
        </button>
      </header>
      <div></div>
      <div className="mt-4">
        <address className="not-italic">
          <p>
            {facility.fields.Strasse} {facility.fields.Hausnummer}
          </p>
          <p>
            {facility.fields.PLZ} Berlin ({facility.fields.Bezirk})
          </p>
          {facility.fields.Telefonnummer && (
            <p className="mt-4">
              {" "}
              Tel.:
              {facility.fields.Telefonnummer}
            </p>
          )}
          {facility.fields.EMail && (
            <a
              href={`mailto:${facility.fields.EMail}`}
              className="mt-3 inline-block p-2 bg-blue-500 text-white border-b-4 border-magenta-500 transition-colors hover:bg-blue-400"
            >
              E-Mail schreiben
            </a>
          )}
        </address>
      </div>
    </article>
  );
};
