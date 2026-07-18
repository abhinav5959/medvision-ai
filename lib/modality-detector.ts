import { specialties } from '@/lib/specialties'

export interface ModalityResult {
  specialtyId: string
  displayName: string
  organKey: string
  modality: string
}

/**
 * Automatic modality detection from filename.
 *
 * For V1, everything routes to Orthopedic Fracture Analysis.
 * In production, the backend would perform actual modality detection.
 */

const patterns: { keywords: string[]; specId: string; organKey: string }[] = [
  { keywords: ['bone', 'fracture', 'ortho', 'skeletal', 'wrist', 'femur', 'tibia', 'humerus', 'spine', 'vertebra', 'radius', 'ulna', 'ankle', 'elbow', 'shoulder', 'pelvis', 'hip'], specId: 'ortho-fracture', organKey: 'bones' },
  { keywords: ['brain', 'mri', 'neuro', 'cranial', 'head', 'flair', 't1', 't2'], specId: 'brain-mri', organKey: 'brain' },
  { keywords: ['chest', 'lung', 'thorax', 'cxr', 'pneumonia'], specId: 'chest-xray', organKey: 'lungs' },
  { keywords: ['breast', 'mammo', 'mammograph', 'birads'], specId: 'breast-mammo', organKey: 'breast' },
  { keywords: ['kidney', 'renal', 'nephro', 'ureter', 'stone'], specId: 'kidney-ct', organKey: 'kidneys' },
  { keywords: ['cardiac', 'heart', 'coronary', 'aorta', 'cardio'], specId: 'cardiac-ct', organKey: 'heart' },
]

export function detectModality(fileName: string): ModalityResult {
  const lower = fileName.toLowerCase().replace(/[_\-\.]/g, ' ')

  for (const pattern of patterns) {
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) {
        const spec = specialties.find((s) => s.id === pattern.specId)
        return {
          specialtyId: pattern.specId,
          displayName: spec?.name ?? pattern.specId,
          organKey: pattern.organKey,
          modality: spec?.modality ?? 'Unknown',
        }
      }
    }
  }

  // V1 Default: Orthopedic Fracture Analysis
  const defaultSpec = specialties.find((s) => s.id === 'ortho-fracture')!
  return {
    specialtyId: 'ortho-fracture',
    displayName: defaultSpec.name,
    organKey: 'bones',
    modality: defaultSpec.modality,
  }
}
