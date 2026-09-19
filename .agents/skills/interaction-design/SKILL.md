---
name: interaction-design
description: >
  Use when designing micro-interactions and UI state behavior: hover, focus, active, drag, pointer
  interaction, cursor effects, magnetic buttons, tooltips, menus, modal/navigation transitions,
  loading states, or success/error feedback. Invoked by prompts like "make this button magnetic",
  "add a hover effect", "animate the modal open", "design loading states", "what happens on focus".
---

# Interaction Design

Interactions give a site its felt quality: responsiveness, feedback, and craft. They must feel
intentional and remain accessible.

## Covers

- **Hover** — immediate, tiny (150–250 ms), usually CSS transitions on `transform`/`opacity`/
  `box-shadow`. Never restructure layout on hover (no jump). Prefer scale 1.02–1.04 or slight
  lift + shadow deepen. Underline grows for links.
- **Focus** — always visible focus ring (2–3 px offset, `outline` or focus-visible). Keyboard
  users must always see where they are. Never `outline: none` without a replacement.
- **Active** — pressed states: quick (80–120 ms) pressed translate/scale (0.97) for tactile feel
  on buttons/cards.
- **Drag** — draggable carousels/sliders with pointer events; inertia/clamp on release; provide
  arrow buttons + keyboard support as the accessible alternative (drag is a progressive
  enhancement).
- **Pointer interaction** — parallax, tilt, spotlight — subtle, GPU-friendly
  (`transform`, `custom-properties`), throttled with `requestAnimationFrame`, and disabled on
  coarse pointers.
- **Cursor interactions** — custom cursor (dot/ring/glow) only on fine pointers
  (`@media (pointer: fine)`), hides on touch; blends with the theme; matched to the system cursor
  with `pointer-events: none`. Never obstruct the clickable area; keep accessible target sizes.
- **Magnetic buttons** — translate toward cursor within a small radius (≤ 12–16 px), eased back
  on leave. Desktop-only enhancement; must not affect layout or click targets.
- **Tooltips** — appear on hover + focus; short text; positioned safely; dismissible;
  `aria-describedby` when content is essential.
- **Menus** — keyboard navigation (arrow keys, Esc to close, focus trap where appropriate),
  smooth open/close with `AnimatePresence`/CSS, no layout jump.
- **Modal transitions** — backdrop fade + panel scale/fade (150–250 ms), `AnimatePresence` for
  exit; body scroll lock; focus moved in and restored on close; Esc to close.
- **Navigation transitions** — route/page transitions (cross-fade, slide/mask) only when they add
  continuity; keep them short (< 400 ms) and reduced-motion safe.
- **Loading states** — skeletons that mirror final layout (avoid jank), spinners only for
  indeterminate waits. Progress feedback for long operations. Never hide a loading state without
  content.
- **Success/error feedback** — inline, near the control; clear, concise, with
  `role="status"` / `role="alert"` where appropriate; never rely on color alone. Motion (slight
  shake for error, check pop for success) with respect for reduced-motion.

## Principles

- **Intentional** — every interaction is a choice with a purpose.
- **Responsive** — responds within the perception frame; use the mapped easing curve, not
  defaults. Ask the Motion skill for a tuned spring (`/motion`) when fine-tuning.
- **Non-blocking** — interactions never prevent content being read or operated.
- **Touch-first** — touch devices must not depend on hover. Any hover-only affordance must have a
  tap/keyboard equivalent. Leave ≥ 300 ms between hover and a large action so a stray tap doesn't
  fire.
- **Keyboard-first for structure** — tab order matches visual order; every interactive element is
  reachable and operable; focus rings visible.
- **Reduced motion** — interactions degrade to fast fades or nothing:
  respect `prefers-reduced-motion`.

## Rules

- Target size ≥ 44 px (mobile, WCAG 2.5.5); explicitly pace affordances for coarse pointers.
- `touch-action: manipulation` on tappable elements, `touch-action: pan-y` on sliders.
- Read pointer media: `(pointer: fine)` vs `(pointer: coarse)` before enabling any
  cursor/hover-only enhancement.
- Never silently trap focus; use a focus trap library pattern for modals only.
- Keep interaction style tokens (easing, duration, spring) in one source
  (`DESIGN_SYSTEM.md` motion tokens).

## Implementation pattern

For React + Motion: micro-interactions are usually CSS, but enter/exit and layout animations use
`motion/react`; complex sequences use small GSAP timelines. Wrap interactive behaviors in
components (`<Button>`, `<Tooltip>`, `<Modal>`, `<Menu>`) rather than ad-hoc on every page.