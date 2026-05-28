import { Box, Text } from 'ink'
import type { DayMetrics } from '../../domain/DayMetrics.js'
import { formatTokens, formatCost } from '../../utils/format.js'

interface Props {
  metrics: DayMetrics
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

export function TodayPanel({ metrics }: Props) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" paddingX={1}>
      <Box marginBottom={1}>
        <Text bold color="blue">
          Today — {metrics.date}
        </Text>
      </Box>

      <Row label="Sessions" value={String(metrics.sessionCount)} />
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
          <Text bold>Today's cost</Text>
        </Box>
        <Text bold color="magenta">
          {formatCost(metrics.costUSD)}
        </Text>
      </Box>
    </Box>
  )
}
