"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";

export default function HomeScrollBar() {
  const [progress, setProgress] = useState(0);

  useLenis(({ scroll, limit }) => {
    setProgress(limit > 0 ? (scroll / limit) * 100 : 0);
  });

  return (
    <>
      {/* Neon progress bar — 12px, secondary color, low opacity */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[200] pointer-events-none"
        style={{
          width: `${progress}%`,
          height: "12px",
          background: "#00ffcc",
          opacity: 0.15,
          boxShadow: "0 0 12px #00ffcc, 0 4px 16px #00ffcc44",
        }}
      />
      {/* Glowing dot at leading edge */}
      {progress > 0 && progress < 100 && (
        <div
          aria-hidden="true"
          className="fixed top-[-1px] z-[201] w-3 h-3 rounded-full pointer-events-none"
          style={{
            left: `calc(${progress}% - 6px)`,
            background: "#ccff00",
            boxShadow: "0 0 8px #ccff00, 0 0 16px #ccff0066",
          }}
        />
      )}
    </>
  );
}
