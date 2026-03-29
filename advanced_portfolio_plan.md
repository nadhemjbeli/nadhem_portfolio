# Implementation Plan - Advanced Portfolio (Cyber-OS v1.0)

## Goal
Create an "Advanced" version of the Backend Engineer portfolio, moving from a standard dashboard to a fully immersive "Cyber-OS" desktop metaphor.

## Key Features (Inspiration: adpandey.com)
- **OS Interface**: A desktop-like environment with a Top Status Bar and a Bottom Quick-Access Dock.
- **Interactive Terminal**: A central command-line interface for navigation and info retrieval.
- **Bento Widgets**: Live "System Monitor" (CPU/RAM graphs) and "Task Manager" (Project list).
- **Matrix/Grid Background**: Animated WebGL background using Three.js or simple CSS/SVG.
- **Cyberpunk Aesthetic**: High-contrast dark theme with Neon Green (#ccff00) accents and glitch effects.

## Proposed Tech Stack
- **Framework**: Next.js 15 (App Router) for superior performance and SEO.
- **Styling**: Tailwind CSS 4 with custom design tokens.
- **Animations**: Framer Motion for window transitions and springy interactions.
- **Charts**: Recharts or simple SVG for live system monitors.

## Implementation Steps

### 1. Foundation & Layout
- [NEW] Initialize Next.js project.
- [NEW] `layout.tsx`: Root OS structure (TopBar, Dock, Desktop).
- [NEW] `index.css`: Cyberpunk theme tokens (Colors, Fonts, Animations).

### 2. Core OS Components
- [NEW] `Terminal.tsx`: State-managed command line (help, about, skills, clear).
- [NEW] `OSWindow.tsx`: Draggable/Resizable/Closable container for apps.
- [NEW] `Dock.tsx`: Floating icon bar for quick page switching.

### 3. Bento Widgets (Live Data)
- [NEW] `SystemMonitor.tsx`: Real-time line graphs (simulated local stats).
- [NEW] `TaskManager.tsx`: Tabular view of current "processes" (projects).

### 4. Advanced Effects
- [NEW] `MatrixBackground.tsx`: Subtle animated grid overlay.
- [NEW] `GlitchText.tsx`: Reusable component for that "hacker" feel.

## Verification Plan

### Automated Tests
- Browser-subagent verification of "Terminal" command responsiveness.
- Verification of "Window" dragging/closing logic.

### Manual Verification
- Testing the "OS" feel: does it feel like a cohesive desktop environment?
- Performance check on mobile (OS-to-Mobile transformation).
