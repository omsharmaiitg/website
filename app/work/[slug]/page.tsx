import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <article className="mx-auto max-w-[720px] px-6 py-16 md:py-20">
      <Link href="/#work" className="navlabel ulink text-ink-muted">
        ← back to work
      </Link>
      <header className="mt-8 md:flex md:items-start md:justify-between md:gap-10">
        <div className="min-w-0">
          <p className="navlabel text-ink-muted">
            {String(frontmatter.order).padStart(2, "0")} · {frontmatter.period}{" "}
            · {frontmatter.org}
          </p>
          <h1 className="mt-4 text-title">{frontmatter.title}</h1>
          <p className="mt-4 text-xl italic text-ink-muted">
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
          className="mt-8 h-24 w-24 md:mt-2 md:h-36 md:w-36 md:shrink-0"
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
        <Link className="navlabel ulink" href={`/work/${prev.slug}`}>
          ← {prev.frontmatter.title}
        </Link>
        <Link
          className="navlabel ulink text-right"
          href={`/work/${next.slug}`}
        >
          {next.frontmatter.title} →
        </Link>
      </nav>
    </article>
  );
}
