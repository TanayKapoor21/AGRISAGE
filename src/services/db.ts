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
  location: 'Haryana',
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
]

export function getWasteExchanges(): WasteExchange[] {
  return load('waste_exchanges', defaultExchanges)
}

export function addWasteExchange(exchange: WasteExchange): void {
  const exchanges = getWasteExchanges()
  exchanges.unshift(exchange)
  save('waste_exchanges', exchanges)
}

// ─── Waste Collection Facilities ─────────────────────────────────

const wasteFacilities: WasteFacility[] = [
  { id: 'wf_1', name: 'Punjab Biomass Power', address: 'Patiala, Punjab', phone: '+91 98765 00001', lat: 30.3398, lng: 76.3869, wasteTypes: ['Paddy Straw', 'Stubble'], operational: true },
  { id: 'wf_2', name: 'Sampurn Agri Ventures', address: 'Fazilka, Punjab', phone: '+91 98765 00002', lat: 30.4033, lng: 74.0305, wasteTypes: ['Stubble', 'Corn Husk'], operational: true },
  { id: 'wf_3', name: 'Eco-Wise Waste Management', address: 'Gurugram, Haryana', phone: '+91 98765 00003', lat: 28.4470, lng: 77.0374, wasteTypes: ['Organic', 'Mixed Agri'], operational: true },
  { id: 'wf_4', name: 'Maharashtra Biomass Hub', address: 'Nagpur, Maharashtra', phone: '+91 98765 00004', lat: 21.1458, lng: 79.0882, wasteTypes: ['Cotton Stalks', 'Soybean Residue'], operational: true },
  { id: 'wf_5', name: 'UP Bio-Energy Plant', address: 'Bareilly, Uttar Pradesh', phone: '+91 98765 00005', lat: 28.3670, lng: 79.4304, wasteTypes: ['Sugarcane Bagasse', 'Paddy'], operational: true },
  { id: 'wf_6', name: 'Haryana Stubble Collection', address: 'Karnal, Haryana', phone: '+91 98765 00006', lat: 29.6857, lng: 76.9907, wasteTypes: ['Paddy Straw'], operational: true },
  { id: 'wf_7', name: 'Western Agri Recycle', address: 'Ahmedabad, Gujarat', phone: '+91 98765 00007', lat: 23.0225, lng: 72.5714, wasteTypes: ['Cotton', 'Groundnut Shells'], operational: true },
  { id: 'wf_8', name: 'Central India Green Fuel', address: 'Indore, MP', phone: '+91 98765 00008', lat: 22.7196, lng: 75.8577, wasteTypes: ['Soybean', 'Wheat Straw'], operational: true },
  { id: 'wf_9', name: 'South India Biomass', address: 'Tumakuru, Karnataka', phone: '+91 98765 00009', lat: 13.3392, lng: 77.1140, wasteTypes: ['Coconut Shells', 'Rice Husk'], operational: true },
  { id: 'wf_10', name: 'Kisan Bio-Solutions', address: 'Ludhiana, Punjab', phone: '+91 98765 00010', lat: 30.9010, lng: 75.8573, wasteTypes: ['Stubble', 'Wheat Residue'], operational: true },
  { id: 'wf_11', name: 'Pune Composting Unit', address: 'Pune, Maharashtra', phone: '+91 98765 00011', lat: 18.5204, lng: 73.8567, wasteTypes: ['Fruits/Vegetable Waste', 'Organic'], operational: true },
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
