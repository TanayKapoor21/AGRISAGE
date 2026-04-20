// ─── Gemini AI Service ──────────────────────────────────────────
// Handles all interactions with Google Gemini 3 Flash Preview
// Includes fallback mock data for graceful degradation

import { GoogleGenerativeAI } from '@google/generative-ai'
import { CacheService } from './cache'
import type { ScanResult, CropRecommendation, MandiPrice, SoilType, PredictionInput, PredictionResult } from '../types'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const MODEL_NAME = 'gemini-1.5-flash'

let genAI: GoogleGenerativeAI | null = null
let apiAvailable = true

function getClient(): GoogleGenerativeAI | null {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    console.warn('[Gemini] No valid API key found. Using mock fallback.')
    return null
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY)
  }
  return genAI
}

async function generateJSON<T>(prompt: string, cacheKey?: string): Promise<T | null> {
  if (cacheKey) {
    const cached = CacheService.get<T>(cacheKey)
    if (cached) return cached
  }

  const client = getClient()
  if (!client || !apiAvailable) return null

  try {
    const model = client.getGenerativeModel({ model: MODEL_NAME })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('[Gemini] Response did not contain valid JSON:', text)
      return null
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0]
    const parsed = JSON.parse(jsonStr) as T

    if (cacheKey) {
      CacheService.set(cacheKey, parsed)
    }

    return parsed
  } catch (error: any) {
    console.error('[Gemini] Critical API error:', error.message || error)
    if (error?.status === 429 || error?.message?.includes('quota')) {
      apiAvailable = false
      setTimeout(() => { apiAvailable = true }, 60000)
    }
    return null
  }
}

// ─── Crop Scanner ───────────────────────────────────────────────

export async function analyzeCropImage(imageBase64: string, mimeType: string): Promise<ScanResult> {
  const client = getClient()
  
  if (client && apiAvailable) {
    try {
      const model = client.getGenerativeModel({ model: MODEL_NAME })
      const result = await model.generateContent([
        {
          inlineData: { data: imageBase64, mimeType },
        },
        `You are an expert agricultural scientist. Analyze this crop/plant image and return a JSON object with these fields:
        {
          "cropName": "common name",
          "scientificName": "latin name",
          "confidence": 0.0-1.0,
          "growthStage": "seedling/vegetative/flowering/fruiting/mature",
          "healthStatus": "healthy/mild_issue/severe_issue",
          "healthDetails": "detailed health analysis",
          "soilSuitability": {
            "ph": "optimal pH range",
            "nutrients": ["required nutrients"],
            "type": "best soil type"
          },
          "recommendations": ["actionable recommendation 1", "recommendation 2", "recommendation 3"]
        }
        Return ONLY valid JSON inside a code block.`,
      ])
      
      const text = result.response.text()
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
        return parsed as ScanResult
      }
    } catch (error) {
      console.warn('[Gemini] Vision error:', error)
    }
  }

  // Fallback mock result
  return getMockScanResult()
}

function getMockScanResult(): ScanResult {
  const crops = [
    {
      cropName: 'Rice (Paddy)',
      scientificName: 'Oryza sativa',
      confidence: 0.92,
      growthStage: 'vegetative',
      healthStatus: 'healthy' as const,
      healthDetails: 'The crop appears healthy with vibrant green coloration. Leaf tips show normal development. No visible signs of pest damage or nutrient deficiency.',
      soilSuitability: { ph: '5.5-6.5', nutrients: ['Nitrogen', 'Phosphorus', 'Potassium', 'Zinc'], type: 'Clay loam' },
      recommendations: ['Maintain standing water at 5cm depth', 'Apply urea at tillering stage', 'Monitor for stem borer activity'],
    },
    {
      cropName: 'Wheat',
      scientificName: 'Triticum aestivum',
      confidence: 0.88,
      growthStage: 'flowering',
      healthStatus: 'mild_issue' as const,
      healthDetails: 'Minor yellowing observed on lower leaves suggesting possible nitrogen deficiency. Overall plant structure is good with normal head development.',
      soilSuitability: { ph: '6.0-7.5', nutrients: ['Nitrogen', 'Phosphorus', 'Potassium'], type: 'Loamy soil' },
      recommendations: ['Apply foliar nitrogen spray', 'Ensure adequate irrigation during grain filling', 'Watch for rust disease signs'],
    },
    {
      cropName: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      confidence: 0.95,
      growthStage: 'fruiting',
      healthStatus: 'healthy' as const,
      healthDetails: 'Plants show excellent vigor with well-developed fruit clusters. Good branching pattern and healthy leaf coloration indicate optimal growing conditions.',
      soilSuitability: { ph: '6.0-6.8', nutrients: ['Calcium', 'Potassium', 'Phosphorus', 'Magnesium'], type: 'Sandy loam' },
      recommendations: ['Support plants with stakes', 'Apply calcium to prevent blossom end rot', 'Prune suckers for better airflow'],
    },
  ]
  return crops[Math.floor(Math.random() * crops.length)]
}

// ─── Voice Advisor / Chat ───────────────────────────────────────

// ─── Offline Knowledge Base ──────────────────────────────────────
const knowledgeBase: Record<string, { en: string, hi: string }> = {
  'pest_control': {
    en: 'For general pest control, integrated pest management (IPM) is best. Use neem oil spray (5ml per liter) for soft-bodied insects like aphids. Preserve natural predators like ladybugs.',
    hi: 'सामान्य कीट नियंत्रण के लिए, एकीकृत कीट प्रबंधन (IPM) सबसे अच्छा है। एफिड्स जैसे नरम शरीर वाले कीटों के लिए नीम के तेल का स्प्रे (5ml प्रति लीटर) उपयोग करें। लेडीबग्स जैसे प्राकृतिक शिकारियों को बचाएं।'
  },
  'organic_farming': {
    en: 'Organic farming relies on green manure, compost, and biological pest control. Avoid synthetic fertilizers. Use Jeevamrut to improve soil microbial activity.',
    hi: 'जैविक खेती हरी खाद, कंपोस्ट और जैविक कीट नियंत्रण पर निर्भर करती है। सिंथेटिक उर्वरकों से बचें। मिट्टी की सूक्ष्मजीवी गतिविधि सुधारने के लिए जीवामृत का उपयोग करें।'
  },
  'rice_tips': {
    en: 'Paddy requires standing water. Use SRI (System of Rice Intensification) to save water. Watch for Brown Plant Hopper and Stem Borer.',
    hi: 'धान को खड़े पानी की आवश्यकता होती है। पानी बचाने के लिए SRI (System of Rice Intensification) विधि अपनाएं। ब्राउन प्लांट हॉपर और तना छेदक पर नज़र रखें।'
  },
  'wheat_rust': {
    en: 'Wheat rust can be managed by resistant varieties. If symptoms appear, apply fungicides like Propiconazole early. Avoid over-irrigation during high humidity.',
    hi: 'गेहूं के रस्ट को प्रतिरोधी किस्मों द्वारा प्रबंधित किया जा सकता है। यदि लक्षण दिखाई दें, तो प्रोपिकोनाज़ोल जैसे कवकनाशी का जल्दी उपयोग करें।'
  },
  'irrigation': {
    en: 'Drip irrigation is the most efficient method, saving up to 60% water. Best for row crops and orchards to deliver water directly to roots.',
    hi: 'ड्रिप सिंचाई सबसे कुशल विधि है, जिससे 60% तक पानी की बचत होती है। पानी सीधे जड़ों तक पहुँचाने के लिए यह कतार वाली फसलों और बागों के लिए सबसे अच्छी है।'
  },
  'soil_testing': {
    en: 'Test your soil every 2 years. Collect samples in a zig-zag pattern from 6 inches deep. This helps in precise fertilizer application and cost saving.',
    hi: 'हर 2 साल में अपनी मिट्टी का परीक्षण कराएं। 6 इंच गहराई से ज़िग-ज़ैग पैटर्न में नमूने एकत्र करें। यह सटीक उर्वरक उपयोग और लागत बचाने में मदद करता है।'
  },
  'fertilizer_urea': {
    en: 'Overusing Urea can damage soil health and make crops more prone to pests. Use balanced NPK (Nitrogen, Phosphorus, Potassium) as per soil test reports.',
    hi: 'यूरिया का अधिक उपयोग मिट्टी के स्वास्थ्य को नुकसान पहुँचा सकता है और फसलों को कीटों के प्रति अधिक संवेदनशील बना सकता है। मिट्टी परीक्षण रिपोर्ट के अनुसार संतुलित NPK का उपयोग करें।'
  },
  'mustard_aphids': {
    en: 'Mustard aphids are active during cloudy weather. Use yellow sticky traps or spray Dimethoate 30 EC if population exceeds 10 per plant.',
    hi: 'सरसों के एफिड्स बादल वाले मौसम में सक्रिय होते हैं। पीले स्टिकी ट्रैप का उपयोग करें या यदि संख्या प्रति पौधा 10 से अधिक हो तो डाइमेथोएट 30 EC का छिड़काव करें।'
  },
  'cotton_bollworm': {
    en: 'Pink bollworm is a major cotton threat. Use pheromone traps to monitor and rotate crops with non-hosts like maize to break the cycle.',
    hi: 'गुलाबी सुंडी कपास के लिए एक बड़ा खतरा है। निगरानी के लिए फेरोमोन ट्रैप का उपयोग करें और चक्र को तोड़ने के लिए मक्का जैसी फसलों के साथ फसल चक्र अपनाएं।'
  },
  'tomato_blight': {
    en: 'Early and late blight in tomatoes can be prevented by proper spacing and avoiding overhead watering. Use Mancozeb if disease persists.',
    hi: 'टमाटर में अर्ली और लेट ब्लाइट को उचित दूरी और ऊपर से पानी देने से बचकर रोका जा सकता है। यदि बीमारी बनी रहती है तो मैनकोज़ेब का उपयोग करें।'
  },
  'mushroom_farming': {
    en: 'Mushroom farming needs controlled temperature and humidity. Oyster mushrooms are easiest for beginners and can be grown on wheat straw.',
    hi: 'मशरूम की खेती के लिए नियंत्रित तापमान और आर्द्रता की आवश्यकता होती है। शुरुआती लोगों के लिए ऑयस्टर मशरूम सबसे आसान है और इसे गेहूं के भूसे पर उगाया जा सकता है।'
  },
  'compost_making': {
    en: 'Layer green waste (nitrogen) and brown waste (carbon). Turn the pile weekly for aeration. Vermicompost using earthworms is much faster.',
    hi: 'गीला कचरा (नाइट्रोजन) और सूखा कचरा (कार्बन) की परतें बनाएं। हवा के संचार के लिए ढेर को साप्ताहिक रूप से पलटें। केंचुओं का उपयोग कर वर्मीकंपोस्ट बनाना बहुत तेज़ है।'
  },
  'neem_astra': {
    en: 'Neem-astra is a powerful organic pesticide. Mix 10kg neem leaves, 20L cow urine, and 2kg cow dung. Ferment for 48 hours and spray.',
    hi: 'नीम-अस्त्र एक शक्तिशाली जैविक कीटनाशक है। 10 किलो नीम की पत्तियां, 20 लीटर गोमूत्र और 2 किलो गाय का गोबर मिलाएं। 48 घंटे तक किण्वित करें और छिड़काव करें।'
  },
  'crop_rotation': {
    en: 'Never plant the same crop type twice. Rotate legumes like Moong or Gram with cereals to naturally restore soil nitrogen.',
    hi: 'एक ही प्रकार की फसल दोबारा न लगाएं। मिट्टी के नाइट्रोजन को प्राकृतिक रूप से बहाल करने के लिए मूंग या चने जैसी दलहनी फसलों को अनाज के साथ बदलें।'
  },
  'weather_impact': {
    en: 'Always watch the 5-day forecast. High wind speed means avoid spraying, and high humidity increases fungal disease risk.',
    hi: '항상 5일 예보를 확인하세요. 풍속이 높으면 छिड़काव से बचें, और उच्च आर्द्रता कवक रोगों के जोखिम को बढ़ाती है।'
  },
  'greetings': {
    en: 'Namaste! I am your AgriSage AI Advisor. How can I help you with your farming today?',
    hi: 'नमस्ते! मैं आपका एग्रीसेज एआई सलाहकार हूं। आज मैं आपकी खेती में कैसे मदद कर सकता हूं?'
  },
  'thanks': {
    en: 'You are very welcome! I am happy to help. Do you have any other questions about your crops?',
    hi: 'आपका बहुत-बहुत स्वागत है! मुझे मदद करके खुशी हुई। क्या आपके पास अपनी फसलों के बारे में कोई और सवाल है?'
  },
  'identity': {
    en: 'I am AgriSage, a smart AI assistant designed specifically for Indian farmers to help with crop disease, market prices, and modern farming techniques.',
    hi: 'मैं एग्रीसेज हूँ, एक स्मार्ट एआई सहायक जिसे विशेष रूप से भारतीय किसानों के लिए फसल रोगों, बाजार भाव और आधुनिक खेती की तकनीकों में मदद करने के लिए डिज़ाइन किया गया है।'
  },
  'well_being': {
    en: 'I am doing great, thank you for asking! I am always ready to help you grow better crops. How are you doing today?',
    hi: 'मैं बहुत अच्छा हूँ, पूछने के लिए धन्यवाद! मैं आपकी फसलों को बेहतर बनाने में मदद करने के लिए हमेशा तैयार हूँ। आप आज कैसे हैं?'
  }
}

const keywords: Record<string, string[]> = {
  'pest_control': ['pest', 'insect', 'spray', 'kill', 'keeda', 'pesticide'],
  'organic_farming': ['organic', 'jaivik', 'natural', 'jeevamrut'],
  'rice_tips': ['rice', 'paddy', 'dhan', 'chawal'],
  'wheat_rust': ['wheat', 'gehu', 'rust', 'yellow'],
  'irrigation': ['water', 'irrigation', 'drip', 'sprinkler', 'pani'],
  'soil_testing': ['soil', 'test', 'मिट्टी', 'sample'],
  'fertilizer_urea': ['urea', 'fertilizer', 'khad', 'npk'],
  'mustard_aphids': ['mustard', 'sarso', 'aphid', 'teli'],
  'cotton_bollworm': ['cotton', 'kapas', 'bollworm', 'sundi'],
  'tomato_blight': ['tomato', 'tamatar', 'blight', 'spot'],
  'mushroom_farming': ['mushroom', 'mashroom'],
  'compost_making': ['compost', 'khad', 'manure'],
  'neem_astra': ['neem', 'astra', 'biopesticide'],
  'crop_rotation': ['rotation', 'rotate', 'cycle'],
  'greetings': ['hi', 'hello', 'hey', 'namaste', 'morning', 'hallo'],
  'thanks': ['thank', 'shukriya', 'dhanyawad', 'thx'],
  'identity': ['who are you', 'your name', 'kon ho', 'what is agrisage'],
  'well_being': ['how are you', 'kaise ho', 'how do you do'],
}

export async function getAdvisorResponse(message: string, language: string = 'en', location: string = 'Karnal, Haryana'): Promise<string> {
  const query = message.toLowerCase()
  
  // 1. Check Offline Knowledge Base
  for (const [key, searchTerms] of Object.entries(keywords)) {
    if (searchTerms.some(term => query.includes(term))) {
      console.log(`[Advisor] Internal Match Found: ${key}`)
      return knowledgeBase[key][language as 'en' | 'hi'] || knowledgeBase[key]['en']
    }
  }

  // 2. Fallback to Gemini API
  const client = getClient()
  if (client && apiAvailable) {
    try {
      const model = client.getGenerativeModel({ model: MODEL_NAME })
      const langInstruction = language === 'hi'
        ? 'Respond in Hindi (Devanagari script). You are a friendly, knowledgeable agricultural advisor for Indian farmers.'
        : 'Respond in English. You are a friendly, knowledgeable agricultural advisor for Indian farmers.'

      const result = await model.generateContent(
        `${langInstruction}\n\nThe farmer is located in: ${location}\n\nThe farmer asks: "${message}"\n\nProvide a helpful, practical response specific to their location if relevant. Cover relevant aspects like timing, techniques, costs, or local wisdom. Keep it conversational and under 200 words.`
      )
      return result.response.text()
    } catch (error) {
      console.warn('[Gemini] Chat error:', error)
    }
  }

  // 3. Last Resort Fallback
  const fallbacks = language === 'hi'
    ? [
        'क्षमा करें, मैं अभी इस विशिष्ट विषय को नहीं समझ पा रहा हूँ। कृपया मिट्टी, कीट या सिंचाई के बारे में कुछ पूछें।',
        'नमस्ते किसान भाई! अभी मेरा ऑनलाइन संपर्क धीमा है, लेकिन आप हमारे लाइब्रेरी सेक्शन को देख सकते हैं।',
      ]
    : [
        'I am sorry, I am currently unable to provide a specific answer for this topic. Try asking about soil, pests, or irrigation.',
        'Hello farmer! My online connection is currently slow, but you can explore our library section for more guides.',
      ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

// ─── Market Intelligence ────────────────────────────────────────

export async function getMandiPrices(state: string = 'Haryana'): Promise<MandiPrice[]> {
  const cacheKey = `mandi_prices_${state}`
  const cached = CacheService.get<MandiPrice[]>(cacheKey)
  if (cached) return cached

  const data = await generateJSON<MandiPrice[]>(
    `Generate realistic current Mandi market prices for 12 common crops in ${state}, India. Return a JSON array where each item has:
    { "id": "unique_id", "crop": "name", "variety": "variety", "market": "market name", "state": "${state}", "minPrice": number, "maxPrice": number, "modalPrice": number, "unit": "quintal", "date": "today's date", "trend": "up/down/stable", "trendPercent": number }
    Use realistic 2025 price ranges in INR. Return ONLY valid JSON.`,
    cacheKey
  )

  if (data) return data
  return getMockMandiPrices(state)
}

function getMockMandiPrices(state: string): MandiPrice[] {
  const regionalData: Record<string, { crop: string, variety: string, markets: string[] }[]> = {
    'Haryana': [
      { crop: 'Basmati Rice', variety: 'CSR-30', markets: ['Karnal', 'Panipat', 'Kaithal'] },
      { crop: 'Wheat', variety: 'C-306', markets: ['Sirsa', 'Hisar', 'Rohtak', 'Hansi'] },
      { crop: 'Mustard', variety: 'RH-749', markets: ['Bhiwani', 'Rewari', 'Mahendragarh'] },
      { crop: 'Cotton', variety: 'BT Cotton', markets: ['Sirsa', 'Fatehabad'] },
      { crop: 'Sugarcane', variety: 'Co-0238', markets: ['Yamunanagar', 'Ambala'] },
    ],
    'Punjab': [
      { crop: 'Paddy', variety: 'PR-126', markets: ['Ludhiana', 'Amritsar', 'Moga'] },
      { crop: 'Wheat', variety: 'HD-2967', markets: ['Bathinda', 'Patiala', 'Sangrur'] },
      { crop: 'Maize', variety: 'Hybrid-92', markets: ['Jalandhar', 'Hoshiarpur'] },
      { crop: 'Kinnow', variety: 'Fresh', markets: ['Abohar', 'Fazilka'] },
    ],
    'Maharashtra': [
      { crop: 'Onion', variety: 'Nashik Red', markets: ['Lasalgaon', 'Pimpalgaon', 'Lonere'] },
      { crop: 'Turmeric', variety: 'Salem', markets: ['Sangli', 'Washim'] },
      { crop: 'Grapes', variety: 'Thompson Seedless', markets: ['Nashik', 'Tasgaon'] },
      { crop: 'Soybean', variety: 'JS-335', markets: ['Latur', 'Amravati', 'Nagpur'] },
    ],
    'Uttar Pradesh': [
      { crop: 'Sugarcane', variety: 'Co-0238', markets: ['Muzaffarnagar', 'Meerut', 'Sahranpur'] },
      { crop: 'Potato', variety: 'Kufri Bahar', markets: ['Agra', 'Farrukhabad'] },
      { crop: 'Mango', variety: 'Dasheri', markets: ['Lucknow', 'Malihabad'] },
      { crop: 'Rice', variety: 'Samba Masuri', markets: ['Varanasi', 'Gorakhpur'] },
    ],
    'Rajasthan': [
      { crop: 'Bajra', variety: 'Hybrid', markets: ['Jodhpur', 'Nagaur', 'Barmer'] },
      { crop: 'Guar Seed', variety: 'Local', markets: ['Bikaner', 'Sriganganagar'] },
      { crop: 'Cumin (Jeera)', variety: 'Unjha Selection', markets: ['Jalore', 'Nagaur'] },
      { crop: 'Mustard', variety: 'Pusa Bold', markets: ['Alwar', 'Bharatpur'] },
    ],
    'Madhya Pradesh': [
      { crop: 'Soybean', variety: 'Yellow', markets: ['Indore', 'Ujjain', 'Dewas'] },
      { crop: 'Gram (Chana)', variety: 'Desi', markets: ['Vidisha', 'Sagar'] },
      { crop: 'Garlic', variety: 'G-282', markets: ['Mandsaur', 'Neemuch'] },
      { crop: 'Wheat', variety: 'Sharbati', markets: ['Sehore', 'Hoshangabad'] },
    ],
    'Gujarat': [
      { crop: 'Groundnut', variety: 'G-20', markets: ['Gondal', 'Rajkot', 'Junagadh'] },
      { crop: 'Cotton', variety: 'Shankar-6', markets: ['Kadi', 'Amreli'] },
      { crop: 'Castor Seed', variety: 'Hybrid', markets: ['Deesa', 'Palanpur'] },
      { crop: 'Cumin', variety: 'Abu', markets: ['Unjha', 'Tharad'] },
    ],
    'Karnataka': [
      { crop: 'Ragi', variety: 'Local', markets: ['Tumakuru', 'Mysuru', 'Hassan'] },
      { crop: 'Coffee (Robusta)', variety: 'Cherry', markets: ['Chikkamagaluru', 'Kodagu'] },
      { crop: 'Areca Nut', variety: 'Rashi', markets: ['Shimoga', 'Sirsi'] },
      { crop: 'Tur', variety: 'Gulyal', markets: ['Kalaburagi', 'Yadgir'] },
    ],
    'Tamil Nadu': [
      { crop: 'Banana', variety: 'Poovan', markets: ['Trichy', 'Theni', 'Erode'] },
      { crop: 'Turmeric', variety: 'Erode Local', markets: ['Erode', 'Salem'] },
      { crop: 'Coconut', variety: 'Tall', markets: ['Pollachi', 'Thanjavur'] },
      { crop: 'Paddy', variety: 'Ponni', markets: ['Madurai', 'Kumbakonam'] },
    ],
    'West Bengal': [
      { crop: 'Jute', variety: 'TD-5', markets: ['Nadia', 'Murshidabad', 'Barrackpore'] },
      { crop: 'Rice (Paddy)', variety: 'Swarna', markets: ['Burdwan', 'Midnapore'] },
      { crop: 'Potato', variety: 'Jyoti', markets: ['Hooghly', 'Burdwan'] },
    ]
  }

  const defaultCrops = [
    { crop: 'Rice', variety: 'Common', markets: ['Local Mandi'] },
    { crop: 'Wheat', variety: 'General', markets: ['Local Mandi'] },
    { crop: 'Tomato', variety: 'Hybrid', markets: ['Local Mandi'] },
    { crop: 'Onion', variety: 'General', markets: ['Local Mandi'] },
  ]

  const data = regionalData[state] || defaultCrops
  const today = new Date().toISOString().split('T')[0]

  return data.map((item, i) => {
    const minPrice = 1500 + Math.floor(Math.random() * 5000)
    return {
      id: `mandi_${state}_${i}`,
      crop: item.crop,
      variety: item.variety,
      market: item.markets[Math.floor(Math.random() * item.markets.length)],
      state,
      minPrice,
      maxPrice: minPrice + 500,
      modalPrice: minPrice + 250,
      unit: '₹/quintal',
      date: today,
      trend: Math.random() > 0.5 ? 'up' : 'down' as any,
      trendPercent: +(Math.random() * 8).toFixed(1),
      isEstimate: true
    }
  })
}

// ─── Crop Advisory ──────────────────────────────────────────────

export async function getCropRecommendations(soilType: SoilType, location: string): Promise<CropRecommendation[]> {
  const cacheKey = `crop_rec_${soilType}_${location}`
  const cached = CacheService.get<CropRecommendation[]>(cacheKey)
  if (cached) return cached

  const data = await generateJSON<CropRecommendation[]>(
    `As an expert agricultural advisor, recommend 8 crops suitable for "${soilType}" soil in "${location}", India. Return a JSON array:
    [{ "id": "unique", "name": "crop name", "season": "kharif/rabi/zaid", "suitability": 0.0-1.0, "waterNeeds": "low/medium/high", "growthDuration": "X-Y days", "expectedYield": "X quintal/acre", "marketDemand": "low/medium/high", "tips": ["tip1", "tip2"] }]
    Return ONLY valid JSON.`,
    cacheKey
  )

  if (data) return data
  return getMockCropRecommendations(soilType)
}

function getMockCropRecommendations(soilType: SoilType): CropRecommendation[] {
  const baseRecs: Record<SoilType, CropRecommendation[]> = {
    alluvial: [
      { id: '1', name: 'Rice', season: 'kharif', suitability: 0.95, waterNeeds: 'high', growthDuration: '120-150 days', expectedYield: '20-25 quintal/acre', marketDemand: 'high', tips: ['Transplant seedlings at 21 days', 'Maintain 5cm water level'] },
      { id: '2', name: 'Wheat', season: 'rabi', suitability: 0.92, waterNeeds: 'medium', growthDuration: '120-140 days', expectedYield: '18-22 quintal/acre', marketDemand: 'high', tips: ['Sow by mid-November', 'Apply 3 irrigations at critical stages'] },
      { id: '3', name: 'Sugarcane', season: 'kharif', suitability: 0.88, waterNeeds: 'high', growthDuration: '270-365 days', expectedYield: '300-400 quintal/acre', marketDemand: 'high', tips: ['Plant sets horizontally', 'Earthing up is essential'] },
      { id: '4', name: 'Maize', season: 'kharif', suitability: 0.85, waterNeeds: 'medium', growthDuration: '90-120 days', expectedYield: '15-20 quintal/acre', marketDemand: 'medium', tips: ['Optimal spacing 60x20cm', 'Top dress nitrogen at knee-high stage'] },
    ],
    black_cotton: [
      { id: '1', name: 'Cotton', season: 'kharif', suitability: 0.96, waterNeeds: 'medium', growthDuration: '150-180 days', expectedYield: '8-12 quintal/acre', marketDemand: 'high', tips: ['Adopt high density planting', 'IPM for bollworm control'] },
      { id: '2', name: 'Soybean', season: 'kharif', suitability: 0.93, waterNeeds: 'medium', growthDuration: '90-120 days', expectedYield: '8-12 quintal/acre', marketDemand: 'high', tips: ['Seed treatment with Rhizobium', 'Avoid waterlogging'] },
      { id: '3', name: 'Chickpea', season: 'rabi', suitability: 0.90, waterNeeds: 'low', growthDuration: '90-120 days', expectedYield: '6-10 quintal/acre', marketDemand: 'high', tips: ['Sow by October end', 'One irrigation at flowering'] },
      { id: '4', name: 'Sorghum', season: 'kharif', suitability: 0.87, waterNeeds: 'low', growthDuration: '100-120 days', expectedYield: '10-15 quintal/acre', marketDemand: 'medium', tips: ['Dryland crop ideal for rainfed areas', 'Intercrop with pigeon pea'] },
    ],
    red: [
      { id: '1', name: 'Groundnut', season: 'kharif', suitability: 0.94, waterNeeds: 'medium', growthDuration: '100-130 days', expectedYield: '10-15 quintal/acre', marketDemand: 'high', tips: ['Apply gypsum at flowering', 'Harvest at optimal maturity'] },
      { id: '2', name: 'Finger Millet (Ragi)', season: 'kharif', suitability: 0.91, waterNeeds: 'low', growthDuration: '90-120 days', expectedYield: '8-12 quintal/acre', marketDemand: 'medium', tips: ['Transplant at 25-30 days', 'Excellent nutritional crop'] },
      { id: '3', name: 'Tomato', season: 'rabi', suitability: 0.88, waterNeeds: 'medium', growthDuration: '60-90 days', expectedYield: '80-120 quintal/acre', marketDemand: 'high', tips: ['Stake and prune for better yield', 'Drip irrigation recommended'] },
      { id: '4', name: 'Sunflower', season: 'rabi', suitability: 0.84, waterNeeds: 'low', growthDuration: '80-100 days', expectedYield: '5-8 quintal/acre', marketDemand: 'medium', tips: ['Excellent oilseed crop for red soil', 'Plant facing east for sun tracking'] },
    ],
    laterite: [
      { id: '1', name: 'Cashew', season: 'kharif', suitability: 0.95, waterNeeds: 'low', growthDuration: 'Perennial', expectedYield: '5-8 quintal/acre', marketDemand: 'high', tips: ['Prune annually after harvest', 'Apply fertilizer in June'] },
      { id: '2', name: 'Coconut', season: 'kharif', suitability: 0.92, waterNeeds: 'medium', growthDuration: 'Perennial', expectedYield: '100-150 nuts/tree', marketDemand: 'high', tips: ['Basin management is key', 'Intercrop with cocoa or pepper'] },
      { id: '3', name: 'Pepper', season: 'kharif', suitability: 0.88, waterNeeds: 'medium', growthDuration: 'Perennial', expectedYield: '2-3 quintal/acre', marketDemand: 'high', tips: ['Train on shade trees', 'Mulch heavily during summer'] },
      { id: '4', name: 'Rubber', season: 'kharif', suitability: 0.85, waterNeeds: 'high', growthDuration: 'Perennial', expectedYield: '1500-2000 kg/acre', marketDemand: 'medium', tips: ['Tapping starts at 6-7 years', 'Guard against leaf blight'] },
    ],
    desert: [
      { id: '1', name: 'Bajra (Pearl Millet)', season: 'kharif', suitability: 0.96, waterNeeds: 'low', growthDuration: '70-90 days', expectedYield: '8-12 quintal/acre', marketDemand: 'medium', tips: ['Most drought tolerant cereal', 'Ideal for sandy soils'] },
      { id: '2', name: 'Guar (Cluster Bean)', season: 'kharif', suitability: 0.93, waterNeeds: 'low', growthDuration: '90-120 days', expectedYield: '5-8 quintal/acre', marketDemand: 'high', tips: ['Excellent for guar gum industry', 'Nitrogen fixing crop'] },
      { id: '3', name: 'Cumin', season: 'rabi', suitability: 0.90, waterNeeds: 'low', growthDuration: '100-120 days', expectedYield: '2-4 quintal/acre', marketDemand: 'high', tips: ['Frost sensitive at flowering', 'High value spice crop'] },
      { id: '4', name: 'Mustard', season: 'rabi', suitability: 0.87, waterNeeds: 'low', growthDuration: '100-130 days', expectedYield: '6-10 quintal/acre', marketDemand: 'high', tips: ['Major oilseed of Rajasthan', 'One irrigation at flowering critical'] },
    ],
    mountain: [
      { id: '1', name: 'Apple', season: 'rabi', suitability: 0.95, waterNeeds: 'medium', growthDuration: 'Perennial', expectedYield: '40-60 quintal/acre', marketDemand: 'high', tips: ['Requires chilling hours below 7°C', 'Cross-pollination essential'] },
      { id: '2', name: 'Potato', season: 'kharif', suitability: 0.92, waterNeeds: 'medium', growthDuration: '90-120 days', expectedYield: '80-120 quintal/acre', marketDemand: 'high', tips: ['Hill potatoes fetch premium', 'Earth up at 30 and 45 days'] },
      { id: '3', name: 'Large Cardamom', season: 'kharif', suitability: 0.88, waterNeeds: 'high', growthDuration: 'Perennial', expectedYield: '1-2 quintal/acre', marketDemand: 'high', tips: ['Shade loving crop', 'Organic cultivation preferred'] },
      { id: '4', name: 'Kidney Bean (Rajma)', season: 'kharif', suitability: 0.85, waterNeeds: 'medium', growthDuration: '90-120 days', expectedYield: '5-8 quintal/acre', marketDemand: 'high', tips: ['Premium prices for hill rajma', 'Inoculate with Rhizobium'] },
    ],
    saline: [
      { id: '1', name: 'Barley', season: 'rabi', suitability: 0.93, waterNeeds: 'low', growthDuration: '100-130 days', expectedYield: '12-18 quintal/acre', marketDemand: 'medium', tips: ['Most salt-tolerant cereal', 'Good for reclaiming saline soils'] },
      { id: '2', name: 'Safflower', season: 'rabi', suitability: 0.88, waterNeeds: 'low', growthDuration: '120-150 days', expectedYield: '4-6 quintal/acre', marketDemand: 'medium', tips: ['Deep tap root tolerates salinity', 'Good oilseed option'] },
      { id: '3', name: 'Date Palm', season: 'kharif', suitability: 0.90, waterNeeds: 'low', growthDuration: 'Perennial', expectedYield: '30-50 quintal/acre', marketDemand: 'high', tips: ['Excellent for saline-alkaline soils', 'High value fruit crop'] },
      { id: '4', name: 'Spinach (Palak)', season: 'rabi', suitability: 0.82, waterNeeds: 'medium', growthDuration: '30-45 days', expectedYield: '40-60 quintal/acre', marketDemand: 'medium', tips: ['Moderately salt tolerant', 'Quick cash crop option'] },
    ],
  }

  return baseRecs[soilType] || baseRecs.alluvial
}

// ─── GenAffNet Predictions ──────────────────────────────────────

export async function getGenAffNetPrediction(input: PredictionInput): Promise<PredictionResult[]> {
  const cacheKey = `genaffnet_${JSON.stringify(input)}`
  const cached = CacheService.get<PredictionResult[]>(cacheKey)
  if (cached) return cached

  const data = await generateJSON<PredictionResult[]>(
    `You are GenAffNet, an advanced agricultural deep learning model. Given these soil parameters:
    - Soil Type: ${input.soilType}
    - Temperature: ${input.temperature}°C
    - Rainfall: ${input.rainfall}mm
    - Humidity: ${input.humidity}%
    - Soil pH: ${input.ph}
    - Nitrogen: ${input.nitrogen} kg/ha
    - Phosphorus: ${input.phosphorus} kg/ha
    - Potassium: ${input.potassium} kg/ha
    
    Return a JSON array of the top 5 recommended crops with yield predictions:
    [{ "crop": "name", "yieldPrediction": quintal_per_hectare, "confidence": 0.0-1.0, "affinityScore": 0.0-1.0, "riskLevel": "low/medium/high", "factors": [{"name": "factor name", "impact": -1.0 to 1.0}] }]
    Return ONLY valid JSON.`,
    cacheKey
  )

  if (data) return data
  return getMockPredictions(input)
}

function getMockPredictions(input: PredictionInput): PredictionResult[] {
  const baseYield = (input.nitrogen + input.phosphorus + input.potassium) / 10
  
  return [
    {
      crop: 'Rice',
      yieldPrediction: Math.round(baseYield * 1.2 + input.rainfall * 0.01),
      confidence: 0.91,
      affinityScore: 0.88,
      riskLevel: input.rainfall > 1000 ? 'low' : 'medium',
      factors: [
        { name: 'Rainfall', impact: 0.85 },
        { name: 'Nitrogen', impact: 0.72 },
        { name: 'Temperature', impact: input.temperature > 25 ? 0.65 : -0.3 },
        { name: 'Soil pH', impact: input.ph >= 5.5 && input.ph <= 6.5 ? 0.80 : -0.4 },
      ],
    },
    {
      crop: 'Wheat',
      yieldPrediction: Math.round(baseYield * 0.9 + 15),
      confidence: 0.87,
      affinityScore: 0.82,
      riskLevel: input.temperature > 30 ? 'high' : 'low',
      factors: [
        { name: 'Temperature', impact: input.temperature < 25 ? 0.90 : -0.5 },
        { name: 'Phosphorus', impact: 0.78 },
        { name: 'Soil pH', impact: input.ph >= 6.0 && input.ph <= 7.5 ? 0.85 : -0.3 },
        { name: 'Humidity', impact: -0.2 },
      ],
    },
    {
      crop: 'Maize',
      yieldPrediction: Math.round(baseYield * 1.1 + 10),
      confidence: 0.84,
      affinityScore: 0.79,
      riskLevel: 'medium',
      factors: [
        { name: 'Nitrogen', impact: 0.88 },
        { name: 'Rainfall', impact: 0.65 },
        { name: 'Potassium', impact: 0.58 },
        { name: 'Temperature', impact: 0.45 },
      ],
    },
    {
      crop: 'Soybean',
      yieldPrediction: Math.round(baseYield * 0.6 + 8),
      confidence: 0.80,
      affinityScore: 0.75,
      riskLevel: 'low',
      factors: [
        { name: 'Phosphorus', impact: 0.82 },
        { name: 'Soil pH', impact: 0.70 },
        { name: 'Humidity', impact: 0.55 },
        { name: 'Nitrogen', impact: 0.30 },
      ],
    },
    {
      crop: 'Cotton',
      yieldPrediction: Math.round(baseYield * 0.5 + 6),
      confidence: 0.76,
      affinityScore: 0.71,
      riskLevel: input.rainfall > 800 ? 'medium' : 'low',
      factors: [
        { name: 'Temperature', impact: 0.88 },
        { name: 'Potassium', impact: 0.75 },
        { name: 'Rainfall', impact: -0.3 },
        { name: 'Nitrogen', impact: 0.60 },
      ],
    },
  ]
}

// ─── Utility ────────────────────────────────────────────────────

export function isGeminiAvailable(): boolean {
  return Boolean(API_KEY && API_KEY !== 'your_gemini_api_key_here' && apiAvailable)
}
