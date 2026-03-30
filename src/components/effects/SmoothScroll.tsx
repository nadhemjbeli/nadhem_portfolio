"use client";

import { useLenis } from "lenis/react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis root options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false
    }}>
      {children}
    </ReactLenis>
  );
}
