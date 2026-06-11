"use client";

const txns = [
  { id: "TXN-90412", merchant: "Acme Subscriptions", amount: "$1,240.00", status: "Settled", color: "#6f8f1f" },
  { id: "TXN-90413", merchant: "Orbit Logistics", amount: "$18,090.50", status: "Settled", color: "#6f8f1f" },
  { id: "TXN-90414", merchant: "Lumen Retail", amount: "$320.99", status: "Retrying", color: "#b8860b" },
  { id: "TXN-90415", merchant: "Vega Marketplaces", amount: "$7,455.00", status: "Settled", color: "#6f8f1f" },
  { id: "TXN-90416", merchant: "Nordlicht GmbH", amount: "€2,118.00", status: "Review", color: "#b91c1c" },
];

const agents = [
  { name: "Dispute Resolver", task: "Compiling evidence for chargeback #4821", progress: 72, status: "Working" },
  { name: "Invoice Chaser", task: "Following up on 14 overdue invoices", progress: 45, status: "Working" },
  { name: "KYC Reviewer", task: "Flagged document needs human approval", progress: 96, status: "Needs you" },
];

const reconRows = [
  { bank: "$12,400.00 · CHASE", ledger: "$12,400.00 · INV-2201", matched: true },
  { bank: "$8,932.10 · STRIPE", ledger: "$8,932.10 · INV-2202", matched: true },
  { bank: "$1,210.00 · WISE", ledger: "$1,180.00 · INV-2203", matched: false },
  { bank: "$44,000.00 · SEPA", ledger: "$44,000.00 · INV-2204", matched: true },
];

function PanelHeader({ title, badge }: { title: string; badge: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-[13px] font-semibold text-ink">{title}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full bg-primary/20 text-accent">
        {badge}
      </span>
    </div>
  );
}

function CommandCenterPanel() {
  return (
    <div className="p-5">
      <PanelHeader title="Command Center" badge="Live" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          ["Volume today", "$4.2M"],
          ["Success rate", "99.4%"],
          ["Exceptions", "3"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-ink/[0.04] p-3">
            <div className="text-[10px] text-muted mb-1">{label}</div>
            <div className="text-base font-bold text-ink">{value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {txns.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-lg bg-white/70 border border-ink/5 px-3 py-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ backgroundColor: t.color }} />
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-ink truncate">{t.merchant}</div>
                <div className="text-[10px] text-muted font-mono">{t.id}</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[12px] font-semibold text-ink">{t.amount}</div>
              <div className="text-[10px] font-medium" style={{ color: t.color }}>{t.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentsPanel() {
  return (
    <div className="p-5">
      <PanelHeader title="AI Agents" badge="3 active" />
      <div className="space-y-2.5">
        {agents.map((a) => (
          <div key={a.name} className="rounded-xl bg-white/70 border border-ink/5 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-semibold text-ink">{a.name}</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  a.status === "Needs you"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary/20 text-accent"
                }`}
              >
                {a.status}
              </span>
            </div>
            <div className="text-[11px] text-muted mb-2.5">{a.task}</div>
            <div className="h-1 rounded-full bg-ink/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-1000"
                style={{ width: `${a.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-muted text-center">
        Agents resolved <span className="text-accent font-semibold">214 tasks</span> in the last 24h
      </div>
    </div>
  );
}

function ReconPanel() {
  return (
    <div className="p-5">
      <PanelHeader title="Reconciliation" badge="98.7% matched" />
      <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 gap-y-1.5 items-center">
        <div className="text-[10px] uppercase tracking-wider text-muted">Bank feed</div>
        <div />
        <div className="text-[10px] uppercase tracking-wider text-muted text-right">Ledger</div>
        {reconRows.map((r, i) => (
          <div key={i} className="contents">
            <div className="rounded-lg bg-white/70 border border-ink/5 px-2.5 py-2 text-[11px] font-mono text-ink truncate">
              {r.bank}
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                r.matched ? "bg-primary/25 text-accent" : "bg-red-100 text-red-600"
              }`}
            >
              {r.matched ? "✓" : "!"}
            </div>
            <div
              className={`rounded-lg px-2.5 py-2 text-[11px] font-mono truncate text-right ${
                r.matched
                  ? "bg-white/70 border border-ink/5 text-ink"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {r.ledger}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-800">
        1 discrepancy: $30.00 FX fee on INV-2203 — suggested rule available
      </div>
    </div>
  );
}

function StudioPanel() {
  const nodes = [
    { label: "Payment failed", sub: "Trigger", x: "4%", y: 12 },
    { label: "Retry ×3", sub: "Smart retry", x: "38%", y: 12 },
    { label: "Notify customer", sub: "Email + SMS", x: "72%", y: 12 },
    { label: "Update ledger", sub: "Auto-post", x: "21%", y: 150 },
    { label: "Escalate to human", sub: "If > $10k", x: "55%", y: 150 },
  ];
  return (
    <div className="p-5">
      <PanelHeader title="Automation Studio" badge="Draft v12" />
      <div className="relative h-[230px] rounded-xl bg-ink/[0.03] border border-ink/5 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" fill="none">
          <path d="M 90 45 H 150" stroke="#6f8f1f" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M 230 45 H 290" stroke="#6f8f1f" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M 190 70 C 190 110, 130 110, 125 145" stroke="#0f766e" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M 330 70 C 330 110, 260 110, 255 145" stroke="#0f766e" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
        {nodes.map((n) => (
          <div
            key={n.label}
            className="absolute rounded-lg bg-white border border-ink/10 shadow-sm px-3 py-2"
            style={{ left: n.x, top: n.y }}
          >
            <div className="text-[11px] font-semibold text-ink whitespace-nowrap">{n.label}</div>
            <div className="text-[9px] text-accent uppercase tracking-wider">{n.sub}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted">
        <span>Runs this week: <span className="text-ink font-semibold">12,841</span></span>
        <span className="text-accent font-medium">● All checks passing</span>
      </div>
    </div>
  );
}

const panels = [CommandCenterPanel, AgentsPanel, ReconPanel, StudioPanel];

export default function DashboardMockup({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* Glow */}
      <div className="absolute -inset-8 rounded-[40px] bg-primary/15 blur-3xl" />

      <div className="relative glass-card !rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,52,52,0.18)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-ink/5 bg-white/60">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1 rounded-md bg-ink/[0.05] px-3 py-1 text-[10px] text-muted font-mono">
            app.nexpay.io
          </div>
        </div>

        {/* Panels crossfade */}
        <div className="relative min-h-[380px]">
          {panels.map((Panel, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-700"
              style={{
                opacity: activeIndex === i ? 1 : 0,
                transform: `scale(${activeIndex === i ? 1 : 0.97}) translateY(${activeIndex === i ? 0 : 12}px)`,
                pointerEvents: activeIndex === i ? "auto" : "none",
              }}
            >
              <Panel />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
