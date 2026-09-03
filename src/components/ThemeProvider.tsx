'use client'

import { useEffect } from 'react'
import { supabase } from '../utils/supabase'

type Theme = {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  active_effect: string | null;
  background_image_url?: string | null;
  mobile_background_image_url?: string | null;
  is_active: boolean;
}

function hexToRgba(hex: string, alpha: number): string {
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return hex;
  const r = parseInt(hex.length === 4 ? hex.slice(1, 2).repeat(2) : hex.slice(1, 3), 16);
  const g = parseInt(hex.length === 4 ? hex.slice(2, 3).repeat(2) : hex.slice(3, 5), 16);
  const b = parseInt(hex.length === 4 ? hex.slice(3, 4).repeat(2) : hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyTheme(themeData: Theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Apply color variables
  if (themeData.primary_color) {
    root.style.setProperty('--primary-color', themeData.primary_color);
    root.style.setProperty('--heading-color', themeData.primary_color);
  }
  if (themeData.secondary_color) {
    root.style.setProperty('--secondary-color', themeData.secondary_color);
    root.style.setProperty('--badge-sale', themeData.secondary_color);
  }

  const updateBackground = () => {
    const isMobile = window.innerWidth < 768;
    const bgUrl = (isMobile && themeData.mobile_background_image_url) 
      ? themeData.mobile_background_image_url 
      : themeData.background_image_url;

    const layers: string[] = [];
    if (bgUrl) {
      layers.push(`url("${bgUrl}")`);
    }

    if (themeData.primary_color && themeData.secondary_color) {
      const pRgba = hexToRgba(themeData.primary_color, 0.15);
      const sRgba = hexToRgba(themeData.secondary_color, 0.15);
      layers.push(`linear-gradient(180deg, ${pRgba} 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, ${sRgba} 100%)`);
    }

    document.body.style.backgroundImage = layers.length > 0 ? layers.join(', ') : 'none';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover, cover';
    document.body.style.backgroundRepeat = 'no-repeat, no-repeat';
    document.body.style.backgroundPosition = 'center, center';
  };

  updateBackground();
  
  if ((window as any)._themeResizeListener) {
    window.removeEventListener('resize', (window as any)._themeResizeListener);
  }
  (window as any)._themeResizeListener = updateBackground;
  window.addEventListener('resize', updateBackground);
}

function removeTheme() {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.style.removeProperty('--primary-color');
  root.style.removeProperty('--heading-color');
  root.style.removeProperty('--badge-sale');
  root.style.removeProperty('--secondary-color');
  document.body.style.backgroundImage = '';
  document.body.style.backgroundAttachment = '';
  document.body.style.backgroundSize = '';
  document.body.style.backgroundRepeat = '';
  document.body.style.backgroundPosition = '';
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const fetchTheme = async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('id', 'active_theme')
        .maybeSingle()
      
      if (data && !error) {
        applyTheme(data as Theme)
      }
    }

    fetchTheme()

    // Subscribe to realtime changes from admin panel
    const channel = supabase
      .channel('theme-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'themes',
          filter: 'id=eq.active_theme'
        },
        (payload) => {
          applyTheme(payload.new as Theme)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      removeTheme()
    }
  }, [])

  return <>{children}</>
}
