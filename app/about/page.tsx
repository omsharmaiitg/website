import type { Metadata } from "next";
import { DeskMotif } from "@/components/motifs";
import { loadMdx } from "@/lib/content";

export const metadata: Metadata = {
  title: "about",
  description:
    "First-year at IIT Guwahati, spending most of my time on machine learning, graphs, and the web.",
};

export default async function AboutPage() {
  const { content } = await loadMdx("about.mdx");

  return (
    <section className="mx-auto max-w-[720px] px-6 py-16 md:py-20">
      <div className="flex items-end justify-between gap-6">
        <h1 className="text-title">about</h1>
        <DeskMotif className="mb-1 h-14 w-24 shrink-0" />
      </div>
      <hr className="my-8 border-hairline" />
      <div className="prose">{content}</div>
    </section>
  );
}
