import { GristLabelType } from '@common/types/gristData'
import { MinimalRecordType } from './mapRecordToMinimum'

interface GetFilteredFacilitiesPropType {
  facilities: MinimalRecordType[]
  labels: GristLabelType[]
  activeIdsBySearchTerm: MinimalRecordType['id'][] | null
}

interface isFacilityActivePropType {
  activeTargetLabels: GristLabelType[]
  activeTopicsLabels: GristLabelType[]
  facilityLabels: GristLabelType['id'][]
  facilityId: MinimalRecordType['id']
  activeIdsBySearchTerm: MinimalRecordType['id'][] | null
}

type GetFilterStatusType = (props: {
  activeIdsBySearchTerm: MinimalRecordType['id'][] | null
  activeTargetLabels: GristLabelType[]
  activeTopicsLabels: GristLabelType[]
}) => {
  isFilteredByTopic: boolean
  isFilteredByTarget: boolean
  isFilteredBySearchTerm: boolean
  isNotFilteredAtAll: boolean
}

export const getFilterStatus: GetFilterStatusType = ({
  activeIdsBySearchTerm,
  activeTargetLabels,
  activeTopicsLabels,
}) => {
  const isFilteredBySearchTerm = activeIdsBySearchTerm !== null
  const isFilteredByTopic = activeTopicsLabels.length > 0
  const isFilteredByTarget = activeTargetLabels.length > 0
  return {
    isFilteredByTopic,
    isFilteredByTarget,
    isFilteredBySearchTerm,
    isNotFilteredAtAll:
      !isFilteredByTopic && !isFilteredByTarget && !isFilteredBySearchTerm,
  }
}

const MAX_TEXT_SEARCH_STRING_LENGTH = 100
export function truncateSearchTerm(searchTerm: unknown): string {
  if (typeof searchTerm !== 'string') return ''
  return searchTerm.slice(0, MAX_TEXT_SEARCH_STRING_LENGTH)
}

export const isFacilityActive = ({
  activeTargetLabels,
  activeTopicsLabels,
  facilityLabels,
  facilityId,
  activeIdsBySearchTerm,
}: isFacilityActivePropType): boolean => {
  const {
    isNotFilteredAtAll,
    isFilteredByTopic,
    isFilteredByTarget,
    isFilteredBySearchTerm,
  } = getFilterStatus({
    activeIdsBySearchTerm,
    activeTargetLabels,
    activeTopicsLabels,
  })
  if (isNotFilteredAtAll) return true
  const hasAllOfTheActiveTopics =
    activeTopicsLabels?.every((tag) => facilityLabels.includes(tag.id)) || false
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
  activeTopicsLabels: GristLabelType[]
  activeTargetLabels: GristLabelType[]
} => ({
  activeTopicsLabels: labels.filter(
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
  const { activeTopicsLabels, activeTargetLabels } =
    getActiveLabelGroups(labels)
  const { isNotFilteredAtAll } = getFilterStatus({
    activeIdsBySearchTerm,
    activeTargetLabels,
    activeTopicsLabels,
  })
  if (isNotFilteredAtAll) return facilities
  return facilities.filter((facility) => {
    return isFacilityActive({
      facilityLabels: facility.labels,
      facilityId: facility.id,
      activeTopicsLabels,
      activeTargetLabels,
      activeIdsBySearchTerm,
    })
  })
}
