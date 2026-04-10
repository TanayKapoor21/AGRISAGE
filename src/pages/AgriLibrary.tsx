import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Search, ChevronDown, ChevronUp, Calendar,
  Droplets, Bug, Leaf, Clock, Filter,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { CropGuide } from '../types'

// ─── Crop Library Data ──────────────────────────────────────────

const cropGuides: CropGuide[] = [
  {
    id: '1', name: 'Rice (Paddy)', category: 'Cereals', season: 'Kharif (June-Nov)', image: '🌾',
    description: 'Staple food crop of India requiring warm, humid climate with abundant water supply. Major producer states include West Bengal, UP, Punjab.',
    steps: [
      { order: 1, title: 'Nursery Preparation', description: 'Prepare raised beds, soak seeds for 24 hours, sow in nursery. Keep beds moist.', duration: '21-25 days' },
      { order: 2, title: 'Main Field Preparation', description: 'Plow and puddle the field. Apply basal dose of fertilizers. Level the field.', duration: '3-5 days' },
      { order: 3, title: 'Transplanting', description: 'Transplant 21-day-old seedlings at 2-3 per hill. Spacing: 20x15 cm.', duration: '1-2 days' },
      { order: 4, title: 'Water Management', description: 'Maintain 5cm standing water. Drain before top-dressing nitrogen.', duration: 'Continuous' },
      { order: 5, title: 'Harvesting', description: 'Harvest when 80% grains turn golden. Cut at ground level.', duration: '120-150 days from sowing' },
    ],
    tips: ['Use System of Rice Intensification (SRI) for 20-30% water saving', 'Apply zinc sulfate at 25 kg/ha in zinc-deficient soils', 'Use drum seeder for direct seeding to save labor'],
    pests: ['Stem Borer', 'Brown Plant Hopper', 'Leaf Folder', 'Rice Blast'],
    diseases: ['Blast (Pyricularia)', 'Bacterial Leaf Blight', 'Sheath Blight', 'False Smut'],
  },
  {
    id: '2', name: 'Wheat', category: 'Cereals', season: 'Rabi (Nov-Apr)', image: '🌿',
    description: 'Second most important cereal crop of India. Requires cool climate during growth and warm, dry weather during ripening.',
    steps: [
      { order: 1, title: 'Field Preparation', description: 'Deep plowing followed by 2-3 harrowings. Fine tilth essential for good germination.', duration: '5-7 days' },
      { order: 2, title: 'Seed Treatment & Sowing', description: 'Treat seeds with Vitavax. Sow by mid-November at 100 kg/ha. Row spacing 22.5 cm.', duration: '1-2 days' },
      { order: 3, title: 'First Irrigation (CRI)', description: 'Critical irrigation at Crown Root Initiation stage (21 days). Most critical irrigation.', duration: '21 days after sowing' },
      { order: 4, title: 'Top Dressing', description: 'Apply remaining nitrogen after first irrigation. Weed control at 30 days.', duration: '25-30 days after sowing' },
      { order: 5, title: 'Harvesting', description: 'Harvest when plants turn golden and grain is hard. Moisture content 14%.', duration: '120-140 days from sowing' },
    ],
    tips: ['Zero-till sowing saves ₹4000/ha and conserves moisture', 'Apply 5 irrigations at CRI, tillering, jointing, flowering, grain filling', 'Growing period below 35°C essential for good grain'],
    pests: ['Aphids', 'Termites', 'Army Worm', 'Pink Borer'],
    diseases: ['Rust (Yellow, Brown, Black)', 'Loose Smut', 'Karnal Bunt', 'Powdery Mildew'],
  },
  {
    id: '3', name: 'Cotton', category: 'Fiber Crops', season: 'Kharif (Apr-Dec)', image: '☁️',
    description: 'White gold of Indian agriculture. Major commercial crop providing fiber for textile industry. Gujarat and Maharashtra are top producers.',
    steps: [
      { order: 1, title: 'Seed Selection & Treatment', description: 'Choose Bt cotton varieties. Treat seeds with Imidacloprid. Ensure refuge rows for resistance management.', duration: '1-2 days' },
      { order: 2, title: 'Sowing', description: 'Sow with onset of monsoon. Spacing 90x60 cm for hybrids. Dibble at 3-4 cm depth.', duration: '1 day' },
      { order: 3, title: 'Vegetative Care', description: 'Thinning at 15 days. Apply NPK split doses. First weeding at 20 days.', duration: '15-45 days' },
      { order: 4, title: 'Flowering & Boll Formation', description: 'Critical phase. Adequate irrigation and pest monitoring essential.', duration: '45-100 days' },
      { order: 5, title: 'Picking', description: 'Start picking when bolls open fully. Multiple pickings over 4-6 weeks.', duration: '150-180 days from sowing' },
    ],
    tips: ['Adopt High Density Planting System (HDPS) for mechanized harvesting', 'Install pheromone traps for bollworm monitoring at flowering', 'Intercrop with pigeon pea for additional income and soil health'],
    pests: ['American Bollworm', 'Pink Bollworm', 'Whitefly', 'Jassids', 'mealy bugs'],
    diseases: ['Bacterial Blight', 'Fusarium Wilt', 'Root Rot', 'Grey Mildew'],
  },
  {
    id: '4', name: 'Tomato', category: 'Vegetables', season: 'Year-round', image: '🍅',
    description: 'Most important vegetable crop in India after potato. Rich in vitamins A, C, and lycopene. Cultivated across all states.',
    steps: [
      { order: 1, title: 'Nursery Raising', description: 'Sow seeds in raised beds or pro-trays. Treat with Trichoderma. Protect from rain.', duration: '25-30 days' },
      { order: 2, title: 'Transplanting', description: 'Transplant on ridges or beds. Spacing 60x45 cm. Apply basal fertilizer in furrows.', duration: '1 day' },
      { order: 3, title: 'Staking & Training', description: 'Stake plants at 30 days. Remove suckers below first flower cluster. Use string or bamboo.', duration: '30 days onwards' },
      { order: 4, title: 'Fertigation', description: 'Drip irrigation with fertigation every 3-4 days. Calcium nitrate at flowering for BER prevention.', duration: 'Continuous' },
      { order: 5, title: 'Harvesting', description: 'Pick at breaker stage for distant markets. Fully ripe for local sale.', duration: '60-90 days from transplant' },
    ],
    tips: ['Mulch with silver plastic for thrips control and moisture conservation', 'Grow trap crop marigold around borders for nematode management', 'Spray 19:19:19 at flowering and fruiting stage for balanced nutrition'],
    pests: ['Fruit Borer', 'Whitefly', 'Leaf Miner', 'Thrips', 'Spider Mite'],
    diseases: ['Early Blight', 'Late Blight', 'Fusarium Wilt', 'Tomato Leaf Curl Virus'],
  },
  {
    id: '5', name: 'Sugarcane', category: 'Cash Crops', season: 'Kharif/Spring', image: '🎋',
    description: 'Most important sugar-producing crop. India is the second largest producer after Brazil. UP, Maharashtra, Karnataka are major states.',
    steps: [
      { order: 1, title: 'Sett Preparation', description: 'Select 8-10 month old disease-free cane. Cut 3-bud setts. Treat with Carbendazim.', duration: '1-2 days' },
      { order: 2, title: 'Planting', description: 'Flat or trench planting. Place setts horizontally in furrows at 75-90 cm row spacing.', duration: '1-2 days' },
      { order: 3, title: 'Germination & Tillering', description: 'First irrigation immediately. Gap filling at 30 days. Maximum tillering at 90-120 days.', duration: '30-120 days' },
      { order: 4, title: 'Grand Growth Phase', description: 'Heavy irrigation and nitrogen application. Earthing up at 120 days. Propping if needed.', duration: '120-270 days' },
      { order: 5, title: 'Harvesting', description: 'Harvest at 10-12 months. Cut at ground level. Remove trash for ratoon management.', duration: '300-365 days from planting' },
    ],
    tips: ['Adopt trench planting for 15-20% higher yield', 'Use trash mulching for moisture conservation', 'Take ratoon crop to reduce cost by 40%'],
    pests: ['Top Borer', 'Early Shoot Borer', 'Pyrilla', 'Woolly Aphid'],
    diseases: ['Red Rot', 'Smut', 'Grassy Shoot', 'Ratoon Stunting Disease'],
  },
  {
    id: '6', name: 'Onion', category: 'Vegetables', season: 'Rabi/Kharif', image: '🧅',
    description: 'India is the second largest onion producer. Maharashtra (Nashik, Solapur) is the hub. High price volatility makes market timing crucial.',
    steps: [
      { order: 1, title: 'Nursery', description: 'Sow seeds in raised beds 6 weeks before transplanting. Thin beds to ensure strong seedlings.', duration: '6-8 weeks' },
      { order: 2, title: 'Transplanting', description: 'Transplant at pencil thickness. Spacing 15x10 cm on flat beds. Trim tops by 1/3.', duration: '1-2 days' },
      { order: 3, title: 'Growth Management', description: '2-3 weedings. First irrigation immediately, then at 7-10 day intervals. Apply nitrogen at 30 days.', duration: '30-60 days' },
      { order: 4, title: 'Bulb Formation', description: 'Reduce nitrogen. Ensure consistent moisture for uniform bulb size. Potash application.', duration: '60-90 days' },
      { order: 5, title: 'Curing & Storage', description: 'Harvest when 50% tops fall. Cure in shade for 7-10 days before storage.', duration: '100-120 days total' },
    ],
    tips: ['Dip seedlings in Carbendazim solution before transplanting', 'Apply Trichoderma viride to prevent basal rot', 'Use storage structures with 60-70% ventilation for extended shelf life'],
    pests: ['Thrips', 'Onion Maggot', 'Cutworm', 'Head Borer'],
    diseases: ['Purple Blotch', 'Stemphylium Blight', 'Basal Rot', 'Downy Mildew'],
  },
]

const categories = ['All', ...new Set(cropGuides.map((g) => g.category))]

export default function AgriLibrary() {
  const { state } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)

  const filteredGuides = useMemo(() => {
    return cropGuides.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-rose-500" />
          {state.language === 'hi' ? 'कृषि पुस्तकालय' : 'Agricultural Library'}
        </h1>
        <p className="page-subtitle">
          {state.language === 'hi'
            ? 'विभिन्न फसलों के लिए चरण-दर-चरण रोपण गाइड'
            : 'Structured, step-by-step planting guides for major Indian crops'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={state.language === 'hi' ? 'फसल या विषय खोजें...' : 'Search crops or topics...'}
            className="input-field !pl-10"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-earth-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sage-500 text-white shadow-md shadow-sage-500/20'
                  : 'bg-earth-100 dark:bg-earth-800/50 text-earth-500 dark:text-earth-400 hover:bg-sage-100 dark:hover:bg-sage-900/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Guides */}
      <div className="space-y-4">
        {filteredGuides.map((guide, i) => {
          const isExpanded = expandedGuide === guide.id
          return (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card !p-0 overflow-hidden"
            >
              {/* Guide Header */}
              <button
                onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-earth-100/30 dark:hover:bg-earth-800/20 transition-colors"
              >
                <div className="text-4xl flex-shrink-0">{guide.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold font-display text-earth-800 dark:text-white">{guide.name}</h3>
                    <span className="badge-info">{guide.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-earth-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {guide.season}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {guide.steps.length} steps
                    </span>
                  </div>
                  <p className="text-sm text-earth-500 dark:text-earth-400 mt-1 line-clamp-1">{guide.description}</p>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-earth-400" />
                </motion.div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-5 border-t border-earth-200/30 dark:border-earth-700/30 pt-5">
                      {/* Description */}
                      <p className="text-sm text-earth-600 dark:text-earth-400 leading-relaxed">{guide.description}</p>

                      {/* Steps */}
                      <div>
                        <h4 className="font-bold font-display text-earth-800 dark:text-earth-200 mb-3 flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-sage-500" /> Planting Steps
                        </h4>
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-sage-500/20" />
                          <div className="space-y-4">
                            {guide.steps.map((step) => (
                              <div key={step.order} className="relative flex gap-4 pl-2">
                                <div className="w-5 h-5 rounded-full bg-sage-500 text-white text-[10px] font-bold flex items-center justify-center z-10 flex-shrink-0 mt-0.5">
                                  {step.order}
                                </div>
                                <div className="flex-1 pb-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-earth-800 dark:text-earth-200">{step.title}</p>
                                    <span className="text-[10px] text-earth-400 flex items-center gap-0.5">
                                      <Clock className="w-3 h-3" /> {step.duration}
                                    </span>
                                  </div>
                                  <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5 leading-relaxed">{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tips & Pests */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-sage-500/5 border border-sage-500/10">
                          <h5 className="text-sm font-bold text-sage-700 dark:text-sage-400 mb-2 flex items-center gap-1">
                            <Leaf className="w-3.5 h-3.5" /> Pro Tips
                          </h5>
                          <ul className="space-y-1">
                            {guide.tips.map((tip, j) => (
                              <li key={j} className="text-xs text-earth-600 dark:text-earth-400 flex items-start gap-1.5">
                                <span className="text-sage-500">•</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                          <h5 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                            <Bug className="w-3.5 h-3.5" /> Common Pests
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {guide.pests.map((pest) => (
                              <span key={pest} className="badge-danger">{pest}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                          <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                            <Droplets className="w-3.5 h-3.5" /> Diseases
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {guide.diseases.map((d) => (
                              <span key={d} className="badge-warning">{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {filteredGuides.length === 0 && (
          <div className="glass-card text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-earth-300 dark:text-earth-600 mb-3" />
            <p className="text-earth-400">
              {state.language === 'hi' ? 'कोई गाइड नहीं मिली' : 'No guides found matching your search.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
