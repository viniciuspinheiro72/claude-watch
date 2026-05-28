import { describe, it, expect } from 'vitest'
import { formatTokens, formatCost, formatDuration } from '../../../src/utils/format.js'

describe('formatTokens', () => {
  it('formats small numbers as-is', () => {
    expect(formatTokens(500)).toBe('500')
  })
  it('formats thousands with k', () => {
    expect(formatTokens(12_500)).toBe('12.5k')
  })
  it('formats millions with M', () => {
    expect(formatTokens(2_000_000)).toBe('2.00M')
  })
})

describe('formatCost', () => {
  it('formats zero', () => {
    expect(formatCost(0)).toBe('$0.0000')
  })
  it('formats small cost with 5 decimal places', () => {
    expect(formatCost(0.00042)).toBe('$0.00042')
  })
  it('formats dollar amounts', () => {
    expect(formatCost(3.5)).toBe('$3.50')
  })
})

describe('formatDuration', () => {
  it('formats seconds', () => {
    const start = new Date('2026-05-28T10:00:00Z')
    const end = new Date('2026-05-28T10:00:45Z')
    expect(formatDuration(start, end)).toBe('45s')
  })
  it('formats minutes and seconds', () => {
    const start = new Date('2026-05-28T10:00:00Z')
    const end = new Date('2026-05-28T10:05:30Z')
    expect(formatDuration(start, end)).toBe('5m 30s')
  })
  it('formats hours', () => {
    const start = new Date('2026-05-28T08:00:00Z')
    const end = new Date('2026-05-28T10:15:00Z')
    expect(formatDuration(start, end)).toBe('2h 15m')
  })
})
