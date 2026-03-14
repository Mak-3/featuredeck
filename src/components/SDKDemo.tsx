"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import IPhoneMockup from "./IPhoneMockup";

export default function SDKDemo() {
  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Simple integration",
      desc: "Add the SDK and drop in one component.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      ),
      title: "Customizable",
      desc: "Match your app with themes and layout options.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Live updates",
      desc: "Votes and feature status update in real time.",
    },
  ];

  return (
    <>
      <section id="demo" className="py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-lg"
            >
              <p className="text-accent text-[13px] font-medium mb-4">
                See it in action
              </p>

              <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-medium leading-[1.15] tracking-tight mb-5">
                A feedback board
                <br />
                built for React Native
              </h2>

              <p className="text-muted text-[16px] leading-relaxed mb-8 max-w-md">
                Let users request features, vote on ideas, and track updates —
                directly inside your app.
              </p>

              <div className="space-y-4">
                {features.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 * i }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center mt-0.5">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-[14px] font-medium mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-[13px] text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <IPhoneMockup
                src="/sdk-demo.gif"
                alt="FeatureDeck SDK demo running in a React Native app"
              />
            </motion.div>
          </div>
        </div>
      </section>

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
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-[13px] font-medium px-3.5 py-1.5 rounded-full mb-8">
                AI-friendly SDK
              </div>

              <h2 className="text-3xl md:text-[2.75rem] font-medium tracking-tight leading-[1.15] mb-3 max-w-2xl mx-auto">
                Add a feedback board in minutes
              </h2>

              <p className="text-muted max-w-md mx-auto mb-10 leading-relaxed">
                Our docs are optimized for AI coding tools — many developers
                integrate FeatureDeck in under 30 seconds.
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
    </>
  );
}