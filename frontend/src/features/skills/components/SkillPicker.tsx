'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useSkillsCatalog } from '../hooks/useSkillsCatalog'
import type { SkillResponse } from '@/types/api.types'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'

interface SkillPickerProps {
  // Skills the candidate already has
  selected:  SkillResponse[]
  onAdd:     (skill: SkillResponse) => void
  onRemove:  (skillId: number) => void
  disabled?: boolean
}

export function SkillPicker({
  selected,
  onAdd,
  onRemove,
  disabled = false,
}: SkillPickerProps) {
  const [search, setSearch]   = useState('')
  const [open, setOpen]       = useState(false)
  const containerRef          = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  const { data: catalog = [], isLoading } = useSkillsCatalog(search)

  const selectedIds = new Set(selected.map((s) => s.id))

  // Filter out already selected skills from suggestions
  const suggestions = catalog.filter((s) => !selectedIds.has(s.id))

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(skill: SkillResponse) {
    onAdd(skill)
    setSearch('')
    setOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-3">

      {/*  Selected skills as tags  */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-tint border border-brand-200 dark:border-brand-800 text-xs font-medium text-brand-700 dark:text-brand-300"
            >
              {skill.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(skill.id)}
                  className="text-brand-400 hover:text-brand-text dark:hover:text-brand-200 transition-colors"
                  aria-label={`Quitar ${skill.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/*  Search input + dropdown  */}
      {!disabled && (
        <div ref={containerRef} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            {isLoading && search.length >= 2 && (
              <Spinner className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            )}
            <Input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              placeholder="Buscar y agregar skills..." className="pl-9 pr-3"
            />
          </div>

          {/* Dropdown */}
          {open && suggestions.length > 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-modal overflow-hidden">
              <ul className="max-h-52 overflow-y-auto py-1">
                {suggestions.slice(0, 10).map((skill) => (
                  <li key={skill.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        // mousedown fires before blur — prevent input from losing focus
                        e.preventDefault()
                        handleSelect(skill)
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3',
                        'hover:bg-brand-tint transition-colors',
                        'text-neutral-800 dark:text-neutral-200',
                      )}
                    >
                      <span>{skill.name}</span>
                      {skill.type && (
                        <span className="text-xs text-neutral-400 shrink-0">
                          {skill.type.toLowerCase()}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results */}
          {open && search.length >= 2 && !isLoading && suggestions.length === 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-card p-4 text-center">
              <p className="text-sm text-neutral-400">
                No se encontraron skills para “{search}”
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
