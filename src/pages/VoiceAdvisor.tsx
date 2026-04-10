import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Send, Volume2, VolumeX, Bot, User,
  Globe, Trash2, Sparkles,
} from 'lucide-react'
import { getAdvisorResponse } from '../services/gemini'
import { startListening, stopListening, speak, stopSpeaking, isSpeechRecognitionSupported } from '../services/speech'
import { incrementStat, addActivity } from '../services/db'
import { useApp } from '../context/AppContext'
import type { ChatMessage } from '../types'

export default function VoiceAdvisor() {
  const { state, dispatch } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: state.language === 'hi'
        ? 'नमस्ते! 🌾 मैं AgriSage AI सलाहकार हूँ। आप मुझसे कृषि से जुड़ा कोई भी सवाल पूछ सकते हैं — कीट नियंत्रण, सिंचाई, आधुनिक तकनीक, या बाज़ार की जानकारी। बोलकर या लिखकर पूछें!'
        : 'Namaste! 🌾 I\'m your AgriSage AI Advisor. Ask me anything about farming — pest control, irrigation, modern techniques, or market insights. You can type or use voice input!',
      timestamp: new Date(),
      language: state.language,
    },
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeakingState, setIsSpeakingState] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
      language: state.language,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await getAdvisorResponse(text, state.language)
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        language: state.language,
      }
      setMessages((prev) => [...prev, botMsg])
      incrementStat('totalChats')
      addActivity({
        type: 'chat',
        title: `AI Advisor: ${text.slice(0, 40)}${text.length > 40 ? '...' : ''}`,
        description: response.slice(0, 80) + '...',
      })
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: state.language === 'hi'
            ? 'क्षमा करें, कोई त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
          language: state.language,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [state.language])

  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening()
      setIsListening(false)
      return
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    setIsListening(true)
    startListening(state.language, {
      onResult: (transcript) => {
        setIsListening(false)
        sendMessage(transcript)
      },
      onError: (error) => {
        setIsListening(false)
        console.error('Speech error:', error)
      },
      onEnd: () => setIsListening(false),
      onStart: () => setIsListening(true),
    })
  }, [isListening, state.language, sendMessage])

  const handleSpeak = useCallback((text: string) => {
    if (isSpeakingState) {
      stopSpeaking()
      setIsSpeakingState(false)
    } else {
      speak(text, state.language)
      setIsSpeakingState(true)
      // Reset after approximate speech duration
      setTimeout(() => setIsSpeakingState(false), text.length * 60)
    }
  }, [isSpeakingState, state.language])

  const clearChat = () => {
    setMessages([{
      id: 'welcome_new',
      role: 'assistant',
      content: state.language === 'hi'
        ? 'चैट साफ़ हो गई। नया सवाल पूछें! 🌱'
        : 'Chat cleared. Ask me a new question! 🌱',
      timestamp: new Date(),
      language: state.language,
    }])
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Mic className="w-8 h-8 text-violet-500" />
            {state.language === 'hi' ? 'AI कृषि सलाहकार' : 'Voice AI Advisor'}
          </h1>
          <p className="page-subtitle">
            {state.language === 'hi'
              ? 'हैंड्स-फ़्री, बहुभाषी कृषि सहायक'
              : 'Hands-free, multilingual agricultural assistant powered by Gemini AI'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'en' ? 'hi' : 'en' })}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Globe className="w-4 h-4" />
            {state.language === 'en' ? 'हिंदी' : 'English'}
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={clearChat} className="btn-secondary flex items-center gap-2 text-sm text-red-500">
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-card !p-0 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 320px)', minHeight: '400px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-sage-500/20">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-sage-600 text-white rounded-br-md shadow-lg shadow-sage-600/20'
                        : 'bg-earth-100 dark:bg-earth-800/60 text-earth-800 dark:text-earth-200 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-earth-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'assistant' && msg.id !== 'welcome' && msg.id !== 'welcome_new' && (
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="p-1 rounded hover:bg-earth-200/50 dark:hover:bg-earth-700/50 transition-colors"
                        title="Read aloud"
                      >
                        {isSpeakingState ? (
                          <VolumeX className="w-3 h-3 text-earth-400" />
                        ) : (
                          <Volume2 className="w-3 h-3 text-earth-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-earth-200 dark:bg-earth-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-earth-600 dark:text-earth-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-sage-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-earth-100 dark:bg-earth-800/60">
                <div className="flex items-center gap-1.5">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-2 h-2 rounded-full bg-sage-500" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-2 h-2 rounded-full bg-sage-500" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-2 h-2 rounded-full bg-sage-500" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-earth-200/30 dark:border-earth-700/30 p-4">
          <div className="flex items-center gap-3">
            {/* Voice Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-earth-100 dark:bg-earth-800/50 text-earth-500 dark:text-earth-400 hover:bg-sage-100 dark:hover:bg-sage-900/30 hover:text-sage-600 dark:hover:text-sage-400'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>

            {/* Text Input */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder={state.language === 'hi' ? 'अपना सवाल लिखें...' : 'Type your question...'}
                className="input-field !pr-12"
                disabled={isLoading}
              />
              {isListening && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-3 h-3 rounded-full bg-red-500"
                  />
                </div>
              )}
            </div>

            {/* Send Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl gradient-primary text-white shadow-lg shadow-sage-500/25 
                         disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed
                         hover:shadow-sage-500/40 transition-all duration-300 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Voice hint */}
          {isListening && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-center text-red-500 mt-2"
            >
              🎤 {state.language === 'hi' ? 'सुन रहा हूँ... बोलें' : 'Listening... speak now'}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}
