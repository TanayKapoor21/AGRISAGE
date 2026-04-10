import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, AppAction } from '../types'

const initialState: AppState = {
  theme: 'dark',
  language: 'en',
  apiStatus: { gemini: 'active', weather: 'active' },
  sidebarCollapsed: false,
  highContrast: false,
  userName: 'Farmer',
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem('agrisage_app_state')
    if (raw) {
      const saved = JSON.parse(raw)
      return { ...initialState, ...saved }
    }
  } catch { /* use defaults */ }
  return initialState
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_API_STATUS':
      return { ...state, apiStatus: { ...state.apiStatus, ...action.payload } }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case 'TOGGLE_HIGH_CONTRAST':
      return { ...state, highContrast: !state.highContrast }
    case 'SET_USERNAME':
      return { ...state, userName: action.payload }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('agrisage_app_state', JSON.stringify(state))
  }, [state])

  // Apply theme class to HTML element
  useEffect(() => {
    const html = document.documentElement
    if (state.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [state.theme])

  // Apply high contrast
  useEffect(() => {
    const body = document.body
    if (state.highContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }
  }, [state.highContrast])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
