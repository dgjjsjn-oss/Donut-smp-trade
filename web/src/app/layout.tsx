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
  metadataBase: new URL(process.env.SITE_URL ?? "https://donut-smp-trade.onrender.com"),
  title: "DonutSMP Trader — Live Market, Prices & Player Stats",
  description:
    "Live DonutSMP auction prices, price history, completed sales, leaderboards and server stats. Independent community data platform.",
  openGraph: {
    type: "website",
    siteName: "DonutSMP Trader",
    title: "DonutSMP Trader — Live Auction Market",
    description: "Live DonutSMP prices, completed sales and player stats, collected by our own bot.",
    images: [{ url: "/icon.svg", width: 512, height: 512, alt: "DonutSMP Trader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DonutSMP Trader",
    description: "Live DonutSMP prices, sales and player stats.",
    images: ["/icon.svg"],
  },
  robots: { index: true, follow: true },
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
        <a
          href="#main"
          className="num sr-only text-[12px] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:px-4 focus:py-2"
          style={{ background: "var(--gold)", color: "var(--bg)" }}
        >
          Skip to content
        </a>
        <div dangerouslySetInnerHTML={{ __html: FONTS }} />
        {children}
      </body>
    </html>
  );
}