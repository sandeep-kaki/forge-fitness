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
})
