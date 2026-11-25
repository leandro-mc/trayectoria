/**
 * "Newest first" comparator. Timestamps have one-second resolution, so two records created
 * within the same second tie; the higher id (inserted later) wins, as a real timestamp would.
 */
export const newestFirst = <T extends { id: number }>(date: (item: T) => string) =>
  (a: T, b: T): number => date(b).localeCompare(date(a)) || b.id - a.id
