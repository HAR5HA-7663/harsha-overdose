'use client'

import { useEffect, useState } from 'react'

/**
 * Adaptive quality tier for the 3D scenes.
 * "low" = coarse-pointer or narrow viewport (phones/tablets): skip bloom,
 * cap devicePixelRatio, reduce geometry. "high" = everything on.
 * Listens for viewport changes so rotation/resize re-tiers live.
 */
export function useAdaptivePerf(): { tier: 'low' | 'high'; dpr: [number, number] } {
  const [low, setLow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 1023px)')
    const update = () => setLow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return low
    ? { tier: 'low', dpr: [1, 1.25] }
    : { tier: 'high', dpr: [1, 2] }
}
