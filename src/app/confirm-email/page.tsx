"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ConfirmEmailContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) throw resendError;

      setSuccess(true);
    } catch (err: any) {
      // Handle specific error cases
      if (err.message?.includes("already registered") || err.message?.includes("User already registered")) {
        setError("User already exists. Please login instead.");
      } else if (err.message?.includes("not found") || err.message?.includes("doesn't exist")) {
        setError("User doesn't exist. Please create an account first.");
      } else {
        setError(err.message || "Failed to resend confirmation email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-medium text-[15px]">FeatureDeck</span>
          </Link>
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-medium mb-2">Check your email</h1>
          <p className="text-muted text-sm">
            {"We've sent a confirmation link to your email address"}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-600 text-sm"
            >
              Confirmation email sent! Please check your inbox.
            </motion.div>
          )}

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-background border border-border rounded-md">
              <p className="text-sm text-muted mb-2">Email sent to:</p>
              <p className="text-sm font-medium">{email || "your email address"}</p>
            </div>

            <div className="space-y-3 text-sm text-muted">
              <p className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Click the confirmation link in the email to verify your account</span>
              </p>
              <p className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{"Check your spam folder if you don't see the email"}</span>
              </p>
              <p className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>The link will expire after 24 hours</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleResendEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Resend confirmation email"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted">
            Already confirmed?{" "}
            <Link href="/login" className="text-accent hover:opacity-80 transition-opacity font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-muted">
            Need to create an account?{" "}
            <Link href="/register" className="text-accent hover:opacity-80 transition-opacity font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}


