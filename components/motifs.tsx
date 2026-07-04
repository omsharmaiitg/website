/*
 * Ink marginalia — single ink color via currentColor, accent blue sparingly,
 * thin strokes, slightly imperfect lines. Static in phase 1 (no animation).
 */

type MotifProps = { className?: string };

const inkProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/* GradeOps: a handwritten answer sheet with a checkmark. */
export function SheetMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...inkProps}>
      <g transform="rotate(-2 32 32)">
        <path d="M17 9.5c10-.7 20-.8 30-.3l.9 45.6c-10.3.8-20.8.9-30.7.4Z" />
        <path d="M23 20c5 .5 10-.4 15 .1" />
        <path d="M23 27c6 .6 13-.7 18 0" />
        <path d="M23 34c4 .4 8-.4 12 .1" />
        <path d="M23 41c3 .3 5.5-.2 8 .1" />
      </g>
      <path
        className="motif-draw stroke-accent"
        strokeWidth={1.5}
        pathLength={1}
        d="m36.5 42 4.5 5.5 9.5-13"
      />
    </svg>
  );
}

/* Delhivery: a node-and-edge graph, one hub highlighted in accent blue. */
export function GraphMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...inkProps}>
      <path d="M16 16c6 5 9.5 8.5 13 12" />
      <path d="M48 14c-5.5 5.5-10 9.5-13 13" />
      <path d="M14 46c6.5-4.5 11.5-8 16-13" />
      <path d="M49 47c-5.5-5.5-10-10-14-14.5" />
      <path d="M31 51c.5-5.5.8-11 1-16" />
      <path d="M17 13.5c10-2.8 21-3 30-1.5" />
      <circle cx="14.5" cy="14.5" r="3" />
      <circle cx="49.5" cy="12.5" r="3" />
      <circle cx="12" cy="48" r="3" />
      <circle cx="51" cy="49" r="3" />
      <circle cx="31" cy="54" r="3" />
      <circle
        className="motif-pulse fill-accent stroke-accent"
        cx="32"
        cy="30.5"
        r="4.5"
      />
    </svg>
  );
}

/* FixIt: a map pin over street lines. */
export function PinMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...inkProps}>
      <path
        className="motif-draw"
        pathLength={1}
        d="M4 42c12-3 24.5-3.2 37-1.2 6.5 1 12.5 2.2 19 4.2"
      />
      <path d="M25 6c2 12 1.2 23.5-1.8 33.5-1.5 5-3.2 11-6.2 17.5" />
      <path d="M6 27.5c9.5-2 18.5-2 28-.2" />
      <path d="M43 54c5-4 9.5-8.5 14.5-14.5" />
      <path d="M38.5 11c-5.8 0-10 4.3-10 9.7 0 7 10 17.3 10 17.3s10-10.3 10-17.3c0-5.4-4.2-9.7-10-9.7Z" />
      <circle className="stroke-accent" strokeWidth={1.5} cx="38.5" cy="21" r="3" />
    </svg>
  );
}

/* /now: a tiny sparkline, climbing. */
export function SparklineMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 72 24" className={className} {...inkProps}>
      <path d="M3 18c4.5-.8 7.5-3 11-3s6 2.3 10 1.3 6.5-6 10.5-7 6.5 3.3 10.5 2.3 8-4 12.5-6.6" />
      <circle className="fill-accent stroke-accent" cx="61" cy="4.6" r="2" />
    </svg>
  );
}

/* /about: a small desk scene — laptop, mug, steam. */
export function DeskMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 96 56" className={className} {...inkProps}>
      <path d="M8 47c14 1.6 62 1.6 80 0" />
      <path d="M31 17.5c7.5-.7 15-.8 21.5-.3l1.8 17.4c-8.6.7-17.3.8-25.6.3Z" />
      <path d="M35 23.5c4-.3 8-.4 12-.2" />
      <path className="stroke-accent" d="M35.5 27.5h6" />
      <path d="M25.5 38.5c11.6-.5 23.3-.7 35-.4l2.5 4.4c-13.4.6-26.8.7-40 .3Z" />
      <path d="M70 32.5c3.6-.3 7.4-.3 10.8 0l-.7 8.2c-1 1.6-2.4 2.4-4.7 2.4-2 0-3.4-.8-4.3-2.3Z" />
      <path d="M81.5 34.5c2.6-.6 4 .6 3.7 2.6-.3 1.8-1.8 2.7-4.3 2.6" />
      <path d="M74 28.5c-1.4-1.8-1.3-3.4.2-5.2" />
      <path d="M78.5 28c-1-1.4-.9-2.6.2-4" />
    </svg>
  );
}

/* Home: a hand-drawn accent underline for the name. */
export function ScribbleUnderline({ className }: MotifProps) {
  return (
    <svg
      viewBox="0 0 220 10"
      preserveAspectRatio="none"
      className={className}
      {...inkProps}
      strokeWidth={1.5}
    >
      <path d="M3 6.5c30-3.5 60-3 90-2s60 1.5 90-1.5c10-1 22-1 34-.5" />
    </svg>
  );
}

/* 404: a dashed path wandering off to nowhere. */
export function LostArrowMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 120 48" className={className} {...inkProps}>
      <path
        strokeDasharray="4 5"
        d="M6 40C22 36 20 14 38 14c16 0 14 22 30 22 12 0 15-9 26-13.5"
      />
      <path d="m94 22.5-7.3-1.2" />
      <path d="m94 22.5-4.3 6" />
    </svg>
  );
}

const workMotifs = {
  gradeops: SheetMotif,
  delhivery: GraphMotif,
  fixit: PinMotif,
} as const;

export function WorkMotif({
  name,
  className,
}: MotifProps & { name: string }) {
  const Motif = workMotifs[name as keyof typeof workMotifs];
  return Motif ? <Motif className={className} /> : null;
}
