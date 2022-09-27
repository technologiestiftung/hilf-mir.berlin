import { TableRowType } from '@common/types/gristData'
import { setHours, setMinutes } from 'date-fns'

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

export interface OpeningTimesBoundsType {
  start: string | undefined
  end: string | undefined
}

export const getTodayKey = (): string => {
  const today = new Date()
  const dayIdx = today.getDay()
  return openningTimesFields[dayIdx]
}

export const getRecordOpeningTimesBounds = (
  fields: TableRowType['fields']
): OpeningTimesBoundsType => {
  const today = new Date()
  const dayIdx = new Date().getDay()
  const dayKey = openningTimesFields[dayIdx] as keyof typeof fields
  if (!dayKey || typeof fields[dayKey] === 'undefined')
    return { start: undefined, end: undefined }
  const openningTimesForToday = fields[dayKey] as string
  const [from, to] = openningTimesForToday.split('-').map((s) => s.trim())
  const start = getTodayAtTime(from, today).toISOString()
  const end = getTodayAtTime(to, today).toISOString()
  return { start, end }
}
