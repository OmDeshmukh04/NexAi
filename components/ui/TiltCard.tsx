"use client";

import { useRef } from "react";

/**
 * 3D-tilt wrapper: card rotates in perspective toward the cursor with a
 * moving glare highlight. Pure CSS transforms — no canvas cost.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * maxTilt}deg) rotateX(${-py * maxTilt}deg) translateY(-4px)`;
    const glare = glareRef.current;
    if (glare) {
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,0.5), transparent 65%)`;
    }
  };

  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)";
    }
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
