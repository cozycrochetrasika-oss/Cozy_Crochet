# WEB_DESIGN_STACK.md — Cozy Crochets reference

Catalogue of the design/animation/3D/web tooling this project uses, with official sources.
Installation commands (where relevant) target the future app directory (see `SETUP.md`) unless
stated otherwise.

Links are official. When a library API is needed during coding, prefer **Context7 MCP**
(`codex mcp` → `context7`) for the *current* docs, then these pages.

Legend: Required = must be present to build this site · Optional = install only when needed ·
Auth = requires a login/OAuth to use.

---

## 3D / WebGL

### Three.js
- **Source**: https://threejs.org/docs/ · Manual https://threejs.org/manual/
- **Used for**: core WebGL engine — hero product object, camera, lights, shaders, particles.
- **Install**: `npm install three`
- **Required**: Yes · **Auth**: No

### React Three Fiber (R3F)
- **Source**: https://docs.pmnd.rs/react-three-fiber/
- **Used for**: declarative React renderer on top of three (components instead of imperative scene code).
- **Install**: `npm install @react-three/fiber`
- **Required**: Yes (3D hero) · **Auth**: No

### Drei
- **Source**: https://github.com/pmndrs/drei · live examples https://drei.pmnd.rs/
- **Used for**: helpers — Environment, CameraControls, useGLTF, shader material, text, etc.
- **Install**: `npm install @react-three/drei`
- **Required**: Yes (3D hero) · **Auth**: No

### @react-three/postprocessing + postprocessing
- **Source**: https://github.com/pmndrs/react-postprocessing · upstream https://github.com/pmndrs/postprocessing
- **Used for**: bloom, depth of field, vignette — only where the hero earns the GPU cost.
- **Install**: `npm install @react-three/postprocessing postprocessing`
- **Required**: Optional · **Auth**: No

---

## Animation / motion

### GSAP
- **Source**: https://gsap.com/docs/v3/
- **Used for**: timelines, choreography, coordinated DOM + WebGL animation.
- **Install**: `npm install gsap`
- **Required**: Yes · **Auth**: No

### ScrollTrigger
- **Source**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **Used for**: scroll-driven animation, pinning, scrub, parallax, horizontal rails.
- **Install**: bundled with `gsap` (`import "gsap/ScrollTrigger"`) — no extra package.
- **Required**: Yes · **Auth**: No

### Lenis
- **Source**: https://github.com/darkroomengineering/lenis · site https://lenis.darkroom.engineering/
- **Used for**: smooth scrolling and normalized scroll values feeding GSAP/ScrollTrigger and the 3D camera.
- **Install**: `npm install lenis`
- **Required**: Yes · **Auth**: No

### Motion (prev Framer Motion)
- **Source**: https://motion.dev/docs/
- **Used for**: React component enter/exit/layout animation, springs, `useScroll`/`useTransform`.
  Package is `motion`, import from `motion/react`. **Never** `framer-motion`.
- **Install**: `npm install motion`
- **Required**: Yes · **Auth**: No

### Motion AI Kit
- **Source**: https://motion.dev/docs/ai-kit · install https://motion.dev/docs/ai-kit-install
- **Used for**: agent skills for Motion (best-practices, codex example search, CSS springs,
  MotionScore performance audits, transition preview). Already installed here under
  `.agents/skills/motion` (+ mirrors in `.claude/skills`, `.opencode/skills`) with the motion /
  motion-plus MCP servers.
- **Install**: already done; re-run `npx motion-ai` only to update/re-authenticate.
- **Required**: Yes (installed) · **Auth**: Advanced features (MotionScore, premium examples)
  need a Motion+ account; basic best-practices/search work without one.

---

## Design components

### shadcn/ui
- **Source**: https://ui.shadcn.com/
- **Used for**: accessibility-first component primitives (button, dialog, menu, etc.) copied
  into `src/components/ui/`. Configurable with our design tokens.
- **Install**: `npx shadcn@latest init` then `npx shadcn@latest add <component>` (also via the
  shadcn MCP server).
- **Required**: Yes · **Auth**: No

### Tailwind CSS
- **Source**: https://tailwindcss.com/docs
- **Used for**: utility CSS + theming via design tokens.
- **Install**: `npm install tailwindcss` (per framework docs) — **already the styling system**
  this project assumes; do not replace with another CSS approach.
- **Required**: Yes · **Auth**: No

### Lucide
- **Source**: https://lucide.dev/icons/ (guide https://lucide.dev/guide/)
- **Used for**: icon set (UI icons, cart, search, stars, etc.).
- **Install**: `npm install lucide-react`
- **Required**: Yes · **Auth**: No

### Magic UI
- **Source**: https://magicui.design/
- **Used for**: *patterns* (marquee, animated beams, grids) — adapt into tokens/components,
  do not install the whole library.
- **Install**: not required as a dependency.
- **Required**: Optional · **Auth**: No

### Aceternity UI
- **Source**: https://ui.aceternity.com/
- **Used for**: *patterns* (text effects, backgrounds) — adapt, do not install everything.
- **Install**: not required as a dependency.
- **Required**: Optional · **Auth**: No

---

## QA / documentation tooling (agent-side)

### Chrome DevTools MCP
- **Source**: https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Used for**: browser QA/debugging for **Antigravity** and OpenCode — screenshots, console and
  network inspection, performance/CPU throttling, `prefers-reduced-motion` emulation, WebGL
  debugging, device emulation at breakpoints. Drives the `visual-qa` skill.
- **Install**: registered in `.agents/mcp_config.json` (Antigravity):
  `npx -y chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222`. Attaches to Chrome
  launched with `--remote-debugging-port=9222` or launches its own browser. Requires Node ≥ 18
  (active: v20.20.2).
- **Required**: Yes (Antigravity QA) · **Auth**: No

### Playwright MCP
- **Source**: https://github.com/microsoft/playwright-mcp
- **Used for**: browser automation QA — desktop/tablet/mobile, screenshots, console/network,
  accessibility checks, reduced-motion emulation. The `visual-qa` skill drives it (Codex
  fallback; not registered for Antigravity — chrome-devtools MCP covers that role).
- **Install**: `codex mcp add playwright -- npx @playwright/mcp@latest` **(already configured)**;
  browsers auto-install on first use, or `npx playwright install chromium`.
- **Required**: Yes (already configured) · **Auth**: No (browser binaries are downloads, not auth)

### Context7
- **Source**: https://github.com/upstash/context7 · product https://context7.com/
- **Used for**: current library documentation (three, gsap, lenis, motion, next, etc.) inside
  Codex/OpenCode.
- **Install**: `codex mcp add context7 -- npx -y @upstash/context7-mcp` **(already configured)**.
- **Required**: Yes (already configured) · **Auth**: No (optional context7 API token via env for
  higher quotas — none committed to repo).

### Figma MCP
- **Source**: https://developers.figma.com/docs/figma-mcp-server/ (remote install:
  https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- **Used for**: reading selected Figma nodes (layout, variables, typography, spacing, colors)
  to translate design into code (`figma-to-code` skill). Can also write to the canvas.
- **Install**: `codex mcp add figma --url https://mcp.figma.com/mcp` **(already configured)**.
- **Required**: Optional · **Auth**: **Yes** — interactive OAuth once (`codex mcp login figma` /
  Codex VS Code prompt). No token committed.

### Codex Skills
- **Source**: https://developers.openai.com/codex/skills
- **Used for**: repo-level `.agents/skills/*/SKILL.md` discovered by Codex, OpenCode, and
  Antigravity; invoke with `$skill-name` / `/skills` / natural prompts.
- **Install**: unpack skills into `.agents/skills/<name>/SKILL.md` **(done — this repo has 12
  project skills: the 11 listed in `AGENTS.md` + `webgl-performance`, plus the `motion` AI Kit
  skill and the officially installed `modern-web-guidance`)**.
- **Required**: Yes (present) · **Auth**: No

### Modern Web Guidance (GoogleChrome)
- **Source**: https://github.com/GoogleChrome/modern-web-guidance
- **Used for**: current web-platform best-practice guides (view transitions, container queries,
  `:has()`, popover, etc.) surfaced to agents before they write HTML/CSS/JS.
- **Install**: `npx -y modern-web-guidance@latest install` (interactive) or
  `npx -y skills add GoogleChrome/modern-web-guidance --skill modern-web-guidance --agent antigravity --copy -y`
  **(done — installed at `.agents/skills/modern-web-guidance`)**.
- **Required**: Yes (installed) · **Auth**: No

### Codex MCP
- **Source**: config reference https://developers.openai.com/codex/config-reference ; intro
  https://developers.openai.com/learn/docs-mcp
- **Used for**: registering MCP servers in the shared `~/.codex/config.toml` / project
  `.codex/config.toml`.
- **Install**: `codex mcp add <name> ...` / `codex mcp login <name>`.
- **Required**: Yes (configured) · **Auth**: per-server (figma, higgsfield = OAuth).

### OpenCode Skills
- **Source**: https://opencode.ai/docs/skills/ (+ v2 https://opencode.ai/v2/docs/skills/)
- **Used for**: skill discovery in OpenCode — including the shared `.agents/skills/` location.
  Invoke with `/skill-name`.
- **Install**: skills in `.agents/skills/<name>/SKILL.md` (done) or `.opencode/skills/`.
- **Required**: Yes (present) · **Auth**: No

### OpenCode MCP
- **Source**: https://opencode.ai/v2/docs/mcp-servers/ (also https://opencode.ai/docs/mcp-servers/)
- **Used for**: `mcp` config in `opencode.jsonc` / `.mcp.json` — this repo registers motion +
  motion-plus; OAuth stored outside the repo.
- **Install**: edit `opencode.jsonc` `mcp.servers` (done). Authenticate: `opencode mcp auth <server>`.
- **Required**: Yes (configured) · **Auth**: per-server (motion/motion-plus may require an
  account for advanced features).

---

## Related (non-dependency) tooling

- **Higgsfield MCP** (AI video/3D asset gen): auth via OAuth (no repo secrets), used for
  marketing-video/asset generation for this project's product media.
- **Netlify** (deploy target): https://docs.netlify.com/ — static/SSR output from the app build.
- **Stripe** (commerce): https://docs.stripe.com/ — see `AGENTS.md`; checkout may also run over
  WhatsApp/UPI with admin 6-digit verification.