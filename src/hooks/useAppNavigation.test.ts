import { describe, expect, it, beforeEach, vi } from 'vitest'
import { computeNextNavState, type NavState } from './useAppNavigation'

describe('useAppNavigation & computeNextNavState', () => {
  const initialState: NavState = {
    screen: 'home',
    selectedExerciseId: null,
    workoutStarted: false,
    historyIndex: 0
  }

  it('transitions from Screen A (home) to Screen B (library)', () => {
    const next = computeNextNavState(initialState, { screen: 'library' })
    expect(next.screen).toBe('library')
    expect(next.selectedExerciseId).toBeNull()
    expect(next.workoutStarted).toBe(false)
    expect(next.historyIndex).toBe(1)
  })

  it('transitions from Screen B (library) to Screen C (library with selected exercise)', () => {
    const screenB: NavState = {
      screen: 'library',
      selectedExerciseId: null,
      workoutStarted: false,
      historyIndex: 1
    }
    const screenC = computeNextNavState(screenB, { selectedExerciseId: 'lat-pulldown' })
    expect(screenC.screen).toBe('library')
    expect(screenC.selectedExerciseId).toBe('lat-pulldown')
    expect(screenC.historyIndex).toBe(2)
  })

  it('does not increment historyIndex if navigating to the exact same state', () => {
    const state: NavState = {
      screen: 'library',
      selectedExerciseId: 'lat-pulldown',
      workoutStarted: false,
      historyIndex: 2
    }
    const same = computeNextNavState(state, { screen: 'library', selectedExerciseId: 'lat-pulldown' })
    expect(same).toBe(state)
  })

  it('clears selected exercise when switching to a different screen', () => {
    const state: NavState = {
      screen: 'library',
      selectedExerciseId: 'lat-pulldown',
      workoutStarted: false,
      historyIndex: 2
    }
    const next = computeNextNavState(state, { screen: 'settings' })
    expect(next.screen).toBe('settings')
    expect(next.selectedExerciseId).toBeNull()
    expect(next.historyIndex).toBe(3)
  })

  it('transitions to active workout and resets when leaving workout screen', () => {
    const workoutScreen: NavState = {
      screen: 'workout',
      selectedExerciseId: null,
      workoutStarted: false,
      historyIndex: 1
    }
    const activeWorkout = computeNextNavState(workoutScreen, { workoutStarted: true })
    expect(activeWorkout.workoutStarted).toBe(true)
    expect(activeWorkout.historyIndex).toBe(2)

    const leftWorkout = computeNextNavState(activeWorkout, { screen: 'progress' })
    expect(leftWorkout.screen).toBe('progress')
    expect(leftWorkout.workoutStarted).toBe(false)
    expect(leftWorkout.historyIndex).toBe(3)
  })
})
