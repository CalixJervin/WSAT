import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import LoginPage from "./Login_Page.tsx"
import Dashboard from "./Dashboard.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

import { TooltipProvider } from "@/components/ui/tooltip.tsx" 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)