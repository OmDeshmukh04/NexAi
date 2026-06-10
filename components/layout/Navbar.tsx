"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { navLinks, siteConfig } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const listRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy — highlight the section currently in view
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Slide the active pill under the current link
  useEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const btn = list?.querySelector<HTMLButtonElement>(
        `[data-href="#${activeId}"]`
      );
      if (!btn) {
        setIndicator((p) => ({ ...p, visible: false }));
        return;
      }
      setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth, visible: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeId]);

  // Close mobile menu on Escape / desktop resize
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (lenis) {
      lenis.scrollTo(href, { offset: -96, duration: 1.4 });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4 pointer-events-none">
      <nav
        aria-label="Main"
        className={`pointer-events-auto w-full max-w-5xl rounded-2xl border transition-all duration-500 ${
          scrolled || mobileOpen
            ? "border-ink/[0.08] bg-white/85 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,52,52,0.10),0_0_0_1px_rgba(255,255,255,0.6)_inset]"
            : "border-ink/[0.05] bg-white/40 backdrop-blur-xl"
        }`}
      >
        <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              if (lenis) lenis.scrollTo(0, { duration: 1.4 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-heading text-base font-semibold text-ink transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(181,212,71,0.6)]">
              N
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight text-ink">
              {siteConfig.name}
            </span>
          </a>

          {/* Desktop links — centered, with sliding active pill */}
          <div
            ref={listRef}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex"
          >
            <span
              aria-hidden
              className="absolute inset-y-0.5 rounded-full bg-ink/[0.06] ring-1 ring-ink/[0.08] transition-all duration-300 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
            {navLinks.map((link) => (
              <button
                key={link.label}
                data-href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  activeId === link.href.slice(1)
                    ? "text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <button className="rounded-full px-4 py-2 text-sm text-muted transition-colors duration-300 hover:text-ink">
              Log In
            </button>
            <button className="group relative overflow-hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:shadow-[0_4px_24px_rgba(181,212,71,0.5)]">
              <span className="absolute inset-0 bg-primary-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative">Start Free Trial</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-ink/[0.08] bg-ink/[0.04] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span
              className={`absolute h-[1.5px] w-4.5 bg-ink transition-all duration-300 ${
                mobileOpen ? "rotate-45" : "-translate-y-[3.5px]"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-4.5 bg-ink transition-all duration-300 ${
                mobileOpen ? "-rotate-45" : "translate-y-[3.5px]"
              }`}
            />
          </button>
        </div>

        {/* Mobile menu — expands the island downward */}
        <div
          className={`grid transition-[grid-template-rows] duration-400 ease-out lg:hidden ${
            mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-ink/[0.08] px-3 pb-4 pt-3">
              {navLinks.map((link, i) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
                  className={`rounded-xl px-3 py-2.5 text-left text-base transition-all duration-300 hover:bg-ink/[0.05] ${
                    mobileOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  } ${
                    activeId === link.href.slice(1)
                      ? "bg-ink/[0.05] text-ink"
                      : "text-muted"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-ink/[0.08] pt-3">
                <button className="rounded-xl px-3 py-2.5 text-left text-base text-muted transition-colors hover:text-ink">
                  Log In
                </button>
                <button className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-ink">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
