"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { stats } from "@/lib/constants";

const partners = [
  "Accenture",
  "Deloitte",
  "McKinsey",
  "SAP",
  "Salesforce",
  "ServiceNow",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.from(".about-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-heading",
          start: "top 85%",
        },
      });

      stats.forEach((stat, i) => {
        const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ""));
        const el = counterRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          onUpdate: () => {
            if (!el) return;
            const prefix = stat.value.startsWith("$") ? "$" : "";
            const suffix = stat.value.replace(/[0-9.$,]/g, "");
            const formatted =
              numericValue >= 100
                ? Math.round(obj.val).toLocaleString()
                : obj.val.toFixed(numericValue % 1 !== 0 ? 2 : 0);
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      });

      gsap.from(".stats-card", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-card",
          start: "top 85%",
        },
      });

      gsap.from(".partner-name", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".partners-row",
          start: "top 90%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="about" className="section-padding relative">
      <div className="absolute inset-0 animated-gradient-bg opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-ink/15 to-transparent" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="about-heading text-center mb-16">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-[0.2em] mb-4">
            About
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">
            <span className="text-ink">Powering the future</span>
            <br />
            <span className="gradient-text">of intelligent automation</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="stats-card gradient-border p-10 md:p-14 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <span
                  ref={(el) => {
                    counterRefs.current[i] = el;
                  }}
                  className="block text-4xl md:text-5xl lg:text-6xl font-bold gradient-text-primary mb-3"
                >
                  {stat.value}
                </span>
                <span className="text-sm text-muted uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <p className="text-center text-xl md:text-2xl text-muted leading-relaxed max-w-4xl mx-auto mb-16">
          We&apos;re building the AI infrastructure that powers the next
          generation of enterprise operations. Our mission is to make every
          manual process{" "}
          <span className="text-ink font-medium">
            automated, intelligent, and self-optimizing
          </span>{" "}
          — so teams can focus on what truly matters.
        </p>

        {/* Partners */}
        <div className="text-center">
          <p className="text-xs text-muted uppercase tracking-[0.2em] mb-8">
            Trusted by forward-thinking enterprises
          </p>
          <div className="partners-row flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {partners.map((name) => (
              <span
                key={name}
                className="partner-name text-xl md:text-2xl font-bold text-ink/15 hover:text-ink/35 transition-colors duration-300 cursor-default tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
