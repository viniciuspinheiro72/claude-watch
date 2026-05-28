import { readdir } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

const CLAUDE_DIR = join(homedir(), '.claude', 'projects')

export function getClaudeDir(): string {
  return process.env['CLAUDE_WATCH_LOG_DIR'] ?? CLAUDE_DIR
}

/**
 * ~/.claude/projects uses encoded folder names: /home/user/projects/foo → -home-user-projects-foo
 * Decode by replacing leading '-' then all remaining '-' with '/'
 */
export function decodeProjectPath(encoded: string): string {
  // Strip leading dash, then replace remaining dashes with slashes
  return '/' + encoded.replace(/^-/, '').replaceAll('-', '/')
}

export function encodeProjectPath(absPath: string): string {
  return absPath.replaceAll('/', '-')
}

export interface ProjectEntry {
  encoded: string
  decoded: string
  sessionFiles: string[]
}

export async function listProjects(filterPath?: string): Promise<ProjectEntry[]> {
  const baseDir = getClaudeDir()
  let entries: string[]
  try {
    entries = await readdir(baseDir)
  } catch {
    return []
  }

  const filterEncoded = filterPath ? encodeProjectPath(filterPath) : undefined

  const projects: ProjectEntry[] = []
  for (const encoded of entries) {
    if (filterEncoded && !encoded.startsWith(filterEncoded)) continue

    const projectDir = join(baseDir, encoded)
    let files: string[]
    try {
      const all = await readdir(projectDir)
      files = all.filter((f) => f.endsWith('.jsonl')).map((f) => join(projectDir, f))
    } catch {
      continue
    }

    if (files.length > 0) {
      projects.push({ encoded, decoded: decodeProjectPath(encoded), sessionFiles: files })
    }
  }

  return projects
}
