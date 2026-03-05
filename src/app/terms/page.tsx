"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
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
            <h1 className="text-4xl font-medium mb-3">Terms of Service</h1>
            <p className="text-muted">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-medium mb-4">1. Agreement to Terms</h2>
              <p className="text-muted leading-relaxed mb-4">
                {"By accessing or using FeatureDeck (\"Service\"), you agree to be bound by these Terms of Service (\"Terms\"). "}
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">2. Description of Service</h2>
              <p className="text-muted leading-relaxed mb-4">
                FeatureDeck is a feature feedback platform designed for React Native applications. The Service allows users 
                to collect, manage, and prioritize feature requests and user feedback for their applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">3. User Accounts</h2>
              <p className="text-muted leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">4. Acceptable Use</h2>
              <p className="text-muted leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">5. Intellectual Property</h2>
              <p className="text-muted leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by FeatureDeck and are protected 
                by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">6. User Content</h2>
              <p className="text-muted leading-relaxed mb-4">
                You retain ownership of any content you submit through the Service. By submitting content, you grant us a 
                worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content solely for the 
                purpose of providing and improving the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">7. Payment and Billing</h2>
              <p className="text-muted leading-relaxed mb-4">
                If you purchase a paid subscription, you agree to pay all fees associated with your subscription. Fees are 
                charged in advance on a recurring basis. You may cancel your subscription at any time, but refunds are 
                subject to our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">8. Termination</h2>
              <p className="text-muted leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for 
                any reason, including breach of these Terms. Upon termination, your right to use the Service will cease 
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-muted leading-relaxed mb-4">
                {"The Service is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied. "}
                We do not guarantee that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">10. Limitation of Liability</h2>
              <p className="text-muted leading-relaxed mb-4">
                In no event shall FeatureDeck be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including loss of profits, data, or use, incurred by you or any third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">11. Changes to Terms</h2>
              <p className="text-muted leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by 
                posting the new Terms on this page and updating the {"\"Last updated\""} date. Your continued use of the Service 
                after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">12. Contact Information</h2>
              <p className="text-muted leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@featuredeck.in" className="text-accent hover:opacity-80 transition-opacity">
                  legal@featuredeck.in
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

