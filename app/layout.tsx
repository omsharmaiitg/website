import type { Metadata } from "next";
import {
  DM_Sans,
  Fraunces,
  IBM_Plex_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { CustomCursor } from "@/components/custom-cursor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Fraunces — display/headings. Loaded variable (wght + opsz) so it can render
// at weight 400 for headings and 300 for the hero intro line.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
});

// DM Sans — the big hero name only. Weight 300.
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-dm-sans",
});

// Plus Jakarta Sans — body / UI / captions. 400, plus 600 for prose <strong>.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jakarta",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Om Sharma",
    template: "%s — Om Sharma",
  },
  description:
    "First-year at IIT Guwahati. I build ML systems and web things.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-paper font-sans text-ink antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CustomCursor />
      </body>
    </html>
  );
}
