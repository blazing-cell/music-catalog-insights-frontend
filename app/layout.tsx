import type { Metadata } from "next";
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
title: "TuneInsights",
description:
"Discover your music. Track your library. Understand your listening.",
icons: {
icon: [
{
url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2310b981'/><text x='50' y='68' font-size='55' text-anchor='middle'>♫</text></svg>",
type: "image/svg+xml",
},
],
},
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
> <body className="min-h-full flex flex-col">
{children}

            <Toaster
                position="top-center"
                richColors
            />
        </body>
    </html>
);


}
