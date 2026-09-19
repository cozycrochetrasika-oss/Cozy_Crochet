---
name: figma-to-code
description: >
  Use when converting Figma design context into code: reading selected nodes, extracting layout,
  variables, components, typography, spacing, colors, images, and mapping them to real project
  components. Invoked by prompts like "turn this Figma frame into a React component",
  "use the Figma design", "translate this design to code", "match Figma spacing/colors".
---

# Figma to Code

Translate design *intent* into maintainable React/TypeScript components — never blindly
screenshot-reproduce. Ship code that honors the system, not pixels brute-forced.

## When Figma MCP is available

- Use the Figma MCP server to inspect the currently selected nodes/frames (file → page →
  selection → node hierarchy, variables, styles).
- Extract:
  - **Layout** — absolute positions, dimensions, flex direction, gaps, ordering; convert to
    flow: `flex`/`grid` + spacing tokens, not pixel slab.
  - **Variables** — design tokens (colors, spacing, radii, typography, shadows); map onto
    `DESIGN_SYSTEM.md` tokens; never duplicate raw values if a token equals one.
  - **Components** — Figma components/instances → project components (Button, ProductCard,
    ReviewCard, Gallery). Map Figma component → existing `src/components/` item when possible.
  - **Typography** — family, weights, sizes, line-height, tracking → type scale tokens.
  - **Spacing** — paddings/margins/gaps → spacing scale (`space-1..N`).
  - **Colors** — fills/strokes → color tokens (name them semantically, not "frame12color").
  - **Images** — fill images/backgrounds → `public/` assets or optimized responsive images,
    never hotlink Figma exports as production media.
- Match component semantics: a Figma "card" becomes `ProductCard`, a "primary button" becomes
  `Button variant="primary"`. Reuse existing components; only create new ones when the design
  surface is genuinely novel.

## Rule: no screenshots

Don't reproduce a screenshot with absolute-position divs. Extract structure + tokens, then
rebuild responsively. Figma is a blueprint; the browser is the reality. If the result diverges
from the frame (e.g. `clamp()` type or reflow at 375 px), that's correct behavior.

## Workflow

1. Confirm Figma MCP connection works (list file, select the design).
2. Ask the user which frame/page/node to translate (or read the current selection).
3. Dump the node tree + styles + key component/variable info.
4. Map Figma → code: tokens to `DESIGN_SYSTEM.md`, components to `src/components/`, images to
   the media pipeline.
5. Implement mobile-first (`responsive-performance`), animate per `cinematic-animation`,
   then run `visual-qa`.

## When Figma MCP is unavailable

State that clearly. Proceed from a provided image/spec: extract the same attributes manually
from the image/description, still translate into tokens and reusable components. Never invent
U-turns that contradict the design; flag ambiguities as questions rather than guessing silently.