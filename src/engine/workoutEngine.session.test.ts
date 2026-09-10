import { describe, expect, it } from 'vitest'
import { abandonWorkout, logSet, readyForNextSet, reportSafetySymptom, startWorkoutSession, switchExercise, waitForEquipment } from './workoutEngine'
import type { EquipmentInventory, WorkoutPlan } from '../domain/types'

const inventory: EquipmentInventory = { profileId: 'profile', availableEquipmentIds: ['dumbbells', 'adjustable-bench', 'chest-press'], updatedAt: '2026-09-10' }
const plan: WorkoutPlan = {
  id: 'plan', profileId: 'profile', version: 1, title: 'Test plan', status: 'active', source: 'manual', createdAt: '2026-09-10',
  schedule: [{ dayOfWeek: 1, workoutDayId: 'upper', intent: 'workout' }],
  workoutDays: [{ id: 'upper', title: 'Upper', estimatedMinutes: 45, exercises: [{ exerciseId: 'machine-chest-press', sets: 2, repRange: { min: 8, max: 12 }, restSeconds: 90, priority: 'primary' }] },]
}

describe('active workout session', () => {
  it('starts with a compatible substitution and persists a completed set', () => {
    const session = startWorkoutSession(plan, plan.workoutDays[0], inventory, 'profile', 45, new Date('2026-09-10T10:00:00Z'))
    expect(session.exercises[0]).toMatchObject({ exerciseId: 'machine-chest-press' })
    const logged = logSet(session, { weightKg: 10, reps: 10, rir: 2, form: 'good', pain: false }, new Date('2026-09-10T10:01:00Z'))
    expect(logged.mode).toBe('resting')
    expect(logged.exercises[0].sets[0]).toMatchObject({ weightKg: 10, reps: 10, rir: 2 })
    expect(readyForNextSet(logged).mode).toBe('ready')
  })

  it('records an equipment wait, substitute choice, and safety stop without counting it as complete', () => {
    const session = startWorkoutSession(plan, plan.workoutDays[0], inventory, 'profile', 45, new Date('2026-09-10T10:00:00Z'))
    const waiting = waitForEquipment(session, new Date('2026-09-10T10:02:00Z'))
    const switched = switchExercise(waiting, 'dumbbell-floor-press', inventory, new Date('2026-09-10T10:03:30Z'))
    expect(switched.totalWaitSeconds).toBe(90)
    expect(switched.substitutions).toHaveLength(1)
    const stopped = reportSafetySymptom(switched, 'dizziness')
    expect(stopped.mode).toBe('safety_stop')
    expect(abandonWorkout(stopped, new Date('2026-09-10T10:04:00Z'))).toMatchObject({ status: 'abandoned', mode: 'ready' })
  })
})
