"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

interface Metric {
  value: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
}

const METRICS: Metric[] = [
  { value: 4.2, decimals: 1, prefix: "$", suffix: "B", label: "Volume Today", detail: "Across 42 payment rails" },
  { value: 99.99, decimals: 2, suffix: "%", label: "Auth Success", detail: "Smart retries recover 11% more" },
  { value: 1.2, decimals: 1, suffix: "M", label: "KYC Checks", detail: "Median clear time: 38s" },
  { value: 2.3, decimals: 1, suffix: "M", label: "Exceptions Solved", detail: "94% without human touch" },
  { value: 70, decimals: 0, suffix: "%", label: "Ops Cost Saved", detail: "vs. fully manual operations" },
  { value: 100, decimals: 0, suffix: "%", label: "Audit Coverage", detail: "Every action logged" },
];

// Planets sit on a circle that bulges left; scrolling slides them along it
const R = 230;
const CX = 250;
const CY = 270;
const DISC = 76;
const SWEEP = 15; // degrees of orbital travel across the scroll range

const BASE_ANGLES = METRICS.map((_, i) => -75 + i * 30);

function pointAt(deg: number) {
  const t = (deg * Math.PI) / 180;
  return { x: CX - Math.cos(t) * R, y: CY + Math.sin(t) * R };
}

export default function MetricsArc() {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const surfaceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // Count-up values when the arc scrolls into view
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
        },
      });
      METRICS.forEach((m, i) => {
        const el = valueRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        tl.to(
          obj,
          {
            val: m.value,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${m.prefix ?? ""}${obj.val.toFixed(m.decimals)}${m.suffix ?? ""}`;
            },
          },
          i * 0.12
        );
      });

      // Scrubbed: planets ride up the orbit and spin around themselves
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const shift = SWEEP - self.progress * SWEEP * 2; // +15° → −15° (upward)
          METRICS.forEach((_, i) => {
            const orbit = orbitRefs.current[i];
            if (orbit) {
              const p = pointAt(BASE_ANGLES[i] + shift);
              orbit.style.left = `${p.x - DISC / 2}px`;
              orbit.style.top = `${p.y - DISC / 2}px`;
            }
            const surface = surfaceRefs.current[i];
            if (surface) {
              surface.style.transform = `rotate(${self.progress * 240 + i * 36}deg)`;
            }
          });
        },
      });
    },
    { scope: rootRef }
  );

  // Planets unfold one by one
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % METRICS.length), 2600);
    return () => clearInterval(id);
  }, []);

  // Pointer parallax — each planet drifts toward the cursor at its own depth
  useEffect(() => {
    const tweens = parallaxRefs.current.map((el, i) =>
      el
        ? {
            x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" }),
            depth: 6 + (i % 3) * 5,
          }
        : null
    );
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      tweens.forEach((t) => {
        if (!t) return;
        t.x(nx * t.depth);
        t.y(ny * t.depth);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={rootRef} className="relative w-[300px] h-[540px]" aria-hidden>
      {METRICS.map((m, i) => {
        const isActive = active === i;
        const variant = i % 2 === 0 ? "teal" : "lime";
        const start = pointAt(BASE_ANGLES[i] + SWEEP);
        return (
          <div
            key={m.label}
            ref={(el) => {
              orbitRefs.current[i] = el;
            }}
            className="absolute"
            style={{ left: start.x - DISC / 2, top: start.y - DISC / 2 }}
            onMouseEnter={() => setActive(i)}
          >
            <div
              ref={(el) => {
                parallaxRefs.current[i] = el;
              }}
              className="relative"
            >
              {/* Detail chip unfolds left of the active planet */}
              <div
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap glass rounded-full px-3.5 py-1.5 text-[11px] text-deep transition-all duration-500"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `translateY(-50%) translateX(${isActive ? 0 : 8}px)`,
                }}
              >
                {m.detail}
              </div>

              {/* Mini earth: dotted surface spins idle + with scroll */}
              <div
                className={`planet planet--${variant} relative w-[76px] h-[76px] rounded-full overflow-hidden transition-all duration-500 cursor-default ${
                  isActive ? "scale-110 planet-active" : "scale-100"
                }`}
              >
                <div
                  ref={(el) => {
                    surfaceRefs.current[i] = el;
                  }}
                  className={`planet-surface planet-surface--${variant} absolute -inset-1 rounded-full`}
                  style={{ animationDelay: `${-i * 2.3}s` }}
                />
                <div className="planet-shade absolute inset-0 rounded-full" />
                <span
                  ref={(el) => {
                    valueRefs.current[i] = el;
                  }}
                  className={`absolute inset-0 z-10 flex items-center justify-center text-[13px] font-bold tabular-nums ${
                    variant === "teal"
                      ? "text-white [text-shadow:0_1px_6px_rgba(0,30,30,0.6)]"
                      : "text-ink [text-shadow:0_0_8px_rgba(255,255,255,0.8)]"
                  }`}
                >
                  0
                </span>
              </div>

              <span
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 text-[9px] uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-500 ${
                  isActive ? "text-accent font-semibold" : "text-muted"
                }`}
              >
                {m.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
