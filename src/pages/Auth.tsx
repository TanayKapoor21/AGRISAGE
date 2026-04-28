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

const translations = {
  hi: {
    login: 'लॉगिन',
    signup: 'साइन अप',
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    signIn: 'साइन इन करें',
    createAccount: 'खाता बनाएँ',
    orContinue: 'या इसके रूप में जारी रखें',
    guest: 'अतिथि के रूप में जारी रखें',
    agreement: 'जारी रखकर, आप AgriSage की सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।',
    errorTitle: 'त्रुटि',
    subtitle: 'कृषि ऑपरेटिंग सिस्टम'
  },
  en: {
    login: 'Login',
    signup: 'Sign Up',
    fullName: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    orContinue: 'Or continue as',
    guest: 'Continue as Guest',
    agreement: "By continuing, you agree to AgriSage's Terms of Service and Privacy Policy.",
    errorTitle: 'Error',
    subtitle: 'Agricultural Operating System'
  },
  pa: { login: 'ਲੌਗਇਨ', signup: 'ਸਾਈਨ ਅੱਪ', fullName: 'ਪੂਰਾ ਨਾਮ', email: 'ਈਮੇਲ ਪਤਾ', password: 'ਪਾਸਵਰਡ', signIn: 'ਸਾਈਨ ਇਨ ਕਰੋ', createAccount: 'ਖਾਤਾ ਬਣਾਓ', orContinue: 'ਜਾਂ ਇਸ ਤਰ੍ਹਾਂ ਜਾਰੀ ਰੱਖੋ', guest: 'ਮਹਿਮਾਨ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ', agreement: "ਜਾਰੀ ਰੱਖ ਕੇ, ਤੁਸੀਂ AgriSage ਦੀਆਂ ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ ਅਤੇ ਗੋਪਨੀਯਤਾ ਨੀਤੀ ਨਾਲ ਸਹਿਮਤ ਹੁੰਦੇ ਹੋ।", errorTitle: 'ਗਲਤੀ', subtitle: 'ਖੇਤੀਬਾੜੀ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ' },
  mr: { login: 'लॉगिन', signup: 'साइन अप', fullName: 'पूर्ण नाव', email: 'ईमेल पत्ता', password: 'पासवर्ड', signIn: 'साइन इन करा', createAccount: 'खाते तयार करा', orContinue: 'किंवा याद्वारे सुरू ठेवा', guest: 'अतिथी म्हणून सुरू ठेवा', agreement: "सुरू ठेवून, आपण AgriSage च्या सेवा अटी आणि गोपनीयता धोरणाशी सहमत आहात.", errorTitle: 'त्रुटी', subtitle: 'कृषी ऑपरेटिंग सिस्टम' },
  ta: { login: 'உள்நுழை', signup: 'பதிவுபெறு', fullName: 'முழு பெயர்', email: 'மின்னஞ்சல் முகவரி', password: 'கடவுச்சொல்', signIn: 'உள்நுழைக', createAccount: 'கணக்கை உருவாக்கு', orContinue: 'அல்லது தொடரவும்', guest: 'விருந்தினராக தொடரவும்', agreement: "தொடர்வதன் மூலம், AgriSage இன் சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறீர்கள்.", errorTitle: 'பிழை', subtitle: 'விவசாய இயக்க முறைமை' },
  te: { login: 'లాగిన్', signup: 'సైన్ అప్', fullName: 'పూర్తి పేరు', email: 'ఈమెయిల్ చిరునామా', password: 'పాస్‌వర్డ్', signIn: 'సైన్ ఇన్ చేయండి', createAccount: 'ఖాతాను సృష్టించండి', orContinue: 'లేదా ఇలా కొనసాగించండి', guest: 'అతిథిగా కొనసాగండి', agreement: "కొనసాగించడం ద్వారా, మీరు AgriSage సేవా నిబంధనలు మరియు గోప్యతా విధానానికి అంగీకరిస్తున్నారు.", errorTitle: 'లోపం', subtitle: 'వ్యవసాయ ఆపరేటింగ్ సిస్టమ్' },
  kn: { login: 'ಲಾಗಿನ್', signup: 'ಸೈನ್ ಅಪ್', fullName: 'ಪೂರ್ಣ ಹೆಸರು', email: 'ಇಮೇಲ್ ವಿಳಾಸ', password: 'ಪಾಸ್‌ವರ್ಡ್', signIn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ', createAccount: 'ಖಾತೆಯನ್ನು ರಚಿಸಿ', orContinue: 'ಅಥವಾ ಹೀಗೆ ಮುಂದುವರಿಯಿರಿ', guest: 'ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಯಿರಿ', agreement: "ಮುಂದುವರಿಯುವ ಮೂಲಕ, ನೀವು AgriSage ನ ಸೇವಾ ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ಒಪ್ಪುತ್ತೀರಿ.", errorTitle: 'ದೋಷ', subtitle: 'ಕೃಷಿ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್' }
}

export default function Auth() {
  const { state, dispatch } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleGuestLogin = () => {
    dispatch({ type: 'SET_USERNAME', payload: 'Guest Farmer' })
    navigate('/')
  }

  const toggleLanguage = () => {
    const langs = ['en', 'hi', 'pa', 'mr', 'ta', 'te', 'kn']
    const nextIndex = (langs.indexOf(state.language) + 1) % langs.length
    dispatch({ type: 'SET_LANGUAGE', payload: langs[nextIndex] as any })
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
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={toggleLanguage}
          className="px-4 py-2 rounded-full glass border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
        >
          {state.language.toUpperCase()}
        </button>
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-harvest-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
      
      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white mb-4 p-2 shadow-2xl flex items-center justify-center">
            <img src="/logo.png" alt="AgriSage Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Agri<span className="text-sage-400">Sage</span></h1>
          <p className="text-earth-400 text-sm mt-1 uppercase tracking-widest font-bold">{t.subtitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card relative overflow-hidden !p-8">
          <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isLogin ? 'bg-sage-500 text-white shadow-lg shadow-sage-500/25' : 'text-earth-400 hover:text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isLogin ? 'bg-sage-500 text-white shadow-lg shadow-sage-500/25' : 'text-earth-400 hover:text-white'
              }`}
            >
              {t.signup}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <label className="text-xs font-bold text-earth-300 uppercase tracking-wider ml-1">{t.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-sage-500/50 transition-all" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-300 uppercase tracking-wider ml-1">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="farmer@agrisage.com" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-sage-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-300 uppercase tracking-wider ml-1">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-sage-500/50 transition-all" />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-sage-500 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-sage-500/20 disabled:opacity-50 mt-6">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isLogin ? t.signIn : t.createAccount} <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0c0c0c] px-4 text-earth-500 font-bold">{t.orContinue}</span></div>
          </div>

          <motion.button whileHover={{ y: -2 }} onClick={handleGuestLogin} className="w-full py-3 bg-white/5 border border-white/10 text-earth-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <UserCircle2 className="w-4 h-4 text-earth-400" />
            {t.guest}
          </motion.button>
        </motion.div>

        <p className="text-center text-earth-500 text-xs mt-8 px-4 leading-relaxed">{t.agreement}</p>
      </div>
    </div>
  )
}
