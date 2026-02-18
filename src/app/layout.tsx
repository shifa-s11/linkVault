import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import ParticleBackground from "@/components/ParticleBackground";

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
    default: 'LinkVault',
    template: '%s | LinkVault',
  },
  description:
    'LinkVault is a modern real-time bookmark manager built with Next.js and Supabase.',
  keywords: [
    'Bookmark Manager',
    'Next.js',
    'Supabase',
    'Realtime App',
    'Link Organizer',
  ],
  authors: [{ name: 'Shifa Saeed' }],
  creator: 'Shifa Saeed',
  openGraph: {
    title: 'LinkVault',
    description:
      'A modern, real-time bookmark manager built with Next.js and Supabase.',
    url: 'https://your-vercel-url.vercel.app',
    siteName: 'LinkVault',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkVault',
    description:
      'A modern real-time bookmark manager built with Next.js and Supabase.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}


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
       <ParticleBackground/>
        {children}
          <Toaster position="top-right" richColors />

      </body>
    </html>
  );
}
