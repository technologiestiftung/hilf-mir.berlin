import { GristLabelType } from '@common/types/gristData'
import { MinimalRecordType } from './mapRecordToMinimum'

interface GetFilteredFacilitiesPropType {
  facilities: MinimalRecordType[]
  labels: GristLabelType[]
}

interface IsFaclilityActivePropType {
  activeTargetLabels: GristLabelType[]
  activeTopcisLabels: GristLabelType[]
  facility: MinimalRecordType
  isFilteredByTarget: boolean
  isFilteredByTopic: boolean
}

export const isFaclilityActive = ({
  activeTargetLabels,
  activeTopcisLabels,
  isFilteredByTarget,
  isFilteredByTopic,
  facility,
}: IsFaclilityActivePropType): boolean => {
  if (!isFilteredByTopic && !isFilteredByTarget) return true
  const hasSomeOfTheActiveTopics =
    activeTopcisLabels?.some((tag) => facility.labels.includes(tag.id)) || false
  const hasAnActiveTarget =
    (activeTargetLabels[0] &&
      facility.labels.includes(activeTargetLabels[0].id)) ||
    false

  if (!isFilteredByTopic && isFilteredByTarget) return hasAnActiveTarget
  if (isFilteredByTopic && !isFilteredByTarget) return hasSomeOfTheActiveTopics
  return hasSomeOfTheActiveTopics && hasAnActiveTarget
}

export const getActiveLabelGroups = (labels: GristLabelType[]) => ({
  activeTopcisLabels: labels.filter(
    (f) => f.isActive && f.fields.group2 !== 'zielpublikum'
  ),
  activeTargetLabels: labels.filter(
    (f) => f.isActive && f.fields.group2 === 'zielpublikum'
  ),
})

export const getFilteredFacilities = ({
  facilities,
  labels,
}: GetFilteredFacilitiesPropType): MinimalRecordType[] => {
  const { activeTopcisLabels, activeTargetLabels } =
    getActiveLabelGroups(labels)
  const isFilteredByTopic = activeTopcisLabels.length > 0
  const isFilteredByTarget = activeTargetLabels.length > 0
  if (!isFilteredByTopic && !isFilteredByTarget) return facilities
  return facilities.filter((facility) => {
    return isFaclilityActive({
      facility,
      activeTopcisLabels,
      activeTargetLabels,
      isFilteredByTopic,
      isFilteredByTarget,
    })
  })
}
