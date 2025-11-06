import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Appily - The AI Development Platform for Non-Technical Builders",
  description: "Professional AI coding power with simple buttons. Build unlimited projects without learning git, terminal, or npm.",
  openGraph: {
    title: "Appily - The AI Development Platform for Non-Technical Builders",
    description: "Professional AI coding power with simple buttons. Build unlimited projects without learning git, terminal, or npm.",
    type: "website",
    url: "https://appily.dev",
    siteName: "Appily",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Appily - The AI Development Platform for Non-Technical Builders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Appily - The AI Development Platform for Non-Technical Builders",
    description: "Professional AI coding power with simple buttons. Build unlimited projects without learning git, terminal, or npm.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
