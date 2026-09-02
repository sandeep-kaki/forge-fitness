import { describe, expect, it } from 'vitest'
import { parseChatGptPlan } from './planImport'
import { resolveToday } from './workoutEngine'

const plan = { id: 'plan', profileId: 'profile', version: 1, title: 'Test', status: 'active' as const, source: 'manual' as const, createdAt: '2026-01-01', schedule: [{ dayOfWeek: 1, workoutDayId: 'upper', intent: 'workout' as const }], workoutDays: [{ id: 'upper', title: 'Upper', estimatedMinutes: 30, exercises: [{ exerciseId: 'lat-pulldown', sets: 3, repRange: { min: 8, max: 12 }, restSeconds: 90, priority: 'primary' as const }] }] }

describe('plan import and workout resolver', () => {
  it('rejects an incomplete plan import', () => expect(parseChatGptPlan('{"title":"x"}').ok).toBe(false))
  it('replaces unavailable equipment with a compatible ranked alternative', () => { const result = resolveToday(plan, { profileId: 'profile', availableEquipmentIds: ['assisted-pullup'], updatedAt: '2026-01-01' }, new Date('2026-09-07')); expect(result.exercises?.[0]).toMatchObject({ exerciseId: 'assisted-pullup', replacedExerciseId: 'lat-pulldown', unavailable: false }) })
})
