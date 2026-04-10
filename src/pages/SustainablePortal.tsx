import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Recycle, Leaf, TrendingUp, Award, Package,
  MapPin, Phone, Calendar, CheckCircle2, Clock, Plus, X, Map,
} from 'lucide-react'
import { getCarbonCredits, addCarbonCredit, getTotalCredits, getWasteExchanges, addWasteExchange } from '../services/db'
import { useApp } from '../context/AppContext'
import WasteCollectionMap from '../components/WasteCollectionMap'
import type { CarbonCredit, WasteExchange } from '../types'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function SustainablePortal() {
  const { state } = useApp()
  const [credits, setCredits] = useState<CarbonCredit[]>(getCarbonCredits)
  const [exchanges, setExchanges] = useState<WasteExchange[]>(getWasteExchanges)
  const [totalCreds] = useState(getTotalCredits)
  const [tab, setTab] = useState<'credits' | 'exchange' | 'map'>('credits')
  const [showAddCredit, setShowAddCredit] = useState(false)
  const [showAddExchange, setShowAddExchange] = useState(false)
  const [newCreditActivity, setNewCreditActivity] = useState('')
  const [newCreditAmount, setNewCreditAmount] = useState('')
  const [newExchange, setNewExchange] = useState({ type: '', quantity: '', location: '', contact: '', pricePerUnit: '' })

  const handleAddCredit = () => {
    if (!newCreditActivity || !newCreditAmount) return
    const credit: CarbonCredit = {
      id: `cc_${Date.now()}`,
      activity: newCreditActivity,
      creditsEarned: parseFloat(newCreditAmount),
      date: new Date().toISOString().split('T')[0],
      verified: false,
    }
    addCarbonCredit(credit)
    setCredits([credit, ...credits])
    setNewCreditActivity('')
    setNewCreditAmount('')
    setShowAddCredit(false)
  }

  const handleAddExchange = () => {
    if (!newExchange.type || !newExchange.quantity) return
    const exchange: WasteExchange = {
      id: `we_${Date.now()}`,
      ...newExchange,
      pricePerUnit: parseFloat(newExchange.pricePerUnit) || 0,
      available: true,
      postedDate: new Date().toISOString().split('T')[0],
    }
    addWasteExchange(exchange)
    setExchanges([exchange, ...exchanges])
    setNewExchange({ type: '', quantity: '', location: '', contact: '', pricePerUnit: '' })
    setShowAddExchange(false)
  }

  const sustainabilityScore = Math.min(100, Math.round(totalCreds * 1.2))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="page-title flex items-center gap-3">
          <Recycle className="w-8 h-8 text-cyan-500" />
          {state.language === 'hi' ? 'सस्टेनेबल फार्मिंग पोर्टल' : 'Sustainable Farming Portal'}
        </h1>
        <p className="page-subtitle">
          {state.language === 'hi'
            ? 'कार्बन क्रेडिट ट्रैकिंग और कृषि अपशिष्ट विनिमय'
            : 'Carbon credit tracking, waste-to-wealth exchange, and sustainability metrics'}
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="stat-card-value">{totalCreds.toFixed(1)}</p>
              <p className="stat-card-label">{state.language === 'hi' ? 'कुल कार्बन क्रेडिट' : 'Total Carbon Credits'}</p>
            </div>
          </div>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="stat-card-value">{sustainabilityScore}%</p>
              <p className="stat-card-label">{state.language === 'hi' ? 'सस्टेनेबिलिटी स्कोर' : 'Sustainability Score'}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full bg-earth-200 dark:bg-earth-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sustainabilityScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="stat-card-value">{exchanges.filter(e => e.available).length}</p>
              <p className="stat-card-label">{state.language === 'hi' ? 'सक्रिय आदान-प्रदान' : 'Active Exchanges'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div variants={item} className="flex gap-2">
        <button
          onClick={() => setTab('credits')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            tab === 'credits'
              ? 'gradient-primary text-white shadow-lg shadow-sage-500/25'
              : 'glass text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            {state.language === 'hi' ? 'कार्बन क्रेडिट' : 'Carbon Credits'}
          </span>
        </button>
        <button
          onClick={() => setTab('exchange')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            tab === 'exchange'
              ? 'gradient-primary text-white shadow-lg shadow-sage-500/25'
              : 'glass text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Recycle className="w-4 h-4" />
            {state.language === 'hi' ? 'अपशिष्ट विनिमय' : 'Waste Exchange'}
          </span>
        </button>
        <button
          onClick={() => setTab('map')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            tab === 'map'
              ? 'gradient-primary text-white shadow-lg shadow-sage-500/25'
              : 'glass text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            {state.language === 'hi' ? 'संग्रह मानचित्र' : 'Collection Map'}
          </span>
        </button>
      </motion.div>

      {/* Tab Content */}
      {tab === 'map' ? (
        <motion.div variants={item}>
          <WasteCollectionMap />
        </motion.div>
      ) : tab === 'credits' ? (
        <motion.div variants={item} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">
              {state.language === 'hi' ? 'आपकी कार्बन क्रेडिट गतिविधियाँ' : 'Your Carbon Credit Activities'}
            </h3>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddCredit(!showAddCredit)} className="btn-primary flex items-center gap-1 text-sm !px-4 !py-2">
              {showAddCredit ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddCredit ? '' : (state.language === 'hi' ? 'जोड़ें' : 'Add')}
            </motion.button>
          </div>

          {/* Add Credit Form */}
          {showAddCredit && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input value={newCreditActivity} onChange={(e) => setNewCreditActivity(e.target.value)} placeholder={state.language === 'hi' ? 'गतिविधि का विवरण' : 'Activity description'} className="input-field sm:col-span-2" />
                <input value={newCreditAmount} onChange={(e) => setNewCreditAmount(e.target.value)} type="number" placeholder={state.language === 'hi' ? 'क्रेडिट' : 'Credits'} className="input-field" />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddCredit} className="btn-primary mt-3 text-sm">
                {state.language === 'hi' ? 'सहेजें' : 'Save Activity'}
              </motion.button>
            </motion.div>
          )}

          {/* Credit List */}
          <div className="space-y-2">
            {credits.map((credit, i) => (
              <motion.div
                key={credit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card !p-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  credit.verified ? 'bg-emerald-500/10' : 'bg-earth-200/50 dark:bg-earth-800/50'
                }`}>
                  {credit.verified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-earth-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-earth-800 dark:text-earth-200 truncate">{credit.activity}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3 h-3 text-earth-400" />
                    <span className="text-xs text-earth-400">{credit.date}</span>
                    {credit.verified ? (
                      <span className="badge-success ml-1">Verified</span>
                    ) : (
                      <span className="badge-warning ml-1">Pending</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold font-display text-gradient">+{credit.creditsEarned}</p>
                  <p className="text-[10px] text-earth-400">credits</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">
              {state.language === 'hi' ? 'कृषि अपशिष्ट विनिमय' : 'Agricultural Waste Exchange'}
            </h3>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddExchange(!showAddExchange)} className="btn-primary flex items-center gap-1 text-sm !px-4 !py-2">
              {showAddExchange ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddExchange ? '' : (state.language === 'hi' ? 'पोस्ट करें' : 'Post')}
            </motion.button>
          </div>

          {/* Add Exchange Form */}
          {showAddExchange && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input value={newExchange.type} onChange={(e) => setNewExchange(p => ({ ...p, type: e.target.value }))} placeholder="Waste type (e.g., Paddy Straw)" className="input-field" />
                <input value={newExchange.quantity} onChange={(e) => setNewExchange(p => ({ ...p, quantity: e.target.value }))} placeholder="Quantity (e.g., 50 quintals)" className="input-field" />
                <input value={newExchange.location} onChange={(e) => setNewExchange(p => ({ ...p, location: e.target.value }))} placeholder="Location" className="input-field" />
                <input value={newExchange.contact} onChange={(e) => setNewExchange(p => ({ ...p, contact: e.target.value }))} placeholder="Contact name" className="input-field" />
                <input value={newExchange.pricePerUnit} onChange={(e) => setNewExchange(p => ({ ...p, pricePerUnit: e.target.value }))} type="number" placeholder="Price per quintal (₹)" className="input-field" />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddExchange} className="btn-primary mt-3 text-sm">
                {state.language === 'hi' ? 'लिस्ट करें' : 'Post Listing'}
              </motion.button>
            </motion.div>
          )}

          {/* Exchange Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchanges.map((ex, i) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card ${!ex.available ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-bold text-earth-800 dark:text-white">{ex.type}</h4>
                    <p className="text-sm text-earth-500">{ex.quantity}</p>
                  </div>
                  <span className={ex.available ? 'badge-success' : 'badge-danger'}>
                    {ex.available ? 'Available' : 'Sold'}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm text-earth-600 dark:text-earth-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-earth-400" />
                    {ex.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-earth-400" />
                    {ex.contact}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-earth-200/30 dark:border-earth-700/30">
                    <span className="text-xs text-earth-400">{ex.postedDate}</span>
                    <span className="text-base font-bold text-gradient">₹{ex.pricePerUnit}/q</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
