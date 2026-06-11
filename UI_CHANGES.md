# NexPay — UI Build Log

Detailed record of the UI/3D overhaul that rebranded the site from a generic
"NexAI automation" template to **NexPay — the AI automation platform (SaaS)
for fintech and financial services**.

Stack: Next.js 16 (App Router) · React 19 · Three.js / @react-three/fiber +
drei · GSAP + ScrollTrigger · Lenis smooth scroll · Tailwind CSS v4.

---

## 1. Brand & Copy Rebrand (`lib/constants.ts`)

Positioning: NexPay sells **SaaS + fintech services automation** — it is not a
payments processor. All copy was rewritten around "automation for companies
that move money".

| Item | Before | After |
|---|---|---|
| Name | NexAI | **NexPay** |
| Tagline | Automate Everything. Scale Infinitely. | **Financial Operations on Autopilot.** |
| Solutions | Generic enterprise automation | Payment Ops Automation, KYC & Onboarding, AI Agents for Finance, Smart Reconciliation, Universal Integrations, Compliance Autopilot |
| Products | Command Center, AI Agents, Analytics, Automation Studio | **Command Center, AI Agents, Reconciliation Engine, Automation Studio** (finance-ops framing) |
| Stats | 10M+ tasks, 2,500+ clients… | **$48B+ transactions automated/yr, 10M+ tasks/day, 99.99% uptime, 70% lower ops cost** |
| Services | Generic onboarding/training | White-Glove Onboarding, Risk & Compliance Advisory, 24/7 Managed Operations, Custom Development |

Solution `icon` keys were kept identical (`automation`, `documents`, `ai`,
`mining`, `integrations`, `compliance`) so the existing SVG icon map in
`SolutionsSection.tsx` needed no changes.

---

## 2. Hero — 3D Payment Card Scene

### `components/three/PaymentCard.tsx` (new)
A fully **procedural** premium credit card — zero downloaded assets, no
licensing, nothing fetched at runtime.

- **Geometry** — real card ratio (85.6 × 53.98 mm → 3.4 × 2.14 units).
  Rounded-rect `ExtrudeGeometry` body with bevel; two `ShapeGeometry` face
  planes floated 0.012 units off the body. `ShapeGeometry` UVs live in
  shape-space, so a `normalizeUVs()` helper remaps them to 0–1 to fit the
  textures.
- **Front texture** — generated on a 1024×644 `<canvas>` at mount: deep-teal
  gradient base, diagonal holographic sweep, sine-wave contour lines, "NexPay"
  wordmark (two-tone), gold EMV chip with contact traces, contactless arcs,
  embossed PAN (`5417 2900 4128 9046`) drawn twice with offset for the emboss
  effect, cardholder line, and an interlocked-rings network mark.
- **Back texture** — magnetic stripe, signature panel with CVV, issuer line.
- **Materials** — body uses `MeshPhysicalMaterial` with `metalness 0.9`,
  `clearcoat 1`, and **iridescence 0.7** for the holographic shimmer; faces
  use the canvas maps with clearcoat.
- **Animation** — idle presentation sway + float, and a **full 1.5-turn flip
  driven by scroll progress** (wired from the hero's ScrollTrigger through a
  ref, no React re-renders per frame).

### `components/three/Coins.tsx` (new)
Five branded coins orbiting the card on different radii/heights/speeds.
Cylinder geometry with a per-face canvas texture (radial gold-lime gradient,
edge ridges, inner ring, "N" monogram) and a metallic edge material. Coins
scatter outward and recede as the user scrolls.

### `components/three/FinanceUniverse.tsx` (reworked)
The hero Canvas orchestrator:

- Replaced the four old glassy `FloatingCard` panels with the **PaymentCard**
  (positioned low so the headline stays readable) + **Coins**, keeping the
  existing `DataNodes` network and `ParticleField`.
- **`PointerRig`** — wraps the scene and eases rotation toward the mouse
  (frame-rate-independent damping) for a parallax feel.
- **Procedural studio lighting** — the old `<Environment preset="night" />`
  silently downloaded an HDRI from a CDN at runtime. Replaced with a
  `<Environment resolution={256} frames={1}>` built from four `Lightformer`s
  (white key overhead, lime strip right, teal strip left, cream circle below).
  Renders once, costs nothing after the first frame, and gives the card its
  studio reflections.
- Public API unchanged (`FinanceUniverseHandle` with `scrollProgress` ref), so
  `HeroSection` integration kept working untouched.

### `components/sections/HeroSection.tsx` (redesigned layout)
Second pass: the centered-text-over-card layout was replaced with a
**three-zone hero** so the surrounding UI matches the card's quality
(Pine-Labs-style supporting visualization, not competing rectangles):

- **Left** — badge, headline ("Run Finance / on Autopilot. / Scale Without
  Limits."), three dot-prefixed feature lines (AI agents 24/7, self-closing
  reconciliation, compliance built in) instead of a paragraph, CTAs.
- **Center** — the 3D card, unchanged, showing through an empty grid column.
- **Right** — empty grid column; the card owns that space. (The metric
  semicircle originally lived here, but was moved to the Solutions section —
  see below — to keep the hero airy.)
- **Under the card** — `components/ui/LiveTicker.tsx` (new): a continuously
  climbing "$4.2B+ · Live · Processed Today" counter (rAF, ~$50k/s with
  organic jitter, tabular-nums so digits don't jitter horizontally), over a
  thin gradient rule. Makes the card read as the engine of a live network.
- The old 4-stat row was removed (replaced by the metric nodes); mobile and
  tablet get a compact 3-stat row since the arc is desktop-only (`lg:`).
- The lime gradient orbs in the hero background and the glow halo plane
  behind the 3D card were **removed entirely** (first shrunk, then cut).
  Headless-browser screenshots then revealed the real "yellow bubbles":
  the **DataNodes spheres** — 24 large flat lime balls covering the hero,
  including the headline. `DataNodes` was removed from the scene and the
  component deleted. Coins are now the only objects around the card, with
  tightened orbits (radius 2.4–3.6, shallow z so they never balloon toward
  the camera, +0.6 x bias away from the text).
- **`CardRig`** added in `FinanceUniverse`: on wide viewports
  (`viewport.width > 9`) the card + coins shift right (+1.9) so the
  headline column stays clear; on narrow viewports they stay centered at
  0.8 scale. Verified with headless Edge screenshots at 1600×900.
- Scroll-pinned "node expands into panel" was deliberately skipped: the hero
  isn't pinned, and ProductShowcase immediately after already delivers that
  exact pattern — two adjacent pinned sections make scrolling feel sticky.
  The timed unfold cycle gives the same "platform unfolding itself" feel
  without hijacking scroll.

---

## 3. Product Showcase — Real SaaS Dashboard Mockup

### `components/ui/DashboardMockup.tsx` (new)
Replaced the abstract 3D planes (`ProductScene`, deleted) with a crisp
HTML/CSS fake product inside a **browser chrome frame** (traffic-light dots,
`app.nexpay.io` URL bar). Four panels crossfade/scale in sync with the pinned
scroll section's `activeIndex`:

1. **Command Center** — KPI tiles (volume today, success rate, exceptions) and
   a live transaction feed with pulsing status dots (Settled / Retrying /
   Review).
2. **AI Agents** — three agent cards (Dispute Resolver, Invoice Chaser, KYC
   Reviewer) with task descriptions, gradient progress bars, and a
   "Needs you" human-in-the-loop state.
3. **Reconciliation** — bank-feed vs. ledger rows with match checkmarks, one
   highlighted $30.00 FX-fee discrepancy, and a suggested-rule banner.
4. **Automation Studio** — node-graph workflow (trigger → retry → notify,
   with ledger + escalation branches) drawn with absolutely-positioned nodes
   and dashed SVG connectors.

### `components/sections/ProductShowcase.tsx`
Right column swapped from the Three.js `ProductScene` to `DashboardMockup`.
The pin/scrub ScrollTrigger and left-side text crossfade are unchanged.

---

## 4. About — Payments Globe

### `components/three/PaymentsGlobe.tsx` (new)
Self-contained Canvas used in the About section:

- **Dotted globe** — 1,100 points on a Fibonacci-sphere distribution
  (~15% lime, rest deep teal), over a faint core sphere so the dots read as a
  solid planet on the light background.
- **10 financial hubs** (NY, London, Mumbai, Singapore, Tokyo, São Paulo,
  Dubai, Berlin, Sydney, SF) placed via lat/lon → Vector3 conversion, marked
  with lime spheres.
- **10 transaction arcs** — quadratic Béziers lifted above the surface, each
  with a **traveling pulse** that fades in/out at the endpoints (the
  "money moving" effect). Slow continuous rotation.

### `components/sections/AboutSection.tsx`
- Heading: "Powering the future **of financial operations**".
- Mission block became a **two-column layout**: globe (380–460 px tall) left,
  rewritten mission copy right.
- Partner strip: replaced real consultancies (Accenture, Deloitte…) with
  **fictional fintech names** (Meridian Bank, FlowPay, NorthLedger, Quantis,
  OrbitPay, VaultLine) — placeholder either way, but no fake claims about real
  companies. Label: "Trusted by teams that move money".

---

## 5. Other Section Copy

- **SolutionsSection** — "Automate every money workflow. / Eliminate manual
  ops." + finserv subtitle, plus a row of capability pills (Smart retries,
  AML monitoring, …) under it. The heading row is a two-column grid on
  desktop: heading left, **`components/ui/MetricsArc.tsx`** right — six
  **metric planets**: colored CSS spheres (alternating deep-teal / lime
  radial gradients with highlight + terminator shading) whose dotted
  "landmass" layer pans continuously like a spinning earth. A scrubbed
  ScrollTrigger slides all six **along their semicircle orbit** (±15°,
  upward as you scroll) and spins each surface a further ~240° around
  itself. The connecting orbit line was removed per feedback — planets
  float free. Counters fire on scroll-into-view; planets unfold one at a
  time on a 2.6s cycle with a glass detail chip, hover overrides, and all
  drift toward the cursor at different depths. Hidden below `lg`.
- **KpiBand** (`components/sections/KpiBand.tsx`, new) — a 4-card strip
  between hero and Solutions to kill the empty transition gap: white
  gradient-border cards with counted-up stat values, decorative sparklines,
  and a reusable **`components/ui/TiltCard.tsx`** wrapper that gives every
  card a 3D perspective tilt + moving glare that follows the cursor.
- **OpsPulse** (`components/sections/OpsPulse.tsx`, new, after Solutions) —
  "The pulse of your money ops": left side is a vertical stack of four KPI
  rows (auto-resolved exceptions 94%, straight-through processing 98.2%,
  first-pass match 96.8%, fraud catch 99.1%) whose gradient bars fill and
  values count up on scroll; right side is a tilt-card chart panel where
  the "Automated by NexPay" line **draws itself** (stroke-dashoffset
  animation) rising over 12 months while a dashed "manual workload" line
  declines, with a gradient area fill fading in after.
- **ImpactSection** (`components/sections/ImpactSection.tsx`, new, after
  Services) — "From days to minutes.": a before/after **vertical bar
  chart** (merchant onboarding 14 days → 8 min, month-end close 9 days →
  6 hrs, dispute response 6 days → 4 hrs) with bars growing from the
  baseline on scroll, next to an animated **donut gauge** sweeping to 70%
  ("lower ops cost") with delta rows (manual touches ▼88%, throughput
  ▲3.4×, audit prep ▼92%). Both cards use TiltCard.
- **ServicesSection** — fintech-automation subtitle.
- **ContactSection** — "Join 2,500+ fintechs and finance teams…".
- **Footer** — platform links match the new product names; description updated.

---

## 5b. Navbar Modernization (`components/layout/Navbar.tsx`)

On top of the existing floating glass island (scroll spy, Lenis smooth
anchors, animated mobile menu):

- **Dynamic-island shrink** — on scroll the island narrows (`max-w-5xl` →
  `max-w-4xl`) and tightens vertical padding, morphing into a compact dock.
- **Scroll progress line** — a 2px teal→lime gradient bar along the island's
  bottom edge tracks page scroll (transform-only updates via ref, no
  re-renders); fades in only once scrolled.
- **Hover-chasing pill** — the active-link pill now follows the hovered link
  and glides back to the active section on mouse-leave (Linear/Vercel
  pattern).
- **CTA upgrade** — "Start Free Trial" gained an arrow that nudges on hover
  and a skewed white shine that sweeps across the button.
- **Logo tile** — flat lime square → lime gradient with inset highlight ring
  and soft glow.

---

## 6. Technical Fixes (pre-existing issues cleaned up)

- **`lib/prng.ts` (new)** — seeded mulberry32 PRNG. `Math.random()` inside
  render/`useMemo` violated the `react-hooks/purity` lint rule and made
  particle/node layouts reshuffle on re-render. `DataNodes`, `ParticleField`,
  and `PaymentsGlobe` now use deterministic seeds.
- **`SmoothScrollProvider`** — `useRef<any>` → `useRef<LenisRef | null>`.
- Removed dead code: `FloatingCard.tsx` (referenced a nonexistent
  `/fonts/inter-medium.woff`) and `ProductScene.tsx`.
- Removed unused `gsap` import in `ProductShowcase`.
- No runtime CDN downloads remain in any 3D scene.

---

## 7. Verification

- `npm run lint` — clean (0 errors, 0 warnings).
- `npm run build` — production build succeeds, all routes static.
- Smoke test against the running dev server — HTTP 200, new hero headline,
  solutions heading, and About heading all present in served HTML.

## 8. Still wanted from the team

- Real logo (SVG, light + dark) — currently a styled "N" tile.
- Real client names/logos for the trust bar.
- Real product screenshots, if we ever want to swap the HTML mockup for the
  actual app.
