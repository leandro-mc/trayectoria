// Shared left panel for the /ai/* split-panel pages: tabs (Currículums | Entrevistas) plus the list of the active one.
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckCircle2, Clock, FileText, MessageSquare } from 'lucide-react'
import { ListEmpty, ListSkeleton, SelectableRow } from './AIListParts'
import { IconTile } from '@/components/shared/brand/IconTile'
import { ROUTES } from '@/config/routes'
import { useCurricula } from '@/features/ai/curricula/hooks/useCurricula'
import { useInterviews } from '@/features/ai/interviews/hooks/useInterviews'
import { formatDate } from '@/lib/utils/date'
import { cn } from '@/lib/utils'

const TABS = [
  { href: ROUTES.curricula,  label: 'Currículums', icon: FileText      },
  { href: ROUTES.interviews, label: 'Entrevistas', icon: MessageSquare },
] as const

function AITabs() {
  const pathname = usePathname()

  return (
    <nav aria-label="Secciones de IA" className="flex shrink-0 border-b border-border">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-xs font-semibold transition-colors',
              active ? 'border-primary text-brand-text' : 'border-transparent text-muted-foreground hover:text-secondary-foreground',
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

interface ListProps {
  selectedId: number | null
  onSelect:   (id: number) => void
}

function CurriculaList({ selectedId, onSelect }: ListProps) {
  const { data: curricula = [], isLoading } = useCurricula()

  if (isLoading) return <ListSkeleton rows={3} />
  if (curricula.length === 0) return <ListEmpty icon={FileText} title="Sin currículums" action="CV personalizado" />

  return (
    <div className="divide-y divide-border-soft">
      {curricula.map((cv) => (
        <SelectableRow
          key={cv.id}
          selected={selectedId === cv.id}
          onSelect={() => onSelect(cv.id)}
          leading={<IconTile icon={FileText} />}
          title={cv.jobOfferTitle ?? 'Currículum general'}
          subtitle={formatDate(cv.createdAt)}
        />
      ))}
    </div>
  )
}

function InterviewsList({ selectedId, onSelect }: ListProps) {
  const { data: interviews = [], isLoading } = useInterviews()

  if (isLoading) return <ListSkeleton rows={2} />
  if (interviews.length === 0) return <ListEmpty icon={MessageSquare} title="Sin entrevistas" action="Entrevista IA" />

  return (
    <div className="divide-y divide-border-soft">
      {interviews.map((iv) => {
        const done = iv.status === 'COMPLETED'
        const StatusIcon = done ? CheckCircle2 : Clock
        return (
          <SelectableRow
            key={iv.id}
            selected={selectedId === iv.id}
            onSelect={() => onSelect(iv.id)}
            leading={
              <span aria-hidden="true" className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', done ? 'bg-success-tint' : 'bg-brand-tint')}>
                <StatusIcon className={cn('size-4', done ? 'text-success-text' : 'text-brand-text')} />
              </span>
            }
            title={iv.jobOfferTitle ?? 'Entrevista'}
            subtitle={`${done ? 'Completada' : 'En progreso'} · ${formatDate(iv.createdAt)}`}
            subtitleClassName={done ? 'text-success-text' : 'text-brand-text'}
          />
        )
      })}
    </div>
  )
}

interface AILeftPanelProps extends ListProps {
  section: 'curricula' | 'interviews'
}

export function AILeftPanel({ section, selectedId, onSelect }: AILeftPanelProps) {
  return (
    <div className="flex h-full flex-col bg-card">
      <AITabs />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {section === 'curricula'
          ? <CurriculaList selectedId={selectedId} onSelect={onSelect} />
          : <InterviewsList selectedId={selectedId} onSelect={onSelect} />}
      </div>
    </div>
  )
}
