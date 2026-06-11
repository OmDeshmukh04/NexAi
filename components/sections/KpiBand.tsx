"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { stats } from "@/lib/constants";
import TiltCard from "@/components/ui/TiltCard";

// One sparkline shape per stat — drawn small, purely decorative
const SPARKLINES = [
  "0,26 14,22 28,24 42,16 56,18 70,10 84,12 98,4",
  "0,22 14,24 28,18 42,20 56,12 70,14 84,8 98,6",
  "0,14 14,14 28,13 42,14 56,13 70,14 84,13 98,13",
  "0,6 14,10 28,8 42,16 56,14 70,20 84,22 98,26",
];

export default function KpiBand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.from(".kpi-card", {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      stats.forEach((stat, i) => {
        const el = valueRefs.current[i];
        if (!el) return;
        const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ""));
        const prefix = stat.value.startsWith("$") ? "$" : "";
        const suffix = stat.value.replace(/[0-9.$,]/g, "");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
          onUpdate: () => {
            const formatted =
              numericValue >= 100
                ? Math.round(obj.val).toLocaleString()
                : obj.val.toFixed(numericValue % 1 !== 0 ? 2 : 0);
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, i) => (
            <TiltCard key={stat.label} className="kpi-card">
              <div className="gradient-border h-full p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <span
                    ref={(el) => {
                      valueRefs.current[i] = el;
                    }}
                    className="text-3xl md:text-4xl font-bold gradient-text-primary tabular-nums"
                  >
                    {stat.value}
                  </span>
                  <svg
                    width="100"
                    height="30"
                    viewBox="0 0 100 30"
                    fill="none"
                    className="shrink-0 mt-1 hidden sm:block"
                  >
                    <polyline
                      points={SPARKLINES[i % SPARKLINES.length]}
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.55"
                    />
                  </svg>
                </div>
                <span className="text-xs md:text-[13px] text-muted uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
