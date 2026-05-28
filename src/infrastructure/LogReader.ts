import { createReadStream, watch, statSync } from 'fs'
import { createInterface } from 'readline'
import { basename } from 'path'
import { parseUsageEntry } from '../domain/UsageEntry.js'
import type { UsageEntry } from '../domain/UsageEntry.js'

export type EntryCallback = (entry: UsageEntry) => void

interface FileState {
  offset: number
  watcher: ReturnType<typeof watch> | null
}

export class LogReader {
  private readonly states = new Map<string, FileState>()
  private readonly callback: EntryCallback

  constructor(callback: EntryCallback) {
    this.callback = callback
  }

  async readAll(files: string[]): Promise<void> {
    for (const file of files) {
      await this.readFrom(file, 0)
    }
  }

  watchAll(files: string[]): void {
    for (const file of files) {
      this.watchFile(file)
    }
  }

  private sessionId(filePath: string): string {
    return basename(filePath, '.jsonl')
  }

  private async readFrom(filePath: string, startOffset: number): Promise<number> {
    return new Promise((resolve) => {
      let offset = startOffset
      const stream = createReadStream(filePath, { start: startOffset, encoding: 'utf8' })
      const rl = createInterface({ input: stream, crlfDelay: Infinity })
      const sid = this.sessionId(filePath)

      rl.on('line', (line) => {
        const trimmed = line.trim()
        if (trimmed) {
          offset += Buffer.byteLength(line, 'utf8') + 1 // +1 for newline
          const entry = parseUsageEntry(trimmed, sid)
          if (entry) this.callback(entry)
        }
      })

      rl.on('close', () => resolve(offset))
      stream.on('error', () => resolve(offset))
    })
  }

  private watchFile(filePath: string): void {
    const existing = this.states.get(filePath)
    if (existing?.watcher) return

    let currentOffset = 0
    try {
      currentOffset = this.states.get(filePath)?.offset ?? 0
    } catch {
      currentOffset = 0
    }

    const state: FileState = { offset: currentOffset, watcher: null }
    this.states.set(filePath, state)

    try {
      const watcher = watch(filePath, () => {
        // Verify file grew before reading
        try {
          const size = statSync(filePath).size
          if (size <= state.offset) return
        } catch {
          return
        }

        this.readFrom(filePath, state.offset).then((newOffset) => {
          state.offset = newOffset
        })
      })

      state.watcher = watcher
    } catch {
      // File may not exist yet — silently skip
    }
  }

  watchDirectory(dirPath: string, onNewFile: (filePath: string) => void): void {
    try {
      watch(dirPath, { recursive: true }, (_event, filename) => {
        if (filename && filename.endsWith('.jsonl')) {
          const fullPath = `${dirPath}/${filename}`
          if (!this.states.has(fullPath)) {
            onNewFile(fullPath)
          }
        }
      })
    } catch {
      // Directory watch not supported on all platforms
    }
  }

  stop(): void {
    for (const state of this.states.values()) {
      state.watcher?.close()
    }
    this.states.clear()
  }
}
