export interface GristLabelType extends Record<string, unknown> {
  id: number
  fields: {
    key: string
    text: string
    icon: string
    group2: 'gruppe-1' | 'gruppe-2' | 'gruppe-3' | 'zielpublikum'
  }
}

/**
 * This type corresponds to the table row of psychological and other help facilities in Berlin. Note that the keys are subject to change whenever the columns are updated in the spreadsheet.
 */
export interface TableRowType extends Record<string, unknown> {
  id: number
  fields: {
    Einrichtung: string
    Trager: string
    Kategorie: string
    Schlagworte: number[]
    Wichtige_Hinweise: string
    Beratungsmoglichkeiten: string
    Sprachen: string
    Barrierefreiheit: string
    Uber_uns: string
    Reichweite: string
    Stadtteile_Regionen: string
    Ausschlie_lich_nach_Meldeadresse: string
    Strasse: string
    Hausnummer: string
    Zusatz: string
    PLZ: string
    Bezirk: string
    Stadtteil: string
    Telefonnummer: string
    EMail: string
    Website: string
    Ansprechperson_1_Anrede: string
    Ansprechperson_1_Titel: string
    Ansprechperson_1_Vorname: string
    Ansprechperson_1_Nachname: string
    Ansprechperson_2_Anrede: string
    Ansprechperson_2_Titel: string
    Ansprechperson_2_Vorname: string
    Ansprechperson_2_Nachname: string
    c24_h_7_Tage: string
    Montag: string
    Dienstag: string
    Mittwoch: string
    Donnerstag: string
    Freitag: string
    Samstag: string
    Sonntag: string
    Anmeldung_gewunscht: string
    Weitere_Offnungszeiten: string
    lat: number
    long: number
  }
}
