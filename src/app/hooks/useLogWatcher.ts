import { useState, useEffect, useRef } from 'react'
import { LogReader } from '../../infrastructure/LogReader.js'
import { listProjects, getClaudeDir } from '../../infrastructure/ProjectResolver.js'
import type { UsageEntry } from '../../domain/UsageEntry.js'

interface Options {
  projectFilter?: string
}

export function useLogWatcher({ projectFilter }: Options = {}): UsageEntry[] {
  const [entries, setEntries] = useState<UsageEntry[]>([])
  const readerRef = useRef<LogReader | null>(null)

  useEffect(() => {
    const reader = new LogReader((entry) => {
      setEntries((prev) => [...prev, entry])
    })
    readerRef.current = reader

    async function init() {
      const projects = await listProjects(projectFilter)
      const allFiles = projects.flatMap((p) => p.sessionFiles)

      // Seed with existing data, then watch for changes
      await reader.readAll(allFiles)
      reader.watchAll(allFiles)

      // Also watch the base dir for new session files
      reader.watchDirectory(getClaudeDir(), (newFile) => {
        reader.watchAll([newFile])
      })
    }

    init()

    return () => {
      reader.stop()
    }
  }, [projectFilter])

  return entries
}
