'use client'

import { useEffect, useState } from 'react'

export type WebGLState = 'unknown' | 'available' | 'unavailable'

export function useWebGLSupport(): WebGLState {
  const [state, setState] = useState<WebGLState>('unknown')

  useEffect(() => {
    if (typeof window === 'undefined') return
    // rAF defers the probe out of the effect body — avoids a synchronous
    // setState-in-effect cascade and lets first paint happen with 'unknown'.
    const raf = requestAnimationFrame(() => {
      try {
        const c = document.createElement('canvas')
        const gl =
          (c.getContext('webgl2') as WebGLRenderingContext | null) ||
          (c.getContext('webgl') as WebGLRenderingContext | null) ||
          (c.getContext('experimental-webgl') as WebGLRenderingContext | null)
        setState(gl ? 'available' : 'unavailable')
      } catch {
        setState('unavailable')
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return state
}
