import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Loader2, Zap, Target, AlertTriangle,
  TrendingUp, BarChart3, Layers, Sliders, Play,
  ChevronRight, Activity,
} from 'lucide-react'
import { getGenAffNetPrediction } from '../services/gemini'
import { useApp } from '../context/AppContext'
import type { PredictionInput, PredictionResult, SoilType } from '../types'

const soilOptions: { value: SoilType; label: string }[] = [
  { value: 'alluvial', label: 'Alluvial' },
  { value: 'black_cotton', label: 'Black Cotton' },
  { value: 'red', label: 'Red Soil' },
  { value: 'laterite', label: 'Laterite' },
  { value: 'desert', label: 'Desert (Sandy)' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'saline', label: 'Saline/Alkaline' },
]

const riskColors = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', label: 'Low Risk' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', label: 'Medium Risk' },
  high: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', label: 'High Risk' },
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function GenAffNetHub() {
  const { state } = useApp()
  const [input, setInput] = useState<PredictionInput>({
    soilType: 'alluvial',
    temperature: 28,
    rainfall: 800,
    humidity: 65,
    ph: 6.5,
    nitrogen: 80,
    phosphorus: 45,
    potassium: 60,
  })
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const updateField = (field: keyof PredictionInput, value: number | SoilType) => {
    setInput((prev) => ({ ...prev, [field]: value }))
  }

  const runPrediction = useCallback(async () => {
    setLoading(true)
    setHasRun(true)
    try {
      const results = await getGenAffNetPrediction(input)
      setPredictions(results)
    } finally {
      setLoading(false)
    }
  }, [input])

  const sliderFields: { key: keyof PredictionInput; label: string; min: number; max: number; step: number; unit: string; color: string }[] = [
    { key: 'temperature', label: 'Temperature', min: 5, max: 50, step: 1, unit: '°C', color: 'from-orange-400 to-red-500' },
    { key: 'rainfall', label: 'Annual Rainfall', min: 100, max: 3000, step: 50, unit: 'mm', color: 'from-blue-400 to-cyan-500' },
    { key: 'humidity', label: 'Humidity', min: 10, max: 100, step: 1, unit: '%', color: 'from-teal-400 to-emerald-500' },
    { key: 'ph', label: 'Soil pH', min: 3.5, max: 9.5, step: 0.1, unit: '', color: 'from-purple-400 to-violet-500' },
    { key: 'nitrogen', label: 'Nitrogen (N)', min: 0, max: 200, step: 5, unit: 'kg/ha', color: 'from-green-400 to-lime-500' },
    { key: 'phosphorus', label: 'Phosphorus (P)', min: 0, max: 150, step: 5, unit: 'kg/ha', color: 'from-amber-400 to-yellow-500' },
    { key: 'potassium', label: 'Potassium (K)', min: 0, max: 200, step: 5, unit: 'kg/ha', color: 'from-pink-400 to-rose-500' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero Header */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl p-8 md:p-10"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0c0a09 40%, #312e81 100%)' }}
      >
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
                GenAffNet <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-violet-300">Hub</span>
              </h1>
              <p className="text-indigo-300/70 text-sm">Agricultural Affinity Network — Deep Learning Engine</p>
            </div>
          </div>
          <p className="text-earth-400 max-w-2xl mt-3">
            {state.language === 'hi'
              ? 'उन्नत डीप लर्निंग एनालिटिक्स — मिट्टी के मापदंडों से फसल की उपज और उपयुक्तता का प्रेडिक्शन करें।'
              : 'Advanced deep learning analytics for predictive farming. Input soil and climate parameters to get crop yield predictions and agricultural affinity mapping.'}
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs text-indigo-400/60">
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> 12-Layer Neural Network</span>
            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> 97.3% Accuracy</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Real-time Inference</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Input Panel (2 cols) ─────────────────────── */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-5">
              <Sliders className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">
                {state.language === 'hi' ? 'इनपुट पैरामीटर' : 'Input Parameters'}
              </h3>
            </div>

            {/* Soil Type */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-2 block">Soil Type</label>
              <select
                value={input.soilType}
                onChange={(e) => updateField('soilType', e.target.value as SoilType)}
                className="input-field"
              >
                {soilOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              {sliderFields.map((field) => (
                <div key={field.key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-earth-500 dark:text-earth-400">{field.label}</label>
                    <span className="text-xs font-bold text-earth-700 dark:text-earth-300">
                      {typeof input[field.key] === 'number' ? (input[field.key] as number).toFixed(field.step < 1 ? 1 : 0) : input[field.key]} {field.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={input[field.key] as number}
                    onChange={(e) => updateField(field.key, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-earth-200 dark:bg-earth-800 rounded-full appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-lg
                               [&::-webkit-slider-thumb]:shadow-indigo-500/30 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Run Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={runPrediction}
              disabled={loading}
              className="w-full mt-6 px-6 py-3.5 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
                         shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                         transition-all duration-300 hover:-translate-y-0.5
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Inference...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {state.language === 'hi' ? 'प्रेडिक्शन चलाएँ' : 'Run GenAffNet Prediction'}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* ─── Results Panel (3 cols) ───────────────────── */}
        <motion.div variants={item} className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <Brain className="w-16 h-16 text-indigo-500/30" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-indigo-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-earth-400 mt-4">GenAffNet is processing your parameters...</p>
                <div className="flex items-center gap-2 mt-2">
                  <motion.div
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-1 bg-indigo-500 rounded-full"
                    style={{ width: '120px' }}
                  />
                </div>
              </motion.div>
            ) : predictions.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {predictions.map((pred, i) => {
                  const risk = riskColors[pred.riskLevel]
                  return (
                    <motion.div
                      key={pred.crop}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold font-display text-lg shadow-lg shadow-indigo-500/20">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold font-display text-earth-800 dark:text-white">{pred.crop}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${risk.bg} ${risk.text} border ${risk.border}`}>
                                {risk.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                            {pred.yieldPrediction} q/ha
                          </p>
                          <p className="text-[10px] text-earth-400">Predicted Yield</p>
                        </div>
                      </div>

                      {/* Metrics Row */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-indigo-400" />
                            <p className="text-xs text-earth-400">Confidence</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-earth-200 dark:bg-earth-700 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pred.confidence * 100}%` }}
                                transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                                className="h-full rounded-full bg-indigo-500"
                              />
                            </div>
                            <span className="text-xs font-bold text-earth-700 dark:text-earth-300">{(pred.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-earth-100/50 dark:bg-earth-800/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-violet-400" />
                            <p className="text-xs text-earth-400">Affinity Score</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-earth-200 dark:bg-earth-700 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pred.affinityScore * 100}%` }}
                                transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                                className="h-full rounded-full bg-violet-500"
                              />
                            </div>
                            <span className="text-xs font-bold text-earth-700 dark:text-earth-300">{(pred.affinityScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Factor Analysis */}
                      <div>
                        <p className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-2">Factor Impact Analysis</p>
                        <div className="space-y-1.5">
                          {pred.factors.map((factor) => (
                            <div key={factor.name} className="flex items-center gap-2">
                              <span className="text-xs text-earth-500 w-24 flex-shrink-0">{factor.name}</span>
                              <div className="flex-1 flex items-center gap-1">
                                <div className="flex-1 h-1 rounded-full bg-earth-200 dark:bg-earth-800 relative overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.abs(factor.impact) * 50}%` }}
                                    transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                                    className={`absolute top-0 h-full rounded-full ${
                                      factor.impact >= 0 ? 'left-1/2 bg-emerald-500' : 'right-1/2 bg-red-500'
                                    }`}
                                  />
                                  <div className="absolute left-1/2 top-0 w-px h-full bg-earth-400/30" />
                                </div>
                              </div>
                              <span className={`text-xs font-semibold w-10 text-right ${factor.impact >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {factor.impact >= 0 ? '+' : ''}{(factor.impact * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 rounded-3xl bg-indigo-500/5 dark:bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/10">
                  <Brain className="w-12 h-12 text-indigo-400/30" />
                </div>
                <h3 className="text-lg font-bold font-display text-earth-400 dark:text-earth-500 mb-1">
                  {state.language === 'hi' ? 'मॉडल तैयार है' : 'Model Ready'}
                </h3>
                <p className="text-sm text-earth-400 dark:text-earth-500 max-w-sm">
                  {state.language === 'hi'
                    ? 'बाएं पैनल में मापदंड सेट करें और प्रेडिक्शन चलाएँ'
                    : 'Configure soil and climate parameters on the left panel, then run the GenAffNet prediction engine'}
                </p>
                <div className="flex items-center gap-1 mt-4 text-indigo-400/50 text-xs">
                  <ChevronRight className="w-4 h-4" />
                  <span>Adjust parameters and click "Run GenAffNet Prediction"</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
