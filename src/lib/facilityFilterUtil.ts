import { GristLabelType } from '@common/types/gristData'
import { MinimalRecordType } from './mapRecordToMinimum'

interface GetFilteredFacilitiesPropType {
  facilities: MinimalRecordType[]
  labels: GristLabelType[]
  activeIdsBySearchTerm: MinimalRecordType['id'][] | null
}

interface IsFaclilityActivePropType {
  activeTargetLabels: GristLabelType[]
  activeTopcisLabels: GristLabelType[]
  facilityLabels: GristLabelType['id'][]
  facilityId: MinimalRecordType['id']
  activeIdsBySearchTerm: MinimalRecordType['id'][] | null
}

type GetFilterStatusType = (props: {
  activeIdsBySearchTerm: MinimalRecordType['id'][] | null
  activeTargetLabels: GristLabelType[]
  activeTopcisLabels: GristLabelType[]
}) => {
  isFilteredByTopic: boolean
  isFilteredByTarget: boolean
  isFilteredBySearchTerm: boolean
  isNotFilteredAtAll: boolean
}

export const getFilterStatus: GetFilterStatusType = ({
  activeIdsBySearchTerm,
  activeTargetLabels,
  activeTopcisLabels,
}) => {
  const isFilteredBySearchTerm = activeIdsBySearchTerm !== null
  const isFilteredByTopic = activeTopcisLabels.length > 0
  const isFilteredByTarget = activeTargetLabels.length > 0
  return {
    isFilteredByTopic,
    isFilteredByTarget,
    isFilteredBySearchTerm,
    isNotFilteredAtAll:
      !isFilteredByTopic && !isFilteredByTarget && !isFilteredBySearchTerm,
  }
}

export const isFaclilityActive = ({
  activeTargetLabels,
  activeTopcisLabels,
  facilityLabels,
  facilityId,
  activeIdsBySearchTerm,
}: IsFaclilityActivePropType): boolean => {
  const {
    isNotFilteredAtAll,
    isFilteredByTopic,
    isFilteredByTarget,
    isFilteredBySearchTerm,
  } = getFilterStatus({
    activeIdsBySearchTerm,
    activeTargetLabels,
    activeTopcisLabels,
  })
  if (isNotFilteredAtAll) return true
  const hasAllOfTheActiveTopics =
    activeTopcisLabels?.every((tag) => facilityLabels.includes(tag.id)) || false
  const hasAnActiveTarget =
    (activeTargetLabels[0] &&
      facilityLabels.includes(activeTargetLabels[0].id)) ||
    false
  const includesTextSearchTerm =
    activeIdsBySearchTerm !== null && activeIdsBySearchTerm.includes(facilityId)

  if (!includesTextSearchTerm) return false

  if (!isFilteredByTopic && !isFilteredBySearchTerm && isFilteredByTarget)
    return hasAnActiveTarget
  if (isFilteredByTopic && !isFilteredBySearchTerm && !isFilteredByTarget)
    return hasAllOfTheActiveTopics
  if (isFilteredByTopic && isFilteredBySearchTerm && !isFilteredByTarget)
    return hasAllOfTheActiveTopics && includesTextSearchTerm
  if (!isFilteredByTopic && isFilteredBySearchTerm && isFilteredByTarget)
    return hasAnActiveTarget && includesTextSearchTerm
  if (!isFilteredByTopic && isFilteredBySearchTerm && !isFilteredByTarget)
    return includesTextSearchTerm
  return hasAllOfTheActiveTopics && hasAnActiveTarget && includesTextSearchTerm
}

export const getActiveLabelGroups = (
  labels: GristLabelType[]
): {
  activeTopcisLabels: GristLabelType[]
  activeTargetLabels: GristLabelType[]
} => ({
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
  activeIdsBySearchTerm,
}: GetFilteredFacilitiesPropType): MinimalRecordType[] => {
  const { activeTopcisLabels, activeTargetLabels } =
    getActiveLabelGroups(labels)
  const { isNotFilteredAtAll } = getFilterStatus({
    activeIdsBySearchTerm,
    activeTargetLabels,
    activeTopcisLabels,
  })
  if (isNotFilteredAtAll) return facilities
  return facilities.filter((facility) => {
    return isFaclilityActive({
      facilityLabels: facility.labels,
      facilityId: facility.id,
      activeTopcisLabels,
      activeTargetLabels,
      activeIdsBySearchTerm,
    })
  })
}
