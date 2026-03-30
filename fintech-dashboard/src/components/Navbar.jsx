import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { 
    name: 'Dashboard', 
    icon: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    ), 
    to: '/dashboard'
  },
  { 
    name: 'Portfolio', 
    icon: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
        <path d="M22 12A10 10 0 0 0 12 2v10z"/>
      </svg>
    ), 
    to: '/results'
  },
  { 
    name: 'Analytics', 
    icon: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ), 
    to: '/analytics'
  },
  { 
    name: 'Settings', 
    icon: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 0 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 0-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ), 
    to: '/'
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5"/>
              <path d="M3 12v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>
              <path d="M3 12h18"/>
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">FINEO</span>
        </motion.div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <link.icon />
                <span>{link.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
