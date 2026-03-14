import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-cabinet",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://featuredeck.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FeatureDeck - Feature Feedback for React Native",
    template: "%s | FeatureDeck",
  },
  description:
    "Collect feature requests, let users vote, and ship what matters. The feedback tool built natively for React Native apps.",
  keywords: [
    "React Native",
    "feature requests",
    "user feedback",
    "mobile app",
    "product roadmap",
    "in-app feedback",
    "feature voting",
    "product feedback",
    "React Native SDK",
    "user engagement",
  ],
  icons: {
    apple: "/apple-touch-icon.png",
  },
  authors: [{ name: "FeatureDeck" }],
  creator: "FeatureDeck",
  publisher: "FeatureDeck",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "FeatureDeck",
    title: "FeatureDeck - Feature Feedback for React Native",
    description:
      "Collect feature requests, let users vote, and ship what matters. The feedback tool built natively for React Native apps.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FeatureDeck - Feature Feedback for React Native",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FeatureDeck - Feature Feedback for React Native",
    description:
      "Collect feature requests, let users vote, and ship what matters. The feedback tool built natively for React Native apps.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
