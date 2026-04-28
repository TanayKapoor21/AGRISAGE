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

const translations = {
  hi: {
    title: 'बाज़ार बुद्धिमत्ता',
    subtitle: 'रीयल-टाइम मंडी भाव और मौसम पूर्वानुमान',
    avgPrice: 'औसत मोडल मूल्य',
    trendingUp: 'ऊपर की ओर रुझान',
    search: 'फसल या मंडी खोजें...',
    refresh: 'अपडेट करें',
    crop: 'फसल',
    market: 'मंडी',
    min: 'न्यूनतम',
    max: 'अधिकतम',
    modal: 'मोडल',
    trend: 'रुझान',
    weatherForecast: 'मौसम पूर्वानुमान',
    humidity: 'आर्द्रता',
    wind: 'हवा',
    forecast7Day: '7-दिवसीय पूर्वानुमान',
    noResults: 'कोई परिणाम नहीं मिला',
  },
  en: {
    title: 'Market Intelligence',
    subtitle: 'Real-time Mandi prices, trend analysis, and precision weather forecasting',
    avgPrice: 'Avg Modal Price',
    trendingUp: 'Trending Upward',
    search: 'Search crops or markets...',
    refresh: 'Refresh',
    crop: 'Crop',
    market: 'Market',
    min: 'Min',
    max: 'Max',
    modal: 'Modal',
    trend: 'Trend',
    weatherForecast: 'Weather Forecast',
    humidity: 'Humidity',
    wind: 'Wind',
    forecast7Day: '7-Day Forecast',
    noResults: 'No results matched your search',
  },
  pa: {
    title: 'ਬਾਜ਼ਾਰ ਦੀ ਜਾਣਕਾਰੀ',
    subtitle: 'ਰੀਅਲ-ਟਾਈਮ ਮੰਡੀ ਭਾਅ ਅਤੇ ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ',
    avgPrice: 'ਔਸਤ ਮਾਡਲ ਮੁੱਲ',
    trendingUp: 'ਉੱਪਰ ਵੱਲ ਰੁਝਾਨ',
    search: 'ਫਸਲ ਜਾਂ ਮੰਡੀ ਖੋਜੋ...',
    refresh: 'ਅਪਡੇਟ ਕਰੋ',
    crop: 'ਫਸਲ',
    market: 'ਮੰਡੀ',
    min: 'ਘੱਟੋ-ਘੱਟ',
    max: 'ਵੱਧ ਤੋਂ ਵੱਧ',
    modal: 'ਮਾਡਲ',
    trend: 'ਰੁਝਾਨ',
    weatherForecast: 'ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ',
    humidity: 'ਨਮੀ',
    wind: 'ਹਵਾ',
    forecast7Day: '7-ਦਿਨਾਂ ਦੀ ਭਵਿੱਖਬਾਣੀ',
    noResults: 'ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ'
  },
  mr: {
    title: 'बाजार बुद्धिमत्ता',
    subtitle: 'रिअल-टाइम मंडी दर आणि हवामान अंदाज',
    avgPrice: 'सरासरी मोडल किंमत',
    trendingUp: 'वरचा कल',
    search: 'पीक किंवा बाजार शोधा...',
    refresh: 'अपडेट करा',
    crop: 'पीक',
    market: 'बाजार',
    min: 'किमान',
    max: 'कमाल',
    modal: 'मोडल',
    trend: 'कल',
    weatherForecast: 'हवामान अंदाज',
    humidity: 'आद्रता',
    wind: 'वारा',
    forecast7Day: '७-दिवसांचा अंदाज',
    noResults: 'तुमच्या शोधाशी जुळणारे निकाल आढळले नाहीत'
  },
  ta: {
    title: 'சந்தை நுண்ணறிவு',
    subtitle: 'நிகழ்நேர மண்டி விலைகள் மற்றும் வானிலை முன்னறிவிப்பு',
    avgPrice: 'சராசரி மாதிரி விலை',
    trendingUp: 'மேல்நோக்கிய போக்கு',
    search: 'பயிர் அல்லது சந்தையைத் தேடுங்கள்...',
    refresh: 'புதுப்பிக்கவும்',
    crop: 'பயிர்',
    market: 'சந்தை',
    min: 'குறைந்தபட்சம்',
    max: 'அதிகபட்சம்',
    modal: 'மாதிரி',
    trend: 'போக்கு',
    weatherForecast: 'வானிலை முன்னறிவிப்பு',
    humidity: 'ஈரப்பதம்',
    wind: 'காற்று',
    forecast7Day: '7-நாள் முன்னறிவிப்பு',
    noResults: 'உங்கள் தேடலுடன் பொருந்தக்கூடிய முடிவுகள் எதுவுமில்லை'
  },
  te: {
    title: 'మార్కెట్ సమాచారం',
    subtitle: 'నిజ-సమయ మండి ధరలు మరియు వాతావరణ సూచన',
    avgPrice: 'సగటు మోడల్ ధర',
    trendingUp: 'పెరుగుతున్న ధోరణి',
    search: 'పంట లేదా మార్కెట్ కోసం వెతకండి...',
    refresh: 'రిఫ్రెష్ చేయండి',
    crop: 'పంట',
    market: 'మార్కెట్',
    min: 'కనిష్ట',
    max: 'గరిష్ట',
    modal: 'మోడల్',
    trend: 'ధోరణి',
    weatherForecast: 'వాతావరణ సూచన',
    humidity: 'తేమ',
    wind: 'గాలి',
    forecast7Day: '7-రోజుల సూచన',
    noResults: 'మీ శోధనకు సరిపోలే ఫలితాలు లేవు'
  },
  kn: {
    title: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ',
    subtitle: 'ನೈಜ-ಸಮಯದ ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    avgPrice: 'ಸರಾಸರಿ ಮಾದರಿ ಬೆಲೆ',
    trendingUp: 'ಹೆಚ್ಚುತ್ತಿರುವ ಪ್ರವೃತ್ತಿ',
    search: 'ಬೆಳೆ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಹುಡುಕಿ...',
    refresh: 'ರಿಫ್ರೆಶ್ ಮಾಡಿ',
    crop: 'ಬೆಳೆ',
    market: 'ಮಾರುಕಟ್ಟೆ',
    min: 'ಕನಿಷ್ಠ',
    max: 'ಗರಿಷ್ಠ',
    modal: 'ಮಾದರಿ',
    trend: 'ಪ್ರವೃತ್ತಿ',
    weatherForecast: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    humidity: 'ತೇವಾಂಶ',
    wind: 'ಗಾಳಿ',
    forecast7Day: '7-ದಿನದ ಮುನ್ಸೂಚನೆ',
    noResults: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ'
  }
}

export default function MarketIntelligence() {
  const { state } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

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
  const trendingUpCount = prices.filter((p) => p.trend === 'up').length
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
          {t.title}
        </h1>
        <p className="page-subtitle">{t.subtitle}</p>
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
              <p className="stat-card-label">{t.avgPrice}</p>
            </div>
          </div>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="stat-card-value">{trendingUpCount}/{totalCrops}</p>
              <p className="stat-card-label">{t.trendingUp}</p>
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
            placeholder={t.search}
            className="input-field !pl-10"
          />
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="input-field !w-auto min-w-[180px] cursor-pointer"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchData(selectedState)}
          disabled={loading}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t.refresh}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Table */}
        <motion.div variants={item} className="lg:col-span-2 glass-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-earth-200/30 dark:border-earth-700/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">{t.crop}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">{t.market}</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">{t.min}</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">{t.max}</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">{t.modal}</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-earth-400 uppercase tracking-wider">{t.trend}</th>
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
                      {t.noResults}
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
                {t.weatherForecast}
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
                    <p className="text-xs text-earth-400">{t.humidity}</p>
                    <p className="text-sm font-bold text-earth-700 dark:text-earth-300">{weather.humidity}%</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-earth-100/50 dark:bg-earth-800/30">
                    <Wind className="w-4 h-4 mx-auto text-teal-400 mb-1" />
                    <p className="text-xs text-earth-400">{t.wind}</p>
                    <p className="text-sm font-bold text-earth-700 dark:text-earth-300">{weather.windKph} <span className="text-[10px]">km/h</span></p>
                  </div>
                </div>
                {/* 7-day forecast */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-earth-400 uppercase">{t.forecast7Day}</p>
                  {weather.forecast.map((day) => (
                    <div key={day.date} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-earth-100/30 dark:hover:bg-earth-800/20 transition-colors">
                      <span className="text-xs text-earth-500 w-12 text-left">
                        {new Date(day.date).toLocaleDateString(state.language === 'hi' ? 'hi' : 'en', { weekday: 'short' })}
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
