import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Search, 
  BookOpen, 
  Sprout, 
  TrendingUp, 
  Recycle, 
  ShieldCheck,
  ChevronRight,
  Clock,
  Youtube
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const videoData = [
  {
    "title": "Step-by-Step Wheat Farming: From Planting to Harvesting",
    "videoId": "G1nL_mFLn-A",
    "category": "How to grow crops",
    "duration": "12:45"
  },
  {
    "title": "गेंहू की खेती wheat farming fertilizer watering herbicide insecticide fungicide hormone good profit",
    "videoId": "ZkCSGoPxATE",
    "category": "How to grow crops",
    "duration": "15:20"
  },
  {
    "title": "How to Grow Wheat (From Seed to Harvest)",
    "videoId": "AonJkhqCRwk",
    "category": "How to grow crops",
    "duration": "10:15"
  },
  {
    "title": "Rice Farming: Complete Guide from Seeds to Harvest with Recent Techniques",
    "videoId": "FW_bw9jdrlQ",
    "category": "How to grow crops",
    "duration": "18:30"
  },
  {
    "title": "Rice Farming: Complete Guide from Seeds to Harvest",
    "videoId": "J_mMS3EkHok",
    "category": "How to grow crops",
    "duration": "22:10"
  },
  {
    "title": "Growing Corn - Beginner's Guide Seed to Harvest",
    "videoId": "3kFUMKVzG9I",
    "category": "How to grow crops",
    "duration": "14:05"
  },
  {
    "title": "मक्का की खेती मे बंपर उत्पादन के लिये ये Successful फॉर्मुला | A to Z Corn Farming",
    "videoId": "07AE1mt--RQ",
    "category": "How to grow crops",
    "duration": "11:50"
  },
  {
    "title": "How to Grow Cotton: Step-by-Step Guide for Beginners",
    "videoId": "whbhGlvDIj4",
    "category": "How to grow crops",
    "duration": "09:40"
  },
  {
    "title": "Cotton Farming Guide | How to grow Cotton plant at Home | Cotton Cultivation",
    "videoId": "eN-TqqBQOAk",
    "category": "How to grow crops",
    "duration": "13:25"
  },
  {
    "title": "Reasons for price fluctuation!",
    "videoId": "GfCY1bfr0no",
    "category": "Market price fluctuation",
    "duration": "08:15"
  },
  {
    "title": "FCI AGM | AGRICULTURE ECONOMY | AGRICULTURE MARKETING AND PRICE ANALYSIS",
    "videoId": "nTXwlbZ0wVk",
    "category": "Market price fluctuation",
    "duration": "25:40"
  },
  {
    "title": "Classification of Market || Part - 1",
    "videoId": "OUuv5Esw-nI",
    "category": "Market price fluctuation",
    "duration": "12:10"
  },
  {
    "title": "Need,Scope, Importance || Agriculture Marketing",
    "videoId": "wtd1sZgcnF4",
    "category": "Market price fluctuation",
    "duration": "14:30"
  },
  {
    "title": "ECON 353 Agricultural Marketing, Trade and Prices",
    "videoId": "jgg5sdjiyPc",
    "category": "Market price fluctuation",
    "duration": "30:00"
  },
  {
    "title": "Factors affecting Agriculture Price | Agriculture Marketing",
    "videoId": "v4h1Z_Q3K0Y",
    "category": "Market price fluctuation",
    "duration": "11:20"
  },
  {
    "title": "Stubble Burning in India - Issues and Organic Solutions",
    "videoId": "7ZH4O6hWVeI",
    "category": "Stubble management",
    "duration": "16:45"
  },
  {
    "title": "Awareness Campaign on Stubble (Parali) Management",
    "videoId": "rZxTTGrmKe0",
    "category": "Stubble management",
    "duration": "05:30"
  },
  {
    "title": "Farm-to-Industry: A Sustainable Stubble Management Network",
    "videoId": "hzNFrHhWxWo",
    "category": "Stubble management",
    "duration": "09:15"
  },
  {
    "title": "Management of crop stubble by Pusa decomposer - ICAR",
    "videoId": "0pX36F_3Z1k",
    "category": "Stubble management",
    "duration": "07:50"
  },
  {
    "title": "From smoke to income: Punjab farmers shift away from stubble burning",
    "videoId": "EYUHAow1BXA",
    "category": "Stubble management",
    "duration": "12:10"
  },
  {
    "title": "Happy Seeder agri-entrepreneurs for remunerative farming",
    "videoId": "PpiXk5E8XW4",
    "category": "Stubble management",
    "duration": "10:30"
  },
  {
    "title": "All Rice Diseases Explained 🌾 | A to Z Guide",
    "videoId": "sFxPgul_dZs",
    "category": "Disease prevention",
    "duration": "20:15"
  },
  {
    "title": "Plant Disease Prevention: Exclusion, Escape, and Protection",
    "videoId": "jI16EY9OAOE",
    "category": "Disease prevention",
    "duration": "14:40"
  },
  {
    "title": "Plant Disease Identification and Management",
    "videoId": "8mJmK2_8V7M",
    "category": "Disease prevention",
    "duration": "18:20"
  },
  {
    "title": "Integrated Pest Management (IPM) - Disease Prevention",
    "videoId": "L98F_jggA6M",
    "category": "Disease prevention",
    "duration": "13:50"
  },
  {
    "title": "Rice Pest and Disease Management: Expert Tips",
    "videoId": "K0XkXl_HCEg",
    "category": "Disease prevention",
    "duration": "15:10"
  },
  {
    "title": "Disease Management: When to DIY and When to CAP",
    "videoId": "St_LUzddSVM",
    "category": "Disease prevention",
    "duration": "11:00"
  },
  {
    "title": "Diseases of Wheat | गेहूँ की बीमारियां",
    "videoId": "gnlzMIrjsrQ",
    "category": "Disease prevention",
    "duration": "12:30"
  }
]

const categories = [
  { id: 'all', label: 'All Videos' },
  { id: 'How to grow crops', label: 'Crop Growing' },
  { id: 'Market price fluctuation', label: 'Market Intelligence' },
  { id: 'Stubble management', label: 'Stubble Management' },
  { id: 'Disease prevention', label: 'Disease Prevention' },
]

const translations = {
  hi: {
    title: 'लर्निंग पोर्टल',
    subtitle: 'अपनी कृषि विशेषज्ञता बढ़ाने के लिए क्यूरेटेड वीडियो लाइब्रेरी का अन्वेषण करें।',
    searchPlaceholder: 'वीडियो खोजें...',
    watchYoutube: 'YouTube पर देखें',
    noVideoTitle: 'कोई वीडियो नहीं मिला',
    noVideoSubtitle: 'कृपया अपनी खोज या फ़िल्टर बदलें।',
    categories: {
      'all': 'सभी वीडियो',
      'How to grow crops': 'फसल उगाना',
      'Market price fluctuation': 'बाज़ार की जानकारी',
      'Stubble management': 'पराली प्रबंधन',
      'Disease prevention': 'रोग रोकथाम'
    }
  },
  en: {
    title: 'Learning Portal',
    subtitle: 'Explore our curated video library to enhance your agricultural expertise.',
    searchPlaceholder: 'Search videos...',
    watchYoutube: 'Watch on YouTube',
    noVideoTitle: 'No videos found',
    noVideoSubtitle: 'Please try a different search or filter.',
    categories: {
      'all': 'All Videos',
      'How to grow crops': 'Crop Growing',
      'Market price fluctuation': 'Market Intelligence',
      'Stubble management': 'Stubble Management',
      'Disease prevention': 'Disease Prevention'
    }
  },
  pa: {
    title: 'ਸਿਖਲਾਈ ਪੋਰਟਲ',
    subtitle: 'ਆਪਣੀ ਖੇਤੀਬਾੜੀ ਮੁਹਾਰਤ ਨੂੰ ਵਧਾਉਣ ਲਈ ਸਾਡੀ ਕਿਊਰੇਟਿਡ ਵੀਡੀਓ ਲਾਇਬ੍ਰੇਰੀ ਦੀ ਪੜਚੋਲ ਕਰੋ।',
    searchPlaceholder: 'ਵੀਡੀਓ ਖੋਜੋ...',
    watchYoutube: 'YouTube ਤੇ ਦੇਖੋ',
    noVideoTitle: 'ਕੋਈ ਵੀਡੀਓ ਨਹੀਂ ਮਿਲੀ',
    noVideoSubtitle: 'ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਹੋਰ ਖੋਜ ਜਾਂ ਫਿਲਟਰ ਅਜ਼ਮਾਓ।',
    categories: {
      'all': 'ਸਾਰੇ ਵੀਡੀਓ',
      'How to grow crops': 'ਫਸਲ ਉਗਾਉਣਾ',
      'Market price fluctuation': 'ਬਾਜ਼ਾਰ ਦੀ ਜਾਣਕਾਰੀ',
      'Stubble management': 'ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ',
      'Disease prevention': 'ਬਿਮਾਰੀ ਦੀ ਰੋਕਥਾਮ'
    }
  },
  mr: {
    title: 'लर्निंग पोर्टल',
    subtitle: 'तुमचे कृषी कौशल्य वाढवण्यासाठी आमच्या निवडक व्हिडिओ लायब्ररीचा शोध घ्या.',
    searchPlaceholder: 'व्हिडिओ शोधा...',
    watchYoutube: 'YouTube वर पहा',
    noVideoTitle: 'कोणताही व्हिडिओ आढळला नाही',
    noVideoSubtitle: 'कृपया वेगळा शोध किंवा फिल्टर प्रयत्न करा.',
    categories: {
      'all': 'सर्व व्हिडिओ',
      'How to grow crops': 'पीक वाढवणे',
      'Market price fluctuation': 'बाजार माहिती',
      'Stubble management': 'पेंढा व्यवस्थापन',
      'Disease prevention': 'रोग प्रतिबंध'
    }
  },
  ta: {
    title: 'கற்றல் போர்டல்',
    subtitle: 'உங்கள் விவசாய நிபுணத்துவத்தை மேம்படுத்த எங்களின் வீடியோ நூலகத்தை ஆராயுங்கள்.',
    searchPlaceholder: 'வீடியோக்களைத் தேடுங்கள்...',
    watchYoutube: 'YouTube இல் பார்க்கவும்',
    noVideoTitle: 'வீடியோக்கள் எதுவும் கிடைக்கவில்லை',
    noVideoSubtitle: 'வேறு தேடல் அல்லது வடிப்பானை முயற்சிக்கவும்.',
    categories: {
      'all': 'அனைத்து வீடியோக்கள்',
      'How to grow crops': 'பயிர் வளர்ப்பு',
      'Market price fluctuation': 'சந்தை நுண்ணறிவு',
      'Stubble management': 'வைக்கோல் மேலாண்மை',
      'Disease prevention': 'நோய் தடுப்பு'
    }
  },
  te: {
    title: 'లెర్నింగ్ పోర్టల్',
    subtitle: 'మీ వ్యవసాయ నైపుణ్యాన్ని పెంపొందించుకోవడానికి మా వీడియో లైబ్రరీని అన్వేషించండి.',
    searchPlaceholder: 'వీడియోల కోసం వెతకండి...',
    watchYoutube: 'YouTube లో చూడండి',
    noVideoTitle: 'వీడియోలు ఏవీ కనుగొనబడలేదు',
    noVideoSubtitle: 'దయచేసి వేరే శోధన లేదా ఫిల్టర్‌ని ప్రయత్నించండి.',
    categories: {
      'all': 'అన్ని వీడియోలు',
      'How to grow crops': 'పంట సాగు',
      'Market price fluctuation': 'మార్కెట్ సమాచారం',
      'Stubble management': 'మొండి పక్కల నిర్వహణ',
      'Disease prevention': 'వ్యాధి నివారణ'
    }
  },
  kn: {
    title: 'ಲರ್ನಿಂಗ್ ಪೋರ್ಟಲ್',
    subtitle: 'ನಿಮ್ಮ ಕೃಷಿ ಪರಿಣತಿಯನ್ನು ಹೆಚ್ಚಿಸಲು ನಮ್ಮ ವೀಡಿಯೊ ಲೈಬ್ರರಿಯನ್ನು ಅನ್ವೇಷಿಸಿ.',
    searchPlaceholder: 'ವೀಡಿಯೊಗಳನ್ನು ಹುಡುಕಿ...',
    watchYoutube: 'YouTube ನಲ್ಲಿ ನೋಡಿ',
    noVideoTitle: 'ಯಾವುದೇ ವೀಡಿಯೊಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    noVideoSubtitle: 'ದಯವಿಟ್ಟು ಬೇರೆ ಹುಡುಕಾಟ ಅಥವಾ ಫಿಲ್ಟರ್ ಅನ್ನು ಪ್ರಯತ್ನಿಸಿ.',
    categories: {
      'all': 'ಎಲ್ಲಾ ವೀಡಿಯೊಗಳು',
      'How to grow crops': 'ಬೆಳೆ ಬೆಳೆಯುವುದು',
      'Market price fluctuation': 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ',
      'Stubble management': 'ಕಸ ನಿರ್ವಹಣೆ',
      'Disease prevention': 'ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ'
    }
  }
}

export default function LearningPortal() {
  const { state } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

  const filteredVideos = videoData.filter(video => {
    const query = searchQuery.toLowerCase().trim()
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    const matchesSearch = video.title.toLowerCase().includes(query) || 
                          video.category.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <div className="mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold font-display text-stone-800 dark:text-stone-100 tracking-tight">
            {t.title}
          </h1>
        </motion.div>
        <p className="text-stone-500 dark:text-stone-400">
          {t.subtitle}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1C1C1E] border border-stone-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-stone-800 dark:text-stone-100"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white dark:bg-[#1C1C1E] border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400 hover:border-emerald-500/50'
              }`}
            >
              {cat.id === 'all' && <BookOpen className="w-4 h-4" />}
              {cat.id === 'How to grow crops' && <Sprout className="w-4 h-4" />}
              {cat.id === 'Market price fluctuation' && <TrendingUp className="w-4 h-4" />}
              {cat.id === 'Stubble management' && <Recycle className="w-4 h-4" />}
              {cat.id === 'Disease prevention' && <ShieldCheck className="w-4 h-4" />}
              <span className="text-sm font-medium">{t.categories[cat.id as keyof typeof t.categories] || cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredVideos.map((video) => (
          <motion.div
            key={video.videoId}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-[#1C1C1E] rounded-[1.5rem] border border-stone-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            {/* Thumbnail Placeholder / Container */}
            <div className="relative aspect-video bg-stone-100 dark:bg-stone-800 cursor-pointer overflow-hidden"
                 onClick={() => setActiveVideo(video.videoId)}>
              <img 
                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} 
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 dark:bg-emerald-600/90 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-6 h-6 text-emerald-600 dark:text-white fill-current" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-[10px] font-bold text-white flex items-center gap-1">
                <Clock className="w-3 h-3" /> {video.duration}
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {t.categories[video.category as keyof typeof t.categories] || video.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100 line-clamp-2 mb-4 h-10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-600 transition-colors"
                >
                  <Youtube className="w-4 h-4" /> {t.watchYoutube}
                </button>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button 
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                onClick={() => setActiveVideo(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-stone-300" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-1">
            {t.noVideoTitle}
          </h3>
          <p className="text-stone-500 dark:text-stone-400">
            {t.noVideoSubtitle}
          </p>
        </div>
      )}
    </div>
  )
}
