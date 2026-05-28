import { Box, Text, useInput, useApp } from 'ink'
import { useState, useEffect } from 'react'
import type { SessionMetrics } from '../../domain/SessionMetrics.js'
import type { DayMetrics } from '../../domain/DayMetrics.js'
import { formatTokens, formatCost } from '../../utils/format.js'

interface Props {
  currentSession: SessionMetrics | null
  todayMetrics: DayMetrics | null
  recentDays: DayMetrics[]
}

const BAR_WIDTH = 16

function bar(ratio: number): string {
  const filled = Math.min(BAR_WIDTH, Math.round(ratio * BAR_WIDTH))
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)
}

function barColor(ratio: number): string {
  if (ratio < 0.4) return 'green'
  if (ratio < 0.75) return 'yellow'
  return 'red'
}

function timeUntilMidnight(): string {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const ms = midnight.getTime() - now.getTime()
  const totalMinutes = Math.floor(ms / 60_000)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export function SmallPanel({ currentSession, todayMetrics, recentDays }: Props) {
  const { exit } = useApp()
  const [tick, setTick] = useState(0)

  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) exit()
  })

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  void tick

  const maxDayCost = Math.max(...recentDays.map((d) => d.costUSD), 0.0001)
  const todayCost = todayMetrics?.costUSD ?? 0
  const sessionCost = currentSession?.costUSD ?? 0
  const sessionTokens = (currentSession?.inputTokens ?? 0) + (currentSession?.outputTokens ?? 0)

  const todayRatio = todayCost / maxDayCost
  const sessionRatio = todayCost > 0 ? sessionCost / todayCost : 0

  const hasData = currentSession !== null || todayMetrics !== null

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1}>
      <Box marginBottom={1}>
        <Text bold color="white">claude-watch </Text>
        <Text dimColor>widget</Text>
      </Box>

      {!hasData ? (
        <Box>
          <Text dimColor>waiting for session…</Text>
        </Box>
      ) : (
        <>
          <Box>
            <Box width={10}><Text dimColor>session </Text></Box>
            <Text color={barColor(sessionRatio)}>{bar(sessionRatio)} </Text>
            <Text color="white">{formatCost(sessionCost)} </Text>
            <Text dimColor>{formatTokens(sessionTokens)}</Text>
          </Box>

          <Box>
            <Box width={10}><Text dimColor>today   </Text></Box>
            <Text color={barColor(todayRatio)}>{bar(todayRatio)} </Text>
            <Text color="magenta">{formatCost(todayCost)} </Text>
            <Text dimColor>{todayMetrics?.sessionCount ?? 0}s</Text>
          </Box>

          <Box marginTop={1}>
            <Text dimColor>↻ resets in {timeUntilMidnight()}  </Text>
            <Text dimColor color="gray">[q] quit</Text>
          </Box>
        </>
      )}
    </Box>
  )
}
