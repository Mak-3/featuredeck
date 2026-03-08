"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  under_review: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  planned: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  in_progress: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  under_review: "Under Review",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  closed: "Closed",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-gray-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

export default function FeaturesPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const fetchFeatures = useCallback(async (projectId: string) => {
    if (!projectId) {
      setFeatures([]);
      return;
    }
    try {
      const token = await getAuthToken();
      if (!token) return;

      const params = new URLSearchParams({ project_id: projectId });
      if (statusFilter) params.set("status", statusFilter);

      const response = await fetch(`/api/feedback?${params}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch features");

      const result = await response.json();
      setFeatures(result.data || []);
    } catch (err) {
      console.error("Error fetching features:", err);
    }
  }, [statusFilter]);

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
          await fetchFeatures(storedProjectId);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, fetchFeatures]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "selectedProjectId" && e.newValue) {
        setSelectedProjectId(e.newValue);
        fetchFeatures(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchFeatures]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchFeatures(selectedProjectId);
    }
  }, [statusFilter, selectedProjectId, fetchFeatures]);

  const handleStatusChange = async (featureId: string, newStatus: string) => {
    setUpdating(featureId);
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(`/api/feedback/${featureId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setFeatures(prev =>
        prev.map(f => f.id === featureId ? { ...f, status: newStatus } : f)
      );
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (featureId: string) => {
    if (!confirm("Delete this feature request?")) return;

    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(`/api/feedback/${featureId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete");

      setFeatures(prev => prev.filter(f => f.id !== featureId));
    } catch (err) {
      console.error("Error deleting feature:", err);
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
        <div className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-foreground lg:pl-0 pl-14">Features</h1>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {!selectedProjectId ? (
            <div className="bg-background border border-border rounded-lg p-6 text-center py-12">
              <p className="text-foreground font-medium mb-2">No project selected</p>
              <p className="text-sm text-muted">Select a project from the sidebar to view feature requests.</p>
            </div>
          ) : features.length === 0 ? (
            <div className="bg-background border border-border rounded-lg p-6 text-center py-12">
              <p className="text-foreground font-medium mb-2">No feature requests yet</p>
              <p className="text-sm text-muted">Feature requests from your SDK users will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {features.map((feature, index) => {
                const voteCount = feature.votes?.[0]?.count || feature.upvotes_count || 0;
                const statusKey = feature.status || "open";
                const author = feature.created_by_end_user;

                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-background border border-border rounded-lg p-4 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Vote count */}
                      <div className="flex flex-col items-center gap-0.5 pt-0.5">
                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span className="text-sm font-semibold text-foreground">{voteCount}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                        {feature.description && (
                          <p className="text-sm text-muted line-clamp-2 mb-2">{feature.description}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[statusKey] || STATUS_COLORS.open}`}>
                            {STATUS_LABELS[statusKey] || statusKey}
                          </span>
                          <span className={`text-xs font-medium ${PRIORITY_COLORS[feature.priority] || "text-muted"}`}>
                            {feature.priority}
                          </span>
                          {author?.username && (
                            <span className="text-xs text-muted">by {author.username}</span>
                          )}
                          <span className="text-xs text-muted">
                            {new Date(feature.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <select
                          value={statusKey}
                          onChange={(e) => handleStatusChange(feature.id, e.target.value)}
                          disabled={updating === feature.id}
                          className="px-2 py-1 bg-surface border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                        >
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDelete(feature.id)}
                          className="p-1.5 text-muted hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
