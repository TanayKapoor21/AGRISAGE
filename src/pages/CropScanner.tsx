import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Upload, ScanLine, Leaf, FlaskConical, Sprout,
  ShieldCheck, ShieldAlert, ShieldX, RefreshCw, Sparkles, X,
} from 'lucide-react'
import { analyzeCropImage } from '../services/gemini'
import { incrementStat, addActivity } from '../services/db'
import { useApp } from '../context/AppContext'
import type { ScanResult } from '../types'

const translations = {
  hi: {
    title: 'स्मार्ट फसल स्कैनर',
    subtitle: 'AI-संचालित दृष्टि से अपनी फसलों की पहचान और स्वास्थ्य जांच करें',
    captureTitle: 'फसल की छवि कैप्चर करें',
    captureSubtitle: 'AI विश्लेषण के लिए कैमरा से फोटो लें या गैलरी से अपलोड करें',
    camera: 'कैमरा',
    upload: 'अपलोड',
    analyze: 'AI विश्लेषण शुरू करें',
    analyzing: 'AI विश्लेषण कर रहा है...',
    growthStage: 'विकास चरण',
    healthStatus: 'स्वास्थ्य स्थिति',
    soilSuitability: 'मिट्टी उपयुक्तता',
    recommendations: 'सिफारिशें',
    noAnalysis: 'अभी तक कोई विश्लेषण नहीं',
    noAnalysisSubtitle: 'AI-संचालित फसल पहचान और निदान के लिए फोटो कैप्चर या अपलोड करें',
    phRange: 'pH सीमा',
    soilType: 'मिट्टी का प्रकार',
    nutrients: 'पोषक तत्व',
    match: 'मैच',
    health: {
      healthy: 'स्वस्थ',
      mild_issue: 'मामूली समस्या',
      severe_issue: 'गंभीर समस्या'
    },
    activityTitle: 'फसल स्कैन',
    activityHealthy: 'स्वस्थ',
    activityIssue: 'समस्या मिली'
  },
  en: {
    title: 'Smart Crop Scanner',
    subtitle: 'Identify crops and diagnose health issues with AI-powered computer vision',
    captureTitle: 'Capture Crop Image',
    captureSubtitle: 'Take a photo with camera or upload from gallery for AI analysis',
    camera: 'Camera',
    upload: 'Upload',
    analyze: 'Analyze with AI',
    analyzing: 'AI is analyzing your crop...',
    growthStage: 'Growth Stage',
    healthStatus: 'Health Status',
    soilSuitability: 'Soil Suitability',
    recommendations: 'Recommendations',
    noAnalysis: 'No Analysis Yet',
    noAnalysisSubtitle: 'Capture or upload a crop image to get AI-powered identification and health diagnosis',
    phRange: 'pH Range',
    soilType: 'Soil Type',
    nutrients: 'Nutrients',
    match: 'match',
    health: {
      healthy: 'Healthy',
      mild_issue: 'Mild Issue',
      severe_issue: 'Severe Issue'
    },
    activityTitle: 'Crop Scanned',
    activityHealthy: 'Healthy',
    activityIssue: 'Issue detected'
  },
  pa: {
    title: 'ਸਮਾਰਟ ਫਸਲ ਸਕੈਨਰ',
    subtitle: 'AI-ਪਾਵਰਡ ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਨਾਲ ਫਸਲਾਂ ਦੀ ਪਛਾਣ ਕਰੋ ਅਤੇ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਦਾ ਨਿਦਾਨ ਕਰੋ',
    captureTitle: 'ਫਸਲ ਦੀ ਤਸਵੀਰ ਖਿੱਚੋ',
    captureSubtitle: 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਕੈਮਰੇ ਨਾਲ ਫੋਟੋ ਲਓ ਜਾਂ ਗੈਲਰੀ ਤੋਂ ਅਪਲੋਡ ਕਰੋ',
    camera: 'ਕੈਮਰਾ',
    upload: 'ਅਪਲੋਡ',
    analyze: 'AI ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    analyzing: 'AI ਤੁਹਾਡੀ ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...',
    growthStage: 'ਵਾਧੇ ਦਾ ਪੜਾਅ',
    healthStatus: 'ਸਿਹਤ ਦੀ ਸਥਿਤੀ',
    soilSuitability: 'ਮਿੱਟੀ ਦੀ ਅਨੁਕੂਲਤਾ',
    recommendations: 'ਸਿਫਾਰਸ਼ਾਂ',
    noAnalysis: 'ਅਜੇ ਕੋਈ ਵਿਸ਼ਲੇਸ਼ਣ ਨਹੀਂ',
    noAnalysisSubtitle: 'AI-ਪਾਵਰਡ ਪਛਾਣ ਅਤੇ ਸਿਹਤ ਨਿਦਾਨ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਫਸਲ ਦੀ ਤਸਵੀਰ ਲਓ ਜਾਂ ਅਪਲੋਡ ਕਰੋ',
    phRange: 'pH ਰੇਂਜ',
    soilType: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
    nutrients: 'ਪੋਸ਼ਕ ਤੱਤ',
    match: 'ਮੈਚ',
    health: { healthy: 'ਸਿਹਤਮੰਦ', mild_issue: 'ਹਲਕੀ ਸਮੱਸਿਆ', severe_issue: 'ਗੰਭੀਰ ਸਮੱਸਿਆ' },
    activityTitle: 'ਫਸਲ ਸਕੈਨ ਕੀਤੀ',
    activityHealthy: 'ਸਿਹਤਮੰਦ',
    activityIssue: 'ਸਮੱਸਿਆ ਮਿਲੀ'
  },
  mr: {
    title: 'स्मार्ट पीक स्कॅनर',
    subtitle: 'AI-आधारित संगणक दृष्टीसह पिके ओळखा आणि आरोग्य समस्यांचे निदान करा',
    captureTitle: 'पिकाचा फोटो घ्या',
    captureSubtitle: 'AI विश्लेषणासाठी कॅमेऱ्याने फोटो घ्या किंवा गॅलरीतून अपलोड करा',
    camera: 'कॅमेरा',
    upload: 'अपलोड',
    analyze: 'AI सह विश्लेषण करा',
    analyzing: 'AI तुमच्या पिकाचे विश्लेषण करत आहे...',
    growthStage: 'वाढीचा टप्पा',
    healthStatus: 'आरोग्य स्थिती',
    soilSuitability: 'मातीची उपयुक्तता',
    recommendations: 'शिफारसी',
    noAnalysis: 'अद्याಪ विश्लेषण नाही',
    noAnalysisSubtitle: 'AI-आधारित ओळख आणि आरोग्य निदान मिळवण्यासाठी पिकाचा फोटो घ्या किंवा अपलोड करा',
    phRange: 'pH श्रेणी',
    soilType: 'मातीचा प्रकार',
    nutrients: 'पोषक तत्वे',
    match: 'साम्य',
    health: { healthy: 'निरोगी', mild_issue: 'सौम्य समस्या', severe_issue: 'गंभीर समस्या' },
    activityTitle: 'पीक स्कॅन केले',
    activityHealthy: 'निरोगी',
    activityIssue: 'समस्या आढळली'
  },
  ta: {
    title: 'ஸ்மார்ட் பயிர் ஸ்கேனர்',
    subtitle: 'AI-இயங்கும் கணினி பார்வை மூலம் பயிர்களை அடையாளம் கண்டு ஆரோக்கிய சிக்கல்களைக் கண்டறியவும்',
    captureTitle: 'பயிர் படத்தை எடுக்கவும்',
    captureSubtitle: 'AI பகுப்பாய்விற்கு கேமரா மூலம் புகைப்படம் எடுக்கவும் அல்லது கேலரியில் இருந்து பதிவேற்றவும்',
    camera: 'கேமரா',
    upload: 'பதிவேற்று',
    analyze: 'AI மூலம் பகுப்பாய்வு செய்',
    analyzing: 'AI உங்கள் பயிரை பகுப்பாய்வு செய்கிறது...',
    growthStage: 'வளர்ச்சி நிலை',
    healthStatus: 'ஆரோக்கிய நிலை',
    soilSuitability: 'மண் பொருத்தம்',
    recommendations: 'பரிந்துரைகள்',
    noAnalysis: 'இன்னும் பகுப்பாய்வு இல்லை',
    noAnalysisSubtitle: 'AI-இயங்கும் அடையாளம் மற்றும் ஆரோக்கிய நோயறிதலைப் பெற பயிர் படத்தை எடுக்கவும் அல்லது பதிவேற்றவும்',
    phRange: 'pH வரம்பு',
    soilType: 'மண் வகை',
    nutrients: 'ஊட்டச்சத்துக்கள்',
    match: 'பொருத்தம்',
    health: { healthy: 'ஆரோக்கியமானது', mild_issue: 'லேசான சிக்கல்', severe_issue: 'கடுமையான சிக்கல்' },
    activityTitle: 'பயிர் ஸ்கேன் செய்யப்பட்டது',
    activityHealthy: 'ஆரோக்கியமானது',
    activityIssue: 'சிக்கல் கண்டறியப்பட்டது'
  },
  te: {
    title: 'స్మార్ట్ పంట స్కానర్',
    subtitle: 'AI-ఆధారిత కంప్యూటర్ విజన్‌తో పంటలను గుర్తించండి మరియు ఆరోగ్య సమస్యలను నిర్ధారించండి',
    captureTitle: 'పంట చిత్రాన్ని తీయండి',
    captureSubtitle: 'AI విశ్లేషణ కోసం కెమెరాతో ఫోటో తీయండి లేదా గ్యాలరీ నుండి అప్‌లోడ్ చేయండి',
    camera: 'కెమెరా',
    upload: 'అప్‌లోడ్',
    analyze: 'AIతో విశ్లెషించండి',
    analyzing: 'AI మీ పంటను విశ్లేషిస్తోంది...',
    growthStage: 'పెరుగుదల దశ',
    healthStatus: 'ఆరోగ్య స్థితి',
    soilSuitability: 'నేల అనుకూలత',
    recommendations: 'సిఫార్సులు',
    noAnalysis: 'ఇంకా విశ్లేషణ లేదు',
    noAnalysisSubtitle: 'AI-ఆధారిత గుర్తింపు మరియు ఆరోగ్య నిర్ధారణను పొందడానికి పంట చిత్రాన్ని తీయండి లేదా అప్‌లోడ్ చేయండి',
    phRange: 'pH పరిధి',
    soilType: 'నేల రకం',
    nutrients: 'పోషకాలు',
    match: 'పోలిక',
    health: { healthy: 'ఆరోగ్యకరమైనది', mild_issue: 'చిన్న సమస్య', severe_issue: 'తీవ్రమైన సమస్య' },
    activityTitle: 'పంట స్కాన్ చేయబడింది',
    activityHealthy: 'ఆరోగ్యకరమైనది',
    activityIssue: 'సమస్య గుర్తించబడింది'
  },
  kn: {
    title: 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಸ್ಕ್ಯಾನರ್',
    subtitle: 'AI-ಚಾಲಿತ ಕಂಪ್ಯೂಟರ್ ದೃಷ್ಟಿಯೊಂದಿಗೆ ಬೆಳೆಗಳನ್ನು ಗುರುತಿಸಿ ಮತ್ತು ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ',
    captureTitle: 'ಬೆಳೆ ಚಿತ್ರವನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ',
    captureSubtitle: 'AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    camera: 'ಕ್ಯಾಮೆರಾ',
    upload: 'ಅಪ್‌ಲೋಡ್',
    analyze: 'AI ನೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ',
    analyzing: 'AI ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
    growthStage: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
    healthStatus: 'ಆರೋಗ್ಯ ಸ್ಥಿತಿ',
    soilSuitability: 'ಮಣ್ಣಿನ ಸೂಕ್ತತೆ',
    recommendations: 'ಶಿಫಾರಸುಗಳು',
    noAnalysis: 'ಇನ್ನೂ ಯಾವುದೇ ವಿಶ್ಲೇಷಣೆ ಇಲ್ಲ',
    noAnalysisSubtitle: 'AI-ಚಾಲಿತ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಆರೋಗ್ಯ ತಪಾಸಣೆ ಪಡೆಯಲು ಬೆಳೆ ಚಿತ್ರವನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    phRange: 'pH ಶ್ರೇಣಿ',
    soilType: 'ಮಣ್ಣಿನ ವಿಧ',
    nutrients: 'ಪೋಷಕಾಂಶಗಳು',
    match: 'ಹೊಂದಾಣಿಕೆ',
    health: { healthy: 'ಆರೋೕಗ್ಯಕರ', mild_issue: 'ಸೌಮ್ಯ ಸಮಸ್ಯೆ', severe_issue: 'ತೀವ್ರ ಸಮಸ್ಯೆ' },
    activityTitle: 'ಬೆಳೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗಿದೆ',
    activityHealthy: 'ಆರೋೕಗ್ಯಕರ',
    activityIssue: 'ಸಮಸ್ಯೆ ಪತ್ತೆಯಾಗಿದೆ'
  }
}

export default function CropScanner() {
  const { state } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

  const [image, setImage] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string>('')
  const [mimeType, setMimeType] = useState<string>('image/jpeg')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMimeType(file.type)
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImage(dataUrl)
      setImageBase64(dataUrl.split(',')[1])
      setResult(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch (error) {
      console.error('Camera error:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setImage(dataUrl)
    setImageBase64(dataUrl.split(',')[1])
    setMimeType('image/jpeg')
    setResult(null)
    stopCamera()
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }, [])

  const analyzeImage = useCallback(async () => {
    if (!imageBase64) return
    setLoading(true)
    try {
      const scanResult = await analyzeCropImage(imageBase64, mimeType)
      setResult(scanResult)
      incrementStat('totalScans')
      addActivity({ 
        type: 'scan', 
        title: `${t.activityTitle}: ${scanResult.cropName}`, 
        description: `${scanResult.healthStatus === 'healthy' ? t.activityHealthy : t.activityIssue} — ${Math.round(scanResult.confidence * 100)}% ${t.match}` 
      })
    } finally {
      setLoading(false)
    }
  }, [imageBase64, mimeType])

  const reset = () => {
    setImage(null)
    setImageBase64('')
    setResult(null)
    stopCamera()
  }

  const healthConfig = {
    healthy: { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    mild_issue: { icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    severe_issue: { icon: ShieldX, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="page-title flex items-center gap-3">
          <ScanLine className="w-8 h-8 text-sage-500" />
          {t.title}
        </h1>
        <p className="page-subtitle">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-4">
          <motion.div layout className="glass-card !p-0 overflow-hidden text-center">
            {cameraActive ? (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 border-2 border-sage-500/50 rounded-t-2xl pointer-events-none">
                  <div className="absolute inset-8 border border-sage-400/30 rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-sage-400 rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-sage-400 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-sage-400 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-sage-400 rounded-br" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-sage-500">
                    <div className="w-12 h-12 rounded-full bg-sage-500" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={stopCamera} className="w-12 h-12 rounded-full bg-red-500/80 backdrop-blur flex items-center justify-center shadow-lg self-end">
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            ) : image ? (
              <div className="relative">
                <img src={image} alt="Scanned crop" className="w-full aspect-video object-cover" />
                <button onClick={reset} className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-10">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center shadow-lg shadow-sage-500/30">
                  <ScanLine className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold font-display text-earth-800 dark:text-earth-200 mb-2">{t.captureTitle}</h3>
                <p className="text-sm text-earth-400 mb-6 max-w-xs mx-auto">{t.captureSubtitle}</p>
                <div className="flex gap-3 justify-center">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={startCamera} className="btn-primary flex items-center gap-2">
                    <Camera className="w-4 h-4" /> {t.camera}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current?.click()} className="btn-secondary flex items-center gap-2">
                    <Upload className="w-4 h-4" /> {t.upload}
                  </motion.button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            )}

            {image && !loading && (
              <div className="p-4 border-t border-earth-200/30 dark:border-earth-700/30">
                <motion.button whileTap={{ scale: 0.97 }} onClick={analyzeImage} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> {t.analyze}
                </motion.button>
              </div>
            )}

            {loading && (
              <div className="p-8 text-center border-t border-earth-200/30 dark:border-earth-700/30 font-medium">
                <RefreshCw className="w-8 h-8 mx-auto text-sage-500 animate-spin mb-3" />
                <p className="text-sm text-earth-500">{t.analyzing}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Results Panel */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-4">
              <div className="glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-display text-earth-800 dark:text-white">{result.cropName}</h3>
                    <p className="text-sm text-earth-400 italic">{result.scientificName}</p>
                  </div>
                  <div className="badge-success">{Math.round(result.confidence * 100)}% {t.match}</div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                  <Sprout className="w-5 h-5 text-sage-500" />
                  <div>
                    <p className="text-xs text-earth-400">{t.growthStage}</p>
                    <p className="text-sm font-semibold text-earth-700 dark:text-earth-300 capitalize">{result.growthStage}</p>
                  </div>
                </div>
              </div>

              {(() => {
                const h = healthConfig[result.healthStatus]
                const label = t.health[result.healthStatus]
                return (
                  <div className={`glass-card border ${h.border}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <h.icon className={`w-5 h-5 ${h.color}`} />
                      <h4 className="font-bold font-display text-earth-800 dark:text-earth-200">
                        {t.healthStatus}: <span className={h.color}>{label}</span>
                      </h4>
                    </div>
                    <p className="text-sm text-earth-600 dark:text-earth-400 leading-relaxed">{result.healthDetails}</p>
                  </div>
                )
              })()}

              <div className="glass-card">
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="w-5 h-5 text-violet-500" />
                  <h4 className="font-bold font-display text-earth-800 dark:text-earth-200">{t.soilSuitability}</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                    <p className="text-xs text-earth-400 mb-1">{t.phRange}</p>
                    <p className="text-sm font-bold text-earth-700 dark:text-earth-300">{result.soilSuitability.ph}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                    <p className="text-xs text-earth-400 mb-1">{t.soilType}</p>
                    <p className="text-sm font-bold text-earth-700 dark:text-earth-300">{result.soilSuitability.type}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                    <p className="text-xs text-earth-400 mb-1">{t.nutrients}</p>
                    <p className="text-sm font-bold text-earth-700 dark:text-earth-300">{result.soilSuitability.nutrients.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5 text-sage-500" />
                  <h4 className="font-bold font-display text-earth-800 dark:text-earth-200">{t.recommendations}</h4>
                </div>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-earth-600 dark:text-earth-400">
                      <span className="w-5 h-5 rounded-full bg-sage-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-sage-600 dark:text-sage-400">{i + 1}</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {!result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card flex flex-col items-center justify-center text-center py-16">
              <div className="w-24 h-24 rounded-3xl bg-earth-100 dark:bg-earth-800/50 flex items-center justify-center mb-4">
                <Leaf className="w-12 h-12 text-earth-300 dark:text-earth-600" />
              </div>
              <h3 className="text-lg font-bold font-display text-earth-400 dark:text-earth-500 mb-1">{t.noAnalysis}</h3>
              <p className="text-sm text-earth-400 dark:text-earth-500 max-w-xs">{t.noAnalysisSubtitle}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

