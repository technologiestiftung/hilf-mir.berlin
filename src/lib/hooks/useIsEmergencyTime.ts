import {
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
} from 'date-fns'
import { useEffect, useState } from 'react'

/**
 * Checks whether the number to check is within the given min number and max number. Min and max number are included!
 * @param numToCheck number
 * @param minNum number
 * @param maxNum number
 * @returns boolean
 */
const isWithin = (
  numToCheck: number,
  minNum: number,
  maxNum: number
): boolean => {
  return numToCheck >= minNum && numToCheck <= maxNum
}

/**
 * Emergency times throughout the weekdays.
 * Add an array of start and end time to each day if you want to add
 * a new emergency period.
 */
const EMERGENCY_TIMES = {
  monday: [
    [0, 8],
    [16, 24],
  ],
  tuesday: [
    [0, 8],
    [16, 24],
  ],
  wednesday: [
    [0, 8],
    [16, 24],
  ],
  thursday: [
    [0, 8],
    [16, 24],
  ],
  friday: [
    [0, 8],
    [16, 24],
  ],
  // Note that we currently don't use these keys in the switch statement below
  // because these days ahve emergency hours all day.
  saturday: [[0, 24]],
  sunday: [[0, 24]],
}

type UseIsEmergencyTimeReturnType = boolean | null

export const useIsEmergencyTime = (): UseIsEmergencyTimeReturnType => {
  const [isEmergencyTime, setIsEmergencyTime] =
    useState<UseIsEmergencyTimeReturnType>(null)

  useEffect(() => {
    const now = new Date()

    switch (true) {
      // We first only check for all of saturday and all of sunday because
      // currently these days are emergency times all day (see EMERGENCY_TIMES):
      case isSaturday(now) || isSunday(now):
        setIsEmergencyTime(true)
        break
      case isMonday(now) &&
        EMERGENCY_TIMES.monday.some(([starts_at, ends_at]) => {
          return isWithin(now.getHours(), starts_at, ends_at)
        }):
        setIsEmergencyTime(true)
        break
      case isTuesday(now) &&
        EMERGENCY_TIMES.tuesday.some(([starts_at, ends_at]) => {
          return isWithin(now.getHours(), starts_at, ends_at)
        }):
        setIsEmergencyTime(true)
        break
      case isWednesday(now) &&
        EMERGENCY_TIMES.wednesday.some(([starts_at, ends_at]) => {
          return isWithin(now.getHours(), starts_at, ends_at)
        }):
        setIsEmergencyTime(true)
        break
      case isThursday(now) &&
        EMERGENCY_TIMES.thursday.some(([starts_at, ends_at]) => {
          return isWithin(now.getHours(), starts_at, ends_at)
        }):
        setIsEmergencyTime(true)
        break
      case isFriday(now) &&
        EMERGENCY_TIMES.friday.some(([starts_at, ends_at]) => {
          return isWithin(now.getHours(), starts_at, ends_at)
        }):
        setIsEmergencyTime(true)
        break
      default:
        setIsEmergencyTime(false)
    }
  }, [])

  return isEmergencyTime
}
