"use client";

import { useEffect, useState } from 'react';
import styles from './rain.module.css';

export default function RainAnimation() {
  const [drops, setDrops] = useState<{ id: number; left: string; animationDuration: string; delay: string }[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Generate random raindrops on mount
    const newDrops = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${0.5 + Math.random() * 1.5}s`,
      delay: `${Math.random() * 2}s`,
    }));
    setDrops(newDrops);

    // Stop after 10 seconds
    const timer = setTimeout(() => setShow(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={styles.rainContainer}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className={styles.drop}
          style={{
            left: drop.left,
            animationDuration: drop.animationDuration,
            animationDelay: drop.delay,
          }}
        />
      ))}
    </div>
  );
}
