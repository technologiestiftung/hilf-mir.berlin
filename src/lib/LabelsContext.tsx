import { GristLabelType } from '@common/types/gristData'
import { createContext, useContext } from 'react'

const labelsContext = createContext<GristLabelType[]>([])

export const useLabels = (): GristLabelType[] => {
  const labels = useContext(labelsContext)
  return labels || []
}

export const LabelsProvider = labelsContext.Provider
