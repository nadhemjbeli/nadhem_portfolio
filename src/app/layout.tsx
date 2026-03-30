import type { Metadata } from "next";
import "./globals.css";
import MatrixBackground from "@/components/effects/MatrixBackground";

export const metadata: Metadata = {
  title: "Nadhem Jbeli — Backend Engineer",
  description: "Backend Engineer specialized in NestJS, Node.js, GCP and AI-powered SaaS. Available for remote opportunities.",
  openGraph: {
    title: "Nadhem Jbeli — Backend Engineer",
    description: "Backend Engineer specialized in NestJS, Node.js, GCP and AI-powered SaaS. Available for remote opportunities.",
    images: ["/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body 
        className="antialiased select-none overflow-x-hidden bg-os-bg text-os-text font-mono"
        suppressHydrationWarning
      >
        <MatrixBackground />
        <div className="fixed inset-0 grid-bg pointer-events-none" />
        <div className="scanline" />
        
        <main className="relative w-full flex flex-col z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
