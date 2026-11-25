/** Spanish list: "A", "A y B", "A, B y C". */
export function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
}

/** Case-insensitive intersection, keeping `source` order and spelling. */
export function overlap(source: readonly string[], reference: readonly string[]): string[] {
  const wanted = new Set(reference.map((s) => s.toLowerCase()))
  return source.filter((s) => wanted.has(s.toLowerCase()))
}

export function without(source: readonly string[], excluded: readonly string[]): string[] {
  const out = new Set(excluded.map((s) => s.toLowerCase()))
  return source.filter((s) => !out.has(s.toLowerCase()))
}
