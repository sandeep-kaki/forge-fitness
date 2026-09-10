/** Domain-only contracts. UI never depends on a plan's exercise logic. */
export const APP_SCHEMA_VERSION = 2
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
export type WorkoutMode = 'ready' | 'set_active' | 'resting' | 'waiting_for_equipment' | 'safety_stop'
export interface ExerciseSet { id: string; completedAt: string; weightKg: number; reps: number; rir?: 0 | 1 | 2 | 3; form: 'good' | 'needs_attention'; pain: boolean }
export interface SessionExercise { plannedExerciseId: string; exerciseId: string; targetSets: number; repRange: { min: number; max: number }; restSeconds: number; priority: 'primary' | 'accessory'; sets: ExerciseSet[]; skipped?: boolean; substitutionFor?: string }
export interface SubstitutionEvent { id: string; at: string; fromExerciseId: string; toExerciseId: string }
export interface SafetyEvent { id: string; at: string; symptom: string }
export interface WorkoutSession {
  id: string; profileId: string; planId: string; workoutDayId: string; title: string; startedAt: string; completedAt?: string; status: 'active' | 'completed' | 'abandoned';
  exercises: SessionExercise[]; currentExerciseIndex: number; mode: WorkoutMode; restStartedAt?: string; waitStartedAt?: string; totalWaitSeconds: number; substitutions: SubstitutionEvent[]; safetyEvents: SafetyEvent[]; reflection?: { energy: number; difficulty: number; pain: boolean }
}
export interface BodyWeightEntry { id: string; profileId: string; recordedAt: string; kilograms: number }
export interface LocalAppData { schemaVersion: typeof APP_SCHEMA_VERSION; profile: UserProfile; inventory: EquipmentInventory; safety: SafetyAcknowledgement; workoutSettings: WorkoutSettings; appSettings: AppSettings; activePlanId?: string; plans: WorkoutPlan[]; sessions: WorkoutSession[]; bodyWeightEntries: BodyWeightEntry[] }
