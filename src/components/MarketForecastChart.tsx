import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

const data = [
  { month: 'Oct', rice: 3200, wheat: 2400, projection: 2800 },
  { month: 'Nov', rice: 3400, wheat: 2450, projection: 2900 },
  { month: 'Dec', rice: 3300, wheat: 2500, projection: 3000 },
  { month: 'Jan', rice: 3500, wheat: 2600, projection: 3100 },
  { month: 'Feb', rice: 3700, wheat: 2750, projection: 3350 },
  { month: 'Mar', rice: 3900, wheat: 2800, projection: 3500 },
]

export default function MarketForecastChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="agri-card"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="neo-icon !p-3">
            <TrendingUp className="w-5 h-5 text-[var(--neo-green)]" />
          </div>
          <div>
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">Market Price Forecasting</h3>
            <p className="text-xs text-earth-400">AI-predicted Mandi price trends for the next quarter</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--neo-green)]" />
            <span className="text-xs text-earth-500">Projection</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-earth-100 dark:bg-earth-800 border border-earth-200/50 dark:border-earth-700/30">
            <Calendar className="w-3 h-3 text-[var(--neo-green)]" />
            <span>Q1 2026 Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0D1109', 
                border: '1px solid #39FF14',
                borderRadius: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#39FF14' }}
            />
            <Area 
              type="monotone" 
              dataKey="projection" 
              stroke="#39FF14" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProjection)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="rice" 
              stroke="#fbbf24" 
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 5"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 border-t border-earth-200/10 pt-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-earth-500 uppercase font-black tracking-tighter">Confidence Score</span>
          <span className="text-lg font-bold text-[var(--neo-green)]">94.8%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-earth-500 uppercase font-black tracking-tighter">Market Volatility</span>
          <span className="text-lg font-bold text-amber-500">Low</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-earth-500 uppercase font-black tracking-tighter">Recommended Action</span>
          <span className="text-lg font-bold text-emerald-500">Hold Inventory</span>
        </div>
      </div>
    </motion.div>
  )
}
