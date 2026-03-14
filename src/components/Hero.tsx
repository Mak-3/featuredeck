"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-accent text-[13px] font-medium mb-4"
          >
            For React Native apps
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[clamp(2.5rem,6vw,3.5rem)] font-medium leading-[1.1] tracking-tight mb-6"
          >
            Ship features your
            <br />
            users actually want
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted text-lg mb-8 max-w-md leading-relaxed"
          >
            Let users submit ideas, vote on what matters, and stay in the loop when features ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="/register"
              className="bg-foreground text-background px-5 py-2.5 rounded-md text-[14px] font-medium hover:opacity-80 transition-opacity"
            >
              Start free
            </a>
            <a
              href="#how-it-works"
              className="text-foreground px-5 py-2.5 rounded-md text-[14px] font-medium border border-border hover:bg-surface transition-colors"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium">Feature Board</span>
                <span className="text-[11px] text-muted bg-background px-2 py-0.5 rounded">
                  12 requests
                </span>
              </div>
              <button className="text-[12px] bg-accent text-white px-3 py-1.5 rounded hover:opacity-80 transition-opacity">
                + New Request
              </button>
            </div>
            
            <div className="divide-y divide-border">
              {[
                { title: "Dark mode support", votes: 47, status: "coming-soon", comments: 12 },
                { title: "Export data to CSV", votes: 34, status: "planned", comments: 8 },
                { title: "Offline mode", votes: 28, status: "in-review", comments: 5 },
                { title: "Widget customization", votes: 21, status: "shipped", comments: 15 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="px-4 py-3.5 flex items-center gap-4 hover:bg-background/50 transition-colors"
                >
                  <button className="flex flex-col items-center min-w-[48px] py-1.5 px-2 rounded border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-muted group-hover:text-accent transition-colors"
                    >
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    <span className="text-[13px] font-medium mt-0.5">{item.votes}</span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium truncate">{item.title}</p>
                    <p className="text-[12px] text-muted">{item.comments} comments</p>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-1 rounded font-medium ${
                      item.status === "shipped"
                        ? "bg-green-500/10 text-green-600"
                        : item.status === "coming-soon"
                        ? "bg-accent/10 text-accent"
                        : item.status === "planned"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-muted/10 text-muted"
                    }`}
                  >
                    {item.status === "coming-soon"
                      ? "Coming Soon"
                      : item.status === "in-review"
                      ? "In Review"
                      : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
