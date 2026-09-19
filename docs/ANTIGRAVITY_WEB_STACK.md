# ANTIGRAVITY_WEB_STACK.md — Cozy Crochets for Antigravity IDE

How this workspace is wired for **Google Antigravity IDE** (a VS Code-family editor that reads
the universal `.agents` conventions): where skills and MCP servers live, how to invoke them, how
to authenticate, and how to troubleshoot. Companion to `AGENTS.md`, `SETUP.md`, and
`WEB_DESIGN_STACK.md`. Codex/OpenCode/Claude remain supported via the same files.

## 1. Quick layout

```
Antigravity IDE
│
├── .agents/skills/            ← custom + official skills (Antigravity discovers these)
│     ├── modern-web-guidance  ← GoogleChrome official (installed via official installer)
│     ├── website-architect
│     ├── premium-web-design
│     ├── 3d-web-design
│     ├── webgl-performance
│     ├── cinematic-animation
│     ├── interaction-design
│     ├── scroll-storytelling
│     ├── frontend-components
│     ├── responsive-performance
│     ├── visual-qa
│     └── figma-to-code
│     └── motion               ← Motion AI Kit skills (shared; see §7)
│
└── .agents/mcp_config.json    ← Antigravity MCP registration
      ├── chrome-devtools   (npx chrome-devtools-mcp@latest, browser on :9222)
      ├── context7          (https://mcp.context7.com/mcp)
      └── shadcn            (npx shadcn@latest mcp)
```

`AGENTS.md` (project skill table) and `DESIGN_SYSTEM.md` (tokens, motion, GPU, a11y, perf
budgets) are the source of truth for agents. Read them first.

## 2. Skills location & naming

- Skills live in `.agents/skills/<skill-name>/SKILL.md`. Lowercase kebab-case names only.
- Antigravity also reads global skills from `~/.agents/skills` — project skills here override by
  scope.
- Invoke by **prompting naturally**, or by name: `/3d-web-design` (OpenCode style slash names
  work in the Antigravity agent chat UI), `$skill-name` (Codex style), or `@skill-name`. The
  skill `description` frontmatter drives auto-selection, so describe the task and let the IDE
  pick the skill.

## 3. The 12 skills

| Skill | Purpose / files |
|---|---|
| `modern-web-guidance` | Google Chrome team's current web-platform best practices. **Run first for any HTML/CSS/client-JS.** Official URL: <https://github.com/GoogleChrome/modern-web-guidance> |
| `website-architect` | Plan IA, section flow, component/design-token/animation/3D/assets/SEO/perf before coding. |
| `premium-web-design` | Agency-quality composition, typography, whitespace, hierarchy; anti-generic-AI checklist. |
| `3d-web-design` | three / R3F / drei / postprocessing / GLTF / shaders / cameras / fallbacks. |
| `webgl-performance` | GPU budgets: draw calls, DPR, textures, shader cost, memory, instancing, quality tiers. |
| `cinematic-animation` | GSAP + ScrollTrigger + Motion + Lenis choreography, reveals, reduced-motion. |
| `interaction-design` | Hover/focus/active/drag/cursor/menus/modals/loading/feedback. |
| `scroll-storytelling` | Lenis + ScrollTrigger pins, horizontal rails, scroll-driven scenes + cleanup. |
| `frontend-components` | shadcn/ui + Tailwind + Lucide + Motion; reuse-before-build. |
| `responsive-performance` | 320→1920 px, images, fonts, JS, CLS, animation cost. |
| `visual-qa` | Mandatory pre-ship browser QA via Chrome DevTools MCP; fix what you find. |
| `figma-to-code` | Translate Figma nodes → token-based components (needs Figma MCP connected). |

## 4. MCP servers (Antigravity) — `.agents/mcp_config.json`

| Server | Type | Purpose | Auth |
|---|---|---|---|
| `chrome-devtools` | stdio (`npx` launch) | Screenshots, console/network, performance, reduced-motion, WebGL debugging | None |
| `context7` | remote URL | Current docs for three, R3F, drei, GSAP, Lenis, Motion, React, Tailwind, shadcn | None (optional API token for higher quotas — never in repo) |
| `shadcn` | stdio (`npx` launch) | shadcn/ui registry search & component add | None |

Official sources:
- Chrome DevTools MCP: <https://github.com/ChromeDevTools/chrome-devtools-mcp>
- Context7: <https://context7.com/> (MCP endpoint <https://mcp.context7.com/mcp>)
- shadcn MCP: `npx shadcn@latest mcp` (docs <https://ui.shadcn.com/docs/mcp>)

`.agents/mcp_config.json` contains **no secrets** by design. Auth/keys are documented in
`.env.example` (names only) and supplied via the Antigravity MCP UI or environment, never in
this file.

### How to verify an Antigravity MCP connection

1. Launch Antigravity (`agy` or the desktop app).
2. Open **MCP / Servers** in the agent or settings UI (Antigravity MCP Store).
3. Enable/refresh `chrome-devtools`, `context7`, `shadcn`. Watch for "connected" state.
4. Ask in chat: *"list your MCP tools"* or *"fetch the three.js docs via context7"* — a
   successful reply proves the server is live.
5. Do **not** claim a server is connected until the IDE shows it connected and a tool call
   succeeds.

For `chrome-devtools` (stdio, launched via `npx`):
- It bridges a Chrome instance. It can launch its own browser, or attach to an already-running
  one exposed on `<http://127.0.0.1:9222>` (Chrome launched with `--remote-debugging-port=9222`).
- The `--browser-url=http://127.0.0.1:9222` flag is already set so any local Chrome DevTools
  remote-debugging instance is used.
- Needs Node.js LTS (≥ 18; 20 recommended). This machine has Node v20.20.2 — OK.
- First launch downloads the browser binary (or uses your system Chrome); allow a moment.

## 5. Chrome DevTools MCP (essential) — details

- Launch a debuggable Chrome when needed:
  `google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/cdt-profile`
  or use the MCP's own launch. No global Node replacement was performed (Node v20.20.2 is
  active via nvm — unchanged).
- Drive QA: navigate, set device metrics for 320/375/414/768/1024/1280/1440/1920, capture
  screenshots, read console + network, emulate `prefers-reduced-motion`, throttle CPU/network,
  inspect WebGL context, debug the R3F canvas. All steps: see `.agents/skills/visual-qa/SKILL.md`.
- Playwright is **not** added to Antigravity config on purpose (it would duplicate
  chrome-devtools MCP's browser automation). Codex keeps its own Playwright MCP.

## 6. Context7 — usage rules

- Prefer it whenever an implementation API may have changed: `three`, `@react-three/fiber`,
  `@react-three/drei`, `gsap`, `lenis`, `motion`, `react`, `next`, `tailwindcss`, `shadcn/ui`.
- No API key needed for normal use. If a `CONTEXT7_API_KEY` exists locally, keep it in `.env`,
  never in the repo.

## 7. Motion AI Kit & Motion MCP

- **Skills**: the Motion AI Kit (`/motion` — best-practices, docs search, CSS springs,
  performance audit, transition preview) is installed in `.agents/skills/motion`, mirrored to
  `.claude/skills/` and `.opencode/skills/`. Because Antigravity reads `.agents/skills`, the
  skill is available to it.
- **Official support status**: the Motion AI Kit installer (`npx motion-ai`) officially targets
  Claude Code, Cursor, Amp, OpenCode, Gemini CLI, Copilot, or a custom folder. Antigravity is
  **not an officially named target** (as of this writing), so do **not** force an unsupported
  install. Recommended: rely on the universal `.agents/skills/motion` install already present, or
  pick the installer's "custom folder" option when re-running.
- **MCP servers**: `motion` + `motion-plus` are remote URL servers already registered for
  OpenCode (`opencode.jsonc`) and Codex (`.codex/config.toml`, `.mcp.json`). Motion+ features
  (MotionScore audits, premium examples) activate by signing in from the agent; basic docs work
  without a key. Add them to Antigravity via its MCP UI (remote `https://mcp.motion.dev` and
  `https://mcp.motion.dev/plus`) if you want /motion docs inline there.
- The **core project** uses the regular `motion` npm package (`motion/react`), never
  `framer-motion` — independent of the AI Kit.

## 8. Figma Dev Mode MCP (optional, auth required)

- Official remote endpoint: `https://mcp.figma.com/mcp` (Figma developers docs:
  <https://developers.figma.com/docs/figma-mcp-server/>).
- **This repo does not hard-code Figma credentials.** Auth is interactive OAuth tied to your
  Figma account; it happens inside the agent's MCP flow, not in committed config.
- To use from Antigravity: open the Antigravity **MCP Store**, search for the official **Figma
  Dev Mode MCP**, install it, then authenticate (OAuth) and verify by asking the agent to list
  the selected Figma node. If your Antigravity MCP Store does not offer it, use the Figma MCP
  already configured for Codex (`codex mcp login figma`) and invoke `figma-to-code` there.
- Verify: after connecting, select a frame in Figma (Dev Mode) and prompt the agent to read the
  selection; a successful read proves the connection. Never claim auth succeeded without that.

## 9. Modern Web Guidance (official install)

Installed through the official GoogleChrome tooling (this is the Apple-installed command that
was run; the installer targets universal `.agents/skills` which Antigravity reads):

```bash
# Official installer (interactive) — inside the repo:
npx -y modern-web-guidance@latest install
# Non-interactive (targets only Antigravity's universal skill dir):
npx -y skills add GoogleChrome/modern-web-guidance --skill modern-web-guidance --agent antigravity --copy -y
```

- Source: <https://github.com/GoogleChrome/modern-web-guidance> (Apache-2.0).
- Ninety guides land in `.agents/skills/modern-web-guidance/guides`; the skill itself searches on
  demand via `npx -y modern-web-guidance@latest search "<query>"`.
- Future updates: `npx -y modern-web-guidance@latest update` (or re-run the installer).
- Also installed as a VS Code extension package (the npm package
  `modern-web-guidance` contributes a chat skill) — Antigravity, being VS Code-based, can use
  either the extension or the `.agents/skills` copy.

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| Chrome DevTools MCP won't start | Node must be ≥ 18 (active: v20.20.2). Confirm port 9222 free, or let the MCP launch its own profile. Check `.agents/mcp_config.json` JSON validity. |
| Skill not listed in Antigravity | Restart Antigravity; confirm `<name>/SKILL.md` exists with valid frontmatter (no duplicate names, kebab-case). Skills are picked up from `.agents/skills` at startup. |
| Context7 fails | The repo config uses the remote URL `https://mcp.context7.com/mcp` — needs internet. No key required. |
| shadcn MCP slow/first-run | First `npx -y shadcn@latest mcp` downloads packages; subsequent runs are cached. |
| Motion skills missing | The `/motion` skill shares `.agents/skills/motion`; re-run `npx motion-ai` with the "custom folder" target if you need a reinstall, or verify the folder wasn't pruned. |
| Figma MCP not connected | Not pre-configured by design (OAuth). Install from the Antigravity MCP Store or authenticate with Codex instead. |
| WebGL QA on the hero | Use chrome-devtools MCP websocket/console tools to read `renderer.info`, force `prefers-reduced-motion`, throttle CPU to low tier, and verify the fallback card renders when WebGL is disabled. |
| JSON invalid after edits | Validate `.agents/mcp_config.json`, `opencode.jsonc`, `.mcp.json` with `node -e "JSON.parse(require('fs').readFileSync(...))"` before saving. |

## 11. Mandatory QA loop before shipping UI work

1. `$visual-qa` (or `/visual-qa`) with chrome-devtools MCP → fix every issue found.
2. Run the production build and QA the build, not just dev.
3. Check desktop 1280/1440 + tablet 768 + mobile 375 (plus 320/414 spot checks).
4. Verify reduced-motion static fallback and WebGL low-tier behavior.
5. Confirm no console/network errors and a clean `git status` before any commit.

## 12. Related environment docs

- `AGENTS.md` — cross-agent rules, skill table, stack, process.
- `SETUP.md` — environment status, manual steps for Codex/OpenCode.
- `DESIGN_SYSTEM.md` — tokens: type, spacing, color, radius, shadows, motion, 3D, breakpoints,
  a11y, performance.
- `WEB_DESIGN_STACK.md` — library catalogue + official URLs.
- `USAGE.md` — exact invocation examples and test prompts.