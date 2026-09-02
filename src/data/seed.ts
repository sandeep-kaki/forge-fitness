import { APP_SCHEMA_VERSION, type LocalAppData } from '../domain/types'

/** Local example only. It is not selected as a user's plan or workout logic. */
export function createSeedAppData(): LocalAppData {
  const now = new Date().toISOString()
  const profileId = crypto.randomUUID()
  return { schemaVersion: APP_SCHEMA_VERSION, profile: { id: profileId, displayName: 'Alex', goal: 'muscle_gain', experience: 'beginner', availableDays: [1, 2, 4], preferredDurationMinutes: 45, preferredTrainingTime: '09:00', createdAt: now, updatedAt: now }, inventory: { profileId, availableEquipmentIds: ['dumbbells', 'adjustable-bench', 'cable-station'], updatedAt: now }, safety: { acknowledgedAt: now, version: 1, understandsEmergencyStop: true, understandsNotMedicalAdvice: true }, workoutSettings: { preferredDurationMinutes: 45, voiceEnabled: false, announceRestCountdown: false }, appSettings: { theme: 'dark', reducedMotion: false, schemaVersion: APP_SCHEMA_VERSION }, plans: [] }
}
