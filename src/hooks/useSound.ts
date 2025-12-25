"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Howl } from "howler";

// Sound URLs - using data URIs for built-in sounds
// These are simple synthesized sounds that work without external files

export function useGunshot() {
  const [isMuted, setIsMuted] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Create a simple gunshot-like sound using oscillator
    // Since Howler needs audio files, we'll use Web Audio API for simple sounds
    return () => {
      soundRef.current?.unload();
    };
  }, []);

  const play = useCallback(() => {
    if (isMuted) return;

    // Use Web Audio API for simple gunshot sound
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Create noise for gunshot
      const bufferSize = audioContext.sampleRate * 0.1; // 100ms
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Exponential decay noise
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      // Add some low-pass filter for more "thump"
      const filter = audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1000;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.3;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.start();

      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, 200);
    } catch {
      // Audio not supported, fail silently
    }
  }, [isMuted]);

  return { play, isMuted, setIsMuted };
}

export function useComboSound() {
  const [isMuted, setIsMuted] = useState(false);

  const play = useCallback((comboCount: number) => {
    if (isMuted) return;

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Higher pitch for higher combos
      const baseFreq = 300 + (comboCount * 50);

      const oscillator = audioContext.createOscillator();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioContext.currentTime + 0.05);

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);

      setTimeout(() => {
        audioContext.close();
      }, 200);
    } catch {
      // Audio not supported
    }
  }, [isMuted]);

  return { play, isMuted, setIsMuted };
}

export function useSoundToggle() {
  const [isMuted, setIsMuted] = useState(true); // Start muted by default

  const toggle = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { isMuted, toggle, setIsMuted };
}
