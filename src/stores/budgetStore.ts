import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BudgetItem {
  id: number
  category: string
  item: string
  estimated: number
  actual: number
}

interface BudgetStore {
  items: BudgetItem[]
  nextId: number
  addItem: (item: Omit<BudgetItem, 'id'>) => void
  removeItem: (id: number) => void
  updateItem: (id: number, updates: Partial<BudgetItem>) => void
  reset: () => void
}

const INITIAL_ITEMS: BudgetItem[] = [
  { id: 1, category: 'Pre-Production', item: 'Script Development', estimated: 5000, actual: 4500 },
  { id: 2, category: 'Pre-Production', item: 'Location Scouting', estimated: 2000, actual: 1800 },
  { id: 3, category: 'Production', item: 'Camera Equipment Rental', estimated: 15000, actual: 14500 },
  { id: 4, category: 'Production', item: 'Crew Salaries', estimated: 25000, actual: 25000 },
  { id: 5, category: 'Production', item: 'Actor Fees', estimated: 20000, actual: 22000 },
  { id: 6, category: 'Post-Production', item: 'Editing', estimated: 8000, actual: 6000 },
  { id: 7, category: 'Post-Production', item: 'Sound Design', estimated: 5000, actual: 0 },
  { id: 8, category: 'Marketing', item: 'Festival Submissions', estimated: 3000, actual: 0 },
]

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      items: [...INITIAL_ITEMS],
      nextId: 9,
      addItem: (item) =>
        set((s) => {
          const id = s.nextId
          return { items: [...s.items, { ...item, id }], nextId: id + 1 }
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateItem: (id, updates) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      reset: () => set({ items: [...INITIAL_ITEMS], nextId: 9 }),
    }),
    { name: 'cinex-budget' }
  )
)
