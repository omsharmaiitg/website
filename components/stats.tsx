type Stat = {
  value: string;
  label: string;
};

/* Key numbers set large in serif, stated once, dryly — a hairline-divided
   2×2 grid (single column on mobile). */
export function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="grid border-t border-hairline sm:grid-cols-2">
      {items.map((stat, i) => (
        <div
          key={stat.value}
          className={`border-b border-hairline py-8 ${
            i % 2 === 0 ? "sm:pr-8" : "sm:border-l sm:border-hairline sm:pl-8"
          }`}
        >
          <p className="font-display text-title leading-none">{stat.value}</p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
