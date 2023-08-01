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
  start: string | null
  end: string | null
}

export const getRecordOpeningTimesBounds = (
  fields: TableRowType['fields']
): OpeningTimesBoundsType => {
  const today = new Date()
  const dayIdx = new Date().getDay()
  const dayKey = openningTimesFields[dayIdx] as keyof typeof fields
  if (!dayKey || typeof fields[dayKey] === 'undefined')
    return { start: null, end: null }
  const openningTimesForToday = fields[dayKey] as string
  const closedRegex = new RegExp('Geschlossen', 'i')
  const isClosed = closedRegex.test(openningTimesForToday)
  if (isClosed) {
    return { start: null, end: null }
  }
  const [from, to] = openningTimesForToday.split('-').map((s) => s.trim())
  if (!from || !to) return { start: null, end: null }
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  const fromValid = timeRegex.test(from)
  const toValid = timeRegex.test(to)
  if (!fromValid || !toValid) return { start: null, end: null }
  const start = getTodayAtTime(from, today).toISOString()
  const end = getTodayAtTime(to, today).toISOString()
  return { start, end }
}
