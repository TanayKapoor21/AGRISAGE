// ─── Weather API Service ────────────────────────────────────────
// Uses WeatherAPI.com with caching and fallback data

import { CacheService } from './cache'
import type { WeatherData } from '../types'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ''
const BASE_URL = 'https://api.weatherapi.com/v1'

export async function getWeather(location: string = 'Mumbai'): Promise<WeatherData> {
  const cacheKey = `weather_${location.toLowerCase().replace(/\s+/g, '_')}`
  const cached = CacheService.get<WeatherData>(cacheKey)
  if (cached) return cached

  if (API_KEY && API_KEY !== 'your_weather_api_key_here') {
    try {
      const res = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no`
      )
      
      if (!res.ok) throw new Error(`Weather API error: ${res.status}`)

      const data = await res.json()
      const weather: WeatherData = {
        location: data.location.name,
        tempC: data.current.temp_c,
        feelsLikeC: data.current.feelslike_c,
        humidity: data.current.humidity,
        condition: data.current.condition.text,
        conditionIcon: data.current.condition.icon,
        windKph: data.current.wind_kph,
        windDir: data.current.wind_dir,
        precipMm: data.current.precip_mm,
        uv: data.current.uv,
        forecast: data.forecast.forecastday.map((d: any) => ({
          date: d.date,
          maxTempC: d.day.maxtemp_c,
          minTempC: d.day.mintemp_c,
          condition: d.day.condition.text,
          conditionIcon: d.day.condition.icon,
          chanceOfRain: d.day.daily_chance_of_rain,
        })),
      }

      CacheService.set(cacheKey, weather)
      return weather
    } catch (error) {
      console.warn('[Weather] API error:', error)
    }
  }

  return getMockWeather(location)
}

function getMockWeather(location: string): WeatherData {
  const conditions = ['Partly Cloudy', 'Sunny', 'Clear', 'Overcast', 'Light Rain']
  const baseTemp = 28 + Math.random() * 8

  const forecast = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      date: date.toISOString().split('T')[0],
      maxTempC: Math.round(baseTemp + Math.random() * 5),
      minTempC: Math.round(baseTemp - 5 - Math.random() * 3),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      conditionIcon: '',
      chanceOfRain: Math.round(Math.random() * 60),
    }
  })

  return {
    location: location || 'Mumbai',
    tempC: Math.round(baseTemp),
    feelsLikeC: Math.round(baseTemp + 2),
    humidity: 55 + Math.round(Math.random() * 30),
    condition: conditions[0],
    conditionIcon: '',
    windKph: 8 + Math.round(Math.random() * 15),
    windDir: 'SW',
    precipMm: Math.round(Math.random() * 5),
    uv: 6 + Math.round(Math.random() * 4),
    forecast,
  }
}

export function isWeatherAvailable(): boolean {
  return Boolean(API_KEY && API_KEY !== 'your_weather_api_key_here')
}
