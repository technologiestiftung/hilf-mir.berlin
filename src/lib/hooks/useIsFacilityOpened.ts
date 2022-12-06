import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { isAfter, isBefore } from 'date-fns'
import { useEffect, useState } from 'react'

export function isFacilityOpened(record: MinimalRecordType): boolean {
  if (record.open247) return true
  if (!record.start || !record.end) return false
  const today = new Date()
  const todayIsAfterStart = isAfter(today, new Date(record.start))
  const todayIsBeforeEnd = isBefore(today, new Date(record.end))
  return todayIsAfterStart && todayIsBeforeEnd
}

export const useIsFacilityOpened = (record: MinimalRecordType): boolean => {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const updateIsOpened = (): void => setIsOpened(isFacilityOpened(record))
    updateIsOpened()
    const interval = setInterval(updateIsOpened, 1000 * 60)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.open247, record.start, record.end])

  return isOpened
}
