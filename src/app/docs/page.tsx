"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
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

  const CodeBlock = ({
    code,
    language = "tsx",
    id,
  }: {
    code: string;
    language?: string;
    id: string;
  }) => {
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
              padding: "16px",
              fontSize: "14px",
              lineHeight: "1.6",
              background: isDarkMode ? "#1E293B" : "#FAFBFC",
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            }}
            codeTagProps={{
              style: {
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                fontSize: "14px",
              },
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
              Integrate FeatureDeck into your React Native app in minutes.
              Collect feature requests, let users vote, view a roadmap, and
              build what matters.
            </p>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="text-3xl font-medium mb-4">Requirements</h2>
              <ul className="text-muted space-y-2">
                <li>• React Native 0.72 or newer</li>
                <li>• React 18+</li>
                <li>• Expo supported</li>
                <li>• iOS and Android supported</li>
              </ul>
            </section>
            {/* Installation */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Installation</h2>
              <p className="text-muted mb-6">
                Install the FeatureDeck React Native SDK using your preferred
                package manager.
              </p>

              <div className="space-y-6">
                {/* npm */}
                <div>
                  <p className="text-sm text-muted mb-2 font-medium">
                    Using npm
                  </p>
                  <CodeBlock
                    id="install-npm"
                    code={`npm install @featuredeck/react-native`}
                    language="bash"
                  />
                </div>

                {/* yarn */}
                <div>
                  <p className="text-sm text-muted mb-2 font-medium">
                    Using yarn
                  </p>
                  <CodeBlock
                    id="install-yarn"
                    code={`yarn add @featuredeck/react-native`}
                    language="bash"
                  />
                </div>

                {/* pnpm */}
                <div>
                  <p className="text-sm text-muted mb-2 font-medium">
                    Using pnpm
                  </p>
                  <CodeBlock
                    id="install-pnpm"
                    code={`pnpm add @featuredeck/react-native`}
                    language="bash"
                  />
                </div>
              </div>

              {/* Peer Dependencies */}
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-3">
                  Install Peer Dependency
                </h3>

                <p className="text-muted mb-4">
                  FeatureDeck uses{" "}
                  <code className="bg-surface px-1.5 py-0.5 rounded text-xs">
                    zustand
                  </code>{" "}
                  for internal state management. If your project does not
                  already include it, install it using:
                </p>

                <CodeBlock
                  id="install-zustand"
                  code={`npm install zustand`}
                  language="bash"
                />

                <p className="text-xs text-muted mt-3">
                  If your project already uses Zustand, you can skip this step.
                </p>
              </div>
            </section>

            {/* Quick Start */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Quick Start</h2>
              <p className="text-muted mb-6">
                Get up and running in 3 simple steps.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">
                    1. Initialize the SDK
                  </h3>
                  <p className="text-muted mb-4">
                    Initialize FeatureDeck in your app entry point (usually{" "}
                    <code className="bg-surface px-1.5 py-0.5 rounded text-xs">
                      App.tsx
                    </code>
                    ). You get your API key from the FeatureDeck dashboard.
                  </p>
                  <CodeBlock
                    id="init"
                    code={`import { FeatureDeck } from '@featuredeck/react-native';

// Initialize the SDK
await FeatureDeck.init({
  apiKey: 'your-api-key', // Get this from your FeatureDeck dashboard
});

// Identify the current user
await FeatureDeck.setUser({
  externalUserId: 'user-123',
  username: 'johndoe',
  email: 'john@example.com',
});`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">
                    2. Wrap Your App with the Provider
                  </h3>
                  <p className="text-muted mb-4">
                    Add the{" "}
                    <code className="bg-surface px-1.5 py-0.5 rounded text-xs">
                      FeatureDeckProvider
                    </code>{" "}
                    to your app root. This renders the feedback board modal.
                  </p>
                  <CodeBlock
                    id="provider"
                    code={`import { FeatureDeckProvider } from '@featuredeck/react-native';

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
                  <h3 className="text-xl font-medium mb-3">
                    3. Open the Feature Board
                  </h3>
                  <p className="text-muted mb-4">
                    Open the feature board from anywhere in your app — a button,
                    menu item, or settings screen.
                  </p>
                  <CodeBlock
                    id="open-board"
                    code={`import { FeatureDeck } from '@featuredeck/react-native';

function SettingsScreen() {
  return (
    <View>
      <TouchableOpacity onPress={() => FeatureDeck.openFeatureBoard()}>
        <Text>Feature Requests</Text>
      </TouchableOpacity>
    </View>
  );
}`}
                  />
                </div>
              </div>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-3xl font-medium mb-4">{"What's Included"}</h2>
              <p className="text-muted mb-6">
                The SDK opens a full-screen modal with two tabs and built-in
                functionality:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-5">
                  <div className="text-lg font-medium mb-2">
                    💡 Features Tab
                  </div>
                  <ul className="text-muted text-sm space-y-1.5">
                    <li>• Browse all feature requests</li>
                    <li>• Upvote features with optimistic UI</li>
                    <li>• Submit new feature requests</li>
                    <li>• Delete features you created</li>
                    <li>• Pull-to-refresh &amp; infinite scroll</li>
                  </ul>
                </div>
                <div className="border border-border rounded-lg p-5">
                  <div className="text-lg font-medium mb-2">🗺️ Roadmap Tab</div>
                  <ul className="text-muted text-sm space-y-1.5">
                    <li>• View planned, in-progress, and completed items</li>
                    <li>• Grouped by status with clear labels</li>
                    <li>• Pull-to-refresh for latest updates</li>
                    <li>• Powered by FeatureDeck branding</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Management */}
            <section>
              <h2 className="text-3xl font-medium mb-4">User Management</h2>
              <p className="text-muted mb-6">
                Users must be identified to submit features, vote, and delete
                their own requests.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Setting the User</h3>
                  <p className="text-muted mb-4">
                    Call{" "}
                    <code className="bg-surface px-1.5 py-0.5 rounded text-xs">
                      setUser
                    </code>{" "}
                    after authentication. The{" "}
                    <code className="bg-surface px-1.5 py-0.5 rounded text-xs">
                      externalUserId
                    </code>{" "}
                    is required — it links the user in your system to
                    FeatureDeck.
                  </p>
                  <CodeBlock
                    id="set-user"
                    code={`// When user logs in
await FeatureDeck.setUser({
  externalUserId: 'user-123',  // Required — your app's user ID
  username: 'johndoe',         // Optional
  email: 'john@example.com',   // Optional
});

// When user logs out
await FeatureDeck.setUser(null);`}
                  />
                </div>
              </div>
            </section>

            {/* Customization */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Customization</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">
                    Theme Customization
                  </h3>
                  <p className="text-muted mb-4">
                    {
                      "Customize colors to match your app's design. Pass a theme during initialization or update it later."
                    }
                  </p>
                  <CodeBlock
                    id="theme"
                    code={`// Initialize with a custom theme
await FeatureDeck.init({
  apiKey: 'your-api-key',
  theme: {
    colors: {
      primary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    isDark: false,
  },
});

// Or update theme at runtime
FeatureDeck.setTheme({
  colors: {
    primary: '#10B981',
  },
  isDark: true,
});

// Quick dark/light mode toggles
FeatureDeck.enableDarkMode();
FeatureDeck.enableLightMode();`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">Theme Utilities</h3>
                  <p className="text-muted mb-4">
                    Use built-in helpers to create themes from a single color or
                    merge themes.
                  </p>
                  <CodeBlock
                    id="theme-utils"
                    code={`import {
  createThemeFromColor,
  mergeTheme,
  lightTheme,
  darkTheme,
} from '@featuredeck/react-native';

// Generate a full theme from a single primary color
const customTheme = createThemeFromColor('#E85D04', false);

// Merge with the default light theme
const merged = mergeTheme(lightTheme, customTheme);

await FeatureDeck.init({
  apiKey: 'your-api-key',
  theme: merged,
});`}
                  />
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section>
              <h2 className="text-3xl font-medium mb-4">API Reference</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">
                    FeatureDeck.init(config)
                  </h3>
                  <p className="text-muted mb-4">
                    Initialize the SDK. Must be called before any other method.
                  </p>
                  <CodeBlock
                    id="api-init"
                    code={`FeatureDeck.init(config: FeatureDeckConfig): Promise<void>

interface FeatureDeckConfig {
  apiKey: string;            // Your project API key
  theme?: Partial<Theme>;    // Optional custom theme
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">
                    FeatureDeck.setUser(user)
                  </h3>
                  <p className="text-muted mb-4">
                    Identify the current end user. Required for voting,
                    creating, and deleting features.
                  </p>
                  <CodeBlock
                    id="api-set-user"
                    code={`FeatureDeck.setUser(user: UserInput | null): Promise<void>

interface UserInput {
  externalUserId: string;  // Required — your app's user ID
  username?: string;
  email?: string;
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">
                    FeatureDeck.openFeatureBoard()
                  </h3>
                  <p className="text-muted mb-4">
                    Open the feature board modal. Shows the Features and Roadmap
                    tabs.
                  </p>
                  <CodeBlock
                    id="api-open"
                    code={`FeatureDeck.openFeatureBoard(): void`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">
                    FeatureDeck.close()
                  </h3>
                  <p className="text-muted mb-4">
                    Programmatically close the modal.
                  </p>
                  <CodeBlock
                    id="api-close"
                    code={`FeatureDeck.close(): void`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">
                    FeatureDeck.setTheme(theme)
                  </h3>
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
                  <h3 className="text-xl font-medium mb-3">Utility Methods</h3>
                  <CodeBlock
                    id="api-utils"
                    code={`FeatureDeck.isReady(): boolean    // Has init() completed?
FeatureDeck.isVisible(): boolean   // Is the modal currently open?
FeatureDeck.getUser(): User | null // Get the current user`}
                  />
                </div>
              </div>
            </section>

            {/* Full Example */}
            <section>
              <h2 className="text-3xl font-medium mb-4">Full Example</h2>
              <p className="text-muted mb-6">
                A complete example wiring everything together in a React Native
                app.
              </p>
              <CodeBlock
                id="full-example"
                code={`import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  FeatureDeck,
  FeatureDeckProvider,
} from '@featuredeck/react-native';

async function bootstrap() {
  await FeatureDeck.init({ apiKey: 'your-api-key' });

  await FeatureDeck.setUser({
    externalUserId: 'user-123',
    username: 'johndoe',
    email: 'john@example.com',
  });
}

export default function App() {
  useEffect(() => {
    bootstrap();
  }, []);

  return (
    <FeatureDeckProvider>
      <View style={styles.container}>
        <Text style={styles.title}>My App</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => FeatureDeck.openFeatureBoard()}
        >
          <Text style={styles.buttonText}>Feature Requests</Text>
        </TouchableOpacity>
      </View>
    </FeatureDeckProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});`}
              />
            </section>

            {/* Getting Your API Key */}
            <section>
              <h2 className="text-3xl font-medium mb-4">
                Getting Your API Key
              </h2>
              <p className="text-muted mb-6">
                To use FeatureDeck, you need an API key:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-muted ml-4">
                <li>
                  Sign up and create a project in the{" "}
                  <Link
                    href="/login"
                    className="text-accent hover:opacity-80 transition-opacity"
                  >
                    FeatureDeck dashboard
                  </Link>
                </li>
                <li>Navigate to your project settings</li>
                <li>
                  Copy the API key and pass it to{" "}
                  <code className="bg-surface px-1.5 py-0.5 rounded text-xs">
                    FeatureDeck.init()
                  </code>
                </li>
              </ol>
            </section>

            {/* Support */}
            <section className="border-t border-border pt-8">
              <h2 className="text-3xl font-medium mb-4">Need Help?</h2>
              <p className="text-muted mb-4">
                {
                  "If you have questions or run into issues, we're here to help:"
                }
              </p>
              <ul className="space-y-2 text-muted">
                <li>
                  📧 Email:{" "}
                  <a
                    href="mailto:featuredeck.support@gmail.com"
                    className="text-accent hover:opacity-80 transition-opacity"
                  >
                    featuredeck.support@gmail.com
                  </a>
                </li>
                <li>
                  💬 GitHub:{" "}
                  <a
                    href="https://github.com/Mak-3/featuredeck-react-native"
                    className="text-accent hover:opacity-80 transition-opacity"
                  >
                    https://github.com/Mak-3/featuredeck-react-native
                  </a>
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
