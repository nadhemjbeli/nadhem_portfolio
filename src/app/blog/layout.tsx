import type React from "react";
import "./highlight-theme.css";
import SmoothScroll from "@/components/effects/SmoothScroll";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      {/* Override the root layout's select-none so blog text is selectable */}
      <div className="select-text">{children}</div>
    </SmoothScroll>
  );
}
