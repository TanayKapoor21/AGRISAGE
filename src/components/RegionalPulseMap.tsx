import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Activity, Zap, TrendingUp, Info } from 'lucide-react'

interface RegionData {
  id: string
  name: string
  yield: string
  status: 'Good' | 'Optimal' | 'Alert'
  mandiActivity: string
  satelliteSync: string
  color: string
}

const regions: RegionData[] = [
  { id: 'north', name: 'North India', yield: '+12.4%', status: 'Good', mandiActivity: 'High', satelliteSync: 'Active', color: 'fill-emerald-500' },
  { id: 'west', name: 'West India', yield: '+8.2%', status: 'Optimal', mandiActivity: 'Medium', satelliteSync: 'Active', color: 'fill-cyan-500' },
  { id: 'central', name: 'Central India', yield: '-2.1%', status: 'Alert', mandiActivity: 'High', satelliteSync: 'Monitoring', color: 'fill-amber-500' },
  { id: 'east', name: 'East India', yield: '+5.7%', status: 'Good', mandiActivity: 'Medium', satelliteSync: 'Active', color: 'fill-teal-500' },
  { id: 'south', name: 'South India', yield: '+9.1%', status: 'Good', mandiActivity: 'High', satelliteSync: 'Active', color: 'fill-indigo-500' },
]

export default function RegionalPulseMap() {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null)

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <h3 className="font-bold font-display text-earth-800 dark:text-earth-200">Regional Performance Pulse</h3>
            <p className="text-xs text-earth-400">Live SVG-based yield telemetry dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
            <Zap className="w-3 h-3" /> Satellite Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* SVG Map Section */}
        <div className="relative aspect-square flex items-center justify-center p-4">
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full max-w-[320px] filter drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}
          >
            {/* North India */}
            <motion.path
              d="M100 20 L130 40 L120 70 L80 70 L70 45 Z"
              className={`${hoveredRegion?.id === 'north' ? 'fill-emerald-400 opacity-100' : 'fill-emerald-500/30'} stroke-emerald-500/50 cursor-pointer transition-all duration-300`}
              onMouseEnter={() => setHoveredRegion(regions[0])}
              onMouseLeave={() => setHoveredRegion(null)}
              whileHover={{ scale: 1.05 }}
            />
            {/* West India */}
            <motion.path
              d="M70 70 L90 85 L75 130 L40 120 L45 80 Z"
              className={`${hoveredRegion?.id === 'west' ? 'fill-cyan-400 opacity-100' : 'fill-cyan-500/30'} stroke-cyan-500/50 cursor-pointer transition-all duration-300`}
              onMouseEnter={() => setHoveredRegion(regions[1])}
              onMouseLeave={() => setHoveredRegion(null)}
              whileHover={{ scale: 1.05 }}
            />
            {/* Central India */}
            <motion.path
              d="M90 70 L130 80 L140 120 L100 135 L80 110 Z"
              className={`${hoveredRegion?.id === 'central' ? 'fill-amber-400 opacity-100' : 'fill-amber-500/30'} stroke-amber-500/50 cursor-pointer transition-all duration-300`}
              onMouseEnter={() => setHoveredRegion(regions[2])}
              onMouseLeave={() => setHoveredRegion(null)}
              whileHover={{ scale: 1.05 }}
            />
            {/* East India */}
            <motion.path
              d="M140 80 L170 85 L180 130 L150 145 L135 120 Z"
              className={`${hoveredRegion?.id === 'east' ? 'fill-teal-400 opacity-100' : 'fill-teal-500/30'} stroke-teal-500/50 cursor-pointer transition-all duration-300`}
              onMouseEnter={() => setHoveredRegion(regions[3])}
              onMouseLeave={() => setHoveredRegion(null)}
              whileHover={{ scale: 1.05 }}
            />
            {/* South India */}
            <motion.path
              d="M75 130 L100 135 L145 135 L120 220 L80 200 Z"
              className={`${hoveredRegion?.id === 'south' ? 'fill-indigo-400 opacity-100' : 'fill-indigo-500/30'} stroke-indigo-500/50 cursor-pointer transition-all duration-300`}
              onMouseEnter={() => setHoveredRegion(regions[4])}
              onMouseLeave={() => setHoveredRegion(null)}
              whileHover={{ scale: 1.05 }}
            />

            {/* Labels (simplified) */}
            <text x="90" y="45" fontSize="6" className="fill-earth-400 pointer-events-none font-bold uppercase tracking-tighter">North</text>
            <text x="45" y="105" fontSize="6" className="fill-earth-400 pointer-events-none font-bold uppercase tracking-tighter">West</text>
            <text x="100" y="105" fontSize="6" className="fill-earth-400 pointer-events-none font-bold uppercase tracking-tighter">Central</text>
            <text x="150" y="115" fontSize="6" className="fill-earth-400 pointer-events-none font-bold uppercase tracking-tighter">East</text>
            <text x="95" y="175" fontSize="6" className="fill-earth-400 pointer-events-none font-bold uppercase tracking-tighter">South</text>
          </svg>

          {/* Floating UI Indicator */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-earth-400 uppercase tracking-widest font-bold">Yield Pulse High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] text-earth-400 uppercase tracking-widest font-bold">Climate Caution</span>
            </div>
          </div>
        </div>

        {/* Data Panel Section */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {hoveredRegion ? (
              <motion.div
                key={hoveredRegion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-baseline justify-between border-b border-earth-200/30 dark:border-earth-700/30 pb-3">
                  <h4 className="text-2xl font-black font-display text-earth-800 dark:text-white uppercase tracking-tighter">
                    {hoveredRegion.name}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    hoveredRegion.status === 'Alert' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {hoveredRegion.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-earth-400 tracking-widest flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Yield Forecast
                    </p>
                    <p className={`text-xl font-bold font-display ${hoveredRegion.yield.startsWith('+') ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {hoveredRegion.yield}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-earth-400 tracking-widest flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Mandi Pulse
                    </p>
                    <p className="text-xl font-bold font-display text-earth-700 dark:text-earth-200">
                      {hoveredRegion.mandiActivity}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-earth-400 tracking-widest flex items-center gap-1">
                      <Map className="w-3 h-3" /> Satellite Sync
                    </p>
                    <p className="text-sm font-semibold text-earth-600 dark:text-earth-300">
                      {hoveredRegion.satelliteSync}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-earth-100/50 dark:bg-earth-800/30 border border-earth-200/30 dark:border-earth-700/30 flex gap-3">
                  <Info className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed italic">
                    Real-time cross-referenced telemetry from 52,000 ground sensors across {hoveredRegion.name}.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <div className="w-16 h-16 rounded-3xl bg-earth-100 dark:bg-earth-800/50 flex items-center justify-center mb-4 text-earth-300 dark:text-earth-600">
                  <Map className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold font-display text-earth-700 dark:text-earth-300">Region Selector</h4>
                <p className="text-xs text-earth-400 max-w-[200px] mt-2">
                  Hover over the regional segments to view high-accuracy yield and mandi telemetry data.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
