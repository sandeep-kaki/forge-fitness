import { useCallback, useEffect, useState } from 'react'
import type { LocalAppData } from '../domain/types'
import { loadLocalAppData, saveLocalAppData } from '../lib/persistence'

export type LocalDataStatus = 'loading' | 'ready' | 'unavailable'
export function useLocalAppData() { const [data, setData] = useState<LocalAppData | null>(null); const [status, setStatus] = useState<LocalDataStatus>('loading'); useEffect(() => { void loadLocalAppData().then((stored) => { setData(stored); setStatus('ready') }).catch(() => setStatus('unavailable')) }, []); const update = useCallback((next: LocalAppData) => { setData(next); void saveLocalAppData(next).catch(() => setStatus('unavailable')) }, []); return { data, status, update } }
