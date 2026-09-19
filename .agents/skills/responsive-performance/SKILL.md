---
name: responsive-performance
description: >
  Use when making sites responsive and fast: testing/designing at 320–1920 px widths, image
  optimization, lazy loading, WebGL/GPU budgets, avoiding layout thrash and rerender storms,
  bundle-size control, transform/opacity-only animation, and responsive image strategies.
  Invoked by prompts like "make this responsive", "the site is slow/laggy", "reduce bundle size",
  "optimize the images", "it stutters when scrolling".
---

# Responsive & Performance

Performance is a feature. A premium feel dies with a janky scroll or a 5 MB page.

## Responsive breakpoints you must design and test

320 · 375 · 414 · 768 · 1024 · 1280 · 1440 · 1920 px.

- Mobile-first CSS (base = 320/375, then `sm/md/lg/xl` up).
- Fluid type via `clamp()` for display sizes; container widths with `max-w` tokens + gutters.
- Test at real device factor (DevTools device emulation, Chrome DevTools MCP / Playwright at
  these widths). Check nav collapse, hero framing, gallery swipe, sticky elements, tap target
  sizes.
- Horizontal overflow is a bug: verify no element exceeds `100vw` at every width.

## Optimize

### Images
- Responsive images: `srcSet`/`sizes`, or a CDN/loader data-URL strategy; serve WebP/AVIF
  (`<picture>` or image loader) sized per breakpoint.
- Every product in this repo has folders with `main`, `Single`, `Bundle`, extras + `Video.mp4`.
  Plan a pipeline: derive responsive width set (400/800/1200), encode WebP, keep originals for
  lightbox; `loading="lazy"` for below-the-fold, `fetchpriority="high"` + preload for the LCP
  image, `decoding="async"`, explicit `width`/`height` (no CLS). Videos: poster from `main`,
  `preload="metadata"`, `muted playsinline loop` only where needed, provide WebM/MP4 alternates.

### Textures / 3D models
- Cap texture sizes per surface; compress models (Draco/Meshopt), merge meshes, reuse materials,
  instance repeats.

### Draw calls / WebGL
- Target < 100–200 draw calls desktop (< 50 strong mobile), merge static geometry.

### Animation loops
- `transform`/`opacity` only (they run on the compositor); `will-change` sparingly.
- Pause loops off-screen (IntersectionObserver); reduce `dpr` on mobile; disable particles/
  post-processing on weak GPUs (see `3d-web-design`).

### Layout thrashing
- Batch reads and writes; avoid reading `offsetWidth` mid-animation; use transforms not
  `top`/`left`/`height`; one scroll listener → Lenis, not many raw listeners.

### Excessive React rerenders
- Context value memoization; split contexts; `React.memo` where props change rarely; keep 3D
  state out of React state (update via refs in `useFrame`); `useDeferredValue` for search
  inputs; prefer derived data over effects for calculations.

### Unnecessary effects
- Review `useEffect`/`useLayoutEffect` usage; combine; remove empty deps; keep state that
  doesn't render.

### Bundle size
- Route-level code-splitting (Next `dynamic()`, React.lazy), lib splitting (three, gsap on
  demand), tree-shake icons, avoid `import *` from lodash-style deps, monitor with
  `Analyzer`/`visualizer` in prod build. Target: first contentful paint < 1.8 s on mid-tier
  mobile, total JS < 250–350 KB gzipped for a storefront like this.

## Prefer
- transform/opacity animations (compositor).
- Lazy-load heavy assets (below-the-fold images, three scene, videos).
- Responsive image strategies over "one big JPEG".
- `content-visibility: auto` for below-fold sections in supported browsers (careful with
  search/SEO in some setups).

## Never
- Sacrifice usability for effects — visual tricks must not block LCP, reading, or scrolling.
- Ship a fixed 8 MB hero JPEG "because it looks best" — encode it properly.
- Block first paint on a 3D scene: critical UI first, WebGL mounts after.

## Dev workflow
- `npm run build` must pass without warnings that indicate dead code.
- After optimization, rerun `visual-qa` at all breakpoints; verify Lighthouse
  (Perf ≥ 90 mobile, no large CLS) with available browser tooling.
- Document measured budgets in `AGENTS.md`/`SETUP.md` so regressions are visible.