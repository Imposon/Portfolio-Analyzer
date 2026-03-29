import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Loading({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setIsLoading(false)
            onLoadingComplete?.()
          }, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    return () => clearInterval(timer)
  }, [onLoadingComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0B0F1A]"
        >
          {/* 3D Spinning Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-12"
          >
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 rounded-full border-2 border-transparent border-t-cyan-400 border-r-purple-500"
            />

            {/* Middle Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border-2 border-transparent border-t-purple-500 border-l-cyan-400"
            />

            {/* Inner Logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
            >
              <span className="text-3xl font-bold text-white">F</span>
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl" />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold gradient-text mb-4"
          >
            FINEO
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 mb-8"
          >
            Loading 3D Experience...
          </motion.p>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Progress Text */}
          <motion.span
            className="mt-4 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.span>

          {/* Floating Particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-400/30"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0 
              }}
              animate={{ 
                y: [null, Math.random() * -100],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
