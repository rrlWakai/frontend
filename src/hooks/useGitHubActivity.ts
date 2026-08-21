import { useEffect, useState } from 'react'
import {
  groupDaysIntoWeeks,
  type ContributionWeek,
  type GitHubActivityResponse,
  type GitHubStats,
} from '../data/site'

export type ActivityStatus = 'loading' | 'error' | 'ready'

export type ActivityState = {
  status: ActivityStatus
  stats?: GitHubStats
  weeks?: ContributionWeek[]
}

/**
 * Base URL of the backend service, e.g. https://portfolio-github-api.onrender.com.
 * Unset → same-origin requests (useful if the API is proxied behind the site).
 */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

/** Generous enough to ride out Render free-tier cold starts (~20–30s) */
const REQUEST_TIMEOUT_MS = 30_000

/* Session cache — module-level so remounts/re-renders never re-fetch */
let sessionCache: ActivityState | null = null
let sessionInflight: Promise<ActivityState> | null = null

async function fetchActivity(): Promise<ActivityState> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE}/api/github-contributions`, {
      signal: controller.signal,
    })
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    const payload = (await res.json()) as GitHubActivityResponse
    if (!payload || !Array.isArray(payload.days) || payload.days.length === 0) {
      throw new Error('Malformed response from backend')
    }

    return {
      status: 'ready',
      stats: {
        totalContributions: payload.totalContributions,
        currentStreak: payload.currentStreak,
        longestStreak: payload.longestStreak,
      },
      weeks: groupDaysIntoWeeks(payload.days),
    }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Fetches GitHub activity from the backend once per session.
 * Failures are not cached, so a later mount retries.
 */
export function useGitHubActivity(): ActivityState {
  const [state, setState] = useState<ActivityState>(sessionCache ?? { status: 'loading' })

  useEffect(() => {
    if (sessionCache) return

    let cancelled = false

    if (!sessionInflight) {
      sessionInflight = fetchActivity()
        .then((result) => {
          sessionCache = result
          return result
        })
        .catch((err) => {
          console.error('[github-activity]', err)
          return { status: 'error' as const }
        })
        .finally(() => {
          sessionInflight = null
        })
    }

    sessionInflight.then((result) => {
      if (!cancelled) setState(result)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}