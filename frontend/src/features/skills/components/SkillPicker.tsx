'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useSkillsCatalog } from '../hooks/useSkillsCatalog'
import type { SkillResponse } from '@/types/api.types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

const MAX_SUGGESTIONS = 10

interface SkillPickerProps {
  /** Skills already chosen. */
  selected:  SkillResponse[]
  onAdd:     (skill: SkillResponse) => void
  onRemove:  (skillId: number) => void
  disabled?: boolean
}

/**
 * Tag input with a search dropdown. Follows the ARIA combobox pattern so it works
 * without a mouse: type to search, ↑/↓ to move, Enter to add, Esc to close.
 */
export function SkillPicker({ selected, onAdd, onRemove, disabled = false }: SkillPickerProps) {
  const [search, setSearch]   = useState('')
  const [open, setOpen]       = useState(false)
  const [active, setActive]   = useState(0)          // index of the highlighted suggestion
  const containerRef          = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)
  const listId                = useId()

  const { data: catalog = [], isLoading } = useSkillsCatalog(search)

  const selectedIds = new Set(selected.map((s) => s.id))
  const suggestions = catalog.filter((s) => !selectedIds.has(s.id)).slice(0, MAX_SUGGESTIONS)
  const showList    = open && suggestions.length > 0
  const optionId    = (index: number) => `${listId}-option-${index}`

  // Close the dropdown on a click outside the picker.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function choose(skill: SkillResponse) {
    onAdd(skill)
    setSearch('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!suggestions.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && showList) {
      e.preventDefault()   // do not submit the surrounding form
      const skill = suggestions[Math.min(active, suggestions.length - 1)]
      if (skill) choose(skill)
    }
  }

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <ul aria-label="Skills seleccionadas" className="flex flex-wrap gap-2">
          {selected.map((skill) => (
            <li
              key={skill.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand-text"
            >
              {skill.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(skill.id)}
                  aria-label={`Quitar ${skill.name}`}
                  className="opacity-70 transition-opacity hover:opacity-100"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!disabled && (
        <div ref={containerRef} className="relative">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            {isLoading && search.length >= 2 && (
              <Spinner className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label="Buscar y agregar skills"
              aria-expanded={showList}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={showList ? optionId(Math.min(active, suggestions.length - 1)) : undefined}
              autoComplete="off"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActive(0); setOpen(true) }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar y agregar skills..."
              className="pl-9 pr-3"
            />
          </div>

          {showList && (
            <Card className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden shadow-modal">
              <ul id={listId} role="listbox" aria-label="Skills sugeridas" className="max-h-52 overflow-y-auto py-1">
                {suggestions.map((skill, index) => (
                  <li
                    key={skill.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === active}
                    // mousedown, not click: it fires before the input's blur closes the list.
                    onMouseDown={(e) => { e.preventDefault(); choose(skill) }}
                    onMouseEnter={() => setActive(index)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm text-foreground',
                      index === active && 'bg-brand-tint',
                    )}
                  >
                    <span>{skill.name}</span>
                    {skill.type && <span className="shrink-0 text-xs text-muted-foreground">{skill.type.toLowerCase()}</span>}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {open && search.length >= 2 && !isLoading && suggestions.length === 0 && (
            <Card padding="sm" className="absolute left-0 right-0 top-full z-10 mt-1 text-center">
              <p role="status" className="text-sm text-muted-foreground">No se encontraron skills para “{search}”</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
