# DESIGN.md — omsharma.dev (working name)

Read this file at the start of EVERY session before writing any code. Never
deviate from it without asking Om first.

## The one-line vision
A paper-textured editorial website (typography and texture of ojasmutreja.com)
that is quietly visual everywhere — ink-style illustrations, small diagrams,
marginalia — with one hero moment: a low-poly 3D avatar of Om that follows
the cursor (inspired by neelmanimishra.com).

## Hard rules
1. Restraint is still the aesthetic, but every page should carry at least one
   visual element (illustration, diagram, or motif) — pure walls of text are
   not allowed. Visuals must look hand-set in ink on paper, never "web flashy".
2. The 3D avatar is the hero, not the only visual. Supporting visuals are
   welcome BUT: no parallax sections, no scroll-jacking, no floating gradient
   blobs, no glassmorphism, no autoplaying video.
3. No generic "AI website" looks: no purple gradients, no dark hero with neon
   accent, no Inter-everywhere.
4. Content is markdown/MDX files. Updating /now must never require touching code.
5. Mobile first-class: avatar degrades to idle animation (no cursor on touch).

## Palette (named tokens — warm gray + ink, one accent)
The reference site uses a warm-gray system, not cream. Adopt it, keep Om's
blue accent as the differentiator (the reference is fully monochrome).
- Background: #EFEFED (warm gray, not pure white)
- Surface (cards, filled areas): #E8E8E6
- Ink (primary text): #0A0A0A
- Muted (secondary text): #9A9A98
- Ghost (borders, dividers, hairlines): #C4C4C2
- Drape (page-transition curtain, footer bg if wanted): #1C1C1A
- Accent (links, hover, hoodie drawstrings, one highlight per motif):
  deep blue #2B4C7E — used sparingly; this is Om's, not Ojas's.
- Grain: SVG feTurbulence, baseFrequency 0.65, ~4% opacity,
  mix-blend-mode: overlay, position: fixed over everything.

## Typography (THREE fonts only — each with one clear job)
All free via next/font/google. Do NOT introduce a fourth font.
- **Fraunces** — ALL display/headings, including the big hero name. Weight 400,
  letter-spacing -0.02em. This owns every large text moment: hero name "Om
  Sharma", section headings ("Work"), project names, and italic taglines.
  Hero intro line ("Hello, this is") uses Fraunces at a smaller size; the
  tagline uses Fraunces italic.
- **Plus Jakarta Sans** — body, UI, captions, sub-lines. Weight 400. (e.g. the
  "Currently learning..." line and the About paragraph.)
- **IBM Plex Mono** — tags, dates, nav eyebrows, "GITHUB/LIVE" labels, the
  01/02/03 numbers. Small, uppercase + letter-spaced for nav/eyebrows.
- REMOVED: DM Sans. The hero name is now Fraunces, not DM Sans — a second sans
  next to Plus Jakarta Sans clashed. Delete the DM Sans import/usage entirely.
- Use Fraunces italics deliberately: taglines, asides, pull-quotes, captions.

### Type scale (φ ratio, rooted at 112px — sibling of the reference's 128)
112 → 69 → 43 → 26 → 16.5 → 10px, each step ÷ φ (1.618). The SAME ratio governs
every spacing token — nothing arbitrary. Scale down proportionally on mobile.
- Generous line-height (1.6+ body), max text width ~65ch.

## Layout
- Single centered column, max-width ~720px for text pages.
- Home is the only wider page (avatar + intro side by side on desktop,
  stacked on mobile).
- Thin hairline dividers between sections. Lots of whitespace. No cards with
  drop shadows — use hairline borders if separation is needed.
- Footer on every page: email · GitHub · LinkedIn · resume · colophon note.

## Visual language (how the site gets visual without getting loud)
All illustrations are inline SVG, single ink color (#0A0A0A) with the accent
blue used sparingly, thin strokes (1–1.5px), slightly imperfect hand-drawn
feel. Think marginalia in a well-loved notebook.
- Home: the 3D avatar (hero) + small ink doodles as nav/section accents.
- /work: each project card gets a small bespoke SVG motif drawn from the
  project itself — GradeOps: a handwritten answer sheet with a checkmark;
  Delhivery: a node-and-edge graph with one hub highlighted in accent blue;
  FixIt: a map pin over street lines. On hover, the motif animates subtly
  (a line draws itself, a node pulses) — under 400ms, ease-out.
- /now: a small "currently" dashboard feel — tiny inline sparkline or
  progress marks next to each block, still in ink style.
- /about: one illustrated element (e.g. a small desk-scene doodle or an
  annotated arrow pointing at the CGPA aside saying "fine, one flex").
- Marginalia allowed sitewide: hand-drawn arrows, underlines, circled words,
  asterisked footnotes in mono.

## /work page layout (Ojas-style index)
- Huge Fraunces display "Work" heading, then an italic one-line intro:
  "Three projects. Each one built around a problem I couldn't ignore."
- "Filter by stack:" row of small mono pill buttons (All / Python / FastAPI /
  React / Next.js / XGBoost / Firebase ...) — filters the cards client-side.
- Cards in a wide grid (wider than the 720px text column): each card =
  mono number eyebrow (01 / 02 / 03), large serif project name, one-line
  italic tagline (from CONTENT.md), the project's SVG motif, tags.
  Whole card is a link to its dedicated page. Hover: motif animates, title
  gets underline draw-in.

### Scroll-snap sections ("The Reel") — the work index reads as full panels
Instead of a plain scrolling grid, /work is a sequence of full-viewport panels
the scroll SNAPS between (like a deck): intro panel → project 01 → project 02
→ project 03 → closing "more on GitHub" panel.
- CSS scroll-snap (scroll-snap-type: y mandatory; each panel snap-align: start)
  — CSS-driven, no scroll-jacking library, so keyboard/trackpad/mobile all
  behave natively and a user can still flick through fast.
- Each project panel: big serif name + tagline on one side, its large SVG motif
  on the other, tags + "view project →" linking to /work/[slug].
- On panel enter, that panel's content runs the Emergence reveal once; the SVG
  motif runs its Sketch draw-in.
- The docked avatar (The Dock) is visible in the bottom corner throughout the
  reel and stays put between snaps.
- Respects prefers-reduced-motion: snapping stays (it's native + accessible)
  but the reveal/draw animations become instant.
- Mobile: panels stack full-height and snap the same way; motif above text.
- Must remain fully navigable if JS is disabled (snap is pure CSS; links work).

## Project detail pages — /work/[slug] (one per project, MDX-driven)
Slugs: /work/gradeops, /work/delhivery, /work/fixit
Template for every project page:
1. Hero: mono number + tags, huge serif title, italic tagline, links row
   (GitHub / demo), the project's SVG motif set large.
2. Sections with mono eyebrows: THE PROBLEM → WHAT I BUILT → HOW IT WORKS →
   RESULTS (key numbers set large in serif, stated once, dryly) → STACK.
3. Footer nav: ← previous project / next project →
Section content is derived from the project paragraphs in CONTENT.md —
do not invent new claims or numbers.

## Custom cursor — "The Ghost" pattern (desktop only)
- 8px ink dot + 32px hollow ring on hover, following the pointer via
  Framer Motion useSpring with ~80ms lag; native cursor hidden.
- Applies on pointer:fine devices only (CSS media query, not UA sniffing).
- On hover over any interactive element (links, cards, pills, avatar):
  dot grows into the ring (1.5px stroke), content visible through it.
- Over the avatar it may tint accent blue.
- Disabled when prefers-reduced-motion is set (native cursor restored).
  Must never delay or offset real clicks.

## Micro-interactions — every animation gets a NAME (the reference discipline)
Naming forces intent and makes the colophon writable. Om's set:
- **The Ghost** — the custom cursor (spec above).
- **The Drape** — page-transition curtain in dark ink #1C1C1A. Motion: a solid
  panel RISES UP from the bottom edge to fully cover the screen, then (on the
  new page) LIFTS AWAY upward off the top edge to reveal it. Each half ~450–
  550ms, ease-in-out, GPU-composited (transform: translateY only, full-viewport
  fixed overlay, high z-index). Must fire on navigation INTO a project detail
  page (home/#work → /work/gradeops, /work/delhivery, /work/fixit) and on the
  "← back to work" navigation. Optional micro-detail: a small centered mono
  label or the project name can fade in on the covered frame. Skipped entirely
  under prefers-reduced-motion (instant route change, no curtain). Ensure it
  never traps clicks after revealing (overlay must be pointer-events:none /
  unmounted once lifted).
- **The Grain** — fixed feTurbulence texture layer (spec in Palette).
- **The Lift** — card hover: translateY(-6px) + drop-shadow filter,
  400ms, GPU layer, never clipped by parent overflow.
- **Emergence** — scroll-triggered reveals: whileInView, opacity + y,
  fires once, staggered children, <500ms.
- **The Sketch** — SVG motif hover animations (lines draw themselves,
  one node pulses), under 400ms ease-out. This one is Om's own.
- **The Watcher** — all avatar behaviors (tracking, blink, wave).
- **The Dock** — the persistent avatar's hero→corner shrink/park transition
  (spec in the avatar section).
- **The Reel** — the /work scroll-snap panels (CSS scroll-snap, native, spec
  in the /work section).
- Link underlines draw in on hover; nav ink→accent transitions;
  ::selection in accent blue.
Anything not on this list requires asking Om first. Do NOT copy the
reference's rotating text badge, star canvas, or sound system — the
avatar is Om's hero and adding theirs on top would make it a clone.

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind
- Framer Motion for all named animations (AnimatePresence for The Drape,
  useSpring for The Ghost, whileInView for Emergence)
- Content: MDX files in /content (now.mdx, about.mdx, work/*.mdx)
- Deployed on Vercel
- OG images via next/og (edge runtime, 1200×630, per-page)
- No CMS and no database for now. (The reference runs a custom Supabase
  CMS at /admin so pages update without redeploys — nice, but overkill
  for phase 1–4. Possible phase 5 along with a guestbook. MDX + git push
  is Om's redeploy button and costs nothing.)

## The avatar (phase 3 — do NOT build in phase 1)
The 3D character component ("The Watcher") is built separately from
AVATAR_SPEC.md. This section covers PLACEMENT + the dock, which Opus wires in.

### "The Dock" — a THREE-STATE avatar (this is the exact intended behavior)
The avatar is mounted ONCE in the root layout (persists across routes, never
unmounts). Its state is driven by WHICH section is currently active (a single
scroll-position / IntersectionObserver signal), with exactly three states.
CRITICAL: the entrance animation must fire only ONCE on a state CHANGE — it must
NOT re-trigger every time a new section scrolls into view. The current bug is
that it re-animates in each section; fix by animating on state transitions only.

STATE A — Intro (#intro active): avatar LARGE, full body, positioned right of
the hero text (stacked above on mobile). Cursor-tracking on.

STATE B — About (#about active): avatar HIDDEN. Fade + slide out (~400ms) so it
disappears entirely while the user reads About. (About has its own desk/laptop
doodle; the 3D avatar would compete with it.) No corner avatar during About.
IMPORTANT — trigger EARLY so the large hero avatar never lingers into / collides
with the About section: switch OUT of State A as soon as the user starts leaving
the intro (e.g. once the intro section is ~40–50% scrolled past, or the About
section's top crosses ~70–80% of the viewport height — a HIGH rootMargin /
threshold), not only when About is fully in view. The hero avatar must be fully
gone before the ABOUT eyebrow and desk doodle reach mid-screen. Err on hiding
too early rather than too late.

STATE C — Work / Now / Contact (#work, #now, or #contact active): avatar DOCKED
in the fixed bottom-right corner, FULL body, cursor-tracking. It appears ONCE
when Work first becomes active (slide in from the right edge, ~450ms), then
STAYS PUT and static (only head/eyes react to the cursor) for the rest of the
page. It must NOT re-animate, re-pop, or slide again when moving Work→Now→
Contact — those are the same state C, so nothing re-triggers.

### Dock sizing & placement (fix: must be FIXED to the screen corner, and LARGER)
- The docked avatar must be `position: fixed` to the VIEWPORT's extreme
  bottom-right corner — NOT placed inside a section's layout flow, and NOT
  floating in the middle-right near the text. It stays pinned to the bottom-
  right of the screen as the user scrolls.
- Anchor it tight to the corner: roughly right: 16–24px, bottom: 16–24px.
- Size it LARGER: target ~220–260px tall (full body head-to-sneakers visible).
  The current ~100–120px is too small. It should read as a clear little figure
  in the corner, not a tiny icon.
- It must sit ABOVE page content (high z-index) but must never cover body text
  in the reading column — the bottom-right corner is chosen precisely because
  the text column is centered/left, so they don't collide on desktop.
- On small mobile, shrink to ~140–160px or hide below a scroll threshold so it
  never covers content.

### Transition quality
- All state changes are single GPU-composited transforms (opacity + translate +
  scale), ~400–600ms ease-in-out. Smooth, never jumpy or jittery.
- Respect prefers-reduced-motion: states switch instantly (no animation).
  Touch: idle only, no cursor tracking.

### Implementation notes for whoever builds this
- Derive ONE "activeSection" value (intro | about | work | now | contact) from
  IntersectionObserver on the section elements. Map work/now/contact → state C.
- Keep the avatar element persistent; only its wrapper's style/variant changes
  per state. Do NOT unmount/remount it between states (that causes the reload
  fl/ re-pop). Use a single AnimatePresence/variants setup keyed by state, not
  by section, so Work→Now→Contact does not re-fire.

### The character (built in AVATAR_SPEC.md — summary for reference)
Low-poly blocky college student: light-medium wheatish skin, clean short
side-swept dark hair, refined rectangular ink glasses, black hoodie
(accent-blue drawstrings), denim jeans (accent-family #8FA6C4), off-white
sneakers. NO headphones. Head + eyes track cursor (both eyes symmetric at all
angles); blinks; idle sway; gesture set on click — wave, nod, shrug, thumbs-up.
Lazy-loaded, fully usable page before it loads.

## Site structure — ONE flowing homepage + separate project detail pages
The homepage is a single continuous vertical scroll of full sections in this
order. The top nav is anchor links that smooth-scroll to each section (like
neelmanimishra.com). Project DETAIL pages stay as their own routes.

### Homepage section flow (in order)
1. **Intro (#intro)** — hero: big DM Sans name "Om Sharma", Fraunces italic
   tagline, one-line intro, the 3D avatar on the right (large). Nav sits at top.
2. **About (#about)** — the /about paragraph content (single column, the
   about copy from CONTENT.md), one illustrated element. CGPA aside appears
   here, once.
3. **Work (#work)** — the three project cards (numbered eyebrows, big serif
   names, italic taglines, SVG motifs). Each card links OUT to its detail page
   (/work/gradeops, /work/delhivery, /work/fixit).
4. **Now (#now)** — the /now blocks (Learning / Grinding / Building).
5. **Contact / footer (#contact)** — closing line + email · GitHub · LinkedIn
   · Resume. A warm sign-off sentence (Om's version of a closing note).

### Nav behavior
- Fixed/sticky top nav: INTRO · ABOUT · WORK · NOW · CONTACT (mono, uppercase).
- Clicking scrolls smoothly to that section (CSS scroll-behavior:smooth + scroll-
  margin-top offset so headings aren't hidden under the sticky nav).
- Active section highlights in the nav as you scroll (IntersectionObserver).
- The avatar docks to the corner (The Dock) once you scroll past the Intro
  section, and stays docked through About/Work/Now/Contact.
- Respects prefers-reduced-motion (instant jump instead of smooth scroll).

### Detail pages (unchanged, separate routes)
/work/gradeops, /work/delhivery, /work/fixit keep the full case-study template.
From a detail page, a "← back to work" link returns to /#work.

## Pages (build order)
Phase 1: single-page homepage (all 5 sections) + 3 project detail pages + 404
Phase 2: texture, typography polish, hover details, OG images, favicon
Phase 3: 3D avatar + The Dock
Phase 4 (later, when Om asks): /fragments, /shelf, /playground, /colophon,
/guestbook

## Thoroughness checklist (the Ojas standard — every phase must pass this)
The reference site feels hand-finished because NO surface is default.
Before calling any phase done, verify:
- [ ] 404 page has personality (serif headline, one doodle, link home)
- [ ] Favicon + apple-touch-icon (a tiny ink version of the avatar's face)
- [ ] Unique <title> + meta description + OG image per page
- [ ] "Last updated" mono stamp on /now (auto-read from the MDX file date)
- [ ] Every interactive element has BOTH a hover state and a visible
      keyboard :focus-visible state
- [ ] Selection color (::selection) set to accent blue on paper
- [ ] Footnotes/marginalia rendered properly where used (mono asterisk
      markers, small italic notes)
- [ ] Filters, prev/next links, and all internal links actually work —
      no dead hrefs, no "#"
- [ ] Print stylesheet at least doesn't break (recruiters print pages)
- [ ] Lighthouse: accessibility and SEO ≥ 95; page usable with JS disabled
      except avatar and filters
- [ ] A /colophon page exists by phase 4 documenting: the stack, the φ
      type scale (shown live, like the reference), the color tokens, every
      named animation with one-line specs, and credits — fonts (Fraunces
      by Undercase Type; Plus Jakarta Sans by Tokotype), tools, and both
      inspiration sites linked by name. Honest credit, exactly what
      they'd do.

## Voice for all copy
First person, lowercase-friendly, plain and a little playful. Short sentences.
Confident but never bragging. Numbers are stated once, dryly, and never
repeated ("MAE 27.8 min vs OSRM's 107.8" is enough — no exclamation marks).
