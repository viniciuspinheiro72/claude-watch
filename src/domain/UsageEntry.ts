import { computeCost } from './pricing.js'

export interface UsageEntry {
  readonly sessionId: string
  readonly timestamp: Date
  readonly model: string
  readonly inputTokens: number
  readonly outputTokens: number
  readonly cacheWriteTokens: number
  readonly cacheReadTokens: number
  readonly costUSD: number
}

function num(v: unknown): number {
  return typeof v === 'number' && isFinite(v) ? Math.max(0, v) : 0
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export function parseUsageEntry(line: string, fallbackSessionId: string): UsageEntry | null {
  try {
    const obj = JSON.parse(line) as Record<string, unknown>

    // Only process assistant messages with real usage data
    if (obj['type'] !== 'assistant') return null
    const msg = obj['message'] as Record<string, unknown> | undefined
    if (!msg) return null

    const usage = msg['usage'] as Record<string, unknown> | undefined
    if (!usage) return null

    const model = str(msg['model'])
    if (!model || model === '<synthetic>') return null

    const inputTokens = num(usage['input_tokens'])
    const outputTokens = num(usage['output_tokens'])
    const cacheWriteTokens = num(usage['cache_creation_input_tokens'])
    const cacheReadTokens = num(usage['cache_read_input_tokens'])

    // Skip zero-usage entries (synthetic/internal messages)
    if (inputTokens + outputTokens + cacheWriteTokens + cacheReadTokens === 0) return null

    const sessionId = str(obj['sessionId']) || fallbackSessionId
    const rawTs = str(obj['timestamp'])
    const timestamp = rawTs ? new Date(rawTs) : new Date()

    const costUSD = computeCost(model, inputTokens, outputTokens, cacheWriteTokens, cacheReadTokens)

    return { sessionId, timestamp, model, inputTokens, outputTokens, cacheWriteTokens, cacheReadTokens, costUSD }
  } catch {
    return null
  }
}
