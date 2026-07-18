import {
  Brain,
  Activity,
  Bone,
  HeartPulse,
  Ribbon,
  Droplets,
  Scan,
  SmilePlus,
  type LucideIcon,
} from 'lucide-react'

export type AccentColor = 'cyan' | 'blue' | 'purple' | 'emerald'

export interface Specialty {
  id: string
  name: string
  modality: string
  icon: LucideIcon
  accent: AccentColor
  status: 'active' | 'coming-soon'
  statusLabel: string
  statusTone: 'normal' | 'attention' | 'critical'
  blurb: string
  scans: string
  version?: string
}

export const specialties: Specialty[] = [
  {
    id: 'ortho-fracture',
    name: 'Orthopedic Fracture Analysis',
    modality: 'Radiography',
    icon: Bone,
    accent: 'cyan',
    status: 'active',
    statusLabel: 'Online',
    statusTone: 'normal',
    blurb: 'AI-powered fracture detection, localization, and classification with Grad-CAM explainability.',
    scans: '14,280',
    version: 'v1.0',
  },
  {
    id: 'brain-mri',
    name: 'Brain MRI',
    modality: 'Magnetic Resonance',
    icon: Brain,
    accent: 'purple',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    statusTone: 'attention',
    blurb: 'Tumor, lesion & hemorrhage detection with volumetric mapping.',
    scans: '—',
  },
  {
    id: 'chest-xray',
    name: 'Chest X-Ray',
    modality: 'Radiography',
    icon: Activity,
    accent: 'blue',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    statusTone: 'attention',
    blurb: 'Pneumonia, effusion & nodule screening across 14 pathologies.',
    scans: '—',
  },
  {
    id: 'breast-mammo',
    name: 'Breast Screening',
    modality: 'Mammography',
    icon: Ribbon,
    accent: 'purple',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    statusTone: 'attention',
    blurb: 'Mass & micro-calcification detection with BI-RADS support.',
    scans: '—',
  },
  {
    id: 'kidney-ct',
    name: 'Kidney Analysis',
    modality: 'CT Scan',
    icon: Droplets,
    accent: 'emerald',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    statusTone: 'attention',
    blurb: 'Stone, cyst & tumor segmentation with size profiling.',
    scans: '—',
  },
  {
    id: 'cardiac-ct',
    name: 'Cardiac CT',
    modality: 'CT Angiography',
    icon: HeartPulse,
    accent: 'cyan',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    statusTone: 'attention',
    blurb: 'Coronary calcium scoring and chamber assessment.',
    scans: '—',
  },
  {
    id: 'liver-disease',
    name: 'Liver Disease',
    modality: 'Ultrasound / CT',
    icon: Scan,
    accent: 'emerald',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    statusTone: 'attention',
    blurb: 'Hepatic lesion detection, steatosis grading, and cirrhosis staging.',
    scans: '—',
  },
  {
    id: 'dental-ai',
    name: 'Dental AI',
    modality: 'Dental Radiography',
    icon: SmilePlus,
    accent: 'blue',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    statusTone: 'attention',
    blurb: 'Caries detection, periodontal analysis, and implant planning.',
    scans: '—',
  },
]

export const accentHex: Record<AccentColor, string> = {
  cyan: '#22d3ee',
  blue: '#3b82f6',
  purple: '#a78bfa',
  emerald: '#34d399',
}
