'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Lottie } from 'lottie-react'
import { supabase } from '../utils/supabase'

export const ICONS: Record<string, React.ReactNode> = {
  'kite': (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} overflow="visible">
      <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="#ff4d4d"/>
      <path d="M50 10 L90 50 L50 50 Z" fill="#ff1a1a"/>
      <path d="M50 90 L50 10" stroke="white" strokeWidth="2"/>
      <path d="M10 50 L90 50" stroke="white" strokeWidth="2"/>
      <path d="M50 90 Q35 110 50 130 T50 170" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" />
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

function CustomDecoration({ url }: { url: string }) {
  const isLottie = url.toLowerCase().endsWith('.json')
  const [lottieData, setLottieData] = useState<any>(null)

  useEffect(() => {
    if (isLottie) {
      fetch(url)
        .then(res => res.json())
        .then(data => setLottieData(data))
        .catch(err => console.error("Failed to load Lottie JSON", err))
    }
  }, [url, isLottie])

  if (isLottie && lottieData) {
    return (
      <Lottie 
        src={lottieData} 
        loop={true} 
        autoplay={true}
        style={{ width: '100%', height: '100%' }} 
      />
    )
  }

  if (!isLottie) {
    return (
      <img src={url} alt="Decoration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
    )
  }

  return null
}

export default function DecorationOverlay() {
  const [decorations, setDecorations] = useState<any[]>([])
  const [isStudio, setIsStudio] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const urlIsStudio = typeof window !== 'undefined' && window.location.search.includes('studio=true')
    
    if (urlIsStudio) {
      setIsStudio(true)
      
      const handleMessage = (e: MessageEvent) => {
        if (e.data?.type === 'STUDIO_SYNC') {
          setDecorations(e.data.decorations)
        }
      }
      window.addEventListener('message', handleMessage)
      
      // Tell parent we are ready to receive data
      window.parent.postMessage({ type: 'STUDIO_READY' }, '*')
      
      return () => window.removeEventListener('message', handleMessage)
    } else {
      // Normal website logic
      const fetchDecorations = async () => {
        const { data } = await supabase.from('floating_decorations').select('*').eq('is_active', true)
        if (data) setDecorations(data)
      }
      fetchDecorations()
      const interval = setInterval(fetchDecorations, 2000)
      return () => clearInterval(interval)
    }
  }, [])

  if (!mounted || decorations.length === 0) return null

  // Render each decoration inside its specific Hotspot container using Portals
  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .hide-on-mobile { display: none !important; }
        }
        @media (min-width: 768px) {
          .hide-on-desktop { display: none !important; }
        }
      `}</style>
      
      {decorations.filter(d => d.is_active || isStudio).map((dec) => {
        const hotspotNode = dec.hotspot_id ? document.getElementById(dec.hotspot_id) : null;
        
        // If a hotspot is specified but not found on this page, don't render it.
        // Or if it's the old absolute positioning system, we can fallback to body overlay.
        
        const content = (
          <div
            key={dec.id}
            className={`responsive-dec ${dec.show_on_mobile === false ? 'hide-on-mobile' : ''} ${dec.show_on_desktop === false ? 'hide-on-desktop' : ''}`}
            style={{
              position: 'absolute',
              left: dec.hotspot_id ? '50%' : `${dec.x_percent}%`,
              top: dec.hotspot_id ? '50%' : `${dec.y_percent}%`,
              width: dec.hotspot_id ? '100%' : `${(dec.size || 1) * 60}px`,
              height: dec.hotspot_id ? '100%' : `${(dec.size || 1) * 60}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: dec.opacity || 1
            }}
          >
            {ICONS[dec.icon_name] ? (
              ICONS[dec.icon_name]
            ) : dec.icon_name.startsWith('http') ? (
              <CustomDecoration url={dec.icon_name} />
            ) : dec.icon_name.startsWith('lottie:') ? (
              <Lottie src={JSON.parse(dec.icon_name.substring(7))} autoplay={true} loop={true} style={{ width: '100%', height: '100%' }} />
            ) : dec.icon_name.startsWith('data:image/') ? (
              <img src={dec.icon_name} alt="Decoration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable={false} />
            ) : (
              '🎉'
            )}
          </div>
        );

        if (hotspotNode) {
          return createPortal(content, hotspotNode);
        } else if (!dec.hotspot_id) {
          return createPortal(content, document.body);
        }
        
        return null;
      })}
    </>
  )
}
