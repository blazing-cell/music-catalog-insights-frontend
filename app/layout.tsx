import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TuneInsights",
    template: "%s | TuneInsights",
  },
  description:
    "Discover your music. Track your library. Understand your listening.",
  applicationName: "TuneInsights",
  keywords: [
    "music",
    "music library",
    "music analytics",
    "music insights",
    "AI music recommendations",
    "TuneInsights",
  ],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100">
        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}