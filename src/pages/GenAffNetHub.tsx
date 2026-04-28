import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Loader2, Zap, Target, AlertTriangle,
  TrendingUp, BarChart3, Layers, Sliders, Play,
  ChevronRight, Activity, FileDigit, Upload, CheckCircle2,
  Database, Info, Search
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { processHyperspectralData, HYPERSPECTRAL_WORKFLOW, type HyperspectralResult } from '../services/hyperspectral'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const mockFiles = [
  'sugarbeet hsi 1', 'sugarbeet hsi 2', 'sugarbeet hsi 3',
  'sugarbeet hsi 4', 'sugarbeet hsi 5', 'sugarbeet hsi 6',
  'sugarbeet hsi 7', 'sugarbeet hsi 8'
]

const translations = {
  hi: {
    title: 'GenAffNet डायग्नोस्टिक्स',
    subtitle: 'एलीट हाइपरस्पेक्ट्रली इंफरेंस प्लेटफॉर्म',
    heroDesc: 'हमारा विशेष DMLPFFN इंजन हाइरार्कीकल स्पेक्ट्रल-स्पेशियल फ्यूजन के माध्यम से अद्वितीय रोग पहचान सटीकता प्राप्त करता है। यह 98.09% सटीकता के साथ पौधों के संक्रमण का सटीक मानचित्रण करता है।',
    specs: {
      bands: '96 स्पेक्ट्रल बैंड',
      precision: '98.09% सटीकता',
      augmented: 'VAE संवर्धित'
    },
    workflowTitle: 'DMLPFFN इंजन वर्कफ्लो',
    controlTitle: 'इंफरेंस इनपुट',
    selectFile: 'हाइपरस्पेक्ट्रल क्यूब (.NPY) चुनें',
    processButton: 'DMLPFFN भविष्यवाणी शुरू करें',
    processing: 'प्रोसेसिंग चरण',
    modelSpecs: 'मॉडल विनिर्देश',
    modelDesc: 'DMLPFFN आर्किटेक्चर वैश्विक स्पेक्ट्रल ध्यान के साथ मल्टी-स्केल स्पेशियल पैच को एकीकृत करता है।',
    reportTitle: 'सक्रिय डायग्नोस्टिक रिपोर्ट',
    completed: 'पूर्ण',
    category: 'पहचान श्रेणी',
    confidence: 'आत्मविश्वास',
    stage: 'संक्रमण चरण',
    results: 'संभावित रोग',
    summary: 'अनुसंधान सारांश',
    recommendations: 'सुरक्षा सिफारिशें',
    history: 'डायग्नोस्टिक इतिहास (न्यूनतम आत्मविश्वास द्वारा वर्गीकृत)',
    recorded: 'रिकॉर्ड किए गए',
    awaiting: 'हाइपरस्पेक्ट्रल इनपुट की प्रतीक्षा है',
    awaitingDesc: 'कंट्रोल सेंटर से .npy हाइपरस्पेक्ट्रल डेटा क्यूब चुनें।',
    inputShape: 'इनपुट आकार',
    engineState: 'इंजन स्थिति',
    ready: 'तैयार',
    impactTitle: 'GenAI प्रभाव विश्लेषण',
    efficiencyTitle: 'स्केल दक्षता'
  },
  en: {
    title: 'GenAffNet Diagnostics',
    subtitle: 'Elite Hyperspectral Inference Platform',
    heroDesc: 'Our specialized DMLPFFN engine achieves unparalleled disease detection accuracy through hierarchical spectral-spatial fusion. It facilitates precision mapping with a 98.09% precision rate.',
    specs: {
      bands: '96 Spectral Bands',
      precision: '98.09% Precision',
      augmented: 'VAE Augmented'
    },
    workflowTitle: 'DMLPFFN Engine Workflow',
    controlTitle: 'Inference Input',
    selectFile: 'SELECT HYPERSPECTRAL CUBE (.NPY)',
    processButton: 'RUN DMLPFFN PREDICTION',
    processing: 'PROCESSING STAGE',
    modelSpecs: 'Model Specs',
    modelDesc: 'DMLPFFN architecture integrates multi-scale spatial patches with global spectral attention.',
    reportTitle: 'Active Diagnostic Report',
    completed: 'COMPLETED',
    category: 'Detection Category',
    confidence: 'Confidence',
    stage: 'Infection Stage',
    results: 'Potential Diseases',
    summary: 'Analysis Summary',
    recommendations: 'Safety Recommendations',
    history: 'Diagnostic History (Sorted by lowest confidence)',
    recorded: 'RECORDED',
    awaiting: 'Awaiting Hyperspectral Input',
    awaitingDesc: 'Select a .npy hyperspectral data cube from the Control Center to begin.',
    inputShape: 'Input Shape',
    engineState: 'Engine State',
    ready: 'Ready',
    impactTitle: 'GenAI Impact Analysis',
    efficiencyTitle: 'Scale Efficiency'
  },
  pa: {
    title: 'GenAffNet ਡਾਇਗਨੌਸਟਿਕਸ',
    subtitle: 'ਐਲੀਟ ਹਾਈਪਰਸਪੈਕਟ੍ਰਲ ਇਨਫਰੈਂਸ ਪਲੇਟਫਾਰਮ',
    heroDesc: 'ਸਾਡਾ ਵਿਸ਼ੇਸ਼ DMLPFFN ਇੰਜਣ ਹਾਈਰਾਰਕੀਕਲ ਸਪੈਕਟ੍ਰਲ-ਸਪੇਸ਼ੀਅਲ ਫਿਊਜ਼ਨ ਰਾਹੀਂ ਬੇਮਿਸਾਲ ਬਿਮਾਰੀ ਖੋਜ ਸ਼ੁੱਧਤਾ ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ। ਇਹ 98.09% ਸ਼ੁੱਧਤਾ ਦਰ ਦੇ ਨਾਲ ਸਟੀਕ ਮੈਪਿੰਗ ਦੀ ਸਹੂਲਤ ਦਿੰਦਾ ਹੈ।',
    specs: {
      bands: '96 ਸਪੈਕਟ੍ਰਲ ਬੈਂਡ',
      precision: '98.09% ਸ਼ੁੱਧਤਾ',
      augmented: 'VAE ਸੰਵਰਧਿਤ'
    },
    workflowTitle: 'DMLPFFN ਇੰਜਣ ਵਰਕਫਲੋ',
    controlTitle: 'ਇਨਫਰੈਂਸ ਇਨਪੁਟ',
    selectFile: 'ਹਾਈਪਰਸਪੈਕਟ੍ਰਲ ਕਿਊਬ (.NPY) ਚੁਣੋ',
    processButton: 'DMLPFFN ਭਵਿੱਖਬਾਣੀ ਚਲਾਓ',
    processing: 'ਪ੍ਰੋਸੈਸਿੰਗ ਪੜਾਅ',
    modelSpecs: 'ਮਾਡਲ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
    modelDesc: 'DMLPFFN ਆਰਕੀਟੈਕਚਰ ਗਲੋਬਲ ਸਪੈਕਟ੍ਰਲ ਧਿਆਨ ਦੇ ਨਾਲ ਮਲਟੀ-ਸਕੇਲ ਸਪੇਸ਼ੀਅਲ ਪੈਚਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ।',
    reportTitle: 'ਐਕਟਿਵ ਡਾਇਗਨੌਸਟਿਕ ਰਿਪੋਰਟ',
    completed: 'ਪੂਰਾ ਹੋਇਆ',
    category: 'ਖੋਜ ਸ਼੍ਰੇਣੀ',
    confidence: 'ਭਰੋਸਾ',
    stage: 'ਇਨਫੈਕਸ਼ਨ ਪੜਾਅ',
    results: 'ਸੰਭਾਵੀ ਬਿਮਾਰੀਆਂ',
    summary: 'ਵਿਸ਼ਲੇਸ਼ਣ ਸਾਰ',
    recommendations: 'ਸੁਰੱਖਿਆ ਸਿਫਾਰਸ਼ਾਂ',
    history: 'ਡਾਇਗਨੌਸਟਿਕ ਇਤਿਹਾਸ',
    recorded: 'ਰਿਕਾਰਡ ਕੀਤਾ ਗਿਆ',
    awaiting: 'ਇਨਪੁਟ ਦੀ ਉਡੀਕ ਹੈ',
    awaitingDesc: 'ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕੰਟਰੋਲ ਸੈਂਟਰ ਤੋਂ ਫਾਈਲ ਚੁਣੋ।',
    inputShape: 'ਇਨਪੁਟ ਆਕਾਰ',
    engineState: 'ਇੰਜਣ ਸਥਿਤੀ',
    ready: 'ਤਿਆਰ',
    impactTitle: 'ਪ੍ਰਭਾਵ ਵਿਸ਼ਲੇਸ਼ਣ',
    efficiencyTitle: 'ਕੁਸ਼ਲਤਾ'
  },
  mr: {
    title: 'GenAffNet डायग्नोस्टिक्स',
    subtitle: 'एलिट हायपरस्पेक्ट्रल इन्फरन्स प्लॅटफॉर्म',
    heroDesc: 'आमचे विशेष DMLPFFN इंजिन हायरार्कीकल स्पेक्ट्रल-स्पेशियल फ्यूजनद्वारे अतुलनीय रोग शोध अचूकता प्राप्त करते. हे ९८.०९% अचूकतेसह अचूक मॅपिंग सुलभ करते.',
    specs: {
      bands: '९६ स्पेक्ट्रल बँड्स',
      precision: '९८.०९% अचूकता',
      augmented: 'VAE ऑगमेंटेड'
    },
    workflowTitle: 'DMLPFFN इंजिन वर्कफ्लो',
    controlTitle: 'इन्फरन्स इनपुट',
    selectFile: 'हायपरस्पेक्ट्रल क्यूब (.NPY) निवडा',
    processButton: 'DMLPFFN अंदाज चालवा',
    processing: 'प्रक्रिया टप्पा',
    modelSpecs: 'मॉडेल तपशील',
    modelDesc: 'DMLPFFN आर्किटेक्चर जागतिक स्पेक्ट्रल लक्ष्यासह मल्टी-स्केल स्पेशियल पॅचेस एकत्रित करते.',
    reportTitle: 'सक्रिय डायग्नोस्टिक रिपोर्ट',
    completed: 'पूर्ण',
    category: 'शोध श्रेणी',
    confidence: 'आत्मविश्वास',
    stage: 'संसर्ग टप्पा',
    results: 'संभाव्य रोग',
    summary: 'विश्लेषण सारांश',
    recommendations: 'सुरक्षा शिफारसी',
    history: 'डायग्नोस्टिक इतिहास',
    recorded: 'रेकॉर्ड केलेले',
    awaiting: 'इनपुटची प्रतीक्षा आहे',
    awaitingDesc: 'सुरू करण्यासाठी नियंत्रण केंद्रातून फाईल निवडा.',
    inputShape: 'इनपुट आकार',
    engineState: 'इंजिन स्थिती',
    ready: 'तयार',
    impactTitle: 'प्रभाव विश्लेषण',
    efficiencyTitle: 'कार्यक्षमता'
  },
  ta: {
    title: 'GenAffNet நோய் கண்டறிதல்',
    subtitle: 'எலைட் ஹைப்பர்ஸ்பெக்ட்ரல் இன்ஃபெரன்ஸ் பிளாட்பார்ம்',
    heroDesc: 'எங்கள் சிறப்பு DMLPFFN இயந்திரம் படிநிலை நிறமாலை-இடஞ்சார்ந்த இணைவு மூலம் இணையற்ற நோய் கண்டறிதல் துல்லியத்தை அடைகிறது. இது 98.09% துல்லியத்துடன் துல்லியமான வரைபடத்தை எளிதாக்குகிறது.',
    specs: {
      bands: '96 நிறமாலை பட்டைகள்',
      precision: '98.09% துல்லியம்',
      augmented: 'VAE மேம்படுத்தப்பட்டது'
    },
    workflowTitle: 'DMLPFFN இயந்திர பணிப்பாய்வு',
    controlTitle: 'உள்ளீடு',
    selectFile: 'ஹைப்பர்ஸ்பெக்ட்ரல் க்யூப் (.NPY) தேர்ந்தெடுக்கவும்',
    processButton: 'DMLPFFN கணிப்பை இயக்கவும்',
    processing: 'செயலாக்க நிலை',
    modelSpecs: 'மாதிரி விவரக்குறிப்புகள்',
    modelDesc: 'DMLPFFN கட்டமைப்பு உலகளாவிய நிறமாலை கவனத்துடன் பல அளவிலான இடஞ்சார்ந்த திட்டுகளை ஒருங்கிணைக்கிறது.',
    reportTitle: 'செயலில் உள்ள கண்டறிதல் அறிக்கை',
    completed: 'முடிந்தது',
    category: 'கண்டறிதல் வகை',
    confidence: 'நம்பிக்கை',
    stage: 'தொற்று நிலை',
    results: 'சாத்தியமான நோய்கள்',
    summary: 'பகுப்பாய்வு சுருக்கம்',
    recommendations: 'பாதுகாப்பு பரிந்துரைகள்',
    history: 'கண்டறிதல் வரலாறு',
    recorded: 'பதிவு செய்யப்பட்டது',
    awaiting: 'உள்ளீட்டிற்காக காத்திருக்கிறது',
    awaitingDesc: 'தொடங்குவதற்கு கட்டுப்பாட்டு மையத்திலிருந்து கோப்பைத் தேர்ந்தெடுக்கவும்.',
    inputShape: 'உள்ளீட்டு வடிவம்',
    engineState: 'இயந்திர நிலை',
    ready: 'தயார்',
    impactTitle: 'தாக்க பகுப்பாய்வு',
    efficiencyTitle: 'திறன்'
  },
  te: {
    title: 'GenAffNet డయాగ్నోస్టిక్స్',
    subtitle: 'ఎలైట్ హైపర్‌స్పెక్ట్రల్ ఇన్ఫరెన్స్ ప్లాట్‌ఫారమ్',
    heroDesc: 'మా ప్రత్యేక DMLPFFN ఇంజిన్ క్రమానుగత స్పెక్ట్రల్-స్పేషియల్ ఫ్యూజన్ ద్వారా అసమానమైన వ్యాధి గుర్తింపు ఖచ్చితత్వాన్ని సాధిస్తుంది. ఇది 98.09% ఖచ్చితత్వంతో ఖచ్చితమైన మ్యాపింగ్‌ను సులభతరం చేస్తుంది.',
    specs: {
      bands: '96 స్పెక్ట్రల్ బ్యాండ్‌లు',
      precision: '98.09% ఖచ్చితత్వం',
      augmented: 'VAE ఆగ్మెంటెడ్'
    },
    workflowTitle: 'DMLPFFN ఇంజిన్ వర్క్‌ఫ్లో',
    controlTitle: 'ఇన్‌పుట్',
    selectFile: 'హైపర్‌స్పెక్ట్రల్ క్యూబ్ (.NPY) ఎంచుకోండి',
    processButton: 'DMLPFFN అంచనాను అమలు చేయండి',
    processing: 'ప్రాసెసింగ్ దశ',
    modelSpecs: 'మోడల్ స్పెసిఫికేషన్స్',
    modelDesc: 'DMLPFFN ఆర్కిటెక్చర్ గ్లోబల్ స్పెక్ట్రల్ అటెన్షన్‌తో మల్టీ-స్కేల్ స్పేషియల్ ప్యాచ్‌లను అనుసంధానిస్తుంది.',
    reportTitle: 'యాక్టివ్ డయాగ్నోస్టిక్ రిపోర్ట్',
    completed: 'పూర్తయింది',
    category: 'గుర్తింపు వర్గం',
    confidence: 'విశ్వాసం',
    stage: 'ఇన్ఫెక్షన్ దశ',
    results: 'సంభావ్య వ్యాధులు',
    summary: 'విశ్లేషణ సారాంశం',
    recommendations: 'భద్రతా సిఫార్సులు',
    history: 'డయాగ్నోస్టిక్ చరిత్ర',
    recorded: 'రికార్డ్ చేయబడింది',
    awaiting: 'ఇన్‌పుట్ కోసం వేచి ఉంది',
    awaitingDesc: 'ప్రారంభించడానికి కంట్రోల్ సెంటర్ నుండి ఫైల్‌ను ఎంచుకోండి.',
    inputShape: 'ఇన్‌పుట్ ఆకారం',
    engineState: 'ఇంజిన్ స్థితి',
    ready: 'సిద్ధం',
    impactTitle: 'ప్రభావ విశ్లేషణ',
    efficiencyTitle: 'సామర్థ్యం'
  },
  kn: {
    title: 'GenAffNet ಡಯಾಗ್ನೋಸ್ಟಿಕ್ಸ್',
    subtitle: 'ಎಲೈಟ್ ಹೈಪರ್‌ಸ್ಪೆಕ್ಟ್ರಲ್ ಇನ್ಫರೆನ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    heroDesc: 'ನಮ್ಮ ವಿಶೇಷ DMLPFFN ಇಂಜಿನ್ ಕ್ರಮಾನುಗತ ಸ್ಪೆಕ್ಟ್ರಲ್-ಸ್ಪೇಷಿಯಲ್ ಫ್ಯೂಷನ್ ಮೂಲಕ ಸಾಟಿಯಿಲ್ಲದ ರೋಗ ಪತ್ತೆ ನಿಖರತೆಯನ್ನು ಸಾಧಿಸುತ್ತದೆ. ಇದು 98.09% ನಿಖರತೆಯೊಂದಿಗೆ ನಿಖರವಾದ ಮ್ಯಾಪಿಂಗ್ ಅನ್ನು ಸುಲಭಗೊಳಿಸುತ್ತದೆ.',
    specs: {
      bands: '96 ಸ್ಪೆಕ್ಟ್ರಲ್ ಬ್ಯಾಂಡ್‌ಗಳು',
      precision: '98.09% ನಿಖರತೆ',
      augmented: 'VAE ಆಗ್ಮೆಂಟೆಡ್'
    },
    workflowTitle: 'DMLPFFN ಇಂಜಿನ್ ವರ್ಕ್‌ಫ್ಲೋ',
    controlTitle: 'ಇನ್‌ಪುಟ್',
    selectFile: 'ಹೈಪರ್‌ಸ್ಪೆಕ್ಟ್ರಲ್ ಕ್ಯೂಬ್ (.NPY) ಆಯ್ಕೆಮಾಡಿ',
    processButton: 'DMLPFFN ಭವಿಷ್ಯವಾಣಿ ರನ್ ಮಾಡಿ',
    processing: 'ಪ್ರಕ್ರಿಯೆಯ ಹಂತ',
    modelSpecs: 'ಮಾದರಿ ವಿಶೇಷಣಗಳು',
    modelDesc: 'DMLPFFN ಆರ್ಕಿಟೆಕ್ಚರ್ ಜಾಗತಿಕ ಸ್ಪೆಕ್ಟ್ರಲ್ ಗಮನದೊಂದಿಗೆ ಬಹು-ಪ್ರಮಾಣದ ಪ್ರಾದೇಶಿಕ ಪ್ಯಾಚ್‌ಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ.',
    reportTitle: 'ಸಕ್ರಿಯ ರೋಗನಿರ್ಣಯ ವರದಿ',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    category: 'ಪತ್ತೆ ವರ್ಗ',
    confidence: 'ವಿಶ್ವಾಸ',
    stage: 'ಸೋಂಕಿನ ಹಂತ',
    results: 'ಸಂಭಾವ್ಯ ರೋಗಗಳು',
    summary: 'ವಿಶ್ಲೇಷಣೆ ಸಾರಾಂಶ',
    recommendations: 'ಸುರಕ್ಷತಾ ಶಿಫಾರಸುಗಳು',
    history: 'ರೋಗನಿರ್ಣಯದ ಇತಿಹಾಸ',
    recorded: 'ದಾಖಲಿಸಲಾಗಿದೆ',
    awaiting: 'ಇನ್‌ಪುಟ್‌ಗಾಗಿ ಕಾಯುತ್ತಿದೆ',
    awaitingDesc: 'ಪ್ರಾರಂಭಿಸಲು ನಿಯಂತ್ರಣ ಕೇಂದ್ರದಿಂದ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.',
    inputShape: 'ಇನ್‌ಪುಟ್ ಆಕಾರ',
    engineState: 'ಇಂಜಿನ್ ಸ್ಥಿತಿ',
    ready: 'ಸಿದ್ಧ',
    impactTitle: 'ಪರಿಣಾಮ ವಿಶ್ಲೇಷಣೆ',
    efficiencyTitle: 'ದಕ್ಷತೆ'
  }
}

export default function GenAffNetHub() {
  const { state } = useApp()
  const lang = state.language as keyof typeof translations
  const t = translations[lang] || translations['en']

  const [selectedFile, setSelectedFile] = useState<string>('')
  const [results, setResults] = useState<HyperspectralResult[]>([])
  const [lastResult, setLastResult] = useState<HyperspectralResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeStage, setActiveStage] = useState(0)

  const runDiagnostic = useCallback(async () => {
    if (!selectedFile) return
    setLoading(true)
    setLastResult(null)
    
    for (let i = 1; i <= 4; i++) {
        setActiveStage(i)
        await new Promise(r => setTimeout(r, 600))
    }

    try {
      const res = await processHyperspectralData(selectedFile)
      setResults(prev => [...prev, res].sort((a, b) => a.confidence - b.confidence))
      setLastResult(res)
      setSelectedFile('')
    } finally {
      setLoading(false)
      setActiveStage(0)
    }
  }, [selectedFile])

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 border-[1.5px] border-stone-200 dark:border-white/5"
        style={{ background: 'linear-gradient(135deg, #131412 0%, #1c1c1e 100%)' }}
      >
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="absolute -top-24 -right-24 p-24 opacity-[0.05] pointer-events-none rotate-12">
            <Brain className="w-96 h-96" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
                {state.language === 'hi' ? 'GenAffNet' : 'GenAffNet'} <span className="text-indigo-400">{state.language === 'hi' ? 'डायग्नोस्टिक्स' : 'Diagnostics'}</span>
              </h1>
              <p className="text-indigo-300/60 text-sm mt-1 uppercase tracking-[0.2em] font-black">{t.subtitle}</p>
            </div>
          </div>
          <p className="text-stone-400 max-w-2xl text-lg leading-relaxed">
            {t.heroDesc}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-inner">
                <Layers className="w-3.5 h-3.5" /> {t.specs.bands}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-inner">
                <Target className="w-3.5 h-3.5" /> {t.specs.precision}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-inner">
                <Activity className="w-3.5 h-3.5" /> {t.specs.augmented}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2 mb-2 ml-2">
          <Database className="w-4 h-4 text-indigo-500" />
          <h3 className="font-bold text-white uppercase tracking-[0.2em] text-[10px]">{t.workflowTitle}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {HYPERSPECTRAL_WORKFLOW.map((stage, i) => {
            const colors = ['from-blue-500 to-cyan-500', 'from-violet-500 to-purple-600', 'from-amber-500 to-orange-600', 'from-emerald-500 to-teal-500']
            const isActive = activeStage === stage.stage
            return (
              <div key={stage.stage} className="relative group">
                <div className={`h-full p-6 rounded-2xl border-[1.5px] transition-all duration-500 ${isActive ? 'bg-stone-900/60 border-stone-500 shadow-2xl' : 'bg-stone-900/20 border-white/5 opacity-60'}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white text-xs font-bold shadow-lg overflow-hidden relative`}>{stage.stage}</div>
                    <h4 className="text-xs uppercase tracking-widest font-black text-white">{stage.name}</h4>
                  </div>
                  <ul className="space-y-3">
                    {stage.details.map((detail, j) => (
                      <li key={j} className={`text-[10px] font-bold flex items-start gap-2.5 transition-all ${isActive ? 'text-white' : 'text-white/70'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${isActive ? 'bg-white' : 'bg-white/20'}`} /> {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={item} className="lg:col-span-4 space-y-6">
          <div className="glass-card !bg-[#1c1c1e] !border-white/5">
            <div className="flex items-center gap-2 mb-6"><Upload className="w-5 h-5 text-indigo-500" /> <h3 className="font-bold text-white uppercase tracking-widest text-sm">{t.controlTitle}</h3></div>
            <div className="space-y-4">
              <p className="text-xs text-stone-500 font-medium">{t.selectFile}</p>
              <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[300px] pr-2">
                {mockFiles.map(file => (
                  <button key={file} onClick={() => setSelectedFile(file)} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${selectedFile === file ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-stone-900/50 border-white/5 text-stone-400 hover:bg-stone-800'}`}>
                    <div className="flex items-center gap-3"><FileDigit className="w-4 h-4" /> <span className="text-sm font-mono">{file}</span></div>
                    {selectedFile === file && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={runDiagnostic} disabled={loading || !selectedFile} className="w-full mt-8 px-6 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl disabled:opacity-30 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {loading ? `${t.processing} ${activeStage}` : t.processButton}
            </button>
          </div>
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-white/5">
             <div className="flex items-center gap-2 mb-3"><Info className="w-4 h-4 text-stone-500" /> <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.modelSpecs}</h4></div>
             <p className="text-[10px] text-stone-500 leading-relaxed">{t.modelDesc}</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {lastResult ? (
              <motion.div key="active-report" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card !bg-[#1c1c1e] !border-indigo-500/30 p-0 overflow-hidden">
                <div className="bg-indigo-500/5 border-b border-white/5 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><BarChart3 className="w-6 h-6" /></div>
                        <div><h3 className="text-white font-bold uppercase tracking-widest text-xs">{t.reportTitle}</h3><p className="text-stone-500 text-[10px] font-mono">{lastResult.fileName}</p></div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">{t.completed}</div>
                </div>
                <div className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                        <div className="space-y-4">
                            <div><span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2 block">{t.category}</span><h2 className="text-3xl font-bold font-display text-white">{lastResult.infectionLevel}</h2><p className={`text-sm mt-1 font-medium ${lastResult.class === 3 ? 'text-red-400' : lastResult.class === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{lastResult.category}</p></div>
                            <div className="flex items-center gap-8">
                                <div><p className="text-3xl font-black text-white">{(lastResult.confidence * 100).toFixed(2)}%</p><p className="text-[10px] font-bold text-stone-500 uppercase mt-1">{t.confidence}</p></div>
                                <div className="h-10 w-px bg-stone-800" />
                                <div><p className="text-3xl font-black text-indigo-400">{t.stage} {lastResult.stage}</p><p className="text-[10px] font-bold text-stone-500 uppercase mt-1">{t.stage}</p></div>
                            </div>
                        </div>
                        <div className="w-full md:w-64 space-y-4"><div className="p-4 rounded-2xl bg-stone-900 border border-white/5"><h4 className="text-[10px] font-bold text-stone-400 uppercase mb-3 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t.results}</h4><div className="flex flex-wrap gap-1.5">{lastResult.possibleDiseases.map(d => (<span key={d} className="text-[9px] px-2 py-1 rounded bg-stone-800 border border-white/5 text-stone-300">{d}</span>))}</div></div></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10"><h4 className="text-[10px] font-bold text-indigo-300 uppercase mb-4 flex items-center gap-2"><Info className="w-4 h-4" /> {t.summary}</h4><p className="text-xs text-stone-400 leading-relaxed">Our DMLPFFN engine detected significant {lastResult.category.toLowerCase()} spectral signatures during Stage {lastResult.stage} manifestation.</p></div>
                         <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"><h4 className="text-[10px] font-bold text-emerald-300 uppercase mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> {t.recommendations}</h4><ul className="space-y-2">{lastResult.precautions.map((p, i) => (<li key={i} className="text-[10px] text-stone-400 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500" />{p}</li>))}</ul></div>
                    </div>
                </div>
              </motion.div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2"><Search className="w-4 h-4" /> {t.history}</h3><span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-1 rounded border border-white/5">{results.length} {t.recorded}</span></div>
                {results.map((res, i) => (
                  <motion.div key={`${res.fileName}-${i}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card !bg-stone-900/40 border-stone-800 relative overflow-hidden"><div className={`absolute top-0 right-0 w-1 h-full ${res.class === 3 ? 'bg-red-500' : res.class === 2 ? 'bg-amber-500' : res.class === 1 ? 'bg-emerald-500' : 'bg-blue-500'}`} /><div className="flex flex-col md:flex-row md:items-center justify-between gap-6"><div className="space-y-3"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${res.class === 3 ? 'bg-red-500/10 text-red-500' : res.class === 2 ? 'bg-amber-500/10 text-amber-500' : res.class === 1 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}><AlertTriangle className="w-5 h-5" /></div><div><div className="flex items-center gap-2"><h4 className="text-lg font-bold text-white">{res.infectionLevel}</h4><span className="text-[10px] font-mono text-stone-500 bg-black/30 px-1.5 py-0.5 rounded">CLASS_{res.class}</span></div><p className="text-sm font-medium text-stone-400">{res.category}</p></div></div><div className="flex items-center gap-4 text-[10px] text-stone-500 uppercase tracking-widest font-bold"><span className="flex items-center gap-1.5"><FileDigit className="w-3.5 h-3.5" /> {res.fileName}</span><span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {t.stage} {res.stage}</span></div></div><div className="flex flex-col items-end gap-2"><div className="text-right"><p className="text-2xl font-black font-display text-white">{(res.confidence * 100).toFixed(2)}%</p><p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{t.confidence}</p></div></div></div></motion.div>
                ))}
              </div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card flex flex-col items-center justify-center py-32 text-center !bg-[#1c1c1e] !border-dashed !border-white/10"><div className="w-24 h-24 rounded-full bg-stone-900 flex items-center justify-center mb-6 relative"><div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping" /><Search className="w-10 h-10 text-stone-700" /></div><h3 className="text-xl font-bold text-stone-400 mb-2">{t.awaiting}</h3><p className="text-stone-500 max-w-sm text-sm">{t.awaitingDesc}</p><div className="mt-8 grid grid-cols-2 gap-3 text-left"><div className="p-3 rounded-xl bg-stone-900 border border-white/5 space-y-1"><p className="text-[10px] font-bold text-stone-500 uppercase">{t.inputShape}</p><p className="text-xs text-stone-300">9x9x96 Patch</p></div><div className="p-3 rounded-xl bg-stone-900 border border-white/5 space-y-1"><p className="text-[10px] font-bold text-stone-500 uppercase">{t.engineState}</p><p className="text-xs text-emerald-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{t.ready}</p></div></div></motion.div>
            )}
          </AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card !bg-stone-900/40 border-stone-800"><div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-emerald-500" /><h4 className="text-xs font-bold text-stone-400 uppercase">{t.impactTitle}</h4></div><p className="text-xs text-stone-500 leading-relaxed">Synthetic pattern synthesis accounts for <span className="text-emerald-400 font-bold">+1.3%</span> accuracy gain.</p></div>
              <div className="glass-card !bg-stone-900/40 border-stone-800"><div className="flex items-center gap-2 mb-4"><Info className="w-4 h-4 text-indigo-500" /><h4 className="text-xs font-bold text-stone-400 uppercase">{t.efficiencyTitle}</h4></div><p className="text-xs text-stone-500 leading-relaxed">Dilated convolutions provide multi-scale context.</p></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

