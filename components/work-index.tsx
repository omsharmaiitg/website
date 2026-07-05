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
  link?: string;
  demo?: string;
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
          <div
            key={card.slug}
            className="group relative flex flex-col border border-hairline p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="navlabel text-ink-muted">{card.number}</span>
              <WorkMotif name={card.motif} className="h-14 w-14 shrink-0" />
            </div>
            <h2 className="mt-6 text-subhead leading-snug">
              {/* The title link covers the whole card via an inset overlay,
                  so the external links below can sit above it and stay
                  independently clickable (no anchor nested in an anchor). */}
              <Link
                href={`/work/${card.slug}`}
                className="gulink after:absolute after:inset-0 after:content-['']"
              >
                {card.title}
              </Link>
            </h2>
            <p className="mt-3 italic text-ink-muted">{card.tagline}</p>
            <p className="meta mt-auto pt-6">{card.tags.join(" · ")}</p>
            {(card.link || card.demo) && (
              <p className="relative z-10 mt-4 flex gap-5">
                {card.link && (
                  <a
                    className="navlabel ulink text-accent"
                    href={card.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    github ↗
                  </a>
                )}
                {card.demo && (
                  <a
                    className="navlabel ulink text-accent"
                    href={card.demo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    live ↗
                  </a>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
