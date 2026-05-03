import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ─── Types ─── */
export interface Scene {
  id: string
  number: number
  heading: string
  estTime: string
  cast: string[]
  location: string
  dayOrNight: 'DAY' | 'NIGHT' | 'DUSK' | 'DAWN'
}

export interface DaySchedule {
  id: string
  date: string
  label: string
  scenes: Scene[]
}

interface ScheduleStore {
  schedule: DaySchedule[]
  unassigned: Scene[]
  nextSceneNum: number
  setSchedule: (schedule: DaySchedule[]) => void
  setUnassigned: (unassigned: Scene[]) => void
  setNextSceneNum: (num: number) => void
  addScene: (scene: Scene) => void
  removeScene: (sceneId: string, source: string) => void
  moveScene: (sceneId: string, from: string, to: string | 'unassigned') => void
  autoSchedule: () => void
  reset: () => void
}

/* ─── Initial Data ─── */
const initialScenes: Scene[] = [
  { id: 'sc1', number: 1, heading: 'EXT. WAREHOUSE DISTRICT - NIGHT', estTime: '0:45', cast: ['Jack'], location: 'Warehouse Ext', dayOrNight: 'NIGHT' },
  { id: 'sc2', number: 2, heading: 'INT. WAREHOUSE - CONTINUOUS', estTime: '1:30', cast: ['Jack', 'Sarah'], location: 'Warehouse Int', dayOrNight: 'NIGHT' },
  { id: 'sc3', number: 3, heading: 'INT. WAREHOUSE OFFICE - NIGHT', estTime: '1:15', cast: ['Sarah'], location: 'Warehouse Office', dayOrNight: 'NIGHT' },
  { id: 'sc4', number: 4, heading: 'EXT. ALLEY BEHIND WAREHOUSE - NIGHT', estTime: '0:30', cast: ['Jack'], location: 'Alley', dayOrNight: 'NIGHT' },
  { id: 'sc5', number: 5, heading: 'INT. SAFEHOUSE - DAY', estTime: '2:00', cast: ['Sarah', 'Morgan'], location: 'Safehouse', dayOrNight: 'DAY' },
  { id: 'sc6', number: 6, heading: 'EXT. SAFEHOUSE ROOF - DUSK', estTime: '0:45', cast: ['Jack', 'Sarah'], location: 'Safehouse Roof', dayOrNight: 'DUSK' },
]

const initialSchedule: DaySchedule[] = [
  { id: 'd1', date: '2025-06-02', label: 'Day 1 — Mon', scenes: [initialScenes[0], initialScenes[1]] },
  { id: 'd2', date: '2025-06-03', label: 'Day 2 — Tue', scenes: [initialScenes[2]] },
  { id: 'd3', date: '2025-06-04', label: 'Day 3 — Wed', scenes: [] },
  { id: 'd4', date: '2025-06-05', label: 'Day 4 — Thu', scenes: [initialScenes[3]] },
  { id: 'd5', date: '2025-06-06', label: 'Day 5 — Fri', scenes: [] },
]

const initialUnassigned: Scene[] = [initialScenes[4], initialScenes[5]]

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      schedule: initialSchedule,
      unassigned: initialUnassigned,
      nextSceneNum: 7,

      setSchedule: (schedule) => set({ schedule }),
      setUnassigned: (unassigned) => set({ unassigned }),
      setNextSceneNum: (num) => set({ nextSceneNum: num }),

      addScene: (scene) =>
        set((s) => ({
          unassigned: [...s.unassigned, scene],
          nextSceneNum: s.nextSceneNum + 1,
        })),

      removeScene: (sceneId, source) =>
        set((s) => {
          if (source === 'unassigned') {
            return { unassigned: s.unassigned.filter((sc) => sc.id !== sceneId) }
          }
          return {
            schedule: s.schedule.map((d) =>
              d.id === source ? { ...d, scenes: d.scenes.filter((sc) => sc.id !== sceneId) } : d
            ),
          }
        }),

      moveScene: (sceneId, from, to) =>
        set((s) => {
          // Find the scene
          let scene: Scene | undefined
          if (from === 'unassigned') {
            scene = s.unassigned.find((sc) => sc.id === sceneId)
          } else {
            const day = s.schedule.find((d) => d.id === from)
            scene = day?.scenes.find((sc) => sc.id === sceneId)
          }
          if (!scene) return {}

          // Remove from source
          let newUnassigned = s.unassigned
          let newSchedule = s.schedule

          if (from === 'unassigned') {
            newUnassigned = s.unassigned.filter((sc) => sc.id !== sceneId)
          } else {
            newSchedule = s.schedule.map((d) =>
              d.id === from ? { ...d, scenes: d.scenes.filter((sc) => sc.id !== sceneId) } : d
            )
          }

          // Add to target
          if (to === 'unassigned') {
            newUnassigned = [...newUnassigned, scene]
          } else {
            newSchedule = newSchedule.map((d) =>
              d.id === to ? { ...d, scenes: [...d.scenes, scene!] } : d
            )
          }

          return { schedule: newSchedule, unassigned: newUnassigned }
        }),

      autoSchedule: () =>
        set((s) => {
          const allScenes = [...s.unassigned]
          if (allScenes.length === 0) return {}
          let sceneIdx = 0
          const newSchedule = s.schedule.map((d) => {
            const addCount = Math.min(allScenes.length - sceneIdx, 2)
            const added = allScenes.slice(sceneIdx, sceneIdx + addCount)
            sceneIdx += addCount
            return { ...d, scenes: [...d.scenes, ...added] }
          })
          return { schedule: newSchedule, unassigned: [] }
        }),

      reset: () =>
        set({
          schedule: initialSchedule,
          unassigned: initialUnassigned,
          nextSceneNum: 7,
        }),
    }),
    { name: 'cinex-schedule' }
  )
)
