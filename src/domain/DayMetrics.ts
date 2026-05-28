import type { UsageEntry } from './UsageEntry.js'

export interface DayMetrics {
  readonly date: string  // YYYY-MM-DD
  readonly inputTokens: number
  readonly outputTokens: number
  readonly cacheWriteTokens: number
  readonly cacheReadTokens: number
  readonly totalTokens: number
  readonly costUSD: number
  readonly sessionCount: number
  readonly messageCount: number
}

export function emptyDay(date: string): DayMetrics {
  return {
    date,
    inputTokens: 0,
    outputTokens: 0,
    cacheWriteTokens: 0,
    cacheReadTokens: 0,
    totalTokens: 0,
    costUSD: 0,
    sessionCount: 0,
    messageCount: 0,
  }
}

export function entryDateKey(entry: UsageEntry): string {
  return entry.timestamp.toISOString().slice(0, 10)
}

export function buildDayMetrics(entries: UsageEntry[]): Map<string, DayMetrics> {
  const sessionsByDay = new Map<string, Set<string>>()
  const days = new Map<string, DayMetrics>()

  for (const entry of entries) {
    const date = entryDateKey(entry)
    const current = days.get(date) ?? emptyDay(date)
    const sessions = sessionsByDay.get(date) ?? new Set<string>()
    const isNewSession = !sessions.has(entry.sessionId)
    sessions.add(entry.sessionId)
    sessionsByDay.set(date, sessions)

    const inputTokens = current.inputTokens + entry.inputTokens
    const outputTokens = current.outputTokens + entry.outputTokens
    const cacheWriteTokens = current.cacheWriteTokens + entry.cacheWriteTokens
    const cacheReadTokens = current.cacheReadTokens + entry.cacheReadTokens

    days.set(date, {
      date,
      inputTokens,
      outputTokens,
      cacheWriteTokens,
      cacheReadTokens,
      totalTokens: inputTokens + outputTokens + cacheWriteTokens + cacheReadTokens,
      costUSD: current.costUSD + entry.costUSD,
      sessionCount: current.sessionCount + (isNewSession ? 1 : 0),
      messageCount: current.messageCount + 1,
    })
  }

  return days
}
