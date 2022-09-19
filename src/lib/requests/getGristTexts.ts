import { getGristTableData } from './getGristTableData'

export interface GristTextRecordType {
  id: string
  fields: {
    A: string
    B: string
    C: string
  }
}

export interface TextsMapType {
  homeWelcomeTitle: string
  homeWelcomeText: string
  findOffersButtonText: string
  directHelpButtonText: string
  moreOffersKVBLinkText: string
  moreOffersKVBLinkUrl: string
  footerInfoPageLinkText: string
  footerImprintLinkText: string
  footerImprintLinkUrl: string
  footerPrivacyLinkText: string
  footerPrivacyLinkUrl: string
  footerProjectOwnerLabel: string
  footerTSBLogoAltText: string
  footerProjectExecutionerLabel: string
  footerCityLABLogoAltText: string
  footerCooperationLabel: string
  footerSenWGPGLogoAltText: string
  footerProjectSponsorLabel: string
  footerSentatskanzleiLogoAltText: string
}

export async function getGristTexts(): Promise<TextsMapType> {
  const data = await getGristTableData<{ records: GristTextRecordType[] }>(
    process.env.NEXT_SECRET_GRIST_DOC_ID || '',
    process.env.NEXT_SECRET_GRIST_TEXTS_TABLE || ''
  )
  const texts = data.records.slice(1)
  return texts.reduce(
    (acc, { fields: { A: key, B: de } }) => ({
      ...acc,
      [key]: de,
    }),
    {}
  ) as TextsMapType
}
