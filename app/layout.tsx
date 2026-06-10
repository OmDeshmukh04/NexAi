import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexAI — Automate Everything. Scale Infinitely.",
  description:
    "AI-powered automation platform that eliminates manual work. Streamline operations, optimize workflows, and scale your business with intelligent automation. 10M+ tasks automated daily.",
  keywords: [
    "AI automation",
    "workflow automation",
    "intelligent automation",
    "AI agents",
    "process automation",
    "SaaS platform",
    "enterprise automation",
  ],
  openGraph: {
    title: "NexAI — Automate Everything. Scale Infinitely.",
    description:
      "AI-powered automation platform that eliminates manual work. Deploy AI agents, automate workflows, and scale operations.",
    type: "website",
    url: "https://nexai.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexAI — Automate Everything. Scale Infinitely.",
    description:
      "AI-powered automation platform that eliminates manual work. Deploy AI agents, automate workflows, and scale operations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="noise">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
