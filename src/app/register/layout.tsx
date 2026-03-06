import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a free FeatureDeck account. Start collecting feature requests and user feedback for your React Native app in minutes.",
  alternates: {
    canonical: "/register",
  },
  openGraph: {
    title: "Sign Up | FeatureDeck",
    description:
      "Create a free FeatureDeck account. Start collecting feature requests and user feedback for your React Native app in minutes.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
