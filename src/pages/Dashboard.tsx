import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ScanLine, Mic, BarChart3, Sprout, Recycle, BookOpen, Brain,
  Cloud, Droplets, Wind, TrendingUp, Activity, Leaf, Zap,
  Sun, ChevronRight, CheckCircle2, TrendingDown, MapPin, Youtube
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getUserProfile } from '../services/db'
import { getWeather } from '../services/weather'
import { getRecentActivity } from '../services/db'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import type { WeatherData } from '../types'
import type { ActivityEntry } from '../services/db'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const quickActions = [
  { to: '/scanner', icon: ScanLine, label: 'SCAN CROP', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { to: '/advisor', icon: Mic, label: 'AI ADVISOR', color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400', iconColor: 'text-indigo-600 dark:text-indigo-400' },
  { to: '/market', icon: BarChart3, label: 'MARKET INTEL', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', iconColor: 'text-amber-600 dark:text-amber-400' },
  { to: '/advisory', icon: Sprout, label: 'CROP ADVISORY', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { to: '/sustainable', icon: Recycle, label: 'SUSTAINABILITY', color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400', iconColor: 'text-cyan-600 dark:text-cyan-400' },
  { to: '/library', icon: BookOpen, label: 'AGRILIBRARY', color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400', iconColor: 'text-teal-600 dark:text-teal-400' },
  { to: '/learning', icon: Youtube, label: 'LEARNING', color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400', iconColor: 'text-red-600 dark:text-red-400' },
  { to: '/genaffnet', icon: Brain, label: 'GENAFFNET', color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400', iconColor: 'text-violet-600 dark:text-violet-400' },
]

// Dummy Data mapped to Crops
const cropDataMap: Record<string, { currentHealth: number, trend: { date: string, value: number }[] }> = {
  'Wheat': {
    currentHealth: 87,
    trend: [ { date: '01 Apr', value: 65 }, { date: '08 Apr', value: 75 }, { date: '15 Apr', value: 70 }, { date: '22 Apr', value: 87 }, { date: '29 Apr', value: 85 } ]
  },
  'Rice': {
    currentHealth: 92,
    trend: [ { date: '01 Apr', value: 80 }, { date: '08 Apr', value: 82 }, { date: '15 Apr', value: 85 }, { date: '22 Apr', value: 90 }, { date: '29 Apr', value: 92 } ]
  },
  'Cotton': {
    currentHealth: 78,
    trend: [ { date: '01 Apr', value: 85 }, { date: '08 Apr', value: 80 }, { date: '15 Apr', value: 75 }, { date: '22 Apr', value: 70 }, { date: '29 Apr', value: 78 } ]
  },
  'Sugarcane': {
    currentHealth: 85,
    trend: [ { date: '01 Apr', value: 70 }, { date: '08 Apr', value: 72 }, { date: '15 Apr', value: 78 }, { date: '22 Apr', value: 82 }, { date: '29 Apr', value: 85 } ]
  },
  'Maize': {
    currentHealth: 65,
    trend: [ { date: '01 Apr', value: 50 }, { date: '08 Apr', value: 55 }, { date: '15 Apr', value: 58 }, { date: '22 Apr', value: 60 }, { date: '29 Apr', value: 65 } ]
  }
}
const cropsList = Object.keys(cropDataMap)

const availableLocations = [
  'Karnal, Haryana',
  'Ludhiana, Punjab',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Indore, MP'
]

const weatherForecast = [
  { day: 'Tue', temp: '27°', icon: '☀️' },
  { day: 'Wed', temp: '28°', icon: '🌤️' },
  { day: 'Thu', temp: '31°', icon: '⛅' },
  { day: 'Fri', temp: '32°', icon: '☀️' },
  { day: 'Sat', temp: '30°', icon: '☁️' },
  { day: 'Sun', temp: '29°', icon: '🌦️' },
  { day: 'Mon', temp: '29°', icon: '🌧️', trend: '+3%', trendColor: 'text-emerald-500' },
]

const marketTrends = [
  { name: 'Wheat', price: '₹ 2,450', change: '+3%', up: true, icon: '🌾' },
  { name: 'Rice', price: '₹ 2,100', change: '-1%', up: false, icon: '🍚' },
  { name: 'Maize', price: '₹ 1,850', change: '+2%', up: true, icon: '🌽' },
]

const sustainabilityItems = [
  { label: 'Water Usage Efficiency', icon: Droplets, color: 'text-sky-500 fill-sky-500/20' },
  { label: 'Carbon Footprint', icon: Wind, color: 'text-stone-400' },
  { label: 'Fertilizer Optimization', icon: Leaf, color: 'text-emerald-500 fill-emerald-500/20' },
  { label: 'Organic Practices', icon: Recycle, color: 'text-emerald-600' },
]

const timeSeriesData = [
  { time: '12:30', value: 30 },
  { time: '12:40', value: 40 },
  { time: '12:50', value: 45 },
  { time: '13:00', value: 50 },
  { time: '13:10', value: 60 },
  { time: '13:20', value: 65 },
]

const translations = {
  hi: {
    scans: 'कुल स्कैन',
    chats: 'AI चैट',
    alerts: 'बाज़ार अलर्ट',
    carbon: 'कार्बन क्रेडिट',
    quickActions: 'त्वरित कार्य',
    cropHealth: 'फसल स्वास्थ्य',
    healthy: 'स्वस्थ',
    needsCare: 'देखभाल की ज़रूरत',
    weather: 'मौसम',
    soilMoisture: 'मिट्टी की नमी',
    optimal: 'इष्टतम स्तर',
    avgMoisture: 'औसत नमी वितरण',
    trend: 'फसल स्वास्थ्य रुझान',
    forecast: 'मौसम पूर्वानुमान',
    today: 'आज',
    insights: 'AI अंतर्दृष्टि',
    viewAdvice: 'सलाह देखें',
    marketTrends: 'बाज़ार के रुझान',
    sustainability: 'सस्टेनेबिलिटी स्कोर',
    viability: 'कुल व्यवहार्यता',
    viewReport: 'रिपोर्ट देखें',
    heroSubtitle: 'आपका स्मार्ट कृषि डैशबोर्ड आज आपकी मदद के लिए तैयार है।',
    last30Days: 'पिछले 30 दिन',
    actions: {
      'SCAN CROP': 'फसल स्कैन',
      'AI ADVISOR': 'AI सलाहकार',
      'MARKET INTEL': 'बाज़ार भाव',
      'CROP ADVISORY': 'फसल सलाह',
      'SUSTAINABILITY': 'सस्टेनेबिलिटी',
      'AGRILIBRARY': 'कृषि लाइब्रेरी',
      'LEARNING': 'लर्निंग पोर्टल',
      'GENAFFNET': 'ML हब'
    }
  },
  en: {
    scans: 'TOTAL SCANS',
    chats: 'AI CHATS',
    alerts: 'MARKET ALERTS',
    carbon: 'CARBON CREDITS',
    quickActions: 'QUICK ACTIONS',
    cropHealth: 'Crop Health',
    healthy: 'Healthy',
    needsCare: 'Needs Care',
    weather: 'Weather',
    soilMoisture: 'Soil Moisture',
    optimal: 'Optimal levels',
    avgMoisture: 'Avg. moisture delivery tracked',
    trend: 'Crop Health Trend',
    forecast: 'Weather Forecast',
    today: 'Today',
    insights: 'AI Insights',
    viewAdvice: 'View Advice',
    marketTrends: 'Market Trends',
    sustainability: 'Sustainability Score',
    viability: 'Overall Viability',
    viewReport: 'View Report',
    heroSubtitle: 'Your smart agricultural dashboard is ready to assist you today.',
    last30Days: 'Last 30 Days',
    actions: {
      'SCAN CROP': 'SCAN CROP',
      'AI ADVISOR': 'AI ADVISOR',
      'MARKET INTEL': 'MARKET INTEL',
      'CROP ADVISORY': 'CROP ADVISORY',
      'SUSTAINABILITY': 'SUSTAINABILITY',
      'AGRILIBRARY': 'AGRILIBRARY',
      'LEARNING': 'LEARNING PORTAL',
      'GENAFFNET': 'GENAFFNET'
    }
  }
}

export default function Dashboard() {
  const { state } = useApp()
  const lang = (state.language === 'hi' ? 'hi' : 'en') as 'hi' | 'en'
  const t = translations[lang]

  const profile = getUserProfile()
  
  const [selectedCrop, setSelectedCrop] = useState('Wheat')
  
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[]>([])

  useEffect(() => {
    getWeather(state.currentLocation).then(setWeather)
    getRecentActivity().then(data => setActivity(data.slice(0, 5)))
  }, [state.currentLocation])

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

  const cardClass = "bg-white dark:bg-[#1C1C1E] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-md dark:shadow-none border-[1.5px] border-stone-200 dark:border dark:border-white/5 relative overflow-hidden transition-colors flex flex-col"

  const currentCropData = cropDataMap[selectedCrop] || cropDataMap['Wheat']

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-20">

      {/* ─── Hero Section ─────────────────────────────────── */}
      <motion.div variants={item} className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 md:p-10 shadow-md dark:shadow-none border-[1.5px] border-stone-200 dark:border dark:border-white/5 relative overflow-hidden transition-colors">
        <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] dark:opacity-[0.02] pointer-events-none rotate-12">
          <Sprout className="w-96 h-96" />
        </div>
        
        <div className="space-y-2 mb-10 relative z-10">
          <p className="text-stone-400 dark:text-stone-500 text-xs font-bold tracking-wider uppercase">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-stone-800 dark:text-stone-100 tracking-tight">
            {greeting}, <span className="text-emerald-600 dark:text-emerald-500">{state.userName || 'Guest Farmer'}</span> 🧑‍🌾
          </h1>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg text-sm pt-2">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {[
            { icon: ScanLine, value: profile.totalScans, label: t.scans, bgColor: 'bg-emerald-50/70 dark:bg-[#1a2f24]' },
            { icon: Activity, value: profile.totalChats, label: t.chats, bgColor: 'bg-purple-50/70 dark:bg-purple-900/20' },
            { icon: TrendingUp, value: '12', label: t.alerts, bgColor: 'bg-amber-50/70 dark:bg-amber-900/20' },
            { icon: Leaf, value: '79.7', label: t.carbon, bgColor: 'bg-cyan-50/70 dark:bg-cyan-900/20' },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              className={`${s.bgColor} rounded-[1.5rem] p-6 border border-white dark:border-white/5 transition-all`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2.5 bg-white dark:bg-[#2A2A2D] rounded-xl shadow-sm text-stone-700 dark:text-stone-300">
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1">{s.value}</p>
              <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Quick Actions ───────────────────────────── */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-5 px-2">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <h2 className="text-lg font-bold font-display text-stone-800 dark:text-stone-100 uppercase tracking-tight">{t.quickActions}</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.to}>
              <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border-[1.5px] border-stone-200 dark:border dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-md transition-all text-center h-full">
                <div className={`p-3 rounded-[1rem] ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-tighter">{t.actions[action.label as keyof typeof t.actions] || action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ─── Graphical Representations (Matched to Image) ────────── */}
      <motion.div variants={item} className="flex flex-col gap-5 md:gap-6 pt-4">
        
        {/* ROW 1: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          
          {/* Card 1: Crop Health */}
          <div className={cardClass}>
            <div className="flex justify-between items-start mb-6 z-10 relative">
               <h3 className="text-stone-800 dark:text-stone-100 font-bold whitespace-nowrap">{t.cropHealth}</h3>
               <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                 <Leaf className="w-3 h-3" /> {currentCropData.currentHealth >= 80 ? t.healthy : t.needsCare}
               </div>
            </div>
            <div className="z-10 relative flex justify-between items-end">
              <p className="text-5xl lg:text-6xl font-bold text-stone-800 dark:text-stone-100 tracking-tighter transition-all">{currentCropData.currentHealth}<span className="text-3xl">%</span></p>
            </div>
            {/* Chart in background */}
            <div className="absolute inset-x-0 bottom-0 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentCropData.trend.slice(-4)}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentCropData.currentHealth >= 80 ? "#10b981" : "#f59e0b"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={currentCropData.currentHealth >= 80 ? "#10b981" : "#f59e0b"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={currentCropData.currentHealth >= 80 ? "#10b981" : "#f59e0b"} strokeWidth={3} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Weather */}
          <div className={`${cardClass} bg-gradient-to-b from-transparent to-emerald-50/50 dark:to-emerald-900/10`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-stone-800 dark:text-stone-100 font-bold">{t.weather}</h3>
              {weather ? (
                <div className="flex -space-x-2">
                  <Cloud className="w-8 h-8 text-sky-400 fill-sky-200 dark:fill-sky-900/50" />
                  <Sun className="w-8 h-8 text-amber-500 fill-amber-400 -mt-2 drop-shadow-md" />
                </div>
              ) : <div className="w-8 h-8 bg-stone-100 animate-pulse rounded-full" />}
            </div>
            <div className="mb-2">
              {weather ? (
                <>
                  <p className="text-5xl lg:text-6xl font-bold text-stone-800 dark:text-stone-100 tracking-tighter">{weather.tempC}<span className="text-3xl">°C</span></p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm font-bold mt-1 max-w-full truncate">{weather.condition} <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-2"></span></p>
                </>
              ) : (
                <div className="space-y-2 mt-4">
                  <div className="h-10 w-24 bg-stone-100 animate-pulse rounded-lg" />
                  <div className="h-4 w-32 bg-stone-100 animate-pulse rounded" />
                </div>
              )}
              
            </div>
            {/* Abstract Field Graphic */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-emerald-600/20 dark:from-emerald-400/10 to-transparent">
              <div className="absolute bottom-0 w-full h-8 bg-emerald-700/10 dark:bg-emerald-300/5 rotate-[-2deg] transform origin-bottom-left"></div>
              <div className="absolute bottom-0 w-full h-10 bg-emerald-600/10 dark:bg-emerald-400/5 rotate-[3deg] transform origin-bottom-right"></div>
            </div>
          </div>

          {/* Card 3: Soil Moisture */}
          <div className={cardClass}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-stone-800 dark:text-stone-100 font-bold">{t.soilMoisture}</h3>
              <div className="flex relative">
                <Droplets className="w-8 h-8 text-sky-500 fill-sky-400 opacity-60 absolute -right-4 -top-2" />
                <Droplets className="w-10 h-10 text-sky-600 fill-sky-500 drop-shadow-md" />
              </div>
            </div>
            <div>
              <p className="text-5xl lg:text-6xl font-bold text-stone-800 dark:text-stone-100 tracking-tighter">65<span className="text-3xl">%</span></p>
            </div>
            <div className="mt-auto pt-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-stone-800 dark:text-stone-100">{t.optimal}</p>
                <p className="text-stone-500 dark:text-stone-400 truncate">{t.avgMoisture}</p>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: Crop Health Trend & Weather Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          
          <div className={`${cardClass} lg:col-span-2`}>
             <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <h3 className="text-stone-800 dark:text-stone-100 font-bold">{t.trend}</h3>
                 <div className="bg-stone-100 dark:bg-[#2A2A2D] px-2 py-1 flex items-center rounded-lg border border-stone-200 dark:border-stone-700">
                    <select 
                      value={selectedCrop} 
                      onChange={(e) => setSelectedCrop(e.target.value)} 
                      className="bg-transparent text-emerald-600 dark:text-emerald-400 text-xs font-bold focus:outline-none cursor-pointer border-none appearance-none pr-4 relative"
                    >
                      {cropsList.map(c => <option key={c} value={c} className="text-stone-800">{c}</option>)}
                    </select>
                    <div className="pointer-events-none -ml-4 flex items-center text-emerald-600 dark:text-emerald-400">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                 </div>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase hidden sm:block">{t.last30Days}</p>
            </div>
            <div className="h-48 w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentCropData.trend}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentCropData.currentHealth >= 80 ? "#10b981" : "#f59e0b"} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={currentCropData.currentHealth >= 80 ? "#10b981" : "#f59e0b"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#78716c', fontSize: 10, fontWeight: 'bold'}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#78716c', fontSize: 10, fontWeight: 'bold'}}
                      dx={-10}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke={currentCropData.currentHealth >= 80 ? "#10b981" : "#f59e0b"} strokeWidth={3} fill="url(#colorTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className={`${cardClass} lg:col-span-1`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-stone-800 dark:text-stone-100 font-bold">{t.forecast}</h3>
              <div className="flex gap-2">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold text-center cursor-default">{t.today}</div>
              </div>
            </div>
            
            <div className="flex items-end justify-between flex-1 pb-2">
               {(weather?.forecast?.slice(0,7).map(d => ({
                  day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
                  temp: `${d.maxTempC}°`,
                  icon: d.condition.toLowerCase().includes('sun') ? '☀️' : d.condition.toLowerCase().includes('cloud') ? '⛅' : '🌦️'
               })) || weatherForecast).map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase">{day.day}</span>
                  <span className="text-xl my-2 leading-none">{day.icon}</span>
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">{day.temp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: AI Insights/Market + Farm Map + Sustainability */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          
          {/* Col 1 */}
          <div className="flex flex-col gap-5 md:gap-6">
            <div className={`${cardClass} bg-stone-50/80 dark:bg-[#252528] !border-[1.5px] !border-indigo-100 dark:!border-white/5 !shadow-sm dark:!shadow-none`}>
               <h3 className="text-stone-800 dark:text-stone-100 font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" /> {t.insights}
               </h3>
               <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-6">
                 Reduce irrigation for the next two days to <span className="text-emerald-600 dark:text-emerald-400 font-bold">40%</span> due to forecasted rain and high soil moisture levels.
               </p>
               <button className="bg-stone-800 hover:bg-stone-900 dark:bg-[#333336] dark:hover:bg-[#444448] text-white py-3 px-4 rounded-xl text-sm font-bold transition-colors w-max flex items-center gap-2">
                 {t.viewAdvice} <ChevronRight className="w-4 h-4" />
               </button>
            </div>

            <div className={`${cardClass} flex-1`}>
              <h3 className="text-stone-800 dark:text-stone-100 font-bold mb-4">{t.marketTrends}</h3>
              <div className="space-y-4">
                {marketTrends.map((trend, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-lg">{trend.icon}</div>
                      <span className="font-bold text-stone-800 dark:text-stone-100 text-sm">{trend.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-stone-700 dark:text-stone-300 text-sm font-medium">{trend.price}</span>
                      <span className={`text-xs font-bold w-12 text-right ${trend.up ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend.up ? '↑' : '↓'} {trend.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className={`${cardClass} p-0 lg:p-0`}>
             <div className="relative h-48 w-full">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" 
                  className="w-full h-full object-cover"
                  alt="Farm aerial view"
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                   <div className="bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 text-stone-800 dark:text-stone-100">
                     <MapPin className="w-3 h-3 text-emerald-600" /> {state.currentLocation.split(',')[0]} Farm
                   </div>
                </div>
                <div className="absolute bottom-4 right-4">
                   <div className="text-white/90 text-[10px] font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-sm">Fields &gt;</div>
                </div>
             </div>
             <div className="p-5 flex-1 flex flex-col">
                <div className="flex gap-2 mb-6">
                  <div className="bg-stone-100 dark:bg-[#2A2A2D] text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                     <Leaf className="w-3.5 h-3.5" /> {t.cropHealth}
                  </div>
                  <div className="text-stone-500 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:text-stone-800 dark:hover:text-stone-200">
                    <Activity className="w-3.5 h-3.5" /> Sensors
                  </div>
                </div>
                
                <div className="h-20 w-full mt-auto">
                   <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 9}} dy={5} />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{r: 3, fill: '#10b981', strokeWidth: 0}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Col 3 */}
          <div className={`${cardClass}`}>
             <h3 className="text-stone-800 dark:text-stone-100 font-bold mb-6">{t.sustainability}</h3>
             
             <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 space-y-4">
                  {sustainabilityItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-300 leading-tight block w-24">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="w-32 h-32 relative flex-shrink-0">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{value: 82}, {value: 18}]}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={55}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                         <Cell fill="#10b981" />
                         <Cell fill="#e5e7eb" className="dark:fill-[#3f3f46]" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-2xl font-bold text-stone-800 dark:text-stone-100">82%</span>
                     <span className="text-[8px] font-bold text-stone-400 uppercase tracking-tighter text-center leading-none mt-1">{t.viability}</span>
                  </div>
                </div>
             </div>
             
             <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Overall 82%
                </div>
                <button className="bg-emerald-50 hover:bg-emerald-100 dark:bg-[#1a2f24] dark:hover:bg-[#203c2b] text-emerald-700 dark:text-emerald-400 py-2.5 px-6 rounded-full text-xs font-bold transition-colors">
                  {t.viewReport}
                </button>
             </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  )
}
