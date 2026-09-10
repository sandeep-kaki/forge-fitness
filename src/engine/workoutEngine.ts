import { exerciseById } from '../data/exerciseLibrary'
import type { EquipmentInventory, ExerciseSet, SessionExercise, WorkoutDay, WorkoutPlan, WorkoutSession } from '../domain/types'

export type ResolvedExercise = { exerciseId: string; replacedExerciseId?: string; unavailable: boolean }
export type TodayPlan = { kind: 'rest' | 'optional' | 'workout'; workoutDayId?: string; title?: string; estimatedMinutes?: number; exercises?: ResolvedExercise[]; message: string }

export function resolveToday(plan: WorkoutPlan, inventory: EquipmentInventory, date = new Date()): TodayPlan {
  const entry = plan.schedule.find((item) => item.dayOfWeek === date.getDay())
  if (!entry || entry.intent !== 'workout') return { kind: entry?.intent === 'optional' ? 'optional' : 'rest', message: entry?.intent === 'optional' ? 'Optional recovery or activity day.' : 'Rest and recovery day.' }
  const day = plan.workoutDays.find((item) => item.id === entry.workoutDayId)
  if (!day) return { kind: 'rest', message: 'This plan day is incomplete. Review the plan before training.' }
  return { kind: 'workout', workoutDayId: day.id, title: day.title, estimatedMinutes: day.estimatedMinutes, exercises: day.exercises.map((item) => resolveExercise(item.exerciseId, inventory)), message: 'Plan ready. Starting weights are always user-confirmed.' }
}

export function resolveExercise(exerciseId: string, inventory: EquipmentInventory): ResolvedExercise {
  const exercise = exerciseById.get(exerciseId)
  if (!exercise) return { exerciseId, unavailable: true }
  if (isAvailable(exerciseId, inventory)) return { exerciseId, unavailable: false }
  const replacement = exercise.substitutions.map((item) => item.exerciseId).find((id) => isAvailable(id, inventory))
  return replacement ? { exerciseId: replacement, replacedExerciseId: exerciseId, unavailable: false } : { exerciseId, unavailable: true }
}

export function startWorkoutSession(plan: WorkoutPlan, day: WorkoutDay, inventory: EquipmentInventory, profileId: string, timeMinutes: 30 | 45 | 60, now = new Date()): WorkoutSession {
  const resolved = day.exercises.map((planned) => ({ planned, result: resolveExercise(planned.exerciseId, inventory) })).filter(({ result }) => !result.unavailable)
  const allowed = timeMinutes === 30 ? resolved.filter(({ planned }) => planned.priority === 'primary').slice(0, 2) : timeMinutes === 45 ? resolved.filter(({ planned }, index) => planned.priority === 'primary' || index < 3) : resolved
  const exercises: SessionExercise[] = allowed.map(({ planned, result }) => ({ plannedExerciseId: planned.exerciseId, exerciseId: result.exerciseId, targetSets: timeMinutes === 30 && planned.priority === 'accessory' ? 2 : planned.sets, repRange: planned.repRange, restSeconds: planned.restSeconds, priority: planned.priority, sets: [], ...(result.replacedExerciseId ? { substitutionFor: result.replacedExerciseId } : {}) }))
  return { id: crypto.randomUUID(), profileId, planId: plan.id, workoutDayId: day.id, title: day.title, startedAt: now.toISOString(), status: 'active', exercises, currentExerciseIndex: 0, mode: 'ready', totalWaitSeconds: 0, substitutions: [], safetyEvents: [] }
}

export function logSet(session: WorkoutSession, input: Omit<ExerciseSet, 'id' | 'completedAt'>, now = new Date()): WorkoutSession {
  if (session.status !== 'active' || session.mode === 'safety_stop') return session
  const current = session.exercises[session.currentExerciseIndex]
  if (!current || current.skipped) return session
  const set: ExerciseSet = { ...input, id: crypto.randomUUID(), completedAt: now.toISOString() }
  const exercises = session.exercises.map((exercise, index) => index === session.currentExerciseIndex ? { ...exercise, sets: [...exercise.sets, set] } : exercise)
  return { ...session, exercises, mode: 'resting', restStartedAt: now.toISOString(), waitStartedAt: undefined }
}

export function nextExercise(session: WorkoutSession): WorkoutSession {
  const next = session.exercises.findIndex((exercise, index) => index > session.currentExerciseIndex && !exercise.skipped && exercise.sets.length < exercise.targetSets)
  return next === -1 ? { ...session, mode: 'ready' } : { ...session, currentExerciseIndex: next, mode: 'ready', restStartedAt: undefined, waitStartedAt: undefined }
}

export function readyForNextSet(session: WorkoutSession): WorkoutSession { return session.mode === 'resting' || session.mode === 'waiting_for_equipment' ? closeWait({ ...session, mode: 'ready', restStartedAt: undefined }) : session }
export function extendRest(session: WorkoutSession, seconds = 30): WorkoutSession { return session.mode === 'resting' ? { ...session, restStartedAt: new Date(new Date(session.restStartedAt ?? Date.now()).getTime() + seconds * 1000).toISOString() } : session }
export function waitForEquipment(session: WorkoutSession, now = new Date()): WorkoutSession { return session.mode === 'resting' || session.mode === 'ready' ? { ...session, mode: 'waiting_for_equipment', waitStartedAt: now.toISOString() } : session }
export function switchExercise(session: WorkoutSession, replacementId: string, inventory: EquipmentInventory, now = new Date()): WorkoutSession {
  const current = session.exercises[session.currentExerciseIndex]
  if (!current || !isAvailable(replacementId, inventory)) return session
  const exercises = session.exercises.map((exercise, index) => index === session.currentExerciseIndex ? { ...exercise, exerciseId: replacementId, substitutionFor: current.exerciseId } : exercise)
  return closeWait({ ...session, exercises, mode: 'ready', restStartedAt: undefined, substitutions: [...session.substitutions, { id: crypto.randomUUID(), at: now.toISOString(), fromExerciseId: current.exerciseId, toExerciseId: replacementId }] }, now)
}
export function skipCurrentExercise(session: WorkoutSession, now = new Date()): WorkoutSession { const exercises = session.exercises.map((exercise, index) => index === session.currentExerciseIndex ? { ...exercise, skipped: true } : exercise); return nextExercise(closeWait({ ...session, exercises }, now)) }
export function reportSafetySymptom(session: WorkoutSession, symptom: string, now = new Date()): WorkoutSession { return { ...session, mode: 'safety_stop', safetyEvents: [...session.safetyEvents, { id: crypto.randomUUID(), at: now.toISOString(), symptom }] } }
export function finishWorkout(session: WorkoutSession, now = new Date()): WorkoutSession { return { ...closeWait(session, now), status: 'completed', completedAt: now.toISOString(), mode: 'ready', restStartedAt: undefined, waitStartedAt: undefined } }
/** Safety-stopped sessions remain in the local record but never count as completed workouts. */
export function abandonWorkout(session: WorkoutSession, now = new Date()): WorkoutSession { return { ...closeWait(session, now), status: 'abandoned', completedAt: now.toISOString(), mode: 'ready', restStartedAt: undefined, waitStartedAt: undefined } }
export function restRemainingSeconds(session: WorkoutSession, now = new Date()): number { if (session.mode !== 'resting' || !session.restStartedAt) return 0; const current = session.exercises[session.currentExerciseIndex]; const elapsed = Math.floor((now.getTime() - new Date(session.restStartedAt).getTime()) / 1000); return Math.max(0, (current?.restSeconds ?? 0) - elapsed) }
export function elapsedSeconds(session: WorkoutSession, now = new Date()): number { return Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000)) }
export function isAvailable(exerciseId: string, inventory: EquipmentInventory): boolean { const exercise = exerciseById.get(exerciseId); return Boolean(exercise && exercise.equipmentRequired.every((id) => inventory.availableEquipmentIds.includes(id))) }
function closeWait(session: WorkoutSession, now = new Date()): WorkoutSession { if (!session.waitStartedAt) return { ...session, waitStartedAt: undefined }; const seconds = Math.max(0, Math.floor((now.getTime() - new Date(session.waitStartedAt).getTime()) / 1000)); return { ...session, totalWaitSeconds: session.totalWaitSeconds + seconds, waitStartedAt: undefined } }
