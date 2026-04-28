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

const translations = {
  hi: {
    title: 'सस्टेनेबल फार्मिंग पोर्टल',
    subtitle: 'कार्बन क्रेडिट ट्रैकिंग, कचरे से कंचन विनिमय और सस्टेनेबिलिटी मेट्रिक्स',
    totalCredits: 'कुल कार्बन क्रेडिट',
    score: 'सस्टेनेबिलिटी स्कोर',
    activeExchanges: 'सक्रिय विनिमय',
    tabCredits: 'कार्बन क्रेडिट',
    tabExchange: 'अपशिष्ट विनिमय',
    tabMap: 'संग्रह मानचित्र',
    activitiesTitle: 'आपकी कार्बन क्रेडिट गतिविधियाँ',
    add: 'जोड़ें',
    activityDesc: 'गतिविधि का विवरण (जैसे: धान के अवशेष का प्रबंधन)',
    credits: 'क्रेडिट',
    save: 'सहेजें',
    pending: 'लंबित',
    verified: 'सत्यापित',
    wasteTitle: 'कृषि अपशिष्ट विनिमय',
    post: 'पोस्ट करें',
    wasteType: 'अपशिष्ट प्रकार (जैसे: धान का भूसा)',
    quantity: 'मात्रा (जैसे: 50 क्विंटल)',
    location: 'स्थान',
    contact: 'संपर्क नाम',
    price: 'प्रति क्विंटल मूल्य (₹)',
    postListing: 'लिस्टिंग पोस्ट करें',
    available: 'उपलब्ध',
    sold: 'बिका हुआ',
    creditsSuffix: 'क्रेडिट'
  },
  en: {
    title: 'Sustainable Farming Portal',
    subtitle: 'Carbon credit tracking, waste-to-wealth exchange, and sustainability metrics',
    totalCredits: 'Total Carbon Credits',
    score: 'Sustainability Score',
    activeExchanges: 'Active Exchanges',
    tabCredits: 'Carbon Credits',
    tabExchange: 'Waste Exchange',
    tabMap: 'Collection Map',
    activitiesTitle: 'Your Carbon Credit Activities',
    add: 'Add',
    activityDesc: 'Activity description (e.g., Paddy straw management)',
    credits: 'Credits',
    save: 'Save Activity',
    pending: 'Pending',
    verified: 'Verified',
    wasteTitle: 'Agricultural Waste Exchange',
    post: 'Post',
    wasteType: 'Waste type (e.g., Paddy Straw)',
    quantity: 'Quantity (e.g., 50 quintals)',
    location: 'Location',
    contact: 'Contact name',
    price: 'Price per quintal (₹)',
    postListing: 'Post Listing',
    available: 'Available',
    sold: 'Sold',
    creditsSuffix: 'credits'
  },
  pa: {
    title: 'ਸਥਿਰ ਖੇਤੀ ਪੋਰਟਲ',
    subtitle: 'ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ ਟ੍ਰੈਕਿੰਗ, ਕੂੜੇ ਤੋਂ ਦੌਲਤ ਵਿਨਿਮਯ ਅਤੇ ਸਥਿਰਤਾ ਮੈਟ੍ਰਿਕਸ',
    totalCredits: 'ਕੁੱਲ ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ',
    score: 'ਸਥਿਰਤਾ ਸਕੋਰ',
    activeExchanges: 'ਸਰਗਰਮ ਵਿਨਿਮਯ',
    tabCredits: 'ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ',
    tabExchange: 'ਕੂੜਾ ਵਿਨਿਮਯ',
    tabMap: 'ਸੰਗ੍ਰਹਿ ਨਕਸ਼ਾ',
    activitiesTitle: 'ਤੁਹਾਡੀਆਂ ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ ਗਤੀਵਿਧੀਆਂ',
    add: 'ਜੋੜੋ',
    activityDesc: 'ਗਤੀਵਿਧੀ ਦਾ ਵੇਰਵਾ (ਜਿਵੇਂ: ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ)',
    credits: 'ਕ੍ਰੈਡਿਟ',
    save: 'ਗਤੀਵਿਧੀ ਸੁਰੱਖਿਅਤ ਕਰੋ',
    pending: 'ਲੰਬਿਤ',
    verified: 'ਸਤਿਆਪਿਤ',
    wasteTitle: 'ਖੇਤੀਬਾੜੀ ਕੂੜਾ ਵਿਨਿਮਯ',
    post: 'ਪੋਸਟ ਕਰੋ',
    wasteType: 'ਕੂੜੇ ਦੀ ਕਿਸਮ (ਜਿਵੇਂ: ਪਰਾਲੀ)',
    quantity: 'ਮਾਤਰਾ (ਜਿਵੇਂ: 50 ਕੁਇੰਟਲ)',
    location: 'ਸਥਾਨ',
    contact: 'ਸੰਪਰਕ ਨਾਮ',
    price: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਕੀਮਤ (₹)',
    postListing: 'ਲਿਸਟਿੰਗ ਪੋਸਟ ਕਰੋ',
    available: 'ਉਪਲਬਧ',
    sold: 'ਵਿਕਿਆ ਹੋਇਆ',
    creditsSuffix: 'ਕ੍ਰੈਡਿਟ'
  },
  mr: {
    title: 'शाश्वत शेती पोर्टल',
    subtitle: 'कार्बन क्रेडिट ट्रॅकिंग, कचरा-ते-संपत्ती विनिमय आणि शाश्वतता मेट्रिक्स',
    totalCredits: 'एकूण कार्बन क्रेडिट्स',
    score: 'शाश्वतता स्कोर',
    activeExchanges: 'सक्रिय विनिमय',
    tabCredits: 'कार्बन क्रेडिट्स',
    tabExchange: 'कचरा विनिमय',
    tabMap: 'संकलन नकाशा',
    activitiesTitle: 'तुमच्या कार्बन क्रेडिट हालचाली',
    add: 'जोडा',
    activityDesc: 'कृतीचे वर्णन (उदा: पेंढा व्यवस्थापन)',
    credits: 'क्रेडिट्स',
    save: 'कृती जतन करा',
    pending: 'प्रलंबित',
    verified: 'सत्यापित',
    wasteTitle: 'कृषी कचरा विनिमय',
    post: 'पोस्ट करा',
    wasteType: 'कचरा प्रकार (उदा: भाताचा पेंढा)',
    quantity: 'प्रमाण (उदा: ५० क्विंटल)',
    location: 'स्थान',
    contact: 'संपर्क नाव',
    price: 'प्रति क्विंटल किंमत (₹)',
    postListing: 'लिस्टिंग पोस्ट करा',
    available: 'उपलब्ध',
    sold: 'विकले गेले',
    creditsSuffix: 'क्रेडिट्स'
  },
  ta: {
    title: 'நிலையான விவசாய போர்டல்',
    subtitle: 'கார்பன் கடன் கண்காணிப்பு, கழிவு-செல்வ பரிமாற்றம் மற்றும் நிலைத்தன்மை அளவீடுகள்',
    totalCredits: 'மொத்த கார்பன் கடன்கள்',
    score: 'நிலைத்தன்மை மதிப்பெண்',
    activeExchanges: 'செயலில் உள்ள பரிமாற்றங்கள்',
    tabCredits: 'கார்பன் கடன்கள்',
    tabExchange: 'கழிவு பரிமாற்றம்',
    tabMap: 'சேகரிப்பு வரைபடம்',
    activitiesTitle: 'உங்கள் கார்பன் கடன் செயல்பாடுகள்',
    add: 'சேர்',
    activityDesc: 'செயல்பாட்டின் விளக்கம் (எ.கா: வைக்கோல் மேலாண்மை)',
    credits: 'கடன்கள்',
    save: 'செயல்பாட்டைச் சேமிக்கவும்',
    pending: 'நிலுவையில் உள்ளது',
    verified: 'சரிபார்க்கப்பட்டது',
    wasteTitle: 'விவசாய கழிவு பரிமாற்றம்',
    post: 'பதிவிடவும்',
    wasteType: 'கழிவு வகை (எ.கா: வைக்கோல்)',
    quantity: 'அளவு (எ.கா: 50 குவிண்டால்)',
    location: 'இடம்',
    contact: 'தொடர்பு பெயர்',
    price: 'ஒரு குவிண்டாலுக்கான விலை (₹)',
    postListing: 'பட்டியலை பதிவிடவும்',
    available: 'கிடைக்கிறது',
    sold: 'விற்கப்பட்டது',
    creditsSuffix: 'கடன்கள்'
  },
  te: {
    title: 'స్థిరమైన వ్యవసాయ పోర్టల్',
    subtitle: 'కార్బన్ క్రెడిట్ ట్రాకింగ్, వ్యర్థాల నుండి సంపద మార్పిడి మరియు స్థిరత్వ మెట్రిక్స్',
    totalCredits: 'మొత్తం కార్బన్ క్రెడిట్స్',
    score: 'స్థిరత్వ స్కోరు',
    activeExchanges: 'క్రియాశీల మార్పిడులు',
    tabCredits: 'కార్బన్ క్రెడిట్స్',
    tabExchange: 'వ్యర్థాల మార్పిడి',
    tabMap: 'సేకరణ మ్యాప్',
    activitiesTitle: 'మీ కార్బన్ క్రెడిట్ కార్యకలాపాలు',
    add: 'జోడించు',
    activityDesc: 'కార్యకలాప వివరాలు (ఉదా: వరి గడ్డి నిర్వహణ)',
    credits: 'క్రెడిట్స్',
    save: 'కార్యకలాపాన్ని సేవ్ చేయండి',
    pending: 'పెండింగ్‌లో ఉంది',
    verified: 'ధృవీకరించబడింది',
    wasteTitle: 'వ్యవసాయ వ్యర్థాల మార్పిడి',
    post: 'పోస్ట్ చేయండి',
    wasteType: 'వ్యర్థాల రకం (ఉదా: వరి గడ్డి)',
    quantity: 'పరిమాణం (ఉదా: 50 క్వింటాళ్లు)',
    location: 'స్థానం',
    contact: 'సంప్రదింపు పేరు',
    price: 'క్వింటాల్ ధర (₹)',
    postListing: 'లిస్టింగ్‌ను పోస్ట్ చేయండి',
    available: 'అందుబాటులో ఉంది',
    sold: 'అమ్మబడింది',
    creditsSuffix: 'క్రెడిట్స్'
  },
  kn: {
    title: 'ಸುಸ್ಥಿರ ಕೃಷಿ ಪೋರ್ಟಲ್',
    subtitle: 'ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ ಟ್ರ್ಯಾಕಿಂಗ್, ತ್ಯಾಜ್ಯದಿಂದ ಸಂಪತ್ತು ವಿನಿಮಯ ಮತ್ತು ಸುಸ್ಥಿರತೆ ಮೆಟ್ರಿಕ್ಸ್',
    totalCredits: 'ಒಟ್ಟು ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳು',
    score: 'ಸುಸ್ಥಿರತೆ ಸ್ಕೋರ್',
    activeExchanges: 'ಸಕ್ರಿಯ ವಿನಿಮಯಗಳು',
    tabCredits: 'ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳು',
    tabExchange: 'ತ್ಯಾಜ್ಯ ವಿನಿಮಯ',
    tabMap: 'ಸಂಗ್ರಹಣೆ ನಕ್ಷೆ',
    activitiesTitle: 'ನಿಮ್ಮ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ ಚಟುವಟಿಕೆಗಳು',
    add: 'ಸೇರಿಸಿ',
    activityDesc: 'ಚಟುವಟಿಕೆಯ ವಿವರಣೆ (ಉದಾ: ಭತ್ತದ ಹುಲ್ಲು ನಿರ್ವಹಣೆ)',
    credits: 'ಕ್ರೆಡಿಟ್‌ಗಳು',
    save: 'ಚಟುವಟಿಕೆಯನ್ನು ಉಳಿಸಿ',
    pending: 'ಬಾಕಿ ಇದೆ',
    verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    wasteTitle: 'ಕೃಷಿ ತ್ಯಾಜ್ಯ ವಿನಿಮಯ',
    post: 'ಪೋಸ್ಟ್ ಮಾಡಿ',
    wasteType: 'ತ್ಯಾಜ್ಯ ವಿಧ (ಉದಾ: ಭತ್ತದ ಹುಲ್ಲು)',
    quantity: 'ಪ್ರಮಾಣ (ಉದಾ: 50 ಕ್ವಿಂಟಾಲ್)',
    location: 'ಸ್ಥಳ',
    contact: 'ಸಂಪರ್ಕ ಹೆಸರು',
    price: 'ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್ ಬೆಲೆ (₹)',
    postListing: 'ಲಿಸ್ಟಿಂಗ್ ಪೋಸ್ಟ್ ಮಾಡಿ',
    available: 'ಲಭ್ಯವಿದೆ',
    sold: 'ಮಾರಾಟವಾಗಿದೆ',
    creditsSuffix: 'ಕ್ರೆಡಿಟ್‌ಗಳು'
  }
}

export default function SustainablePortal() {
  const { state } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

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
      <motion.div variants={item}>
        <h1 className="page-title flex items-center gap-3">
          <Recycle className="w-8 h-8 text-cyan-500" />
          {t.title}
        </h1>
        <p className="page-subtitle">{t.subtitle}</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="stat-card-value">{totalCreds.toFixed(1)}</p>
              <p className="stat-card-label">{t.totalCredits}</p>
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
              <p className="stat-card-label">{t.score}</p>
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
              <p className="stat-card-label">{t.activeExchanges}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex gap-2 flex-wrap sm:flex-nowrap">
        <button
          onClick={() => setTab('credits')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 sm:flex-initial ${
            tab === 'credits' ? 'gradient-primary text-white shadow-lg shadow-sage-500/25' : 'glass text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
          }`}
        >
          <span className="flex items-center gap-2 justify-center">
            <Leaf className="w-4 h-4" /> {t.tabCredits}
          </span>
        </button>
        <button
          onClick={() => setTab('exchange')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 sm:flex-initial ${
            tab === 'exchange' ? 'gradient-primary text-white shadow-lg shadow-sage-500/25' : 'glass text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
          }`}
        >
          <span className="flex items-center gap-2 justify-center">
            <Recycle className="w-4 h-4" /> {t.tabExchange}
          </span>
        </button>
        <button
          onClick={() => setTab('map')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 sm:flex-initial ${
            tab === 'map' ? 'gradient-primary text-white shadow-lg shadow-sage-500/25' : 'glass text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
          }`}
        >
          <span className="flex items-center gap-2 justify-center">
            <Map className="w-4 h-4" /> {t.tabMap}
          </span>
        </button>
      </motion.div>

      {tab === 'map' ? (
        <motion.div variants={item}>
          <WasteCollectionMap />
        </motion.div>
      ) : tab === 'credits' ? (
        <motion.div variants={item} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">{t.activitiesTitle}</h3>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddCredit(!showAddCredit)} className="btn-primary flex items-center gap-1 text-sm !px-4 !py-2">
              {showAddCredit ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddCredit ? '' : t.add}
            </motion.button>
          </div>

          {showAddCredit && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input value={newCreditActivity} onChange={(e) => setNewCreditActivity(e.target.value)} placeholder={t.activityDesc} className="input-field sm:col-span-2" />
                <input value={newCreditAmount} onChange={(e) => setNewCreditAmount(e.target.value)} type="number" placeholder={t.credits} className="input-field" />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddCredit} className="btn-primary mt-3 text-sm">{t.save}</motion.button>
            </motion.div>
          )}

          <div className="space-y-2">
            {credits.map((credit, i) => (
              <motion.div key={credit.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card !p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${credit.verified ? 'bg-emerald-500/10' : 'bg-earth-200/50 dark:bg-earth-800/50'}`}>
                  {credit.verified ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-earth-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-earth-800 dark:text-earth-200 truncate">{credit.activity}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3 h-3 text-earth-400" />
                    <span className="text-xs text-earth-400">{credit.date}</span>
                    <span className={`badge-${credit.verified ? 'success' : 'warning'} ml-1`}>{credit.verified ? t.verified : t.pending}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold font-display text-gradient">+{credit.creditsEarned}</p>
                  <p className="text-[10px] text-earth-400 uppercase font-black">{t.creditsSuffix}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">{t.wasteTitle}</h3>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddExchange(!showAddExchange)} className="btn-primary flex items-center gap-1 text-sm !px-4 !py-2">
              {showAddExchange ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddExchange ? '' : t.post}
            </motion.button>
          </div>

          {showAddExchange && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input value={newExchange.type} onChange={(e) => setNewExchange(p => ({ ...p, type: e.target.value }))} placeholder={t.wasteType} className="input-field" />
                <input value={newExchange.quantity} onChange={(e) => setNewExchange(p => ({ ...p, quantity: e.target.value }))} placeholder={t.quantity} className="input-field" />
                <input value={newExchange.location} onChange={(e) => setNewExchange(p => ({ ...p, location: e.target.value }))} placeholder={t.location} className="input-field" />
                <input value={newExchange.contact} onChange={(e) => setNewExchange(p => ({ ...p, contact: e.target.value }))} placeholder={t.contact} className="input-field" />
                <input value={newExchange.pricePerUnit} onChange={(e) => setNewExchange(p => ({ ...p, pricePerUnit: e.target.value }))} type="number" placeholder={t.price} className="input-field" />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddExchange} className="btn-primary mt-3 text-sm">{t.postListing}</motion.button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchanges.map((ex, i) => (
              <motion.div key={ex.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass-card ${!ex.available ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-bold text-earth-800 dark:text-white">{ex.type}</h4>
                    <p className="text-sm text-earth-500">{ex.quantity}</p>
                  </div>
                  <span className={ex.available ? 'badge-success' : 'badge-danger'}>{ex.available ? t.available : t.sold}</span>
                </div>
                <div className="space-y-1.5 text-sm text-earth-600 dark:text-earth-400">
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-earth-400" /> {ex.location}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-earth-400" /> {ex.contact}</div>
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
