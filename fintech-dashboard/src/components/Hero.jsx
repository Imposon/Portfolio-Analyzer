import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Scene3D from './Scene3D'

const ArrowRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m7 17 10-10m0 0v6m0-6h-6"/>
  </svg>
)

const Sparkles = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m12 2-2 7-7 2 7 2-2 7 2-7 7-2z"/>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0-7.78z"/>
  </svg>
)

const User = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleCreateProfile = () => {
    navigate('/dashboard')
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* 3D Scene - Right Side */}
      <div className="absolute inset-0 z-10">
        <Scene3D />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content - Clean Landing */}
        <div className="space-y-8 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cyan-400">
              <Sparkles />
              <span>AI Investment Advisor</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            <span className="text-white">Smart</span>
            <br />
            <span className="gradient-text">Investing</span>
            <br />
            <span className="text-white">Starts Here</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 max-w-md"
          >
            Get personalized investment recommendations powered by AI. 
            Build your portfolio based on your risk profile and financial goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={handleCreateProfile}
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <User className={isHovered ? "animate-pulse" : ""} />
              <span>Create Profile</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 gap-6 pt-8"
          >
            {[
              { value: 'AI-Powered', label: 'Smart Analysis' },
              { value: 'Risk-Based', label: 'Personalized' },
              { value: 'Real Assets', label: 'Indian Markets' },
              { value: 'Expert Advice', label: 'Beginner Friendly' },
            ].map((stat, index) => (
              <div key={index} className="text-left glass-card p-4 rounded-xl">
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-lg font-bold gradient-text">{stat.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Reserved for 3D Scene */}
        <div className="hidden lg:block h-[600px]" />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Create Profile to Begin</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-500 flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
