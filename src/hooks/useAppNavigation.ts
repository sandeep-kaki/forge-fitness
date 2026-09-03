import { useCallback, useEffect, useState } from 'react'

export type Screen = 'home' | 'workout' | 'progress' | 'library' | 'settings'

export interface NavState {
  screen: Screen
  selectedExerciseId: string | null
  workoutStarted: boolean
  historyIndex: number
}

const DEFAULT_STATE: NavState = {
  screen: 'home',
  selectedExerciseId: null,
  workoutStarted: false,
  historyIndex: 0
}

export function computeNextNavState(
  prev: NavState,
  update: Partial<Omit<NavState, 'historyIndex'>>
): NavState {
  const nextScreen = update.screen ?? prev.screen
  const nextSelected = 'selectedExerciseId' in update
    ? (update.selectedExerciseId ?? null)
    : (update.screen && update.screen !== prev.screen ? null : prev.selectedExerciseId)
  const nextWorkoutStarted = 'workoutStarted' in update
    ? Boolean(update.workoutStarted)
    : (update.screen && update.screen !== prev.screen ? false : prev.workoutStarted)

  if (
    nextScreen === prev.screen &&
    nextSelected === prev.selectedExerciseId &&
    nextWorkoutStarted === prev.workoutStarted
  ) {
    return prev
  }

  return {
    screen: nextScreen,
    selectedExerciseId: nextSelected,
    workoutStarted: nextWorkoutStarted,
    historyIndex: prev.historyIndex + 1
  }
}

export function useAppNavigation(initialScreen: Screen = 'home') {
  const [nav, setNav] = useState<NavState>(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_STATE, screen: initialScreen }
    const stored = window.history.state?.forgeNav as Partial<NavState> | undefined
    if (stored && typeof stored.screen === 'string') {
      return {
        screen: (stored.screen as Screen) || initialScreen,
        selectedExerciseId: stored.selectedExerciseId ?? null,
        workoutStarted: Boolean(stored.workoutStarted),
        historyIndex: typeof stored.historyIndex === 'number' ? stored.historyIndex : 0
      }
    }
    return { ...DEFAULT_STATE, screen: initialScreen }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const current = window.history.state?.forgeNav
    if (!current) {
      window.history.replaceState({ forgeNav: nav }, '')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPopState = (event: PopStateEvent) => {
      const state = event.state?.forgeNav as NavState | undefined
      if (state && typeof state.screen === 'string') {
        setNav({
          screen: state.screen,
          selectedExerciseId: state.selectedExerciseId ?? null,
          workoutStarted: Boolean(state.workoutStarted),
          historyIndex: typeof state.historyIndex === 'number' ? state.historyIndex : 0
        })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigateTo = useCallback((update: Partial<Omit<NavState, 'historyIndex'>>) => {
    setNav((prev) => {
      const nextState = computeNextNavState(prev, update)
      if (nextState === prev) return prev

      if (typeof window !== 'undefined') {
        window.history.pushState({ forgeNav: nextState }, '')
      }

      return nextState
    })
  }, [])

  const goBack = useCallback((fallback?: () => void) => {
    if (typeof window !== 'undefined' && nav.historyIndex > 0) {
      window.history.back()
    } else if (fallback) {
      fallback()
    }
  }, [nav.historyIndex])

  const resetRoot = useCallback((screen: Screen = 'home') => {
    const rootState: NavState = {
      screen,
      selectedExerciseId: null,
      workoutStarted: false,
      historyIndex: 0
    }
    setNav(rootState)
    if (typeof window !== 'undefined') {
      window.history.replaceState({ forgeNav: rootState }, '')
    }
  }, [])

  return {
    screen: nav.screen,
    selectedExerciseId: nav.selectedExerciseId,
    workoutStarted: nav.workoutStarted,
    historyIndex: nav.historyIndex,
    navigateTo,
    goBack,
    resetRoot,
    setScreen: (screen: Screen) => navigateTo({ screen }),
    selectExercise: (id: string | null) => navigateTo({ screen: 'library', selectedExerciseId: id }),
    setWorkoutStarted: (started: boolean) => navigateTo({ screen: 'workout', workoutStarted: started })
  }
}
