'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function IntroOverlay() {
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => setVisible(false), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 bg-[#06080F] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 0 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="text-white/40 font-mono text-[11px] tracking-[0.4em] uppercase"
          >
            initializing latent space
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 6 }}
            transition={{ duration: 0.5 }}
            className="text-white text-4xl md:text-5xl font-display mt-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Harsha Yellela
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="text-[#FFB347] font-mono text-xs tracking-widest uppercase mt-4"
          >
            click any node · search anything · enter /teli
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
