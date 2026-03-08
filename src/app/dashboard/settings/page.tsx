"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyCreatedAt, setApiKeyCreatedAt] = useState<string | null>(null);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const router = useRouter();

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const fetchApiKey = useCallback(async (projectId: string) => {
    if (!projectId) return;
    setApiKeyLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(`/api/api-keys?project_id=${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch API key');

      const result = await response.json();
      if (result.data?.hasKey) {
        setApiKey(result.data.apiKey);
        setApiKeyCreatedAt(result.data.createdAt || null);
      } else {
        setApiKey(null);
        setApiKeyCreatedAt(null);
      }
    } catch (err: any) {
      console.error('Error fetching API key:', err);
    } finally {
      setApiKeyLoading(false);
    }
  }, []);

  const fetchProjectName = useCallback(async (projectId: string) => {
    if (!projectId) return;
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(`/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setProjectName(result.data?.name || "");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/login");
          return;
        }

        if (!user.email_confirmed_at) {
          await supabase.auth.signOut();
          router.push(`/confirm-email?email=${encodeURIComponent(user.email || "")}`);
          return;
        }

        setUser(user);

        const storedProjectId = localStorage.getItem("selectedProjectId") || "";
        setSelectedProjectId(storedProjectId);
        if (storedProjectId) {
          await Promise.all([
            fetchApiKey(storedProjectId),
            fetchProjectName(storedProjectId),
          ]);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, fetchApiKey, fetchProjectName]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "selectedProjectId" && e.newValue) {
        setSelectedProjectId(e.newValue);
        setNewlyGeneratedKey(null);
        fetchApiKey(e.newValue);
        fetchProjectName(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchApiKey, fetchProjectName]);

  const handleRegenerateApiKey = async () => {
    if (!selectedProjectId) {
      setError("No project selected. Select a project from the sidebar first.");
      return;
    }

    if (!confirm("Are you sure you want to regenerate your API key? The old key will stop working immediately.")) {
      return;
    }

    setRegenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("/api/api-keys/regenerate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_id: selectedProjectId }),
      });

      if (!response.ok) throw new Error("Failed to regenerate API key");

      const result = await response.json();
      setNewlyGeneratedKey(result.data.apiKey);
      setApiKey(null);
      setSuccess("API key regenerated. Copy it now — it won't be shown again.");
    } catch (err: any) {
      setError(err.message || "Failed to regenerate API key");
    } finally {
      setRegenerating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to logout");
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProjectId) {
      setError("No project selected.");
      return;
    }

    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    setDeleting("project");
    setError(null);
    setSuccess(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`/api/projects/${selectedProjectId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete project");
      }

      setSuccess("Project deleted successfully");
      localStorage.removeItem("selectedProjectId");
      setSelectedProjectId("");
      setProjectName("");
      setApiKey(null);
      setNewlyGeneratedKey(null);

      window.dispatchEvent(new StorageEvent("storage", {
        key: "selectedProjectId",
        newValue: "",
      }));
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all your data.")) {
      return;
    }

    if (!confirm("This is your last chance. Are you absolutely sure?")) {
      return;
    }

    setDeleting("account");
    setError(null);
    setSuccess(null);

    try {
      setError("Account deletion requires server-side processing. Please contact support.");
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 bg-surface">
        <div className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 flex justify-center">
          <div className="w-full max-w-2xl space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-600 text-sm"
              >
                {success}
              </motion.div>
            )}

            {!selectedProjectId && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-yellow-700 dark:text-yellow-400 text-sm">
                No project selected. Create or select a project from the sidebar.
              </div>
            )}

            {/* Project Name */}
            <button
              onClick={() => {
                const newName = prompt("Enter project name:", projectName);
                if (newName && selectedProjectId) {
                  setProjectName(newName);
                  (async () => {
                    const token = await getAuthToken();
                    if (token) {
                      await fetch(`/api/projects/${selectedProjectId}`, {
                        method: "PATCH",
                        headers: {
                          "Authorization": `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: newName }),
                      });
                    }
                  })();
                }
              }}
              disabled={!selectedProjectId}
              className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Project name</p>
                <p className="text-xs text-muted mt-0.5">{projectName || "—"}</p>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* API Key */}
            <div className="w-full bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">API Key</p>
                  <p className="text-xs text-muted mt-0.5">
                    {selectedProjectId
                      ? "Use this key to authenticate SDK requests for this project"
                      : "Select a project to manage its API key"}
                  </p>
                </div>
              </div>

              {apiKeyLoading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : !selectedProjectId ? null : (
                <div className="mt-3 space-y-2">
                  {/* Show newly generated key (plaintext, one-time view) */}
                  {newlyGeneratedKey && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md space-y-2">
                      <p className="text-xs font-medium text-green-700 dark:text-green-400">
                        Copy this key now. It will not be shown again.
                      </p>
                      <div className="flex items-center gap-2 p-2 bg-surface rounded border border-border">
                        <code className="flex-1 text-xs font-mono text-foreground break-all">
                          {newlyGeneratedKey}
                        </code>
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(newlyGeneratedKey);
                            setSuccess("API key copied to clipboard");
                            setTimeout(() => setSuccess(null), 2000);
                          }}
                          className="px-2 py-1 text-xs font-medium bg-background border border-border rounded hover:bg-surface transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Masked key display */}
                  {apiKey && !newlyGeneratedKey && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-surface rounded border border-border">
                        <code className="flex-1 text-xs font-mono text-muted break-all">
                          {apiKey}
                        </code>
                      </div>
                      <p className="text-xs text-muted">
                        The full key was shown once at creation. Regenerate to get a new one.
                        {apiKeyCreatedAt && <> Created {new Date(apiKeyCreatedAt).toLocaleDateString()}.</>}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleRegenerateApiKey}
                    disabled={regenerating || apiKeyLoading}
                    className="w-full px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {regenerating ? "Regenerating..." : apiKey ? "Regenerate API Key" : "Generate API Key"}
                  </button>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors"
            >
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-red-500">Logout</p>
                <p className="text-xs text-muted mt-0.5">{user?.email}</p>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Danger Zone */}
            <div className="pt-4">
              <h2 className="text-sm font-medium text-foreground mb-4">Danger Zone</h2>
              <div className="space-y-3">
                <button
                  onClick={handleDeleteProject}
                  disabled={deleting !== null || !selectedProjectId}
                  className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {deleting === "project" ? "Deleting..." : "Delete Project"}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting !== null}
                  className="w-full bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {deleting === "account" ? "Deleting..." : "Delete Account"}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
