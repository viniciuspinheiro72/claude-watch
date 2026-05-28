import { Box, Text } from 'ink'
import type { SessionMetrics } from '../../domain/SessionMetrics.js'
import { formatTokens, formatCost, formatDuration, formatTime } from '../../utils/format.js'

interface Props {
  metrics: SessionMetrics
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box>
      <Box width={22}>
        <Text dimColor>{label}</Text>
      </Box>
      <Text color={color}>{value}</Text>
    </Box>
  )
}

export function SessionPanel({ metrics }: Props) {
  const now = new Date()
  const duration = formatDuration(metrics.startedAt, now)

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1} marginRight={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Current Session
        </Text>
      </Box>

      <Row label="Model" value={metrics.model || '—'} color="white" />
      <Row label="Duration" value={duration} />
      <Row label="Messages" value={String(metrics.messageCount)} />

      <Box marginTop={1} marginBottom={1}>
        <Text dimColor>{'─'.repeat(30)}</Text>
      </Box>

      <Row label="Input tokens" value={formatTokens(metrics.inputTokens)} />
      <Row label="Output tokens" value={formatTokens(metrics.outputTokens)} />
      <Row label="Cache write" value={formatTokens(metrics.cacheWriteTokens)} color="yellow" />
      <Row label="Cache read" value={formatTokens(metrics.cacheReadTokens)} color="green" />
      <Row label="Total tokens" value={formatTokens(metrics.totalTokens)} color="white" />

      <Box marginTop={1}>
        <Box width={22}>
          <Text bold>Session cost</Text>
        </Box>
        <Text bold color="magenta">
          {formatCost(metrics.costUSD)}
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Updated {formatTime(metrics.lastUpdatedAt)}</Text>
      </Box>
    </Box>
  )
}
