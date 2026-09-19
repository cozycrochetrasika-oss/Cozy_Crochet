---
name: premium-web-design
description: >
  Use when making visual/design decisions for agency-quality, premium-feeling websites: composition,
  typography, spacing, whitespace, hierarchy, color systems, gradients, depth, contrast, visual
  rhythm, or reviewing a design that looks generic. Invoked by prompts like "make this look premium",
  "this looks AI-generated, elevate it", "improve the visual design", or "design a cinematic storefront".
---

# Premium Web Design

Produce design work that reads as intentional, editorial, and expensive — not template-y.

## Design principles

- **Intentional composition**: every viewport is composed. Establish a grid; a focal point per
  section; asymmetric balance; clear start and end positions for the eye.
- **Strong typography**: a small, opinionated type system (1–2 families). Use size + weight +
  tracking to build hierarchy rather than many colors or boxes. Display faces for headlines,
  restrained text faces for body. Set a comfortable measure (45–75ch). Use `font-feature-settings`
  and optical sizing where available; keep line-heights tight for large display type.
- **Controlled spacing**: a strict spacing scale (multiples of a base unit). Rhythm matters more
  than exact values. Reduce spacing between related elements, expand between sections.
- **Meaningful whitespace**: whitespace is a design material. Generous section padding signals
  premium. Do not fear large empty areas; fear clutter.
- **Clear hierarchy**: size, contrast, and placement should make the intended reading order
  unmistakable. One primary action per viewport.
- **Sophisticated color systems**: define tokens as role-based (background, surface, foreground,
  accent, muted) rather than raw hex values scattered in components. Use a limited palette —
  neutrals + 1–2 accents. Prefer working in HSL/OKLCH for perceptually even tints.
- **Restrained use of gradients**: gradients are seasoning. Use them for depth or light simulation
  (soft radial glow behind a hero object, subtle surface tint). Avoid full-bleed rainbow gradients.
- **Tasteful depth**: soft, layered shadows; subtle elevation on hover; faint background texture.
  Depth must read as atmosphere, not "layered cards".
- **Deliberate contrast**: strong contrast where the eyes should land (headlines, CTAs, products);
  controlled contrast elsewhere. Respect WCAG AA contrast for all text (see `DESIGN_SYSTEM.md`).
- **Premium visual rhythm**: repetition of spacing, corner treatment, motion easing, and border
  weight across sections so the site feels like one system. Variation only where it communicates
  something.

## Avoid generic AI-generated patterns

These read as low-effort and typically damage credibility:

- **Excessive cards** — ganging identical rounded boxes across the page. Cards are for
  interactive/aggregate content (product grids, reviews), not for every paragraph.
- **Excessive rounded containers** — full-bleed rounded rectangles everywhere. Vary treatment:
  some sections flush to the edge, some use soft vertical padding instead of boxes.
- **Random glassmorphism** — frosted blur slapped on without a coherent light layer beneath.
  Use it deliberately (a floating sticky element over a busy video) or not at all.
- **Meaningless gradients** — decorative color washes with no directional logic.
- **Excessive borders** — thin outlines on everything. Borders define structure; too many
  produce grid-lines, not premium.
- **Dashboard-like layouts for marketing pages** — stat-tile soup, gauge graphics, dense
  sidebars. A storefront is a stage, not an admin panel.
- **Decorative clutter** — floating emoji/icon blobs, confetti, doodles that don't carry meaning.
- **Animation on every element** — movement everywhere is noise. Animation should highlight one
  thing at a time. See `cinematic-animation`.

## References to study (never copy wholesale)

- Premium product websites (e.g. Apple, Linear, Stripe, Framer-style marketing) — restraint and
  product-first staging.
- High-end creative agencies — editorial grid, oversized type, confident whitespace.
- Editorial magazines — long-form rhythm, contrast of scale, caption systems.
- Modern product launches — cinematic reveals, one hero, clear CTA.
- Cinematic portfolio sites — scroll narratives, parallax depth, calm pacing.
- Immersive creative-coding sites — WebGL as centerpiece *with* a rationale.

Study the *decisions* (spacing rhythm, easing, type scaling, absence of clutter), not the screens.

## Working method

1. **Establish intent** for the page: one verb ("sell", "delight", "convince"). Every design
   choice must serve it.
2. **Build the type scale first** — display / h1 / h2 / h3 / body / caption / overline, each with
   size, weight, line-height, tracking. Tune until hierarchy is obvious in grayscale.
3. **Choose a restrained palette** — neutrals + accent; define every color as a token with a
   semantic name. Check accent-on-accent contrast.
4. **Define spacing + radius + shadow scale** (design tokens) before layout.
5. **Compose sections** on an explicit grid; whitespace plan per section; focal point per section.
6. **Add depth/atmosphere** — subtle radial glows, soft shadows, optional faint texture — last.
7. **Review against the anti-pattern list** before calling the design done.

## Deliverable

Deliver design work as code against tokens (reuse `DESIGN_SYSTEM.md`), and name the tokens, not
raw values, in components. If asked, show before/after rationale: what was removed and why.