import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CropScanner from './pages/CropScanner'
import VoiceAdvisor from './pages/VoiceAdvisor'
import MarketIntelligence from './pages/MarketIntelligence'
import CropAdvisory from './pages/CropAdvisory'
import SustainablePortal from './pages/SustainablePortal'
import AgriLibrary from './pages/AgriLibrary'
import GenAffNetHub from './pages/GenAffNetHub'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/scanner" element={<CropScanner />} />
            <Route path="/advisor" element={<VoiceAdvisor />} />
            <Route path="/market" element={<MarketIntelligence />} />
            <Route path="/advisory" element={<CropAdvisory />} />
            <Route path="/sustainable" element={<SustainablePortal />} />
            <Route path="/library" element={<AgriLibrary />} />
            <Route path="/genaffnet" element={<GenAffNetHub />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
