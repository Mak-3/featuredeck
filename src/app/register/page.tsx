"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        // Check for specific Supabase error codes indicating user already exists
        const errorMessage = signUpError.message?.toLowerCase() || '';
        if (errorMessage.includes("already registered") || 
            errorMessage.includes("user already registered") ||
            errorMessage.includes("already exists") ||
            errorMessage.includes("email address is already registered") ||
            signUpError.status === 422) {
          setError("An account with this email already exists. Please login instead.");
          setLoading(false);
          return;
        }
        throw signUpError;
      }

      // Check if user already exists (email already confirmed)
      if (data.user) {
        // If the user's email is already confirmed, it means the account already exists
        if (data.user.email_confirmed_at) {
          setError("An account with this email already exists. Please login instead.");
          setLoading(false);
          return;
        }

        // Try to sign in to check if account exists with this password
        // This helps catch cases where Supabase doesn't throw an error
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If sign in succeeds, user already exists and is confirmed
        if (!signInError) {
          setError("An account with this email already exists. Please login instead.");
          await supabase.auth.signOut(); // Sign out the auto-login
          setLoading(false);
          return;
        }

        // If sign in fails, check if it's because of wrong password (user exists) 
        // or because account doesn't exist
        if (signInError.message?.includes("Invalid login credentials") || 
            signInError.message?.includes("Invalid credentials")) {
          // User exists but password might be wrong, or it's a new account
          // Since we're in registration, proceed with email confirmation
          // The user will need to confirm their email
          router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
        } else {
          // Some other error, proceed with confirmation
          router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
        }
      } else {
        // No user returned, show error
        setError("Failed to create account. Please try again.");
      }
    } catch (err: any) {
      // Handle various error cases
      const errorMessage = err.message?.toLowerCase() || '';
      if (errorMessage.includes("already registered") || 
          errorMessage.includes("user already registered") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("email address is already registered") ||
          err.code === "23505" ||
          err.status === 422) {
        setError("An account with this email already exists. Please login instead.");
      } else {
        setError(err.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) throw signInError;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) throw signInError;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Apple");
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
          <h1 className="text-3xl font-medium mb-2">Create an account</h1>
          <p className="text-muted text-sm">
            Get started with FeatureDeck today
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

          <form onSubmit={handleEmailRegister} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-muted">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-0.5 rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="terms" className="text-muted cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-accent hover:opacity-80 transition-opacity">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-accent hover:opacity-80 transition-opacity">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-surface text-muted">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              onClick={handleAppleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {"Already have an account? "}
          <Link href="/login" className="text-accent hover:opacity-80 transition-opacity font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

