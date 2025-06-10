import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import PrivateRoute from './components/private-route'
import Login from './pages/Login'
import DashboardLayout from './layouts/dashboard-layout'
import { SocketProvider } from './context/SocketProvider'
import { getToken } from './utils/auth'

// Pages
import DashboardOverview from './pages/dashboard/dashboard-overview'
import ScriptLibrary from './pages/dashboard/script-library'
import VersionHistory from './pages/dashboard/version-history'
import AgentSettings from './pages/dashboard/agent-settings'
import AgentInventory from './pages/dashboard/agent-inventory'
import AccountSettings from './pages/user/account-settings'
import { SidebarProvider } from './components/ui/sidebar'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <SocketProvider token={getToken()}>
                    <DashboardLayout />
                  </SocketProvider>
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="scripts" element={<ScriptLibrary />} />
              <Route path="history" element={<VersionHistory />} />
              <Route path="agents" element={<AgentSettings />} />
              <Route path="agents-inventory" element={<AgentInventory />} />
              <Route path="account" element={<AccountSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
