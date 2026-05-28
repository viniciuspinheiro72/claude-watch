import type { UsageEntry } from './UsageEntry.js'

export interface SessionMetrics {
  readonly sessionId: string
  readonly model: string
  readonly inputTokens: number
  readonly outputTokens: number
  readonly cacheWriteTokens: number
  readonly cacheReadTokens: number
  readonly totalTokens: number
  readonly costUSD: number
  readonly messageCount: number
  readonly startedAt: Date
  readonly lastUpdatedAt: Date
}

export function emptySession(sessionId: string): SessionMetrics {
  const now = new Date()
  return {
    sessionId,
    model: '',
    inputTokens: 0,
    outputTokens: 0,
    cacheWriteTokens: 0,
    cacheReadTokens: 0,
    totalTokens: 0,
    costUSD: 0,
    messageCount: 0,
    startedAt: now,
    lastUpdatedAt: now,
  }
}

export function accumulateEntry(metrics: SessionMetrics, entry: UsageEntry): SessionMetrics {
  const inputTokens = metrics.inputTokens + entry.inputTokens
  const outputTokens = metrics.outputTokens + entry.outputTokens
  const cacheWriteTokens = metrics.cacheWriteTokens + entry.cacheWriteTokens
  const cacheReadTokens = metrics.cacheReadTokens + entry.cacheReadTokens
  return {
    sessionId: metrics.sessionId,
    model: entry.model || metrics.model,
    inputTokens,
    outputTokens,
    cacheWriteTokens,
    cacheReadTokens,
    totalTokens: inputTokens + outputTokens + cacheWriteTokens + cacheReadTokens,
    costUSD: metrics.costUSD + entry.costUSD,
    messageCount: metrics.messageCount + 1,
    startedAt: metrics.startedAt,
    lastUpdatedAt: entry.timestamp,
  }
}
