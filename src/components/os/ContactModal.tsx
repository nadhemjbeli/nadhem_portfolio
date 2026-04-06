"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setFormState({ name: "", email: "", subject: "", message: "" });
    setStatus("idle");
    setErrorMsg("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300); // wait for exit animation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Transmission failed.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Transmission failed. Try again.");
    }
  };

  const inputCls =
    "w-full bg-black border border-os-border/50 rounded-xl px-4 py-3 text-sm text-os-text focus:outline-none focus:border-neon-secondary/50 transition-colors placeholder:text-os-text/20 disabled:opacity-40";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
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
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
                    Open Secure Channel
                  </h2>
                  <p className="text-[10px] text-os-text/40 font-bold uppercase tracking-[0.2em] mt-1">
                    End-to-end encrypted // Transmit message
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-os-text/40 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <AnimatePresence mode="wait">
                {/* ── Success State ── */}
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-12 flex flex-col items-center gap-5 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-neon-primary/10 border border-neon-primary/30 flex items-center justify-center">
                      <CheckCircle size={32} className="text-neon-primary" />
                    </div>
                    <div>
                      <div className="text-xl font-black uppercase tracking-wider text-neon-primary">
                        MESSAGE_TRANSMITTED ✓
                      </div>
                      <div className="text-sm text-os-text/50 mt-2 tracking-wide">
                        Signal received. I&apos;ll respond within 24 hours.
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] border border-neon-primary/30 text-neon-primary hover:bg-neon-primary/10 rounded-xl transition-colors"
                    >
                      CLOSE_CHANNEL
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form State ── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="p-8 space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          disabled={status === "sending"}
                          placeholder="John Doe"
                          className={inputCls}
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          disabled={status === "sending"}
                          placeholder="john@example.com"
                          className={inputCls}
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">
                        Subject
                      </label>
                      <select
                        required
                        disabled={status === "sending"}
                        className={`${inputCls} appearance-none cursor-pointer`}
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      >
                        <option value="" disabled>
                          Select a topic
                        </option>
                        <option value="project">New Project Proposal</option>
                        <option value="freelance">Freelance Inquiry</option>
                        <option value="hiring">Hiring / Recruitment</option>
                        <option value="chat">General Chat</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-os-text/40 ml-1">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        disabled={status === "sending"}
                        placeholder="Tell me about your project..."
                        className={`${inputCls} resize-none`}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                    </div>

                    {/* Error */}
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-black uppercase tracking-wide"
                      >
                        <AlertCircle size={16} />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-4 bg-neon-secondary text-black font-black uppercase tracking-[0.3em] text-sm rounded-xl shadow-[0_0_30px_rgba(0,255,204,0.2)] hover:shadow-[0_0_40px_rgba(0,255,204,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Open_Secure_Channel</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
