type Stat = {
  value: string;
  label: string;
};

/* Key numbers set large in serif, stated once, dryly. */
export function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {items.map((stat) => (
        <div key={stat.value}>
          <p className="font-display text-title leading-tight">{stat.value}</p>
          <p className="meta mt-2">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
