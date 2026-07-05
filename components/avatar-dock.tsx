"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

// Mounted once in the root layout so the single avatar instance persists across
// route changes (it never unmounts, so its cursor-tracking never resets).
const Avatar = dynamic(() => import("@/components/Avatar"), {
  ssr: false,
  loading: () => null,
});

// Home sections in scroll order — a new one becoming active triggers the
// side-slide flourish while docked.
const SECTIONS = ["intro", "about", "work", "now"] as const;

/* ——— tuning knobs ——— */
const DOCK_BY = 0.55; // hero → fully docked over this fraction of a viewport scrolled
const SLIDE_MS = 460; // side-slide entry duration (spec: ~400–500ms)
const HERO_ASPECT = 0.74; // avatar's natural full-body w/h — keeps arms in frame at any size
const SLIDE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const smoothstep = (t: number) => t * t * (3 - 2 * t); // ease-in-out for the scrub

type Geom = {
  heroW: number;
  heroH: number;
  heroLeft: number;
  heroTop: number;
  scale: number; // hero → dock uniform scale (aspect preserved ⇒ full body kept)
  dx: number; // hero → dock top-left delta, screen px
  dy: number;
};

// A single portrait box (HERO_ASPECT) at the hero spot, plus a uniform scale +
// translate that lands it in the bottom-right corner. Uniform scale means the
// docked figure is the SAME framing shrunk — never a cropped upper half.
function computeGeom(): Geom {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Size from whichever dimension binds, keeping the portrait aspect.
  let heroW = Math.min(vw * 0.44, 460);
  let heroH = heroW / HERO_ASPECT;
  if (heroH > vh * 0.72) {
    heroH = vh * 0.72;
    heroW = heroH * HERO_ASPECT;
  }
  const heroLeft = vw - heroW - vw * 0.06; // sits right of the intro text
  const heroTop = 88;

  const dockH = Math.min(vh * 0.26, 190);
  const scale = dockH / heroH;
  const dockW = heroW * scale;
  const margin = Math.min(vw * 0.03, 28);
  const dockLeft = vw - dockW - margin;
  const dockTop = vh - dockH - margin;

  return { heroW, heroH, heroLeft, heroTop, scale, dx: dockLeft - heroLeft, dy: dockTop - heroTop };
}

export function AvatarDock() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const slideRef = useRef<HTMLDivElement>(null); // outer: side-slide (screen-px translateX)
  const wrapRef = useRef<HTMLDivElement>(null); //  inner: hero→dock scrub (translate + scale)
  const geomRef = useRef<Geom | null>(null);
  const reduceRef = useRef(false);
  const dockedRef = useRef(false); // near-docked? gates the section side-slide

  // Position the fixed outer box and cache geometry (re-run on resize).
  const layout = useCallback(() => {
    const g = computeGeom();
    geomRef.current = g;
    const el = slideRef.current;
    if (!el) return;
    el.style.left = `${g.heroLeft}px`;
    el.style.top = `${g.heroTop}px`;
    el.style.width = `${g.heroW}px`;
    el.style.height = `${g.heroH}px`;
  }, []);

  // Apply the scrub for progress p ∈ [0,1] as ONE GPU transform. Reduced motion
  // snaps at the midpoint instead of interpolating.
  const applyScrub = useCallback((p: number) => {
    const g = geomRef.current;
    const el = wrapRef.current;
    if (!g || !el) return;
    const e = reduceRef.current ? (p >= 0.5 ? 1 : 0) : smoothstep(p);
    el.style.transform = `translate3d(${g.dx * e}px, ${g.dy * e}px, 0) scale(${1 + (g.scale - 1) * e})`;
    dockedRef.current = e > 0.98;
  }, []);

  // Side-slide entry: the docked figure slides in from the nearest edge (right,
  // since the dock is bottom-right) to its spot. Applied to the OUTER box so
  // the offset stays in true screen px, uncoupled from the inner scale.
  const slideIn = useCallback(() => {
    const g = geomRef.current;
    const el = slideRef.current;
    if (!g || !el || reduceRef.current) return;
    const dockLeft = g.heroLeft + g.dx;
    const offset = window.innerWidth - dockLeft + 40; // start fully off the right edge
    el.animate(
      [{ transform: `translate3d(${offset}px, 0, 0)` }, { transform: "translate3d(0, 0, 0)" }],
      { duration: SLIDE_MS, easing: SLIDE_EASE, fill: "backwards" },
    );
  }, []);

  // Scroll-driven progress. On home + desktop it scrubs; everywhere else it is
  // pinned docked (mobile home has no room for the hero beside the text).
  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    layout();

    let raf = 0;
    const tick = () => {
      raf = 0;
      const dockOnly = !onHome || !window.matchMedia("(min-width: 768px)").matches;
      const p = dockOnly
        ? 1
        : Math.min(window.scrollY / (window.innerHeight * DOCK_BY), 1);
      applyScrub(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      layout();
      onScroll();
    };
    tick(); // set the initial transform before the avatar chunk paints
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onHome, applyScrub, layout]);

  // Route entry to a detail page (always docked there): slide in rather than pop.
  useEffect(() => {
    if (!onHome) slideIn();
  }, [pathname, onHome, slideIn]);

  // Home: slide in on each newly-active section, but only once docked (no
  // flourish while it's still the big hero up top).
  useEffect(() => {
    if (!onHome) return;
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    let current = "";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.target.id !== current) {
            current = e.target.id;
            if (dockedRef.current) slideIn();
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome, slideIn]);

  return (
    <div
      ref={slideRef}
      id="avatar-dock"
      aria-hidden="true"
      style={{ position: "fixed", zIndex: 40, pointerEvents: "none", willChange: "transform" }}
    >
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "top left",
          willChange: "transform",
          pointerEvents: "auto", // the avatar itself stays clickable (gestures)
        }}
      >
        <Avatar />
      </div>
    </div>
  );
}
