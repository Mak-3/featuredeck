import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "FeatureDeck Terms of Service. Read our terms and conditions for using the FeatureDeck feature feedback platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
