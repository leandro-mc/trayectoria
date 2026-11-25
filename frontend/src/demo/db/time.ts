/**
 * Timestamps in the backend's `LocalDateTime` shape (`YYYY-MM-DDTHH:mm:ss`, no zone).
 * date-fns' parseISO reads them as local time, so they are built from local components:
 * a UTC string would show "in 6 hours" in negative-offset time zones.
 */

const DAY_MS = 86_400_000
const pad = (n: number) => String(n).padStart(2, '0')

export function localDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function localDateTime(date: Date): string {
  return `${localDate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export const nowString = () => localDateTime(new Date())

/** Timestamp `days` from now (negative = in the past), optionally shifted by `minutes`. */
export function daysFromNow(days: number, minutes = 0): string {
  return localDateTime(new Date(Date.now() + days * DAY_MS + minutes * 60_000))
}
