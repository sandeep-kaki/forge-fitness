import { APP_SCHEMA_VERSION, type AppTheme, type LocalAppData } from '../domain/types'

const themes: AppTheme[] = ['light', 'dark', 'system']
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string')
const isNumberArray = (value: unknown): value is number[] => Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 0 && item <= 6)

/** Narrow, dependency-free validation at the persistence boundary. */
export function isValidLocalAppData(value: unknown): value is LocalAppData {
  if (!isObject(value) || value.schemaVersion !== APP_SCHEMA_VERSION || !isObject(value.profile) || !isObject(value.inventory) || !isObject(value.safety) || !isObject(value.workoutSettings) || !isObject(value.appSettings)) return false
  const { profile, inventory, safety, workoutSettings, appSettings } = value
  return typeof profile.id === 'string' && typeof profile.displayName === 'string' && isNumberArray(profile.availableDays) && typeof inventory.profileId === 'string' && isStringArray(inventory.availableEquipmentIds) && typeof safety.acknowledgedAt === 'string' && safety.understandsEmergencyStop === true && safety.understandsNotMedicalAdvice === true && [30, 45, 60].includes(workoutSettings.preferredDurationMinutes as number) && themes.includes(appSettings.theme as AppTheme) && typeof appSettings.reducedMotion === 'boolean' && Array.isArray(value.plans)
}
