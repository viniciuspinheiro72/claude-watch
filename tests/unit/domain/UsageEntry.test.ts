import { describe, it, expect } from 'vitest'
import { parseUsageEntry } from '../../../src/domain/UsageEntry.js'

const validLine = JSON.stringify({
  type: 'assistant',
  timestamp: '2026-05-28T10:00:00.000Z',
  sessionId: 'test-session-id',
  message: {
    model: 'claude-sonnet-4-6',
    usage: {
      input_tokens: 1000,
      output_tokens: 200,
      cache_creation_input_tokens: 500,
      cache_read_input_tokens: 300,
    },
  },
})

describe('parseUsageEntry', () => {
  it('parses a valid assistant message', () => {
    const entry = parseUsageEntry(validLine, 'fallback')
    expect(entry).not.toBeNull()
    expect(entry!.model).toBe('claude-sonnet-4-6')
    expect(entry!.inputTokens).toBe(1000)
    expect(entry!.outputTokens).toBe(200)
    expect(entry!.cacheWriteTokens).toBe(500)
    expect(entry!.cacheReadTokens).toBe(300)
    expect(entry!.sessionId).toBe('test-session-id')
    expect(entry!.costUSD).toBeGreaterThan(0)
  })

  it('returns null for user messages', () => {
    const line = JSON.stringify({ type: 'user', message: { role: 'user' } })
    expect(parseUsageEntry(line, 'sid')).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    expect(parseUsageEntry('{not json}', 'sid')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseUsageEntry('', 'sid')).toBeNull()
  })

  it('returns null for synthetic model entries', () => {
    const line = JSON.stringify({
      type: 'assistant',
      message: { model: '<synthetic>', usage: { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } },
    })
    expect(parseUsageEntry(line, 'sid')).toBeNull()
  })

  it('returns null for all-zero usage', () => {
    const line = JSON.stringify({
      type: 'assistant',
      message: {
        model: 'claude-sonnet-4-6',
        usage: { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
      },
    })
    expect(parseUsageEntry(line, 'sid')).toBeNull()
  })

  it('uses fallback sessionId when absent', () => {
    const line = JSON.stringify({
      type: 'assistant',
      message: { model: 'claude-sonnet-4-6', usage: { input_tokens: 100, output_tokens: 10, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } },
    })
    const entry = parseUsageEntry(line, 'my-fallback')
    expect(entry!.sessionId).toBe('my-fallback')
  })

  it('handles missing optional fields gracefully', () => {
    const line = JSON.stringify({
      type: 'assistant',
      message: {
        model: 'claude-sonnet-4-6',
        usage: { input_tokens: 500, output_tokens: 100 },
      },
    })
    const entry = parseUsageEntry(line, 'sid')
    expect(entry).not.toBeNull()
    expect(entry!.cacheWriteTokens).toBe(0)
    expect(entry!.cacheReadTokens).toBe(0)
  })
})
