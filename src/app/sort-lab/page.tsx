import type { Metadata } from "next";
import SortLabLoader from "./SortLabLoader";

export const metadata: Metadata = {
  title: "Sort_Lab — Algorithm Diagnostics | Nadhem Jbeli",
  description:
    "A DSA visualizer and challenge tool. Watch sorting algorithms run step by step, or prove you understand them in Challenge Mode.",
};

// Server Component — just provides metadata and delegates to the
// client-side loader (which wraps the actual UI with ssr: false).
export default function SortLabRoute() {
  return <SortLabLoader />;
}
