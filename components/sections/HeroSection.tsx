"use client";

import { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { siteConfig, stats } from "@/lib/constants";
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
        .from(".hero-subtitle", {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.4")
        .from(".hero-buttons", {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.3")
        .from(".hero-stats", {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power3.out",
        }, "-=0.2")
        .from(".hero-canvas-wrapper", {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: "power3.out",
        }, "-=0.8");

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

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.18] blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-deep/[0.07] blur-[150px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.10] blur-[200px]" />

      {/* 3D Scene — Full background */}
      <div className="hero-canvas-wrapper absolute inset-0 z-0">
        <FinanceUniverse ref={setUniverseRef} />
      </div>

      {/* Content — Centered */}
      <div className="hero-content relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center flex flex-col items-center pt-24 md:pt-32">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-ink/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <span className="text-sm text-ink font-medium">
            Introducing {siteConfig.name} — AI-Powered Automation
          </span>
          <svg
            className="w-4 h-4 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Heading — centered and massive */}
        <h1 className="hero-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-bold leading-[1.05] tracking-[-0.04em] mb-8">
          <span className="gradient-text">Automate Everything.</span>
          <br />
          <span className="text-ink">Scale Infinitely.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-muted max-w-3xl leading-relaxed mb-10">
          {siteConfig.description}
        </p>

        {/* Buttons — centered */}
        <div className="hero-buttons flex flex-wrap items-center justify-center gap-4 mb-16">
          <button className="btn-primary !py-4 !px-10 !text-base !rounded-full">
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
          <button className="btn-secondary !py-4 !px-10 !text-base !rounded-full">
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

        {/* Stats Row — centered */}
        <div className="hero-stats flex items-center justify-center gap-10 md:gap-16">
          {stats.slice(0, 3).map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-ink">
                {stat.value}
              </span>
              <span className="text-xs text-muted uppercase tracking-wider mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-10">
        <span className="text-xs text-muted uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-ink/25 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-ink/40 animate-[float_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
