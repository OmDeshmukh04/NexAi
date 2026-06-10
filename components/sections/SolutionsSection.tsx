"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { solutions } from "@/lib/constants";

const icons: Record<string, React.ReactNode> = {
  automation: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4v3M14 21v3M4 14h3M21 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  ),
  documents: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 4h10l6 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 4v6h6M9 16h10M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ai: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="22" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 11v2M9 18l3-3M19 18l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  mining: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4 24l6-8 5 4 4-6 5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  integrations: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="4" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="4" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="16" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="16" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8h4M12 20h4M8 12v4M20 12v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  compliance: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L4 8v6c0 5.55 4.16 10.74 10 12 5.84-1.26 10-6.45 10-12V8L14 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 14l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const gradients: Record<string, string> = {
  "from-cyan-500 to-blue-600": "linear-gradient(135deg, #054040, #0f766e)",
  "from-purple-500 to-pink-600": "linear-gradient(135deg, #6f8f1f, #b5d447)",
  "from-blue-500 to-indigo-600": "linear-gradient(135deg, #0f766e, #6f8f1f)",
  "from-emerald-500 to-teal-600": "linear-gradient(135deg, #2f8f5f, #0f766e)",
  "from-orange-500 to-amber-600": "linear-gradient(135deg, #8aa62e, #b5d447)",
  "from-rose-500 to-red-600": "linear-gradient(135deg, #054040, #6f8f1f)",
};

export default function SolutionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".solution-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".solution-heading",
          start: "top 85%",
        },
      });

      gsap.from(".solution-card", {
        opacity: 0,
        y: 60,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".solutions-grid",
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="solutions" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.12] blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-deep/[0.05] blur-[120px]" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="solution-heading text-center mb-20">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-[0.2em] mb-4">
            Solutions
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">
            <span className="gradient-text">Automate any workflow.</span>
            <br />
            <span className="text-ink">Eliminate manual work.</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            A comprehensive AI automation suite designed for modern enterprises.
            Built for complexity, optimized for speed.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="solutions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="solution-card glass-card p-8 group cursor-pointer"
            >
              <div
                className="h-[2px] w-16 rounded-full mb-6 group-hover:w-24 transition-all duration-500"
                style={{ background: gradients[solution.gradient] }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${gradients[solution.gradient]?.split(",")[1]?.replace(")", "")}15`,
                  border: `1px solid ${gradients[solution.gradient]?.split(",")[1]?.replace(")", "")}20`,
                }}
              >
                <span className="text-ink">{icons[solution.icon]}</span>
              </div>

              <h3 className="text-xl font-semibold text-ink mb-3 tracking-[-0.01em]">
                {solution.title}
              </h3>
              <p className="text-muted leading-relaxed text-[15px]">
                {solution.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="gradient-text-primary">Learn more</span>
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
