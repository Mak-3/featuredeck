"use client";

import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-accent text-[13px] font-medium mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight max-w-lg">
            Everything you need to understand your users
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-background border border-border rounded-xl p-6"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Feature requests</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Users submit what they need with context. You see every request with details that matter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background border border-border rounded-xl p-6"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Upvoting</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Let the community vote. See which features have real demand before you commit to building.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-background border border-border rounded-xl p-6"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            </div>
            <h3 className="font-medium mb-2">Request insights</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Understand what users care about most. Spot patterns in feedback and make better product decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-background border border-border rounded-xl p-6"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Upcoming features</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Show users what&apos;s planned and in progress. Build anticipation for what&apos;s coming next.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-background border border-border rounded-xl p-6"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1" />
              <circle cx="4" cy="12" r="1" />
              <circle cx="4" cy="18" r="1" />
            </svg>
            </div>
            <h3 className="font-medium mb-2">Feature prioritization</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Instantly see which ideas matter most. Prioritize development based on real user demand.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-background border border-border rounded-xl p-6"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Status updates</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Mark features as planned, in progress, or shipped. Everyone stays in sync automatically.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
