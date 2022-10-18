import { GristLabelType } from '@common/types/gristData'
import { useLabels } from '@lib/LabelsContext'

interface UseRecordLabelsReturnType {
  allLabels: GristLabelType[]
  topicsLabels: GristLabelType[]
  targetAudienceLabels: GristLabelType[]
}

export const useRecordLabels = (
  labels: number[]
): UseRecordLabelsReturnType => {
  const labelsWithData = useLabels()
  const recordLabels = labels
    .map((lId) => labelsWithData.find((l) => l.id === lId))
    .filter(Boolean) as GristLabelType[]
  const topicsLabels = recordLabels.filter(
    ({ fields }) => fields.group2 !== 'zielpublikum'
  )
  const targetAudienceLabels = recordLabels.filter(
    ({ fields }) => fields.group2 === 'zielpublikum'
  )

  return {
    allLabels: recordLabels,
    topicsLabels,
    targetAudienceLabels,
  }
}
