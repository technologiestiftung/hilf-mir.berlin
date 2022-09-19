import { createContext, useContext } from 'react'
import { TextsMapType } from './requests/getGristTexts'

const textsContext = createContext<TextsMapType>({
  homeWelcomeTitle: '',
  homeWelcomeText: '',
  findOffersButtonText: '',
  directHelpButtonText: '',
  moreOffersKVBLinkText: '',
  moreOffersKVBLinkUrl: '',
  footerInfoPageLinkText: '',
  footerImprintLinkText: '',
  footerPrivacyLinkText: '',
})

export const useTexts = (): TextsMapType => {
  const texts = useContext(textsContext)
  return texts
}

export const TextsProvider = textsContext.Provider
