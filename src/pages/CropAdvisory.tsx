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
    demandLevels: { low: 'कम', medium: 'मध्यम', high: 'अधिक' },
    activityTitle: 'सलाहकार',
    activityDescription: '{count} फसल सिफारिशें मिलीं',
    soil: {
      alluvial: 'जलोढ़',
      black_cotton: 'काली मिट्टी',
      red: 'लाल मिट्टी',
      laterite: 'लैटेराइट',
      desert: 'रेगिस्तानी',
      mountain: 'पर्वतीय',
      saline: 'खारा'
    }
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
    demandLevels: { low: 'Low', medium: 'Medium', high: 'High' },
    activityTitle: 'Advisory',
    activityDescription: 'Got {count} crop recommendations',
    soil: {
      alluvial: 'Alluvial',
      black_cotton: 'Black Cotton',
      red: 'Red',
      laterite: 'Laterite',
      desert: 'Desert',
      mountain: 'Mountain',
      saline: 'Saline'
    }
  },
  pa: {
    title: 'ਫਸਲ ਸਲਾਹਕਾਰ ਇੰਜਣ',
    subtitle: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਅਤੇ ਭੂਗੋਲਿਕ ਸਥਾਨ ਦੇ ਅਧਾਰ ਤੇ ਵਿਅਕਤੀਗਤ ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ',
    landInfo: 'ਸਾਨੂੰ ਆਪਣੀ ਜ਼ਮੀਨ ਬਾਰੇ ਦੱਸੋ',
    selectSoil: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ',
    enterLocation: 'ਸਥਾਨ ਚੁਣੋ',
    getRecs: 'ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ',
    season: 'ਸੀਜ਼ਨ',
    water: 'ਪਾਣੀ',
    duration: 'ਮਿਆਦ',
    yield: 'ਝਾੜ',
    demand: 'ਮੰਗ',
    tips: 'ਸੁਝਾਅ',
    suitability: 'ਅਨੁਕੂਲਤਾ',
    noResults: 'ਕੋਈ ਸਿਫਾਰਸ਼ਾਂ ਨਹੀਂ ਮਿਲੀਆਂ। ਕੋਈ ਹੋਰ ਸੁਮੇਲ ਅਜ਼ਮਾਓ।',
    seasons: { kharif: 'ਖਰੀਫ', rabi: 'ਹਾੜੀ', zaid: 'ਜ਼ੈਦ' },
    waterNeeds: { low: 'ਘੱਟ', medium: 'ਦਰਮਿਆਨਾ', high: 'ਬਹੁਤ' },
    demandLevels: { low: 'ਘੱਟ', medium: 'ਦਰਮਿਆਨਾ', high: 'ਬਹੁਤ' },
    activityTitle: 'ਸਲਾਹਕਾਰ',
    activityDescription: '{count} ਫਸਲ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਮਿਲੀਆਂ',
    soil: {
      alluvial: 'ਜਲੋੜ',
      black_cotton: 'ਕਾਲੀ ਮਿੱਟੀ',
      red: 'ਲਾਲ ਮਿੱਟੀ',
      laterite: 'ਲੈਟਰਾਈਟ',
      desert: 'ਰੇਗਿਸਤਾਨੀ',
      mountain: 'ਪਹਾੜੀ',
      saline: 'ਖਾਰੀ'
    }
  },
  mr: {
    title: 'पीक सल्लागार इंजिन',
    subtitle: 'मातीचा प्रकार आणि भौगोलिक स्थानावर आधारित वैयक्तिक पीक शिफारसी',
    landInfo: 'आम्हाला तुमच्या जमिनीबद्दल सांगा',
    selectSoil: 'मातीचा प्रकार निवडा',
    enterLocation: 'स्थान निवडा',
    getRecs: 'शिफारसी मिळवा',
    season: 'हंगाम',
    water: 'पाणी',
    duration: 'कालावधी',
    yield: 'उत्पन्न',
    demand: 'मागणी',
    tips: 'टिपा',
    suitability: 'उपयुक्तता',
    noResults: 'कोणत्याही शिफारसी आढळल्या नाहीत. भिन्न संयोजन प्रयत्न करा.',
    seasons: { kharif: 'खरीप', rabi: 'रब्बी', zaid: 'उन्हाळी' },
    waterNeeds: { low: 'कमी', medium: 'मध्यम', high: 'जास्त' },
    demandLevels: { low: 'कमी', medium: 'मध्यम', high: 'जास्त' },
    activityTitle: 'सल्लागार',
    activityDescription: '{count} पीक शिफारसी मिळाल्या',
    soil: {
      alluvial: 'गाळाची',
      black_cotton: 'काळी माती',
      red: 'लाल माती',
      laterite: 'लॅटेराईट',
      desert: 'वाळवंटी',
      mountain: 'पर्वतीय',
      saline: 'क्षारयुक्त'
    }
  },
  ta: {
    title: 'பயிர் ஆலோசனை இயந்திரம்',
    subtitle: 'மண் வகை மற்றும் புவியியல் இருப்பிடத்தின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட பயிர் பரிந்துரைகள்',
    landInfo: 'உங்கள் நிலத்தைப் பற்றி எங்களிடம் கூறுங்கள்',
    selectSoil: 'மண் வகையைத் தேர்ந்தெடுக்கவும்',
    enterLocation: 'இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்',
    getRecs: 'பரிந்துரைகளைப் பெறுங்கள்',
    season: 'பருவம்',
    water: 'தண்ணீர்',
    duration: 'காலம்',
    yield: 'மகசூல்',
    demand: 'தேவை',
    tips: 'குறிப்புகள்',
    suitability: 'பொருத்தம்',
    noResults: 'பரிந்துரைகள் எதுவும் கிடைக்கவில்லை. வேறு கலவையை முயற்சிக்கவும்.',
    seasons: { kharif: 'காரிஃப்', rabi: 'ரபி', zaid: 'சையத்' },
    waterNeeds: { low: 'குறைவு', medium: 'நடுத்தரம்', high: 'அதிகம்' },
    demandLevels: { low: 'குறைவு', medium: 'நடுத்தரம்', high: 'அதிகம்' },
    activityTitle: 'ஆலோசனை',
    activityDescription: '{count} பயிர் பரிந்துரைகள் கிடைத்தன',
    soil: {
      alluvial: 'வண்டல்',
      black_cotton: 'கரிசல் மண்',
      red: 'செம்மண்',
      laterite: 'லேட்டரைட்',
      desert: 'பாலைவன மண்',
      mountain: 'மலை மண்',
      saline: 'உவர் மண்'
    }
  },
  te: {
    title: 'పంట సలహా యంత్రం',
    subtitle: 'నేల రకం మరియు భౌగోళిక స్థానం ఆధారంగా వ్యక్తిగతీకరించిన పంట సిఫార్సులు',
    landInfo: 'మీ భూమి గురించి మాకు చెప్పండి',
    selectSoil: 'నేల రకాన్ని ఎంచుకోండి',
    enterLocation: 'స్థానాన్ని ఎంచుకోండి',
    getRecs: 'సిఫార్సులు పొందండి',
    season: 'సీజన్',
    water: 'నీరు',
    duration: 'కాలపరిమితి',
    yield: 'దిగుబడి',
    demand: 'డిమాండ్',
    tips: 'చిట్కాలు',
    suitability: 'అనుకూలత',
    noResults: 'సిఫార్సులు ఏవీ కనుగొనబడలేదు. వేరే కలయికను ప్రయత్నించండి.',
    seasons: { kharif: 'ఖరీఫ్', rabi: 'రబీ', zaid: 'జైద్' },
    waterNeeds: { low: 'తక్కువ', medium: 'మధ్యస్థం', high: 'ఎక్కువ' },
    demandLevels: { low: 'తక్కువ', medium: 'మధ్యస్థం', high: 'ఎక్కువ' },
    activityTitle: 'సలహాదారు',
    activityDescription: '{count} పంట సిఫార్సులు అందాయి',
    soil: {
      alluvial: 'ఒండ్రు నేల',
      black_cotton: 'నల్ల రేగడి నేల',
      red: 'ఎర్ర నేల',
      laterite: 'లాటరైట్ నేల',
      desert: 'ఎడారి నేల',
      mountain: 'పర్వత నేల',
      saline: 'చవుడు నేల'
    }
  },
  kn: {
    title: 'ಬೆಳೆ ಸಲಹಾ ಎಂಜಿನ್',
    subtitle: 'ಮಣ್ಣಿನ ವಿಧ ಮತ್ತು ಭೌಗೋಳಿಕ ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಬೆಳೆ ಶಿಫಾರಸುಗಳು',
    landInfo: 'ನಿಮ್ಮ ಭೂಮಿಯ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ',
    selectSoil: 'ಮಣ್ಣಿನ ವಿಧವನ್ನು ಆರಿಸಿ',
    enterLocation: 'ಸ್ಥಳವನ್ನು ಆರಿಸಿ',
    getRecs: 'ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ',
    season: 'ಹಂಗಾಮು',
    water: 'ನೀರು',
    duration: 'ಅವಧಿ',
    yield: 'ಇಳುವರಿ',
    demand: 'ಬೇಡಿಕೆ',
    tips: 'ಸಲಹೆಗಳು',
    suitability: 'ಸೂಕ್ತತೆ',
    noResults: 'ಯಾವುದೇ ಶಿಫಾರಸುಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಸಂಯೋಜನೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ.',
    seasons: { kharif: 'ಖರೀಫ್', rabi: 'ರಬಿ', zaid: 'ಜೈದ್' },
    waterNeeds: { low: 'ಕಡಿಮೆ', medium: 'ಮಧ್ಯಮ', high: 'ಹೆಚ್ಚು' },
    demandLevels: { low: 'ಕಡಿಮೆ', medium: 'ಮಧ್ಯಮ', high: 'ಹೆಚ್ಚು' },
    activityTitle: 'ಸಲಹೆಗಾರ',
    activityDescription: '{count} ಬೆಳೆ ಶಿಫಾರಸುಗಳು ದೊರೆತಿವೆ',
    soil: {
      alluvial: 'ಪದರ ಮಣ್ಣು',
      black_cotton: 'ಕಪ್ಪು ಮಣ್ಣು',
      red: 'ಕೆಂಪು ಮಣ್ಣು',
      laterite: 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
      desert: 'ಮರುಭೂಮಿ ಮಣ್ಣು',
      mountain: 'ಪರ್ವತ ಮಣ್ಣು',
      saline: 'ಕ್ಷಾರ ಮಣ್ಣು'
    }
  }
}

export default function CropAdvisory() {
  const { state } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

  const [soilType, setSoilType] = useState<SoilType>('alluvial')
  const [location, setLocation] = useState('Karnal, Haryana')
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
        title: `${t.activityTitle}: ${t.soil[soilType]} soil in ${location}`,
        description: t.activityDescription.replace('{count}', recs.length.toString()),
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
                {t.soil[soil.value]}
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

