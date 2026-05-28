import { Box, Text } from 'ink'
import { useUsage } from '../hooks/useUsage.js'

const BAR_WIDTH = 16

function bar(pct: number): string {
  const filled = Math.min(BAR_WIDTH, Math.round((pct / 100) * BAR_WIDTH))
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)
}

function barColor(pct: number): string {
  if (pct < 40) return 'green'
  if (pct < 75) return 'yellow'
  return 'red'
}

function timeUntil(date: Date): string {
  const ms = date.getTime() - Date.now()
  if (ms <= 0) return 'now'
  const mins = Math.floor(ms / 60_000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${String(mins % 60).padStart(2, '0')}m`
  return `${mins}m`
}

function shortDate(date: Date): string {
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export function SmallPanel() {
  const usage = useUsage()

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1}>
      <Box marginBottom={1}>
        <Text bold color="white">claude-watch </Text>
        <Text dimColor>widget</Text>
      </Box>

      {!usage ? (
        <Box flexDirection="column">
          <Text dimColor>fetching usage…</Text>
          <Box marginTop={1}>
            <Text dimColor>[q] quit</Text>
          </Box>
        </Box>
      ) : (
        <>
          <Box>
            <Box width={10}><Text dimColor>session </Text></Box>
            <Text color={barColor(usage.session.utilization)}>{bar(usage.session.utilization)} </Text>
            <Box width={5}><Text color="white">{Math.round(usage.session.utilization)}% </Text></Box>
            <Text dimColor>↻ {timeUntil(usage.session.resetsAt)}</Text>
          </Box>

          <Box>
            <Box width={10}><Text dimColor>week    </Text></Box>
            <Text color={barColor(usage.week.utilization)}>{bar(usage.week.utilization)} </Text>
            <Box width={5}><Text color="magenta">{Math.round(usage.week.utilization)}% </Text></Box>
            <Text dimColor>↻ {shortDate(usage.week.resetsAt)}</Text>
          </Box>

          <Box marginTop={1}>
            <Text dimColor>[q] quit</Text>
          </Box>
        </>
      )}
    </Box>
  )
}
