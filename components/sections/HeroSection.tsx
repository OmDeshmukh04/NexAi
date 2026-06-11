"use client";

import { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { siteConfig } from "@/lib/constants";
import LiveTicker from "@/components/ui/LiveTicker";
import type { FinanceUniverseHandle } from "@/components/three/FinanceUniverse";

const FinanceUniverse = dynamic(
  () => import("@/components/three/FinanceUniverse"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-transparent flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-ink/15 border-t-primary rounded-full animate-spin" />
      </div>
    ),
  }
);

const featureLines = [
  "AI agents working 24/7",
  "Reconciliation that closes itself",
  "Compliance built in",
];

const mobileStats = [
  { value: "$4.2B", label: "Volume Today" },
  { value: "99.99%", label: "Auth Success" },
  { value: "70%", label: "Ops Saved" },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const universeRef = useRef<FinanceUniverseHandle>(null);

  const setUniverseRef = useCallback(
    (node: FinanceUniverseHandle | null) => {
      (universeRef as React.MutableRefObject<FinanceUniverseHandle | null>).current = node;
    },
    []
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from(".hero-badge", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(".hero-heading", {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.3")
        .from(".hero-line", {
          opacity: 0,
          x: -24,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        }, "-=0.4")
        .from(".hero-buttons", {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.3")
        .from(".hero-ticker", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.4")
        .from(".hero-canvas-wrapper", {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: "power3.out",
        }, "-=1.0");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (universeRef.current?.scrollProgress) {
            universeRef.current.scrollProgress.current.value = self.progress;
          }
        },
      });

      gsap.to(".hero-content", {
        y: -80,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 animated-gradient-bg" />
      <div className="absolute inset-0 grid-bg" />

      {/* 3D Scene — card stays the centerpiece */}
      <div className="hero-canvas-wrapper absolute inset-0 z-0">
        <FinanceUniverse ref={setUniverseRef} />
      </div>

      {/* Content — left copy · card center-right */}
      <div className="hero-content relative z-10 w-full max-w-[1480px] mx-auto px-6 md:px-10 lg:px-16 pt-28 md:pt-32 pb-40 grid lg:grid-cols-[minmax(0,460px)_1fr] items-center gap-10">
        {/* Left: copy */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-ink/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-sm text-ink font-medium">
              Introducing {siteConfig.name} — AI Automation for Finance
            </span>
          </div>

          <h1 className="hero-heading text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-[-0.04em] mb-8">
            <span className="gradient-text">Run Finance</span>
            <br />
            <span className="gradient-text">on Autopilot.</span>
            <br />
            <span className="text-ink">Scale Without Limits.</span>
          </h1>

          <div className="flex flex-col gap-3 mb-10">
            {featureLines.map((line) => (
              <div
                key={line}
                className="hero-line flex items-center gap-3 justify-center lg:justify-start"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-base md:text-lg text-deep">{line}</span>
              </div>
            ))}
          </div>

          <div className="hero-buttons flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button className="btn-primary !py-4 !px-9 !text-base !rounded-full">
              <span>Start Free Trial</span>
              <svg
                className="w-5 h-5 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="btn-secondary !py-4 !px-9 !text-base !rounded-full">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Compact stats for mobile/tablet where the metric arc is hidden */}
          <div className="flex lg:hidden items-center gap-8 mt-10">
            {mobileStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-xl font-bold text-ink tabular-nums">{stat.value}</span>
                <span className="text-[10px] text-muted uppercase tracking-wider mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: empty — the 3D card shows through here */}
        <div className="hidden lg:block" />
      </div>

      {/* Live ticker under the card */}
      <div className="hero-ticker hero-content absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <LiveTicker />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-10">
        <span className="text-xs text-muted uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-ink/25 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-ink/40 animate-[float_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
