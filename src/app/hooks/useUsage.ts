import { useState, useEffect } from 'react'
import { fetchUsage } from '../../infrastructure/UsageApi.js'
import type { UsageData } from '../../infrastructure/UsageApi.js'

const POLL_MS = 60_000

export function useUsage(): UsageData | null {
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    fetchUsage().then(setUsage)
    const id = setInterval(() => fetchUsage().then(setUsage), POLL_MS)
    return () => clearInterval(id)
  }, [])

  return usage
}
