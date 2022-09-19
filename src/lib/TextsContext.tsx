import { createContext, useContext } from 'react'

const defaultValue = {
  homeWelcomeTitle: '',
  homeWelcomeText: '',
  findOffersButtonText: '',
  directHelpButtonText: '',
  moreOffersKVBLinkText: '',
  moreOffersKVBLinkUrl: '',
  footerInfoPageLinkText: '',
  footerImprintLinkText: '',
  footerImprintLinkUrl: '',
  footerPrivacyLinkText: '',
  footerPrivacyLinkUrl: '',
  footerProjectOwnerLabel: '',
  footerTSBLogoAltText: '',
  footerProjectExecutionerLabel: '',
  footerCityLABLogoAltText: '',
  footerCooperationLabel: '',
  footerSenWGPGLogoAltText: '',
  footerProjectSponsorLabel: '',
  footerSentatskanzleiLogoAltText: '',
}

export type TextsMapType = typeof defaultValue

const textsContext = createContext<TextsMapType>(defaultValue)

export const useTexts = (): TextsMapType => {
  const texts = useContext(textsContext)
  return texts
}

export const TextsProvider = textsContext.Provider
