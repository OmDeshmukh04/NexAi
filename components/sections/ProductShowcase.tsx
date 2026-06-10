"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { products } from "@/lib/constants";

const ProductScene = dynamic(
  () => import("@/components/three/ProductScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-ink/15 border-t-primary rounded-full animate-spin" />
      </div>
    ),
  }
);

const productColors = ["#054040", "#6f8f1f", "#0f766e", "#86a32e"];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=3000",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * products.length),
            products.length - 1
          );
          setActiveIndex(idx);
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="products" className="relative">
      <div
        ref={sectionRef}
        className="min-h-screen flex items-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f2f4f0] to-white" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000"
          style={{ backgroundColor: `${productColors[activeIndex]}08` }}
        />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-8">
            <span className="text-sm font-medium text-accent uppercase tracking-[0.2em]">
              Platform
            </span>

            <div className="flex items-center gap-3">
              {products.map((_, i) => (
                <div
                  key={i}
                  className="relative h-1 rounded-full transition-all duration-500"
                  style={{
                    width: activeIndex === i ? "48px" : "16px",
                    background:
                      activeIndex === i
                        ? productColors[i]
                        : "rgba(0,52,52,0.12)",
                  }}
                />
              ))}
            </div>

            <div className="relative min-h-[300px]">
              {products.map((product, i) => (
                <div
                  key={product.title}
                  className="absolute inset-0 transition-all duration-700"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    transform: `translateY(${activeIndex === i ? 0 : 20}px)`,
                    pointerEvents: activeIndex === i ? "auto" : "none",
                  }}
                >
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-5">
                    <span style={{ color: productColors[i] }}>
                      {product.title}
                    </span>
                  </h3>
                  <p className="text-muted text-lg leading-relaxed mb-8 max-w-lg">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {product.features.map((feature, fi) => (
                      <div
                        key={fi}
                        className="flex items-center gap-3 text-[15px] text-muted"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: productColors[i] }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-secondary w-fit !rounded-full">
              Explore Platform
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Right: 3D Scene */}
          <div className="relative h-[400px] lg:h-[550px]">
            <ProductScene activeIndex={activeIndex} />
          </div>
        </div>

        <div className="absolute bottom-8 right-8 lg:right-16 text-sm text-muted font-mono">
          <span style={{ color: productColors[activeIndex] }}>
            0{activeIndex + 1}
          </span>
          <span className="mx-1">/</span>
          <span>0{products.length}</span>
        </div>
      </div>
    </section>
  );
}
