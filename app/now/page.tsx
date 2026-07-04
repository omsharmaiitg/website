import type { Metadata } from "next";
import { SparklineMotif } from "@/components/motifs";
import { loadMdx } from "@/lib/content";

export const metadata: Metadata = {
  title: "now",
  description: "What I’m learning, grinding, and building right now.",
};

type NowFrontmatter = {
  updated: string;
};

export default async function NowPage() {
  const { content, frontmatter } = await loadMdx<NowFrontmatter>("now.mdx");

  return (
    <section className="mx-auto max-w-[720px] px-6 py-16 md:py-20">
      <div className="flex items-end justify-between gap-6">
        <h1 className="text-title">now</h1>
        <SparklineMotif className="mb-2 h-6 w-[72px] shrink-0" />
      </div>
      <p className="meta mt-4 uppercase tracking-[0.08em]">
        Last updated: {frontmatter.updated}
      </p>
      <hr className="my-8 border-hairline" />
      <div className="prose">{content}</div>
    </section>
  );
}
