import Link from 'next/link';
import { supabase } from '../utils/supabase';

export default async function PromoBar() {
  const { data: theme } = await supabase
    .from('themes')
    .select('promo_text, promo_link')
    .eq('id', 'active_theme')
    .maybeSingle();

  const promoText = theme?.promo_text || '';
  const promoLink = theme?.promo_link || '';

  if (!promoText) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      padding: '8px 15px',
      textAlign: 'center',
      fontSize: '0.85rem',
      fontWeight: 500,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      position: 'relative',
      zIndex: 6,
      borderBottom: '4px solid var(--secondary-color, transparent)'
    }}>
      <Link href={promoLink || '#'} style={{ color: 'white', textDecoration: 'none' }}>
        {promoText}
      </Link>
    </div>
  );
}
