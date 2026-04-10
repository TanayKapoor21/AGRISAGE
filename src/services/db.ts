// ─── Local DB Service ───────────────────────────────────────────
// Persistent user data storage using localStorage
// Can be replaced with a real backend in production

import type { CarbonCredit, WasteExchange, WasteFacility } from '../types'

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

// ─── Waste Collection Facilities ─────────────────────────────────

const wasteFacilities: WasteFacility[] = [
  {
    id: 'wf_1',
    name: 'Punjab Biomass Power Ltd.',
    address: 'Village Channu, Tehsil Malout, Muktsar, Punjab',
    phone: '+91 1637 264500',
    lat: 30.20,
    lng: 74.50,
    wasteTypes: ['Paddy Stubble', 'Biomass', 'Crop Residue'],
    operational: true,
  },
  {
    id: 'wf_2',
    name: 'Sampurn Agri Ventures',
    address: 'Village Fazilka, Punjab - 152123',
    phone: '+91 98765 43210',
    lat: 30.40,
    lng: 74.03,
    wasteTypes: ['Stubble', 'Organic Waste', 'Bio-Fertilizer'],
    operational: true,
  },
  {
    id: 'wf_3',
    name: 'Eco-Wise Waste Management',
    address: 'Sector 34, Gurugram, Haryana',
    phone: '+91 124 4001234',
    lat: 28.44,
    lng: 77.03,
    wasteTypes: ['Organic Waste', 'Composting'],
    operational: true,
  },
  {
    id: 'wf_4',
    name: 'GreenCycle Agro Solutions',
    address: 'Industrial Area Phase-2, Karnal, Haryana',
    phone: '+91 184 2251678',
    lat: 29.69,
    lng: 76.98,
    wasteTypes: ['Crop Residue', 'Biomass', 'Vermicompost'],
    operational: true,
  },
  {
    id: 'wf_5',
    name: 'CropResidue Processing Unit',
    address: 'Focal Point, Industrial Area, Ludhiana, Punjab',
    phone: '+91 161 2774500',
    lat: 30.90,
    lng: 75.86,
    wasteTypes: ['Paddy Straw', 'Wheat Stubble', 'Cotton Stalks', 'Biomass Pellets'],
    operational: true,
  },
  {
    id: 'wf_6',
    name: 'AgriWaste Solutions Pvt. Ltd.',
    address: 'Sector 63, Noida, Uttar Pradesh - 201301',
    phone: '+91 120 4567890',
    lat: 28.63,
    lng: 77.37,
    wasteTypes: ['Organic Waste', 'Bio-CNG', 'Composting'],
    operational: true,
  },
  {
    id: 'wf_7',
    name: 'Haryana Agri Waste Hub',
    address: 'HSIIDC Industrial Estate, Rohtak, Haryana',
    phone: '+91 1262 256789',
    lat: 28.89,
    lng: 76.57,
    wasteTypes: ['Stubble', 'Sugarcane Bagasse', 'Crop Residue'],
    operational: true,
  },
  {
    id: 'wf_8',
    name: 'Kisaan Bio-Compost Center',
    address: 'GT Road, Near Grain Market, Panipat, Haryana',
    phone: '+91 180 2649012',
    lat: 29.39,
    lng: 76.97,
    wasteTypes: ['Paddy Straw', 'Organic Waste', 'Bio-Fertilizer', 'Vermicompost'],
    operational: true,
  },
  {
    id: 'wf_9',
    name: 'National Biomass Energy Corp.',
    address: 'Sector 21D, Faridabad, Haryana - 121012',
    phone: '+91 129 4123456',
    lat: 28.41,
    lng: 77.31,
    wasteTypes: ['Biomass', 'Crop Residue', 'Bio-Energy'],
    operational: true,
  },
  {
    id: 'wf_10',
    name: 'Patiala Green Energy Plant',
    address: 'Rajpura Road, Patiala, Punjab - 147001',
    phone: '+91 175 2301234',
    lat: 30.34,
    lng: 76.39,
    wasteTypes: ['Paddy Stubble', 'Biomass Briquettes', 'Bio-Coal'],
    operational: true,
  },
  {
    id: 'wf_11',
    name: 'Indo Agri Bio-Tech',
    address: 'Near Sugar Mill, Muzaffarnagar, UP - 251001',
    phone: '+91 131 2620567',
    lat: 29.47,
    lng: 77.70,
    wasteTypes: ['Sugarcane Bagasse', 'Press Mud', 'Bio-Fertilizer'],
    operational: true,
  },
]

export function getWasteFacilities(): WasteFacility[] {
  return wasteFacilities
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
