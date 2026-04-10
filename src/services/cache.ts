// ─── Intelligent localStorage Cache with 1-Hour TTL ────────────

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const DEFAULT_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

export const CacheService = {
  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      }
      localStorage.setItem(`agrisage_${key}`, JSON.stringify(entry))
    } catch (error) {
      console.warn('[Cache] Failed to write:', key, error)
      // If storage is full, clear old entries
      this.cleanup()
    }
  },

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`agrisage_${key}`)
      if (!raw) return null

      const entry: CacheEntry<T> = JSON.parse(raw)
      const age = Date.now() - entry.timestamp

      if (age > entry.ttl) {
        localStorage.removeItem(`agrisage_${key}`)
        return null
      }

      return entry.data
    } catch {
      return null
    }
  },

  has(key: string): boolean {
    return this.get(key) !== null
  },

  remove(key: string): void {
    localStorage.removeItem(`agrisage_${key}`)
  },

  cleanup(): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('agrisage_')) {
        try {
          const raw = localStorage.getItem(key)
          if (raw) {
            const entry = JSON.parse(raw)
            if (Date.now() - entry.timestamp > entry.ttl) {
              keysToRemove.push(key)
            }
          }
        } catch {
          keysToRemove.push(key)
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
  },

  clearAll(): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('agrisage_')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
  },

  getStats(): { count: number; sizeBytes: number } {
    let count = 0
    let sizeBytes = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('agrisage_')) {
        count++
        const val = localStorage.getItem(key) || ''
        sizeBytes += key.length + val.length
      }
    }
    return { count, sizeBytes }
  },
}
