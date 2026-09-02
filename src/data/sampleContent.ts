import type { Exercise, WorkoutPlan } from '../domain/types'

/** Visual-only seed data. The shell never executes this plan; imported user plans will replace it in Milestone 2+. */
export const samplePlan: WorkoutPlan = {
  id: 'example-plan', profileId: 'example-profile', version: 1, title: 'Foundation Strength', status: 'active', createdAt: '2026-09-02',
  schedule: [{ dayOfWeek: 1, workoutDayId: 'upper', intent: 'workout' }, { dayOfWeek: 2, workoutDayId: 'lower', intent: 'workout' }, { dayOfWeek: 3, intent: 'rest' }, { dayOfWeek: 4, workoutDayId: 'full-body', intent: 'workout' }, { dayOfWeek: 5, intent: 'optional' }, { dayOfWeek: 6, intent: 'rest' }, { dayOfWeek: 0, intent: 'rest' }],
}

export const sampleExercises: Exercise[] = [
  { id: 'machine-chest-press', displayName: 'Machine Chest Press', primaryMuscles: ['Chest', 'Triceps'], equipmentRequired: ['Chest press machine'], beginnerLevel: 'beginner', instructions: ['Adjust the seat so handles align with mid-chest.', 'Press smoothly without locking your elbows.'] },
  { id: 'seated-row', displayName: 'Seated Cable Row', primaryMuscles: ['Back', 'Biceps'], equipmentRequired: ['Cable station'], beginnerLevel: 'beginner', instructions: ['Sit tall with ribs stacked over hips.', 'Pull toward your lower ribs with control.'] },
  { id: 'leg-press', displayName: 'Leg Press', primaryMuscles: ['Quads', 'Glutes'], equipmentRequired: ['Leg press'], beginnerLevel: 'beginner', instructions: ['Keep your whole foot planted on the platform.', 'Lower only as far as your back stays supported.'] },
  { id: 'dumbbell-rdl', displayName: 'Dumbbell Romanian Deadlift', primaryMuscles: ['Hamstrings', 'Glutes'], equipmentRequired: ['Dumbbells'], beginnerLevel: 'beginner', instructions: ['Push hips back while keeping dumbbells close.', 'Stop when you feel a comfortable hamstring stretch.'] },
]
