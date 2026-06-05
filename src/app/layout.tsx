import type { Metadata } from "next";
import { Inter, Instrument_Serif, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-edit",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono-code",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://har5ha.in"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  title: "Harsha Yellela — Full Stack Engineer @ teli.ai",
  description:
    "Full Stack Engineer building voice and SMS AI agents for the mortgage industry. The portfolio is a walkable knowledge graph. Search it, click any node, or step into /teli to watch a live mortgage call get qualified.",
  keywords: [
    "Harsha Yellela",
    "Full Stack Engineer",
    "AI Engineer",
    "ML Engineer",
    "Voice AI",
    "RAG",
    "LangChain",
    "teli.ai",
    "Portfolio",
    "Knowledge Graph",
  ],
  authors: [{ name: "Harsha Yellela" }],
  creator: "Harsha Yellela",
  openGraph: {
    title: "Harsha Yellela — Full Stack Engineer @ teli.ai",
    description: "A walkable knowledge graph of my work. /teli shows a live mortgage call being qualified by GPT-4o + Retell + ElevenLabs.",
    url: "https://har5ha.in",
    siteName: "Harsha Yellela",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsha Yellela — Full Stack Engineer @ teli.ai",
    description: "A walkable knowledge graph. /teli is a cinematic mortgage call.",
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
        className={`${inter.variable} ${instrumentSerif.variable} ${dmMono.variable} antialiased min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Harsha Vardhan Yellela",
              jobTitle: "Full Stack Engineer",
              affiliation: { "@type": "Organization", name: "teli.ai" },
              url: "https://har5ha.in",
              sameAs: [
                "https://linkedin.com/in/har5ha-7663",
                "https://github.com/HAR5HA-7663",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
