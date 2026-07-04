import Link from "next/link";
import { AvatarHero } from "@/components/avatar-hero";
import { ScribbleUnderline } from "@/components/motifs";
import { loadMdx } from "@/lib/content";

type HomeFrontmatter = {
  name: string;
  tagline: string;
};

const heroLinks = [
  { href: "/work", label: "work", external: false },
  { href: "/now", label: "now", external: false },
  { href: "/about", label: "about", external: false },
  { href: "https://github.com/omsharmaiitg", label: "github", external: true },
];

export default async function HomePage() {
  const { content, frontmatter } = await loadMdx<HomeFrontmatter>("home.mdx");

  return (
    <section className="mx-auto grid w-full max-w-[880px] items-center gap-12 px-6 py-16 md:grid-cols-[minmax(0,1fr)_280px] md:gap-16 md:py-28">
      <div>
        <h1 className="hero-name">{frontmatter.name}</h1>
        <ScribbleUnderline className="mt-3 h-2.5 w-52 text-accent" />
        <p className="hero-intro mt-phi-2 text-subhead text-ink-muted">
          — {frontmatter.tagline}.
        </p>
        <div className="prose mt-phi-3">{content}</div>
        <nav className="mt-phi-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          {heroLinks.map((item, i) => (
            <span key={item.href} className="flex items-baseline gap-x-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-ink-muted">
                  ·
                </span>
              )}
              {item.external ? (
                <a
                  className="navlabel ulink"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link className="navlabel ulink" href={item.href}>
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* The Watcher — cursor-tracking 3D avatar (Phase 3). Explicit height so
          the canvas, which fills its wrapper at 100%, has a box to fill. */}
      <div id="avatar-slot" className="h-[380px] w-full md:h-[460px]">
        <AvatarHero />
      </div>
    </section>
  );
}
