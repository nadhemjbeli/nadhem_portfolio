"use client";

import { motion } from "framer-motion";
import { Copy, Shield, Check, Globe } from "lucide-react";
import { CV_DATA } from "@/constants/cvData";
import { useState } from "react";
import ContactModal from "../os/ContactModal";

export default function ContactSection() {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CV_DATA.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative w-full py-24 bg-os-bg overflow-hidden border-t border-os-border/20">
      {/* Background Decorators */}
      <div className="absolute inset-0 grid-bg opacity-5" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-secondary/20 to-transparent shadow-[0_0_20px_rgba(0,255,204,0.1)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          {/* Left Column: Heading & Info */}
          <div className="flex-1 max-w-2xl space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-secondary animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-neon-secondary/60">
                  Secure_Uplink // Ready
                </span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                Establish<br />
                <span className="text-shadow-neon-secondary">Connection</span>
              </h2>
              
              <p className="text-xl md:text-2xl font-medium text-os-text/60 leading-relaxed max-w-xl">
                Broadcast your mission parameters. Whether it&apos;s classified infrastructure or a covert web operation.
              </p>
            </div>

            {/* Email Pill */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-os-text/30 ml-1">
                &gt;_ COPY_ENCRYPTION_KEY (EMAIL)
              </label>
              <div className="flex items-center gap-2 max-w-md group">
                <div className="flex-1 glass-panel px-6 py-4 rounded-xl border-os-border/50 text-os-text/80 font-mono text-sm md:text-lg overflow-hidden whitespace-nowrap text-ellipsis">
                  {CV_DATA.email}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="glass-panel p-4 rounded-xl hover:bg-neon-secondary/10 hover:border-neon-secondary/40 transition-all active:scale-95 text-neon-secondary"
                >
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Social Frequencies */}
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { label: "GITHUB_FREQ", href: CV_DATA.github, icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                )},
                { label: "LINKEDIN_FREQ", href: CV_DATA.linkedin, icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                )},
                { label: "X_FREQ", href: "#", icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                )}
              ].map(social => (
                <a 
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel flex items-center gap-3 px-4 py-3 rounded-xl border-os-border/50 text-[10px] font-black tracking-widest text-os-text/40 hover:text-os-text hover:border-os-border transition-all"
                >
                  <span className="text-white/60">{social.icon}</span>
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
            <div className="flex flex-col items-center lg:items-end">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-os-text/30 mb-2">
                Secure_Line_Available
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="group relative px-12 py-8 bg-neon-secondary text-black font-black uppercase tracking-[0.3em] rounded-xl flex items-center gap-4 shadow-[0_0_50px_rgba(0,255,204,0.3)] hover:shadow-[0_0_80px_rgba(0,255,204,0.5)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />
                <span className="text-xl relative z-10">Open_Secure_Channel</span>
                <Shield size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
              </motion.button>
            </div>

            {/* Bottom Metadata */}
            <div className="flex flex-col items-center lg:items-end gap-2 text-[8px] font-bold text-os-text/20 tracking-[0.4em] uppercase text-center lg:text-right">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-neon-secondary" />
                <span>Transmission Source: Tunisia (CET)</span>
              </div>
              <span>Status: Accepting_Contracts</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-shadow-neon-secondary {
          text-shadow: 0 0 20px rgba(0, 255, 204, 0.5);
          color: var(--color-neon-secondary);
        }
      `}</style>

      {/* Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
