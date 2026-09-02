/** Domain seams for the local-first architecture. Persistence and engines arrive in later milestones. */
export interface UserProfile {
  id: string
  displayName: string
  goal: 'muscle_gain' | 'strength' | 'general_fitness' | 'mobility'
  experience: 'beginner' | 'intermediate' | 'advanced'
  availableDays: string[]
  preferredDurationMinutes: number
  equipmentIds: string[]
}

export interface WorkoutPlan {
  id: string
  profileId: string
  version: number
  title: string
  status: 'draft' | 'active' | 'archived'
  createdAt: string
  schedule: PlanScheduleEntry[]
}

export interface PlanScheduleEntry {
  dayOfWeek: number
  workoutDayId?: string
  intent: 'workout' | 'rest' | 'optional'
}

export interface Exercise {
  id: string
  displayName: string
  primaryMuscles: string[]
  equipmentRequired: string[]
  beginnerLevel: 'beginner' | 'intermediate' | 'advanced'
  instructions: string[]
}

export interface WorkoutSession { id: string; profileId: string; planId: string; startedAt: string; status: 'active' | 'completed' | 'abandoned' }
export interface BodyWeightEntry { id: string; profileId: string; recordedAt: string; kilograms: number }
export interface AppSettings { theme: 'light' | 'dark' | 'system'; reducedMotion: boolean; schemaVersion: number }
