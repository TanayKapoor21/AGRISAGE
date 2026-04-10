// ─── Core Types ────────────────────────────────────────────────

export type Language = 'en' | 'hi'
export type ThemeMode = 'light' | 'dark'
export type ApiHealth = 'active' | 'limited' | 'offline'

export interface ApiStatus {
  gemini: ApiHealth
  weather: ApiHealth
}

// ─── Crop Scanner ──────────────────────────────────────────────

export interface ScanResult {
  cropName: string
  scientificName: string
  confidence: number
  growthStage: string
  healthStatus: 'healthy' | 'mild_issue' | 'severe_issue'
  healthDetails: string
  soilSuitability: {
    ph: string
    nutrients: string[]
    type: string
  }
  recommendations: string[]
  imageUrl?: string
}

// ─── Voice Advisor ─────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  language: Language
}

// ─── Market Intelligence ───────────────────────────────────────

export interface MandiPrice {
  id: string
  crop: string
  variety: string
  market: string
  state: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  unit: string
  date: string
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  isEstimate?: boolean
}

export interface WeatherData {
  location: string
  tempC: number
  feelsLikeC: number
  humidity: number
  condition: string
  conditionIcon: string
  windKph: number
  windDir: string
  precipMm: number
  uv: number
  forecast: WeatherForecast[]
}

export interface WeatherForecast {
  date: string
  maxTempC: number
  minTempC: number
  condition: string
  conditionIcon: string
  chanceOfRain: number
}

// ─── Crop Advisory ─────────────────────────────────────────────

export type SoilType =
  | 'alluvial'
  | 'black_cotton'
  | 'red'
  | 'laterite'
  | 'desert'
  | 'mountain'
  | 'saline'

export interface CropRecommendation {
  id: string
  name: string
  season: 'kharif' | 'rabi' | 'zaid'
  suitability: number
  waterNeeds: 'low' | 'medium' | 'high'
  growthDuration: string
  expectedYield: string
  marketDemand: 'low' | 'medium' | 'high'
  tips: string[]
}

// ─── Sustainable Portal ────────────────────────────────────────

export interface CarbonCredit {
  id: string
  activity: string
  creditsEarned: number
  date: string
  verified: boolean
}

export interface WasteExchange {
  id: string
  type: string
  quantity: string
  location: string
  contact: string
  pricePerUnit: number
  available: boolean
  postedDate: string
}

export interface WasteFacility {
  id: string
  name: string
  address: string
  phone: string
  lat: number
  lng: number
  wasteTypes: string[]
  operational: boolean
}

// ─── Agricultural Library ──────────────────────────────────────

export interface CropGuide {
  id: string
  name: string
  category: string
  season: string
  image: string
  description: string
  steps: PlantingStep[]
  tips: string[]
  pests: string[]
  diseases: string[]
}

export interface PlantingStep {
  order: number
  title: string
  description: string
  duration: string
}

// ─── GenAffNet Hub ─────────────────────────────────────────────

export interface PredictionInput {
  soilType: SoilType
  temperature: number
  rainfall: number
  humidity: number
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

export interface PredictionResult {
  crop: string
  yieldPrediction: number
  confidence: number
  affinityScore: number
  riskLevel: 'low' | 'medium' | 'high'
  factors: { name: string; impact: number }[]
}

// ─── App Context ───────────────────────────────────────────────

export interface AppState {
  theme: ThemeMode
  language: Language
  apiStatus: ApiStatus
  sidebarCollapsed: boolean
  highContrast: boolean
  userName: string
}

export type AppAction =
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_API_STATUS'; payload: Partial<ApiStatus> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_HIGH_CONTRAST' }
  | { type: 'SET_USERNAME'; payload: string }
