/** Domain-only contracts. UI never depends on a plan's exercise logic. */
export const APP_SCHEMA_VERSION = 1
export type TrainingGoal = 'muscle_gain' | 'strength' | 'general_fitness' | 'mobility'
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type AppTheme = 'light' | 'dark' | 'system'

export interface UserProfile { id: string; displayName: string; goal: TrainingGoal; experience: ExperienceLevel; availableDays: number[]; preferredDurationMinutes: 30 | 45 | 60; preferredTrainingTime?: string; targetWeightKg?: number; createdAt: string; updatedAt: string }
export interface EquipmentItem { id: string; name: string; plainDescription: string; category: 'machine' | 'free_weight' | 'station' | 'bodyweight' }
export interface EquipmentInventory { profileId: string; availableEquipmentIds: string[]; updatedAt: string }
export interface SafetyAcknowledgement { acknowledgedAt: string; version: number; understandsEmergencyStop: boolean; understandsNotMedicalAdvice: boolean }
export interface WorkoutSettings { preferredDurationMinutes: 30 | 45 | 60; voiceEnabled: boolean; announceRestCountdown: boolean }
export interface AppSettings { theme: AppTheme; reducedMotion: boolean; schemaVersion: number }
export interface WorkoutPlan { id: string; profileId: string; version: number; title: string; status: 'draft' | 'active' | 'archived'; createdAt: string; source: 'seed' | 'chatgpt_import' | 'manual' | 'ai_generated'; schedule: PlanScheduleEntry[]; workoutDays: WorkoutDay[] }
export interface PlanScheduleEntry { dayOfWeek: number; workoutDayId?: string; intent: 'workout' | 'rest' | 'optional' }
export interface WorkoutDay { id: string; title: string; estimatedMinutes: number; exercises: WorkoutExercise[] }
export interface WorkoutExercise { exerciseId: string; sets: number; repRange: { min: number; max: number }; restSeconds: number; priority: 'primary' | 'accessory'; notes?: string }
export interface Exercise { id: string; displayName: string; primaryMuscles: string[]; equipmentRequired: string[]; beginnerLevel: ExperienceLevel; instructions: string[] }
export interface ExerciseVideo { title: string; creator: string; platform: 'youtube'; url: string; durationSeconds?: number; verified: boolean; lastReviewedAt: string }
export interface ExerciseSubstitution { exerciseId: string; score: number; reason: string }
export interface ExerciseLibraryEntry extends Exercise { secondaryMuscles: string[]; movementPattern: 'horizontal_push' | 'horizontal_pull' | 'vertical_pull' | 'knee_dominant' | 'hip_hinge' | 'isolation'; setupInstructions: string[]; breathingCue: string; tempoCue?: string; commonMistakes: string[]; safetyNotes: string[]; regressions: string[]; progressions: string[]; substitutions: ExerciseSubstitution[]; mediaType: 'youtube' | 'none'; videos: ExerciseVideo[] }
export interface WorkoutSession { id: string; profileId: string; planId: string; startedAt: string; status: 'active' | 'completed' | 'abandoned' }
export interface BodyWeightEntry { id: string; profileId: string; recordedAt: string; kilograms: number }
export interface LocalAppData { schemaVersion: typeof APP_SCHEMA_VERSION; profile: UserProfile; inventory: EquipmentInventory; safety: SafetyAcknowledgement; workoutSettings: WorkoutSettings; appSettings: AppSettings; /** Future imports write a validated, versioned plan here. */ activePlanId?: string; plans: WorkoutPlan[] }
