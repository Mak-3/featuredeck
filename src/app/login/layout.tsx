import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to your FeatureDeck account to manage feature requests and user feedback for your React Native app.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
