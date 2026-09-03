import { describe, expect, it } from 'vitest'
import { parseChatGptPlan } from './planImport'
import { resolveToday } from './workoutEngine'
import type { EquipmentInventory, WorkoutPlan } from '../domain/types'

export const validPersonalizedPlanJson = JSON.stringify({
  title: 'Muscle and Weight Gain (4-Day Split)',
  schedule: [
    { dayOfWeek: 1, workoutDayId: 'upper-a', intent: 'workout' },
    { dayOfWeek: 2, workoutDayId: 'lower-a', intent: 'workout' },
    { dayOfWeek: 3, intent: 'rest' },
    { dayOfWeek: 4, workoutDayId: 'upper-b', intent: 'workout' },
    { dayOfWeek: 5, workoutDayId: 'lower-b', intent: 'workout' },
    { dayOfWeek: 6, intent: 'optional' },
    { dayOfWeek: 0, intent: 'rest' }
  ],
  workoutDays: [
    {
      id: 'upper-a',
      title: 'Upper A',
      estimatedMinutes: 60,
      exercises: [
        {
          exerciseId: 'lat-pulldown',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'primary',
          notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
        },
        {
          exerciseId: 'machine-chest-press',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'primary',
          notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
        },
        {
          exerciseId: 'seated-cable-row',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'accessory',
          notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
        }
      ]
    },
    {
      id: 'lower-a',
      title: 'Lower A',
      estimatedMinutes: 60,
      exercises: [
        {
          exerciseId: 'leg-press',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 120,
          priority: 'primary',
          notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
        },
        {
          exerciseId: 'dumbbell-rdl',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'primary',
          notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
        },
        {
          exerciseId: 'leg-curl',
          sets: 2,
          repRange: { min: 10, max: 15 },
          restSeconds: 60,
          priority: 'accessory',
          notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
        }
      ]
    },
    {
      id: 'upper-b',
      title: 'Upper B',
      estimatedMinutes: 60,
      exercises: [
        {
          exerciseId: 'dumbbell-floor-press',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'primary',
          notes: 'Incline/dumbbell pressing. Leave 1-3 reps in reserve. Select comfortable starting weight.'
        },
        {
          exerciseId: 'assisted-pullup',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'primary',
          notes: 'Assisted pull-up or lat pulldown. Leave 1-3 reps in reserve.'
        },
        {
          exerciseId: 'one-arm-dumbbell-row',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'accessory',
          notes: 'Chest-supported or dumbbell row. Leave 1-3 reps in reserve.'
        }
      ]
    },
    {
      id: 'lower-b',
      title: 'Lower B',
      estimatedMinutes: 60,
      exercises: [
        {
          exerciseId: 'goblet-box-squat',
          sets: 3,
          repRange: { min: 8, max: 12 },
          restSeconds: 90,
          priority: 'primary',
          notes: 'Goblet squat or hack squat. Leave 1-3 reps in reserve.'
        },
        {
          exerciseId: 'leg-press',
          sets: 2,
          repRange: { min: 10, max: 12 },
          restSeconds: 90,
          priority: 'primary',
          notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
        },
        {
          exerciseId: 'leg-curl',
          sets: 2,
          repRange: { min: 10, max: 15 },
          restSeconds: 60,
          priority: 'accessory',
          notes: 'Seated or lying leg curl. Leave 1-3 reps in reserve.'
        }
      ]
    }
  ]
})

const fullInventory: EquipmentInventory = {
  profileId: 'test-profile',
  availableEquipmentIds: [
    'lat-pulldown',
    'chest-press',
    'cable-station',
    'leg-press',
    'dumbbells',
    'leg-curl',
    'adjustable-bench',
    'assisted-pullup'
  ],
  updatedAt: new Date().toISOString()
}

describe('personalized plan import', () => {
  it('successfully validates and imports the personalized 4-day plan JSON', () => {
    const result = parseChatGptPlan(validPersonalizedPlanJson)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.plan.title).toBe('Muscle and Weight Gain (4-Day Split)')
    expect(result.plan.schedule).toHaveLength(7)
    expect(result.plan.workoutDays).toHaveLength(4)

    // Verify 4-day workout schedule
    const monday = result.plan.schedule.find((s) => s.dayOfWeek === 1)
    expect(monday).toEqual({ dayOfWeek: 1, workoutDayId: 'upper-a', intent: 'workout' })

    const tuesday = result.plan.schedule.find((s) => s.dayOfWeek === 2)
    expect(tuesday).toEqual({ dayOfWeek: 2, workoutDayId: 'lower-a', intent: 'workout' })

    const wednesday = result.plan.schedule.find((s) => s.dayOfWeek === 3)
    expect(wednesday).toEqual({ dayOfWeek: 3, intent: 'rest' })

    const thursday = result.plan.schedule.find((s) => s.dayOfWeek === 4)
    expect(thursday).toEqual({ dayOfWeek: 4, workoutDayId: 'upper-b', intent: 'workout' })

    const friday = result.plan.schedule.find((s) => s.dayOfWeek === 5)
    expect(friday).toEqual({ dayOfWeek: 5, workoutDayId: 'lower-b', intent: 'workout' })

    const saturday = result.plan.schedule.find((s) => s.dayOfWeek === 6)
    expect(saturday).toEqual({ dayOfWeek: 6, intent: 'optional' })

    const sunday = result.plan.schedule.find((s) => s.dayOfWeek === 0)
    expect(sunday).toEqual({ dayOfWeek: 0, intent: 'rest' })

    // Verify estimated duration
    for (const day of result.plan.workoutDays) {
      expect(day.estimatedMinutes).toBe(60)
    }

    // Verify sets and rep ranges preserved
    const upperA = result.plan.workoutDays.find((d) => d.id === 'upper-a')!
    expect(upperA.exercises[0]).toEqual({
      exerciseId: 'lat-pulldown',
      sets: 3,
      repRange: { min: 8, max: 12 },
      restSeconds: 90,
      priority: 'primary',
      notes: 'Leave 1-3 reps in reserve. Select comfortable starting weight.'
    })
  })

  it('correctly resolves workout days and rest days through the workout engine', () => {
    const parsed = parseChatGptPlan(validPersonalizedPlanJson)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return

    const plan: WorkoutPlan = {
      ...parsed.plan,
      id: 'plan-1',
      profileId: 'test-profile',
      version: 1,
      status: 'active',
      source: 'chatgpt_import',
      createdAt: new Date().toISOString()
    }

    // Monday (dayOfWeek: 1) -> Upper A
    const mondayWorkout = resolveToday(plan, fullInventory, new Date('2026-09-07T10:00:00')) // Sep 7, 2026 is Monday
    expect(mondayWorkout.kind).toBe('workout')
    expect(mondayWorkout.title).toBe('Upper A')
    expect(mondayWorkout.exercises?.length).toBe(3)

    // Tuesday (dayOfWeek: 2) -> Lower A
    const tuesdayWorkout = resolveToday(plan, fullInventory, new Date('2026-09-08T10:00:00')) // Sep 8, 2026 is Tuesday
    expect(tuesdayWorkout.kind).toBe('workout')
    expect(tuesdayWorkout.title).toBe('Lower A')

    // Wednesday (dayOfWeek: 3) -> Rest
    const wednesdayWorkout = resolveToday(plan, fullInventory, new Date('2026-09-09T10:00:00')) // Sep 9, 2026 is Wednesday
    expect(wednesdayWorkout.kind).toBe('rest')

    // Thursday (dayOfWeek: 4) -> Upper B
    const thursdayWorkout = resolveToday(plan, fullInventory, new Date('2026-09-10T10:00:00')) // Sep 10, 2026 is Thursday
    expect(thursdayWorkout.kind).toBe('workout')
    expect(thursdayWorkout.title).toBe('Upper B')

    // Friday (dayOfWeek: 5) -> Lower B
    const fridayWorkout = resolveToday(plan, fullInventory, new Date('2026-09-11T10:00:00')) // Sep 11, 2026 is Friday
    expect(fridayWorkout.kind).toBe('workout')
    expect(fridayWorkout.title).toBe('Lower B')

    // Saturday (dayOfWeek: 6) -> Optional
    const saturdayWorkout = resolveToday(plan, fullInventory, new Date('2026-09-12T10:00:00')) // Sep 12, 2026 is Saturday
    expect(saturdayWorkout.kind).toBe('optional')

    // Sunday (dayOfWeek: 0) -> Rest
    const sundayWorkout = resolveToday(plan, fullInventory, new Date('2026-09-13T10:00:00')) // Sep 13, 2026 is Sunday
    expect(sundayWorkout.kind).toBe('rest')
  })

  it('rejects the old schema structure with specific error messages', () => {
    const oldJson = JSON.stringify({
      planName: 'Muscle Gain',
      goal: 'muscle_gain',
      frequency: 4,
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      exercises: [],
      trainingGuidelines: 'Leave 1-3 RIR'
    })
    const result = parseChatGptPlan(oldJson)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors).toContain('Include title, schedule, and workoutDays.')
    }
  })
})
