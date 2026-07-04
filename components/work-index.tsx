"use client";

import Link from "next/link";
import { useState } from "react";
import { WorkMotif } from "@/components/motifs";

export type WorkCard = {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  tags: string[];
  motif: string;
};

const filters = [
  "All",
  "Python",
  "FastAPI",
  "React",
  "Next.js",
  "XGBoost",
  "Firebase",
];

export function WorkIndex({ cards }: { cards: WorkCard[] }) {
  const [active, setActive] = useState("All");
  const visible =
    active === "All"
      ? cards
      : cards.filter((card) =>
          card.tags.some((tag) =>
            tag.toLowerCase().includes(active.toLowerCase()),
          ),
        );

  return (
    <>
      <div className="mt-8 flex flex-wrap items-baseline gap-2 print:hidden">
        <span className="meta mr-2">Filter by stack:</span>
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={filter === active}
            onClick={() => setActive(filter)}
            className={`rounded-full border px-3 py-1 font-mono text-[0.6875rem] tracking-[0.08em] transition-colors duration-200 ${
              filter === active
                ? "border-accent text-accent"
                : "border-hairline text-ink-muted hover:border-ink hover:text-ink"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((card) => (
          <Link
            key={card.slug}
            href={`/work/${card.slug}`}
            className="group flex flex-col border border-hairline p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="navlabel text-ink-muted">{card.number}</span>
              <WorkMotif name={card.motif} className="h-14 w-14 shrink-0" />
            </div>
            <h2 className="mt-6 text-subhead leading-snug">
              <span className="gulink">{card.title}</span>
            </h2>
            <p className="mt-3 italic text-ink-muted">{card.tagline}</p>
            <p className="meta mt-auto pt-6">{card.tags.join(" · ")}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
