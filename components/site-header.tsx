import Link from "next/link";

const navItems = [
  { href: "/work", label: "work" },
  { href: "/now", label: "now" },
  { href: "/about", label: "about" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-[720px] items-baseline justify-between px-6 py-5">
        <Link href="/" className="ulink font-display text-lg italic">
          om sharma
        </Link>
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="navlabel ulink">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
