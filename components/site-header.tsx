"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sections = ["intro", "about", "work", "now", "contact"] as const;
type Section = (typeof sections)[number];

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<Section>("intro");

  // Active-section highlight: a section is active when it crosses the viewport
  // midline. Only runs on the single-page home.
  useEffect(() => {
    if (!onHome) return;
    const els = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as Section);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Bottom sections shorter than half the viewport never cross the midline —
    // pin the last one active once scrolled to the end.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4)
        setActive("contact");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [onHome]);

  const handleClick =
    (id: Section) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!onHome) return; // let the Link navigate to /#id from a detail page
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id === "intro" ? "/" : `#${id}`);
      setActive(id);
    };

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1080px] items-baseline justify-between px-6 py-4">
        <Link
          href={onHome ? "#intro" : "/"}
          onClick={handleClick("intro")}
          className="ulink font-display text-lg italic"
        >
          om sharma
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          {sections.slice(1).map((id) => (
            <Link
              key={id}
              href={`${onHome ? "" : "/"}#${id}`}
              onClick={handleClick(id)}
              aria-current={onHome && active === id ? "true" : undefined}
              className={`navlabel ulink transition-colors ${
                onHome && active === id ? "text-accent" : ""
              }`}
            >
              {id}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
