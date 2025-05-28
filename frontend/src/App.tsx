import Dashboard from './components/dashboard/dashboard'
import { ThemeProvider } from './components/theme-provider'

function App() {

  return (
    <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
