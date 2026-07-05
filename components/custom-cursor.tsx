"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, #avatar-dock';

/*
 * Desktop-only ink-dot cursor with spring lag; grows into a hollow ring
 * over interactive elements, tints accent over the avatar. Disabled on
 * coarse pointers and prefers-reduced-motion (native cursor restored).
 * pointer-events: none throughout — it can never delay or offset clicks.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setEnabled(finePointer.matches && !reducedMotion.matches);
    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    if (!enabled || !dot) return;

    const root = document.documentElement;
    let raf = 0;
    let started = false;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const loop = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!started) {
        started = true;
        x = targetX;
        y = targetY;
        root.classList.add("has-custom-cursor");
        raf = requestAnimationFrame(loop);
      }
      dot.classList.add("is-visible");
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      dot.classList.toggle(
        "is-ring",
        !!target?.closest(INTERACTIVE_SELECTOR),
      );
      dot.classList.toggle("is-accent", !!target?.closest("#avatar-dock"));
    };

    const onLeave = () => dot.classList.remove("is-visible");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-custom-cursor");
      dot.classList.remove("is-visible", "is-ring", "is-accent");
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
