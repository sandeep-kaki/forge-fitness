import type { EquipmentItem } from '../domain/types'

export const equipmentCatalog: EquipmentItem[] = [
  { id: 'chest-press', name: 'Chest Press', category: 'machine', plainDescription: 'The seated machine where you push handles away from your chest.' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'machine', plainDescription: 'Sit down and pull the overhead bar toward your upper chest.' },
  { id: 'seated-row', name: 'Seated Row', category: 'machine', plainDescription: 'Sit and pull handles toward your torso.' },
  { id: 'leg-press', name: 'Leg Press', category: 'machine', plainDescription: 'The seated machine where you press a large platform away with your feet.' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'machine', plainDescription: 'The machine that trains the back of your thighs.' },
  { id: 'leg-extension', name: 'Leg Extension', category: 'machine', plainDescription: 'The machine that trains the front of your thighs.' },
  { id: 'dumbbells', name: 'Dumbbells', category: 'free_weight', plainDescription: 'Hand weights available in different sizes.' },
  { id: 'adjustable-bench', name: 'Adjustable Bench', category: 'free_weight', plainDescription: 'A bench that changes from flat to inclined.' },
  { id: 'cable-station', name: 'Cable Station', category: 'station', plainDescription: 'A machine with a pulley and adjustable handles.' },
  { id: 'assisted-pullup', name: 'Assisted Pull-up', category: 'machine', plainDescription: 'A machine that helps support part of your body weight.' },
]
