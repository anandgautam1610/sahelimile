import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D9488",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sahelimile.vercel.app"),
  title: {
    default: "SaheliMile — Safe, Shared Last-Mile Commutes for Women",
    template: "%s | SaheliMile",
  },
  description:
    "SaheliMile connects verified women commuters exiting transit hubs along overlapping routes with community-vouched autos and automated Safe-Drop Handshake.",
  keywords: [
    "women safety",
    "last-mile commute",
    "shared auto",
    "Bhopal transit",
    "safe commute",
    "CityFix Buildathon",
    "women shared mobility",
  ],
  authors: [{ name: "SaheliMile Team" }],
  creator: "SaheliMile Team",
  publisher: "SaheliMile",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SaheliMile",
  },
  openGraph: {
    title: "SaheliMile — Safe, Shared Last-Mile Commutes for Women",
    description:
      "Smart transit-hub pairing for women commuters with community-vouched autos and automated Safe-Drop Handshake.",
    url: "https://sahelimile.vercel.app",
    siteName: "SaheliMile",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaheliMile — Safe, Shared Last-Mile Commutes for Women",
    description:
      "Connecting verified women commuters exiting transit hubs along overlapping corridors with 50% fare split.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#0D9488" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-[#FFFBEB] text-[#0F172A] antialiased selection:bg-[#0D9488]/20 selection:text-[#0D9488]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
