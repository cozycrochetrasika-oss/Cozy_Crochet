---
name: cinematic-animation
description: >
  Use when choreographing motion for a premium feel: page entrance, hero reveals, text/image
  reveals, staggered components, scroll-driven storytelling, pinned sections, horizontal scroll
  narratives, parallax, clip-path/masked transitions, scale transitions, and orchestrating GSAP
  timelines with Motion and WebGL. Invoked by prompts like "make the hero reveal dramatic",
  "animate this section on scroll", "choreograph the page entrance", "add a text reveal",
  "orchestrate scroll + 3D camera animation".
---

# Cinematic Animation

Purposeful, choreographed motion is the fastest path to a premium feel — and the fastest path to
a bad one when overdone. This skill guides the build.

## Primary tools

- **GSAP** (`gsap`) — timeline/choreography engine; use timelines + `stagger`, `clipPath`,
  `attr`, `data-*`, and CSS variables via `gsap.to`.
- **ScrollTrigger** (`gsap/ScrollTrigger`) — scroll-driven triggers, pinning, scrub, progress.
- **Motion** (package `motion`, import `motion/react`) — React component-level animation,
  `whileInView`, `useScroll`/`useTransform`, `useMotionValue`, `AnimatePresence`;
  spring/ease presets. Never import from `framer-motion`.
- **Lenis** — smooth scrolling; drives wheel/touch velocities that GSAP ScrollTrigger consumes
  (`lenis.on('scroll', ScrollTrigger.update)` integration). See `scroll-storytelling`.
- **CSS transitions/animations** where simpler (hover states, micro-transitions, `@media
  (prefers-reduced-motion)` toggles).
- **Three.js animation** for WebGL objects (via `useFrame`, GSAP timelines over scene state).
  See `3d-web-design`.

## Techniques catalog

- **Staged page entrance** — a deliberate opening sequence: overlay/mask lifts → hero headline
  resolves → supporting imagery slides · stagger, plain or no animation. Never "every element
  fades in simultaneously".
- **Hero reveal** — headline as centerpiece; animate y + blur + opacity with one strong easing
  (`power4.out`), a slight stagger for overline/title/CTA.
- **Text reveal** — line-mask or word stagger reveals (clip-path + `yPercent`, or split into
  spans/wrappers). Use `power3.out`, small stagger, keep readable (avoid excessive per-character
  bounce).
- **Image reveal** — clip-path inset reveal + inner image scale (`scale: 1.15 → 1`) with an
  overflow-hidden mask. Signature premium move; use consistently, not on every asset.
- **Staggered components** — when several like items enter (grid, list), stagger entrance
  0.06–0.12 s each; don't slide drastically (translate > 40px reads noisy).
- **Scroll-driven storytelling** — elements respond to scroll progress (see `scroll-storytelling`).
- **Pinned sections** — heavy scroll jacking is risky; pin only where the story demands
  (a product reveal, a comparison, a 3D transformation).
- **Horizontal scroll narratives** — a pinned viewer that translates a track horizontally;
  include a progress indicator and a well-defined end (see `scroll-storytelling`).
- **Parallax** — depth layers at subtly different speeds (1.05–1.25 range). Avoid racing
  foreground/background images.
- **Clip-path reveals** — circle/inset/polygon reveals on containers; elegant and performant
  (only animates clip-path, which is compositable in most browsers).
- **Scale transitions** — modal/lightbox entrance `scale 0.96 → 1 + fade` with
  spring/bounce-free easing.
- **Masked transitions** — section-to-section reveals via masked containers or gradient masks.
- **Camera choreography** — with 3D (see `3d-web-design`): eased dolly/pan to land on the hero.
- **Synchronized DOM + WebGL** — one timeline controls both: GSAP timeline with callback events
  to a scene store, or ScrollTrigger progress shared between DOM transforms and `useFrame` scene
  state. Never run two competing scroll listeners.

## Principles

- **Prefer purposeful animation**: each movement explains hierarchy or tells the story; remove
  anything that doesn't.
- **Realistic timing and easing**: entrances 0.5–0.9 s; scroll-coupled motion uses easing or
  scrubbed direct mapping; hover states 150–250 ms. Overshoot only for gradeful emphasis.
- Look, for tuning help, at the Motion skill (`/motion`) — CSS springs and easing curves can be
  generated there.

## Anti-patterns

- **Constant bouncing** — springs with high bounce everywhere feel cheap and tiring.
- **Excessive spring effects** — springs are for UI micro-interactions, not page reveals.
- **Animation overload** — every element animating constantly causes motion sickness,
  especially combined with smooth scroll + parallax + particles. Choose ≤ 2 motion systems per
  section (e.g. image reveal + subtle parallax).
- **Slow transitions that block usability** — entrances > 1 s or heavy animations retriggering
  on every element delay interaction; keep the primary CTA reachable quickly.
- **Unnecessary JavaScript animation** — pure CSS transitions are better for 90% of hover/
  active states. Reserve JS motion for choreography.

## Accessibility

- Always honor `prefers-reduced-motion`: global `[data-reduced-motion]` or `MediaQueryList`.
  Provide a fully static state (elements visible, no transforms) faithfully representing content.
- Frantic motion · repeated blinking · strobing must be avoided.
- Motion must not hide content: if something is animating out, ensure it's accessible or it has
  a stable twin.

## Implementation pattern (React)

Keep all animation constants in one module (durations, eases, spans) so the whole site shares
timing. Example tone — but do not over-abbreviate to the point of jank:

- Build a small `useInView` (or use Motion’s `whileInView`) for section entrances.
- Use `ScrollTrigger` via `gsap.context` inside `useLayoutEffect` **and** `gsap.context.revert()`
  in cleanup to avoid leak (especially in React StrictMode).
- Scope selectors (`gsap.utils.toArray('.js-reveal', section)`) to avoid global collisions.

## Deliverable

When animating, state what system you chose (entrance / scroll / micro) and the timing scale
used, so future edits stay consistent.