"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm"
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
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

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#how-it-works"
            className="text-muted hover:text-foreground transition-colors text-[13px]"
          >
            How it works
          </Link>
          <Link
            href="/#pricing"
            className="text-muted hover:text-foreground transition-colors text-[13px]"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-muted hover:text-foreground transition-colors text-[13px]"
          >
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin"></div>
          ) : user && user.email_confirmed_at ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] text-muted hover:text-foreground transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-[13px] bg-foreground text-background px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] text-muted hover:text-foreground transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-[13px] bg-foreground text-background px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
