import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LANDScope — AI-Powered Land Intelligence & Policy Innovation Platform",
  description:
    "National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance. Explore. Analyze. Simulate. Decide. (Problem Statement: SIH26019)",
  keywords: [
    "LANDScope",
    "SIH 2026",
    "SIH26019",
    "Land Intelligence",
    "Cadastral GIS",
    "Policy Simulation",
    "DILRMP",
    "SVAMITVA",
    "Digital India",
    "Land Governance",
  ],
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#030712] text-[#f8fafc] selection:bg-[#1d4ed8] selection:text-[#93c5fd] antialiased">
        {children}
      </body>
    </html>
  );
}
