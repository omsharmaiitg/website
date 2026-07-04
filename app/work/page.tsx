import type { Metadata } from "next";
import { WorkIndex } from "@/components/work-index";
import { loadWorkEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "work",
  description:
    "Three projects. Each one built around a problem I couldn’t ignore.",
};

export default async function WorkPage() {
  const entries = await loadWorkEntries();
  const cards = entries.map(({ slug, frontmatter }) => ({
    slug,
    number: String(frontmatter.order).padStart(2, "0"),
    title: frontmatter.title,
    tagline: frontmatter.tagline,
    tags: frontmatter.tags,
    motif: frontmatter.motif,
  }));

  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-16 md:py-20">
      <h1 className="text-title md:text-display">Work</h1>
      <p className="mt-5 text-xl italic text-ink-muted">
        Three projects. Each one built around a problem I couldn’t ignore.
      </p>
      <WorkIndex cards={cards} />
      <p className="prose mt-16 border-t border-hairline pt-8 italic">
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
  );
}
