import { describe, it, expect } from 'vitest'
import { emptySession, accumulateEntry } from '../../../src/domain/SessionMetrics.js'
import type { UsageEntry } from '../../../src/domain/UsageEntry.js'

function makeEntry(overrides: Partial<UsageEntry> = {}): UsageEntry {
  return {
    sessionId: 'sid',
    timestamp: new Date('2026-05-28T10:00:00Z'),
    model: 'claude-sonnet-4-6',
    inputTokens: 100,
    outputTokens: 50,
    cacheWriteTokens: 20,
    cacheReadTokens: 10,
    costUSD: 0.001,
    ...overrides,
  }
}

describe('emptySession', () => {
  it('initializes with zero values', () => {
    const s = emptySession('sid')
    expect(s.inputTokens).toBe(0)
    expect(s.costUSD).toBe(0)
    expect(s.messageCount).toBe(0)
  })
})

describe('accumulateEntry', () => {
  it('adds token counts', () => {
    const s = accumulateEntry(emptySession('sid'), makeEntry())
    expect(s.inputTokens).toBe(100)
    expect(s.outputTokens).toBe(50)
    expect(s.messageCount).toBe(1)
  })

  it('accumulates across multiple entries', () => {
    let s = emptySession('sid')
    s = accumulateEntry(s, makeEntry({ inputTokens: 100, costUSD: 0.001 }))
    s = accumulateEntry(s, makeEntry({ inputTokens: 200, costUSD: 0.002 }))
    expect(s.inputTokens).toBe(300)
    expect(s.costUSD).toBeCloseTo(0.003)
    expect(s.messageCount).toBe(2)
  })

  it('updates model from entry', () => {
    const s = accumulateEntry(emptySession('sid'), makeEntry({ model: 'claude-opus-4-7' }))
    expect(s.model).toBe('claude-opus-4-7')
  })

  it('computes totalTokens', () => {
    const s = accumulateEntry(emptySession('sid'), makeEntry())
    expect(s.totalTokens).toBe(100 + 50 + 20 + 10)
  })
})
