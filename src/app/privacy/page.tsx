"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-medium mb-3">Privacy Policy</h1>
            <p className="text-muted">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-medium mb-4">1. Introduction</h2>
              <p className="text-muted leading-relaxed mb-4">
                {"FeatureDeck (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains "}
                how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3 mt-6">2.1 Information You Provide</h3>
              <p className="text-muted leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Account information (name, email address, password)</li>
                <li>Profile information</li>
                <li>Content you submit through the Service (feedback, comments, votes)</li>
                <li>Payment information (processed through secure third-party payment processors)</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-muted leading-relaxed mb-4">
                When you use our Service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">3. How We Use Your Information</h2>
              <p className="text-muted leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li><strong>Service Providers:</strong> With third-party service providers who perform services on our behalf</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you have given us explicit permission to share</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">5. Data Security</h2>
              <p className="text-muted leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information. 
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
                to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">6. Data Retention</h2>
              <p className="text-muted leading-relaxed mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy 
                Policy, unless a longer retention period is required or permitted by law. When you delete your account, we 
                will delete or anonymize your personal information, except where we are required to retain it for legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">7. Your Rights and Choices</h2>
              <p className="text-muted leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Opt-out of certain data processing activities</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@featuredeck.in" className="text-accent hover:opacity-80 transition-opacity">
                  privacy@featuredeck.in
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-muted leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if 
                you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">9. Third-Party Services</h2>
              <p className="text-muted leading-relaxed mb-4">
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy 
                practices of these third parties. We encourage you to read the privacy policies of any third-party services 
                you access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">{"10. Children's Privacy"}</h2>
              <p className="text-muted leading-relaxed mb-4">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">11. International Data Transfers</h2>
              <p className="text-muted leading-relaxed mb-4">
                Your information may be transferred to and maintained on computers located outside of your state, province, 
                country, or other governmental jurisdiction where data protection laws may differ. By using our Service, you 
                consent to the transfer of your information to these facilities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-muted leading-relaxed mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the {"\"Last updated\""} date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">13. Contact Us</h2>
              <p className="text-muted leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@featuredeck.in" className="text-accent hover:opacity-80 transition-opacity">
                  privacy@featuredeck.in
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

