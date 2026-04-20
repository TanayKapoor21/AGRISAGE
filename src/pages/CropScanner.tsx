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
    }
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
    }
  }
}

export default function CropScanner() {
  const { state } = useApp()
  const lang = (state.language === 'hi' ? 'hi' : 'en') as 'hi' | 'en'
  const t = translations[lang]

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
      addActivity({ type: 'scan', title: `Crop Scanned: ${scanResult.cropName}`, description: `${scanResult.healthStatus === 'healthy' ? 'Healthy' : 'Issue detected'} — ${scanResult.confidence * 100}% confidence` })
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

