import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { PageTransition } from '@lockmate/ui'
import AuthPage from './pages/AuthPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import CreateOrganisationPage from './pages/CreateOrganisationPage'
import InviteCodePage from './pages/InviteCodePage'
import OnboardingVaultsPage from './pages/OnboardingVaultsPage'
import OnboardingImportPage from './pages/OnboardingImportPage'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/app/DashboardPage'
import CredentialsPage from './pages/app/CredentialsPage'
import VaultPage from './pages/app/VaultPage'
import OrganisationPage from './pages/app/OrganisationPage'
import AccountPage from './pages/app/AccountPage'
import SettingsPage from './pages/app/SettingsPage'
import AppOrgSetupPage from './pages/app/AppOrgSetupPage'
import AppOrgCreatePage from './pages/app/AppOrgCreatePage'
import AppOrgJoinPage from './pages/app/AppOrgJoinPage'
import AppOrgVaultsPage from './pages/app/AppOrgVaultsPage'
import AppOrgImportPage from './pages/app/AppOrgImportPage'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function RootRedirect() {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()) {
        return <Navigate to="/app/dashboard" replace />
      }
    }
  } catch {}
  return <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"           element={<RootRedirect />} />
        <Route path="/login"      element={<PageTransition><AuthPage /></PageTransition>} />
        <Route path="/register"   element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />
        <Route path="/onboarding/organisation" element={<PageTransition><CreateOrganisationPage /></PageTransition>} />
        <Route path="/onboarding/invite"       element={<PageTransition><InviteCodePage /></PageTransition>} />
        <Route path="/onboarding/vaults"       element={<PageTransition><OnboardingVaultsPage /></PageTransition>} />
        <Route path="/onboarding/import"       element={<PageTransition><OnboardingImportPage /></PageTransition>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardPage />} />
            <Route path="credentials"  element={<CredentialsPage />} />
            <Route path="vault"        element={<VaultPage />} />
            <Route path="organisation"         element={<OrganisationPage />} />
            <Route path="organisation/setup"  element={<AppOrgSetupPage />} />
            <Route path="organisation/create" element={<AppOrgCreatePage />} />
            <Route path="organisation/join"   element={<AppOrgJoinPage />} />
            <Route path="organisation/vaults" element={<AppOrgVaultsPage />} />
            <Route path="organisation/import" element={<AppOrgImportPage />} />
            <Route path="account"      element={<AccountPage />} />
            <Route path="settings"     element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
