/**
 * Sound Architecture — placeholder for future audio integration.
 * No actual audio implementation — only event definitions and no-op hook.
 */

export type SoundEvent =
  | 'scanner-activate'
  | 'laser-calibrate'
  | 'modality-detected'
  | 'ai-complete'
  | 'upload-success'
  | 'report-generated'
  | 'chamber-enter'
  | 'chamber-exit'
  | 'button-hover'
  | 'button-click'
  | 'step-complete'
  | 'organ-hover'

export const soundMap: Record<SoundEvent, { file: string; volume: number; description: string }> = {
  'scanner-activate': { file: '/sounds/scanner-activate.mp3', volume: 0.6, description: 'MRI scanner powering on' },
  'laser-calibrate': { file: '/sounds/laser-calibrate.mp3', volume: 0.4, description: 'Laser alignment chirp' },
  'modality-detected': { file: '/sounds/modality-detected.mp3', volume: 0.5, description: 'AI confirmation chime' },
  'ai-complete': { file: '/sounds/ai-complete.mp3', volume: 0.7, description: 'Analysis complete sound' },
  'upload-success': { file: '/sounds/upload-success.mp3', volume: 0.4, description: 'File accepted notification' },
  'report-generated': { file: '/sounds/report-generated.mp3', volume: 0.5, description: 'Report ready sound' },
  'chamber-enter': { file: '/sounds/chamber-enter.mp3', volume: 0.6, description: 'Chamber activation' },
  'chamber-exit': { file: '/sounds/chamber-exit.mp3', volume: 0.4, description: 'Chamber exit whoosh' },
  'button-hover': { file: '/sounds/button-hover.mp3', volume: 0.15, description: 'Subtle hover tick' },
  'button-click': { file: '/sounds/button-click.mp3', volume: 0.3, description: 'Button press sound' },
  'step-complete': { file: '/sounds/step-complete.mp3', volume: 0.3, description: 'Pipeline step done' },
  'organ-hover': { file: '/sounds/organ-hover.mp3', volume: 0.2, description: 'Organ highlight pulse' },
}

/** Placeholder hook — no-op. Will connect to Web Audio API in future. */
export function useSoundEffect() {
  return (_event: SoundEvent) => {}
}

export function soundAttrs(event: SoundEvent) {
  return { 'data-sound': event } as const
}
