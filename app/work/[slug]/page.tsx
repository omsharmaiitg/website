import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DrapeLink } from "@/components/drape";
import { projectMdxComponents, SectionHeading } from "@/components/mdx";
import { WorkMotif } from "@/components/motifs";
import { listWorkSlugs, loadWorkEntries, loadWorkEntry } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await listWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = await loadWorkEntry(slug);
  if (!entry) return {};
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.subtitle,
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const entry = await loadWorkEntry(slug, projectMdxComponents);
  if (!entry) notFound();

  const { content, frontmatter } = entry;
  const entries = await loadWorkEntries();
  const index = entries.findIndex((e) => e.slug === slug);
  const prev = entries[(index - 1 + entries.length) % entries.length];
  const next = entries[(index + 1) % entries.length];

  return (
    <article className="mx-auto max-w-[880px] px-6 py-16 md:py-20">
      <DrapeLink href="/#work" className="navlabel ulink text-ink-muted">
        ← back to work
      </DrapeLink>
      <header className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_200px] md:items-start md:gap-14">
        <div className="min-w-0">
          <p className="navlabel text-ink-muted">
            {String(frontmatter.order).padStart(2, "0")} · {frontmatter.period}{" "}
            · {frontmatter.org}
          </p>
          <h1 className="mt-6 text-[clamp(2.5rem,6.5vw,var(--text-display))] leading-[1.02]">
            {frontmatter.title}
          </h1>
          <p className="hero-intro mt-6 text-subhead text-ink-muted">
            {frontmatter.tagline}
          </p>
          {(frontmatter.link || frontmatter.demo) && (
            <p className="mt-6 flex gap-5">
              {frontmatter.link && (
                <a
                  className="navlabel ulink text-accent"
                  href={frontmatter.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  github ↗
                </a>
              )}
              {frontmatter.demo && (
                <a
                  className="navlabel ulink text-accent"
                  href={frontmatter.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  live ↗
                </a>
              )}
            </p>
          )}
        </div>
        <WorkMotif
          name={frontmatter.motif}
          className="h-32 w-32 text-ink md:mt-4 md:h-[200px] md:w-[200px] md:justify-self-end"
        />
      </header>

      <div className="prose mt-4">{content}</div>

      <SectionHeading>stack</SectionHeading>
      <ul className="flex flex-wrap gap-2">
        {frontmatter.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-hairline px-3 py-1 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      <nav className="mt-16 flex items-baseline justify-between gap-6 border-t border-hairline pt-8">
        <DrapeLink className="navlabel ulink" href={`/work/${prev.slug}`}>
          ← {prev.frontmatter.title}
        </DrapeLink>
        <DrapeLink
          className="navlabel ulink text-right"
          href={`/work/${next.slug}`}
        >
          {next.frontmatter.title} →
        </DrapeLink>
      </nav>
    </article>
  );
}
