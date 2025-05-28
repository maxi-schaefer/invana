import './App.css'
import Dashboard from './components/dashboard/dashboard'
import { AppSidebar } from './components/sidebar/app-sidebar'
import { ThemeProvider } from './components/theme-provider'
import { SidebarProvider } from './components/ui/sidebar'

function App() {

  return (
    <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
