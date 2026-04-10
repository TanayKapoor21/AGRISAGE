# 🌿 AgriSage

> **AI-Powered Agricultural Operating System** for the Indian Farming Ecosystem

AgriSage is a unified, intelligent farming platform that integrates computer vision, real-time market intelligence, voice-enabled AI, and deep learning to empower farmers with actionable insights, yield optimization, and sustainable practices.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📸 **Smart Crop Scanner** | AI-powered crop identification and health diagnosis using Gemini Vision |
| 🎤 **Voice AI Advisor** | Multilingual chatbot (English/Hindi) with hands-free voice input |
| 📊 **Market Intelligence** | Real-time Mandi prices, trend analysis, and weather forecasting |
| 🌱 **Crop Advisory Engine** | Soil-specific and location-based planting recommendations |
| ♻️ **Sustainable Portal** | Carbon credit tracking and agricultural waste exchange |
| 📚 **Agricultural Library** | Step-by-step planting guides for major Indian crops |
| 🧠 **GenAffNet Hub** | Deep learning analytics for predictive farming and yield prediction |

## 🛠️ Tech Stack

- **Frontend:** React 18+ / TypeScript / Vite
- **Styling:** Tailwind CSS (Dark Mode, Responsive, Glassmorphism)
- **Animations:** Framer Motion
- **AI/ML:** Google Gemini 2.0 Flash + GenAffNet Deep Learning Model
- **APIs:** Google Generative AI SDK, WeatherAPI.com, Web Speech API
- **Icons:** Lucide React
- **Storage:** LocalStorage with 1-hour TTL Caching

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

# Copy environment variables
cp .env.example .env

# Add your API keys in .env
# VITE_GEMINI_API_KEY=your_gemini_key
# VITE_WEATHER_API_KEY=your_weather_key

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### API Keys (Optional)

The app works fully without API keys using intelligent mock data. For live AI features:

| API | Get Key At | Used For |
|-----|-----------|----------|
| Google Gemini | [Google AI Studio](https://aistudio.google.com/) | Vision, Chat, Predictions |
| WeatherAPI | [weatherapi.com](https://www.weatherapi.com/) | Weather Forecasting |

## 🏗️ Architecture

```
src/
├── components/        # Layout, Sidebar, Header, ApiStatusBanner
├── context/           # AppContext (Theme, Language, API Status)
├── pages/             # Dashboard, Scanner, Advisor, Market, etc.
├── services/          # Gemini AI, Weather API, Speech, Cache, DB
├── types/             # TypeScript interfaces
├── App.tsx            # Router & Routes
├── main.tsx           # Entry point
└── index.css          # Tailwind + Design System
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
- All data is cached in localStorage with **1-hour TTL**

## 📄 License

MIT License — Built with ❤️ for Indian Agriculture
