import { Box, Text } from 'ink'
import type { DayMetrics } from '../../domain/DayMetrics.js'
import { formatTokens, formatCost } from '../../utils/format.js'
import { today } from '../../utils/format.js'

interface Props {
  days: DayMetrics[]
}

const BAR_WIDTH = 12

function bar(cost: number, maxCost: number): string {
  if (maxCost === 0) return '░'.repeat(BAR_WIDTH)
  const filled = Math.round((cost / maxCost) * BAR_WIDTH)
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)
}

export function HistoryPanel({ days }: Props) {
  if (days.length === 0) return null

  const maxCost = Math.max(...days.map((d) => d.costUSD), 0.0001)
  const todayKey = today()

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} marginTop={1}>
      <Box marginBottom={1}>
        <Text bold color="gray">
          Last 7 Days
        </Text>
      </Box>

      {days.map((day) => {
        const isToday = day.date === todayKey
        return (
          <Box key={day.date}>
            <Box width={11}>
              <Text color={isToday ? 'cyan' : undefined}>{isToday ? 'today' : day.date.slice(5)}</Text>
            </Box>
            <Box width={BAR_WIDTH + 2}>
              <Text color="green">{bar(day.costUSD, maxCost)} </Text>
            </Box>
            <Box width={10}>
              <Text color="magenta">{formatCost(day.costUSD)}</Text>
            </Box>
            <Box width={8}>
              <Text dimColor>{formatTokens(day.totalTokens)}</Text>
            </Box>
            <Text dimColor> {day.sessionCount}s</Text>
          </Box>
        )
      })}
    </Box>
  )
}
