---
name: website-architect
description: >
  Use when planning or structuring a premium website before writing code: information architecture,
  page structure, hero composition, visual hierarchy, section flow, component architecture, design
  tokens, animation and 3D strategy, assets, loading, SEO, accessibility, performance budgets, and
  browser/device differences. Invoked by prompts like "plan the architecture for the Cozy Crochets
  store", "design the page structure", "how should we structure this site", or "make a plan before
  building".
---

# Website Architect

Plan a premium website properly **before** writing a single component. Architecture decisions made
up front determine whether the result feels intentional or generic. Do not write code until the
plan below is resolved and written down (in `AGENTS.md` or a short `ARCHITECTURE.md` when one
does not exist).

## 1. Reason through before coding

- **Information architecture**: what are the top-level pages/sections and how do users flow
  through them? For an e-commerce store: Home → Product(s) → Quick view → Cart → Checkout → Order
  confirmation, plus an admin side. Define the nav model (which links, how many, order).
- **Hero composition**: one clear focal point per viewport. Decide the hero's type (product 3D,
  editorial image, cinematic video, type-led), the message, and the single call-to-action.
- **Visual hierarchy**: decide the primary element per section. Never present equal-weight
  everything.
- **Section progression**: map a storytelling arc — hook → product reveal → proof (reviews/sales)
  → customization → contact → closing CTA. Each section earns its place.
- **Component architecture**: list reusable components before building them. Card, media gallery,
  review list, price tag, CTA button, header, footer, modals, etc. Avoid bespoke one-off layouts.
- **Responsive behavior**: define how each section reflows at 320 / 375 / 414 / 768 / 1024 / 1280 /
  1440 / 1920 px *before* writing layout CSS. Decide collapse points and what gets hidden.
- **Animation strategy**: which sections animate, in what order, with what easing. Animate to
  communicate hierarchy, not decoration. See `cinematic-animation`.
- **3D strategy**: is 3D justified? One hero product object is usually enough. Define camera,
  lighting, fallback when WebGL is absent, and mobile complexity reduction. See `3d-web-design`.
- **Asset strategy**: inventory images/videos/sources, compression targets, dimensions per
  breakpoint, lazy-loading plan. In this repo, products live in per-item folders
  (`Bag/`, `Rose/`, `Sunflower/`, …) with `main.*`, `Single.*`, `Bundle.*`, extra variants, and
  `Video.*`. Plan the media pipeline around that structure.
- **Loading strategy**: critical path vs. deferred, code splitting, skeleton/loading states,
  preloading the hero image, optimizing WebGL asset fetch.
- **Accessibility**: keyboard nav, focus states, `prefers-reduced-motion`, alt text, semantic HTML,
  contrast. Accessibility is a requirement, not a feature.
- **Performance**: per-page budgets (e.g. payload < 1.5 MB raw, LCP < 2.5 s). Decide trade-offs
  before they cost a redesign.
- **SEO**: semantic headings, meta/OG tags, image `alt`, structured data for products, canonical
  URLs.
- **Browser/device differences**: test WebGL on integrated/mobile GPUs, touch vs hover, high-DPI,
  Safari quirks (fixed positioning, `100vh`, video autoplay). Plan for the worst device, not the
  best.

## 2. Required implementation sequence

Follow this order. Do not skip steps.

1. **Inspect existing code** — read `package.json`, `src/`, `public/`, `AGENTS.md`, existing
   components. Understand what exists before adding anything.
2. **Understand current architecture** — framework, React version, TypeScript, CSS system,
   Tailwind version, package manager, build/deploy (this repo deploys to Netlify). Preserve it.
3. **Define page structure** — routes and sections for the whole site.
4. **Define reusable components** — the component tree before the build tree.
5. **Define design tokens** — colors, spacing, radii, shadows, breakpoints, type scale in a single
   source (`tailwind.config` theme or CSS custom properties). See `DESIGN_SYSTEM.md`.
6. **Define interaction system** — hover/active/focus/drag/scroll behaviors and their APIs.
   See `interaction-design`.
7. **Define animation system** — entrance choreography, scroll triggers, easing constants,
   orchestration across DOM and WebGL. See `cinematic-animation` and `scroll-storytelling`.
8. **Define 3D system** — only if justified. Stack, camera rig, lighting rig, fallback policy.
   See `3d-web-design`.
9. **Implement** — build components against the plan; do not improvise new patterns mid-build.
10. **Run visual QA** — with the available browser tooling (Chrome DevTools MCP in Antigravity /
    Playwright MCP in Codex) across breakpoints. See `visual-qa`.
11. **Optimize** — bundle size, images, draw calls, rerenders, animation jank.
    See `responsive-performance`.
12. **Verify build** — production build passes, typecheck passes, no console/network errors,
    Lighthouse-style checks.

## 3. Rules

- **Never rewrite the entire project unnecessarily.** Preserve the existing architecture; extend
  it. If the existing framework differs from your preference, the existing one wins unless there
  is a concrete blocking reason (say so in the plan if there is).
- **Do not build every component from scratch.** Prefer shadcn-compatible patterns and reuse.
- **Write the plan down** in a concise `ARCHITECTURE.md` (or the existing doc) so later phases
  stay consistent.
- **A website is not finished until visual QA passes.** Never say "done" before the QA step.

## Output format

When this skill is invoked, end your planning phase with a compact summary:

> Architecture plan: pages X–Y · N reusable components · design tokens in <location> · animation
> system <GSAP/ScrollTrigger + Lenis> · 3D <none | hero product> · asset pipeline <…> ·
> performance budget <…> · QA plan <Chrome DevTools MCP/Playwright + breakpoints>.