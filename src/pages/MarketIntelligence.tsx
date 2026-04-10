import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, TrendingDown, Minus, Search,
  Cloud, Droplets, Wind, MapPin, RefreshCw, AlertTriangle,
  IndianRupee, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { getMandiPrices, isGeminiAvailable } from '../services/gemini'
import { getWeather } from '../services/weather'
import { useApp } from '../context/AppContext'
import type { MandiPrice, WeatherData } from '../types'

const STATES = ['Maharashtra', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Karnataka', 'Haryana', 'Tamil Nadu', 'West Bengal']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function MarketIntelligence() {
  const { state } = useApp()
  const [prices, setPrices] = useState<MandiPrice[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [selectedState, setSelectedState] = useState('Haryana')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isEstimate, setIsEstimate] = useState(false)

  const fetchData = async (stateVal: string) => {
    setLoading(true)
    try {
      const [priceData, weatherData] = await Promise.all([
        getMandiPrices(stateVal),
        getWeather(stateVal),
      ])
      setPrices(priceData)
      setWeather(weatherData)
      setIsEstimate(priceData.some((p) => p.isEstimate) || !isGeminiAvailable())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(selectedState)
  }, [selectedState])

  const filteredPrices = prices.filter(
    (p) =>
      p.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.market.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const avgPrice = prices.length ? Math.round(prices.reduce((s, p) => s + p.modalPrice, 0) / prices.length) : 0
  const trendingUp = prices.filter((p) => p.trend === 'up').length
  const totalCrops = prices.length

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-earth-400" />
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="page-title flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-amber-500" />
          {state.language === 'hi' ? 'बाज़ार बुद्धिमत्ता' : 'Market Intelligence'}
        </h1>
        <p className="page-subtitle">
          {state.language === 'hi'
            ? 'रीयल-टाइम मंडी भाव और मौसम पूर्वानुमान'
            : 'Real-time Mandi prices, trend analysis, and precision weather forecasting'}
        </p>
      </motion.div>


      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="stat-card-value">₹{avgPrice.toLocaleString()}</p>
              <p className="stat-card-label">{state.language === 'hi' ? 'औसत मोडल मूल्य' : 'Avg Modal Price'}</p>
            </div>
          </div>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="stat-card-value">{trendingUp}/{totalCrops}</p>
              <p className="stat-card-label">{state.language === 'hi' ? 'ऊपर की ओर रुझान' : 'Trending Upward'}</p>
            </div>
          </div>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="stat-card-value">{weather?.tempC ?? '--'}°C</p>
              <p className="stat-card-label">{weather?.location || selectedState}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={state.language === 'hi' ? 'फसल, बाज़ार खोजें...' : 'Search crops, markets...'}
            className="input-field !pl-10"
          />
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="input-field !w-auto min-w-[180px]"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchData(selectedState)}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {state.language === 'hi' ? 'रीफ़्रेश' : 'Refresh'}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Table */}
        <motion.div variants={item} className="lg:col-span-2 glass-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-earth-200/30 dark:border-earth-700/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">Crop</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">Market</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">Min</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">Max</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">Modal</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-earth-200/10 dark:border-earth-800/30">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 rounded shimmer" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-earth-400">
                      {state.language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No results found'}
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((price, i) => (
                    <motion.tr
                      key={price.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-earth-200/10 dark:border-earth-800/30 hover:bg-earth-100/50 dark:hover:bg-earth-800/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-sm font-semibold text-earth-800 dark:text-earth-200">{price.crop}</p>
                          <p className="text-xs text-earth-400">{price.variety}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-earth-400" />
                          <span className="text-sm text-earth-600 dark:text-earth-400">{price.market}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-sm text-earth-500">₹{price.minPrice.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-sm text-earth-500">₹{price.maxPrice.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-bold text-earth-800 dark:text-earth-200">₹{price.modalPrice.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <TrendIcon trend={price.trend} />
                          <span className={`text-xs font-semibold ${
                            price.trend === 'up' ? 'text-emerald-500' : price.trend === 'down' ? 'text-red-500' : 'text-earth-400'
                          }`}>
                            {price.trendPercent > 0 ? '+' : ''}{price.trendPercent}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Weather Sidebar */}
        <motion.div variants={item} className="space-y-4">
          {/* Weather Card */}
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">
                {state.language === 'hi' ? 'मौसम पूर्वानुमान' : 'Weather Forecast'}
              </h3>
            </div>
            {weather ? (
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                  <p className="text-5xl font-bold font-display text-earth-800 dark:text-white">{weather.tempC}°</p>
                  <p className="text-sm text-earth-500 mt-1">{weather.condition}</p>
                  <p className="text-xs text-earth-400">{weather.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-earth-100/50 dark:bg-earth-800/30">
                    <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                    <p className="text-xs text-earth-400">Humidity</p>
                    <p className="text-sm font-bold text-earth-700 dark:text-earth-300">{weather.humidity}%</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-earth-100/50 dark:bg-earth-800/30">
                    <Wind className="w-4 h-4 mx-auto text-teal-400 mb-1" />
                    <p className="text-xs text-earth-400">Wind</p>
                    <p className="text-sm font-bold text-earth-700 dark:text-earth-300">{weather.windKph} km/h</p>
                  </div>
                </div>
                {/* 7-day forecast */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-earth-400 uppercase">7-Day Forecast</p>
                  {weather.forecast.map((day) => (
                    <div key={day.date} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-earth-100/30 dark:hover:bg-earth-800/20 transition-colors">
                      <span className="text-xs text-earth-500 w-12">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] text-earth-400">{day.chanceOfRain}%</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-earth-700 dark:text-earth-300">
                        {day.maxTempC}° / {day.minTempC}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-6 rounded-lg shimmer" />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
