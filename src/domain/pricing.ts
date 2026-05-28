interface ModelPricing {
  input: number       // per 1M tokens, USD
  output: number
  cacheWrite: number
  cacheRead: number
}

// Prices per 1M tokens in USD (as of 2026-05)
const PRICING: Record<string, ModelPricing> = {
  'claude-opus-4-7':           { input: 15,   output: 75,  cacheWrite: 18.75, cacheRead: 1.50 },
  'claude-opus-4-6':           { input: 15,   output: 75,  cacheWrite: 18.75, cacheRead: 1.50 },
  'claude-opus-4-5':           { input: 15,   output: 75,  cacheWrite: 18.75, cacheRead: 1.50 },
  'claude-sonnet-4-6':         { input: 3,    output: 15,  cacheWrite: 3.75,  cacheRead: 0.30 },
  'claude-sonnet-4-5':         { input: 3,    output: 15,  cacheWrite: 3.75,  cacheRead: 0.30 },
  'claude-haiku-4-5':          { input: 0.80, output: 4,   cacheWrite: 1.00,  cacheRead: 0.08 },
  'claude-haiku-4-5-20251001': { input: 0.80, output: 4,   cacheWrite: 1.00,  cacheRead: 0.08 },
  'claude-3-5-sonnet-20241022':{ input: 3,    output: 15,  cacheWrite: 3.75,  cacheRead: 0.30 },
  'claude-3-5-haiku-20241022': { input: 0.80, output: 4,   cacheWrite: 1.00,  cacheRead: 0.08 },
  'claude-3-opus-20240229':    { input: 15,   output: 75,  cacheWrite: 18.75, cacheRead: 1.50 },
}

const DEFAULT_PRICING: ModelPricing = { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.30 }

export function getPricing(model: string): ModelPricing {
  // Exact match first, then prefix match for versioned model IDs
  if (PRICING[model]) return PRICING[model]
  const prefix = Object.keys(PRICING).find((k) => model.startsWith(k) || k.startsWith(model))
  return prefix ? (PRICING[prefix] as ModelPricing) : DEFAULT_PRICING
}

export function computeCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  cacheWriteTokens: number,
  cacheReadTokens: number,
): number {
  const p = getPricing(model)
  return (
    (inputTokens * p.input +
      outputTokens * p.output +
      cacheWriteTokens * p.cacheWrite +
      cacheReadTokens * p.cacheRead) /
    1_000_000
  )
}
