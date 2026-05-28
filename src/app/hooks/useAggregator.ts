import { useMemo } from 'react'
import { accumulateEntry, emptySession } from '../../domain/SessionMetrics.js'
import { buildDayMetrics } from '../../domain/DayMetrics.js'
import { today } from '../../utils/format.js'
import type { UsageEntry } from '../../domain/UsageEntry.js'
import type { SessionMetrics } from '../../domain/SessionMetrics.js'
import type { DayMetrics } from '../../domain/DayMetrics.js'

export interface AggregatedState {
  currentSession: SessionMetrics | null
  todayMetrics: DayMetrics | null
  recentDays: DayMetrics[]  // last 7 days, newest first
}

export function useAggregator(entries: UsageEntry[]): AggregatedState {
  return useMemo(() => {
    if (entries.length === 0) {
      return { currentSession: null, todayMetrics: null, recentDays: [] }
    }

    // Find the most recent session (latest entry timestamp)
    const lastEntry = entries.reduce((a, b) => (a.timestamp > b.timestamp ? a : b))
    const currentSessionId = lastEntry.sessionId

    // Build current session metrics
    const sessionEntries = entries.filter((e) => e.sessionId === currentSessionId)
    const currentSession = sessionEntries.reduce(
      (acc, entry) => accumulateEntry(acc, entry),
      emptySession(currentSessionId),
    )

    // Build day metrics
    const dayMap = buildDayMetrics(entries)
    const todayKey = today()
    const todayMetrics = dayMap.get(todayKey) ?? null

    // Last 7 days sorted newest first
    const recentDays = [...dayMap.values()]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7)

    return { currentSession, todayMetrics, recentDays }
  }, [entries])
}
