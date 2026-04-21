# 🌿 AgriSage Platform

> **AI-Powered Agricultural Operating System** for the Indian Farming Ecosystem

AgriSage is a unified, intelligent farming platform that integrates computer vision, real-time market intelligence, voice-enabled AI, and deep learning to empower farmers with actionable insights, yield optimization, and sustainable practices.

🚀 **[Live Demo](https://agrisage-application-sigma.vercel.app/)**

---

## 🗺️ System Workflow

```mermaid
graph TD
    User([Farmer/User]) --> Auth{Auth / Guest}
    Auth --> Dashboard{Dashboard}
    
    Dashboard --> Scanner[Crop Scanner]
    Dashboard --> Advisor[Voice AI Advisor]
    Dashboard --> Market[Market Intel]
    Dashboard --> Sustainable[Sustainable Portal]
    Dashboard --> ML[GenAffNet Hub]
    Dashboard --> Learning[Learning Portal]
    
    Dashboard --> SQLite[(SQLite DB)]
    
    Scanner --> GeminiV[Gemini Vision AI]
    Advisor --> WebSpeech[Web Speech API]
    Advisor --> GeminiC[Gemini NLP]
    Market --> WeatherAPI[WeatherAPI.com]
    Market --> MandiAPI[Mandi Price Engine]
    
    Sustainable --> CarbonTrack[Carbon Credit Tracker]
    Sustainable --> WasteMap[Waste Collection Map]
    WasteMap --> GoogleMaps[Google Maps API]
    
    ML --> DeepLearning[GenAffNet Model]
    
    GeminiV --> Results[Diagnosis & Recs]
    DeepLearning --> Yield[Yield Prediction]
    CarbonTrack --> Credits[Carbon Credits]
    
    subgraph Services
        ExpressBackend[Express Server]
        CacheService[(Local Cache)]
    end
    
    ExpressBackend --> SQLite
    Results -.-> CacheService
```

---

## 🌟 Core Features

### 📊 Regional Yield Performance
A comprehensive bar-graph analytics dashboard providing a "Regional Pulse" of India's agricultural performance. Features integrated satellite telemetry and mandi reports for North, West, Central, East, and South India.

### 📍 Waste Management Network
Real-time Google Maps integration to locate verified stubble recycling, composting, and biomass energy facilities. Helps farmers monetize agricultural waste and reduce environmental impact.

### 🔍 Computer Vision Crop Scanner
Identify pests and diseases instantly using your device's camera. Leveraging 3D-CNN streams for spatial-spectral fusion.

### 📊 Market Intelligence Pulse
Live Mandi prices for major commodities (Wheat, Paddy, Cotton, etc.) scraped and structured in real-time from trusted national sources.

### 🌤️ Precision Climate Alerts
5-day hyper-local forecasts with specific guidance on irrigation and harvesting windows based on humidity and wind trends.

### 🤖 Voice AI Advisor
A multilingual, voice-enabled assistant that provides science-backed agricultural advice in regional dialects.

### ♻️ Sustainable Portal
- **Waste Exchange**: Connect with biomass energy plants to monetize farm stubble.
- **Carbon Credits**: A conceptual ledger for earning credits through sustainable practices.

### 📚 Learning Portal
A curated, multilingual video library designed to enhance agricultural expertise. Features 25+ hand-picked tutorials on crop cultivation (Wheat, Rice, Corn, Cotton), market price analysis, sustainable stubble management, and disease prevention techniques.


## 🛠️ Tech Stack

- **Frontend:** React 18+ / TypeScript / Vite
- **Styling:** Tailwind CSS (Dark Mode, Responsive, Glassmorphism)
- **Animations:** Framer Motion
- **Backend:** Node.js / Express / JWT Authentication
- **Database:** SQLite (Persistent storage via `better-sqlite3`)
- **AI/ML:** Google Gemini 2.0 Flash + GenAffNet Deep Learning Model
- **Maps:** Google Maps JS API (@react-google-maps/api)
- **APIs:** Google Generative AI SDK, WeatherAPI.com, Web Speech API
- **Icons:** Lucide React
- **Storage:** Persisted SQLite for Users/Activities & LocalStorage with 1-hour TTL Caching

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TanayKapoor21/AGRISAGE.git
cd AGRISAGE

# Install dependencies
npm install
cd server && npm install && cd ..

# Copy environment variables
cp .env.example .env

# Add your API keys in .env
# VITE_GEMINI_API_KEY=your_gemini_key
# VITE_WEATHER_API_KEY=your_weather_key
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Start frontend (Tab 1)
npm run dev

# Start backend (Tab 2)
npm run server
```

The frontend will open at `http://localhost:5173` and the backend will run at `http://localhost:5000`

### API Keys (Optional)

The app works fully without API keys using intelligent mock data. For live AI/Map features:

| API | Get Key At | Used For |
|-----|-----------|----------|
| Google Gemini | [Google AI Studio](https://aistudio.google.com/) | Vision, Chat, Predictions |
| WeatherAPI | [weatherapi.com](https://www.weatherapi.com/) | Weather Forecasting |
| Google Maps | [GCP Console](https://console.cloud.google.com/) | Interactive Waste Facility Map |

## 🏗️ Architecture

```
agrisage/
├── src/               # Frontend source code
│   ├── components/    # Layout, Sidebar, Header, WasteCollectionMap
│   ├── context/       # AppContext (Auth state, Theme, Language)
│   ├── pages/         # Dashboard, Auth, Scanner, Advisor, Market, Sustainable, Learning Portal, etc.
│   ├── services/      # Gemini AI, Weather API, Local/Backend Sync
│   └── types/         # TypeScript interfaces
├── server/            # Backend Node/Express server
│   ├── index.js       # Express routes (Auth, Activities)
│   ├── db.js          # SQLite Schema & Connection
│   └── agrisage.db    # Persistent SQL Database
├── public/            # Static assets (logo, etc.)
├── package.json       # Dependencies & Scripts
└── vite.config.ts     # Frontend build config
```

## 🎨 Design System

- **Colors:** Sage (green), Harvest (gold), Earth (neutral)
- **Effects:** Glassmorphism, gradient cards, micro-animations
- **Accessibility:** High-contrast mode, icon-only navigation
- **Fonts:** Inter (body), Outfit (headings)
- **Theme:** Dark mode default with light mode toggle

## 🔄 Graceful Degradation

When API quotas are reached, AgriSage doesn't break:
- Shows **"High-Accuracy Regional Estimates"** with realistic mock data
- Displays an **API Status Banner** to inform the user
- Map shows a **decorative fallback** with static markers and instructions
- All data is cached in localStorage with **1-hour TTL**

---

## 🗺️ Roadmap: Beyond the MVP
*   **Phase 2**: IoT Soil Sensor integration for automated real-time alerts.
*   **Phase 3**: Blockchain-linked Carbon Credit verification system.
*   **Phase 4**: Expansion to 12+ regional languages with localized dialect support.

---

## 🧠 GenAffNet: Hyperspectral Diagnostic Engine

AgriSage implements the **GenAffNet**, a state-of-the-art inference engine based on our research paper for plant disease detection. It utilizes **Hyperspectral Imaging (HSI)** and **Generative AI** to provide precision diagnostics.

### 🛠️ The 4-Stage Workflow
The diagnostic pipeline is structured into four distinct phases as validated in our sugarbeet dataset:

1.  **Hyperspectral Preprocessing**: Automated PCA-based band reduction (from 224 to 96 bands) and 9×9 spatial patch extraction to eliminate redundancy.
2.  **DMLPFFN Architecture**: A hierarchical spectral-spatial fusion network using Global, Partition, and Local Perceptrons with dilated convolutions.
3.  **GenAI Augmentation**: Integration of a **Convolutional VAE (Variational Autoencoder)** to synthesize high-diversity spectral patterns, achieving **98.09% precision**.
4.  **Diagnostic Mapping**: Automated classification into four classes: Healthy/Early Stress, Fungal, Bacterial, and Viral-Nematode manifestations.

### 📊 Model Workflow
```mermaid
graph TD
    Cube[HSI Cube .NPY] --> PCA[PCA Band Reduction]
    PCA --> Patch[9x9x96 Patch Extraction]
    
    subgraph "DMLPFFN Block"
        Patch --> GP[Global Perceptron]
        Patch --> PP[Partition Perceptron]
        Patch --> LP[Local Perceptron]
        
        GP --> Fusion[Feature Fusion]
        PP --> Fusion
        LP --> Fusion
    end
    
    subgraph "VAE Augmentation"
        CVAE[Conv-VAE] --> Synth[Synthetic Patterns]
        Synth -.-> Fusion
    end
    
    Fusion --> Voting[Patch-Level Voting]
    Voting --> Classify{Diagnostic Result}
    
    Classify --> H[Healthy]
    Classify --> F[Fungal]
    Classify --> B[Bacterial]
    Classify --> V[Viral/Nematode]
```

🔗 **Full Research Code & Results**: [sugarbeet-genai Repository](https://github.com/TanayKapoor21/sugarbeet-genai)

---

## 🛠️ Tech Stack

- **Frontend:** React 18+ / TypeScript / Vite
- **Styling:** Tailwind CSS (Dark Mode, Responsive, Glassmorphism)
- **Animations:** Framer Motion
- **Backend:** Node.js / Express / JWT Authentication
- **Database:** SQLite (Persistent storage via `better-sqlite3`)
- **AI/ML:** Google Gemini 2.0 Flash + GenAffNet Deep Learning Model
- **Maps:** Google Maps JS API (@react-google-maps/api)
- **APIs:** Google Generative AI SDK, WeatherAPI.com, Web Speech API
- **Icons:** Lucide React
- **Storage:** Persisted SQLite for Users/Activities & LocalStorage with 1-hour TTL Caching

## 🔬 Research & Publications

### 🧪 Sugarbeet GenAI Research
AgriSage serves as the primary implementation platform for our research on **Precision Sugarbeet Cultivation**. Using an advanced iteration of the **GenAffNet (Agricultural Affinity Network)** deep learning model, we optimize nitrogen application and identify diseases with elite accuracy.

---

## 👥 The AgriSage Team

| Name | Primary Focus | Research Contribution |
| :--- | :--- | :--- |
| **Tanay Kapoor** | Core AI Architecture & Integration | Lead Model Training & DMLPFFN Optimization |
| **Akash Yadav** | System Logic & Data Pipeline | Hyperspectral Preprocessing & PCA Band Reduction |
| **Kanika Yadav** | UX Strategy & Frontend Design | UI Diagnostic Mapping & Stage-based Workflow |
| **Srasthti Chauhan** | Agricultural Intelligence & Data Analysis | Dataset Validation & Precision Metric Analysis |

### 📚 Guidance & Mentorship
Special thanks to **Dr. Anuradha Dhull** and **Dr. Asha Sohal** for their scientific guidance and agricultural insights.

---


## 📄 License

MIT License — Built with ❤️ for Indian Agriculture
