import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import LoginPage from './Login_Page.tsx'
import Dashboard from './Dashboard.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { TooltipProvider } from '@/components/ui/tooltip.tsx'
import { supabase } from './supabaseClient'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      setIsInitializing(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: username, 
      password: password,
    })

    if (error) {
      console.error("Login failed:", error.message)
      return false 
    } 
    return true
  }

  const handleSignUp = async (username: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email: username,
      password: password,
    })

    if (error) {
      console.error("Signup failed:", error.message)
      return false
    }
    return true
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500 font-medium">Loading session...</div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <TooltipProvider>
        {isLoggedIn ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />
        )}
      </TooltipProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)