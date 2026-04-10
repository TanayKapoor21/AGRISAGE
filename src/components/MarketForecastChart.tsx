import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts'
import { TrendingUp } from 'lucide-react'

const cropData: Record<string, any> = {
  rice: {
    data: [
      { month: 'Oct', price: 3200, projection: 2800 },
      { month: 'Nov', price: 3400, projection: 2900 },
      { month: 'Dec', price: 3300, projection: 3000 },
      { month: 'Jan', price: 3500, projection: 3100 },
      { month: 'Feb', price: 3700, projection: 3350 },
      { month: 'Mar', price: 3900, projection: 3500 },
    ],
    confidence: '94.8%',
    action: 'Hold Inventory',
    actionColor: 'text-emerald-500'
  },
  wheat: {
    data: [
      { month: 'Oct', price: 2100, projection: 2200 },
      { month: 'Nov', price: 2150, projection: 2250 },
      { month: 'Dec', price: 2200, projection: 2350 },
      { month: 'Jan', price: 2300, projection: 2500 },
      { month: 'Feb', price: 2450, projection: 2600 },
      { month: 'Mar', price: 2600, projection: 2850 },
    ],
    confidence: '89.2%',
    action: 'Good for Selling',
    actionColor: 'text-orange-500'
  },
  mustard: {
    data: [
      { month: 'Oct', price: 5400, projection: 5600 },
      { month: 'Nov', price: 5500, projection: 5750 },
      { month: 'Dec', price: 5600, projection: 5900 },
      { month: 'Jan', price: 5800, projection: 6100 },
      { month: 'Feb', price: 6000, projection: 6400 },
      { month: 'Mar', price: 6200, projection: 6800 },
    ],
    confidence: '91.5%',
    action: 'Target Export',
    actionColor: 'text-cyan-500'
  },
  maize: {
    data: [
      { month: 'Oct', price: 1800, projection: 1900 },
      { month: 'Nov', price: 1850, projection: 1950 },
      { month: 'Dec', price: 1900, projection: 2050 },
      { month: 'Jan', price: 2000, projection: 2200 },
      { month: 'Feb', price: 2100, projection: 2300 },
      { month: 'Mar', price: 2200, projection: 2500 },
    ],
    confidence: '85.7%',
    action: 'Stock Feed',
    actionColor: 'text-amber-500'
  },
  cotton: {
    data: [
      { month: 'Oct', price: 6500, projection: 6700 },
      { month: 'Nov', price: 6800, projection: 7000 },
      { month: 'Dec', price: 7200, projection: 7100 },
      { month: 'Jan', price: 7500, projection: 7300 },
      { month: 'Feb', price: 7800, projection: 7600 },
      { month: 'Mar', price: 8200, projection: 8000 },
    ],
    confidence: '92.1%',
    action: 'Wait for Peak',
    actionColor: 'text-rose-500'
  }
}

export default function MarketForecastChart() {
  const [selectedCrop, setSelectedCrop] = useState('rice')
  const active = cropData[selectedCrop]

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="agri-card !bg-black/20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="neo-icon !p-2 border-neo-amber">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold font-display text-white text-sm uppercase tracking-widest">Market Forecasting</h3>
            <p className="text-[10px] text-earth-500 uppercase font-black kerning-widest">Live Mandi Price Projections</p>
          </div>
        </div>
        
        <select 
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="bg-earth-900 border border-white/10 text-white text-xs px-4 py-2.5 rounded-xl outline-none focus:border-[var(--neo-green)] transition-all uppercase font-black"
        >
          <option value="rice">🌾 Basmati Rice</option>
          <option value="wheat">🌾 Wheat</option>
          <option value="mustard">🌼 Mustard</option>
          <option value="maize">🌽 Maize</option>
          <option value="cotton">☁️ Cotton</option>
        </select>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={active.data}>
            <defs>
              <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39FF14" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: '#6b7280', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="projection" stroke="#39FF14" strokeWidth={3} fillOpacity={1} fill="url(#colorProj)" />
            <Line type="monotone" dataKey="price" stroke="#A855F7" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
        <div className="flex gap-8">
          <div>
            <span className="text-[9px] text-earth-500 uppercase font-black block mb-1 tracking-tighter">Confidence</span>
            <span className="text-xl font-bold text-white">{active.confidence}</span>
          </div>
          <div>
            <span className="text-[9px] text-earth-500 uppercase font-black block mb-1 tracking-tighter">Strategy</span>
            <span className={`text-xl font-bold ${active.actionColor}`}>{active.action}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase">Live Analysis</span>
        </div>
      </div>
    </motion.div>
  )
}
