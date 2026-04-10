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
    { icon: ScanLine, value: profile.totalScans, label: state.language === 'hi' ? 'कुल स्कैन' : 'Total Scans', color: 'text-[var(--neo-green)]' },
    { icon: Activity, value: profile.totalChats, label: state.language === 'hi' ? 'AI चैट' : 'AI Chats', color: 'text-violet-500' },
    { icon: TrendingUp, value: '12', label: state.language === 'hi' ? 'बाज़ार अलर्ट' : 'Market Alerts', color: 'text-amber-500' },
    { icon: Leaf, value: '79.7', label: state.language === 'hi' ? 'कार्बन क्रेडिट' : 'Carbon Credits', color: 'text-cyan-500' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12 agri-pattern">
      {/* ─── Hero Section ─────────────────────────────────── */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl mesh-gradient p-8 md:p-10 border-b-4 border-b-[var(--neo-green)]">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute inset-0 mesh-glow opacity-60" />
        
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--neo-green)] text-xs font-black tracking-[0.2em] uppercase mb-2"
          >
            {new Date().toLocaleDateString(state.language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold font-display text-white mb-2"
          >
            {greeting}, <span className="text-[var(--neo-green)] drop-shadow-[0_0_10px_var(--neo-green-glow)]">{state.userName}</span> 👨‍🌾
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-earth-400 max-w-lg mb-8"
          >
            {state.language === 'hi'
              ? 'आपका AI-संचालित कृषि ऑपरेटिंग सिस्टम आज आपकी मदद के लिए तैयार है।'
              : 'Your AI-powered agricultural operating system is ready to assist you today.'}
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:border-[var(--neo-green)] transition-colors group"
              >
                <s.icon className={`w-6 h-6 ${s.color} mb-3 group-hover:scale-110 transition-transform`} />
                <p className="text-3xl font-bold font-display text-white">{s.value}</p>
                <p className="text-[10px] text-earth-500 uppercase font-black tracking-widest leading-tight">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Actions Grid ───────────────────────────── */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display text-earth-800 dark:text-earth-200">
            {state.language === 'hi' ? '⚡ त्वरित कार्य' : '⚡ Quick Actions'}
          </h2>
          <div className="h-px flex-1 bg-earth-200 dark:bg-earth-800 mx-6 opacity-30" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative text-center"
              >
                <div className="neo-icon mx-auto mb-4 group-hover:border-white transition-all">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-[10px] font-black text-earth-800 dark:text-earth-200 uppercase tracking-tighter leading-tight">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-1 agri-card">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[var(--neo-green)]/10 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-[var(--neo-green)]" />
            </div>
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">Local Weather</h3>
          </div>
          {weather ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-bold font-display text-white">
                    {weather.tempC}°
                  </p>
                  <p className="text-xs text-[var(--neo-green)] font-bold mt-1 uppercase tracking-widest">{weather.condition}</p>
                </div>
                <div className="text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {weather.condition.toLowerCase().includes('sun') ? '☀️' : '⛅'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <Droplets className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-xl font-bold text-white">{weather.humidity}%</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <Wind className="w-4 h-4 text-teal-400 mb-1" />
                  <span className="text-xl font-bold text-white">{weather.windKph}k</span>
                </div>
              </div>
            </div>
          ) : <div className="h-40 shimmer rounded-2xl" />}
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <MarketForecastChart />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YieldBarChart />
        
        <motion.div variants={item} className="agri-card">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-harvest-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-harvest-500" />
            </div>
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">Recent Pulse</h3>
          </div>
          <div className="space-y-4">
            {activity.map((act, i) => {
              const Icon = activityIcons[act.type] || Activity
              return (
                <div key={act.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-earth-800/50 flex items-center justify-center border border-white/10">
                    <Icon className="w-4 h-4 text-[var(--neo-green)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{act.title}</p>
                    <p className="text-[10px] text-earth-500 uppercase tracking-normal">{act.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
