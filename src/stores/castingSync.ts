/* ─────────────────────────────────────────────
   castingSync.ts — tRPC sync layer for CastingStore
   Bridges localStorage state with backend DB
   ───────────────────────────────────────────── */

import { trpcClient } from '../providers/trpc'

/**
 * Fetch all casting data from backend.
 * Call this on app mount to hydrate from server.
 */
export async function syncCastingFromServer() {
  try {
    const [directors, talent, calls, submissions] = await Promise.all([
      trpcClient.casting.directorList.query(),
      trpcClient.casting.talentList.query(),
      trpcClient.casting.callList.query(),
      trpcClient.casting.submissionList.query(),
    ])
    return { directors, talent, calls, submissions, ok: true }
  } catch (err: any) {
    console.warn('[CastingSync] Server fetch failed, using localStorage:', err.message)
    return { directors: [], talent: [], calls: [], submissions: [], ok: false }
  }
}

/**
 * Push a casting call to the backend.
 * Call after localStore.addCastingCall().
 */
export async function syncCastingCallToServer(data: {
  projectId: number
  title: string
  roleName: string
  roleDescription?: string
  gender?: string
  ageMin?: number
  ageMax?: number
  location?: string
  remuneration?: string
  shootingDates?: string
  auditionDeadline?: string
  requiredSkills?: string[]
}) {
  try {
    const result = await trpcClient.casting.callCreate.mutate(data)
    return { ok: true, id: result.id }
  } catch (err: any) {
    console.warn('[CastingSync] Call create failed:', err.message)
    return { ok: false, error: err.message }
  }
}

/**
 * Submit an audition application to the backend.
 */
export async function syncSubmissionToServer(data: {
  callId: number
  talentId: number
  directorId?: number
  message?: string
  mediaUrls?: string[]
}) {
  try {
    const result = await trpcClient.casting.submissionCreate.mutate(data)
    return { ok: true, id: result.id }
  } catch (err: any) {
    console.warn('[CastingSync] Submission failed:', err.message)
    return { ok: false, error: err.message }
  }
}
