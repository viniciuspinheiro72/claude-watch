import { readFile } from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'

export interface UsagePeriod {
  utilization: number  // 0–100
  resetsAt: Date
}

export interface UsageData {
  session: UsagePeriod  // five_hour window
  week: UsagePeriod     // seven_day window
}

interface Credentials {
  claudeAiOauth?: { accessToken?: string }
}

interface ApiResponse {
  five_hour: { utilization: number; resets_at: string } | null
  seven_day:  { utilization: number; resets_at: string } | null
}

async function readAccessToken(): Promise<string | null> {
  try {
    const path = join(homedir(), '.claude', '.credentials.json')
    const raw = await readFile(path, 'utf8')
    const creds = JSON.parse(raw) as Credentials
    return creds.claudeAiOauth?.accessToken ?? null
  } catch {
    return null
  }
}

export async function fetchUsage(): Promise<UsageData | null> {
  const token = await readAccessToken()
  if (!token) return null

  try {
    const res = await fetch('https://claude.ai/api/oauth/usage', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'claude-code/2.1.156',
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) return null

    const data = (await res.json()) as ApiResponse
    if (!data.five_hour || !data.seven_day) return null

    return {
      session: {
        utilization: data.five_hour.utilization,
        resetsAt: new Date(data.five_hour.resets_at),
      },
      week: {
        utilization: data.seven_day.utilization,
        resetsAt: new Date(data.seven_day.resets_at),
      },
    }
  } catch {
    return null
  }
}
