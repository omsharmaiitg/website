"use client";

/*
 * "The Watcher" — a self-contained, cursor-tracking low-poly avatar (v7).
 * Procedurally modelled from primitives (zero asset files). Renders its own
 * <Canvas> filling the wrapper; the parent owns size and placement.
 * Import with next/dynamic and ssr:false.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export const GESTURES = ["wave", "nod", "shrug", "thumbsUp"] as const;
export type AvatarGesture = (typeof GESTURES)[number];

export type AvatarProps = {
  className?: string;
  accent?: string;
  compact?: boolean;
  /** Optional hook: set (or change) to play a specific gesture. Clicks cycle
      through all four regardless. */
  gesture?: AvatarGesture;
};

/* ——— tuning knobs ——— */
const HEAD_YAW_LIMIT = THREE.MathUtils.degToRad(35); // max head turn toward cursor
const HEAD_PITCH_LIMIT = THREE.MathUtils.degToRad(20); // max head nod up/down
const TRACK_EASE = 4.5; // head lerp speed — higher = snappier (eyes use EYE_EASE)
const EYE_EASE = 9;
const EYE_FACTOR = 0.5; // extra eye rotation, as a fraction of the head target
const BLINK_GAP: [number, number] = [3, 6]; // seconds between blinks (min, max)
const BLINK_DURATION = 0.12; // seconds the eyes stay squeezed
const GESTURE_DURATION: Record<AvatarGesture, number> = {
  wave: 1.1,
  nod: 0.8,
  shrug: 0.9,
  thumbsUp: 1.0,
}; // seconds per one-shot gesture

/* Palette — ink family + one accent family + neutrals. Nothing else. */
const INK = "#0A0A0A"; // hoodie, hair, glasses, pupils
const INK_SOFT = "#1B1B19"; // hood fold, hem, pocket, mouth — still ink family
/* Toon lighting multiplies albedo by ~0.94 on front faces, so this hex is
   set hot to RENDER as the target fair wheatish #F2D2B3. */
const SKIN = "#FFE0BF"; // fair wheatish — face, ears, neck, hands
const OFFWHITE = "#E4E4E1"; // sneakers + eye backing; darker than the page bg
const ACCENT_DEFAULT = "#2B4C7E";

/* Arm rig: each arm parents to a pivot AT the shoulder joint (top-inner
   corner, just inside the torso edge), so rotation never pulls it out of
   the socket. A deltoid sphere at the pivot hides the seam at every angle. */
const ARM_PIVOT_Y = 2.34;
const ARM_PIVOT_X = 0.5; // torso half-width is 0.52 — pivot sits inside it
const ARM_OUT = 0.14; // meshes sit this far outboard of the pivot
const ARM_REST_X = 0.12; // slightly forward, toward pockets
const ARM_REST_Z = 0.1; // slightly inward
const WAVE_RAISED = 2.45; // radians the waving arm swings up to
const ARM_RAISE_MAX = 2.75; // hard clamp — never past a natural shoulder range

function canUseWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* Frames the WHOLE figure (head → sneakers) with margin at every size (v6).
   The dock is a tiny square viewport, so compact pulls back a touch more to
   keep a safe margin — it must never crop to a half-body. */
function CameraRig({ compact }: { compact: boolean }) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    // camera distance — bigger = more empty margin around the figure
    camera.position.set(0, 1.82, compact ? 8.6 : 8.1);
    camera.lookAt(0, 1.8, 0); // aim at the figure's vertical centre
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, compact, invalidate]);
  return null;
}

/* Modern rectangular specs: thin even frames, clean bridge, temple arms
   running back to the ears. */
function Glasses({ material }: { material: THREE.Material }) {
  const bar = 0.03;
  return (
    <group position={[0, 0.5, 0.5]}>
      {[-0.195, 0.195].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh material={material} position={[0, 0.12, 0]}>
            <boxGeometry args={[0.32, bar, bar]} />
          </mesh>
          <mesh material={material} position={[0, -0.12, 0]}>
            <boxGeometry args={[0.32, bar, bar]} />
          </mesh>
          <mesh material={material} position={[-0.16, 0, 0]}>
            <boxGeometry args={[bar, 0.27, bar]} />
          </mesh>
          <mesh material={material} position={[0.16, 0, 0]}>
            <boxGeometry args={[bar, 0.27, bar]} />
          </mesh>
        </group>
      ))}
      <mesh material={material} position={[0, 0.06, 0]}>
        <boxGeometry args={[0.1, bar, bar]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh material={material} position={[side * 0.39, 0.06, 0]}>
            <boxGeometry args={[0.09, bar, bar]} />
          </mesh>
          <mesh material={material} position={[side * 0.44, 0.05, -0.25]}>
            <boxGeometry args={[bar, bar, 0.5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

type FigureProps = {
  accent: string;
  compact: boolean;
  reducedMotion: boolean;
  tracking: boolean;
  gesture?: AvatarGesture;
};

function Figure({ accent, compact, reducedMotion, tracking, gesture }: FigureProps) {
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const blinkRef = useRef<THREE.Group>(null);
  const eyeLRef = useRef<THREE.Group>(null);
  const eyeRRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const thumbRef = useRef<THREE.Mesh>(null);

  const pointerRef = useRef({ x: 0, y: 0, active: false });
  /* Lerped tracking state lives here, NOT in rotation.x/y — gesture offsets
     are added at assignment so they can't feed back into the lerp. */
  const headState = useRef({ yaw: 0, pitch: 0 });
  const blinkTimer = useRef({ start: -1, next: 2 + Math.random() * 3 });
  const gestureRef = useRef<{ name: AvatarGesture; start: number } | null>(null);
  const cycleRef = useRef(0);

  const clock = useThree((s) => s.clock);
  const invalidate = useThree((s) => s.invalidate);

  /* Toon materials sharing a 3-step gradient; denim is derived from the
     accent (same hue, lighter + desaturated → #8FA6C4 at the default). */
  const palette = useMemo(() => {
    const gradient = new THREE.DataTexture(
      new Uint8Array([90, 166, 234]),
      3,
      1,
      THREE.RedFormat,
    );
    gradient.minFilter = THREE.NearestFilter;
    gradient.magFilter = THREE.NearestFilter;
    gradient.needsUpdate = true;
    const toon = (color: THREE.ColorRepresentation) =>
      new THREE.MeshToonMaterial({ color, gradientMap: gradient });
    const hsl = { h: 0, s: 0, l: 0 };
    new THREE.Color(accent).getHSL(hsl);
    return {
      gradient,
      ink: toon(INK),
      inkSoft: toon(INK_SOFT),
      skin: toon(SKIN),
      offwhite: toon(OFFWHITE),
      accent: toon(accent),
      denim: toon(new THREE.Color().setHSL(hsl.h, hsl.s * 0.63, 0.66)),
    };
  }, [accent]);

  useEffect(
    () => () => {
      for (const resource of Object.values(palette)) resource.dispose();
    },
    [palette],
  );

  /* Global pointer, normalized to [-1, 1] over the viewport, so tracking
     works wherever the avatar sits on the page. Fine pointers only. */
  useEffect(() => {
    const p = pointerRef.current;
    if (!tracking) {
      p.active = false;
      return;
    }
    const onMove = (event: PointerEvent) => {
      p.x = (event.clientX / window.innerWidth) * 2 - 1;
      p.y = (event.clientY / window.innerHeight) * 2 - 1;
      p.active = true;
    };
    const onLeave = () => {
      p.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      p.active = false;
    };
  }, [tracking]);

  /* One gesture at a time; new triggers are ignored while one plays. */
  const playGesture = (name: AvatarGesture) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    const active = gestureRef.current;
    if (active && t - active.start < GESTURE_DURATION[active.name]) return;
    gestureRef.current = { name, start: t };
  };
  const playRef = useRef(playGesture);
  playRef.current = playGesture;

  /* Prop hook: play a specific gesture when the prop is set/changed. */
  useEffect(() => {
    if (gesture) playRef.current(gesture);
  }, [gesture]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    playGesture(GESTURES[cycleRef.current++ % GESTURES.length]);
  };

  /* Reduced motion: pin everything to the rest pose and render it once. */
  useEffect(() => {
    if (!reducedMotion) return;
    gestureRef.current = null;
    headState.current = { yaw: 0, pitch: 0 };
    bodyRef.current?.position.set(0, 0, 0);
    bodyRef.current?.rotation.set(0, 0, 0);
    headRef.current?.rotation.set(0, 0, 0);
    blinkRef.current?.scale.set(1, 1, 1);
    eyeLRef.current?.rotation.set(0, 0, 0);
    eyeRRef.current?.rotation.set(0, 0, 0);
    leftArmRef.current?.rotation.set(ARM_REST_X, 0, ARM_REST_Z);
    leftArmRef.current?.position.setY(ARM_PIVOT_Y);
    rightArmRef.current?.rotation.set(ARM_REST_X, 0, -ARM_REST_Z);
    rightArmRef.current?.position.setY(ARM_PIVOT_Y);
    thumbRef.current?.scale.setScalar(0.001);
    invalidate();
  }, [reducedMotion, invalidate]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    const dampHead = 1 - Math.exp(-TRACK_EASE * delta);
    const dampEyes = 1 - Math.exp(-EYE_EASE * delta);

    const body = bodyRef.current;
    if (body) {
      body.position.y = Math.sin(t * 1.1) * 0.035;
      body.rotation.y = Math.sin(t * 0.5) * 0.03;
      body.rotation.z = Math.sin(t * 0.85) * 0.012;
    }

    /* gesture progress + single smooth up-down envelope */
    let g = gestureRef.current;
    if (g && (t - g.start) / GESTURE_DURATION[g.name] >= 1) {
      gestureRef.current = null;
      g = null;
    }
    const gp = g ? (t - g.start) / GESTURE_DURATION[g.name] : -1;
    const env = g ? Math.sin(Math.PI * THREE.MathUtils.clamp(gp, 0, 1)) : 0;

    /* head tracking (+ nod gesture on top) */
    const p = pointerRef.current;
    const yaw = (p.active ? p.x * HEAD_YAW_LIMIT : 0) + Math.sin(t * 0.6) * 0.02;
    const pitch = p.active ? p.y * HEAD_PITCH_LIMIT : 0;
    const head = headRef.current;
    if (head) {
      const hs = headState.current;
      hs.yaw = THREE.MathUtils.lerp(hs.yaw, yaw, dampHead);
      hs.pitch = THREE.MathUtils.lerp(hs.pitch, pitch, dampHead);
      head.rotation.y = hs.yaw;
      head.rotation.x = hs.pitch + (g?.name === "nod" ? env * 0.32 : 0);
    }

    /* eyes: each rotates about its OWN center; the right copies the left,
       so the pair can never drift apart or go cross-eyed. */
    const eyeL = eyeLRef.current;
    const eyeR = eyeRRef.current;
    if (eyeL && eyeR) {
      eyeL.rotation.y = THREE.MathUtils.lerp(
        eyeL.rotation.y,
        (p.active ? p.x : 0) * HEAD_YAW_LIMIT * EYE_FACTOR,
        dampEyes,
      );
      eyeL.rotation.x = THREE.MathUtils.lerp(
        eyeL.rotation.x,
        (p.active ? p.y : 0) * HEAD_PITCH_LIMIT * EYE_FACTOR,
        dampEyes,
      );
      eyeR.rotation.copy(eyeL.rotation);
    }
    const blink = blinkRef.current;
    if (blink) {
      const timer = blinkTimer.current;
      if (t >= timer.next) {
        timer.start = t;
        timer.next = t + BLINK_GAP[0] + Math.random() * (BLINK_GAP[1] - BLINK_GAP[0]);
      }
      const bp = (t - timer.start) / BLINK_DURATION;
      blink.scale.y = bp >= 0 && bp < 1 ? Math.max(0.08, 1 - Math.sin(Math.PI * bp)) : 1;
    }

    /* arms: rest pose unless a gesture says otherwise */
    let lX = ARM_REST_X;
    let lZ = ARM_REST_Z;
    let lY = ARM_PIVOT_Y;
    let rX = ARM_REST_X;
    let rZ = -ARM_REST_Z;
    let rY = ARM_PIVOT_Y;
    let thumb = 0;
    if (g?.name === "wave") {
      const we =
        THREE.MathUtils.smoothstep(gp, 0, 0.22) *
        (1 - THREE.MathUtils.smoothstep(gp, 0.78, 1));
      rZ = -ARM_REST_Z + we * (WAVE_RAISED + ARM_REST_Z) + we * Math.sin(gp * Math.PI * 5) * 0.3;
      rX = ARM_REST_X * (1 - we);
    } else if (g?.name === "shrug") {
      lZ = ARM_REST_Z + env * 0.3;
      rZ = -ARM_REST_Z - env * 0.3;
      lY = rY = ARM_PIVOT_Y + env * 0.09;
    } else if (g?.name === "thumbsUp") {
      lX = ARM_REST_X - env * 1.9;
      lZ = ARM_REST_Z * (1 - env);
      thumb = THREE.MathUtils.clamp(env / 0.35, 0, 1);
    }
    const leftArm = leftArmRef.current;
    if (leftArm) {
      leftArm.rotation.set(lX, 0, THREE.MathUtils.clamp(lZ, -ARM_RAISE_MAX, ARM_RAISE_MAX));
      leftArm.position.y = lY;
    }
    const rightArm = rightArmRef.current;
    if (rightArm) {
      rightArm.rotation.set(rX, 0, THREE.MathUtils.clamp(rZ, -ARM_RAISE_MAX, ARM_RAISE_MAX));
      rightArm.position.y = rY;
    }
    thumbRef.current?.scale.setScalar(Math.max(0.001, thumb));
  });

  return (
    <group ref={bodyRef} onPointerDown={handlePointerDown}>
      {/* sneakers */}
      <mesh material={palette.offwhite} position={[-0.24, 0.13, 0.06]}>
        <boxGeometry args={[0.46, 0.26, 0.72]} />
      </mesh>
      <mesh material={palette.offwhite} position={[0.24, 0.13, 0.06]}>
        <boxGeometry args={[0.46, 0.26, 0.72]} />
      </mesh>

      {/* jeans */}
      <mesh material={palette.denim} position={[-0.24, 0.81, 0]}>
        <boxGeometry args={[0.38, 1.1, 0.42]} />
      </mesh>
      <mesh material={palette.denim} position={[0.24, 0.81, 0]}>
        <boxGeometry args={[0.38, 1.1, 0.42]} />
      </mesh>

      {/* hoodie: slim torso, hem, collar, hood folded behind the neck */}
      <mesh material={palette.ink} position={[0, 1.91, 0]}>
        <boxGeometry args={[1.04, 1.1, 0.56]} />
      </mesh>
      <mesh material={palette.inkSoft} position={[0, 1.4, 0]}>
        <boxGeometry args={[1.08, 0.1, 0.6]} />
      </mesh>
      <mesh material={palette.inkSoft} position={[0, 2.42, 0.24]}>
        <boxGeometry args={[0.7, 0.08, 0.12]} />
      </mesh>
      <mesh
        material={palette.inkSoft}
        position={[0, 2.44, -0.32]}
        rotation={[0.35, 0, 0]}
      >
        <boxGeometry args={[0.86, 0.3, 0.26]} />
      </mesh>

      {/* fine details, hidden when compact */}
      {!compact && (
        <>
          <mesh material={palette.inkSoft} position={[0, 1.62, 0.28]}>
            <boxGeometry args={[0.56, 0.3, 0.08]} />
          </mesh>
          <mesh
            material={palette.accent}
            position={[-0.13, 2.1, 0.3]}
            rotation={[0.08, 0, 0]}
          >
            <cylinderGeometry args={[0.024, 0.024, 0.3, 6]} />
          </mesh>
          <mesh
            material={palette.accent}
            position={[0.13, 2.1, 0.3]}
            rotation={[0.08, 0, 0]}
          >
            <cylinderGeometry args={[0.024, 0.024, 0.3, 6]} />
          </mesh>
        </>
      )}

      {/* arms — pivot AT the shoulder socket; sleeve + hand hang outboard of
          it, deltoid sphere plugs the joint. Left thumbs-up, right waves. */}
      <group
        ref={leftArmRef}
        position={[-ARM_PIVOT_X, ARM_PIVOT_Y, 0]}
        rotation={[ARM_REST_X, 0, ARM_REST_Z]}
      >
        <mesh material={palette.ink}>
          <sphereGeometry args={[0.165, 10, 8]} />
        </mesh>
        <mesh material={palette.ink} position={[-ARM_OUT, -0.46, 0]}>
          <boxGeometry args={[0.28, 1.06, 0.32]} />
        </mesh>
        <mesh material={palette.skin} position={[-ARM_OUT, -1.08, 0.01]}>
          <boxGeometry args={[0.22, 0.2, 0.24]} />
        </mesh>
        <mesh
          ref={thumbRef}
          material={palette.skin}
          position={[-ARM_OUT, -1.08, 0.15]}
          scale={0.001}
        >
          <boxGeometry args={[0.08, 0.09, 0.16]} />
        </mesh>
      </group>
      <group
        ref={rightArmRef}
        position={[ARM_PIVOT_X, ARM_PIVOT_Y, 0]}
        rotation={[ARM_REST_X, 0, -ARM_REST_Z]}
      >
        <mesh material={palette.ink}>
          <sphereGeometry args={[0.165, 10, 8]} />
        </mesh>
        <mesh material={palette.ink} position={[ARM_OUT, -0.46, 0]}>
          <boxGeometry args={[0.28, 1.06, 0.32]} />
        </mesh>
        <mesh material={palette.skin} position={[ARM_OUT, -1.08, 0.01]}>
          <boxGeometry args={[0.22, 0.2, 0.24]} />
        </mesh>
      </group>

      {/* neck */}
      <mesh material={palette.skin} position={[0, 2.52, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.28]} />
      </mesh>

      {/* head group — pivots at the neck for tracking */}
      <group ref={headRef} position={[0, 2.6, 0]}>
        <mesh material={palette.skin} position={[0, 0.42, 0]}>
          <boxGeometry args={[0.9, 0.8, 0.82]} />
        </mesh>

        {/* ears */}
        <mesh material={palette.skin} position={[-0.47, 0.5, 0]}>
          <boxGeometry args={[0.07, 0.2, 0.14]} />
        </mesh>
        <mesh material={palette.skin} position={[0.47, 0.5, 0]}>
          <boxGeometry args={[0.07, 0.2, 0.14]} />
        </mesh>

        {/* hair (v7) — 3 layers for real depth without noise. Head is 0.9 wide;
            every piece sits PROUD of it (~0.08 out) so the hair has visible
            thickness, not a painted-on shell.
            L1 base cap: top cap sets a clean hairline + rounds via a low dome,
            side panels reach down to the ears, a nape block covers the back —
            no skin gap at hairline/temples, no bald side at any head-turn.
            L2 volume: 6 chunky crown locks, heights varied ~25%, small tilts.
            L3 fringe: 4 uneven front blocks swept low-left → high-right.
            Tuning knobs: PROUD offset (piece sizes vs the 0.9 head), tilt kept
            ≤ ~0.12 rad (12°) so nothing spikes, one ink colour so it reads as
            a single mass. */}
        {/* L1 — base cap: proud shell (top / sides / nape) + rounding dome */}
        <mesh material={palette.ink} position={[0, 0.82, -0.03]}>
          <boxGeometry args={[1.06, 0.24, 1.0]} />
        </mesh>
        <mesh material={palette.ink} position={[-0.49, 0.66, -0.05]}>
          <boxGeometry args={[0.16, 0.24, 0.82]} />
        </mesh>
        <mesh material={palette.ink} position={[0.49, 0.66, -0.05]}>
          <boxGeometry args={[0.16, 0.24, 0.82]} />
        </mesh>
        <mesh material={palette.ink} position={[0, 0.5, -0.5]}>
          <boxGeometry args={[0.92, 0.5, 0.24]} />
        </mesh>
        <mesh material={palette.ink} position={[0, 0.73, -0.04]} scale={[1, 0.42, 1.02]}>
          <sphereGeometry args={[0.52, 14, 10]} />
        </mesh>
        {/* L2 — volume locks on the crown: varied height, bounded tilt */}
        <mesh material={palette.ink} position={[0, 0.86, 0.16]} rotation={[0.1, 0.04, -0.05]}>
          <boxGeometry args={[0.3, 0.24, 0.3]} />
        </mesh>
        <mesh material={palette.ink} position={[-0.26, 0.87, 0.02]} rotation={[0.05, -0.1, 0.1]}>
          <boxGeometry args={[0.28, 0.28, 0.3]} />
        </mesh>
        <mesh material={palette.ink} position={[0.26, 0.86, 0]} rotation={[0.05, 0.1, -0.1]}>
          <boxGeometry args={[0.28, 0.22, 0.3]} />
        </mesh>
        <mesh material={palette.ink} position={[0, 0.88, -0.16]} rotation={[-0.07, 0.03, 0.04]}>
          <boxGeometry args={[0.3, 0.26, 0.3]} />
        </mesh>
        <mesh material={palette.ink} position={[-0.24, 0.85, -0.22]} rotation={[-0.05, -0.07, 0.08]}>
          <boxGeometry args={[0.26, 0.22, 0.28]} />
        </mesh>
        <mesh material={palette.ink} position={[0.24, 0.86, -0.2]} rotation={[-0.05, 0.08, -0.06]}>
          <boxGeometry args={[0.26, 0.24, 0.28]} />
        </mesh>
        {/* L3 — side-swept front fringe: uneven lengths break the hairline */}
        <mesh material={palette.ink} position={[-0.26, 0.74, 0.47]} rotation={[0.1, 0.02, 0.14]}>
          <boxGeometry args={[0.22, 0.22, 0.14]} />
        </mesh>
        <mesh material={palette.ink} position={[-0.07, 0.76, 0.49]} rotation={[0.09, 0, 0.1]}>
          <boxGeometry args={[0.22, 0.2, 0.14]} />
        </mesh>
        <mesh material={palette.ink} position={[0.13, 0.78, 0.48]} rotation={[0.07, 0, 0.06]}>
          <boxGeometry args={[0.22, 0.17, 0.14]} />
        </mesh>
        <mesh material={palette.ink} position={[0.3, 0.79, 0.45]} rotation={[0.05, 0, 0.03]}>
          <boxGeometry args={[0.2, 0.15, 0.14]} />
        </mesh>

        {/* eyes — blink group scales; each eye rotates about its own center */}
        <group ref={blinkRef} position={[0, 0.5, 0]}>
          <group ref={eyeLRef} position={[-0.19, 0, 0.36]}>
            <mesh material={palette.offwhite} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.125, 12, 8]} />
            </mesh>
            <mesh material={palette.ink} position={[0, 0, 0.065]}>
              <sphereGeometry args={[0.07, 10, 8]} />
            </mesh>
          </group>
          <group ref={eyeRRef} position={[0.19, 0, 0.36]}>
            <mesh material={palette.offwhite} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.125, 12, 8]} />
            </mesh>
            <mesh material={palette.ink} position={[0, 0, 0.065]}>
              <sphereGeometry args={[0.07, 10, 8]} />
            </mesh>
          </group>
        </group>

        <Glasses material={palette.ink} />

        {/* mouth */}
        <mesh material={palette.inkSoft} position={[0, 0.16, 0.415]}>
          <boxGeometry args={[0.16, 0.035, 0.03]} />
        </mesh>
      </group>
    </group>
  );
}

export default function Avatar({
  className,
  accent = ACCENT_DEFAULT,
  compact = false,
  gesture,
}: AvatarProps) {
  /* ssr:false contract — but stay safe if evaluated on a server anyway. */
  const [webgl] = useState<boolean>(() =>
    typeof document === "undefined" ? false : canUseWebgl(),
  );
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(pointer: fine)");

  if (!webgl) return null;

  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%" }}
      role="img"
      aria-label="Low-poly 3D avatar"
    >
      <Canvas
        flat
        dpr={[1, 2]} /* cap devicePixelRatio at 2 */
        frameloop={reducedMotion ? "demand" : "always"}
        camera={{ fov: 32, position: [0, 1.82, 8.1], near: 0.1, far: 30 }}
        fallback={null}
      >
        {/* flat lighting: high ambient + weak key so faces render close to
            their base swatches instead of shading down into brown */}
        <ambientLight intensity={0.78} />
        <directionalLight position={[3.5, 6, 4]} intensity={0.24} />
        <CameraRig compact={compact} />
        <Figure
          accent={accent}
          compact={compact}
          reducedMotion={reducedMotion}
          tracking={finePointer && !reducedMotion}
          gesture={gesture}
        />
        <ContactShadows
          position={[0, 0.001, 0]}
          scale={5}
          far={2}
          blur={2.2}
          opacity={0.45}
          frames={1}
          color="#0A0A0A"
        />
      </Canvas>
    </div>
  );
}
