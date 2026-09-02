import { exerciseById } from '../data/exerciseLibrary'
import type { EquipmentInventory, WorkoutDay, WorkoutPlan } from '../domain/types'

export type ResolvedExercise = { exerciseId: string; replacedExerciseId?: string; unavailable: boolean }
export type TodayPlan = { kind: 'rest' | 'optional' | 'workout'; title?: string; estimatedMinutes?: number; exercises?: ResolvedExercise[]; message: string }
export function resolveToday(plan: WorkoutPlan, inventory: EquipmentInventory, date = new Date()): TodayPlan {
  const entry = plan.schedule.find((item) => item.dayOfWeek === date.getDay()); if (!entry || entry.intent !== 'workout') return { kind: entry?.intent === 'optional' ? 'optional' : 'rest', message: entry?.intent === 'optional' ? 'Optional recovery or activity day.' : 'Rest and recovery day.' }
  const day = plan.workoutDays.find((item) => item.id === entry.workoutDayId); if (!day) return { kind: 'rest', message: 'This plan day is incomplete. Review the plan before training.' }
  return { kind: 'workout', title: day.title, estimatedMinutes: day.estimatedMinutes, exercises: day.exercises.map((item) => resolveExercise(item.exerciseId, inventory)), message: 'Plan ready. Starting weights are always user-confirmed.' }
}
function resolveExercise(exerciseId: string, inventory: EquipmentInventory): ResolvedExercise { const exercise = exerciseById.get(exerciseId); if (!exercise) return { exerciseId, unavailable: true }; if (exercise.equipmentRequired.every((id) => inventory.availableEquipmentIds.includes(id))) return { exerciseId, unavailable: false }; const replacement = exercise.substitutions.map((item) => item.exerciseId).map((id) => exerciseById.get(id)).find((candidate) => candidate && candidate.equipmentRequired.every((id) => inventory.availableEquipmentIds.includes(id))); return replacement ? { exerciseId: replacement.id, replacedExerciseId: exerciseId, unavailable: false } : { exerciseId, unavailable: true } }
