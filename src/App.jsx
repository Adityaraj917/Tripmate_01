import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppShell from './components/layout/AppShell'
import SplashScreen from './pages/auth/SplashScreen'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import HomePage from './pages/HomePage'
import FavouritesPage from './pages/FavouritesPage'
import ExplorerPage from './pages/ExplorerPage'
import GroupsPage from './pages/GroupsPage'
import GroupDetailPage from './pages/GroupDetailPage'
import TripPlannerPage from './pages/TripPlannerPage'
import ExpenseCalcPage from './pages/ExpenseCalcPage'
import ProfilePage from './pages/ProfilePage'

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true)
  const { isAuthenticated, loading } = useAuth()

  // Skip splash if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowSplash(false)
    }
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {showSplash && !isAuthenticated && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} 
        />

        {/* Protected Routes */}
        <Route path="/" element={
          <AuthGuard>
            <AppShell><HomePage /></AppShell>
          </AuthGuard>
        } />
        <Route path="/favourites" element={
          <AuthGuard>
            <AppShell><FavouritesPage /></AppShell>
          </AuthGuard>
        } />
        <Route path="/explorer" element={
          <AuthGuard>
            <AppShell><ExplorerPage /></AppShell>
          </AuthGuard>
        } />
        <Route path="/groups" element={
          <AuthGuard>
            <AppShell><GroupsPage /></AppShell>
          </AuthGuard>
        } />
        <Route path="/groups/:id" element={
          <AuthGuard>
            <AppShell><GroupDetailPage /></AppShell>
          </AuthGuard>
        } />
        <Route path="/trip-planner" element={
          <AuthGuard>
            <AppShell><TripPlannerPage /></AppShell>
          </AuthGuard>
        } />
        <Route path="/expense-calculator" element={
          <AuthGuard>
            <AppShell><ExpenseCalcPage /></AppShell>
          </AuthGuard>
        } />
        <Route path="/profile" element={
          <AuthGuard>
            <AppShell><ProfilePage /></AppShell>
          </AuthGuard>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
