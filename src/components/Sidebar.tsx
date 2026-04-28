import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ScanLine,
  Mic,
  BarChart3,
  Sprout,
  Recycle,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Leaf,
  LogOut,
  Youtube,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { 
    path: '/', icon: LayoutDashboard, 
    labels: { en: 'Dashboard', hi: 'डैशबोर्ड', pa: 'ਡੈਸ਼ਬੋਰਡ', mr: 'डॅशबोर्ड', ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' } 
  },
  { 
    path: '/scanner', icon: ScanLine, 
    labels: { en: 'Crop Scanner', hi: 'फसल स्कैनर', pa: 'ਫਸਲ ਸਕੈਨਰ', mr: 'पीक स्कॅनर', ta: 'பயிர் ஸಕೇனர்', te: 'పంట స్కానర్', kn: 'ಬೆಳೆ ಸ್ಕ್ಯಾನರ್' } 
  },
  { 
    path: '/advisor', icon: Mic, 
    labels: { en: 'AI Advisor', hi: 'AI सलाहकार', pa: 'AI ਸਲਾਹਕਾਰ', mr: 'AI सल्लागार', ta: 'AI ஆலோசகர்', te: 'AI సలహాదారు', kn: 'AI ಸಲಹೆಗಾರ' } 
  },
  { 
    path: '/market', icon: BarChart3, 
    labels: { en: 'Market Intel', hi: 'बाज़ार भाव', pa: 'ਬਾਜ਼ਾਰ ਭਾਅ', mr: 'बाजार भाव', ta: 'சந்தை தகவல்', te: 'మార్కెట్ ధరలు', kn: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ' } 
  },
  { 
    path: '/advisory', icon: Sprout, 
    labels: { en: 'Crop Advisory', hi: 'फसल सलाह', pa: 'ਫਸਲ ਸਲਾਹ', mr: 'पीक सल्ला', ta: 'பயிர் ஆலோசனை', te: 'పంట సలహా', kn: 'ಬೆಳೆ ಸಲಹೆ' } 
  },
  { 
    path: '/sustainable', icon: Recycle, 
    labels: { en: 'Sustainable', hi: 'टिकाऊ खेती', pa: 'ਸਥਿਰਤਾ', mr: 'शाश्वतता', ta: 'நிலைத்தன்மை', te: 'స్థిరత్వం', kn: 'ಸುಸ್ಥಿರತೆ' } 
  },
  { 
    path: '/library', icon: BookOpen, 
    labels: { en: 'Agri Library', hi: 'कृषि लाइब्रेरी', pa: 'ਖੇਤੀ ਲਾਇਬ੍ਰੇਰੀ', mr: 'कृषी ग्रंथालय', ta: 'விவசாய நூலகம்', te: 'వ్యవసాయ లైబ్రరీ', kn: 'ಕೃಷಿ ಲೈಬ್ರರಿ' } 
  },
  { 
    path: '/learning', icon: Youtube, 
    labels: { en: 'Learning Portal', hi: 'लर्निंग पोर्टल', pa: 'ਸਿਖਲਾਈ ਪੋਰਟਲ', mr: 'लर्निंग पोर्टल', ta: 'கற்றல் போர்டಲ್', te: 'లెర్నింగ్ పోర్టల్', kn: 'ಲರ್ನಿಂಗ್ ಪೋರ್ಟಲ್' } 
  },
  { 
    path: '/genaffnet', icon: Brain, 
    labels: { en: 'GenAffNet', hi: 'ML हब', pa: 'ML ਹੱਬ', mr: 'ML हब', ta: 'ML மையம்', te: 'ML హబ్', kn: 'ML ಹಬ್' } 
  },
]

export default function Sidebar() {
  const { state, dispatch } = useApp()
  const collapsed = state.sidebarCollapsed

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col
                 bg-[#131412] backdrop-blur-2xl
                 border-r border-earth-800/50
                 shadow-xl shadow-black/20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-earth-800/50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-md"
        >
          <img src="/logo.png" alt="AgriSage Logo" className="w-full h-full object-contain" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold font-display text-gradient">AgriSage</h1>
              <p className="text-[10px] text-earth-400 -mt-0.5 tracking-wider uppercase">Smart Farming OS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative
              ${isActive
                ? 'bg-sage-500/15 text-sage-300'
                : 'text-earth-400 hover:bg-earth-800/50 hover:text-earth-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-sage-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors cursor-pointer text-earth-400 group-hover:text-earth-200 ${isActive ? '!text-sage-400' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.labels[state.language as keyof typeof item.labels] || item.labels.en}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Auth Actions */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => {
            localStorage.removeItem('agrisage_token')
            dispatch({ type: 'LOGOUT' })
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                     text-rose-400 hover:bg-rose-500/10 hover:text-rose-500"
          title={collapsed ? (() => {
            const l = state.language
            if (l === 'hi') return 'लॉगआउट'
            if (l === 'pa') return 'ਲੌਗਆਊਟ'
            if (l === 'mr') return 'लॉगआउट'
            if (l === 'ta') return 'வெளியேறு'
            if (l === 'te') return 'లాగౌట్'
            if (l === 'kn') return 'ಲಾಗ್ಔಟ್'
            return 'Logout'
          })() : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                {(() => {
                  const l = state.language
                  if (l === 'hi') return 'लॉगआउट'
                  if (l === 'pa') return 'ਲੌਗਆਊਟ'
                  if (l === 'mr') return 'लॉगआउट'
                  if (l === 'ta') return 'வெளியேறு'
                  if (l === 'te') return 'లాగౌట్'
                  if (l === 'kn') return 'ಲಾಗ್ಔಟ್'
                  return 'Logout'
                })()}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-earth-800/30">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl 
                     text-earth-400 hover:text-earth-300 
                     hover:bg-earth-800/50 transition-all duration-200"
          title={collapsed ? (() => {
            const l = state.language
            if (l === 'hi') return 'विस्तार करें'
            if (l === 'pa') return 'ਫੈਲਾਓ'
            if (l === 'mr') return 'विस्तार करा'
            if (l === 'ta') return 'விரிவாக்கு'
            if (l === 'te') return 'విస్తరించు'
            if (l === 'kn') return 'ವಿಸ್ತರಿಸು'
            return 'Expand'
          })() : (() => {
            const l = state.language
            if (l === 'hi') return 'छोटा करें'
            if (l === 'pa') return 'ਛੋਟਾ ਕਰੋ'
            if (l === 'mr') return 'लहान करा'
            if (l === 'ta') return 'சுருக்கு'
            if (l === 'te') return 'కుదించు'
            if (l === 'kn') return 'ಕುಗ್ಗಿಸು'
            return 'Collapse'
          })()}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs"
              >
                {(() => {
                  const l = state.language
                  if (l === 'hi') return 'छोटा करें'
                  if (l === 'pa') return 'ਛੋਟਾ ਕਰੋ'
                  if (l === 'mr') return 'लहान करा'
                  if (l === 'ta') return 'சுருக்கு'
                  if (l === 'te') return 'కుదించు'
                  if (l === 'kn') return 'ಕುಗ್ಗಿಸು'
                  return 'Collapse'
                })()}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
