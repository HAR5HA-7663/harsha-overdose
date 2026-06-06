'use client'

import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback: ReactNode }
type State = { hasError: boolean; error?: Error }

// Catches render-time crashes inside the R3F CallScene so the rest of the
// /teli page (subtitles, side panels, controls) stays usable. Real Chrome on
// a real GPU rarely trips this; testing in headless environments without
// hardware-accelerated WebGL will. Either way, fail gracefully.
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    if (typeof console !== 'undefined') {
      console.warn('[SceneErrorBoundary] CallScene crashed; showing fallback.', error)
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
