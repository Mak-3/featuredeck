"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "How do users submit feature requests?",
    answer:
      "Users can submit requests directly from your React Native app through a clean, native interface. They describe what they want and why. No friction, no redirects.",
  },
  {
    question: "How does the voting system work?",
    answer:
      "Each user gets one vote per feature request. They can FeatureDeck ideas they care about, and the most-wanted features naturally rise to the top. You see real demand at a glance.",
  },
  {
    question: "Can users see what's coming next?",
    answer:
      "Yes. You can share your roadmap publicly so users see what features are planned and in development. It builds anticipation and shows you're listening.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most developers integrate FeaturedDeck in under 2 minutes. Install the SDK, initialize it with your API key, and you're ready to collect feedback. If you're using AI coding tools, setup can often take less than 30 seconds."
  },
  {
    question: "Does it work with Expo?",
    answer:
      "Yes, fully compatible with Expo managed workflow and bare React Native projects. No native code changes required for Expo apps.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-accent text-[13px] font-medium mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-surface/50 transition-colors"
              >
                <span className="text-[14px] font-medium pr-4">{faq.question}</span>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="flex-shrink-0 text-muted"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-[14px] text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
