import type { Metadata } from "next";
import Link from "next/link";
import { LostArrowMotif } from "@/components/motifs";

export const metadata: Metadata = {
  title: "404",
  description: "This page wandered off — a broken link, or one not built yet.",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-[880px] flex-col justify-center px-8 py-24">
      <p className="navlabel text-ink-muted">404 — not found</p>
      <h1 className="hero-name mt-7">This page wandered&nbsp;off.</h1>
      <LostArrowMotif className="mt-10 h-[88px] w-[220px] text-ink" />
      <p className="hero-intro mt-10 max-w-[44ch] text-subhead text-ink-muted">
        It was probably a good page. The dashed line suggests it left in a hurry.
      </p>
      <p className="mt-12">
        <Link href="/" className="navlabel ulink text-accent">
          ← back home
        </Link>
      </p>
    </section>
  );
}
