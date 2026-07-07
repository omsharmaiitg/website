"use client";

import { useState } from "react";
import { DrapeLink } from "@/components/drape";
import { WorkMotif } from "@/components/motifs";

export type WorkCard = {
  slug: string;
  number: string;
  year: string;
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
      <div className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 print:hidden">
        <span className="navlabel text-ink-muted">Filter by stack:</span>
        {filters.map((filter) => {
          const on = filter === active;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(filter)}
              className={`navlabel ulink transition-colors ${
                on ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
              style={on ? { backgroundSize: "100% 1px" } : undefined}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-12 border-b border-hairline">
        {visible.map((card) => (
          <DrapeLink
            key={card.slug}
            href={`/work/${card.slug}`}
            className="group grid grid-cols-[64px_minmax(0,1fr)] items-center gap-8 border-t border-hairline py-10 md:grid-cols-[88px_minmax(0,1fr)_150px] md:gap-12 md:py-12"
          >
            <div>
              <p className="meta">{card.number}</p>
              {card.year && <p className="meta mt-2">{card.year}</p>}
            </div>
            <div>
              <h3 className="text-[clamp(1.75rem,4vw,var(--text-title))] leading-tight">
                <span className="gulink">{card.title}</span>
                <span
                  aria-hidden="true"
                  className="ml-4 inline-block -translate-x-2 font-mono text-[0.55em] text-ink-muted opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  →
                </span>
              </h3>
              <p className="hero-intro mt-3 text-xl text-ink-muted">
                {card.tagline}
              </p>
              <p className="meta mt-5 uppercase tracking-[0.1em]">
                {card.tags.join(" · ")}
              </p>
            </div>
            <WorkMotif
              name={card.motif}
              className="hidden justify-self-end text-ink md:block md:h-[130px] md:w-[130px]"
            />
          </DrapeLink>
        ))}
      </div>
    </>
  );
}
