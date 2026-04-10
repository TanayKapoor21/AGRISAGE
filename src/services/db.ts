// ─── Local & Backend DB Service ─────────────────────────────────────
// Handles persistent storage with backend sync capability
import type { CarbonCredit, WasteExchange, WasteFacility } from '../types'

const DB_PREFIX = 'agrisage_db_'
const API_URL = 'http://localhost:5000'

function save<T>(collection: string, data: T): void {
  localStorage.setItem(`${DB_PREFIX}${collection}`, JSON.stringify(data))
}

function load<T>(collection: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${DB_PREFIX}${collection}`)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// ─── User Profile ───────────────────────────────────────────────

export interface UserProfile {
  name: string
  location: string
  farmSize: string
  preferredLanguage: string
  joinDate: string
  totalScans: number
  totalChats: number
}

const defaultProfile: UserProfile = {
  name: 'Farmer',
  location: 'Maharashtra',
  farmSize: '5 acres',
  preferredLanguage: 'en',
  joinDate: new Date().toISOString(),
  totalScans: 0,
  totalChats: 0,
}

export function getUserProfile(): UserProfile {
  return load('user_profile', defaultProfile)
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile()
  const updated = { ...current, ...profile }
  save('user_profile', updated)
  return updated
}

export function incrementStat(stat: 'totalScans' | 'totalChats'): void {
  const profile = getUserProfile()
  profile[stat] += 1
  save('user_profile', profile)
}

// ─── Carbon Credits ─────────────────────────────────────────────

export function getCarbonCredits(): CarbonCredit[] {
  return load('carbon_credits', [])
}

export function getTotalCredits(): number {
  return getCarbonCredits()
    .filter((c) => c.verified)
    .reduce((sum, c) => sum + c.creditsEarned, 0)
}

// ─── Waste Exchange ─────────────────────────────────────────────

const defaultExchanges: WasteExchange[] = [
  { id: 'we_1', type: 'Paddy Straw', quantity: '50 quintals', location: 'Karnal, Haryana', contact: 'Ramesh K.', pricePerUnit: 200, available: true, postedDate: '2025-03-20' },
  { id: 'we_2', type: 'Sugarcane Bagasse', quantity: '100 quintals', location: 'Kolhapur, Maharashtra', contact: 'Suresh P.', pricePerUnit: 150, available: true, postedDate: '2025-03-18' },
]

export function getWasteExchanges(): WasteExchange[] {
  return load('waste_exchanges', defaultExchanges)
}

// ... Facilites are static in the original file ...
const wasteFacilities: WasteFacility[] = [
  { id: 'wf_1', name: 'Punjab Biomass Power', address: 'Punjab', phone: 'N/A', lat: 30.2, lng: 74.5, wasteTypes: ['Paddy'], operational: true }
]

export function getWasteFacilities(): WasteFacility[] {
  return wasteFacilities
}

// ─── Activity Log (Synced) ───────────────────────────────────────

export interface ActivityEntry {
  id: string | number
  type: 'scan' | 'chat' | 'market' | 'advisory' | 'carbon' | 'library'
  title: string
  description: string
  timestamp: string
}

const defaultActivity: ActivityEntry[] = [
  { id: 'act_1', type: 'scan', title: 'Welcome to AgriSage', description: 'Begin your smart farming journey today.', timestamp: new Date().toISOString() },
]

export async function getRecentActivity(): Promise<ActivityEntry[]> {
  const token = localStorage.getItem('agrisage_token')
  if (token) {
    try {
      const res = await fetch(`${API_URL}/api/activity`, {
        headers: { 'Authorization': token }
      })
      if (res.ok) return await res.json()
    } catch (err) {
      console.error('Failed to fetch backend activity', err)
    }
  }
  return load('activity_log', defaultActivity)
}

export async function addActivity(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): Promise<void> {
  const token = localStorage.getItem('agrisage_token')
  
  // Local Save
  const activities = load<ActivityEntry[]>('activity_log', defaultActivity)
  const newEntry: ActivityEntry = {
    ...entry,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  }
  activities.unshift(newEntry)
  save('activity_log', activities.slice(0, 50))

  // Backend Save
  if (token) {
    try {
      await fetch(`${API_URL}/api/activity`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        },
        body: JSON.stringify(entry),
      })
    } catch (err) {
      console.error('Backend log failed - potentially offline or unauthorized')
    }
  }
}
