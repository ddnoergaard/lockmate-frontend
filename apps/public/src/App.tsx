import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { PageTransition } from '@lockmate/ui'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PricingPage from './pages/PricingPage'
import ComparisonPage from './pages/ComparisonPage'
import ContactPage from './pages/ContactPage'
import EarlyAccessPage from './pages/EarlyAccessPage'
import FunctionPage from './pages/functions/FunctionPage'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"                    element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about"               element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/pricing"             element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/pricing/comparison"  element={<PageTransition><ComparisonPage /></PageTransition>} />
        <Route path="/contact"             element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/early-access"        element={<PageTransition><EarlyAccessPage /></PageTransition>} />
        <Route path="/features/:slug"      element={<PageTransition><FunctionPage /></PageTransition>} />
        <Route path="*"                    element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
