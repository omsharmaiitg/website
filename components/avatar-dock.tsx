"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Mounted once in the root layout; the single avatar instance persists across
// routes AND across states (it never unmounts, so cursor-tracking never resets
// and docking never re-pops).
const Avatar = dynamic(() => import("@/components/Avatar"), {
  ssr: false,
  loading: () => null,
});

// "The Dock" — a THREE-STATE avatar (DESIGN.md). ONE activeSection signal drives
// exactly three states; the entrance animates on a STATE change only.
//   intro            → A  large, in the hero
//   about            → B  hidden (fade + slide out)
//   work/now/contact → C  docked bottom-right, slides in ONCE, then static
// work/now/contact all map to C, so scrolling between them changes no styles →
// no re-animation.
const SECTIONS = ["intro", "about", "work", "now", "contact"] as const;
type Section = (typeof SECTIONS)[number];
type DockState = "A" | "B" | "C" | "hidden";

const stateForSection = (s: Section): DockState =>
  s === "intro" ? "A" : s === "about" ? "B" : "C";

/* ——— tuning knobs ——— */
// The Avatar renders a <Canvas> at its box's NATIVE size, so the box is sized
// per state (hero vs dock) rather than CSS-scaled — CSS-scaling a WebGL canvas
// mis-frames/blurs it. Full-body framing needs a ~0.74 portrait box.
const AVATAR_ASPECT = 0.74; // box w/h
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOVE_MS = 500; // slide-in duration (spec: 400–600ms)
const DOCK_MARGIN = 20; // desired gap of the FIGURE from the viewport corner (px)
// Fractions of the canvas box that are empty padding on the right / below the
// feet — the box is pushed past the corner by these so the FIGURE (not its padded
// box) lands ~DOCK_MARGIN in. A fixed box may overflow the viewport without adding
// scroll (verified for the right edge). Calibration knobs — retune via measure.mjs.
const FIG_PAD_RIGHT = 0.28;
const FIG_PAD_BOTTOM = 0.11;

type Geom = {
  heroLeft: number; // hero (state A) rect — rendered here at native size
  heroTop: number;
  heroW: number;
  heroH: number;
  dockRight: number; // dock (state C) rect — anchored at the corner, native size
  dockBottom: number;
  dockW: number;
  dockH: number;
  offX: number; // state-C slide-in: start translateX (fully off the right edge)
};

function computeGeom(): Geom {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // hero (state A) rect — full body beside the intro text
  let heroW = Math.min(vw * 0.44, 460);
  let heroH = heroW / AVATAR_ASPECT;
  if (heroH > vh * 0.72) {
    heroH = vh * 0.72;
    heroW = heroH * AVATAR_ASPECT;
  }
  const heroLeft = vw - heroW - vw * 0.06;
  const heroTop = 88;

  // dock (state C) rect — bigger: ~220–260px full-body figure. Pull the box past
  // the corner by its transparent padding so the figure sits ~DOCK_MARGIN in.
  const dockH = Math.min(vh * 0.46, 330);
  const dockW = dockH * AVATAR_ASPECT;
  const dockRight = DOCK_MARGIN - FIG_PAD_RIGHT * dockW;
  const dockBottom = DOCK_MARGIN - FIG_PAD_BOTTOM * dockH;

  return {
    heroLeft,
    heroTop,
    heroW,
    heroH,
    dockRight,
    dockBottom,
    dockW,
    dockH,
    offX: dockW + dockRight + 60, // push the whole dock box off the right edge
  };
}

export function AvatarDock() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [geom, setGeom] = useState<Geom | null>(null);
  const [section, setSection] = useState<Section>("intro");
  const [isDesktop, setIsDesktop] = useState(true);
  const reduceRef = useRef(false);

  // Geometry + breakpoint + reduced-motion, kept current on resize.
  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => {
      setGeom(computeGeom());
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ONE activeSection signal — the same midline observer the nav uses. Off-home
  // the sections don't exist, so `section` stays put and we fall through to the
  // docked state C below.
  useEffect(() => {
    if (!onHome) return;
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSection(e.target.id as Section);
        }
      },
      // Detection line low in the viewport (80% down), not the midline: the next
      // section becomes active the moment its top peeks past 80%, so the hero
      // leaves State A as soon as About starts entering — gone well before the
      // ABOUT eyebrow / desk doodle reach mid-screen. (Nav uses its own midline
      // observer.) Errs toward hiding early, per DESIGN.md State B.
      { rootMargin: "-80% 0px -20% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // #contact (footer) is shorter than half the viewport and never crosses the
    // midline — pin it active once scrolled to the bottom.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4)
        setSection("contact");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [onHome]);

  // The ONE derived state. Keyed by state, not section: work→now→contact are all
  // C, so no style changes ⇒ no re-pop. Mobile has no room for the hero overlay,
  // so state A collapses to hidden there (only the corner dock ever shows).
  let state: DockState = onHome ? stateForSection(section) : "C";
  if (!isDesktop && state === "A") state = "hidden";

  // Slide the dock in ONCE, only when entering state C from another state (the key
  // is the STATE, so work→now→contact — all C — never re-fires). lastDockedRef
  // remembers the last VISIBLE box so the hidden states fade out in place, no jump.
  const boxRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<DockState>(state);
  const lastDockedRef = useRef(false);
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    if (state === "C") lastDockedRef.current = true;
    else if (state === "A") lastDockedRef.current = false;
    if (state === "C" && prev !== "C" && geom && !reduceRef.current) {
      boxRef.current?.animate(
        [
          { transform: `translate3d(${geom.offX}px, 0, 0)` },
          { transform: "translate3d(0, 0, 0)" },
        ],
        { duration: MOVE_MS, easing: EASE, fill: "backwards" },
      );
    }
  }, [state, geom]);

  // Box is sized/placed per state at NATIVE resolution (no canvas scaling). Visible
  // states use their own rect; a hidden state keeps whichever rect it came from so
  // its opacity fade never jumps (A→B fades the hero in place; C→B fades the dock).
  const g = geom;
  const docked = state === "C" || (state !== "A" && lastDockedRef.current);
  const box: React.CSSProperties = !g
    ? { width: 0, height: 0 }
    : docked
      ? { right: g.dockRight, bottom: g.dockBottom, width: g.dockW, height: g.dockH }
      : { left: g.heroLeft, top: g.heroTop, width: g.heroW, height: g.heroH };
  const opacity = state === "A" || state === "C" ? 1 : 0;

  const dur = reduceRef.current ? 0 : MOVE_MS;

  return (
    <div
      ref={boxRef}
      id="avatar-dock"
      aria-hidden="true"
      style={{
        position: "fixed",
        ...box,
        zIndex: 45,
        opacity,
        transition: `opacity ${Math.round(dur * 0.85)}ms ease`,
        willChange: "transform, opacity",
        pointerEvents: opacity ? "auto" : "none", // avatar clickable only when shown
      }}
    >
      <Avatar />
    </div>
  );
}
