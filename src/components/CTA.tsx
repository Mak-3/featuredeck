"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-accent/[0.04]" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent text-[13px] font-medium px-3.5 py-1.5 rounded-full mb-8"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z" />
              </svg>
              AI-friendly SDK
            </motion.div>

            <h2 className="text-3xl md:text-[2.75rem] font-medium tracking-tight leading-[1.15] mb-3 max-w-2xl mx-auto">
              Add a feedback board to your app in 2 minutes.
            </h2>
            <p className="text-2xl md:text-3xl font-medium tracking-tight text-muted mb-6">
              Or let AI do it in 30 seconds.
            </p>

            <p className="text-muted max-w-md mx-auto mb-10 leading-relaxed">
              Our SDK and docs are optimized for modern AI coding tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/docs"
                className="bg-foreground text-background px-6 py-3 rounded-md text-[14px] font-medium hover:opacity-80 transition-opacity"
              >
                Read the docs
              </Link>
              <Link
                href="/register"
                className="text-foreground px-6 py-3 rounded-md text-[14px] font-medium border border-border hover:bg-surface transition-colors"
              >
                Get started free
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
