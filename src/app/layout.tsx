import type { Metadata } from "next";
import { Rye, Special_Elite, Permanent_Marker } from "next/font/google";
import "./globals.css";

const rye = Rye({
  weight: "400",
  variable: "--font-rye",
  subsets: ["latin"],
  display: "swap",
});

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-special-elite",
  subsets: ["latin"],
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harsha Vardhan | The Code Slinger",
  description:
    "Portfolio of Harsha Vardhan Yellela - Backend Engineer, Cloud Architect, AI/ML Engineer. An interactive portfolio experience.",
  keywords: [
    "Harsha Vardhan Yellela",
    "Software Engineer",
    "Backend Developer",
    "Cloud Engineer",
    "DevOps",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: "Harsha Vardhan Yellela" }],
  creator: "Harsha Vardhan Yellela",
  openGraph: {
    title: "Harsha Vardhan | The Code Slinger",
    description: "Enter the world of a Code Slinger. Interactive portfolio experience.",
    url: "https://harsha-overdose.vercel.app",
    siteName: "Harsha Vardhan Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsha Vardhan | The Code Slinger",
    description: "Enter the world of a Code Slinger. Interactive portfolio experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${rye.variable} ${specialElite.variable} ${permanentMarker.variable} antialiased bg-[#1A1A1A] text-[#F4E4BC] min-h-screen`}
      >
        {/* Film Grain Overlay */}
        <div className="film-grain" aria-hidden="true" />

        {/* Scanlines */}
        <div className="scanlines" aria-hidden="true" />

        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
