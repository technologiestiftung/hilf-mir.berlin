const openningTimesFields = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
]

export const getTodayKey = (): string => {
  const today = new Date()
  const dayIdx = today.getDay()
  return openningTimesFields[dayIdx]
}
