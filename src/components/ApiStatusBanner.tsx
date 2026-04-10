import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Wifi, WifiOff, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function ApiStatusBanner() {
  const { state } = useApp()
  const [dismissed, setDismissed] = useState(false)

  const geminiLimited = state.apiStatus.gemini !== 'active'
  const weatherLimited = state.apiStatus.weather !== 'active'
  const showBanner = (geminiLimited || weatherLimited) && !dismissed

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-harvest-500/10 dark:bg-harvest-500/5 border-b border-harvest-300/30 dark:border-harvest-700/30 px-6 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-harvest-500/20">
                  <AlertTriangle className="w-4 h-4 text-harvest-600 dark:text-harvest-400" />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {geminiLimited && (
                    <div className="flex items-center gap-1.5">
                      {state.apiStatus.gemini === 'offline' ? (
                        <WifiOff className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Wifi className="w-3.5 h-3.5 text-harvest-500" />
                      )}
                      <span className="text-harvest-700 dark:text-harvest-300">
                        Gemini AI: {state.apiStatus.gemini === 'offline' ? 'Offline' : 'Quota Limited'}
                      </span>
                    </div>
                  )}
                  {weatherLimited && (
                    <div className="flex items-center gap-1.5">
                      {state.apiStatus.weather === 'offline' ? (
                        <WifiOff className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Wifi className="w-3.5 h-3.5 text-harvest-500" />
                      )}
                      <span className="text-harvest-700 dark:text-harvest-300">
                        Weather: {state.apiStatus.weather === 'offline' ? 'Offline' : 'Quota Limited'}
                      </span>
                    </div>
                  )}
                  <span className="text-earth-500 dark:text-earth-400 text-xs">
                    — Using High-Accuracy Regional Estimates
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="p-1 rounded-lg hover:bg-harvest-500/10 text-earth-400 hover:text-earth-600 dark:hover:text-earth-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
