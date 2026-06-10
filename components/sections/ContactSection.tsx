"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".contact-content", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-content",
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f2f4f0] via-white to-[#f2f4f0]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.15] blur-[200px]" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-deep/[0.05] blur-[150px]" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.08] blur-[150px]" />

      <div className="contact-content relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6 leading-tight">
          <span className="text-ink">Ready to eliminate</span>
          <br />
          <span className="gradient-text">manual work forever?</span>
        </h2>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
          Join 2,500+ enterprises already using NexAI to automate their
          operations. Get started in minutes, not months.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="email"
              placeholder="Enter your work email"
              className="w-full px-6 py-4 rounded-full bg-white border border-ink/[0.12] text-ink placeholder:text-muted focus:outline-none focus:border-primary transition-all duration-300 text-[15px]"
            />
          </div>
          <button className="btn-primary !py-4 !px-10 !rounded-full w-full sm:w-auto whitespace-nowrap">
            <span>Start Free Trial</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No credit card required
          </div>
          <span className="text-muted">·</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free 14-day trial
          </div>
          <span className="text-muted">·</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}
