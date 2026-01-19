import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitBase - Split Bills on Base",
  description:
    "Split bills, track expenses, and settle up with friends using USDC on Base. Fast, low-cost, and social.",
  openGraph: {
    title: "SplitBase - Split Bills on Base",
    description:
      "The easiest way to split bills with friends using USDC on Base blockchain.",
    type: "website",
  },
  other: {
    "base:app_id": "696de9e7c0ab25addaaaf56c",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="696de9e7c0ab25addaaaf56c" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
