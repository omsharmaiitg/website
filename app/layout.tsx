import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AvatarDock } from "@/components/avatar-dock";
import { CustomCursor } from "@/components/custom-cursor";
import { DrapeProvider } from "@/components/drape";
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
    "Sophomore at IIT Guwahati. I build ML systems and web things.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-paper font-sans text-ink antialiased">
        <DrapeProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <AvatarDock />
          <CustomCursor />
        </DrapeProvider>
      </body>
    </html>
  );
}
