import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sprout, Droplets, MapPin, Search, Loader2,
  Calendar, TrendingUp, Gauge, Leaf, Star,
} from 'lucide-react'
import { getCropRecommendations } from '../services/gemini'
import { addActivity } from '../services/db'
import { useApp } from '../context/AppContext'
import type { CropRecommendation, SoilType } from '../types'

const availableLocations = [
  'Karnal, Haryana',
  'Ludhiana, Punjab',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Indore, MP',
  'Latur, Maharashtra',
  'Sirsa, Haryana',
  'Bathinda, Punjab'
]

const soilTypes: { value: SoilType; label: string; labelHi: string; color: string }[] = [
  { value: 'alluvial', label: 'Alluvial', labelHi: 'जलोढ़', color: 'from-amber-100 to-amber-200' },
  { value: 'black_cotton', label: 'Black Cotton', labelHi: 'काली मिट्टी', color: 'from-stone-700 to-stone-900' },
  { value: 'red', label: 'Red', labelHi: 'लाल मिट्टी', color: 'from-red-400 to-red-600' },
  { value: 'laterite', label: 'Laterite', labelHi: 'लैटेराइट', color: 'from-orange-300 to-orange-500' },
  { value: 'desert', label: 'Desert', labelHi: 'रेगिस्तानी', color: 'from-yellow-200 to-yellow-400' },
  { value: 'mountain', label: 'Mountain', labelHi: 'पर्वतीय', color: 'from-slate-400 to-slate-600' },
  { value: 'saline', label: 'Saline', labelHi: 'खारा', color: 'from-cyan-100 to-cyan-300' }
]

const waterIcons = {
  low: { color: 'text-blue-300' },
  medium: { color: 'text-blue-500' },
  high: { color: 'text-blue-700' }
}

const translations = {
  hi: {
    title: 'फसल सलाहकार',
    subtitle: 'मिट्टी और स्थान आधारित व्यक्तिगत फसल सिफारिशें',
    landInfo: '🌍 अपनी ज़मीन की जानकारी दें',
    selectSoil: 'मिट्टी का प्रकार चुनें',
    enterLocation: 'स्थान चुनें',
    getRecs: 'सिफारिशें प्राप्त करें',
    season: 'मौसम',
    water: 'पानी',
    duration: 'अवधि',
    yield: 'पैदावार',
    demand: 'मांग',
    tips: 'सुझाव',
    suitability: 'सटीकता',
    noResults: 'कोई सिफारिश नहीं मिली। कृपया पुनः प्रयास करें।',
    seasons: { kharif: 'खरीफ', rabi: 'रबी', zaid: 'जायद' },
    waterNeeds: { low: 'कम', medium: 'मध्यम', high: 'अधिक' },
    demandLevels: { low: 'कम', medium: 'मध्यम', high: 'अधिक' }
  },
  en: {
    title: 'Crop Advisory Engine',
    subtitle: 'Personalized crop recommendations based on soil type and geographic location',
    landInfo: '🌍 Tell us about your land',
    selectSoil: 'Select Soil Type',
    enterLocation: 'Select Location',
    getRecs: 'Get Recommendations',
    season: 'Season',
    water: 'Water',
    duration: 'Duration',
    yield: 'Yield',
    demand: 'Demand',
    tips: 'Tips',
    suitability: 'Suitability',
    noResults: 'No recommendations found. Try a different combination.',
    seasons: { kharif: 'Kharif', rabi: 'Rabi', zaid: 'Zaid' },
    waterNeeds: { low: 'Low', medium: 'Medium', high: 'High' },
    demandLevels: { low: 'Low', medium: 'Medium', high: 'High' }
  }
}

export default function CropAdvisory() {
  const { state } = useApp()
  const lang = (state.language === 'hi' ? 'hi' : 'en') as 'hi' | 'en'
  const t = translations[lang]

  const [soilType, setSoilType] = useState<SoilType>('alluvial')
  const [location, setLocation] = useState('Haryana')
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchRecommendations = useCallback(async () => {
    setLoading(true)
    setHasSearched(true)
    try {
      const recs = await getCropRecommendations(soilType, location)
      setRecommendations(recs)
      addActivity({
        type: 'advisory',
        title: `Advisory: ${soilType} soil in ${location}`,
        description: `Got ${recs.length} crop recommendations`,
      })
    } finally {
      setLoading(false)
    }
  }, [soilType, location])

  const seasonColors: Record<string, string> = {
    kharif: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rabi: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    zaid: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Sprout className="w-8 h-8 text-lime-500" />
          {t.title}
        </h1>
        <p className="page-subtitle">{t.subtitle}</p>
      </div>

      {/* Input Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h3 className="font-bold font-display text-earth-800 dark:text-earth-200 mb-4">
          {t.landInfo}
        </h3>

        {/* Soil Type Grid */}
        <p className="text-sm text-earth-500 mb-3">{t.selectSoil}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 mb-6">
          {soilTypes.map((soil) => (
            <motion.button
              key={soil.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoilType(soil.value)}
              className={`p-3 rounded-xl text-center border transition-all duration-200 ${
                soilType === soil.value
                  ? 'border-sage-500 bg-sage-500/10 dark:bg-sage-500/15 shadow-lg shadow-sage-500/10'
                  : 'border-earth-200/50 dark:border-earth-700/30 hover:border-sage-300 dark:hover:border-sage-700'
              }`}
            >
              <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${soil.color} mb-2`} />
              <p className="text-xs font-medium text-earth-700 dark:text-earth-300">
                {state.language === 'hi' ? soil.labelHi : soil.label}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Location + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field !pl-10 appearance-none cursor-pointer"
            >
              <option value="" disabled>{t.enterLocation}</option>
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchRecommendations}
            disabled={loading || !location.trim()}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {t.getRecs}
          </motion.button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card">
                <div className="space-y-3">
                  <div className="h-6 w-32 rounded-lg shimmer" />
                  <div className="h-4 w-full rounded shimmer" />
                  <div className="h-4 w-3/4 rounded shimmer" />
                  <div className="h-20 rounded-xl shimmer" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : recommendations.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold font-display text-earth-800 dark:text-white">{rec.name}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${seasonColors[rec.season] || ''}`}>
                      {t.seasons[rec.season as keyof typeof t.seasons] || rec.season}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-harvest-400 fill-harvest-400" />
                      <span className="text-sm font-bold text-earth-700 dark:text-earth-300">{(rec.suitability * 100).toFixed(0)}%</span>
                    </div>
                    <span className="text-[10px] text-earth-400 uppercase font-bold tracking-wider mt-1">{t.suitability}</span>
                  </div>
                </div>

                {/* Suitability Bar */}
                <div className="mb-4">
                  <div className="h-2 rounded-full bg-earth-200 dark:bg-earth-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.suitability * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                      className="h-full rounded-full gradient-primary"
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-earth-100/50 dark:bg-earth-800/30">
                    <Droplets className={`w-4 h-4 ${waterIcons[rec.waterNeeds as keyof typeof waterIcons]?.color || 'text-earth-400'}`} />
                    <div>
                      <p className="text-[10px] text-earth-400">{t.water}</p>
                      <p className="text-xs font-semibold text-earth-700 dark:text-earth-300">
                        {t.waterNeeds[rec.waterNeeds as keyof typeof t.waterNeeds] || rec.waterNeeds}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-earth-100/50 dark:bg-earth-800/30">
                    <Calendar className="w-4 h-4 text-earth-400" />
                    <div>
                      <p className="text-[10px] text-earth-400">{t.duration}</p>
                      <p className="text-xs font-semibold text-earth-700 dark:text-earth-300">{rec.growthDuration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-earth-100/50 dark:bg-earth-800/30">
                    <Gauge className="w-4 h-4 text-earth-400" />
                    <div>
                      <p className="text-[10px] text-earth-400">{t.yield}</p>
                      <p className="text-xs font-semibold text-earth-700 dark:text-earth-300">{rec.expectedYield}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-earth-100/50 dark:bg-earth-800/30">
                    <TrendingUp className="w-4 h-4 text-earth-400" />
                    <div>
                      <p className="text-[10px] text-earth-400">{t.demand}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        rec.marketDemand === 'high' ? 'bg-emerald-500/10 text-emerald-600' :
                        rec.marketDemand === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-slate-500/10 text-slate-600'
                      }`}>
                        {t.demandLevels[rec.marketDemand as keyof typeof t.demandLevels] || rec.marketDemand}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                {rec.tips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-earth-400 mb-1.5 flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> {t.tips}
                    </p>
                    <ul className="space-y-1">
                      {rec.tips.map((tip, j) => (
                        <li key={j} className="text-xs text-earth-600 dark:text-earth-400 flex items-start gap-1.5">
                          <span className="text-sage-500 mt-0.5">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : hasSearched ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card text-center py-12">
            <Sprout className="w-12 h-12 mx-auto text-earth-300 dark:text-earth-600 mb-3" />
            <p className="text-earth-400">{t.noResults}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

