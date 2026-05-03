/* ─────────────────────────────────────────────
   subscriptionStore.ts — Subscription & AI Credit Management
   Tracks user's plan, trial status, and AI credit usage.
   ───────────────────────────────────────────── */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SubscriptionPlan {
  planSlug: 'free' | 'indie' | 'studio' | 'big_maker' | 'legacy' | 'pro'
  status: 'trial' | 'active' | 'cancelled' | 'expired'
  trialDaysLeft: number
  aiCreditsUsed: number
  aiCreditsLimit: number
  features: string[]
  expiresAt?: string
}

export const PRO_FEATURES = [
  'screenwriting',
  'script_breakdown',
  'shot_list',
  'storyboarding',
  'scheduling',
  'call_sheets',
  'budgeting',
  'pre_visualization',
  'script_doctor',
  'beat_boards',
  'location_scout',
  'scene_treatment',
  'casting_ai',
  'lookbook',
  'subtitle_ai',
  'team_chat',
  'reviews',
  'casting_directory',
  'casting_agencies',
  'ai_image_generation',
  'ai_video_generation',
  'ai_script_suggestions',
]

export const FREE_FEATURES = [
  'screenwriting',
  'script_breakdown',
  'shot_list',
]

const DEFAULT_PLAN: SubscriptionPlan = {
  planSlug: 'free',
  status: 'trial',
  trialDaysLeft: 3,
  aiCreditsUsed: 0,
  aiCreditsLimit: 50,
  features: PRO_FEATURES, // Trial starts with all Pro features
}

interface SubscriptionState {
  plan: SubscriptionPlan
  /* ─── Queries ─── */
  canUseAI: () => boolean
  hasCredits: () => boolean
  getCreditsRemaining: () => number
  isPro: () => boolean
  isTrial: () => boolean
  hasFeature: (featureId: string) => boolean
  /* ─── Actions ─── */
  setPlan: (plan: Partial<SubscriptionPlan>) => void
  useCredit: () => boolean
  addCredits: (amount: number) => void
  resetCredits: () => void
  decrementTrialDay: () => void
  clearPlan: () => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: { ...DEFAULT_PLAN },

      canUseAI: () => {
        const { plan } = get()
        // Free users cannot use AI
        if (plan.planSlug === 'free' && plan.status !== 'trial') return false
        // Expired subscriptions cannot use AI
        if (plan.status === 'expired') return false
        // Need credits
        return plan.aiCreditsUsed < plan.aiCreditsLimit
      },

      hasCredits: () => {
        const { plan } = get()
        return plan.aiCreditsUsed < plan.aiCreditsLimit
      },

      getCreditsRemaining: () => {
        const { plan } = get()
        return Math.max(0, plan.aiCreditsLimit - plan.aiCreditsUsed)
      },

      isPro: () => {
        const { plan } = get()
        return plan.planSlug !== 'free' || plan.status === 'trial'
      },

      isTrial: () => {
        return get().plan.status === 'trial'
      },

      hasFeature: (featureId: string) => {
        const { plan } = get()
        return plan.features.includes(featureId)
      },

      setPlan: (updates) => {
        set((s) => ({
          plan: { ...s.plan, ...updates },
        }))
      },

      useCredit: () => {
        const state = get()
        if (!state.hasCredits()) return false
        set((s) => ({
          plan: {
            ...s.plan,
            aiCreditsUsed: s.plan.aiCreditsUsed + 1,
          },
        }))
        return true
      },

      addCredits: (amount) => {
        set((s) => ({
          plan: {
            ...s.plan,
            aiCreditsLimit: s.plan.aiCreditsLimit + amount,
          },
        }))
      },

      resetCredits: () => {
        set((s) => ({
          plan: {
            ...s.plan,
            aiCreditsUsed: 0,
          },
        }))
      },

      decrementTrialDay: () => {
        set((s) => {
          const nextDays = Math.max(0, s.plan.trialDaysLeft - 1)
          const nextStatus = nextDays === 0 && s.plan.status === 'trial'
            ? 'expired' as const
            : s.plan.status
          const nextPlan = nextDays === 0 && s.plan.status === 'trial'
            ? 'free' as const
            : s.plan.planSlug
          const nextFeatures = nextStatus === 'expired'
            ? FREE_FEATURES
            : s.plan.features
          return {
            plan: {
              ...s.plan,
              trialDaysLeft: nextDays,
              status: nextStatus,
              planSlug: nextPlan,
              features: nextFeatures,
            },
          }
        })
      },

      clearPlan: () => {
        set({ plan: { ...DEFAULT_PLAN } })
      },
    }),
    {
      name: 'cinex-subscription-v1',
      partialize: (state) => ({ plan: state.plan }),
    },
  ),
)
