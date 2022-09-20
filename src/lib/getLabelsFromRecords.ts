import { GristLabelType } from './../common/types/gristData'
import { TableRowType } from '@common/types/gristData'

export const getLabelsFromRecords = (
  records: TableRowType[]
): GristLabelType['fields'][] => {
  const labelsSet = records.reduce((acc, record) => {
    const labels = record.fields.Schlagworte

    console.log(labels)
    labels.forEach((label) => {
      // acc.set(label.fields.key, label.fields)
    })
    return acc
  }, new Map<string, GristLabelType['fields']>())
  return Array.from(labelsSet.values())
}
