# USAGE.md — Invoking Cozy Crochets skills in Antigravity

How to make Antigravity pick the right skill for a task, with working example prompts. Skills are
matched by their `description` frontmatter — the fastest way is to describe the job naturally and
let the IDE select; you can also name a skill explicitly (`/3d-web-design`, `$skill-name`, or
`@skill-name` per your Antigravity UI style).

> Rule of thumb: **prompt the skill, not the file.** Say what you want ("a premium reveal for the
> hero"), not "run SKILL.md".

## Skills mapped to natural prompts

| Skill | Explicit name | Natural prompt that triggers it |
|---|---|---|
| `website-architect` | `/website-architect` | "Plan the architecture for the Cozy Crochets store before writing code: IA, sections, components, animation and 3D strategy, performance budget." |
| `premium-web-design` | `/premium-web-design` | "Make the home page feel like a premium creative-agency site — typography, whitespace, hierarchy. It currently looks generic/AI-generated." |
| `3d-web-design` | `/3d-web-design` | "Add a tasteful 3D WebGL hero for the crochet bag — R3F + drei, cinematic camera, graceful fallback when WebGL is missing." |
| `webgl-performance` | `/webgl-performance` | "The WebGL hero is laggy on my phone — cap DPR, cut draw calls, compress textures, instance the particles, and pause rendering off-screen." |
| `cinematic-animation` | `/cinematic-animation` | "Choreograph a staged entrance: overlay mask lift, then hero headline reveal, then product image — GSAP timeline, reduced-motion safe." |
| `interaction-design` | `/interaction-design` | "Add hover/focus/active states, a magnetic CTA, and a modal with exit animation — touch-safe and keyboard operable." |
| `scroll-storytelling` | `/scroll-storytelling` | "Add Lenis smooth scroll and a pinned 'how a rose is made' section scrubbed with ScrollTrigger; design a non-pinned mobile fallback." |
| `frontend-components` | `/frontend-components` | "Build a reusable `ProductCard` with gallery, price in INR, and sold-count badge — reuse shadcn primitives, Lucide icons, Motion." |
| `responsive-performance` | `/responsive-performance` | "Make the storefront responsive at 320–1920 px and fast: responsive images, lazy load, no layout thrash, transform/opacity-only animation." |
| `visual-qa` | `/visual-qa` | "Run visual QA with the browser MCP: desktop/tablet/mobile, console + network, WebGL, accessibility, reduced-motion — and fix what you find." |
| `figma-to-code` | `/figma-to-code` | "Translate the selected Figma frame into token-based React components (connect the Figma MCP first)." |
| `modern-web-guidance` | `/modern-web-guidance` (auto-runs first) | Any HTML/CSS/client-JS request — e.g. "Build a dialog with an animated backdrop" (it searches current web-platform best practices first). |

## Worked example prompts (copy-paste ready)

### 1. Build the 3D hero (uses `3d-web-design` + `webgl-performance`)

> "Build the home hero as a 3D product scene in React Three Fiber. One hero object (the crochet
> bag) on a soft stage, drei `Environment`, warm key lighting, a slow eased camera dolly. Follow
> `$3d-web-design` and `$webgl-performance`: cap dpr (desktop 1.75 / mobile 1.25), lazy-load the
> GLB with Suspense, pause rendering when off-screen, and fall back to the `Bag/main.*` image when
> WebGL is unavailable. Respect `prefers-reduced-motion`."

### 2. Cinematic hero entrance (uses `cinematic-animation` + `interaction-design`)

> "Choreograph the page entrance: an overlay mask lifts, then the headline resolves with a
> line-mask reveal, then the product image scales 1.15→1 behind it, then the CTA fades in. Use
> GSAP + ScrollTrigger inside `gsap.context`, `ctx.revert()` on cleanup, and the design-system
> motion tokens. Nothing should animate if the user prefers reduced motion."

### 3. Scroll storytelling (uses `scroll-storytelling` + `3d-web-design`)

> "Add Lenis smooth scroll wired to the GSAP ticker. Create a pinned 'how a rose is made'
> section: a scrubbed image/video sequence with captions, plus a subtle parallax on the hero.
> Mobile must stack the narrative without pinning. Drive the 3D camera from the same scroll
> progress, not competing listeners."

### 4. Mandatory visual QA before shipping (uses `visual-qa` + chrome-devtools MCP)

> "Run visual QA with the Chrome DevTools MCP on the current build: 375, 768, 1440 viewports —
> layout, typography, spacing, nav, focus states, animations, WebGL canvas, console + network
> errors, accessibility, and reduced-motion. Then fix every issue you find and re-verify."

### 5. Full feature build (chains multiple skills)

> "Plan then build the product page for Roses: use `website-architect` to plan IA and section
> flow, `premium-web-design` for the layout, `frontend-components` for `ProductCard`/`Gallery`/
> `Lightbox`, `cinematic-animation` for the reveals, `scroll-storytelling` for the section
> entrance, and finish with `visual-qa`. Run `modern-web-guidance` first for the client code."

## Workflow order for big work

1. `modern-web-guidance` first (any HTML/CSS/JS).
2. `website-architect` — plan before code.
3. `premium-web-design` + `frontend-components` — design & components.
4. `cinematic-animation` + `interaction-design` + `scroll-storytelling` — motion.
5. `3d-web-design` + `webgl-performance` — 3D with GPU budgets.
6. `responsive-performance` — responsive + perf pass.
7. `visual-qa` (Chrome DevTools MCP) — mandatory gate; **fix, don't just report**.

## When a skill name is unknown in the UI

- Restart Antigravity so it rescans `.agents/skills` (`docs/ANTIGRAVITY_WEB_STACK.md` §10).
- Confirm `<name>/SKILL.md` exists with valid frontmatter and a unique kebab-case name.