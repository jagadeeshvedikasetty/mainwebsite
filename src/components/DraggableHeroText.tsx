'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type HeroTextProps = {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  scaleDesktop: number
  scaleMobile: number
  xDesktop: number
  yDesktop: number
  xMobile: number
  yMobile: number
  showTextDesktop: boolean
  showTextMobile: boolean
  showButtonDesktop: boolean
  showButtonMobile: boolean
}

export default function DraggableHeroText({
  title, subtitle, buttonText, buttonLink,
  scaleDesktop, scaleMobile,
  xDesktop, yDesktop, xMobile, yMobile,
  showTextDesktop, showTextMobile,
  showButtonDesktop, showButtonMobile
}: HeroTextProps) {
  const [isStudio, setIsStudio] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isTextSettingsOpen, setIsTextSettingsOpen] = useState(false)
  
  // Track local coordinates so dragging feels smooth
  const [localX, setLocalX] = useState(xDesktop)
  const [localY, setLocalY] = useState(yDesktop)

  const stateRef = useRef({ isDragging: false, localX: xDesktop, localY: yDesktop, isMobileView: false })

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current.localX = localX
    stateRef.current.localY = localY
    stateRef.current.isMobileView = isMobileView
  }, [localX, localY, isMobileView])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setIsStudio(params.get('preview') === 'true')
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobileView(mobile)
      setLocalX(mobile ? xMobile : xDesktop)
      setLocalY(mobile ? yMobile : yDesktop)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'STUDIO_SYNC') {
        setIsTextSettingsOpen(e.data.openSection === 'hero-text')
      }
    }
    window.addEventListener('message', handleMessage)
    
    // Request initial state from parent
    if (isStudio) {
      window.parent.postMessage({ type: 'REQUEST_STUDIO_SYNC' }, '*')
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('message', handleMessage)
    }
  }, [xDesktop, yDesktop, xMobile, yMobile, isStudio])

  useEffect(() => {
    if (!isStudio || !isTextSettingsOpen) return

    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isDragging) return
      
      const x = Math.max(0, Math.min(100, (e.clientX / window.innerWidth) * 100))
      const y = Math.max(0, Math.min(100, (e.clientY / window.innerHeight) * 100))
      
      setLocalX(x)
      setLocalY(y)
      
      window.parent.postMessage({
        type: 'HERO_TEXT_MOVE',
        isMobile: stateRef.current.isMobileView,
        x,
        y
      }, '*')
    }

    const handlePointerUp = () => {
      if (stateRef.current.isDragging) {
        setIsDragging(false)
        stateRef.current.isDragging = false
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isStudio])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isStudio || !isTextSettingsOpen) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    stateRef.current.isDragging = true
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (err) {}
  }

  const isDraggable = isStudio && isTextSettingsOpen

  // The fade-in animation runs on the outer wrapper.
  // The scaling and positioning run on the inner wrapper.
  return (
    <div 
      className={`animate-fade-in ${showTextDesktop === false ? 'hide-on-desktop' : ''} ${showTextMobile === false ? 'hide-on-mobile' : ''}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 10
      }}
    >
      <div 
        className="hero-content"
        style={{
          position: 'absolute',
          left: `${localX}%`,
          top: `${localY}%`,
          transform: `translate(-50%, -50%) scale(${isMobileView ? scaleMobile : scaleDesktop})`,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          maxWidth: '800px',
          cursor: isDraggable ? 'move' : 'default',
          outline: isDraggable ? '2px dashed rgba(255,255,255,0.5)' : 'none',
          touchAction: isDraggable ? 'none' : 'auto'
        }}
        onPointerDown={handlePointerDown}
      >
        <h1 className="hero-title font-traditional">{title}</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', fontWeight: 300, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
          {subtitle}
        </p>
        <Link href={buttonLink} className={`btn btn-primary ${showButtonDesktop === false ? 'hide-on-desktop' : ''} ${showButtonMobile === false ? 'hide-on-mobile' : ''}`} style={{ fontSize: '1.1rem', padding: '15px 40px' }} onClick={(e) => isStudio && e.preventDefault()}>
          {buttonText}
        </Link>
      </div>
    </div>
  )
}
