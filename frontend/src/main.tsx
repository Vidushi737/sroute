import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Itineraries from './pages/Itineraries'
import AICopilot from './pages/AICopilot'
import SavedPlaces from './pages/SavedPlaces'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              {/* Public/Unauthenticated routes */}
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />

              {/* Authenticated routes sharing the sidebar navigation console shell */}
              <Route element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="itineraries" element={<Itineraries />} />
                <Route path="copilot" element={<AICopilot />} />
                <Route path="saved" element={<SavedPlaces />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

