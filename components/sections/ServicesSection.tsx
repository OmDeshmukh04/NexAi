"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { services } from "@/lib/constants";

const serviceIcons: Record<string, React.ReactNode> = {
  onboarding: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 26V8a2 2 0 012-2h16a2 2 0 012 2v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 26h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 14l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  training: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16v4M12 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 8l-2-2M24 8l2-2M8 16H4M28 16h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  support: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 22c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.34 6.34l4.24 4.24M21.42 21.42l4.24 4.24M25.66 6.34l-4.24 4.24M10.58 21.42l-4.24 4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  custom: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M10 6l-4 8h8l-4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 10l4 6-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

const serviceColors = ["#054040", "#6f8f1f", "#0f766e", "#86a32e"];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".services-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-heading",
          start: "top 85%",
        },
      });

      gsap.from(".service-item", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-list",
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="services" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="services-heading text-center mb-20">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-[0.2em] mb-4">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">
            <span className="text-ink">Enterprise-grade</span>
            <br />
            <span className="gradient-text-secondary">support & expertise</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Beyond technology — dedicated automation experts to ensure your
            AI-powered operations run flawlessly at any scale.
          </p>
        </div>

        {/* Services Grid — 2 columns */}
        <div className="services-list grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const color = serviceColors[i];
            return (
              <div
                key={service.title}
                className="service-item glass-card p-8 md:p-10 group cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                      border: `1px solid ${color}20`,
                    }}
                  >
                    <span style={{ color }}>{serviceIcons[service.icon]}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-ink mb-3 tracking-[-0.01em]">
                      {service.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-[15px]">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Number watermark */}
                <div className="flex justify-end mt-4">
                  <span
                    className="text-5xl font-bold opacity-[0.08]"
                    style={{ color }}
                  >
                    0{i + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
