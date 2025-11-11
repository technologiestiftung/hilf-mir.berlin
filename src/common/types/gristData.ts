export interface GristLabelType extends Record<string, unknown> {
  id: number
  fields: {
    key: string
    text: string
    icon: string
    group2: 'gruppe-1' | 'gruppe-2' | 'gruppe-3' | 'zielpublikum'
    order: number | null
  }
}

/**
 * This type corresponds to the table row of psychological and other help facilities in Berlin. Note that the keys are subject to change whenever the columns are updated in the spreadsheet.
 */
export interface TableRowType extends Record<string, unknown> {
  id: number
  fields: {
    /** Yes (1), No (0) toggle to determine whether a row should be used in the frontend at all: */
    Anzeigen: number | null
    /** Self-provided ID (not the one from Grist itself) */
    ID2: number
    Einrichtung: string
    Trager: string
    /** Array of ID's referencing the "Labels" table in Grist.
     * Note that for some reason the array also contains a "L" for every record (bug?)
     */
    Schlagworte: number[]
    /** Zielgruppen is a) still unused and b) currently a text column, which will soon become a reference list like Schlagworte */
    Zielgruppen: string
    Prio: '' | 'Hoch' | 'Mittel' | 'Niedrieg' | 'Versteckt'
    Wichtige_Hinweise: string
    Beratungsmoglichkeiten: string
    Sprachen: string
    Barrierefreiheit: string
    Uber_uns: string
    Strasse: string
    Hausnummer: string
    Zusatz: string
    PLZ: string
    Bezirk: string
    Stadtteil: string
    Telefonnummer: string
    EMail: string
    Website: string
    c24_h_7_Tage: string
    Montag: string
    Dienstag: string
    Mittwoch: string
    Donnerstag: string
    Freitag: string
    Samstag: string
    Sonntag: string
    Anmeldung_gewunscht: string
    Art_der_Anmeldung: string
    Weitere_Offnungszeiten: string
    /** The facility's latitude */
    lat: string | null
    /** The facility's longitude */
    long: string | null
    Kategorie: string
    Typ: 'Beratung' | 'Klinik' | 'Amt' | 'Online' | 'Selbsthilfe'
  }
}
