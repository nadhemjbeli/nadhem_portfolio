import type { Metadata } from "next";
import PathfinderLabLoader from "./PathfinderLabLoader";

export const metadata: Metadata = {
  title: "Pathfinder_Lab — Algorithm Diagnostics | Nadhem Jbeli",
  description:
    "A Network Routing visualizer and challenge tool. Watch Pathfinding algorithms route signals step by step, or prove you understand them in Challenge Mode.",
};

export default function PathfinderLabRoute() {
  return <PathfinderLabLoader />;
}
