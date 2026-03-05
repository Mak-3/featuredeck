"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-6 text-muted hover:text-foreground transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to home</span>
            </Link>
            <h1 className="text-4xl font-medium mb-3">Refund Policy</h1>
            <p className="text-muted">Effective date: March 4, 2026</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <p className="text-muted leading-relaxed mb-4">
                FeatureDeck is sold and billed through our Merchant of Record,{" "}
                <strong>Lemon Squeezy</strong>. All payments, taxes, and refunds
                are processed by Lemon Squeezy on our behalf.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">
                1. Free Trial (If Applicable)
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                We encourage users to evaluate FeatureDeck during the free
                trial period. No refunds will be issued for failure to cancel
                before the trial converts to a paid subscription.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">
                2. Subscription Billing
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                FeatureDeck operates on a recurring subscription model (monthly
                or annual). By subscribing, you authorize recurring billing
                unless cancelled prior to renewal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">
                3. Refund Eligibility
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                We offer a <strong>7-day refund window</strong> for first-time
                purchases only.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6">
                Refunds may be granted if:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Requested within 7 days of initial purchase</li>
                <li>The account has not been significantly used</li>
                <li>There was an accidental or duplicate charge</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">
                Refunds are not provided for:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Subscription renewals</li>
                <li>Partial billing periods</li>
                <li>Change of mind after extended use</li>
                <li>Failure to cancel before renewal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">4. Annual Plans</h2>
              <p className="text-muted leading-relaxed mb-4">
                Annual subscriptions are eligible for refund only within 7 days
                of initial purchase. After 7 days, no refunds will be issued.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">
                5. How to Request a Refund
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                To request a refund, email:{" "}
                <a
                  href="mailto:support@featuredeck.in"
                  className="text-accent hover:opacity-80 transition-opacity"
                >
                  support@featuredeck.in
                </a>
              </p>
              <p className="text-muted leading-relaxed mb-3">Include:</p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Account email</li>
                <li>Order ID from Lemon Squeezy receipt</li>
                <li>Reason for request</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                Approved refunds will be processed via Lemon Squeezy and
                returned to the original payment method. Processing time depends
                on your bank (typically 5–10 business days).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">6. Chargebacks</h2>
              <p className="text-muted leading-relaxed mb-4">
                Please contact us before initiating a chargeback. Fraudulent or
                abusive chargebacks may result in account suspension.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
