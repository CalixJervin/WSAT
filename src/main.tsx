import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import LoginPage from './Login_Page.tsx'
import Dashboard from './Dashboard.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { TooltipProvider } from '@/components/ui/tooltip.tsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (username: string, password: string) => {
    const valid = username === 'admin' && password === 'password'
    if (valid) setIsLoggedIn(true)
    return valid
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <ThemeProvider>
      <TooltipProvider>
        {isLoggedIn ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </TooltipProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
