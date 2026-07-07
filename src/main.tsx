import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { SpeechProvider } from './context/SpeechContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <SpeechProvider>
          <App />
        </SpeechProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
)
