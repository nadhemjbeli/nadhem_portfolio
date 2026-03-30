"use client";

import dynamic from "next/dynamic";

const PathfinderLabClient = dynamic(() => import("./page-client"), { ssr: false });

export default function PathfinderLabLoader() {
  return <PathfinderLabClient />;
}
