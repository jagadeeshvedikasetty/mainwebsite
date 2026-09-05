'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

function parsePosition(posStr: string, isX: boolean): number {
  if (!posStr) return 50;
  if (posStr === 'center') return 50;
  if (posStr === 'top' && !isX) return 0;
  if (posStr === 'bottom' && !isX) return 100;
  if (posStr === 'left' && isX) return 0;
  if (posStr === 'right' && isX) return 100;
  if (posStr.includes('%')) {
    const parts = posStr.split(' ');
    const part = parts.length > 1 ? (isX ? parts[0] : parts[1]) : parts[0];
    return parseFloat(part) || 50;
  }
  return 50;
}

export default function DraggableHeroImage({
  desktopSrc,
  mobileSrc,
  initialDesktopHeight,
  initialMobileHeight,
  initialDesktopPos,
  initialMobilePos,
  initialDesktopZoom,
  initialMobileZoom,
  isStudio
}: any) {
  const [dHeight, setDHeight] = useState(initialDesktopHeight);
  const [mHeight, setMHeight] = useState(initialMobileHeight);
  const [dPos, setDPos] = useState(initialDesktopPos);
  const [mPos, setMPos] = useState(initialMobilePos);
  const [dZoom, setDZoom] = useState(initialDesktopZoom);
  const [mZoom, setMZoom] = useState(initialMobileZoom);

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 50, startPosY: 50 });

  useEffect(() => {
    if (!isStudio) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'STUDIO_HERO_ADJUSTMENTS') {
        setDHeight(e.data.desktopHeight);
        setMHeight(e.data.mobileHeight);
        setDPos(e.data.desktopPosition);
        setMPos(e.data.mobilePosition);
        setDZoom(e.data.desktopZoom);
        setMZoom(e.data.mobileZoom);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isStudio]);

  const handlePointerDown = (e: React.PointerEvent, isMobile: boolean) => {
    if (!isStudio) return;
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const pos = isMobile ? mPos : dPos;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: parsePosition(pos, true),
      startPosY: parsePosition(pos, false)
    };
  };

  const handlePointerMove = (e: React.PointerEvent, isMobile: boolean) => {
    if (!isDragging || !isStudio) return;

    const container = isMobile ? mobileRef.current : desktopRef.current;
    if (!container) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const factorX = 100 / (container.clientWidth || 1000);
    const factorY = 100 / (container.clientHeight || 500);

    let newX = dragRef.current.startPosX - (dx * factorX);
    let newY = dragRef.current.startPosY - (dy * factorY);

    newX = Math.max(0, Math.min(newX, 100));
    newY = Math.max(0, Math.min(newY, 100));

    const newPosStr = `${newX.toFixed(2)}% ${newY.toFixed(2)}%`;

    if (isMobile) {
      setMPos(newPosStr);
    } else {
      setDPos(newPosStr);
    }

    // Send back to admin panel
    window.parent.postMessage({
      type: 'HERO_IMAGE_DRAGGED',
      isMobile,
      position: newPosStr
    }, '*');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isStudio) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <>
      <div 
        ref={desktopRef}
        className="hero-bg-desktop" 
        style={{ height: `${dHeight}vh`, overflow: 'hidden', cursor: isStudio ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onPointerDown={e => handlePointerDown(e, false)}
        onPointerMove={e => handlePointerMove(e, false)}
        onPointerUp={handlePointerUp}
      >
        <Image 
          src={desktopSrc} 
          alt="Janani Home Foods" 
          fill 
          priority 
          className="hero-img" 
          unoptimized={desktopSrc.startsWith('http')} 
          style={{ objectFit: 'cover', objectPosition: dPos, transform: `scale(${dZoom})`, pointerEvents: 'none' }} 
        />
      </div>
      <div 
        ref={mobileRef}
        className="hero-bg-mobile" 
        style={{ height: `${mHeight}vh`, overflow: 'hidden', cursor: isStudio ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onPointerDown={e => handlePointerDown(e, true)}
        onPointerMove={e => handlePointerMove(e, true)}
        onPointerUp={handlePointerUp}
      >
        <Image 
          src={mobileSrc} 
          alt="Janani Home Foods" 
          fill 
          priority 
          className="hero-img" 
          unoptimized={mobileSrc.startsWith('http')} 
          style={{ objectFit: 'cover', objectPosition: mPos, transform: `scale(${mZoom})`, pointerEvents: 'none' }} 
        />
      </div>
      
      {/* Global Hero Hotspots (Responsive) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: 'none' }}>
        <div id="hotspot-hero-top-left" className="hotspot-large" style={{ position: 'absolute', top: '24px', left: '24px', pointerEvents: 'none' }}></div>
        <div id="hotspot-hero-top-right" className="hotspot-large" style={{ position: 'absolute', top: '24px', right: '24px', pointerEvents: 'none' }}></div>
        <div id="hotspot-hero-bottom-left" className="hotspot-large" style={{ position: 'absolute', bottom: '24px', left: '24px', pointerEvents: 'none' }}></div>
        <div id="hotspot-hero-bottom-right" className="hotspot-large" style={{ position: 'absolute', bottom: '24px', right: '24px', pointerEvents: 'none' }}></div>
      </div>
    </>
  );
}
