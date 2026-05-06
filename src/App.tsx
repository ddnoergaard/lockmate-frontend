import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PageTransition from './components/PageTransition'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import CreateOrganisationPage from './pages/CreateOrganisationPage'
import InviteCodePage from './pages/InviteCodePage'
import PricingPage from './pages/PricingPage'
import AboutPage from './pages/AboutPage'
import FunctionPage from './pages/functions/FunctionPage'
import ContactPage from './pages/ContactPage'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/app/DashboardPage'
import CredentialsPage from './pages/app/CredentialsPage'
import VaultPage from './pages/app/VaultPage'
import OrganisationPage from './pages/app/OrganisationPage'
import AccountPage from './pages/app/AccountPage'
import SettingsPage from './pages/app/SettingsPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — each wrapped individually so the shell never animates */}
        <Route path="/"         element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login"    element={<PageTransition><AuthPage /></PageTransition>} />
        <Route path="/register"   element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />
        <Route path="/onboarding/organisation" element={<PageTransition><CreateOrganisationPage /></PageTransition>} />
        <Route path="/onboarding/invite"       element={<PageTransition><InviteCodePage /></PageTransition>} />
        <Route path="/pricing"  element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/about"         element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact"       element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/features/:slug" element={<PageTransition><FunctionPage /></PageTransition>} />

        {/* App — gated by JWT check, AppLayout is stable, only <Outlet> content transitions */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardPage />} />
            <Route path="credentials"  element={<CredentialsPage />} />
            <Route path="vault"        element={<VaultPage />} />
            <Route path="organisation" element={<OrganisationPage />} />
            <Route path="account"      element={<AccountPage />} />
            <Route path="settings"     element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
