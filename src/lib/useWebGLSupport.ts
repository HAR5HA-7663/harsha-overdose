'use client'

import { useEffect, useState } from 'react'

export type WebGLState = 'unknown' | 'available' | 'unavailable'

export function useWebGLSupport(): WebGLState {
  const [state, setState] = useState<WebGLState>('unknown')

  useEffect(() => {
    if (typeof window === 'undefined') return
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
  }, [])

  return state
}
