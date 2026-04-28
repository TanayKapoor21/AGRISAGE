import { Sun, Moon, Globe, Eye, Search, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const availableLocations = [
  'Karnal, Haryana',
  'Ludhiana, Punjab',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Indore, MP'
]

export default function Header() {
  const { state, dispatch } = useApp()

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })
  }

  const changeLanguage = (lang: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang as any })
  }

  const toggleHighContrast = () => {
    dispatch({ type: 'TOGGLE_HIGH_CONTRAST' })
  }

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-earth-200/30 dark:border-earth-800/30">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="text"
            placeholder={(() => {
              const l = state.language
              if (l === 'hi') return 'फसल, गाइड, बाज़ार खोजें...'
              if (l === 'pa') return 'ਫਸਲਾਂ, ਗਾਈਡਾਂ, ਬਾਜ਼ਾਰਾਂ ਦੀ ਖੋਜ ਕਰੋ...'
              if (l === 'mr') return 'पिके, मार्गदर्शक, बाजार शोधा...'
              if (l === 'ta') return 'பயிர்கள், வழிகாட்டிகள், சந்தைகளைத் தேடுங்கள்...'
              if (l === 'te') return 'పంటలు, మార్గదర్శకాలు, మార్కెట్‌ల కోసం వెతకండి...'
              if (l === 'kn') return 'ಬೆಳೆಗಳು, ಮಾರ್ಗದರ್ಶಿಗಳು, ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಹುಡುಕಿ...'
              return 'Search crops, guides, markets...'
            })()}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm
                       bg-earth-100/50 dark:bg-earth-800/30 
                       border border-earth-200/50 dark:border-earth-700/30
                       focus:border-sage-500/50 focus:ring-1 focus:ring-sage-500/20
                       outline-none transition-all duration-300
                       placeholder:text-earth-400 dark:placeholder:text-earth-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Location Selector */}
          <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-xl bg-earth-100/50 dark:bg-earth-800/30 border border-earth-200/50 dark:border-earth-700/30">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <div className="relative">
              <select 
                value={state.currentLocation}
                onChange={(e) => dispatch({ type: 'SET_LOCATION', payload: e.target.value })}
                className="bg-transparent text-sm font-medium text-earth-800 dark:text-earth-100 focus:outline-none cursor-pointer appearance-none pr-5"
              >
                {availableLocations.map(loc => <option key={loc} value={loc} className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">{loc}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-earth-400">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-earth-100/50 dark:bg-earth-800/30 border border-earth-200/50 dark:border-earth-700/30">
            <Globe className="w-4 h-4 text-earth-600 dark:text-earth-400" />
            <div className="relative">
              <select 
                value={state.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-earth-800 dark:text-earth-100 focus:outline-none cursor-pointer appearance-none pr-5 uppercase"
              >
                <option value="en" className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">EN</option>
                <option value="hi" className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">HI</option>
                <option value="pa" className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">PA</option>
                <option value="mr" className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">MR</option>
                <option value="ta" className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">TA</option>
                <option value="te" className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">TE</option>
                <option value="kn" className="text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900">KN</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-earth-400">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* High Contrast */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleHighContrast}
            className={`p-2 rounded-xl transition-all duration-200 border
              ${state.highContrast 
                ? 'bg-sage-100 dark:bg-sage-900/30 border-sage-300 dark:border-sage-700 text-sage-700 dark:text-sage-300' 
                : 'bg-earth-100/50 dark:bg-earth-800/30 border-earth-200/50 dark:border-earth-700/30 text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
              }`}
            title="Toggle High Contrast"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-earth-100/50 dark:bg-earth-800/30 
                       hover:bg-harvest-100 dark:hover:bg-harvest-900/30
                       text-earth-500 dark:text-earth-400 hover:text-harvest-600 dark:hover:text-harvest-400
                       border border-earth-200/50 dark:border-earth-700/30
                       transition-all duration-200"
            title="Toggle Theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: state.theme === 'dark' ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {state.theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </motion.div>
          </motion.button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-earth-200/50 dark:border-earth-700/30">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-sage-500/25">
              {state.userName ? state.userName.charAt(0).toUpperCase() : 'G'}
            </div>
            <span className="text-sm font-medium text-earth-700 dark:text-earth-300 hidden sm:block">
              {state.userName || (() => {
                const l = state.language
                if (l === 'hi') return 'अतिथि'
                if (l === 'pa') return 'ਮਹਿਮਾਨ'
                if (l === 'mr') return 'अतिथी'
                if (l === 'ta') return 'விருந்தினர்'
                if (l === 'te') return 'అతిథి'
                if (l === 'kn') return 'ಅತಿಥಿ'
                return 'Guest'
              })()}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
