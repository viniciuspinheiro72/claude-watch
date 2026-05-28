import { describe, it, expect } from 'vitest'
import { buildDayMetrics, emptyDay, entryDateKey } from '../../../src/domain/DayMetrics.js'
import type { UsageEntry } from '../../../src/domain/UsageEntry.js'

function entry(date: string, sessionId: string, cost = 0.01): UsageEntry {
  return {
    sessionId,
    timestamp: new Date(`${date}T10:00:00Z`),
    model: 'claude-sonnet-4-6',
    inputTokens: 100,
    outputTokens: 50,
    cacheWriteTokens: 0,
    cacheReadTokens: 0,
    costUSD: cost,
  }
}

describe('emptyDay', () => {
  it('initializes with zeros', () => {
    const d = emptyDay('2026-05-28')
    expect(d.costUSD).toBe(0)
    expect(d.sessionCount).toBe(0)
  })
})

describe('entryDateKey', () => {
  it('extracts YYYY-MM-DD from timestamp', () => {
    const e = entry('2026-05-28', 'sid')
    expect(entryDateKey(e)).toBe('2026-05-28')
  })
})

describe('buildDayMetrics', () => {
  it('returns empty map for no entries', () => {
    expect(buildDayMetrics([])).toEqual(new Map())
  })

  it('groups entries by date', () => {
    const entries = [
      entry('2026-05-27', 's1', 0.01),
      entry('2026-05-28', 's2', 0.02),
    ]
    const map = buildDayMetrics(entries)
    expect(map.size).toBe(2)
    expect(map.get('2026-05-27')!.costUSD).toBeCloseTo(0.01)
    expect(map.get('2026-05-28')!.costUSD).toBeCloseTo(0.02)
  })

  it('counts unique sessions per day', () => {
    const entries = [
      entry('2026-05-28', 's1'),
      entry('2026-05-28', 's1'),  // same session
      entry('2026-05-28', 's2'),  // different session
    ]
    const map = buildDayMetrics(entries)
    expect(map.get('2026-05-28')!.sessionCount).toBe(2)
    expect(map.get('2026-05-28')!.messageCount).toBe(3)
  })

  it('accumulates tokens across entries', () => {
    const entries = [
      entry('2026-05-28', 's1', 0.01),
      entry('2026-05-28', 's2', 0.03),
    ]
    const map = buildDayMetrics(entries)
    expect(map.get('2026-05-28')!.costUSD).toBeCloseTo(0.04)
    expect(map.get('2026-05-28')!.inputTokens).toBe(200)
  })
})
