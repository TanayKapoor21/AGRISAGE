import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Info } from 'lucide-react'

const yieldData = [
  { region: 'North', value: 12.4, color: 'bg-emerald-500' },
  { region: 'West', value: 8.2, color: 'bg-cyan-500' },
  { region: 'Central', value: -2.1, color: 'bg-amber-500' },
  { region: 'East', value: 5.7, color: 'bg-teal-500' },
  { region: 'South', value: 9.1, color: 'bg-indigo-500' },
]

export default function YieldBarChart() {
  const maxValue = Math.max(...yieldData.map(d => Math.abs(d.value))) + 5

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">Regional Yield Performance</h3>
            <p className="text-xs text-earth-400">Yield variation comparison across Indian regions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-earth-100 dark:bg-earth-800 border border-earth-200/50 dark:border-earth-700/30">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-earth-700 dark:text-earth-300">+7.4% National Avg</span>
        </div>
      </div>

      <div className="relative h-64 flex items-end justify-between gap-4 px-4 pt-10">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-10 bottom-0 flex flex-col justify-between text-[10px] font-bold text-earth-400 opacity-50">
          <span>{maxValue}%</span>
          <span>0%</span>
          <span>-{maxValue}%</span>
        </div>

        {/* Zero Line */}
        <div className="absolute left-8 right-0 h-px bg-earth-200 dark:bg-earth-700 top-1/2 opacity-30" />

        {yieldData.map((d, i) => {
          const isNegative = d.value < 0
          const heightPercent = (Math.abs(d.value) / maxValue) * 50
          
          return (
            <div key={d.region} className="flex-1 flex flex-col items-center group relative h-full">
              {/* Bar */}
              <div className="relative flex-1 w-full flex flex-col justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className={`w-full max-w-[40px] mx-auto rounded-t-lg shadow-lg ${d.color} opacity-80 group-hover:opacity-100 transition-opacity relative`}
                  style={{
                    alignSelf: isNegative ? 'flex-start' : 'flex-end',
                    transform: isNegative ? 'translateY(50%) rotate(180deg)' : 'translateY(-50%)'
                  }}
                >
                  <div className={`absolute ${isNegative ? '-bottom-6' : '-top-6'} left-1/2 -translate-x-1/2 text-[10px] font-black ${isNegative ? 'text-amber-500' : 'text-emerald-500'} ${isNegative ? 'rotate-180' : ''}`}>
                    {d.value > 0 ? '+' : ''}{d.value}%
                  </div>
                </motion.div>
              </div>

              {/* Label */}
              <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mt-4">
                {d.region}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-earth-100/50 dark:bg-earth-800/30 border border-earth-200/30 dark:border-earth-700/30 flex gap-3">
        <Info className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed italic">
          Data aggregated from regional mandi reports and GenAffNet yield predictions. Central India pulse indicates moisture stress in soybean clusters.
        </p>
      </div>
    </div>
  )
}
