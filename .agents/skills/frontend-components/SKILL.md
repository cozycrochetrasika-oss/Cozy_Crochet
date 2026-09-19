---
name: frontend-components
description: >
  Use when building, reusing, or extending UI components: buttons, inputs, cards, modals, menus,
  accordions, galleries, carousels, product grids, price tags, review components, and
  shadcn/ui-style primitives with Tailwind, Lucide icons, and Motion. Invoked by prompts like
  "build a product card", "add a carousel for the product images", "create a modal",
  "make a custom component", "reuse shadcn components".
---

# Frontend Components

Component work that scales: reuse existing, copy shadcn-compatible patterns, keep APIs clean,
and never duplicate what already exists.

## Preferred ecosystem

- **shadcn/ui** — the base primitive set (button, dialog, dropdown, sheet, input, radio, etc.).
  Install via `npx shadcn@latest add <component>`; components are copied into
  `src/components/ui/` so they are editable and tree-shaken already.
- **Tailwind CSS** + design tokens (see `DESIGN_SYSTEM.md`); extend the theme via tokens
  (colors, radius, spacing), never raw hex in components.
- **Lucide** (`lucide-react`) — the icon set; import only used icons (tree-shakes).
- **Motion** (`motion/react`) — enter/exit/layout animation on components.
- Reference UI libraries for *patterns*, not dependencies: **Magic UI** (marketing components,
  e.g. marquee, animated beams, grid pattern) and **Aceternity UI** (backgrounds, text effects)
  — copy the *idea* into your tokens rather than installing everything.

## Rules

- **Prefer reusable components.** If you reach for the same JSX twice, extract it.
- **Keep component APIs clean** — typed props, sensible defaults, forwardRef for
  form/native elements, clear prop names, no prop-drilling to internal magic.
- **Avoid duplicate UI implementations** — inspect existing components before creating
  duplicates. If a primitive exists (`ui/button.tsx`), compose with it; don't build a rival.
- **Preserve accessibility** — Radix-based shadcn primitives manage ARIA; keep roles/labels.
  Add `aria-label`/`aria-labelledby` to icon-only controls and the `title` for tooltips.
- **Use design tokens** — components reference `theme` tokens; if a component hardcodes a hex,
  fix it into the token.
- **Do not add dependencies unnecessarily** — prefer primitives already installed. If adding a
  library, justify it in the PR/commit (bundle cost, API surface, maintenance).
- **Use shadcn-compatible patterns where possible** — structure/styling conventions match the
  shadcn source layout (cva/variants for styles) so the ecosystem stays coherent.

## Component catalog for this project (Cozy Crochets)

Expected reusable kit:

- **Layout**: `Header` (nav + search + cart + login), `Footer`, `Section`, `Container`,
  `MaxWidthWrapper`.
- **Product**: `ProductCard` (image gallery, name, `Item Name`/`Quantity`/`Price INR` bold +
  highlighted, description, badges like sold count), `ProductGallery` (main image → video →
  single → bundle → extras; swipeable), `ProductLightbox` (maximize 80% screen with
  back/minimize), `PriceTag` (INR, localized, bold).
- **Commerce**: `AddToCartButton`, `CartDrawer`, `CartLineItem`, `QuantityStepper`,
  `CheckoutCTA`, `OrderSummary`, `Badge`.
- **Feedback**: `Button` (variants: primary/ghost/outline/link), `Input`, `Textarea`,
  `Label`, `Dialog`, `Sheet`, `Toast`, `Skeleton`, `Spinner`.
- **Content**: `ReviewCard`, `StarRating`, `ReadingTime`, `Marquee` (Magic-UI style),
  `TestimonialCarousel`, `StatsCounter` (sold/ordered/in-progress animating on view),
  `OffersBanner` (admin-set festival image).
- **Special**: `MagneticButton`, `CursorFx`, `SectionHeading` (overline + title + lead),
  `Reveal` (graceful entrance wrapper honoring reduced motion).

Keep this list in `AGENTS.md` style doc as the shared inventory. When asked to "make a
component", first check whether one of these (or a shadcn primitive) already exists.

## Implementation pattern

```tsx
// Example tone — variants via cva, tokens, Motion for entrances
const buttonVariants = cva(base, { variants: { variant: { primary: …, ghost: … } }, defaultVariants: { variant: "primary" } })
```

Compose primitives over bespoke; use `data-slot` + `forwardRef` where shadcn does. Small,
single-purpose files under `src/components/` (+ `ui/` for primitives).