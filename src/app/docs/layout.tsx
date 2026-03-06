import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Learn how to integrate FeatureDeck into your React Native app. Step-by-step SDK setup, API reference, and usage examples.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Documentation | FeatureDeck",
    description:
      "Learn how to integrate FeatureDeck into your React Native app. Step-by-step SDK setup, API reference, and usage examples.",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
