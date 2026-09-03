import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { createSeedAppData } from '../data/seed'
import { loadLocalAppData, saveLocalAppData } from './persistence'

afterEach(async () => {
  await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase('forge-local'); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); request.onblocked = () => resolve() })
})

describe('IndexedDB persistence', () => {
  it('round-trips a validated profile bundle', async () => {
    const data = createSeedAppData()
    await saveLocalAppData(data)
    expect(await loadLocalAppData()).toEqual(data)
  })

  it('does not save malformed data', async () => {
    await expect(saveLocalAppData({} as never)).rejects.toThrow('invalid local data')
  })

  it('persists and reloads an imported plan in the local profile bundle', async () => {
    const data = createSeedAppData()
    const now = new Date().toISOString()
    const importedPlan = {
      id: crypto.randomUUID(),
      profileId: data.profile.id,
      version: 1,
      title: 'Muscle and Weight Gain (4-Day Split)',
      status: 'active' as const,
      source: 'chatgpt_import' as const,
      createdAt: now,
      schedule: [
        { dayOfWeek: 1, workoutDayId: 'upper-a', intent: 'workout' as const },
        { dayOfWeek: 2, workoutDayId: 'lower-a', intent: 'workout' as const },
        { dayOfWeek: 3, intent: 'rest' as const },
        { dayOfWeek: 4, workoutDayId: 'upper-b', intent: 'workout' as const },
        { dayOfWeek: 5, workoutDayId: 'lower-b', intent: 'workout' as const },
        { dayOfWeek: 6, intent: 'optional' as const },
        { dayOfWeek: 0, intent: 'rest' as const }
      ],
      workoutDays: [
        {
          id: 'upper-a',
          title: 'Upper A',
          estimatedMinutes: 60,
          exercises: [{ exerciseId: 'lat-pulldown', sets: 3, repRange: { min: 8, max: 12 }, restSeconds: 90, priority: 'primary' as const }]
        }
      ]
    }
    const withPlan = {
      ...data,
      plans: [importedPlan],
      activePlanId: importedPlan.id
    }
    await saveLocalAppData(withPlan)
    const loaded = await loadLocalAppData()
    expect(loaded).toEqual(withPlan)
    expect(loaded?.activePlanId).toBe(importedPlan.id)
    expect(loaded?.plans[0].title).toBe('Muscle and Weight Gain (4-Day Split)')
  })
})
