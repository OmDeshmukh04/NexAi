"use client";

import { useEffect, useRef } from "react";

/**
 * Continuously climbing "processed today" counter under the hero card —
 * makes the card read as the engine of a live network, not a static prop.
 */
export default function LiveTicker() {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let value = 4_213_407_551;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // ~$50k/s with organic jitter
      value += dt * (52_000 + Math.sin(now * 0.0011) * 23_000 + Math.random() * 9_000);
      if (numRef.current) {
        numRef.current.textContent = `$${Math.floor(value).toLocaleString("en-US")}`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        ref={numRef}
        className="text-2xl md:text-3xl font-bold gradient-text-primary tabular-nums tracking-tight"
      >
        $4,213,407,551
      </span>
      <div className="w-56 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
        <span>Live · Processed Today</span>
      </div>
    </div>
  );
}
