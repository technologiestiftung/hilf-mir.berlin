import { TableRowType } from '@common/types/gristData'
import { isAfter, isBefore, setHours, setMinutes } from 'date-fns'
import { useEffect, useState } from 'react'

const openningTimesFields = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
]

const getTodayAtTime = (timeString: string, today: Date): Date => {
  const [hours, minutes] = timeString
    .trim()
    .split(':')
    .map((d) => parseInt(d, 10))
  const newDate = new Date(today)
  const newDateWithHours = setHours(newDate, hours)
  const newDateWithMinutes = setMinutes(newDateWithHours, minutes)
  return newDateWithMinutes
}

export const useIsFacilityOpened = (
  fields: TableRowType['fields']
): boolean => {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const updateIsOpened = (): void => {
      if (fields['c24_h_7_Tage'] === 'ja') {
        setIsOpened(true)
        return
      }
      const today = new Date()
      const dayIdx = new Date().getDay()
      const dayKey = openningTimesFields[dayIdx] as keyof typeof fields
      if (!dayKey || typeof fields[dayKey] === 'undefined') return
      const openningTimesForToday = fields[dayKey] as string
      const [from, to] = openningTimesForToday.split('-').map((s) => s.trim())
      const startAtTime = getTodayAtTime(from, today)
      const endAtTime = getTodayAtTime(to, today)
      const todayIsAfterStart = isAfter(today, startAtTime)
      const todayIsBeforeEnd = isBefore(today, endAtTime)
      const isInRange = todayIsAfterStart && todayIsBeforeEnd

      setIsOpened(isInRange)
    }
    updateIsOpened()
    const interval = setInterval(updateIsOpened, 1000 * 60)
    return () => clearInterval(interval)
  }, [fields])

  return isOpened
}
