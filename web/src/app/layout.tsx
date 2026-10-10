import type { Metadata } from "next";
import "./globals.css";

// Fonts are loaded at runtime via <link>, not next/font/google.
// next/font/google fetches at BUILD time, which fails on Render.
const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
`;

export const metadata: Metadata = {
  title: "DonutSMP Trader — Live Market, Prices & Player Stats",
  description:
    "Live DonutSMP auction prices, price history, completed sales, leaderboards and server stats. Independent community data platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://mc-heads.net" />
        <link rel="dns-prefetch" href="https://mc-heads.net" />
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: FONTS }} />
        {children}
      </body>
    </html>
  );
}