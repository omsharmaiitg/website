import { DeskMotif, ScribbleUnderline, SparklineMotif } from "@/components/motifs";
import { WorkIndex } from "@/components/work-index";
import { loadMdx, loadWorkEntries } from "@/lib/content";

type HomeFrontmatter = { name: string; tagline: string };
type NowFrontmatter = { updated: string };

// Each section clears the sticky nav when jumped to.
const sectionClass = "mx-auto w-full max-w-[1080px] scroll-mt-24 px-6";

export default async function HomePage() {
  const home = await loadMdx<HomeFrontmatter>("home.mdx");
  const about = await loadMdx("about.mdx");
  const now = await loadMdx<NowFrontmatter>("now.mdx");
  const entries = await loadWorkEntries();
  const cards = entries.map(({ slug, frontmatter }) => ({
    slug,
    number: String(frontmatter.order).padStart(2, "0"),
    title: frontmatter.title,
    tagline: frontmatter.tagline,
    tags: frontmatter.tags,
    motif: frontmatter.motif,
    link: frontmatter.link,
    demo: frontmatter.demo,
  }));

  return (
    <>
      {/* ── Intro ─────────────────────────────────────────────── */}
      <section
        id="intro"
        className={`${sectionClass} flex min-h-[88vh] flex-col justify-center py-20`}
      >
        <div className="max-w-[560px]">
          <p className="font-display text-subhead text-ink-muted">
            Hello, this is
          </p>
          <h1 className="hero-name mt-1">{home.frontmatter.name}</h1>
          <ScribbleUnderline className="mt-3 h-2.5 w-52 text-accent" />
          <p className="hero-intro mt-phi-2 text-subhead text-ink-muted">
            — {home.frontmatter.tagline}.
          </p>
          <div className="prose mt-phi-3">{home.content}</div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section
        id="about"
        className={`${sectionClass} border-t border-hairline py-20 md:py-28`}
      >
        <div className="flex items-end justify-between gap-6">
          <p className="navlabel text-ink-muted">about</p>
          <DeskMotif className="mb-1 h-14 w-24 shrink-0" />
        </div>
        <div className="prose mt-8 max-w-[680px]">{about.content}</div>
      </section>

      {/* ── Work ──────────────────────────────────────────────── */}
      <section
        id="work"
        className={`${sectionClass} border-t border-hairline py-20 md:py-28`}
      >
        <p className="navlabel text-ink-muted">work</p>
        <h2 className="mt-4 text-title md:text-display">Work</h2>
        <p className="mt-5 text-subhead italic text-ink-muted">
          Three projects. Each one built around a problem I couldn’t ignore.
        </p>
        <WorkIndex cards={cards} />
        <p className="prose mt-16 italic">
          More experiments live on{" "}
          <a
            href="https://github.com/omsharmaiitg"
            target="_blank"
            rel="noreferrer"
          >
            GitHub →
          </a>
        </p>
      </section>

      {/* ── Now ───────────────────────────────────────────────── */}
      <section
        id="now"
        className={`${sectionClass} border-t border-hairline py-20 md:py-28`}
      >
        <div className="flex items-end justify-between gap-6">
          <p className="navlabel text-ink-muted">now</p>
          <SparklineMotif className="mb-2 h-6 w-[72px] shrink-0" />
        </div>
        <h2 className="mt-4 text-title">now</h2>
        <p className="meta mt-4 uppercase tracking-[0.08em]">
          Last updated: {now.frontmatter.updated}
        </p>
        <div className="prose mt-8 max-w-[680px]">{now.content}</div>
      </section>
    </>
  );
}
