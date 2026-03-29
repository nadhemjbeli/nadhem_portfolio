"use client";

import { motion } from "framer-motion";
import { CV_DATA } from "@/constants/cvData";
import { ExternalLink, GitBranch, FileText, ChevronRight } from "lucide-react";

export default function ArchiveSection() {
  return (
    <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
      <div className="flex flex-col mb-16">
        <div className="flex items-center gap-4 mb-2">
            <div className="h-[2px] w-12 bg-neon-primary" />
            <span className="text-neon-primary font-mono text-sm font-bold tracking-[0.3em] uppercase">
                System_Archives // Decrypted
            </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-os-text tracking-tighter uppercase leading-tight">
            Past <span className="text-neon-primary">Operations</span>
        </h2>
      </div>

      <div className="space-y-12">
        {CV_DATA.archives.map((op, index) => (
          <motion.div
            key={op.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col md:flex-row gap-8 items-start p-8 glass-panel border-os-border/20 hover:border-os-border/40 transition-all duration-500 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <FileText size={160} />
            </div>

            {/* Metadata Sidebar */}
            <div className="w-full md:w-64 space-y-4 shrink-0 font-mono">
              <div className="flex items-center gap-2 text-neon-secondary text-[12px] font-bold tracking-widest uppercase">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>{op.id}</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-[11px] text-os-text/40 font-bold uppercase tracking-widest">Timestamp</div>
                <div className="text-sm text-os-text font-bold text-neon-primary">{op.date}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-os-text/40 font-bold uppercase tracking-widest">Status</div>
                <div className="inline-block px-2 py-0.5 rounded border border-neon-secondary/20 bg-neon-secondary/5 text-[11px] text-neon-secondary font-bold">
                  {op.status}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="text-[12px] text-os-text/40 font-bold uppercase tracking-[0.3em]">
                  {op.operation}
                </div>
                <h3 className="text-2xl font-bold text-os-text group-hover:text-neon-primary transition-colors">
                  {op.title}
                </h3>
                <p className="text-sm text-os-text/60 leading-relaxed max-w-2xl">
                  {op.description}
                </p>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2">
                {op.tech.map((tag) => (
                  <span key={tag} className="text-[11px] font-bold text-os-text/40 px-2.5 py-1 rounded-full border border-os-border/10 bg-os-surface/40">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 pt-2">
                {op.links.live && (
                  <a href={op.links.live} className="flex items-center gap-2 text-[12px] font-bold text-neon-primary hover:text-os-text transition-colors uppercase tracking-widest">
                    <ExternalLink size={14} />
                    <span>Live_Stream</span>
                  </a>
                )}
                {op.links.source && (
                  <a href={op.links.source} className="flex items-center gap-2 text-[12px] font-bold text-os-text/60 hover:text-neon-primary transition-colors uppercase tracking-widest">
                    <GitBranch size={14} />
                    <span>Source_Access</span>
                  </a>
                )}
                <button className="flex items-center gap-1 text-[12px] font-bold text-os-text/20 hover:text-os-text transition-colors uppercase tracking-widest ml-auto">
                    <span>Full_Report</span>
                    <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Hover Decorator */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neon-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
          </motion.div>
        ))}
      </div>

      {/* Section Footer Decorator */}
      <div className="mt-24 border-t border-os-border/10 pt-8 flex items-center justify-between font-mono text-[11px] text-os-text/20 uppercase tracking-[0.5em]">
        <span>End_of_Transmission</span>
        <span>Nadhem_Jbeli // Secure_Storage_Node_042</span>
      </div>
    </section>
  );
}
