import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Industrial Carbon Hotspot Intelligence | HackOut 2026",
  description: "AI-Powered Industrial Carbon Hotspot Intelligence System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
