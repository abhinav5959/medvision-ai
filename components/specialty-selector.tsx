'use client'

import { motion } from 'motion/react'
import { specialties, accentHex } from '@/lib/specialties'
import type { View } from '@/components/top-nav'
import { SectionHeader, MedicalCard } from '@/components/ui'

export function SpecialtySelector({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-28 pb-20">
      <SectionHeader
        eyebrow="Specialty Engine"
        title="Medical Specialties"
        description="Select your imaging specialty. Orthopedic Fracture Analysis is live in V1. Additional specialties are in development and will be activated as they clear validation."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {specialties.map((spec, i) => (
          <motion.div
            key={spec.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <MedicalCard
              title={spec.name}
              subtitle={spec.blurb}
              modality={spec.modality}
              accentHex={accentHex[spec.accent]}
              status={spec.status === 'active' ? (spec.statusTone as any) : 'coming-soon'}
              statusLabel={spec.statusLabel}
              scansCount={spec.scans}
              icon={spec.icon}
              onSelect={() => onNavigate('upload')}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

