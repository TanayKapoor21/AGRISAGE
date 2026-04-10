import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ScanLine, Mic, BarChart3, Sprout, Recycle, BookOpen, Brain,
  Cloud, Droplets, Wind, Sun, TrendingUp, Activity, Leaf, Zap,
  ArrowRight, Thermometer,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getWeather } from '../services/weather'
import { getRecentActivity, getUserProfile } from '../services/db'
import type { WeatherData } from '../types'
import type { ActivityEntry } from '../services/db'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const quickActions = [
  { to: '/scanner', icon: ScanLine, label: 'Scan Crop', desc: 'AI Vision Analysis', color: 'from-emerald-500 to-teal-600' },
  { to: '/advisor', icon: Mic, label: 'AI Advisor', desc: 'Voice Assistant', color: 'from-violet-500 to-purple-600' },
  { to: '/market', icon: BarChart3, label: 'Market Intel', desc: 'Mandi Prices', color: 'from-amber-500 to-orange-600' },
  { to: '/advisory', icon: Sprout, label: 'Crop Advisory', desc: 'Smart Planting', color: 'from-lime-500 to-green-600' },
  { to: '/sustainable', icon: Recycle, label: 'Sustainability', desc: 'Carbon Credits', color: 'from-cyan-500 to-blue-600' },
  { to: '/library', icon: BookOpen, label: 'Agri Library', desc: 'Crop Guides', color: 'from-rose-500 to-pink-600' },
  { to: '/genaffnet', icon: Brain, label: 'GenAffNet', desc: 'Deep Learning', color: 'from-indigo-500 to-blue-700' },
]

const activityIcons: Record<string, typeof ScanLine> = {
  scan: ScanLine,
  chat: Mic,
  market: BarChart3,
  advisory: Sprout,
  carbon: Recycle,
  library: BookOpen,
}

export default function Dashboard() {
  const { state } = useApp()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const profile = getUserProfile()

  useEffect(() => {
    getWeather(profile.location).then(setWeather)
    setActivity(getRecentActivity().slice(0, 5))
  }, [])

  const greeting = (() => {
    const hour = new Date().getHours()
    if (state.language === 'hi') {
      if (hour < 12) return 'सुप्रभात'
      if (hour < 17) return 'नमस्ते'
      return 'शुभ संध्या'
    }
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  })()

  const stats = [
    { icon: ScanLine, value: profile.totalScans, label: state.language === 'hi' ? 'कुल स्कैन' : 'Total Scans', color: 'text-emerald-500' },
    { icon: Activity, value: profile.totalChats, label: state.language === 'hi' ? 'AI चैट' : 'AI Chats', color: 'text-violet-500' },
    { icon: TrendingUp, value: '12', label: state.language === 'hi' ? 'बाज़ार अलर्ट' : 'Market Alerts', color: 'text-amber-500' },
    { icon: Leaf, value: '79.7', label: state.language === 'hi' ? 'कार्बन क्रेडिट' : 'Carbon Credits', color: 'text-cyan-500' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* ─── Hero Section ─────────────────────────────────── */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-harvest-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sage-400 text-sm font-medium tracking-wide uppercase mb-2"
          >
            {new Date().toLocaleDateString(state.language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold font-display text-white mb-2"
          >
            {greeting}, <span className="text-gradient-hero">{state.userName}</span> 🌾
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-earth-400 max-w-lg"
          >
            {state.language === 'hi'
              ? 'आपका AI-संचालित कृषि ऑपरेटिंग सिस्टम आज आपकी मदद के लिए तैयार है।'
              : 'Your AI-powered agricultural operating system is ready to assist you today.'}
          </motion.p>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                <p className="text-2xl font-bold font-display text-white">{s.value}</p>
                <p className="text-xs text-earth-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Actions Grid ───────────────────────────── */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold font-display text-earth-800 dark:text-earth-200 mb-4">
          {state.language === 'hi' ? '⚡ त्वरित कार्य' : '⚡ Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card group text-center cursor-pointer !p-4"
              >
                <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-earth-800 dark:text-earth-200">{action.label}</p>
                <p className="text-[11px] text-earth-400 mt-0.5">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ─── Weather + Activity Row ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <motion.div variants={item} className="lg:col-span-1 glass-card">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5 text-sage-500" />
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">
              {state.language === 'hi' ? 'मौसम' : 'Weather'}
            </h3>
          </div>
          {weather ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold font-display text-earth-800 dark:text-white">
                    {weather.tempC}°C
                  </p>
                  <p className="text-sm text-earth-500">{weather.condition}</p>
                  <p className="text-xs text-earth-400">{weather.location}</p>
                </div>
                <div className="text-6xl">
                  {weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear') ? '☀️' :
                   weather.condition.toLowerCase().includes('cloud') ? '⛅' :
                   weather.condition.toLowerCase().includes('rain') ? '🌧️' : '🌤️'}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                  <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                  <p className="text-xs text-earth-500">Humidity</p>
                  <p className="text-sm font-semibold text-earth-700 dark:text-earth-300">{weather.humidity}%</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                  <Wind className="w-4 h-4 mx-auto text-teal-400 mb-1" />
                  <p className="text-xs text-earth-500">Wind</p>
                  <p className="text-sm font-semibold text-earth-700 dark:text-earth-300">{weather.windKph} km/h</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                  <Thermometer className="w-4 h-4 mx-auto text-orange-400 mb-1" />
                  <p className="text-xs text-earth-500">UV</p>
                  <p className="text-sm font-semibold text-earth-700 dark:text-earth-300">{weather.uv}</p>
                </div>
              </div>
              {/* Forecast mini row */}
              <div className="mt-4 pt-4 border-t border-earth-200/30 dark:border-earth-700/30">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {weather.forecast.slice(1, 6).map((day) => (
                    <div key={day.date} className="flex-shrink-0 text-center p-2 rounded-lg bg-earth-100/30 dark:bg-earth-800/20 min-w-[56px]">
                      <p className="text-[10px] text-earth-400">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                      <p className="text-xs font-semibold text-earth-600 dark:text-earth-300 mt-1">{day.maxTempC}°</p>
                      <p className="text-[10px] text-earth-400">{day.minTempC}°</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-6 rounded-lg shimmer" />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-harvest-500" />
              <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">
                {state.language === 'hi' ? 'हालिया गतिविधि' : 'Recent Activity'}
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            {activity.map((act, i) => {
              const Icon = activityIcons[act.type] || Activity
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-earth-100/50 dark:hover:bg-earth-800/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-sage-500/10 dark:bg-sage-500/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-earth-800 dark:text-earth-200 truncate">{act.title}</p>
                    <p className="text-xs text-earth-400 mt-0.5">{act.description}</p>
                  </div>
                  <span className="text-[10px] text-earth-400 whitespace-nowrap flex-shrink-0">
                    {getTimeAgo(act.timestamp)}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ─── AI Tips ──────────────────────────────────────── */}
      <motion.div variants={item} className="glass-card">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-5 h-5 text-harvest-500" />
          <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">
            {state.language === 'hi' ? '💡 आज की कृषि युक्तियाँ' : '💡 Today\'s Farming Tips'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: state.language === 'hi' ? 'मिट्टी की नमी' : 'Soil Moisture', tip: state.language === 'hi' ? 'सुबह सिंचाई करें - कम वाष्पीकरण, बेहतर अवशोषण।' : 'Water early morning — less evaporation, better root absorption.', icon: Droplets, color: 'text-blue-400' },
            { title: state.language === 'hi' ? 'कीट प्रबंधन' : 'Pest Watch', tip: state.language === 'hi' ? 'नीम तेल स्प्रे (5ml/L) कई कीटों को नियंत्रित करता है।' : 'Neem oil spray (5ml/L) controls aphids, whiteflies effectively.', icon: Activity, color: 'text-green-400' },
            { title: state.language === 'hi' ? 'बाज़ार रणनीति' : 'Market Strategy', tip: state.language === 'hi' ? 'प्याज की कीमतें बढ़ रही हैं — बेचने का अच्छा समय।' : 'Onion prices trending up 8.2% — good time for selling.', icon: TrendingUp, color: 'text-amber-400' },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-earth-100/50 dark:bg-earth-800/20 border border-earth-200/30 dark:border-earth-700/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <t.icon className={`w-4 h-4 ${t.color}`} />
                <p className="text-sm font-semibold text-earth-700 dark:text-earth-300">{t.title}</p>
              </div>
              <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed">{t.tip}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
