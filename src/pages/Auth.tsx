import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  UserCircle2,
  AlertCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { dispatch } = useApp()
  const navigate = useNavigate()

  const handleGuestLogin = () => {
    dispatch({ type: 'SET_USERNAME', payload: 'Guest Farmer' })
    navigate('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
    const body = isLogin ? { email, password } : { name, email, password }

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Success
      localStorage.setItem('agrisage_token', data.token)
      dispatch({ type: 'SET_USERNAME', payload: data.user.name })
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-earth-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-harvest-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white mb-4 p-2 shadow-2xl flex items-center justify-center">
            <img src="/logo.png" alt="AgriSage Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Agri<span className="text-sage-400">Sage</span></h1>
          <p className="text-earth-400 text-sm mt-1 uppercase tracking-widest font-bold">Agricultural Operating System</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card relative overflow-hidden !p-8"
        >
          {/* Tabs */}
          <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isLogin ? 'bg-sage-500 text-white shadow-lg shadow-sage-500/25' : 'text-earth-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isLogin ? 'bg-sage-500 text-white shadow-lg shadow-sage-500/25' : 'text-earth-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-earth-300 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-sage-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-300 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrisage.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-sage-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-300 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-sage-500/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-sage-500 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-sage-500/20 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0c0c0c] px-4 text-earth-500 font-bold">Or continue as</span>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            onClick={handleGuestLogin}
            className="w-full py-3 bg-white/5 border border-white/10 text-earth-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <UserCircle2 className="w-4 h-4 text-earth-400" />
            Continue as Guest
          </motion.button>
        </motion.div>

        <p className="text-center text-earth-500 text-xs mt-8 px-4 leading-relaxed">
          By continuing, you agree to AgriSage's 
          <span className="text-earth-300"> Terms of Service </span> 
          and 
          <span className="text-earth-300"> Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
