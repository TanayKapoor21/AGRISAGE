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
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', labelHi: 'डैशबोर्ड', shortLabel: 'Home' },
  { path: '/scanner', icon: ScanLine, label: 'Crop Scanner', labelHi: 'फसल स्कैनर', shortLabel: 'Scan' },
  { path: '/advisor', icon: Mic, label: 'AI Advisor', labelHi: 'AI सलाहकार', shortLabel: 'Ask AI' },
  { path: '/market', icon: BarChart3, label: 'Market Intel', labelHi: 'बाज़ार की जानकारी', shortLabel: 'Market' },
  { path: '/advisory', icon: Sprout, label: 'Crop Advisory', labelHi: 'फसल सलाहकार', shortLabel: 'Advise' },
  { path: '/sustainable', icon: Recycle, label: 'Sustainable', labelHi: 'टिकाऊ खेती', shortLabel: 'Green' },
  { path: '/library', icon: BookOpen, label: 'Agri Library', labelHi: 'कृषि पुस्तकालय', shortLabel: 'Library' },
  { path: '/learning', icon: Youtube, label: 'Learning Portal', labelHi: 'लर्निंग पोर्टल', shortLabel: 'Videos' },
  { path: '/genaffnet', icon: Brain, label: 'GenAffNet', labelHi: 'ML हब', shortLabel: 'ML Hub' },
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
                      {state.language === 'hi' ? item.labelHi : item.label}
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
          title={collapsed ? (state.language === 'hi' ? 'लॉगआउट' : 'Logout') : ''}
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
                {state.language === 'hi' ? 'लॉगआउट' : 'Logout'}
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
          title={collapsed ? (state.language === 'hi' ? 'विस्तार करें' : 'Expand') : (state.language === 'hi' ? 'छोटा करें' : 'Collapse')}
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
                {state.language === 'hi' ? 'छोटा करें' : 'Collapse'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
