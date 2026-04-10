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
import MarketForecastChart from '../components/MarketForecastChart'
import YieldBarChart from '../components/YieldBarChart'
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
  { to: '/scanner', icon: ScanLine, label: 'SCAN CROP', color: 'border-neo-green', iconColor: 'text-green-400' },
  { to: '/advisor', icon: Mic, label: 'AI ADVISOR', color: 'border-neo-indigo', iconColor: 'text-indigo-400' },
  { to: '/market', icon: BarChart3, label: 'MARKET INTEL', color: 'border-neo-amber', iconColor: 'text-amber-400' },
  { to: '/advisory', icon: Sprout, label: 'CROP ADVISORY', color: 'border-neo-green', iconColor: 'text-green-400' },
  { to: '/sustainable', icon: Recycle, label: 'SUSTAINABILITY', color: 'border-neo-cyan', iconColor: 'text-cyan-400' },
  { to: '/library', icon: BookOpen, label: 'AGRILIBRARY', color: 'border-neo-green', iconColor: 'text-green-400' },
  { to: '/genaffnet', icon: Brain, label: 'GENAFFNET', color: 'border-neo-violet', iconColor: 'text-violet-400' },
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
    getRecentActivity().then(data => setActivity(data.slice(0, 5)))
  }, [profile.location])

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
    { icon: ScanLine, value: profile.totalScans, label: 'TOTAL SCANS', glow: 'border-neo-green', iconColor: 'text-green-400' },
    { icon: Activity, value: profile.totalChats, label: 'AI CHATS', glow: 'border-neo-purple', iconColor: 'text-purple-400' },
    { icon: TrendingUp, value: '12', label: 'MARKET ALERTS', glow: 'border-neo-amber', iconColor: 'text-amber-400' },
    { icon: Leaf, value: '79.7', label: 'CARBON CREDITS', glow: 'border-neo-cyan', iconColor: 'text-cyan-400' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 pb-20">
      {/* ─── Hero Section ─────────────────────────────────── */}
      <motion.div variants={item} className="glow-card border-neo-green">
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 -z-10" />
        
        <div className="space-y-2 mb-10">
          <p className="text-[var(--neo-green)] text-xs font-black tracking-widest uppercase opacity-80">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white">
            {greeting}, <span className="text-[var(--neo-green)] glow-text-green">{state.userName || 'Guest Farmer'}</span> 🧑‍🌾
          </h1>
          <p className="text-earth-400 max-w-lg text-sm">
            Your AI-powered agricultural operating system is ready to assist you today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -5 }}
              className={`stat-glow ${s.glow}`}
            >
              <s.icon className={`w-6 h-6 ${s.iconColor} mb-4`} />
              <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-[10px] font-black text-earth-500 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Quick Actions ───────────────────────────── */}
      <motion.div variants={item}>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-bold font-display text-white uppercase tracking-tight">Quick Actions</h2>
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.to}>
              <motion.div className={`pill-btn ${action.color}`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                <span className="text-xs font-black text-white tracking-tighter">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ─── Market Insights ─────────────────────────── */}
      <motion.div variants={item}>
        <MarketForecastChart />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Section */}
        <motion.div variants={item} className="agri-card !bg-black/20">
          <div className="flex items-center gap-2 mb-8 text-white uppercase font-bold text-sm tracking-widest">
            <Activity className="w-4 h-4 text-purple-400" />
            Recent Pulse
          </div>
          <div className="space-y-4">
            {activity.map((act) => {
              const Icon = activityIcons[act.type] || Activity
              return (
                <div key={act.id} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-earth-900 flex items-center justify-center border border-white/10">
                    <Icon className="w-5 h-5 text-[var(--neo-green)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{act.title}</p>
                    <p className="text-[10px] text-earth-500 uppercase font-black tracking-normal mt-1">{act.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Weather Section */}
        <motion.div variants={item} className="agri-card !bg-black/20">
          <div className="flex items-center gap-2 mb-8 text-white uppercase font-bold text-sm tracking-widest">
            <Cloud className="w-4 h-4 text-sky-400" />
            Local Weather
          </div>
          {weather ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-6xl font-bold text-white">{weather.tempC}°</p>
                  <p className="text-xs text-[var(--neo-green)] font-black uppercase mt-2 tracking-widest">{weather.condition}</p>
                </div>
                <div className="text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">☀️</div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-earth-500 uppercase font-black mb-1">Humidity</p>
                  <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
                </div>
                <div className="flex-1 p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-earth-500 uppercase font-black mb-1">Wind</p>
                  <p className="text-2xl font-bold text-white">{weather.windKph}km</p>
                </div>
              </div>

              {/* Weekly Mini-Forecast */}
              <div className="flex items-center justify-between gap-2 pt-6 border-t border-white/5">
                {weather.forecast.slice(1, 6).map((day) => (
                  <div key={day.date} className="flex-1 text-center p-2 rounded-xl bg-white/5 border border-transparent hover:border-[var(--neo-green)]/20 transition-all">
                    <p className="text-[9px] text-earth-500 font-black uppercase mb-2">
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </p>
                    <div className="text-lg mb-1">
                      {day.condition.toLowerCase().includes('sun') ? '☀️' : 
                       day.condition.toLowerCase().includes('cloud') ? '⛅' : '🌦️'}
                    </div>
                    <p className="text-xs font-bold text-white">{day.maxTempC}°</p>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="h-40 shimmer rounded-3xl" />}
        </motion.div>
      </div>

      <motion.div variants={item}>
        <YieldBarChart />
      </motion.div>
    </motion.div>
  )
}
