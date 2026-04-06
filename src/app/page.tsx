"use client";

import { useState, useEffect } from "react";
import FloatingNav from "@/components/os/FloatingNav";
import CommandPalette from "@/components/os/CommandPalette";
import Dock from "@/components/os/Dock";
import OSWindow from "@/components/os/OSWindow";
import Terminal from "@/components/os/Terminal";
import SystemMonitor from "@/components/widgets/SystemMonitor";
import TaskManager from "@/components/widgets/TaskManager";
import BootSequence from "@/components/auth/BootSequence";
import WelcomeScreen from "@/components/auth/WelcomeScreen";
import Contact from "@/components/os/Contact";
import ArchiveSection from "@/components/sections/ArchiveSection";
import GithubStatsSection from "@/components/sections/GithubStatsSection";
import ContactSection from "@/components/sections/ContactSection";
import MobileHome from "@/components/os/MobileHome";
import MobileSystemView from "@/components/os/MobileSystemView";
import DesktopHero from "@/components/os/DesktopHero";
import GridSpotlight from "@/components/effects/GridSpotlight";
import SmoothScroll from "@/components/effects/SmoothScroll";
import HomeScrollBar from "@/components/effects/HomeScrollBar";
import { Terminal as TerminalIcon, Activity, ListChecks, Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type OSPhase = "boot" | "welcome" | "desktop";

interface WindowState {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function Home() {
  const [phase, setPhase] = useState<OSPhase>("boot");
  const [activeWindows, setActiveWindows] = useState<string[]>(["terminal", "tasks", "system"]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>("terminal");
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("home");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setActiveWindows(["home"]);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", handleGlobalKeys);
    };
  }, []);

  const toggleWindow = (id: string) => {
    if (isMobile) {
      setActiveMobileTab(id);
      setActiveWindows([id]);
      setFocusedWindowId(id);
      // Scroll to top when switching tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (id === "home") {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }
      setActiveWindows((prev) => {
        if (prev.includes(id)) {
          return prev.filter((w) => w !== id);
        } else {
          return [...prev, id];
        }
      });
      setFocusedWindowId(id);
    }
  };

  const WINDOWS: WindowState[] = [
    {
      id: "terminal",
      title: "Terminal",
      icon: <TerminalIcon size={14} className="text-neon-primary" />,
      component: <Terminal />,
    },
    {
      id: "system",
      title: "System",
      icon: <Activity size={14} className="text-neon-primary" />,
      component: <SystemMonitor />,
    },
    {
      id: "tasks",
      title: "Tasks",
      icon: <ListChecks size={14} className="text-neon-secondary" />,
      component: <TaskManager />,
    },
    {
      id: "contact",
      title: "Connect",
      icon: <Mail size={14} className="text-red-400" />,
      component: <Contact />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full relative overflow-x-hidden bg-os-bg font-mono selection:bg-neon-primary selection:text-black">
      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <motion.div key="boot" exit={{ opacity: 0 }} className="fixed inset-0 z-[200]">
            <BootSequence onComplete={() => setPhase("welcome")} />
          </motion.div>
        )}

        {phase === "welcome" && (
          <motion.div key="welcome" className="fixed inset-0 z-[150]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WelcomeScreen onEnter={() => setPhase("desktop")} />
          </motion.div>
        )}

        {phase === "desktop" && (
          <motion.div 
            key="desktop" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col w-full"
          >
            <SmoothScroll>
              <>
                <FloatingNav onSearchClick={() => setIsPaletteOpen(true)} />
                <HomeScrollBar />
                <CommandPalette 
                  isOpen={isPaletteOpen} 
                  onClose={() => setIsPaletteOpen(false)} 
                  onNavigate={(id) => toggleWindow(id)}
                />
              </>
              
              {/* Main Application Layer */}
              <div id="os-root" className={`relative ${isMobile ? 'min-h-screen' : 'h-[calc(100vh-40px)] p-6'} overflow-hidden shrink-0`}>
                
                {isMobile ? (
                  /* Mobile Tabbed Dashboard */
                  <div className="flex flex-col w-full h-full pb-32">
                    <AnimatePresence mode="wait">
                      {activeMobileTab === "home" && (
                          <motion.div 
                              key="tab-home"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="w-full"
                          >
                              <MobileHome />
                          </motion.div>
                      )}
                      {activeMobileTab === "system" && (
                          <motion.div 
                              key="tab-system"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.05 }}
                              className="w-full"
                          >
                              <MobileSystemView />
                          </motion.div>
                      )}
                      {activeMobileTab === "contact" && (
                          <motion.div 
                              key="tab-contact"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="w-full"
                          >
                              <div className="px-6 py-12 h-screen overflow-auto">
                                  <Contact />
                              </div>
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Desktop OS Layer */
                  <>
                  <>
                    <GridSpotlight />
                    <DesktopHero />
                  </>

                    {/* Windows Layer */}
                    <AnimatePresence>
                      {WINDOWS.filter(w => activeWindows.includes(w.id)).map((win) => (
                        <OSWindow
                          key={win.id}
                          id={win.id}
                          title={win.title}
                          icon={win.icon}
                          isFocused={focusedWindowId === win.id}
                          onFocus={() => setFocusedWindowId(win.id)}
                          onClose={() => toggleWindow(win.id)}
                          isMobile={false}
                          className={
                            win.id === "terminal" 
                            ? "w-full max-w-[900px] h-[600px] left-1/2 top-12 -translate-x-1/2 shadow-[0_0_50px_rgba(204,255,0,0.1)]" 
                            : win.id === "tasks"
                            ? "w-[400px] h-[350px] right-12 top-12"
                            : win.id === "system"
                            ? "w-[400px] h-[300px] right-12 top-[380px]"
                            : "w-[500px] h-[450px] left-12 bottom-24"
                          }
                        >
                          {win.component}
                        </OSWindow>
                      ))}
                    </AnimatePresence>

                    <div className="absolute bottom-24 left-12 text-[10px] uppercase tracking-[0.4em] font-black text-os-text/10 pointer-events-none select-none z-0 leading-loose">
                      SECURE_ENVIRONMENT_ENCRYPTED_AES256 <br />
                      LOC: 127.0.0.1 // DEV_NODE_JB // AUTH: SUCCESS
                    </div>
                  </>
                )}

                {/* Shared Dock Component */}
                <Dock 
                  activeWindows={activeWindows} 
                  onToggle={toggleWindow} 
                  isMobile={isMobile}
                />
              </div>

              {/* Continuous Sections */}
              <div className="relative z-10 bg-os-bg shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
                  <ArchiveSection />
                  <GithubStatsSection />
                  <ContactSection />
              </div>

              {/* Global Decorators */}
              <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(204,255,0,0.03)_0%,_transparent_100%)]" />
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
