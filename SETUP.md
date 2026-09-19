# SETUP.md — Cozy Crochets environment

How this workspace is tooled and how to finish each step. Read alongside `AGENTS.md`.

## Status summary

- **App**: not scaffolded yet. No `package.json` for the storefront at repo root. The first
  Codex/OpenCode coding session should choose and scaffold the app (preferred: Next.js, for a
  Netlify SSR/static hybrid — **confirm with the user first**).
- **Skills**: 11 project skills in `.agents/skills/` (+ `modern-web-guidance` installed from
  GoogleChrome) and the Motion AI Kit skill (shared with `.claude/skills/` and
  `.opencode/skills/`). Done.
- **MCP servers for Antigravity**: `chrome-devtools`, `context7`, `shadcn` — `.agents/mcp_config.json`.
  **MCP servers for Codex**: `context7`, `playwright`, `shadcn`, `figma`, `higgsfield`,
  `motion`, `motion-plus` — all registered (`codex mcp list`).
- **Antigravity IDE**: v2.14.0 installed (`agy`/desktop app), Node v20.20.2 active — see
  `docs/ANTIGRAVITY_WEB_STACK.md`.

## Manual steps remaining

0. **Antigravity MCP first-run**: in the Antigravity agent/settings MCP UI, enable the servers
   from `.agents/mcp_config.json` (`chrome-devtools`, `context7`, `shadcn`) and confirm they show
   "connected"; launch a Chrome with `--remote-debugging-port=9222` if you want
   chrome-devtools MCP to attach to it. Full steps: `docs/ANTIGRAVITY_WEB_STACK.md`.
1. **Figma MCP auth — REQUIRED before first use**: `codex mcp` / Codex VS Code will prompt to
   authenticate the `figma` server (OAuth to your Figma account). Do this interactively once.
   No Figma token is stored in this repo.
2. **Higgsfield MCP auth**: same flow — OAuth the `higgsfield` server interactively before
   generating AI video/3D assets. No token in repo.
3. **Motion+ MCP**: works on demand; some `/motion` features (MotionScore audits, advanced
   examples) require a Motion+ subscription/account. Authenticate when the tool tells you.
4. **Playwright browsers**: none downloaded yet. They auto-install the first time
   `codex mcp` launches `playwright`; if that fails run `npx playwright install chromium`
   (official method). No browsers were installed during setup to avoid unnecessary downloads.
5. **App scaffolding + dependencies**: run the install commands below in whichever directory
   you scaffold the app (e.g. `app/` or repo root after user confirms).

## Install the frontend dependencies (when the app is scaffolded)

Use the existing package manager (npm — no pnpm/yarn lockfiles exist). Do **not** install these
at the bare repo root yet — there is no package.json to attach them to, and it would create a
lockfile the future framework scaffold will fight.

```bash
# Inside your Next/React app directory:
npm install three @react-three/fiber @react-three/drei gsap lenis motion lucide-react
# Optional post-processing (only if you ship bloom/DoF in the 3D hero):
npm install @react-three/postprocessing postprocessing
# shadcn depends on its own config; run in the app dir:
npx shadcn@latest init
npm install class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest add button dialog sheet skeleton input label
```

Dependency policy (from `AGENTS.md`): never `framer-motion` (use `motion`), no unused deps, and
add libraries only when necessary (`frontend-components` skill).

## Environment variables (no secrets in repo)

Copy names only:

```bash
cp .env.example .env   # fill real values locally, never commit .env
```

## Day-to-day

| Task | Command |
|---|---|
| Run the storefront | `npm run dev` (after scaffold) |
| Production build | `npm run build` |
| Launch Antigravity IDE | `agy` (reads `.agents/skills` + `.agents/mcp_config.json`) |
| Launch Codex in this project | `codex` (from repo root, or VS Code → Codex panel) |
| Launch OpenCode in this project | `opencode` (from repo root) |
| List Codex MCP servers | `codex mcp list` |
| FAQ/QA in Antigravity | agent chat → chrome-devtools MCP (see `docs/USAGE.md`) |
| MCP docs lookups | `codex mcp` → `context7` or Antigravity → `context7` (ask for `three`, `gsap`, `lenis`, `motion` docs) |
| Modern web best practices | `npx -y modern-web-guidance@latest search "<query>"` |
| Playwright QA | `codex mcp` → `playwright` (or `$visual-qa`) |
| Add a shadcn component | `codex mcp` → `shadcn add <component>` (or Antigravity → `shadcn`) |

## Deploy

- Netlify static/SSR from this repo; build command per framework (e.g. `npm run build`),
  output `.next` (Next) or `dist`/`out`.
- Push to GitHub only after user confirmation; clear commit messages.