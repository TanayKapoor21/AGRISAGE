import { useState, useCallback, useMemo } from 'react'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { motion } from 'framer-motion'
import { MapPin, Phone, Navigation, Loader2, MapPinOff, ExternalLink } from 'lucide-react'
import { getWasteFacilities } from '../services/db'
import { useApp } from '../context/AppContext'
import type { WasteFacility } from '../types'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0',
}

// Centered around Delhi-NCR / North India to cover all facility markers
const defaultCenter = { lat: 29.2, lng: 76.5 }
const defaultZoom = 7

// Custom map options for a clean look
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  styles: [
    { featureType: 'poi' as const, elementType: 'labels' as const, stylers: [{ visibility: 'off' as const }] },
    { featureType: 'transit' as const, stylers: [{ visibility: 'off' as const }] },
  ],
}

const GREEN_MARKER = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'

const translations = {
  hi: {
    mapNotAvailable: 'मानचित्र उपलब्ध नहीं',
    mapNotAvailableSubtitle: 'Google Maps API कुंजी जोड़ें। सुविधा सूची दाईं ओर उपलब्ध है।',
    nearbyFacilities: 'निकटतम सुविधाएं',
    getDirections: 'दिशा-निर्देश'
  },
  en: {
    mapNotAvailable: 'Map Not Available',
    mapNotAvailableSubtitle: 'Add your Google Maps API key in .env to enable the interactive map. Facility list is available on the right.',
    nearbyFacilities: 'Nearby Facilities',
    getDirections: 'Get Directions'
  },
  pa: { mapNotAvailable: 'Map Not Available', mapNotAvailableSubtitle: 'Add your Google Maps API key in .env to enable the interactive map. Facility list is available on the right.', nearbyFacilities: 'Nearby Facilities', getDirections: 'Get Directions' },
  mr: { mapNotAvailable: 'Map Not Available', mapNotAvailableSubtitle: 'Add your Google Maps API key in .env to enable the interactive map. Facility list is available on the right.', nearbyFacilities: 'Nearby Facilities', getDirections: 'Get Directions' },
  ta: { mapNotAvailable: 'Map Not Available', mapNotAvailableSubtitle: 'Add your Google Maps API key in .env to enable the interactive map. Facility list is available on the right.', nearbyFacilities: 'Nearby Facilities', getDirections: 'Get Directions' },
  te: { mapNotAvailable: 'Map Not Available', mapNotAvailableSubtitle: 'Add your Google Maps API key in .env to enable the interactive map. Facility list is available on the right.', nearbyFacilities: 'Nearby Facilities', getDirections: 'Get Directions' },
  kn: { mapNotAvailable: 'Map Not Available', mapNotAvailableSubtitle: 'Add your Google Maps API key in .env to enable the interactive map. Facility list is available on the right.', nearbyFacilities: 'Nearby Facilities', getDirections: 'Get Directions' }
}

export default function WasteCollectionMap() {
  const { state } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']
  const facilities = useMemo(() => getWasteFacilities(), [])
  const [selectedFacility, setSelectedFacility] = useState<WasteFacility | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const hasApiKey = MAPS_KEY && MAPS_KEY !== 'your_google_maps_api_key_here'

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: hasApiKey ? MAPS_KEY : '',
  })

  const onMarkerClick = useCallback((facility: WasteFacility) => {
    setSelectedFacility(facility)
    // Scroll to the facility card in the list
    const el = document.getElementById(`facility-${facility.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const handleFacilityCardClick = useCallback((facility: WasteFacility) => {
    setSelectedFacility(facility)
  }, [])

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden border border-earth-200/50 dark:border-earth-700/30 bg-white dark:bg-earth-900"
      style={{ height: '620px' }}
    >
      {/* ─── Map Panel (Left) ──────────────────────────── */}
      <div className="lg:col-span-3 h-[300px] lg:h-full relative">
        {hasApiKey && isLoaded && !loadError ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={defaultZoom}
            options={mapOptions}
          >
            {facilities.map((f) => (
              <MarkerF
                key={f.id}
                position={{ lat: f.lat, lng: f.lng }}
                onClick={() => onMarkerClick(f)}
                icon={GREEN_MARKER}
                title={f.name}
              />
            ))}

            {selectedFacility && (
              <InfoWindowF
                position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                onCloseClick={() => setSelectedFacility(null)}
                options={{ maxWidth: 280 }}
              >
                <div style={{ padding: '4px 2px', fontFamily: 'Inter, sans-serif' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#1c1917' }}>
                    {selectedFacility.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#57534e', marginBottom: '6px' }}>
                    {selectedFacility.address}
                  </p>
                  <a
                    href={`tel:${selectedFacility.phone}`}
                    style={{ fontSize: '12px', color: '#1dbf6a', fontWeight: 600, textDecoration: 'none' }}
                  >
                    📞 {selectedFacility.phone}
                  </a>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {selectedFacility.wasteTypes.map((wt) => (
                      <span
                        key={wt}
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #d6d3d1',
                          color: '#44403c',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {wt}
                      </span>
                    ))}
                  </div>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        ) : hasApiKey && !loadError ? (
          /* Loading state */
          <div className="w-full h-full flex flex-col items-center justify-center bg-earth-100 dark:bg-earth-800/50">
            <Loader2 className="w-8 h-8 text-sage-500 animate-spin mb-3" />
            <p className="text-sm text-earth-500">Loading map...</p>
          </div>
        ) : (
          /* Fallback: no API key or error */
          <div className="w-full h-full flex flex-col items-center justify-center bg-earth-100 dark:bg-earth-800/30 relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 dot-pattern opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-sage-500/5 to-transparent" />
            <div className="relative z-10 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-sage-500/10 flex items-center justify-center mx-auto mb-4">
                <MapPinOff className="w-8 h-8 text-sage-500/50" />
              </div>
              <h4 className="font-bold font-display text-earth-600 dark:text-earth-400 mb-2">
                {t.mapNotAvailable}
              </h4>
              <p className="text-sm text-earth-400 max-w-xs mx-auto mb-4">
                {t.mapNotAvailableSubtitle}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-earth-200/50 dark:bg-earth-700/50 text-xs text-earth-500 font-mono">
                VITE_GOOGLE_MAPS_API_KEY=...
              </div>
            </div>
            {/* Static dots representing facilities */}
            <div className="absolute inset-0 z-0">
              {facilities.map((f) => {
                const x = ((f.lng - 73) / 6) * 100
                const y = ((31.5 - f.lat) / 4) * 100
                return (
                  <motion.div
                    key={f.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: Math.random() * 0.5, duration: 0.3 }}
                    className="absolute w-3 h-3 rounded-full bg-sage-500/40 border-2 border-sage-500/60"
                    style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                    title={f.name}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Facility List Panel (Right) ───────────────── */}
      <div className="lg:col-span-2 h-[320px] lg:h-full overflow-y-auto border-t lg:border-t-0 lg:border-l border-earth-200/50 dark:border-earth-700/30">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 px-5 py-3.5 bg-white/90 dark:bg-earth-900/90 backdrop-blur-md border-b border-earth-200/50 dark:border-earth-700/30">
          <p className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
            {t.nearbyFacilities} ({facilities.length})
          </p>
        </div>

        {/* Facility Cards */}
        <div className="divide-y divide-earth-200/50 dark:divide-earth-700/30">
          {facilities.map((facility, i) => (
            <motion.div
              key={facility.id}
              id={`facility-${facility.id}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleFacilityCardClick(facility)}
              onMouseEnter={() => setHoveredId(facility.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`px-5 py-4 cursor-pointer transition-all duration-200 ${
                selectedFacility?.id === facility.id
                  ? 'bg-sage-500/5 dark:bg-sage-500/10 border-l-[3px] border-l-sage-500'
                  : hoveredId === facility.id
                    ? 'bg-earth-50 dark:bg-earth-800/30 border-l-[3px] border-l-transparent'
                    : 'border-l-[3px] border-l-transparent'
              }`}
            >
              {/* Facility Name */}
              <h4 className="text-sm font-bold text-earth-800 dark:text-earth-100 uppercase tracking-wide mb-2">
                {facility.name}
              </h4>

              {/* Address */}
              <div className="flex items-start gap-2 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-earth-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed">
                  {facility.address}
                </p>
              </div>

              {/* Phone */}
              <a
                href={`tel:${facility.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 mb-3 group/phone"
              >
                <Phone className="w-3.5 h-3.5 text-sage-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-sage-600 dark:text-sage-400 group-hover/phone:text-sage-500 transition-colors">
                  {facility.phone}
                </span>
              </a>

              {/* Waste Type Tags */}
              <div className="flex flex-wrap gap-1.5">
                {facility.wasteTypes.map((wt) => (
                  <span
                    key={wt}
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                               border border-earth-300 dark:border-earth-600
                               text-earth-600 dark:text-earth-300
                               bg-earth-50 dark:bg-earth-800/50"
                  >
                    {wt}
                  </span>
                ))}
              </div>

              {/* Directions link when selected */}
              {selectedFacility?.id === facility.id && (
                <motion.a
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg
                             bg-sage-500/10 text-sage-600 dark:text-sage-400 text-xs font-semibold
                             hover:bg-sage-500/20 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  {t.getDirections}
                  <ExternalLink className="w-3 h-3" />
                </motion.a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
