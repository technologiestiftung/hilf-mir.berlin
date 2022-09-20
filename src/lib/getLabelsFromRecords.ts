import { TableRowType } from '@common/types/gristData'
import slugify from 'slugify'

export interface FilterLabelType {
  slug: string
  text: string
}

export const getLabelsFromRecords = (
  records: TableRowType[]
): FilterLabelType[] => {
  const labelsSet = records.reduce((acc, record) => {
    const labels = record.fields.Schlagworte.split(';')
    labels.forEach((label) => {
      const slug = slugify(label, {
        lower: true,
        strict: true,
        trim: true,
      })
      acc.set(slug, { slug, text: label })
    })
    return acc
  }, new Map<string, FilterLabelType>())
  return Array.from(labelsSet.values())
}
