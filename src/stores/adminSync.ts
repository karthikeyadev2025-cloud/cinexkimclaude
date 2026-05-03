/* ─────────────────────────────────────────────
   adminSync.ts — tRPC sync layer for Admin page
   Bridges mock data with real backend data
   ───────────────────────────────────────────── */

import { trpcClient } from '../providers/trpc'

/** Fetch admin dashboard stats from backend */
export async function fetchAdminStats() {
  try {
    const stats = await trpcClient.admin.stats.query()
    return { ...stats, ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] Stats fetch failed:', err.message)
    return {
      users: 0, talent: 0, directors: 0,
      projects: 0, calls: 0, submissions: 0,
      pendingTalent: 0, pendingDirectors: 0,
      ok: false,
    }
  }
}

/** Fetch all users from backend */
export async function fetchAdminUsers() {
  try {
    const users = await trpcClient.admin.userList.query()
    return { users, ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] User list fetch failed:', err.message)
    return { users: [], ok: false }
  }
}

/** Update user role on backend */
export async function updateUserRoleOnServer(id: number, role: 'user' | 'admin' | 'casting' | 'talent') {
  try {
    await trpcClient.admin.userUpdateRole.mutate({ id, role })
    return { ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] Role update failed:', err.message)
    return { ok: false, error: err.message }
  }
}

/** Activate/deactivate user on backend */
export async function toggleUserActiveOnServer(id: number, isActive: boolean) {
  try {
    await trpcClient.admin.userDeactivate.mutate({ id, isActive })
    return { ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] User toggle failed:', err.message)
    return { ok: false, error: err.message }
  }
}

/** Fetch feature toggles from backend */
export async function fetchAdminFeatures() {
  try {
    const features = await trpcClient.admin.featureList.query()
    return { features, ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] Feature list failed:', err.message)
    return { features: [], ok: false }
  }
}

/** Update feature toggle on backend */
export async function updateFeatureOnServer(id: number, enabled: boolean) {
  try {
    await trpcClient.admin.featureUpdate.mutate({ id, enabled })
    return { ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] Feature update failed:', err.message)
    return { ok: false, error: err.message }
  }
}

/** Fetch plans from backend */
export async function fetchAdminPlans() {
  try {
    const plans = await trpcClient.admin.planList.query()
    return { plans, ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] Plan list failed:', err.message)
    return { plans: [], ok: false }
  }
}

/** Fetch API configs from backend */
export async function fetchAdminApiConfigs() {
  try {
    const configs = await trpcClient.admin.apiConfigList.query()
    return { configs, ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] API config list failed:', err.message)
    return { configs: [], ok: false }
  }
}

/** Fetch audit logs from backend */
export async function fetchAdminAuditLogs(limit = 50, offset = 0) {
  try {
    const logs = await trpcClient.admin.auditList.query({ limit, offset })
    return { logs, ok: true }
  } catch (err: any) {
    console.warn('[AdminSync] Audit logs failed:', err.message)
    return { logs: [], ok: false }
  }
}
