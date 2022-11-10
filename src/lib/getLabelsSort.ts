import { GristLabelType } from '@common/types/gristData'
import { PageQueryType } from './mapRawQueryToState'

const labelIsActive = (
  urlState: PageQueryType,
  label: GristLabelType
): boolean => !!urlState.tags?.includes(label.id)

export const getLabelsSort =
  (urlState: PageQueryType) =>
  (a: GristLabelType, b: GristLabelType): number => {
    const aIsActive = labelIsActive(urlState, a)
    const bIsActive = labelIsActive(urlState, b)
    if (aIsActive && bIsActive) return 0
    if (aIsActive && !bIsActive) return -1
    if (!aIsActive && !bIsActive) return 0
    if (!aIsActive && bIsActive) return 1
    return 0
  }
