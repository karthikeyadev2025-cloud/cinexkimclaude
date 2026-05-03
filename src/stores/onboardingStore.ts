/* ─────────────────────────────────────────────
   onboardingStore.ts — User Onboarding State
   Persists onboarding completion + collected data
   ───────────────────────────────────────────── */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingData {
  fullName: string
  phone: string
  location: string
  role: string
  experience: string
  projectTypes: string[]
  languages: string[]
  completed: boolean
}

interface OnboardingState extends OnboardingData {
  setField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void
  setCompleted: () => void
  reset: () => void
}

const initial: OnboardingData = {
  fullName: '',
  phone: '',
  location: '',
  role: '',
  experience: '',
  projectTypes: [],
  languages: [],
  completed: false,
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initial,

      setField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),

      setCompleted: () => set({ completed: true }),

      reset: () => set(initial),
    }),
    { name: 'cinex-onboarding' },
  ),
)
