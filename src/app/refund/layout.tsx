import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "FeatureDeck Refund Policy. Learn about our refund process and policy for paid plans.",
  alternates: {
    canonical: "/refund",
  },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
