import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'A' || 
          e.target.closest('button') || 
          e.target.closest('a')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      {/* Main Cursor Glow */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
          scale: isHovering ? 2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      >
        <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-[80px]" />
      </motion.div>

      {/* Small Dot Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-2 h-2 rounded-full bg-white"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Ring around cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9998] w-8 h-8 rounded-full border border-white/30"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
        }}
      />
    </>
  )
}
