/* ─────────────────────────────────────────────
   projectSync.ts — tRPC sync layer for ProjectStore
   Bridges localStorage state with backend DB
   ───────────────────────────────────────────── */

import { trpcClient } from '../providers/trpc'

/**
 * Fetch all projects from backend.
 * Call this on app mount to hydrate from server.
 */
export async function syncProjectsFromServer() {
  try {
    const projects = await trpcClient.project.list.query()
    return { projects, ok: true }
  } catch (err: any) {
    console.warn('[ProjectSync] Server fetch failed, using localStorage:', err.message)
    return { projects: [], ok: false }
  }
}

/**
 * Push a new project to the backend.
 */
export async function syncProjectToServer(data: {
  title: string
  slug: string
  description?: string
  genre?: string
  language?: string
  budgetRange?: string
  producerName?: string
  directorName?: string
  isPublic?: boolean
}) {
  try {
    const result = await trpcClient.project.create.mutate(data)
    return { ok: true, id: result.id }
  } catch (err: any) {
    console.warn('[ProjectSync] Project create failed:', err.message)
    return { ok: false, error: err.message }
  }
}

/**
 * Delete a project from the backend.
 */
export async function deleteProjectFromServer(id: number) {
  try {
    await trpcClient.project.delete.mutate({ id })
    return { ok: true }
  } catch (err: any) {
    console.warn('[ProjectSync] Project delete failed:', err.message)
    return { ok: false, error: err.message }
  }
}
