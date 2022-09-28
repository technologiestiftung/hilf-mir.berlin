import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { isAfter, isBefore } from 'date-fns'
import { useEffect, useState } from 'react'

export const useIsFacilityOpened = (record: MinimalRecordType): boolean => {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const updateIsOpened = (): void => {
      if (record.open247) return setIsOpened(true)
      if (!record.start || !record.end) return setIsOpened(false)
      const today = new Date()
      const todayIsAfterStart = isAfter(today, new Date(record.start))
      const todayIsBeforeEnd = isBefore(today, new Date(record.end))
      const isInRange = todayIsAfterStart && todayIsBeforeEnd

      setIsOpened(isInRange)
    }
    updateIsOpened()
    const interval = setInterval(updateIsOpened, 1000 * 60)
    return () => clearInterval(interval)
  }, [record.open247, record.start, record.end])

  return isOpened
}
