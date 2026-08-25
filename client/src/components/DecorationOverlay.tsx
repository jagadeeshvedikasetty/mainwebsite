'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { supabase } from '../utils/supabase'

export const ICONS: Record<string, React.ReactNode> = {
  'kite': (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'sway 3s ease-in-out infinite alternate', transformOrigin: 'bottom center' }}>
      <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="#ff4d4d"/>
      <path d="M50 10 L90 50 L50 50 Z" fill="#ff1a1a"/>
      <path d="M50 90 L50 10" stroke="white" strokeWidth="2"/>
      <path d="M10 50 L90 50" stroke="white" strokeWidth="2"/>
      <style>{`@keyframes sway { 0% { transform: rotate(-10deg); } 100% { transform: rotate(10deg); } }`}</style>
    </svg>
  ),
  'diya': (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <path d="M20 60 Q50 90 80 60 Z" fill="#cc6600"/>
      <ellipse cx="50" cy="60" rx="30" ry="10" fill="#994d00"/>
      <path d="M50 55 Q40 30 50 20 Q60 30 50 55 Z" fill="#ffcc00" style={{ animation: 'flicker 0.5s infinite alternate', transformOrigin: 'bottom center' }}/>
      <style>{`@keyframes flicker { 0% { transform: scale(1) rotate(0deg); opacity: 1; } 50% { transform: scale(1.1) rotate(-2deg); opacity: 0.9; } 100% { transform: scale(0.9) rotate(2deg); opacity: 1; } }`}</style>
    </svg>
  ),
  'mango': (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'bounce-slow 2s infinite ease-in-out alternate' }}>
      <path d="M30 70 C 10 70, 10 30, 40 20 C 70 10, 90 40, 80 60 C 70 80, 50 70, 30 70 Z" fill="#ffcc00"/>
      <path d="M40 20 Q50 10 60 5" stroke="green" strokeWidth="4" fill="none"/>
      <path d="M50 10 Q65 10 70 20 Q55 25 50 10 Z" fill="green"/>
      <style>{`@keyframes bounce-slow { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }`}</style>
    </svg>
  ),
  'flower': (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'spin-slow 10s linear infinite', transformOrigin: 'center' }}>
      <circle cx="50" cy="50" r="15" fill="#ffcc00"/>
      <path d="M50 15 C60 15, 65 35, 50 35 C35 35, 40 15, 50 15 Z" fill="#ff66b2"/>
      <path d="M50 85 C60 85, 65 65, 50 65 C35 65, 40 85, 50 85 Z" fill="#ff66b2"/>
      <path d="M15 50 C15 60, 35 65, 35 50 C35 35, 15 40, 15 50 Z" fill="#ff66b2"/>
      <path d="M85 50 C85 60, 65 65, 65 50 C65 35, 85 40, 85 50 Z" fill="#ff66b2"/>
      <style>{`@keyframes spin-slow { 100% { transform: rotate(360deg); } }`}</style>
    </svg>
  ),
  'sparkle': (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'pulse-glow 1.5s infinite alternate' }}>
      <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#ffff66"/>
      <style>{`@keyframes pulse-glow { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.2); opacity: 1; } }`}</style>
    </svg>
  )
}

export default function DecorationOverlay() {
  const [decorations, setDecorations] = useState<any[]>([])
  const [isStudio, setIsStudio] = useState(false)
  
  useEffect(() => {
    // Hide this overlay if we are inside the admin studio iframe
    if (typeof window !== 'undefined' && window.location.search.includes('studio=true')) {
      setIsStudio(true)
      return
    }

    // Fetch immediately on mount
    const fetchDecorations = async () => {
      const { data, error } = await supabase
        .from('floating_decorations')
        .select('*')
        .eq('is_active', true)
      
      console.log('Polled decorations from Supabase:', data, error)
      if (data) setDecorations(data)
    }

    fetchDecorations()

    // Optionally set up an interval to poll for changes every 2 seconds
    // so they don't even have to refresh the page while editing!
    const interval = setInterval(fetchDecorations, 2000)
    return () => clearInterval(interval)
  }, [])

  if (isStudio || decorations.length === 0) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 99999 }}>
      {decorations.map((dec) => (
        <div
          key={dec.id}
          style={{
            position: 'absolute',
            left: `${dec.x_percent}%`,
            top: `${dec.y_percent}%`,
            transform: `translate(-50%, -50%) scale(${dec.size})`,
            width: '48px',
            height: '48px',
            fontSize: '48px',
            zIndex: 99999,
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {ICONS[dec.icon_name] ? (
            ICONS[dec.icon_name]
          ) : dec.icon_name.startsWith('lottie:') ? (
            <Lottie animationData={JSON.parse(dec.icon_name.substring(7))} loop={true} style={{ width: '100%', height: '100%' }} />
          ) : dec.icon_name.startsWith('data:image/') ? (
            <img src={dec.icon_name} alt="Decoration" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} draggable={false} />
          ) : (
            '🎉'
          )}
        </div>
      ))}
    </div>
  )
}
