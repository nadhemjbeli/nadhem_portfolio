"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GitBranch, Menu, X } from "lucide-react";
import Link from "next/link";
import { CV_DATA } from "@/constants/cvData";

interface FloatingNavProps {
  onSearchClick: () => void;
  activeTab?: string;
}

export default function FloatingNav({ onSearchClick, activeTab = "home" }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", id: "home" },
    { 
      label: "Labs", 
      id: "labs",
      subLinks: [
        { label: "Sort_Lab", href: "/sort-lab", id: "sort-lab" },
        { label: "Pathfinder_Lab", href: "/pathfinder-lab", id: "pathfinder-lab" },
      ]
    },
    { label: "Blog", href: "#", id: "blog" },
    { label: "Guestbook", href: "#", id: "guestbook" },
  ];

  useEffect(() => {
    // 1. Intersection Observer to detect if we've left the top (Hero) area
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPastHero(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const hero = document.getElementById("os-root");
    if (hero) observer.observe(hero);

    // 2. Direct Wheel Detection for Headroom behavior
    const handleWheel = (e: WheelEvent) => {
        if (isPastHero) {
            if (e.deltaY < -10) {
                setIsVisible(true);
            } else if (e.deltaY > 10) {
                setIsVisible(false);
                if (isMenuOpen) setIsMenuOpen(false);
            }
        } else {
            setIsVisible(false);
            if (isMenuOpen) setIsMenuOpen(false);
        }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
        if (hero) observer.unobserve(hero);
        window.removeEventListener("wheel", handleWheel);
    };
  }, [isPastHero, isMenuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ 
          y: isVisible ? 24 : -100, 
          x: "-50%",
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-1/2 z-[999] flex items-center gap-4 w-full px-4 lg:w-auto"
      >
        {/* Main Pill (Desktop & Mobile Wrapper) */}
        <div className="glass-panel rounded-full w-full lg:w-auto px-4 lg:px-6 py-2 border-os-border/20 bg-os-bg/80 backdrop-blur-xl flex items-center justify-between lg:justify-start lg:gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
          {/* Logo */}
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)}
            className="group flex items-center gap-0.5"
          >
            <span className="text-os-text font-black tracking-tighter text-xl uppercase group-hover:text-neon-primary transition-colors duration-300">NJ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-primary shadow-[0_0_8px_#ccff00]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="w-[1px] h-4 bg-os-border/30" />
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <div key={link.id} className="relative group">
                  {link.subLinks ? (
                    <>
                      <div
                        className={`cursor-pointer text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 py-1 px-3 rounded-full flex items-center gap-1 ${
                          activeTab === link.id || activeTab?.includes('lab') ? 'text-black bg-neon-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'text-os-text/50 group-hover:text-os-text'
                        }`}
                      >
                        {link.label}
                      </div>
                      
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                        <div className="glass-panel border border-os-border/20 rounded-xl p-2 flex flex-col gap-1 min-w-[200px] bg-os-bg/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                          {link.subLinks.map((sub) => (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className="px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neon-primary/20 hover:text-neon-primary rounded text-os-text/60 transition-colors block text-center"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href!}
                      className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-1 px-3 rounded-full block ${
                        activeTab === link.id ? 'text-black' : 'text-os-text/50 hover:text-os-text'
                      }`}
                    >
                      <span className="relative z-10">{link.label}</span>
                      {activeTab === link.id && (
                        <motion.div 
                          layoutId="active-nav-bg"
                          className="absolute inset-0 bg-neon-primary rounded-full shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="w-[1px] h-4 bg-os-border/30" />
            <div className="flex items-center gap-5 text-os-text/40">
              <a href={CV_DATA.github} target="_blank" rel="noopener noreferrer" className="hover:text-os-text transition-colors duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href={CV_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-os-text transition-colors duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="hover:text-os-text transition-colors duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Mobile Toggle & Search Trigger (Desktop) */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onSearchClick}
              className="lg:hidden p-2 text-os-text/60"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-os-text/80 transition-transform active:scale-95"
            >
              {isMenuOpen ? <X size={24} className="text-neon-primary" /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Search Button */}
        <button 
          onClick={onSearchClick}
          className="hidden lg:flex glass-panel w-12 h-12 rounded-full border-os-border/20 bg-os-bg/80 backdrop-blur-xl items-center justify-center text-os-text/60 hover:text-neon-primary hover:border-neon-primary/30 transition-all duration-300 group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          <Search size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </motion.nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[998] bg-black/95 backdrop-blur-3xl pointer-events-auto flex flex-col items-center justify-center p-8"
          >
            {/* Background Decorator */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(204,255,0,0.1)_0%,_transparent_100%)]" />

            {/* Nav Links */}
            <div className="flex flex-col items-center gap-10 relative z-10 w-full max-w-sm">
              <div className="flex flex-col items-center gap-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {link.subLinks ? (
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-os-text/30 mb-2">{link.label}</span>
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-4xl sm:text-5xl font-black uppercase tracking-tighter hover:text-neon-primary transition-colors duration-300"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={link.href!}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-5xl font-black uppercase tracking-tighter hover:text-neon-primary transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => {
                  setIsMenuOpen(false);
                  onSearchClick();
                }}
                className="flex items-center gap-3 text-os-text/40 hover:text-os-text transition-colors duration-300 mt-4"
              >
                <Search size={24} />
                <span className="text-xl font-bold uppercase tracking-[0.2em]">Command</span>
              </motion.button>

              <div className="w-24 h-px bg-os-border/20 my-6" />

              {/* Socials with Direct SVGs for Compatibility */}
              <div className="flex items-center gap-8 text-os-text/40">
                <motion.a 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  href={CV_DATA.github} target="_blank" className="hover:text-os-text"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </motion.a>
                <motion.a 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  href={CV_DATA.linkedin} target="_blank" className="hover:text-os-text"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </motion.a>
                <motion.a 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  href="#" className="hover:text-os-text"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </motion.a>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, type: "spring" }}
                onClick={() => {
                   setIsMenuOpen(false);
                   const contactBtn = document.getElementById("dock-contact-btn");
                   if (contactBtn) contactBtn.click();
                }}
                className="w-full mt-8 py-5 bg-neon-primary text-black font-black text-xl uppercase tracking-[0.2em] rounded-full shadow-[0_0_50px_rgba(204,255,0,0.3)] active:scale-95 transition-transform"
              >
                Let&apos;s Talk
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
