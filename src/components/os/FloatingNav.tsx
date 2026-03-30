"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, GitBranch } from "lucide-react";
import Link from "next/link";
import { CV_DATA } from "@/constants/cvData";

interface FloatingNavProps {
  onSearchClick: () => void;
  activeTab?: string;
}

export default function FloatingNav({ onSearchClick, activeTab = "home" }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  const navLinks = [
    { label: "Home", href: "#", id: "home" },
    { label: "Blog", href: "#", id: "blog" },
    { label: "Guestbook", href: "#", id: "guestbook" },
  ];

  useEffect(() => {
    // 1. Intersection Observer to detect if we've left the top (Hero) area
    // This is 100% robust against any scroll-container issues
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
            }
        } else {
            setIsVisible(false);
        }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
        if (hero) observer.unobserve(hero);
        window.removeEventListener("wheel", handleWheel);
    };
  }, [isPastHero]);

  return (
    <motion.nav 
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ 
        y: isVisible ? 24 : -100, 
        x: "-50%",
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-1/2 z-[999] flex items-center gap-4"
    >
      {/* Main Pill */}
      <div className="glass-panel rounded-full px-6 py-2 border-os-border/20 bg-os-bg/80 backdrop-blur-xl flex items-center gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-0.5">
          <span className="text-os-text font-black tracking-tighter text-lg uppercase group-hover:text-neon-primary transition-colors duration-300">NJ</span>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-primary shadow-[0_0_8px_#ccff00]" />
        </Link>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-os-border/30" />

        {/* Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-1 px-3 rounded-full ${
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
          ))}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-os-border/30" />

        {/* Socials */}
        <div className="flex items-center gap-4 text-os-text/40">
          <a href={CV_DATA.github} target="_blank" rel="noopener noreferrer" className="hover:text-os-text transition-colors duration-300">
            <GitBranch size={16} />
          </a>
          <a href={CV_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-os-text transition-colors duration-300">
            <span className="text-[10px] font-bold">LI</span>
          </a>
          <a href="#" className="hover:text-os-text transition-colors duration-300">
            <span className="text-[10px] font-bold">X</span>
          </a>
        </div>
      </div>

      {/* Search Button */}
      <button 
        onClick={onSearchClick}
        className="glass-panel w-12 h-12 rounded-full border-os-border/20 bg-os-bg/80 backdrop-blur-xl flex items-center justify-center text-os-text/60 hover:text-neon-primary hover:border-neon-primary/30 transition-all duration-300 group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <Search size={18} className="group-hover:scale-110 transition-transform" />
      </button>
    </motion.nav>
  );
}
