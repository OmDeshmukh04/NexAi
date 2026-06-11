export const siteConfig = {
  name: "NexPay",
  tagline: "Financial Operations on Autopilot.",
  description:
    "The AI automation platform for fintech and financial services. Automate payment operations, KYC, reconciliation, and compliance — and scale revenue without scaling headcount.",
  url: "https://nexpay.io",
};

export const navLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "Platform", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const solutions = [
  {
    title: "Payment Ops Automation",
    description:
      "Automate retries, failed-payment recovery, refunds, and exception handling. Your payment operations run 24/7 — without a night shift.",
    icon: "automation",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "KYC & Onboarding",
    description:
      "Verify identities, screen documents, and onboard customers in minutes instead of days with AI-driven document intelligence.",
    icon: "documents",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "AI Agents for Finance",
    description:
      "Deploy autonomous agents that resolve disputes, fight chargebacks, chase invoices, and answer customer queries end-to-end.",
    icon: "ai",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Smart Reconciliation",
    description:
      "Match millions of transactions across banks, PSPs, and internal ledgers automatically — and surface every discrepancy in real time.",
    icon: "mining",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Universal Integrations",
    description:
      "Connect your banks, PSPs, ERPs, and CRMs with 500+ pre-built connectors and AI-powered data transformation pipelines.",
    icon: "integrations",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    title: "Compliance Autopilot",
    description:
      "Continuous AML monitoring, automated audit trails, and one-click regulatory reporting across every market you operate in.",
    icon: "compliance",
    gradient: "from-rose-500 to-red-600",
  },
];

export const products = [
  {
    title: "Command Center",
    description:
      "Mission control for your financial operations. Watch transactions stream in live, track every automated workflow, and resolve exceptions from one screen.",
    features: ["Live transaction feed", "Exception inbox", "Team workspaces", "Role-based access"],
  },
  {
    title: "AI Agents",
    description:
      "Autonomous agents that handle complex multi-step finance work — dispute resolution, chargeback evidence, invoice chasing, customer communication.",
    features: ["Multi-step reasoning", "Human-in-the-loop", "Self-healing workflows", "Continuous learning"],
  },
  {
    title: "Reconciliation Engine",
    description:
      "ML-powered matching across banks, payment providers, and ledgers. Closes your books continuously instead of at month-end panic.",
    features: ["Auto-matching at scale", "Discrepancy alerts", "Multi-currency support", "Audit-ready trails"],
  },
  {
    title: "Automation Studio",
    description:
      "Visual no-code builder for financial workflows. Drag, drop, deploy — compliance rules and approval chains included, zero engineering required.",
    features: ["Visual builder", "500+ connectors", "Approval chains", "Version control"],
  },
];

export const stats = [
  { value: "$48B+", label: "Transactions Automated / Yr" },
  { value: "10M+", label: "Tasks Automated Daily" },
  { value: "99.99%", label: "Platform Uptime" },
  { value: "70%", label: "Lower Ops Cost" },
];

export const services = [
  {
    title: "White-Glove Onboarding",
    description:
      "A dedicated implementation team maps your financial processes, builds your first automations, and gets you live without disrupting operations.",
    icon: "onboarding",
  },
  {
    title: "Risk & Compliance Advisory",
    description:
      "In-house regulatory experts help you encode KYC/AML policy into automated workflows that stay compliant in every geography.",
    icon: "training",
  },
  {
    title: "24/7 Managed Operations",
    description:
      "Money never sleeps, and neither do we. Proactive monitoring, instant incident response, and continuous optimization of your automations.",
    icon: "support",
  },
  {
    title: "Custom Development",
    description:
      "Bespoke automation solutions for your unique flows — built by the same AI engineering team that builds the platform.",
    icon: "custom",
  },
];
