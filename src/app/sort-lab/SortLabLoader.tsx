"use client";

import dynamic from "next/dynamic";

// ssr: false must live in a Client Component (not a Server Component).
// This wrapper is that client boundary.
const SortLabClient = dynamic(() => import("./page-client"), { ssr: false });

export default function SortLabLoader() {
  return <SortLabClient />;
}
