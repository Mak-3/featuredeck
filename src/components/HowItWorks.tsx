"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Users submit ideas",
    description:
      "Give your users a dedicated place to request features. They describe what they need, you see it instantly.",
  },
  {
    number: "02",
    title: "Community votes",
    description:
      "Other users FeatureDeck the ideas they care about. Popular requests rise to the top naturally.",
  },
  {
    number: "03",
    title: "You decide & build",
    description:
      "Review real demand, mark features as planned or in progress. No more guessing what to build next.",
  },
  {
    number: "04",
    title: "Users get notified",
    description:
      "When a feature ships or its status changes, voters are automatically notified. Close the loop.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-accent text-[13px] font-medium mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
            Four steps to better products
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <span className="text-[11px] font-medium text-accent mb-3 block">
                {step.number}
              </span>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
