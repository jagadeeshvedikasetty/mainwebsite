'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export const ICONS: Record<string, string> = {
  'kite': '🪁',
  'diya': '🪔',
  'mango': '🥭',
  'flower': '🌸',
  'sparkle': '✨'
}

export default function DecorationOverlay() {
  const [decorations, setDecorations] = useState<any[]>([])
  
  useEffect(() => {
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

  if (decorations.length === 0) return null

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
            fontSize: '48px',
            userSelect: 'none',
            transition: 'all 0.3s ease-out'
          }}
        >
          {ICONS[dec.icon_name] || '🎉'}
        </div>
      ))}
    </div>
  )
}
