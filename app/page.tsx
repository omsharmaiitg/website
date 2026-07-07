import { DeskMotif, SparklineMotif } from "@/components/motifs";
import { WorkIndex } from "@/components/work-index";
import { loadMdx, loadWorkEntries } from "@/lib/content";

type HomeFrontmatter = { name: string; tagline: string };
type NowBlock = { label: string; body: string };
type NowFrontmatter = { updated: string; blocks: NowBlock[] };

// Each section clears the sticky nav when jumped to.
const sectionClass = "mx-auto w-full max-w-[1120px] scroll-mt-24 px-6";

// Section eyebrow: "01 — About" then a hairline rule filling the row, with an
// optional right-aligned meta note (used for /now's "last updated").
function NumberedRule({
  n,
  label,
  right,
}: {
  n: string;
  label: string;
  right?: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <p className="navlabel shrink-0 whitespace-nowrap text-ink-muted">
        {n} — {label}
      </p>
      <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
      {right && (
        <p className="navlabel shrink-0 whitespace-nowrap text-ink-muted">
          {right}
        </p>
      )}
    </div>
  );
}

export default async function HomePage() {
  const home = await loadMdx<HomeFrontmatter>("home.mdx");
  const about = await loadMdx("about.mdx");
  const now = await loadMdx<NowFrontmatter>("now.mdx");
  const entries = await loadWorkEntries();
  const cards = entries.map(({ slug, frontmatter }) => ({
    slug,
    number: String(frontmatter.order).padStart(2, "0"),
    year: /\d{4}/.exec(frontmatter.period)?.[0] ?? "",
    title: frontmatter.title,
    tagline: frontmatter.tagline,
    tags: frontmatter.tags,
    motif: frontmatter.motif,
  }));

  return (
    <>
      {/* ── Intro ─────────────────────────────────────────────── */}
      <section
        id="intro"
        className={`${sectionClass} relative flex min-h-[92vh] flex-col justify-center py-24`}
      >
        <div className="max-w-[640px]">
          <p className="font-display text-subhead text-ink-muted">
            Hello, this is
          </p>
          <h1 className="hero-name mt-2">{home.frontmatter.name}</h1>
          <p className="hero-intro mt-8 max-w-[34ch] text-subhead text-ink-muted">
            — {home.frontmatter.tagline}.
          </p>
          <div className="prose mt-6">{home.content}</div>
        </div>
        <p className="navlabel absolute bottom-7 left-6 text-ink-muted">
          scroll ↓
        </p>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section id="about" className={`${sectionClass} py-28 md:py-32`}>
        <NumberedRule n="01" label="About" />
        <div className="mt-16 grid gap-12 md:grid-cols-[minmax(0,1fr)_220px] md:items-start md:gap-16">
          <div className="prose max-w-[58ch]">{about.content}</div>
          <figure className="m-0 md:pt-2">
            <DeskMotif className="h-auto w-full text-ink" />
            <figcaption className="navlabel mt-3 block text-center text-ink-muted">
              the desk, most nights
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Work ──────────────────────────────────────────────── */}
      <section id="work" className={`${sectionClass} py-28 md:py-32`}>
        <NumberedRule n="02" label="Work" />
        <h2 className="mt-14 text-[clamp(2.75rem,7vw,var(--text-display))] leading-none">
          Work
        </h2>
        <p className="hero-intro mt-6 text-subhead text-ink-muted">
          Three projects. Each one built around a problem I couldn’t ignore.
        </p>
        <WorkIndex cards={cards} />
        <p className="prose mt-14 italic text-ink-muted">
          More experiments live on{" "}
          <a
            href="https://github.com/omsharmaiitg"
            target="_blank"
            rel="noreferrer"
            className="text-ink"
          >
            GitHub →
          </a>
        </p>
      </section>

      {/* ── Now ───────────────────────────────────────────────── */}
      <section id="now" className={`${sectionClass} py-28 md:py-32`}>
        <NumberedRule
          n="03"
          label="Now"
          right={`Last updated: ${now.frontmatter.updated}`}
        />
        <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-0">
          {now.frontmatter.blocks.map((block, i) => (
            <div
              key={block.label}
              className={
                i === 0
                  ? "sm:pr-10"
                  : "sm:border-l sm:border-hairline sm:px-10 sm:last:pr-0"
              }
            >
              <p className="navlabel text-ink">{block.label}</p>
              <p className="mt-5 text-body leading-relaxed">{block.body}</p>
            </div>
          ))}
        </div>
        <SparklineMotif className="mt-14 h-6 w-[72px] text-ink" />
      </section>
    </>
  );
}
