"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/*
 * "The Drape" — page-transition curtain (DESIGN.md). A full-viewport #1C1C1A
 * overlay RISES from the bottom to cover, the route swaps underneath, then it
 * LIFTS away off the top to reveal the new page. transform: translateY only,
 * GPU-composited. Skipped entirely under prefers-reduced-motion.
 *
 * Drive navigation through <DrapeLink> (or useDrape) so the curtain wraps the
 * route change; plain <Link>/<a> keep their instant behaviour.
 */

type Navigate = (href: string) => void;
const DrapeContext = createContext<Navigate>(() => {});
export const useDrape = () => useContext(DrapeContext);

const DUR = 500; // each half, ms (spec: 450–550)
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)"; // ease-in-out

type Phase = "idle" | "cover" | "reveal";

export function DrapeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);
  const reduceRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const navigate = useCallback<Navigate>(
    (href) => {
      // reduced motion, overlay not ready, or a drape already running → plain jump
      if (reduceRef.current || !ref.current || pendingRef.current) {
        if (!pendingRef.current) router.push(href);
        return;
      }
      pendingRef.current = href;
      setPhase("cover");
      const rise = ref.current.animate(
        [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
        { duration: DUR, easing: EASE, fill: "forwards" },
      );
      rise.onfinish = () => router.push(href); // route swaps under the cover
    },
    [router],
  );

  // New route committed while covered → lift the curtain off the top to reveal.
  useEffect(() => {
    if (phase !== "cover" || !pendingRef.current || !ref.current) return;
    const el = ref.current;
    // let the new page paint one frame before lifting
    const raf = requestAnimationFrame(() => {
      setPhase("reveal");
      const lift = el.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
        { duration: DUR, easing: EASE, fill: "forwards" },
      );
      lift.onfinish = () => {
        pendingRef.current = null;
        el.getAnimations().forEach((a) => a.cancel()); // revert to parked-below base
        setPhase("idle");
      };
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <DrapeContext.Provider value={navigate}>
      {children}
      <div
        ref={ref}
        id="drape"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#1C1C1A",
          zIndex: 100,
          transform: "translateY(100%)", // parked below the fold when idle
          // Blocks clicks only while the curtain is up (cover); never once lifted.
          pointerEvents: phase === "cover" ? "auto" : "none",
          willChange: "transform",
        }}
      />
    </DrapeContext.Provider>
  );
}

// A <Link> that plays The Drape on same-tab primary-button clicks; modified
// clicks (new tab, etc.) fall through to normal navigation.
export function DrapeLink({
  href,
  className,
  children,
  ...rest
}: React.ComponentProps<typeof Link>) {
  const navigate = useDrape();
  const to = typeof href === "string" ? href : href.toString();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
