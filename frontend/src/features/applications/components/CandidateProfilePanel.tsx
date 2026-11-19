// Right panel — shows candidate info from the application response +
// - curriculumId != null → show the personalized CV attached to the application
// - curriculumId == null → fetch base curriculum from candidate's profile data

'use client'

import { Mail, FileText } from 'lucide-react'
import { useCurriculum, useBaseCurriculum,} from '@/features/ai/curricula/hooks/useCurricula'
import { CurriculumDisplay } from '@/features/ai/curricula/components/CurriculumDisplay'
import { formatDate } from '@/lib/utils/date'
import type { JobApplicationResponse } from '../types/applications.types'
import { SkeletonLines } from '@/components/ui/skeleton'
import { IconTile } from '@/components/shared/brand/IconTile'
import { ApplicationStatusBadge } from '@/components/shared/data/StatusBadge'

//  Curriculum loaders 

function CurriculumSkeleton() {
  return (
    <SkeletonLines count={5} className="space-y-2" />
  )
}

// Personalized CV — candidate explicitly attached this to the application
function AttachedCurriculum({ id }: { id: number }) {
  const { data: cv, isLoading } = useCurriculum(id)

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <IconTile icon={FileText} size="sm" />
        <h3 className="text-xs font-bold text-brand-text">
          Currículum personalizado adjunto
        </h3>
      </div>
      {isLoading
        ? <CurriculumSkeleton />
        : cv
          ? <CurriculumDisplay content={cv.content} compact />
          : <p className="text-xs text-muted-foreground italic">No se pudo cargar el currículum.</p>
      }
    </>
  )
}

// Base CV — built from candidate's profile, no AI, not stored in DB
function BaseCurriculum({ candidateId }: { candidateId: number }) {
  const { data: cv, isLoading } = useBaseCurriculum(candidateId)

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded bg-border flex items-center justify-center shrink-0">
          <FileText className="w-3 h-3 text-muted-foreground" />
        </div>
        <h3 className="text-xs font-bold text-muted-foreground">
          Perfil del candidato
        </h3>
      </div>
      {isLoading
        ? <CurriculumSkeleton />
        : cv
          ? <CurriculumDisplay content={cv.content} compact />
          : <p className="text-xs text-muted-foreground italic">No hay información de perfil disponible.</p>
      }
    </>
  )
}

//  Main panel 

interface CandidateProfilePanelProps {
  application: JobApplicationResponse
}

export function CandidateProfilePanel({ application }: CandidateProfilePanelProps) {
  const {
    candidateFirstName: firstName,
    candidateLastName:  lastName,
    candidateEmail:     email,
    candidateId,
    curriculumId,
    status,
    appliedAt,
  } = application

  const fullName = [firstName, lastName].filter(Boolean).join(' ') ||
    email ||
    `Candidato #${candidateId}`

  const initials = (firstName?.[0] ?? email?.[0] ?? '?').toUpperCase()

  return (
    <div className="flex flex-col h-full bg-card">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-tint-strong flex items-center justify-center text-base font-bold text-brand-text shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground truncate">
              {fullName}
            </h2>
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1 text-xs text-brand-text hover:text-brand-text mt-0.5"
              >
                <Mail className="w-3 h-3" />
                {email}
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <ApplicationStatusBadge status={status} />
          <span className="text-xs text-muted-foreground">
            Postulado {formatDate(appliedAt)}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
        {curriculumId != null
          ? <AttachedCurriculum id={curriculumId} />
          : <BaseCurriculum candidateId={candidateId} />
        }
      </div>
    </div>
  )
}