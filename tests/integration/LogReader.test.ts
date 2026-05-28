import { describe, it, expect, afterEach } from 'vitest'
import { writeFileSync, unlinkSync, mkdirSync, readdirSync as fsReaddirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { LogReader } from '../../src/infrastructure/LogReader.js'

function makeLine(model = 'claude-sonnet-4-6', inputTokens = 100): string {
  return JSON.stringify({
    type: 'assistant',
    timestamp: new Date().toISOString(),
    sessionId: 'test-session',
    message: {
      model,
      usage: {
        input_tokens: inputTokens,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
      },
    },
  })
}

const tmpDir = join(tmpdir(), 'claude-watch-test')
mkdirSync(tmpDir, { recursive: true })

afterEach(() => {
  try {
    const files = readdirSync(tmpDir)
    files.forEach((f) => unlinkSync(join(tmpDir, f)))
  } catch {
    // ignore
  }
})

function readdirSync(dir: string): string[] {
  try {
    return fsReaddirSync(dir)
  } catch {
    return []
  }
}

describe('LogReader.readAll', () => {
  it('parses existing lines from a file', async () => {
    const file = join(tmpDir, 'test1.jsonl')
    writeFileSync(file, makeLine() + '\n' + makeLine('claude-sonnet-4-6', 200) + '\n')

    const entries: unknown[] = []
    const reader = new LogReader((e) => entries.push(e))
    await reader.readAll([file])
    reader.stop()

    expect(entries).toHaveLength(2)
  })

  it('skips malformed lines', async () => {
    const file = join(tmpDir, 'test2.jsonl')
    writeFileSync(file, 'not json\n' + makeLine() + '\n{bad\n')

    const entries: unknown[] = []
    const reader = new LogReader((e) => entries.push(e))
    await reader.readAll([file])
    reader.stop()

    expect(entries).toHaveLength(1)
  })

  it('handles empty file', async () => {
    const file = join(tmpDir, 'test3.jsonl')
    writeFileSync(file, '')

    const entries: unknown[] = []
    const reader = new LogReader((e) => entries.push(e))
    await reader.readAll([file])
    reader.stop()

    expect(entries).toHaveLength(0)
  })

  it('handles multiple files', async () => {
    const f1 = join(tmpDir, 'test4a.jsonl')
    const f2 = join(tmpDir, 'test4b.jsonl')
    writeFileSync(f1, makeLine() + '\n')
    writeFileSync(f2, makeLine() + '\n' + makeLine() + '\n')

    const entries: unknown[] = []
    const reader = new LogReader((e) => entries.push(e))
    await reader.readAll([f1, f2])
    reader.stop()

    expect(entries).toHaveLength(3)
  })
})
