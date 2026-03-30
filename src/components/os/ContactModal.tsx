"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    // Add submission logic here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl glass-panel rounded-2xl overflow-hidden pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/5"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-os-border/20 flex items-center justify-between bg-os-surface/40">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Let&apos;s Connect</h2>
                  <p className="text-[10px] text-os-text/40 font-bold uppercase tracking-[0.2em] mt-1">
                    Fill out the form below and I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-os-text/40 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full bg-black border border-os-border/50 rounded-xl px-4 py-3 text-sm text-os-text focus:outline-none focus:border-neon-secondary/50 transition-colors placeholder:text-os-text/20"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full bg-black border border-os-border/50 rounded-xl px-4 py-3 text-sm text-os-text focus:outline-none focus:border-neon-secondary/50 transition-colors placeholder:text-os-text/20"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">Subject</label>
                  <select
                    required
                    className="w-full bg-black border border-os-border/50 rounded-xl px-4 py-3 text-sm text-os-text focus:outline-none focus:border-neon-secondary/50 transition-colors appearance-none cursor-pointer"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="project">New Project Proposal</option>
                    <option value="freelance">Freelance Inquiry</option>
                    <option value="hiring">Hiring / Recruitment</option>
                    <option value="chat">General Chat</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your project..."
                    className="w-full bg-black border border-os-border/50 rounded-xl px-4 py-3 text-sm text-os-text focus:outline-none focus:border-neon-secondary/50 transition-colors resize-none placeholder:text-os-text/20"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-neon-secondary text-black font-black uppercase tracking-[0.3em] text-sm rounded-xl shadow-[0_0_30px_rgba(0,255,204,0.2)] hover:shadow-[0_0_40px_rgba(0,255,204,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
