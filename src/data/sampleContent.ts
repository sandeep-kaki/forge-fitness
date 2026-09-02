import type { WorkoutPlan } from '../domain/types'
import { exerciseLibrary } from './exerciseLibrary'

/** Visual-only seed data. The shell never executes this plan; imported user plans will replace it in Milestone 2+. */
export const samplePlan: WorkoutPlan = {
  id: 'example-plan', profileId: 'example-profile', version: 1, title: 'Foundation Strength', status: 'active', source: 'seed', createdAt: '2026-09-02',
  schedule: [{ dayOfWeek: 1, workoutDayId: 'upper', intent: 'workout' }, { dayOfWeek: 2, workoutDayId: 'lower', intent: 'workout' }, { dayOfWeek: 3, intent: 'rest' }, { dayOfWeek: 4, workoutDayId: 'full-body', intent: 'workout' }, { dayOfWeek: 5, intent: 'optional' }, { dayOfWeek: 6, intent: 'rest' }, { dayOfWeek: 0, intent: 'rest' }], workoutDays: [],
}

export const sampleExercises = exerciseLibrary
