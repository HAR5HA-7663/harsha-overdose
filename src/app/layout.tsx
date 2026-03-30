import type { Metadata } from "next";
import { Rye, Special_Elite, Permanent_Marker, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://har5ha.in"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  title: "Harsha Yellela | The Code Slinger",
  description:
    "Harsha Yellela — Backend & AI Engineer. 3 years building production systems for Ferrari, Boeing, Triumph. AWS, Python, Go, Kubernetes.",
  keywords: [
    "Harsha Yellela",
    "Software Engineer",
    "Backend Developer",
    "Cloud Engineer",
    "DevOps",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: "Harsha Yellela" }],
  creator: "Harsha Yellela",
  openGraph: {
    title: "Harsha Yellela | The Code Slinger",
    description: "Enter the world of a Code Slinger. Interactive portfolio experience.",
    url: "https://har5ha.in",
    siteName: "Harsha Yellela Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsha Yellela | The Code Slinger",
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
        className={`${rye.variable} ${specialElite.variable} ${permanentMarker.variable} ${inter.variable} antialiased bg-[#1A1A1A] text-[#F4E4BC] min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Harsha Vardhan Yellela",
              jobTitle: "Backend & AI Engineer",
              url: "https://har5ha.in",
              sameAs: [
                "https://linkedin.com/in/har5ha-7663",
                "https://github.com/HAR5HA-7663",
              ],
            }),
          }}
        />
        <Providers>
          {/* Film Grain Overlay */}
          <div className="film-grain" aria-hidden="true" />

          {/* Scanlines */}
          <div className="scanlines" aria-hidden="true" />

          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
