import type { Metadata } from "next";
import Link from "next/link";
import { LostArrowMotif } from "@/components/motifs";

export const metadata: Metadata = {
  title: "404",
  description: "Nothing here — maybe a broken link, maybe a page not built yet.",
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[720px] px-6 py-24">
      <p className="navlabel text-ink-muted">404</p>
      <h1 className="mt-4 text-title">nothing here.</h1>
      <p className="mt-4 italic text-ink-muted">
        maybe a broken link, maybe a page i haven’t built yet.
      </p>
      <LostArrowMotif className="mt-8 h-12 w-[120px] text-ink-muted" />
      <p className="mt-8">
        <Link href="/" className="navlabel ulink">
          ← back home
        </Link>
      </p>
    </section>
  );
}
