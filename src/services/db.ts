// ─── Local DB Service ───────────────────────────────────────────
// Persistent user data storage using localStorage
// Can be replaced with a real backend in production

import type { CarbonCredit, WasteExchange } from '../types'

const DB_PREFIX = 'agrisage_db_'

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

const defaultCredits: CarbonCredit[] = [
  { id: 'cc_1', activity: 'Organic Mulching - 2 acres', creditsEarned: 12.5, date: '2025-03-15', verified: true },
  { id: 'cc_2', activity: 'Zero-till Wheat Sowing', creditsEarned: 8.3, date: '2025-02-28', verified: true },
  { id: 'cc_3', activity: 'Solar Pump Installation', creditsEarned: 25.0, date: '2025-01-10', verified: true },
  { id: 'cc_4', activity: 'Stubble Incorporation', creditsEarned: 15.7, date: '2024-12-05', verified: false },
  { id: 'cc_5', activity: 'Drip Irrigation Setup - 3 acres', creditsEarned: 18.2, date: '2024-11-20', verified: true },
]

export function getCarbonCredits(): CarbonCredit[] {
  return load('carbon_credits', defaultCredits)
}

export function addCarbonCredit(credit: CarbonCredit): void {
  const credits = getCarbonCredits()
  credits.unshift(credit)
  save('carbon_credits', credits)
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
  { id: 'we_3', type: 'Coconut Shells', quantity: '20 quintals', location: 'Kannur, Kerala', contact: 'Joseph M.', pricePerUnit: 500, available: true, postedDate: '2025-03-15' },
  { id: 'we_4', type: 'Cotton Stalks', quantity: '30 quintals', location: 'Nagpur, Maharashtra', contact: 'Pravin D.', pricePerUnit: 180, available: false, postedDate: '2025-03-10' },
  { id: 'we_5', type: 'Groundnut Shells', quantity: '15 quintals', location: 'Junagadh, Gujarat', contact: 'Bhavesh S.', pricePerUnit: 120, available: true, postedDate: '2025-03-08' },
  { id: 'we_6', type: 'Banana Stem Fiber', quantity: '10 quintals', location: 'Jalgaon, Maharashtra', contact: 'Anil T.', pricePerUnit: 350, available: true, postedDate: '2025-03-05' },
]

export function getWasteExchanges(): WasteExchange[] {
  return load('waste_exchanges', defaultExchanges)
}

export function addWasteExchange(exchange: WasteExchange): void {
  const exchanges = getWasteExchanges()
  exchanges.unshift(exchange)
  save('waste_exchanges', exchanges)
}

// ─── Activity Log ───────────────────────────────────────────────

export interface ActivityEntry {
  id: string
  type: 'scan' | 'chat' | 'market' | 'advisory' | 'carbon' | 'library'
  title: string
  description: string
  timestamp: string
}

const defaultActivity: ActivityEntry[] = [
  { id: 'act_1', type: 'scan', title: 'Crop Scanned: Tomato', description: 'Healthy plant identified with 95% confidence', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'act_2', type: 'market', title: 'Market Check: Onion', description: 'Prices trending up +8.2% in Nashik', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'act_3', type: 'chat', title: 'AI Advisor: Pest Control', description: 'Discussed organic pest management for brinjal', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  { id: 'act_4', type: 'carbon', title: 'Carbon Credit Earned', description: '+12.5 credits for organic mulching', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act_5', type: 'advisory', title: 'Advisory: Rabi Season', description: 'Recommended wheat and mustard for your soil type', timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
]

export function getRecentActivity(): ActivityEntry[] {
  return load('activity_log', defaultActivity)
}

export function addActivity(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): void {
  const activities = getRecentActivity()
  activities.unshift({
    ...entry,
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
  })
  // Keep only last 50 entries
  save('activity_log', activities.slice(0, 50))
}
