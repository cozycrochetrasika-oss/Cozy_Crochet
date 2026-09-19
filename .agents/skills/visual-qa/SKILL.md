---
name: visual-qa
description: >
  Use after meaningful UI work — mandatory before marking work finished: inspect desktop/tablet/
  mobile, navigation, buttons, typography, spacing, overflow, z-index, breakpoints, animations,
  loading states, WebGL/console/network errors, accessibility, and reduced-motion behavior using
  the available browser tooling (Chrome DevTools MCP in Antigravity/OpenCode, Playwright MCP in
  Codex). Fix what you find, do not only report it. Invoked by prompts like "run visual QA",
  "check the site at mobile width", "any console errors?", "verify the build looks right".
---

# Visual QA

The final gate. Never call a website "finished" until it has been checked with available
browser/QA tooling when practical.

## When

After any meaningful UI work (new section, refactor, style change, animation, 3D scene).
Run, at minimum, a desktop and a couple of mobile pass; for major work, the full matrix below.

## What to inspect

1. **Graphics/browser matrix** (Playwright MCP when available; else Playwright scripts):
   desktop 1280/1440, tablet 768, mobile 375 (and 320/414 spot checks).
2. **Navigation** — menu works, links resolve, header sticky behavior, active states, route
   changes don't reset scroll state, no dead links.
3. **Buttons** — hit targets ≥ 44 px, hover/focus/active states visible, no layout shift on
   hover, keyboard operable, disabled styling sensible.
4. **Typography** — no overflow/widows breaking layout, line heights readable, no FOUT/FOIT
   (flash of unstyled text), font loading intact, editorial contrast respected.
5. **Spacing** — consistent rhythm, no broken gaps at each breakpoint, no touching elements
   meant to breathe.
6. **Overflow** — horizontal scrollbars anywhere, clipped shadows, content bleeding past
   containers; any `overflow-x: hidden` used as a hack is a smell to remove.
7. **z-index** — modals/lightbox above sticky header, dropdowns above content, 3D canvas layers
   correctly stacked, no elements invisible below other layers.
8. **Responsive breakpoints** — layout reacts per `responsive-performance`: nav collapses,
   hero reframes, gallery swipes, grids reflow.
9. **Animations** — entrances play, do not overlap awkwardly, don't block the primary CTA,
   don't retrigger/XOR on scroll, no flash of un-animated content before scripts run, timings
   align with design system motion tokens.
10. **Loading states** — skeletons appear, no contentless flashes, images lazy-load,
    hydration completes, no cumulative layout shift on image mount.
11. **WebGL errors** — three scene renders (no black canvas), WebGL context not lost on tab
    switch, fallback shown when WebGL unsupported, dpr capped, no unhandled promise rejections.
12. **Console errors** — zero uncaught errors, no missing chunk imports, no React key warnings,
    no accessibility warnings from tooling.
13. **Network errors** — no 404s/500s (check `public/` asset paths — this repo's folders map to
    `/Bag/…`, `/Rose/…`, etc.), no failed images/videos, no mixed content, no CORS failures.
14. **Accessibility** — keyboard end-to-end (tab through nav/modals/lightbox), focus visible,
    semantic landmarks/headings, alt text present, form labels present, role=alert/status used.
15. **Reduced-motion** — with `prefers-reduced-motion: reduce` forced: content fully visible &
    static, no pinning, no scroll scrub, motion-free fallback (see `cinematic-animation`,
    `scroll-storytelling`).

## How to run it

Order of preference:

1. **Chrome DevTools MCP** (Antigravity/OpenCode, `.agents/mcp_config.json`) — navigate,
   screenshot at breakpoints with device emulation, read console/network via CDP, emulate
   `prefers-reduced-motion`, inspect performance/CPU throttling, and debug WebGL. Requires a
   browser on `http://127.0.0.1:9222` (launch it with `--remote-debugging-port=9222`, or let the
   MCP start one).
2. **Playwright MCP** (Codex) — same flows: navigate, screenshot at viewport emulations,
   console/network via CDP, reduced-motion emulation, click-through flows.
3. Playwright CLI/scripts (`npx playwright test`) with the same assertions.
4. Manual DevTools only as a last resort, and report which steps couldn't be automated.

## Rules

- **Do not only report visual problems — fix them.** QA both finds and resolves: after listing
  issues, make the code changes, re-run, and confirm.
- Check both "golden path" and edge states: lightbox open → escape, cart with 1 item, empty
  search, admin view (if present), broken image path fallbacks.
- Verify the actual build (`npm run build`, then the preview/prod server), not just dev mode —
  production minification and asset paths behave differently.
- Report format: status (PASS/FAIL) per category, evidence (screenshot/video), severity,
  root cause, fix, and re-check result. Keep it in the working notes / README QA section.

## Reduced-motion & mobile differentiation

Remember this storefront's narrative sections (pinned "how it's made", parallax) must degrade
gracefully: verify static fallback renders identically-structured content with no transforms.