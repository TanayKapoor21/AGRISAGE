// ─── Web Speech API Service ──────────────────────────────────────
// Speech-to-Text (STT) and Text-to-Speech (TTS) for multilingual voice

import type { Language } from '../types'

const LANG_MAP: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
}

// ─── Speech Recognition (STT) ──────────────────────────────────

interface SpeechRecognitionCallbacks {
  onResult: (transcript: string) => void
  onError: (error: string) => void
  onEnd: () => void
  onStart: () => void
}

let recognition: any = null

export function startListening(language: Language, callbacks: SpeechRecognitionCallbacks): void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    callbacks.onError('Speech recognition is not supported in this browser.')
    return
  }

  stopListening() // Stop any existing session

  recognition = new SpeechRecognition()
  recognition.lang = LANG_MAP[language]
  recognition.interimResults = false
  recognition.continuous = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => callbacks.onStart()

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    callbacks.onResult(transcript)
  }

  recognition.onerror = (event: any) => {
    const errorMap: Record<string, string> = {
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'Microphone not found. Please check your device.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'network': 'Network error. Please check your connection.',
    }
    callbacks.onError(errorMap[event.error] || `Speech error: ${event.error}`)
  }

  recognition.onend = () => callbacks.onEnd()

  try {
    recognition.start()
  } catch (error) {
    callbacks.onError('Failed to start speech recognition.')
  }
}

export function stopListening(): void {
  if (recognition) {
    try {
      recognition.stop()
    } catch {
      // Already stopped
    }
    recognition = null
  }
}

// ─── Speech Synthesis (TTS) ─────────────────────────────────────

let currentUtterance: SpeechSynthesisUtterance | null = null

export function speak(text: string, language: Language): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported')
    return
  }

  stopSpeaking()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_MAP[language]
  utterance.rate = 0.9
  utterance.pitch = 1.0
  utterance.volume = 1.0

  // Try to find an appropriate voice
  const voices = window.speechSynthesis.getVoices()
  const targetLang = LANG_MAP[language]
  const voice = voices.find(v => v.lang === targetLang) || voices.find(v => v.lang.startsWith(language))
  if (voice) utterance.voice = voice

  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
  currentUtterance = null
}

export function isSpeaking(): boolean {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking
}

// ─── Availability Checks ───────────────────────────────────────

export function isSpeechRecognitionSupported(): boolean {
  return Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  )
}

export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window
}
