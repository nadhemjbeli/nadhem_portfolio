import type React from "react";
import "./highlight-theme.css";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    // Override the root layout's select-none so blog text is selectable
    <div className="select-text">{children}</div>
  );
}
