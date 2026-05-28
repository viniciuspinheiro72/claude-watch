import { describe, it, expect } from 'vitest'
import { computeCost, getPricing } from '../../../src/domain/pricing.js'

describe('getPricing', () => {
  it('returns exact match', () => {
    const p = getPricing('claude-sonnet-4-6')
    expect(p.input).toBe(3)
    expect(p.output).toBe(15)
  })

  it('returns default pricing for unknown model', () => {
    const p = getPricing('claude-unknown-99')
    expect(p.input).toBeGreaterThan(0)
  })

  it('matches prefix for versioned models', () => {
    const p = getPricing('claude-haiku-4-5-20251001')
    expect(p.input).toBe(0.80)
  })
})

describe('computeCost', () => {
  it('returns 0 for all-zero tokens', () => {
    expect(computeCost('claude-sonnet-4-6', 0, 0, 0, 0)).toBe(0)
  })

  it('computes input token cost correctly', () => {
    // 1M input tokens at $3/M = $3
    const cost = computeCost('claude-sonnet-4-6', 1_000_000, 0, 0, 0)
    expect(cost).toBeCloseTo(3, 5)
  })

  it('computes output token cost correctly', () => {
    // 1M output tokens at $15/M = $15
    const cost = computeCost('claude-sonnet-4-6', 0, 1_000_000, 0, 0)
    expect(cost).toBeCloseTo(15, 5)
  })

  it('sums all token types', () => {
    const cost = computeCost('claude-sonnet-4-6', 1_000_000, 1_000_000, 1_000_000, 1_000_000)
    expect(cost).toBeCloseTo(3 + 15 + 3.75 + 0.30, 3)
  })

  it('handles cache read tokens at lower rate', () => {
    const cacheReadOnly = computeCost('claude-sonnet-4-6', 0, 0, 0, 1_000_000)
    const inputOnly = computeCost('claude-sonnet-4-6', 1_000_000, 0, 0, 0)
    expect(cacheReadOnly).toBeLessThan(inputOnly)
  })
})
