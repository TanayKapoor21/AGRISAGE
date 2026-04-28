import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Search, Sprout, Leaf, Wind, Droplets,
  Calendar, CheckCircle2, AlertTriangle, Bug,
  ChevronRight, Info, Award, Star, Clock, ArrowRight,
  TrendingUp, Activity, ExternalLink, Filter, ChevronDown
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { CropGuide } from '../types'

const translations = {
  hi: {
    title: 'कृषि पुस्तकालय',
    subtitle: 'Staple फसलों के लिए चरण-दर-चरण रोपण गाइड',
    searchPlaceholder: 'फसल या विषय खोजें...',
    steps: 'रोपण के चरण',
    tips: 'प्रो टिप्स',
    pests: 'सामान्य कीट',
    diseases: 'रोग',
    noGuides: 'आपके खोज से मेल खाने वाली कोई गाइड नहीं मिली।',
    stepsCount: 'चरण',
    categories: {
      All: 'सभी',
      Cereals: 'अनाज',
      'Fiber Crops': 'रेशे वाली फसलें',
      Vegetables: 'सब्जियाँ',
      'Cash Crops': 'नकदी फसलें'
    }
  },
  en: {
    title: 'Agricultural Library',
    subtitle: 'Structured, step-by-step planting guides for major Indian crops',
    searchPlaceholder: 'Search crops or topics...',
    steps: 'Planting Steps',
    tips: 'Pro Tips',
    pests: 'Common Pests',
    diseases: 'Diseases',
    noGuides: 'No guides found matching your search.',
    stepsCount: 'steps',
    categories: {
      All: 'All',
      Cereals: 'Cereals',
      'Fiber Crops': 'Fiber Crops',
      Vegetables: 'Vegetables',
      'Cash Crops': 'Cash Crops'
    }
  },
  pa: {
    title: 'ਖੇਤੀਬਾੜੀ ਲਾਇਬ੍ਰੇਰੀ',
    subtitle: 'ਮੁੱਖ ਭਾਰਤੀ ਫਸਲਾਂ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਬੀਜਣ ਗਾਈਡ',
    searchPlaceholder: 'ਫਸਲਾਂ ਜਾਂ ਵਿਸ਼ੇ ਖੋਜੋ...',
    steps: 'ਬੀਜਣ ਦੇ ਕਦਮ',
    tips: 'ਪ੍ਰੋ ਸੁਝਾਅ',
    pests: 'ਆਮ ਕੀੜੇ',
    diseases: 'ਬਿਮਾਰੀਆਂ',
    noGuides: 'ਕੋਈ ਗਾਈਡ ਨਹੀਂ ਮਿਲੀ।',
    stepsCount: 'ਕਦਮ',
    categories: { All: 'ਸਾਰੇ', Cereals: 'ਅਨਾਜ', 'Fiber Crops': 'ਰੇਸ਼ੇ ਵਾਲੀਆਂ ਫਸਲਾਂ', Vegetables: 'ਸਬਜ਼ੀਆਂ', 'Cash Crops': 'ਨਕਦੀ ਫਸਲਾਂ' }
  },
  mr: {
    title: 'कृषी ग्रंथालय',
    subtitle: 'मुख्य भारतीय पिकांसाठी टप्प्याटप्प्याने लागवड मार्गदर्शक',
    searchPlaceholder: 'पिके किंवा विषय शोधा...',
    steps: 'लागवडीचे टप्पे',
    tips: 'प्रो टिप्स',
    pests: 'सामान्य कीटक',
    diseases: 'रोग',
    noGuides: 'कोणतेही मार्गदर्शक आढळले नाही.',
    stepsCount: 'टप्पे',
    categories: { All: 'सर्व', Cereals: 'तृणधान्ये', 'Fiber Crops': 'फायबर पिके', Vegetables: 'भाज्या', 'Cash Crops': 'नगदी पिके' }
  },
  ta: {
    title: 'வேளாண் நூலகம்',
    subtitle: 'முக்கிய இந்திய பயிர்களுக்கான படிப்படியான நடவு வழிகாட்டி',
    searchPlaceholder: 'பயிர்கள் அல்லது தலைப்புகளைத் தேடுங்கள்...',
    steps: 'நடவு படிகள்',
    tips: 'ப்ரோ குறிப்புகள்',
    pests: 'பொதுவான பூச்சிகள்',
    diseases: 'நோய்கள்',
    noGuides: 'வழிகாட்டிகள் கிடைக்கவில்லை.',
    stepsCount: 'படிகள்',
    categories: { All: 'அனைத்தும்', Cereals: 'தானியங்கள்', 'Fiber Crops': 'நார் பயிர்கள்', Vegetables: 'காய்கறிகள்', 'Cash Crops': 'பணப்பயிர்கள்' }
  },
  te: {
    title: 'వ్యవసాయ లైబ్రరీ',
    subtitle: 'ప్రధాన భారతీయ పంటల కోసం దశల వారీ నాటడం మార్గదర్శకాలు',
    searchPlaceholder: 'పంటలు లేదా అంశాలను శోధించండి...',
    steps: 'నాటడం దశలు',
    tips: 'ప్రో చిట్కాలు',
    pests: 'సాధారణ తెగుళ్లు',
    diseases: 'వ్యాధులు',
    noGuides: 'మార్గదర్శకాలు కనుగొనబడలేదు.',
    stepsCount: 'దశలు',
    categories: { All: 'అన్ని', Cereals: 'తృణధాన్యాలు', 'Fiber Crops': 'ఫైబర్ పంటలు', Vegetables: 'కూరగాయలు', 'Cash Crops': 'నగదు పంటలు' }
  },
  kn: {
    title: 'ಕೃಷಿ ಗ್ರಂಥಾಲಯ',
    subtitle: 'ಪ್ರಮುಖ ಭಾರತೀಯ ಬೆಳೆಗಳಿಗೆ ಹಂತ ಹಂತದ ನೆಡುವಿಕೆ ಮಾರ್ಗದರ್ಶಿಗಳು',
    searchPlaceholder: 'ಬೆಳೆಗಳು ಅಥವಾ ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ...',
    steps: 'ನೆಡುವಿಕೆ ಹಂತಗಳು',
    tips: 'ಪ್ರೊ ಸಲಹೆಗಳು',
    pests: 'ಸಾಮಾನ್ಯ ಕೀಟಗಳು',
    diseases: 'ರೋಗಗಳು',
    noGuides: 'ಯಾವುದೇ ಮಾರ್ಗದರ್ಶಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    stepsCount: 'ಹಂತಗಳು',
    categories: { All: 'ಎಲ್ಲಾ', Cereals: 'ಧಾನ್ಯಗಳು', 'Fiber Crops': 'ಫೈಬರ್ ಬೆಳೆಗಳು', Vegetables: 'ತರಕಾರಿಗಳು', 'Cash Crops': 'ನಗದು ಬೆಳೆಗಳು' }
  }
}

// ─── Crop Library Data ──────────────────────────────────────────

const cropGuides: Record<'en' | 'hi', CropGuide[]> = {
  en: [
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
  ],
  hi: [
    {
      id: '1', name: 'चावल (धान)', category: 'Cereals', season: 'खरीफ (जून-नवंबर)', image: '🌾',
      description: 'भारत की मुख्य खाद्य फसल जिसे प्रचुर मात्रा में पानी के साथ गर्म, आर्द्र जलवायु की आवश्यकता होती है। मुख्य उत्पादक राज्यों में पश्चिम बंगाल, यूपी, पंजाब शामिल हैं।',
      steps: [
        { order: 1, title: 'नर्सरी की तैयारी', description: 'उठी हुई क्यारियां तैयार करें, बीजों को 24 घंटे के लिए भिगो दें, नर्सरी में बोएं। क्यारियों को नम रखें।', duration: '21-25 दिन' },
        { order: 2, title: 'मुख्य खेत की तैयारी', description: 'खेत की जुताई और कद्दू (puddling) करें। उर्वरकों की आधार खुराक डालें। खेत को समतल करें।', duration: '3-5 दिन' },
        { order: 3, title: 'रोपाई', description: '21 दिन पुराने पौधों की 2-3 प्रति पहाड़ी (hill) पर रोपाई करें। दूरी: 20x15 सेमी।', duration: '1-2 दिन' },
        { order: 4, title: 'जल प्रबंधन', description: '5 सेमी खड़ा पानी बनाए रखें। नाइट्रोजन डालने से पहले पानी निकाल दें।', duration: 'निरंतर' },
        { order: 5, title: 'कटाई', description: 'कटाई तब करें जब 80% दाने सुनहरे हो जाएं। जमीनी स्तर पर काटें।', duration: 'बुआई से 120-150 दिन' },
      ],
      tips: ['20-30% पानी की बचत के लिए श्री विधि (SRI) का उपयोग करें', 'जस्ता की कमी वाली मिट्टी में 25 किलो/हेक्टेयर जिंक सल्फेट डालें', 'श्रम बचाने के लिए सीधी बुआई के लिए ड्रम सीडर का उपयोग करें'],
      pests: ['तना छेदक', 'भूरा पौधा फुदका', 'पत्ती लपेटक', 'राइस ब्लास्ट'],
      diseases: ['ब्लास्ट', 'बैक्टीरियल लीफ ब्लाइट', 'शीथ ब्लाइट', 'फाल्स स्मट'],
    },
    {
      id: '2', name: 'गेहूं', category: 'Cereals', season: 'रबी (नवंबर-अप्रैल)', image: '🌿',
      description: 'भारत की दूसरी सबसे महत्वपूर्ण अनाज फसल। विकास के दौरान ठंडी जलवायु और पकने के दौरान गर्म, शुष्क मौसम की आवश्यकता होती है।',
      steps: [
        { order: 1, title: 'खेत की तैयारी', description: 'गहरी जुताई के बाद 2-3 हैरोइंग। अच्छे अंकुरण के लिए मिट्टी का बारीक होना आवश्यक है।', duration: '5-7 दिन' },
        { order: 2, title: 'बीज उपचार और बुआई', description: 'बीजों को विटावैक्स से उपचारित करें। नवंबर के मध्य तक 100 किग्रा/हेक्टेयर की दर से बोएं। पंक्ति की दूरी 22.5 सेमी।', duration: '1-2 दिन' },
        { order: 3, title: 'पहली सिंचाई (CRI)', description: 'क्राउन रूट दीक्षा चरण (CRI) पर महत्वपूर्ण सिंचाई (21 दिन)। सबसे महत्वपूर्ण सिंचाई।', duration: 'बुआई के 21 दिन बाद' },
        { order: 4, title: 'उर्वरक प्रयोग', description: 'पहली सिंचाई के बाद शेष नाइट्रोजन डालें। 30 दिन पर खरपतवार नियंत्रण।', duration: 'बुआई के 25-30 दिन बाद' },
        { order: 5, title: 'कटाई', description: 'पौधे सुनहरे होने और दाने सख्त होने पर कटाई करें। नमी की मात्रा 14%।', duration: 'बुआई से 120-140 दिन' },
      ],
      tips: ['जीरो-टिल बुआई से ₹4000/हेक्टेयर की बचत और नमी का संरक्षण होता है', 'CRI, कल्ले निकलना, जॉइंटिंग, फूल आने और दाने भरने के समय 5 सिंचाई करें', 'अच्छे दानों के लिए 35°C से नीचे की अवधि आवश्यक है'],
      pests: ['चेपा (Aphids)', 'दीमक', 'आर्मी वर्म', 'गुलाबी छेदक'],
      diseases: ['रतुआ (पीला, भूरा, काला)', 'कंडुआ (Loose Smut)', 'करनाल बंट', 'पाउडरी मिल्ड्यू'],
    },
    {
      id: '3', name: 'कपास', category: 'Fiber Crops', season: 'खरीफ (अप्रैल-दिसंबर)', image: '☁️',
      description: 'भारतीय कृषि का सफेद सोना। कपड़ा उद्योग के लिए फाइबर प्रदान करने वाली प्रमुख व्यावसायिक फसल। गुजरात और महाराष्ट्र शीर्ष उत्पादक हैं।',
      steps: [
        { order: 1, title: 'बीज चयन और उपचार', description: 'बीटी कपास की किस्में चुनें। बीजों को इमिडाक्लोप्रिड से उपचारित करें। प्रतिरोध प्रबंधन सुनिश्चित करें।', duration: '1-2 दिन' },
        { order: 2, title: 'बुआई', description: 'मानसून की शुरुआत के साथ बोएं। संकर किस्मों के लिए 90x60 सेमी की दूरी। 3-4 सेमी गहराई पर लगाएं।', duration: '1 दिन' },
        { order: 3, title: 'वानस्पतिक देखभाल', description: '15 दिन पर विरलीकरण (Thinning)। उर्वरक की विभाजित खुराक डालें। 20 दिन पर पहली निराई।', duration: '15-45 दिन' },
        { order: 4, title: 'फूल और फूल आना', description: 'महत्वपूर्ण चरण। पर्याप्त सिंचाई और कीट निगरानी आवश्यक है।', duration: '45-100 दिन' },
        { order: 5, title: 'चुनाई', description: 'जब टिंडे पूरी तरह खुल जाएं तो चुनाई शुरू करें। 4-6 हफ्तों में कई बार चुनाई करें।', duration: 'बुआई से 150-180 दिन' },
      ],
      tips: ['मशीनीकृत कटाई के लिए उच्च घनत्व रोपण प्रणाली (HDPS) अपनाएं', 'फूल आने के समय निगरानी के लिए फेरोमोन ट्रैप लगाएं', 'अतिरिक्त आय और मिट्टी के स्वास्थ्य के लिए अरहर के साथ अंतःफसल करें'],
      pests: ['अमेरिकी सुंडी', 'गुलाबी सुंडी', 'सफेद मक्खी', 'जैसिड्स', 'मिली बग'],
      diseases: ['बैक्टीरियल ब्लाइट', 'फ्यूजेरियम विल्ट', 'जड़ सड़न', 'ग्रे मिल्ड्यू'],
    },
  ]
}

export default function AgriLibrary() {
  const { state } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)

  const guides = cropGuides[lang as keyof typeof cropGuides] || cropGuides['en']
  const categories = ['All', ...new Set(cropGuides.en.map((g) => g.category))]

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [guides, searchQuery, selectedCategory])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-rose-500" />
          {t.title}
        </h1>
        <p className="page-subtitle">{t.subtitle}</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="input-field !pl-10"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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
              {t.categories[cat as keyof typeof t.categories] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Guides */}
      <div className="space-y-4">
        {filteredGuides.map((guide: CropGuide, i: number) => {
          const isExpanded = expandedGuide === guide.id
          return (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card !p-0 overflow-hidden"
            >
              <button
                onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-earth-100/30 dark:hover:bg-earth-800/20 transition-colors"
              >
                <div className="text-4xl flex-shrink-0">{guide.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold font-display text-earth-800 dark:text-white">{guide.name}</h3>
                    <span className="badge-info">{t.categories[guide.category as keyof typeof t.categories] || guide.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-earth-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {guide.season}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {guide.steps.length} {t.stepsCount}
                    </span>
                  </div>
                  <p className="text-sm text-earth-500 dark:text-earth-400 mt-1 line-clamp-1">{guide.description}</p>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5 text-earth-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 space-y-5 border-t border-earth-200/30 dark:border-earth-700/30 pt-5">
                      <p className="text-sm text-earth-600 dark:text-earth-400 leading-relaxed">{guide.description}</p>
                      <div>
                        <h4 className="font-bold font-display text-earth-800 dark:text-earth-200 mb-3 flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-sage-500" /> {t.steps}
                        </h4>
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-sage-500/20" />
                          <div className="space-y-4">
                            {guide.steps.map((step: any) => (
                              <div key={step.order} className="relative flex gap-4 pl-2">
                                <div className="w-5 h-5 rounded-full bg-sage-500 text-white text-[10px] font-bold flex items-center justify-center z-10 flex-shrink-0 mt-0.5">{step.order}</div>
                                <div className="flex-1 pb-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-earth-800 dark:text-earth-200">{step.title}</p>
                                    <span className="text-[10px] text-earth-400 flex items-center gap-0.5"><Clock className="w-3 h-3" /> {step.duration}</span>
                                  </div>
                                  <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5 leading-relaxed">{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-sage-500/5 border border-sage-500/10">
                          <h5 className="text-sm font-bold text-sage-700 dark:text-sage-400 mb-2 flex items-center gap-1"><Leaf className="w-3.5 h-3.5" /> {t.tips}</h5>
                          <ul className="space-y-1">
                            {guide.tips.map((tip: string, j: number) => (<li key={j} className="text-xs text-earth-600 dark:text-earth-400 flex items-start gap-1.5"><span className="text-sage-500">•</span> {tip}</li>))}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                          <h5 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1"><Bug className="w-3.5 h-3.5" /> {t.pests}</h5>
                          <div className="flex flex-wrap gap-1">{guide.pests.map((p: string) => (<span key={p} className="badge-danger">{p}</span>))}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                          <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> {t.diseases}</h5>
                          <div className="flex flex-wrap gap-1">{guide.diseases.map((d: string) => (<span key={d} className="badge-warning">{d}</span>))}</div>
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
            <p className="text-earth-400">{t.noGuides}</p>
          </div>
        )}
      </div>
    </div>
  )
}
