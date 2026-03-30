"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, FolderCode, GitBranch, UserPlus, Zap, Mail, X } from "lucide-react";
import { CV_DATA } from "@/constants/cvData";

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: "NAVIGATION" | "SYSTEM" | "EXTERNAL";
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "home",
      label: "Go to Home",
      icon: <Home size={18} />,
      category: "NAVIGATION",
      action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); onClose(); }
    },
    {
      id: "projects",
      label: "View Projects",
      icon: <FolderCode size={18} />,
      category: "NAVIGATION",
      action: () => { 
          const el = document.querySelector('section'); // Archive section
          el?.scrollIntoView({ behavior: 'smooth' });
          onClose();
      }
    },
    {
      id: "github",
      label: "Open Source / GitHub",
      icon: <GitBranch size={18} />,
      category: "EXTERNAL",
      action: () => { window.open(`https://${CV_DATA.github}`, '_blank'); onClose(); }
    },
    {
      id: "system",
      label: "System Performance",
      icon: <Zap size={18} />,
      category: "SYSTEM",
      action: () => { onNavigate("system"); onClose(); }
    },
    {
      id: "contact",
      label: "Connect Protocol",
      icon: <Mail size={18} />,
      category: "NAVIGATION",
      action: () => { 
          const el = document.getElementById('dock-contact-btn');
          el?.click();
          onClose();
      }
    }
  ];

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      }
      if (e.key === "Enter") {
        filteredCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-32 px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-[640px] glass-panel rounded-2xl border-os-border/20 bg-os-surface/40 shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5"
          >
            {/* Header / Input */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-os-border/10">
              <Search size={20} className="text-neon-primary" />
              <input 
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-os-text text-lg font-medium placeholder:text-os-text/20 uppercase tracking-widest h-10"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-os-text/30 font-black border border-os-border/20 rounded px-1.5 py-0.5">ESC</span>
                <span className="text-[10px] text-os-text/30 font-black">to close</span>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[420px] overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                      selectedIndex === idx 
                        ? 'bg-neon-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]' 
                        : 'text-os-text/60 hover:text-os-text hover:bg-os-surface/60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${selectedIndex === idx ? 'text-black' : 'text-neon-primary opacity-50'}`}>
                        {cmd.icon}
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">{cmd.label}</span>
                    </div>
                    <span className={`text-[10px] font-black tracking-widest opacity-40 ${selectedIndex === idx ? 'text-black' : ''}`}>
                      {cmd.category}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-12 text-center text-os-text/20 font-black uppercase tracking-[0.3em]">
                  No commands found matching "{search}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-os-border/10 bg-black/20 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-os-text/20">
              <span>Cyber-OS Command Line</span>
              <span>v2.0.4-stable</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
