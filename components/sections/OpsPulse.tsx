"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import TiltCard from "@/components/ui/TiltCard";

const PULSE_KPIS = [
  { label: "Auto-resolved exceptions", value: 94.0, decimals: 1 },
  { label: "Straight-through processing", value: 98.2, decimals: 1 },
  { label: "First-pass match rate", value: 96.8, decimals: 1 },
  { label: "Fraud catch rate", value: 99.1, decimals: 1 },
];

// Automated tasks trending up
const AUTO_PATH =
  "M0,210 C40,205 60,185 90,188 S150,150 180,155 S240,118 270,108 S330,92 360,75 S440,52 480,40";
// Manual workload trending down
const MANUAL_PATH =
  "M0,80 C60,95 110,120 160,128 S260,160 320,170 S430,196 480,200";
// Same as AUTO_PATH but closed to the baseline for the gradient fill
const AUTO_AREA = `${AUTO_PATH} L480,260 L0,260 Z`;

export default function OpsPulse() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoLineRef = useRef<SVGPathElement>(null);
  const manualLineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      gsap.from(".pulse-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      // KPI rows: bar fills + count-ups
      PULSE_KPIS.forEach((kpi, i) => {
        const fill = fillRefs.current[i];
        const val = valueRefs.current[i];
        if (fill) {
          gsap.fromTo(
            fill,
            { width: "0%" },
            {
              width: `${kpi.value}%`,
              duration: 1.4,
              delay: i * 0.15,
              ease: "power3.out",
              scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            }
          );
        }
        if (val) {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: kpi.value,
            duration: 1.4,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            onUpdate: () => {
              val.textContent = `${obj.v.toFixed(kpi.decimals)}%`;
            },
          });
        }
      });

      // Chart lines draw themselves in
      [autoLineRef.current, manualLineRef.current].forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            delay: 0.2 + i * 0.3,
            ease: "power2.inOut",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          }
        );
      });
      if (areaRef.current) {
        gsap.from(areaRef.current, {
          opacity: 0,
          duration: 1.2,
          delay: 1.4,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left: vertical KPI stack */}
        <div>
          <div className="pulse-heading mb-10">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-[0.2em] mb-4">
              Live Operations
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em]">
              <span className="text-ink">The pulse of</span>{" "}
              <span className="gradient-text">your money ops</span>
            </h2>
          </div>

          <div className="flex flex-col gap-7">
            {PULSE_KPIS.map((kpi, i) => (
              <div key={kpi.label}>
                <div className="flex items-baseline justify-between mb-2.5">
                  <span className="text-[15px] text-deep">{kpi.label}</span>
                  <span
                    ref={(el) => {
                      valueRefs.current[i] = el;
                    }}
                    className="text-xl md:text-2xl font-bold text-ink tabular-nums"
                  >
                    0%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-ink/[0.07] overflow-hidden">
                  <div
                    ref={(el) => {
                      fillRefs.current[i] = el;
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0f766e] to-primary"
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: automation trend chart */}
        <TiltCard maxTilt={7}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[15px] font-semibold text-ink">
                  Tasks automated
                </div>
                <div className="text-xs text-muted mt-0.5">Last 12 months</div>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/20 text-accent">
                ▲ 38% this quarter
              </span>
            </div>

            <svg viewBox="0 0 480 260" fill="none" className="w-full h-auto">
              <defs>
                <linearGradient id="opsAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b5d447" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#b5d447" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[52, 104, 156, 208].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="480"
                  y2={y}
                  stroke="rgba(0,52,52,0.06)"
                  strokeWidth="1"
                />
              ))}
              <path ref={areaRef} d={AUTO_AREA} fill="url(#opsAreaFill)" />
              <path
                ref={manualLineRef}
                d={MANUAL_PATH}
                stroke="rgba(123,123,123,0.55)"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
              <path
                ref={autoLineRef}
                d={AUTO_PATH}
                stroke="#6f8f1f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="480" cy="40" r="5" fill="#b5d447" stroke="#6f8f1f" strokeWidth="2" />
            </svg>

            <div className="flex items-center gap-6 mt-5 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                Automated by NexPay
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-[2px] w-4 bg-muted/60" />
                Manual workload
              </span>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
