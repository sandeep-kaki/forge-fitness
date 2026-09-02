import type { WorkoutDay, WorkoutExercise, WorkoutPlan } from '../domain/types'
import { exerciseById } from '../data/exerciseLibrary'

type Raw = Record<string, unknown>
const object = (value: unknown): value is Raw => typeof value === 'object' && value !== null
const number = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

export type PlanImportResult = { ok: true; plan: Omit<WorkoutPlan, 'id' | 'profileId' | 'createdAt' | 'version' | 'status' | 'source'> } | { ok: false; errors: string[] }
export function parseChatGptPlan(input: string): PlanImportResult {
  let raw: unknown; try { raw = JSON.parse(input) } catch { return { ok: false, errors: ['The plan must be valid JSON.'] } }
  if (!object(raw) || !text(raw.title) || !Array.isArray(raw.schedule) || !Array.isArray(raw.workoutDays)) return { ok: false, errors: ['Include title, schedule, and workoutDays.'] }
  const errors: string[] = []; const schedule = raw.schedule.flatMap((item) => { if (!object(item) || !number(item.dayOfWeek) || !['workout', 'rest', 'optional'].includes(String(item.intent))) { errors.push('Each schedule entry needs a valid dayOfWeek and intent.'); return [] } return [{ dayOfWeek: item.dayOfWeek, workoutDayId: text(item.workoutDayId) ? item.workoutDayId : undefined, intent: item.intent as 'workout' | 'rest' | 'optional' }] })
  const workoutDays = raw.workoutDays.flatMap((item) => parseWorkoutDay(item, errors)); if (schedule.length !== 7) errors.push('A plan must describe all seven days of the week.'); if (errors.length) return { ok: false, errors }; return { ok: true, plan: { title: raw.title, schedule, workoutDays } }
}
function parseWorkoutDay(value: unknown, errors: string[]): WorkoutDay[] { if (!object(value) || !text(value.id) || !text(value.title) || !number(value.estimatedMinutes) || !Array.isArray(value.exercises)) { errors.push('Each workout day needs id, title, estimatedMinutes, and exercises.'); return [] } const exercises = value.exercises.flatMap((item) => parseExercise(item, errors)); return [{ id: value.id, title: value.title, estimatedMinutes: value.estimatedMinutes, exercises }] }
function parseExercise(value: unknown, errors: string[]): WorkoutExercise[] { if (!object(value) || !text(value.exerciseId) || !exerciseById.has(value.exerciseId) || !number(value.sets) || !object(value.repRange) || !number(value.repRange.min) || !number(value.repRange.max) || !number(value.restSeconds) || !['primary', 'accessory'].includes(String(value.priority))) { errors.push('Every exercise must use a library exerciseId plus valid sets, repRange, restSeconds, and priority.'); return [] } return [{ exerciseId: value.exerciseId, sets: value.sets, repRange: { min: value.repRange.min, max: value.repRange.max }, restSeconds: value.restSeconds, priority: value.priority as 'primary' | 'accessory', notes: text(value.notes) ? value.notes : undefined }] }
