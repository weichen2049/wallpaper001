import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AI Wallpaper Generator - Create Stunning Wallpapers with AI",
  description: "Create unique, high-quality wallpapers in seconds using advanced AI technology. Choose from multiple themes and styles including realistic, anime, cyberpunk, and more. Free AI wallpaper generator powered by Stable Diffusion 3.",
  keywords: ["AI wallpaper", "wallpaper generator", "AI art", "stable diffusion", "custom wallpaper", "AI image generator", "free wallpaper"],
  authors: [{ name: "aggiii.com" }],
  creator: "aggiii.com",
  publisher: "aggiii.com",
  openGraph: {
    title: "AI Wallpaper Generator - Create Stunning Wallpapers with AI",
    description: "Transform your ideas into stunning wallpapers with the power of artificial intelligence. Free, fast, and unlimited generations.",
    url: "https://aggiii.com",
    siteName: "AI Wallpaper Generator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Wallpaper Generator - Create Stunning Wallpapers with AI",
    description: "Create unique, high-quality wallpapers in seconds using advanced AI technology.",
    creator: "@aggiii",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
