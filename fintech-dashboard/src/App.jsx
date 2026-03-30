import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import Results from './components/Results'
import Analytics from './components/Analytics'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import Loading from './components/Loading'
import { InvestmentProvider } from './context/InvestmentContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showCursorGlow, setShowCursorGlow] = useState(true)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) {
      setShowCursorGlow(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {}
      {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen bg-[#0B0F1A]"
      >
        <InvestmentProvider>
          <Router>
            {}
            <div className="noise-overlay" />

            {}
            {showCursorGlow && <CursorGlow />}

            {}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {}
            <Navbar />

            {}
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/results" element={<Results />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>

              {}
              <Routes>
                <Route path="/*" element={<Footer />} />
              </Routes>
            </main>
          </Router>
        </InvestmentProvider>
      </motion.div>
    </>
  )
}

export default App
