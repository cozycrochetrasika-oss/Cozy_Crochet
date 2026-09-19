---
name: scroll-storytelling
description: >
  Use when building scroll-driven experiences: Lenis smooth scroll setup, GSAP ScrollTrigger
  pins/scrub, scroll progress visualization, horizontal scroll narratives, scroll-linked 3D camera
  movement, image/text transformations tied to scroll position, and scroll lifecycle cleanup in
  React/Next. Invoked by prompts like "add smooth scrolling", "pin this section on scroll",
  "make a horizontal scroll section", "drive the camera with scroll", "progress bar on scroll".
---

# Scroll Storytelling

Turn the scrollbar into a narrative tool. Calm, deliberate, and accessible — never a fight with
the user.

## Core tools

- **Lenis** (`lenis`) — smooth scrolling: velocity normalization creates the premium glide and,
  crucially, exposes smooth scroll values for everything else. Set `gsap.ticker` to drive
  `lenis.raf` and `lenis.on('scroll', ScrollTrigger.update)`.
- **GSAP ScrollTrigger** — pinning, scrub, triggers, progress callbacks; use `gsap.context()` +
  `ctx.revert()` for cleanup; register plugin via `gsap.registerPlugin(ScrollTrigger)`.
- **Motion** — `useScroll`/`useTransform` for scroll-linked react state when not using GSAP.

## Capabilities

- **Lenis smooth scroll**: instantiate `new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001
  - Math.pow(2, -10 * t)) })`; connect to GSAP ticker in a layout effect; destroy on cleanup.
  Also call `lenis.stop()` when a modal is open.
- **Scroll progress**: expose normalized scroll progress (`0…1`) for progress indicators,
  parallax offsets, section highlight, and 3D camera state.
- **Pinned sections**: `ScrollTrigger.create({ trigger, start, end, pin: true, scrub })` — pin
  only for meaningful transformations (product morph, comparison, step-by-step). Each pin must
  have a defined start and end; always give the pinned element `overflow: hidden` and a
  reasonable duration (avoid 10-screen pins).
- **Horizontal narratives**: pin a viewport rail and translate a horizontal track
  (`x: () => -(track.scrollWidth - viewportWidth) * progress`); add a progress bar and a clear
  terminus so pinned user control never surprises.
- **3D camera movement**: drive scene state from scroll progress (see `3d-web-design`) — one
  eased value, no scroll-listener thrash.
- **Image transformations**: scale/crop reveals, `clip-path` for images, `transformOrigin`
  transitions, parallax stacks — all transform/opacity based.
- **Text transformations**: position, opacity, letter-spacing, mask reveals tied to progress;
  avoid animating `height`/`width` directly (layout thrash).
- **Section synchronization**: multiple triggers share one master timeline that reads progress
  from one source (Lenis) rather than re-reading `window.scrollY` per frame.

## Correct cleanup and lifecycle (React/Next)

- `useLayoutEffect` + `const ctx = gsap.context(() => { …triggers/tweens… }, ref)`.
- `ctx.revert()` in cleanup — this kills triggers and rewinds inline styles. Required in
  StrictMode double-mount.
- Lenis: `const lenis = new Lenis()` … `lenis.destroy()` in cleanup; null the instance.
- In Next.js: only run in `useEffect`-style client contexts; guard SSR (no `window`).
- `ScrollTrigger.refresh()` after images/fonts load and after route changes.

## Accessibility / usability rules

- **Do not hijack scroll harmfully** — users must be able to stop, skip, or close any pinned
  section; scroll speed changes must not impair reading or trap users. `prefers-reduced-motion`:
  disable pins/scrub; show the content statically stacked.
- Ensure pinned sections have semantic content reachable by keyboard and that pinned elements
  don't break the reading order for assistive tech.
- Mobile: pinned sections and horizontal rails frequently pain touch users. **Make mobile
  behavior intentionally different** — stack the horizontal/parallax content into normal vertical
  flow on small screens, reducing or removing pinning.
- Provide a fallback when reduced-motion: content renders fully, in order, with no transforms.

## Anti-patterns

- Fighting native scroll (velocity multipliers on the body, forced snap without consent).
- Pinning more than one section at once; overlapping triggers with conflicting progress.
- Scroll-linked animation keyed to `window.scrollY` without rAF-throttling and Lenis.
- Animating layout properties (`top`, `height`, `margin`) for scroll effects — use transforms.
- Leaving ScrollTrigger created in an unmounting component (leak → stale pins).

## Implementation pattern

This Cozy Crochets storefront benefits from: Lenis at the root, hero product reveal on scroll
(slight scale + parallax), a pinned "craft: how a rose is made" storytelling section
(image/video steps scrubbed), and section entrance reveals — all driven by one ScrollTrigger
context per page component.

When invoking this skill, output: the scroll system chosen, each pin/trigger list with
start/end, and how reduced-motion is handled.