import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
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
      staleTime: 1000 * 60 * 5,
    },
  },
})

// ─── Protected Route Wrapper ───
// Redirects to /login if user is not authenticated
const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useApp()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAF0EE]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#D85A38]/30 border-t-[#D85A38] rounded-full animate-spin" />
          <p className="text-xs text-[#4F5E59]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

// ─── Public Route Wrapper ───
// Redirects authenticated users away from login/signup to dashboard
const PublicRoute: React.FC = () => {
  const { user, isLoading } = useApp()

  if (isLoading) {
    return null
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              {/* Public routes — redirect to dashboard if already logged in */}
              <Route element={<PublicRoute />}>
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>

              {/* Protected routes — require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="itineraries" element={<Itineraries />} />
                  <Route path="copilot" element={<AICopilot />} />
                  <Route path="saved" element={<SavedPlaces />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
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
