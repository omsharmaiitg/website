import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Stats } from "@/components/stats";

/* Section eyebrows: THE PROBLEM → WHAT I BUILT → HOW IT WORKS → RESULTS.
   Mono label followed by a hairline rule that fills the remaining width. */
export function SectionHeading({
  children,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 {...props} className="mt-20 mb-8 flex items-center gap-5">
      <span className="navlabel whitespace-nowrap text-ink-muted">
        {children}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
    </h2>
  );
}

/* Marginalia footnotes: mono asterisk markers, small italic notes. */
export function FootnoteMark() {
  return (
    <sup aria-hidden="true" className="font-mono text-[0.75em] text-accent">
      *
    </sup>
  );
}

export function Footnote({ children }: { children: ReactNode }) {
  return (
    <aside className="my-6 flex max-w-[55ch] gap-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
      <span aria-hidden="true" className="font-mono text-accent">
        *
      </span>
      <span className="italic">{children}</span>
    </aside>
  );
}

type ModelRow = {
  model: string;
  mae: string;
  highlight?: boolean;
};

/* Model comparison: hairline rows, mono numbers, one accent row. */
export function ModelTable({
  caption,
  rows,
}: {
  caption?: string;
  rows: ModelRow[];
}) {
  return (
    <figure className="my-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              scope="col"
              className="navlabel border-b border-hairline py-3 pr-4 text-left font-normal text-ink-muted"
            >
              model
            </th>
            <th
              scope="col"
              className="navlabel border-b border-hairline py-3 text-right font-normal text-ink-muted"
            >
              mae
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.model}
              className={`border-b border-hairline ${
                row.highlight ? "text-accent" : ""
              }`}
            >
              <td className="py-3 pr-4">{row.model}</td>
              <td className="py-3 text-right font-mono text-sm">{row.mae}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <figcaption className="mt-3 text-sm italic text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const projectMdxComponents = {
  h2: SectionHeading,
  Stats,
  ModelTable,
  Footnote,
  FootnoteMark,
};
