# AGENTS.md — Cozy Crochets

Project-wide instructions for AI coding agents (Antigravity IDE, Codex, OpenCode, Claude Code)
working in this repository. Read this file first, every session.

## What this project is

- A future premium e-commerce storefront — **Cozy Crochets** — selling handmade crochet items
  (Bags, Boquets, Headbands, Key rings, Kid shoes, Roses, Sunflowers) with heavy animation,
  smooth scrolling, and a tasteful 3D/WebGL hero experience.
- Product media lives in per-item folders at the repo root: `Bag/`, `Boque/`, `HeadBands/`,
  `Key_Ring/`, `Kid_Shoe/`, `Rose/`, `Sunflower/`. Each folder contains `main.*` (hero),
  `Single.*`, `Bundle.*`, extra variant images, and `Video.mp4` (marketing videos in portrait).
  **Respect this media structure in every media-URL and gallery implementation.**
- The storefront app itself has not been scaffolded yet (no `package.json` at repo root yet —
  see `SETUP.md`). The tooling/skills/MCP layer below is already installed.

## Non-negotiables

1. **Never call a website "finished" until it has been checked with the available browser/QA
   tooling when practical.** Use the Chrome DevTools MCP (Antigravity/OpenCode, configured in
   `.agents/mcp_config.json`) or Playwright MCP (Codex, already configured) for `visual-qa`
   before declaring any UI work done.
2. **Preserve the existing architecture.** Inspect current code before changing it. Do not
   rewrite working systems because another framework is preferred.
3. **Animation over decoration.** Every animation must serve hierarchy or storytelling.
   Respect `prefers-reduced-motion` everywhere.
4. **Performance is a feature.** transform/opacity-only animation, lazy loading, image
   optimization, capped WebGL dpr, no layout thrash.
5. **Accessibility is a requirement.** Keyboard operable, visible focus, semantic HTML,
   WCAG AA contrast, touch-first interactions.
6. **Never commit secrets.** No API keys, tokens, OAuth credentials in code or config.
   Use `.env` + `.env.example` (names only).

## Agent tooling landscape (already configured)

| Tool | Purpose | Where |
|---|---|---|
| Antigravity IDE | Primary IDE (Google) | installed (`agy` CLI); reads `.agents/skills` + `.agents/mcp_config.json` |
| Codex CLI | Primary agent in VS Code | `~/.nvm/.../codex` (v0.155.1) |
| OpenCode | Alternative agent CLI | `opencode` |
| Motion MCP + Motion+ MCP | Motion animation docs/examples | `opencode.jsonc`, `.codex/config.toml`, `.mcp.json` |
| Chrome DevTools MCP | Browser QA/debugging for Antigravity (screenshots, console/network, performance, reduced-motion, WebGL) | `.agents/mcp_config.json` (`chrome-devtools`) |
| Context7 MCP | Current library docs (three, gsap, lenis, motion, etc.) | `.agents/mcp_config.json` + `codex mcp` — `context7` |
| shadcn MCP | shadcn/ui component discovery & install | `.agents/mcp_config.json` + `codex mcp` — `shadcn` |
| Playwright MCP | Browser QA fallback (Codex) | `codex mcp` — `playwright` |
| Figma MCP | Design → code translation (OAuth to Figma) | `codex mcp` — `figma` |
| Higgsfield MCP | AI video/3D asset generation (OAuth) | `codex mcp` — `higgsfield` |
| Motion AI Kit skills | `/motion` skills (best-practices, codex search, CSS springs, performance audit, transition preview) | `.agents/skills/motion` (shared) |
| Modern Web Guidance | Google's current web-platform/browser best-practice guides (`npx -y modern-web-guidance@latest search …`) | `.agents/skills/modern-web-guidance` (official install) |

## Skills — know and use them

Skills live in `.agents/skills/` (discovered by Codex `$skill` and OpenCode `/skill`). Invoke
them with the `$`-prefix in Codex or `/` in OpenCode, or by describing the task and letting the
models match them.

- `$website-architect` — plan architecture/IA/structure/animation/3D strategy before building.
- `$premium-web-design` — agency-quality composition, typography, color, whitespace, hierarchy.
- `$3d-web-design` — three / R3F / drei / post-processing / shaders / fallbacks.
- `$webgl-performance` — WebGL/Three GPU budgets: draw calls, textures, DPR, shaders, memory,
  low-end GPU tiers. Use whenever 3D is built or optimized.
- `$cinematic-animation` — GSAP + ScrollTrigger + Motion choreography and reveals.
- `$interaction-design` — hover/focus/active/drag/cursor/menus/modals/loading/error feedback.
- `$scroll-storytelling` — Lenis + ScrollTrigger pins, horizontal rails, scroll-driven scenes.
- `$frontend-components` — shadcn/ui, Tailwind, Lucide, Motion; reusable component inventory.
- `$responsive-performance` — all breakpoints, image/media optimization, perf budgets.
- `$visual-qa` — mandatory pre-ship browser QA (Chrome DevTools MCP / Playwright); fix what you
  find.
- `$figma-to-code` — translate Figma intent into token-based components.
- `$modern-web-guidance` — always run this skill **first** for any HTML/CSS/client-JS work; it
  surfaces current web-platform best practices (view transitions, container queries, `:has()`,
  popover, etc.). Invoked automatically by prompting with the UI task.

## Standard stack (when building the app)

- **Framework**: React (Next.js is the preferred option for Netlify SSR/static hybrid — confirm
  with the user before scaffolding). Deploy target: **Netlify**, and push to GitHub.
- **Styling**: Tailwind CSS + design tokens from `DESIGN_SYSTEM.md`. shadcn/ui primitives,
  Lucide icons.
- **Animation**: GSAP + ScrollTrigger (complex/scroll choreography), **Motion** (`motion/react`,
  never `framer-motion`) for component/enter-exit animation, **Lenis** for smooth scrolling.
  Use the `/motion` skill to resolve Motion patterns and tune springs/easing.
- **3D**: three + @react-three/fiber + @react-three/drei (+ postprocessing only where it earns
  its GPU cost). One heroic product object; graceful WebGL fallback; mobile complexity reduction.
  Keep GPU within budget (see `$webgl-performance`).
- **Commerce**: Stripe for payments; cart requires login; checkout via WhatsApp/UPI flow with
  admin verification (6-digit code) unless Stripe is used. Admin login + product/media CRUD,
  festival offers banner, daily caption, quantity/price/description in INR, reviews with sample
  ratings (4.5–4.7), bestsellers/sold counts.
- **Media pipeline**: every product = folder with `main` / `Single` / `Bundle` / extras /
  `Video.mp4`. Render as swipeable gallery (video included), lightbox at 80% viewport, respond
  with responsive images (WebP/AVIF) + `loading="lazy"`, `poster` from `main.*`, muted
  `playsinline` for autoplay.

## Process expectations

1. **When starting a feature**: consult `$website-architect` for structure and `SETUP.md` for
   environment; read existing code first.
2. **When designing**: `$premium-web-design`, `$frontend-components`, `DESIGN_SYSTEM.md`.
3. **When animating**: `$cinematic-animation`, `$interaction-design`, `$scroll-storytelling`,
   and `/motion` for Motion/spring specifics.
4. **When adding 3D**: `$3d-web-design` + `$webgl-performance`.
5. **When polishing performance**: `$responsive-performance` (DOM/media) and `$webgl-performance`
   (GPU/WebGL).
6. **Before declaring done**: `$visual-qa` with Chrome DevTools MCP (Antigravity) or Playwright
   (Codex) — desktop + tablet + mobile + console/network/WebGL checks + accessibility +
   reduced-motion. Fix every issue found.
7. **When Figma context is provided**: `$figma-to-code`.
8. Use **Context7** (`.agents/mcp_config.json` or `codex mcp context7`) whenever a library API
   needs current documentation.
9. Run **`$modern-web-guidance` first** for any HTML/CSS/client-JS implementation; it catches
   obsolete patterns before you write them.
10. When a page/scene looks wrong on device sizes unknown to us, assume the most constrained:
   320 px min, weak-GPU mobile, high-DPI desktop.

## Coding standards

- TypeScript, typed props, clean component APIs, kebab-case file names in `components/`.
- No comments unless the code can't otherwise be understood; document why, not what.
- Design tokens only — no raw hex/px/spacing in components.
- No `framer-motion` imports. No unused deps. No duplicate components.
- Every effect (useEffect/useLayoutEffect) and GSAP context cleaned up; ScrollTrigger
  `ctx.revert()` in cleanup.
- Semantic HTML, alt text, labels, roles on interactive state containers.
- Reduced-motion handled at the system level; content must never be hidden by motion.

## Day-to-day config files, do not edit casually

- `opencode.jsonc`, `.mcp.json`, `.codex/config.toml` — MCP server registration
  (motion, motion-plus, context7, playwright, shadcn, figma, higgsfield).
- `.agents/mcp_config.json` — Antigravity MCP registration (chrome-devtools, context7, shadcn).
- `.agents/skills/` (+ mirrored `.claude/skills/`, `.opencode/skills/`) — skill definitions,
  including the officially installed `modern-web-guidance` (see `docs/ANTIGRAVITY_WEB_STACK.md`).
- Editing MCP/skill config is allowed for setup purposes; never commit credentials.

## Deploy

- Target Netlify (build command per framework; Netlify handles the static/SSR output).
- Push release state to GitHub with clear commit messages after user confirmation only.
- Antigravity-specific setup, skill/MCP details, and verification steps:
  `docs/ANTIGRAVITY_WEB_STACK.md` and `docs/USAGE.md`.