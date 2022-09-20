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
  suicidePreventionLabel: '',
  suicidePreventionPhoneNumber: '',
  psychiatricServicesLabel: '',
  psychiatricServicesPhoneNumber: '',
  backText: '',
  neighborhoodCharlottenburgWilmersdorfLabel: '',
  neighborhoodCharlottenburgWilmersdorfPhoneNumber: '',
  neighborhoodFriedrichshainKreuzbergLabel: '',
  neighborhoodFriedrichshainKreuzbergPhoneNumber: '',
  neighborhoodLichtenbergLabel: '',
  neighborhoodLichtenbergPhoneNumber: '',
  neighborhoodMarzahnHellersdorfLabel: '',
  neighborhoodMarzahnHellersdorfPhoneNumber: '',
  neighborhoodMitteLabel: '',
  neighborhoodMittePhoneNumber: '',
  neighborhoodNeukoellnLabel: '',
  neighborhoodNeukoellnPhoneNumber: '',
  neighborhoodPankowLabel: '',
  neighborhoodPankowPhoneNumber: '',
  neighborhoodReinickendorfLabel: '',
  neighborhoodReinickendorfPhoneNumber: '',
  neighborhoodSpandauLabel: '',
  neighborhoodSpandauPhoneNumber: '',
  neighborhoodSteglitzZehlendorfLabel: '',
  neighborhoodSteglitzZehlendorfPhoneNumber: '',
  neighborhoodTempelhofSchoenebergLabel: '',
  neighborhoodTempelhofSchoenebergPhoneNumber: '',
  neighborhoodTrepotowKoepenickLabel: '',
  neighborhoodTrepotowKoepenickPhoneNumber: '',
}

export type TextsMapType = typeof defaultValue

const textsContext = createContext<TextsMapType>(defaultValue)

export const useTexts = (): TextsMapType => {
  const texts = useContext(textsContext)
  return texts
}

export const TextsProvider = textsContext.Provider
