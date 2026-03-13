"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface FeatureRequest {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  project_id: string;
}

export default function DashboardContent() {
  const [metrics, setMetrics] = useState({
    users: 0,
    requests: 0,
    views: 0,
    upvotes: 0,
  });
  const [pendingRequests, setPendingRequests] = useState<FeatureRequest[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get selected project from localStorage or parent component
    const storedProjectId = localStorage.getItem('selectedProjectId');
    if (storedProjectId) {
      setSelectedProjectId(storedProjectId);
    }
    
    fetchDashboardData(storedProjectId);
    
    // Listen for project changes
    const handleProjectChange = (e: StorageEvent) => {
      if (e.key === 'selectedProjectId') {
        setSelectedProjectId(e.newValue);
        if (e.newValue) {
          fetchDashboardData(e.newValue);
        }
      }
    };
    
    window.addEventListener('storage', handleProjectChange);
    return () => window.removeEventListener('storage', handleProjectChange);
  }, []);

  const fetchDashboardData = async (projectId: string | null) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch feature requests (pending requests with status 'open')
      const featureRequestsResponse = await fetch(
        `/api/feedback?status=open${projectId ? `&project_id=${projectId}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (featureRequestsResponse.ok) {
        const featureRequestsData = await featureRequestsResponse.json();
        const requests = featureRequestsData.data || [];
        setPendingRequests(requests);
        setMetrics(prev => ({
          ...prev,
          requests: requests.length,
        }));
      }

      // Fetch metrics
      if (projectId) {
        // Get feature requests count
        const allRequestsResponse = await fetch(
          `/api/feedback?project_id=${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );

        if (allRequestsResponse.ok) {
          const allRequestsData = await allRequestsResponse.json();
          const allRequests = allRequestsData.data || [];
          
          // Calculate upvotes (sum of votes)
          const totalUpvotes = allRequests.reduce((sum: number, req: any) => {
            return sum + (req.votes?.[0]?.count || 0);
          }, 0);

          setMetrics(prev => ({
            ...prev,
            requests: allRequests.length,
            upvotes: totalUpvotes,
            views: allRequests.length, // Using requests as views for now
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      label: "Users",
      value: metrics.users,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <circle cx="17.5" cy="8.5" r="2.5" />
          <path d="M17.5 13c-1.5 0-2.5.5-2.5 1.5h5c0-1-.5-1.5-2.5-1.5z" />
        </svg>
      ),
    },
    {
      label: "Requests",
      value: metrics.requests,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
    {
      label: "Views",
      value: metrics.views,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: "Upvotes",
      value: metrics.upvotes,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 lg:ml-64 bg-surface min-h-screen">
      <div className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 lg:pl-0 pl-14">
          <h1 className="text-2xl sm:text-3xl font-medium text-foreground">Dashboard</h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/docs"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
          {metricCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-background border border-border rounded-lg p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">{card.label}</span>
                <div className="w-10 h-10 bg-[#1a1a1a] dark:bg-[#f5f5f3] rounded-full flex items-center justify-center text-white dark:text-[#1a1a1a]">
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-xl font-medium text-foreground mb-4">
            Pending requests ({pendingRequests.length})
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-muted">Loading requests...</p>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground font-medium mb-2">No pending requests</p>
              <p className="text-sm text-muted">
                As soon as your app users send feature requests, you will see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-surface border border-border rounded-lg hover:bg-background transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        {request.title}
                      </h3>
                      {request.description && (
                        <p className="text-xs text-muted line-clamp-2">
                          {request.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        request.status === 'open' 
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                          : request.status === 'in_progress'
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                          : 'bg-gray-500/10 text-gray-600 border border-gray-500/20'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {pendingRequests.length > 5 && (
                <p className="text-center text-sm text-muted pt-2">
                  Showing 5 of {pendingRequests.length} requests
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

