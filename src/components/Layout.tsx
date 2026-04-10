import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import ApiStatusBanner from './ApiStatusBanner'
import { useApp } from '../context/AppContext'

export default function Layout() {
  const { state } = useApp()
  const collapsed = state.sidebarCollapsed

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-earth-950 bg-hero-pattern dark:bg-none">
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen flex flex-col"
      >
        <Header />
        <ApiStatusBanner />
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="page-container"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-earth-200/30 dark:border-earth-800/30 text-center text-xs text-earth-400 dark:text-earth-600">
          AgriSage v1.0 — AI-Powered Agricultural Operating System &copy; {new Date().getFullYear()}
        </footer>
      </motion.div>
    </div>
  )
}
