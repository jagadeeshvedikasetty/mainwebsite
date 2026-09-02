'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../utils/supabase'

import { Lottie, LottieHandle } from 'lottie-react'

export default function EffectsOverlay() {
  const [activeEffect, setActiveEffect] = useState<string | null>(null)
  const [customEffectUrl, setCustomEffectUrl] = useState<string | null>(null)
  const [customEffects, setCustomEffects] = useState<any[]>([])
  const [settings, setSettings] = useState({ opacity: 0.7, scale: 1.0, speed: 1.0, density: 1.0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initial fetch
    const fetchTheme = async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('active_effect, custom_effect_url, effect_opacity, effect_scale, effect_speed, effect_density')
        .eq('id', 'active_theme')
        .maybeSingle()
      
      if (!error && data) {
        setActiveEffect(data.active_effect)
        setCustomEffectUrl(data.custom_effect_url)
        setSettings({
          opacity: data.effect_opacity ?? 0.7,
          scale: data.effect_scale ?? 1.0,
          speed: data.effect_speed ?? 1.0,
          density: data.effect_density ?? 1.0
        })
      } else {
        setActiveEffect(null)
        setCustomEffectUrl(null)
      }

      const { data: ceData } = await supabase.from('custom_effects').select('*')
      if (ceData) setCustomEffects(ceData)
    }

    fetchTheme()

    // Realtime subscription
    const channel = supabase
      .channel('schema-db-changes-effects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'themes',
        },
        () => {
          fetchTheme()
        }
      )
      .subscribe()

    const channel2 = supabase
      .channel('schema-db-changes-custom-effects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_effects' }, () => {
        fetchTheme()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(channel2)
    }
  }, [])

  if (!mounted || (!activeEffect && !customEffectUrl)) return null;

  const overlay = (
    <div 
      className="pointer-events-none" 
      aria-hidden="true"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647,
        isolation: 'isolate',
        transform: 'translateZ(0)',
        willChange: 'transform',
        pointerEvents: 'none'
      }}
    >
      {customEffectUrl ? (
        <CustomEffect url={customEffectUrl} speed={settings.speed} scale={settings.scale} opacity={settings.opacity} />
      ) : (
        <>
          {activeEffect === 'rain' && <RainEffect speed={settings.speed} density={settings.density} scale={settings.scale} opacity={settings.opacity} />}
          {activeEffect === 'snow' && <SnowEffect speed={settings.speed} density={settings.density} scale={settings.scale} opacity={settings.opacity} />}
          {activeEffect === 'confetti' && <ConfettiEffect speed={settings.speed} density={settings.density} scale={settings.scale} opacity={settings.opacity} />}
          {activeEffect === 'kites' && <KitesEffect speed={settings.speed} density={settings.density} scale={settings.scale} opacity={settings.opacity} />}
          {activeEffect === 'sparkles' && <SparklesEffect speed={settings.speed} density={settings.density} scale={settings.scale} opacity={settings.opacity} />}
          {customEffects.map(eff => (
            activeEffect === eff.id ? <GenericParticleEffect key={eff.id} url={eff.icon_url} animType={eff.animation_type} speed={settings.speed} density={settings.density} scale={settings.scale} opacity={settings.opacity} /> : null
          ))}
        </>
      )}
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes flyAcrossNavbar {
          0% { transform: translateX(-10vw) translateY(0) rotate(20deg) scale(var(--kite-scale, 1)); opacity: 0; }
          10% { opacity: 1; transform: translateX(10vw) translateY(-10px) rotate(15deg) scale(var(--kite-scale, 1)); }
          50% { transform: translateX(50vw) translateY(10px) rotate(25deg) scale(var(--kite-scale, 1)); }
          90% { opacity: 1; transform: translateX(90vw) translateY(-5px) rotate(15deg) scale(var(--kite-scale, 1)); }
          100% { transform: translateX(110vw) translateY(0) rotate(20deg) scale(var(--kite-scale, 1)); opacity: 0; }
        }
      `}</style>
      {createPortal(overlay, document.body)}
    </>
  )
}

function GenericParticleEffect({ url, animType, speed, density, scale, opacity }: { url: string, animType: string, speed: number, density: number, scale: number, opacity: number }) {
  const durationFactor = 1 / speed;
  const count = Math.max(1, Math.round((animType === 'falling' ? 40 : animType === 'floating' ? 30 : 15) * density));
  
  const [lottieData, setLottieData] = useState<any>(null);
  const isSvg = url.toLowerCase().endsWith('.svg') || url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.jpg');

  useEffect(() => {
    if (!isSvg) {
      fetch(url)
        .then(res => res.json())
        .then(data => setLottieData(data))
        .catch(err => console.error("Failed to load Lottie JSON", err));
    }
  }, [url, isSvg]);

  return (
    <div className="w-full h-full" style={{ opacity }}>
      <style>{`
        .generic-particle {
          position: absolute;
          width: 40px;
          height: 40px;
          animation: genericAnim linear infinite;
        }
        @keyframes genericAnim {
          0% { 
            transform: ${animType === 'falling' ? `translateY(-10vh) scale(${scale})` : animType === 'flying' ? `translateY(110vh) translateX(-5vw) scale(${scale}) rotate(-10deg)` : `scale(${0.8 * scale}) translateY(0)`};
            ${animType === 'flying' ? 'opacity: 0;' : ''}
          }
          10% { ${animType === 'flying' ? 'opacity: 1;' : ''} }
          50% { ${animType === 'flying' ? `transform: translateY(30vh) translateX(5vw) scale(${scale}) rotate(10deg);` : ''} }
          90% { ${animType === 'flying' ? 'opacity: 1;' : ''} }
          100% { 
            transform: ${animType === 'falling' ? `translateY(110vh) translateX(20px) scale(${scale})` : animType === 'flying' ? `translateY(-30vh) translateX(-5vw) scale(${scale}) rotate(-10deg)` : `scale(${1.5 * scale}) translateY(-20px)`};
            ${animType === 'flying' ? 'opacity: 0;' : ''}
          }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const top = animType === 'floating' ? Math.random() * 100 : 0;
        const delay = Math.random() * (animType === 'flying' ? -20 : 5);
        const duration = ((animType === 'falling' ? 3 + Math.random() * 4 : animType === 'flying' ? 15 + Math.random() * 10 : 1 + Math.random() * 2)) * durationFactor;
        const sizeMultiplier = animType === 'flying' ? (Math.random() * 0.5 + 0.8) : 1;
        
        return (
          <div 
            key={i} 
            className="generic-particle" 
            style={{ 
              left: left + "%", 
              top: animType === 'floating' ? top + "%" : "0",
              width: `${40 * sizeMultiplier}px`,
              height: `${40 * sizeMultiplier}px`,
              animationDelay: delay + "s", 
              animationDuration: duration + "s",
              animationTimingFunction: animType === 'floating' ? 'ease-in-out' : 'linear',
              animationDirection: animType === 'floating' ? 'alternate' : 'normal'
            }} 
          >
            {isSvg ? (
              <img src={url} alt="particle" className="w-full h-full object-contain" />
            ) : lottieData ? (
              <Lottie src={lottieData} loop autoplay style={{ width: '100%', height: '100%' }} />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function CustomEffect({ url, speed, scale, opacity }: { url: string, speed: number, scale: number, opacity: number }) {
  const isSvg = url.toLowerCase().endsWith('.svg');
  const [lottieData, setLottieData] = useState<any>(null);
  const lottieRef = useRef<LottieHandle>(null);

  useEffect(() => {
    if (!isSvg) {
      fetch(url)
        .then(res => res.json())
        .then(data => setLottieData(data))
        .catch(err => console.error("Failed to load Lottie JSON", err));
    }
  }, [url, isSvg]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed, lottieData]);

  if (isSvg) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${scale})`, opacity: opacity }}>
        <img src={url} alt="Custom Background Effect" className="w-full h-full object-cover" />
      </div>
    )
  }

  if (lottieData) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center" style={{ transform: `scale(${scale})`, opacity: opacity }}>
        <Lottie 
          lottieRef={lottieRef}
          src={lottieData} 
          loop={true} 
          autoplay={true}
          style={{ width: '100%', height: '100%', position: 'absolute' }} 
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
        />
      </div>
    )
  }

  return null;
}

function RainEffect({ speed, density, scale, opacity }: { speed: number, density: number, scale: number, opacity: number }) {
  const durationFactor = 1 / speed;
  const count = Math.max(1, Math.round(50 * density));
  return (
    <div className="w-full h-full" style={{ opacity }}>
      <style>{`
        .raindrop {
          position: absolute;
          top: -50px;
          width: 2px;
          height: 50px;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(150, 200, 255, 0.8));
          animation: fall linear infinite;
          will-change: transform;
        }
        @keyframes fall {
          0% { transform: translateY(0px) scale(${scale}); }
          100% { transform: translateY(120vh) scale(${scale}); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = (0.5 + Math.random() * 0.5) * durationFactor;
        return (
          <div 
            key={i} 
            className="raindrop" 
            style={{ 
              left: left + "%", 
              animationDelay: delay + "s", 
              animationDuration: duration + "s" 
            }} 
          />
        )
      })}
    </div>
  )
}

function SnowEffect({ speed, density, scale, opacity }: { speed: number, density: number, scale: number, opacity: number }) {
  const durationFactor = 1 / speed;
  const count = Math.max(1, Math.round(40 * density));
  return (
    <div className="w-full h-full" style={{ opacity }}>
      <style>{`
        .snowflake {
          position: absolute;
          top: -20px;
          width: 8px;
          height: 8px;
          background: #eaf2f8; /* Very light frost blue instead of pure white */
          border-radius: 50%;
          opacity: 0.9;
          box-shadow: 0 0 6px 1px rgba(0,0,0,0.15); /* Drop shadow so it's visible on white background */
          animation: snow linear infinite;
          will-change: transform;
        }
        @keyframes snow {
          0% { transform: translateY(0px) translateX(0px) scale(${scale}); }
          100% { transform: translateY(120vh) translateX(20px) scale(${scale}); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = (3 + Math.random() * 4) * durationFactor;
        const size = Math.random() * 6 + 4;
        return (
          <div 
            key={i} 
            className="snowflake" 
            style={{ 
              left: left + "%", 
              width: size + "px",
              height: size + "px",
              animationDelay: delay + "s", 
              animationDuration: duration + "s" 
            }} 
          />
        )
      })}
    </div>
  )
}

function ConfettiEffect({ speed, density, scale, opacity }: { speed: number, density: number, scale: number, opacity: number }) {
  const durationFactor = 1 / speed;
  const count = Math.max(1, Math.round(60 * density));
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#00bcd4', '#4caf50', '#ffeb3b', '#ff9800'];
  return (
    <div className="w-full h-full" style={{ opacity }}>
      <style>{`
        .confetti-piece {
          position: absolute;
          top: -30px;
          width: 10px;
          height: 20px;
          animation: confettiFall linear infinite;
          will-change: transform;
        }
        @keyframes confettiFall {
          0% { transform: translateY(0px) rotate(0deg) scale(${scale}); }
          100% { transform: translateY(120vh) rotate(720deg) scale(${scale}); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = (2 + Math.random() * 3) * durationFactor;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div 
            key={i} 
            className="confetti-piece" 
            style={{ 
              left: left + "%", 
              backgroundColor: color,
              animationDelay: delay + "s", 
              animationDuration: duration + "s" 
            }} 
          />
        )
      })}
    </div>
  )
}

function KitesEffect({ speed, density, scale, opacity }: { speed: number, density: number, scale: number, opacity: number }) {
  const durationFactor = 1 / speed;
  const count = Math.max(1, Math.round(15 * density));
  return (
    <>
      <style>{`
        @keyframes kiteFlyUpFull {
          0%   { transform: translateY(110vh) translateX(0)    rotate(-10deg); opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translateY(50vh)  translateX(3vw)  rotate(10deg);  }
          90%  { opacity: 1; }
          100% { transform: translateY(-20vh) translateX(-3vw) rotate(-10deg); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 95; 
        const delay = Math.random() * -25;
        const duration = (18 + Math.random() * 10) * durationFactor;
        const sz = 44 * scale;
        const hues = [0, 20, 200, 280, 100, 325, 45];
        const hue = hues[i % hues.length];
        
        return (
          <div 
            key={i} 
            style={{ 
              position: 'fixed',   /* fixed so it's independent of all parent stacking contexts */
              width: `${sz}px`,
              height: `${sz}px`,
              left: `${left}vw`,
              top: '0px',          /* animation translateY moves it from 110vh to -20vh */
              zIndex: 2147483647,
              opacity: Math.min(1, opacity + 0.3),
              pointerEvents: 'none',
              willChange: 'transform',
              transform: 'translateZ(0)',  /* own compositor layer - paints above sticky navbar */
              animationName: 'kiteFlyUpFull',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDelay: `${delay}s`, 
              animationDuration: `${duration}s` 
            }} 
          >
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} overflow="visible">
              <path d="M50 10 L90 50 L50 90 L10 50 Z" fill={`hsl(${hue}, 100%, 60%)`}/>
              <path d="M50 10 L90 50 L50 50 Z" fill={`hsl(${hue}, 100%, 40%)`}/>
              <path d="M50 90 L50 10" stroke="white" strokeWidth="2"/>
              <path d="M10 50 L90 50" stroke="white" strokeWidth="2"/>
              <path d="M50 90 Q35 110 50 130 T50 170" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" />
            </svg>
          </div>
        );
      })}
    </>
  )
}

function SparklesEffect({ speed, density, scale, opacity }: { speed: number, density: number, scale: number, opacity: number }) {
  const durationFactor = 1 / speed;
  const count = Math.max(1, Math.round(30 * density));
  return (
    <div className="w-full h-full" style={{ opacity }}>
      <style>{`
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #f1c40f;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(241, 196, 15, 0.8);
          animation: twinkle ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(${0.8 * scale}) translateY(0); }
          100% { opacity: 1; transform: scale(${1.5 * scale}) translateY(-20px); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = (1 + Math.random() * 2) * durationFactor;
        return (
          <div 
            key={i} 
            className="sparkle" 
            style={{ 
              left: left + "%", 
              top: top + "%",
              animationDelay: delay + "s", 
              animationDuration: duration + "s" 
            }} 
          />
        )
      })}
    </div>
  )
}
