import { Box, Text, useInput, useApp } from 'ink'
import { useLogWatcher } from './hooks/useLogWatcher.js'
import { useAggregator } from './hooks/useAggregator.js'
import { SessionPanel } from './panels/SessionPanel.js'
import { TodayPanel } from './panels/TodayPanel.js'
import { HistoryPanel } from './panels/HistoryPanel.js'
import { SmallPanel } from './panels/SmallPanel.js'

interface Props {
  projectFilter?: string
  small?: boolean
}

export function App({ projectFilter, small = false }: Props) {
  const { exit } = useApp()
  const entries = useLogWatcher({ projectFilter })
  const { currentSession, todayMetrics, recentDays } = useAggregator(entries)

  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      exit()
    }
  })

  const hasData = currentSession !== null || todayMetrics !== null

  if (small) {
    return <SmallPanel />
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="white">
          claude-watch{' '}
        </Text>
        <Text dimColor>
          {projectFilter ? `[${projectFilter}]` : '[all projects]'} · press q to quit
        </Text>
      </Box>

      {!hasData ? (
        <Box borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
          <Text dimColor>Waiting for Claude Code session… (reading ~/.claude/projects/)</Text>
        </Box>
      ) : (
        <>
          <Box flexDirection="row" alignItems="flex-start">
            {currentSession && <SessionPanel metrics={currentSession} />}
            {todayMetrics && <TodayPanel metrics={todayMetrics} />}
          </Box>

          {recentDays.length > 1 && <HistoryPanel days={recentDays} />}
        </>
      )}
    </Box>
  )
}
