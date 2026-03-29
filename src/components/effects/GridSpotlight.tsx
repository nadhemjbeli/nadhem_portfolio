"use client";

import { useEffect, useRef } from "react";

export default function GridSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      container.style.setProperty("--mouse-x", `${clientX}px`);
      container.style.setProperty("--mouse-y", `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        background: `
          radial-gradient(
            600px circle at var(--mouse-x, 0) var(--mouse-y, 0),
            rgba(204, 255, 0, 0.08),
            transparent 40%
          ),
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
      }}
    >
      {/* Decorative Grid Nodes */}
      <div 
        className="absolute inset-0"
        style={{
            backgroundImage: "radial-gradient(circle, rgba(204, 255, 0, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(350px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(350px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent 80%)",
        }}
      />

      {/* Hexadecimal Noise Layer (Faint) */}
      <div className="absolute inset-0 opacity-[0.02] select-none pointer-events-none font-mono text-[10px] grid grid-cols-[repeat(auto-fill,40px)] leading-[40px] text-center">
          {Array.from({ length: 400 }).map((_, i) => (
              <span key={i}>{Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')}</span>
          ))}
      </div>

      {/* Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-primary/20 animate-scan pointer-events-none opacity-20" />
    </div>
  );
}
