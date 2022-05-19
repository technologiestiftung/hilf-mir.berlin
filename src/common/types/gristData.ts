/**
 * This type corresponds to the table row of psychological and other help facilities in Berlin. Note that the keys are subject to change whenever the columns are updated in the spreadsheet.
 */
export interface TableRowType {
  id: number
  fields: {
    Projekt: string
    Zuwendungsempfanger: string
    Fordertyp: string
    Angebotstyp: string
    Zielgruppe: string
    Leistung: string
    Strasse: string
    Hausnummer: string
    Zusatz: string
    PLZ: string
    Bezirk: string
    Telefonnummer: string
    EMail: string
    long2: number
    Website: string
    lat: number
    district: string
  }
}
