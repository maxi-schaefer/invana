import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/private-route'
import Login from './pages/Login'

function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
