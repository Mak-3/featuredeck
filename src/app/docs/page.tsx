"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = "tsx", id }: { code: string; language?: string; id: string }) => {
    const theme = isDarkMode ? vscDarkPlus : vs;

    return (
      <div className="relative group">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="absolute top-3 right-3 z-10 p-2 bg-background/90 backdrop-blur-sm border border-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted hover:text-foreground shadow-sm"
        >
          {copiedCode === id ? "✓ Copied" : "Copy"}
        </button>
        <div className="rounded-lg border border-border overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={theme}
            customStyle={{
              margin: 0,
              padding: '16px',
              fontSize: '14px',
              lineHeight: '1.6',
              background: isDarkMode ? '#1E293B' : '#FAFBFC',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            }}
            codeTagProps={{
              style: {
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                fontSize: '14px',
              }
            }}
            showLineNumbers={false}
            wrapLines={true}
            wrapLongLines={true}
            PreTag="div"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12">
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
            <h1 className="text-4xl font-medium mb-3">Documentation</h1>
            <p className="text-muted text-lg">
              Integrate FeatureDeck into your React Native app in minutes. Collect feature requests, 
              let users vote, and build what matters.
            </p>
          </div>

          <div className="space-y-16">
            {/* Installation */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Installation</h2>
              <p className="text-muted mb-6">
                Install the FeatureDeck React Native SDK using npm or yarn.
              </p>
              <CodeBlock
                id="install"
                code={`npm install @FeatureDeck/react-native
# or
yarn add @FeatureDeck/react-native`}
                language="bash"
              />
              <p className="text-sm text-muted mt-4">
                <strong>Peer Dependencies:</strong> Make sure you have <code className="bg-surface px-1.5 py-0.5 rounded text-xs">react</code>, <code className="bg-surface px-1.5 py-0.5 rounded text-xs">react-native</code>, <code className="bg-surface px-1.5 py-0.5 rounded text-xs">@supabase/supabase-js</code>, and <code className="bg-surface px-1.5 py-0.5 rounded text-xs">zustand</code> installed.
              </p>
            </section>

            {/* Quick Start */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Quick Start</h2>
              <p className="text-muted mb-6">
                Get up and running in 3 simple steps.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">1. Initialize the SDK</h3>
                  <p className="text-muted mb-4">
                    Initialize FeatureDeck in your app entry point (usually <code className="bg-surface px-1.5 py-0.5 rounded text-xs">App.tsx</code> or <code className="bg-surface px-1.5 py-0.5 rounded text-xs">index.js</code>).
                  </p>
                  <CodeBlock
                    id="init"
                    code={`import { FeatureDeck } from '@FeatureDeck/react-native';

// Initialize the SDK
await FeatureDeck.init({
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'your-anon-key',
  appKey: 'uo_pk_xxx', // Get this from your FeatureDeck dashboard
  user: {
    id: 'user-123',
    email: 'user@example.com',
    name: 'John Doe'
  }
});`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">2. Wrap Your App with Provider</h3>
                  <p className="text-muted mb-4">
                    Add the <code className="bg-surface px-1.5 py-0.5 rounded text-xs">FeatureDeckProvider</code> to your app root.
                  </p>
                  <CodeBlock
                    id="provider"
                    code={`import { FeatureDeckProvider } from '@FeatureDeck/react-native';

export default function App() {
  return (
    <FeatureDeckProvider>
      {/* Your app content */}
    </FeatureDeckProvider>
  );
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">3. Add Feedback Button</h3>
                  <p className="text-muted mb-4">
                    Add a floating feedback button anywhere in your app.
                  </p>
                  <CodeBlock
                    id="button"
                    code={`import { FeedbackButton } from '@FeatureDeck/react-native';

export default function HomeScreen() {
  return (
    <View>
      {/* Your screen content */}
      <FeedbackButton />
    </View>
  );
}`}
                  />
                </div>
              </div>
            </section>

            {/* Basic Usage */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Basic Usage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Opening the Feedback Board</h3>
                  <p className="text-muted mb-4">
                    Open the feedback board programmatically from anywhere in your app.
                  </p>
                  <CodeBlock
                    id="open"
                    code={`import { FeatureDeck } from '@FeatureDeck/react-native';

// Open the feedback board
FeatureDeck.open();

// Or use the alias
FeatureDeck.openBoard();`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Setting User Information</h3>
                  <p className="text-muted mb-4">
                    Update user information when users log in or their profile changes.
                  </p>
                  <CodeBlock
                    id="user"
                    code={`// When user logs in
FeatureDeck.setUser({
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://example.com/avatar.jpg'
});

// When user logs out
FeatureDeck.setUser(null);`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Custom Button Position</h3>
                  <p className="text-muted mb-4">
                    Customize the feedback button position and appearance.
                  </p>
                  <CodeBlock
                    id="custom-button"
                    code={`<FeedbackButton
  position="bottom-left" // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  offset={{ x: 20, y: 40 }}
  size={56}
  label="Feedback"
  showLabel={true}
/>`}
                  />
                </div>
              </div>
            </section>

            {/* Customization */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Customization</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Theme Customization</h3>
                  <p className="text-muted mb-4">
                    {"Customize colors, typography, spacing, and more to match your app's design."}
                  </p>
                  <CodeBlock
                    id="theme"
                    code={`// Initialize with custom theme
await FeatureDeck.init({
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'your-anon-key',
  appKey: 'uo_pk_xxx',
  theme: {
    colors: {
      primary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    isDark: false,
  }
});

// Or update theme later
FeatureDeck.setTheme({
  colors: {
    primary: '#10B981',
  },
  isDark: true,
});

// Quick theme helpers
FeatureDeck.enableDarkMode();
FeatureDeck.enableLightMode();`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Creating Custom Themes</h3>
                  <p className="text-muted mb-4">
                    Use theme utilities to create themes from a single color or merge themes.
                  </p>
                  <CodeBlock
                    id="custom-theme"
                    code={`import { 
  createThemeFromColor, 
  mergeTheme, 
  lightTheme 
} from '@FeatureDeck/react-native';

// Create theme from a single color
const customTheme = createThemeFromColor('#E85D04', false);

// Merge with default theme
const mergedTheme = mergeTheme(lightTheme, customTheme);

// Use in initialization
await FeatureDeck.init({
  // ... other config
  theme: mergedTheme,
});`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Custom Icon</h3>
                  <p className="text-muted mb-4">
                    Use your own icon for the feedback button.
                  </p>
                  <CodeBlock
                    id="custom-icon"
                    code={`import { FeedbackButton } from '@FeatureDeck/react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

<FeedbackButton
  icon={<Icon name="feedback" size={24} color="#FFFFFF" />}
/>`}
                  />
                </div>
              </div>
            </section>

            {/* Hooks */}
            <section>
              <h2 className="text-3xl font-medium mb-4">React Hooks</h2>
              <p className="text-muted mb-6">
                Use hooks to access features, comments, and state in your components.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Accessing Features</h3>
                  <CodeBlock
                    id="hooks-features"
                    code={`import { useFeatures, useFeature } from '@FeatureDeck/react-native';

function MyComponent() {
  // Get all features
  const features = useFeatures();
  
  // Get a specific feature
  const feature = useFeature('feature-id');
  
  return (
    <View>
      {features.map(feature => (
        <Text key={feature.id}>{feature.title}</Text>
      ))}
    </View>
  );
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Upvoting Features</h3>
                  <CodeBlock
                    id="hooks-upvote"
                    code={`import { useUpvote } from '@FeatureDeck/react-native';

function UpvoteButton({ featureId }: { featureId: string }) {
  const { upvotes, hasUpvoted, toggle } = useUpvote(featureId);
  
  return (
    <TouchableOpacity onPress={toggle}>
      <Text>{hasUpvoted ? '❤️' : '🤍'} {upvotes}</Text>
    </TouchableOpacity>
  );
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">SDK Actions</h3>
                  <CodeBlock
                    id="hooks-actions"
                    code={`import { useFeatureDeckActions } from '@FeatureDeck/react-native';

function MyComponent() {
  const { open, close, refresh, upvote } = useFeatureDeckActions();
  
  return (
    <View>
      <Button onPress={open} title="Open Feedback" />
      <Button onPress={refresh} title="Refresh" />
    </View>
  );
}`}
                  />
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section>
              <h2 className="text-3xl font-medium mb-4">API Reference</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">FeatureDeck.init()</h3>
                  <p className="text-muted mb-4">
                    Initialize the SDK with Supabase credentials and configuration.
                  </p>
                  <CodeBlock
                    id="api-init"
                    code={`FeatureDeck.init(config: FeatureDeckConfig): Promise<void>

interface FeatureDeckConfig {
  supabaseUrl: string;      // Your Supabase project URL
  supabaseKey: string;       // Your Supabase anon/public key
  appKey: string;            // Your app public key (e.g., "uo_pk_xxx")
  user?: User;               // Current user information
  theme?: Partial<Theme>;     // Custom theme configuration
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">FeatureDeck.open()</h3>
                  <p className="text-muted mb-4">
                    Open the feedback board modal.
                  </p>
                  <CodeBlock
                    id="api-open"
                    code={`FeatureDeck.open(): void
FeatureDeck.openBoard(): void  // Alias`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">FeatureDeck.setUser()</h3>
                  <p className="text-muted mb-4">
                    Set or update the current user. Call when user logs in or profile changes.
                  </p>
                  <CodeBlock
                    id="api-user"
                    code={`FeatureDeck.setUser(user: User | null): void

interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">FeatureDeck.setTheme()</h3>
                  <p className="text-muted mb-4">
                    Update the theme at runtime.
                  </p>
                  <CodeBlock
                    id="api-theme"
                    code={`FeatureDeck.setTheme(theme: Partial<Theme>): void
FeatureDeck.enableDarkMode(): void
FeatureDeck.enableLightMode(): void`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">FeatureDeck.openFeature()</h3>
                  <p className="text-muted mb-4">
                    Navigate directly to a specific feature.
                  </p>
                  <CodeBlock
                    id="api-feature"
                    code={`FeatureDeck.openFeature(featureId: string): void`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">FeatureDeck.upvote()</h3>
                  <p className="text-muted mb-4">
                    Programmatically upvote a feature.
                  </p>
                  <CodeBlock
                    id="api-upvote"
                    code={`FeatureDeck.upvote(featureId: string): Promise<void>`}
                  />
                </div>
              </div>
            </section>

            {/* Advanced Usage */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Advanced Usage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Filtering Features</h3>
                  <p className="text-muted mb-4">
                    Pre-filter features programmatically.
                  </p>
                  <CodeBlock
                    id="advanced-filters"
                    code={`FeatureDeck.setFilters({
  status: 'planned',
  category: 'feature',
  search: 'dark mode'
});`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Refreshing Data</h3>
                  <p className="text-muted mb-4">
                    Manually refresh features from Supabase.
                  </p>
                  <CodeBlock
                    id="advanced-refresh"
                    code={`await FeatureDeck.refresh();`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Checking SDK Status</h3>
                  <p className="text-muted mb-4">
                    Check if the SDK is initialized and ready to use.
                  </p>
                  <CodeBlock
                    id="advanced-status"
                    code={`if (FeatureDeck.isReady()) {
  FeatureDeck.open();
} else {
  console.warn('SDK not initialized');
}

const isVisible = FeatureDeck.isVisible();
const currentUser = FeatureDeck.getUser();`}
                  />
                </div>
              </div>
            </section>

            {/* Getting Your API Key */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Getting Your API Key</h2>
              <p className="text-muted mb-6">
                To use FeatureDeck, you need to:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-muted ml-4">
                <li>Create a project in your FeatureDeck dashboard</li>
                <li>Get your <code className="bg-surface px-1.5 py-0.5 rounded text-xs">appKey</code> from the project settings</li>
                <li>Set up your Supabase project and get your <code className="bg-surface px-1.5 py-0.5 rounded text-xs">supabaseUrl</code> and <code className="bg-surface px-1.5 py-0.5 rounded text-xs">supabaseKey</code></li>
                <li>Run the database schema in your Supabase SQL Editor</li>
              </ol>
            </section>

            {/* Support */}
            <section className="border-t border-border pt-8">
              <h2 className="text-3xl font-medium mb-4">Need Help?</h2>
              <p className="text-muted mb-4">
                {"If you have questions or run into issues, we're here to help:"}
              </p>
              <ul className="space-y-2 text-muted">
                <li>
                  📧 Email: <a href="mailto:support@featuredeck.in" className="text-accent hover:opacity-80 transition-opacity">support@featuredeck.in</a>
                </li>
                <li>
                  💬 GitHub: <a href="https://github.com/FeatureDeck/FeatureDeck-rn" className="text-accent hover:opacity-80 transition-opacity">github.com/FeatureDeck/FeatureDeck-rn</a>
                </li>
                <li>
                  📖 Examples: Check out the example app in the repository
                </li>
              </ul>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

