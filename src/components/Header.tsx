import { Sun, Moon, Globe, Eye, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function Header() {
  const { state, dispatch } = useApp()

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })
  }

  const toggleLanguage = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'en' ? 'hi' : 'en' })
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
            placeholder={state.language === 'en' ? 'Search crops, guides, markets...' : 'फसल, गाइड, बाज़ार खोजें...'}
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
          {/* Language Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                       bg-earth-100/50 dark:bg-earth-800/30 
                       hover:bg-sage-100 dark:hover:bg-sage-900/30
                       text-earth-600 dark:text-earth-300
                       border border-earth-200/50 dark:border-earth-700/30
                       transition-all duration-200"
            title="Toggle Language"
          >
            <Globe className="w-4 h-4" />
            <span>{state.language === 'en' ? 'EN' : 'हिं'}</span>
          </motion.button>

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
              {state.userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-earth-700 dark:text-earth-300 hidden sm:block">
              {state.userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
