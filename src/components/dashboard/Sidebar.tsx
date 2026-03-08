"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch projects');

      const result = await response.json();
      setProjects(result.data || []);
      
      // Set first project as selected if available and no project is currently selected
      const currentSelected = localStorage.getItem('selectedProjectId');
      if (result.data && result.data.length > 0) {
        if (!currentSelected) {
          setSelectedProject(result.data[0].id);
          localStorage.setItem('selectedProjectId', result.data[0].id);
        } else if (result.data.find((p: Project) => p.id === currentSelected)) {
          setSelectedProject(currentSelected);
        } else {
          // Selected project no longer exists, select first one
          setSelectedProject(result.data[0].id);
          localStorage.setItem('selectedProjectId', result.data[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProject.name,
          slug: generateSlug(newProject.name),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const result = await response.json();

      await fetchProjects();

      if (result.data) {
        setSelectedProject(result.data.id);
        localStorage.setItem('selectedProjectId', result.data.id);
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'selectedProjectId',
          newValue: result.data.id
        }));

        if (result.data.api_key) {
          setCreatedApiKey(result.data.api_key);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { name: "Features", href: "/dashboard/features", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { name: "Settings", href: "/dashboard/settings", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-md text-foreground"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`w-64 bg-background border-r border-border flex flex-col h-screen fixed left-0 top-0 z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex items-center justify-center">
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
          <span className="font-medium text-[15px] text-foreground">FeatureDeck</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-1 text-muted hover:text-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard") || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-surface text-foreground shadow-sm"
                      : "text-muted hover:text-foreground hover:bg-surface/50"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Upgrade Plan
        </button>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-muted">Project</label>
            <button
              onClick={() => {
                setCreatedApiKey(null);
                setNewProject({ name: "" });
                setError(null);
                setIsCreateModalOpen(true);
              }}
              className="text-xs text-accent hover:opacity-80 transition-opacity font-medium"
              title="Create new project"
            >
              + New
            </button>
          </div>
          <div className="relative">
            {isLoading ? (
              <div className="w-full pl-10 pr-8 py-2 bg-background border border-border rounded-md text-sm flex items-center">
                <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-muted">Loading...</span>
              </div>
            ) : (
              <>
                <select
                  value={selectedProject}
                  onChange={(e) => {
                    setSelectedProject(e.target.value);
                    localStorage.setItem('selectedProjectId', e.target.value);
                    // Dispatch event to notify other components
                    window.dispatchEvent(new StorageEvent('storage', {
                      key: 'selectedProjectId',
                      newValue: e.target.value
                    }));
                  }}
                  className="w-full pl-10 pr-8 py-2 bg-background border border-border rounded-md text-sm font-medium text-foreground appearance-none hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  {projects.length === 0 ? (
                    <option value="">No projects</option>
                  ) : (
                    projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  {selectedProject && projects.find(p => p.id === selectedProject) ? (
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {projects.find(p => p.id === selectedProject)?.name.charAt(0).toUpperCase() || 'N'}
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      N
                    </div>
                  )}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>

    {/* Create Project Modal */}
    <AnimatePresence>
      {isCreateModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {createdApiKey ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium text-foreground">Project Created</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                        Your API key (copy it now — it won&apos;t be shown again):
                      </p>
                      <div className="flex items-center gap-2 p-2 bg-surface rounded border border-border">
                        <code className="flex-1 text-xs font-mono text-foreground break-all">
                          {createdApiKey}
                        </code>
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(createdApiKey);
                          }}
                          className="px-2 py-1 text-xs font-medium bg-background border border-border rounded hover:bg-surface transition-colors flex-shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCreatedApiKey(null);
                        setNewProject({ name: "" });
                        setIsCreateModalOpen(false);
                      }}
                      className="w-full px-4 py-2.5 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                      Done
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium text-foreground">Create New Project</h2>
                    <button
                      onClick={() => setIsCreateModalOpen(false)}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <label htmlFor="project-name" className="block text-sm font-medium mb-1.5">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="project-name"
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        required
                        minLength={2}
                        maxLength={100}
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder="My Awesome Project"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="flex-1 px-4 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-surface transition-colors"
                        disabled={isCreating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating || !newProject.name.trim()}
                        className="flex-1 px-4 py-2.5 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCreating ? "Creating..." : "Create Project"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}