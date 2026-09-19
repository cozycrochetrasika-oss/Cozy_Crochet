# DESIGN_SYSTEM.md — Cozy Crochets

A flexible, token-based design system for the premium storefront. This document defines the
*what and why* of visual decisions. Keep it theme-agnostic: rather than forcing one visual
theme, it establishes a consistent system any future page can build on. All values are **design
tokens** — components must reference tokens, never raw values.

## 1. Typography

- **Families** (choose per build, but pick 1 serif/sans display + 1 text face, not more):
  - Display: a confident serif (e.g. Fraunces, Playfair Display) or grotesque (e.g. Space
    Grotesk, General Sans / Instrument Sans) for headlines and prices.
  - Body: a neutral text face (Inter, Plus Jakarta Sans, DM Sans) with strong legibility at small
    sizes.
  - Numbers/prices: tabular figures (`font-variant-numeric: tabular-nums`) so hover counts and
    prices don't shift.
- **Type scale** — use a fluid `clamp()`-based scale, mobile-first. Target ratio ≈ 1.25:

| Token | Min | Max | Use |
|---|---|---|---|
| `display` | 2.5rem | 5rem | Hero headline, section titles (tight line-height 0.95–1.05) |
| `h1` | 1.75rem | 3rem | Page titles |
| `h2` | 1.375rem | 2rem | Section headings |
| `h3` | 1.125rem | 1.375rem | Card / block titles |
| `body` | 1rem | 1rem | Copy (line-height 1.5–1.7) |
| `small` | 0.8125rem | 0.875rem | Captions, meta, footnotes |
| `overline` | 0.6875rem | 0.75rem | Kerning + `uppercase`, letter-spacing 0.08–0.12em, labels |

- **Weights**: 400/500 body, 600–700 for emphasis and buttons, 700–900 sparingly for display.
- **Measure**: body text 45–75ch; display lines break intentionally.

## 2. Spacing scale

Base unit **4px**; scale in multiples. Use tokens, never ad-hoc px:

`space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 ·
`space-8` 32 · `space-10` 40 · `space-12` 48 · `space-16` 64 · `space-20` 80 · `space-24` 96 ·
`space-32` 128.

- **Section rhythm** (vertical padding): `space-24`–`space-32` desktop, `space-16`–`space-20`
  mobile.
- **Component rhythm**: 8/12 px inside controls, 16/24 px inside cards and modals, 24/32 px
  between gallery thumbs.
- **Gutter**: 16 px mobile → 24/48/80 px at desktop container width (`container` + `mx-auto`,
  `max-w` ~ 1200–1280 px).

## 3. Radius guidance

Consistent, calm rounding — small radii read premium-er than bouncy pill-everywhere:

- `radius-sm` 4px — inputs, small labels.
- `radius-md` 8px — buttons, cards, media frames.
- `radius-lg` 12–16px — modals, lightbox, big panels.
- `radius-full` — only for pills/tags/avatars.
- Rule: pick one "hero radius" and repeat it; vary deliberately, not per-element. Product media
  (the star of the page) can use a tighter corner or sharp edge for editorial contrast.

## 4. Color token methodology

Name colors **semantically** (role → value), in HSL/OKLCH or semantic CSS variables. Prefix
`--color-`. Adjust for dark/light bodies through token overrides, not raw swaps.

### Cozy_Crochets Brand Palette

| Token | Hex | Role |
|---|---|---|
| `cream` | `#FFF8F1` | Primary page canvas, warm light atmosphere |
| `blush` | `#F1C6C0` | Soft surface tint, secondary cards |
| `dustyRose` | `#DFA7AD` | Primary brand accent, actions, CTAs |
| `lavender` | `#C9B7E8` | Tertiary craft accent, highlights |
| `sage` | `#B8D1BF` | Botanical accent, badges, success states |
| `cocoa` | `#493630` | Subdued dark neutral, borders, muted text |
| `warmGold` | `#CDA567` | Metallic craft tone, star ratings, premium seals |
| `ink` | `#241D1A` | High-contrast body & display typography |

### Core Semantic Roles

| Token | Purpose | Value Mapping |
|---|---|---|
| `--color-bg` | Page background | `var(--color-cream)` |
| `--color-surface` | Cards, panels, raised regions | `#FFFFFF` |
| `--color-surface-2` | Nesting, inputs, wells | `var(--color-blush)` / `#FFFDF9` |
| `--color-fg` | Primary text | `var(--color-ink)` |
| `--color-fg-muted` | Secondary/captions (≥ 4.5:1 against bg) | `var(--color-cocoa)` |
| `--color-fg-inverse` | Text on filled/dark surfaces | `#FFFFFF` |
| `--color-border` | Hairlines (avoid default heavy grays) | `rgba(73, 54, 48, 0.14)` |
| `--color-accent` | Brand accent / actions | `var(--color-dusty-rose)` |
| `--color-accent-soft` | Accent fills at low opacity for chips/glows | `rgba(223, 167, 173, 0.16)` |
| `--color-success` | Commerce success state | `var(--color-sage)` |
| `--color-warning` | Ratings, caution | `var(--color-warm-gold)` |
| `--color-danger` | Form error / stock alert | `#D9534F` |

## 5. Shadow guidance

Depth as atmosphere, layered and soft:

- `shadow-sm` — 0 1px 2px rgb(0 0 0 / 0.05).
- `shadow-md` — 0 6px 16px -4px rgb(0 0 0 / 0.10), 0 2px 6px -2px rgb(0 0 0 / 0.06).
- `shadow-lg` — 0 16px 40px -12px rgb(0 0 0 / 0.18).
- `shadow-glow` — accent-soft blurred radial for hero/product glow (transform/opacity only).
- Use MD for cards + menus, LG for modals/lightbox, glow behind hero imagery. Avoid box-shadow
  on hundreds of elements (paint cost); prefer `border` + subtle bg for hairlines.

## 6. Motion principles

- **Purpose over spectacle**: entrance/scroll motion communicates hierarchy; micro-interactions
  give feedback; nothing purely decorative.
- **One system, one vocabulary**: durations and eases live in tokens and are shared across GSAP,
  Motion, and CSS.

### Durations

| Token | Value | Use |
|---|---|---|
| `duration-fast` | 150ms | hover/active/press |
| `duration-base` | 250–350ms | toggles, tooltips, focus moves, small state changes |
| `duration-reveal` | 550–750ms | section/image entrance on in-view |
| `duration-hero` | 700–900ms | hero headline / product reveal |
| `duration-scroll` | 0–1 (scrub) | scroll-linked transforms (linear, tied to progress) |

### Easing

| Token | Value | Use |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | default UI motion |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | exits, reveals, dropdowns |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | fine controlled tweens |
| `linear` | `0,0,1,1` | scroll-scrubbed motion, progress bars |
| spring presets | `{ type: "spring", stiffness/damping }` from Motion | micro-interactions only |

- Stagger: 60–120ms offsets between list siblings; never stagger more than ~10 with distract.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables screen-space motion
  (transforms are fine, force to instant). Content must always be visible statically — motion
  never hides content.

## 7. 3D lighting guidance

- Environment map + 2–3 lights max (key + fill + optional rim).
- Warm-key temperature for craft feel and soft shadows.
- Keep `shadow.mapSize` ≤ 2048; hero object lit to stand out from `--color-bg`.
- Mobile: fewer lights, no shadows, lower dpr.

## 8. Camera guidance

- One cinematic rig (fov ≈ 28–50, slight three-quarter framing of hero object).
- Manual/scroll-driven dolly & pan, eased (visit `3d-web-design` for details).
- Pointer parallax subtle (±1.5–3°), never a spinny carousel camera (see `interaction-design`).

## 9. Responsive breakpoints

| Breakpoint | Width | Purpose |
|---|---|---|
| base | 320–374 | most constrained — must still look composed |
| sm | 375–413 | common mobile |
| md | 414–767 | large phone / small tablet |
| lg | 768–1023 | tablet (2-col product grid, nav collapses) |
| xl | 1024–1279 | desktop start (3-col grid) |
| 2xl | 1280+ | full desktop (up to 1920 – 4-col grids, wider section rhythm) |

- Test at **320, 375, 414, 768, 1024, 1280, 1440, 1920**.
- Fluid type `clamp()`, fluid section padding (`space-16`→`space-32`), grids: 1 → 2 → 3 → 4
  product columns.
- Pinned scroll-stories: desktop only; mobile falls back to stacked narrative.

## 10. Accessibility requirements

- WCAG **AA minimum**: body text ≥ 4.5:1, large text ≥ 3:1, focus indicators visible.
- Keyboard: tab order = visual order; every control reachable/operable; Esc closes
  menus/modals/lightbox; focus returns on close.
- Semantic HTML; one `h1` per page; proper landmarks (`header`, `nav`, `main`, `footer`).
- All images alt text; product gallery & video `aria-label`; videos `poster` +
  `playsinline muted loop` where autoplay is intended.
- Touch targets ≥ 44 px; `touch-action: manipulation`.
- `prefers-reduced-motion: reduce` fully supported; content never depends on animation.
- Color not the only differentiator (states include icon/shape/text).
- Form inputs labeled; error/success messages linked with `aria-describedby`.

## 11. Performance requirements

- transform/opacity-only animation; compositor-friendly at 60fps.
- LCP ≤ 2.5 s on mid-tier mobile; lazy-load non-LCP imagery and videos.
- Image budgets: product cards ≤ 100–150 KB (WebP/AVIF), gallery ≤ 300 KB, lightbox ≥ main
  asset sharp.
- Videos: `preload="metadata"`, poster from `main.*`, portrait MP4 ~ 1080–1440 max.
- WebGL: dpr cap (desktop ≤ 1.75, mobile ≤ 1.25); total draw calls ≤ 150 desktop; no frames
  when canvas off-screen; 3D scene loads after critical paint.
- Total JS gzipped ≤ 350 KB for storefront; route code-split; three/gsap chunked on demand.
- Audit with `responsive-performance` + `visual-qa` before ship.