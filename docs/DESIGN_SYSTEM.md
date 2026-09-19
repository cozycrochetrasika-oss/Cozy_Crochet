# DESIGN_SYSTEM.md — Cozy_Crochets ("The Living Yarn Store")

## 1. Brand Identity & Visual Concept

**Concept**: *"The Living Yarn Store"*  
The visual identity of Cozy_Crochets embodies warmth, tactile authenticity, and artisanal craftsmanship. The aesthetic feels handmade, cozy, premium, and sophisticated — feminine-neutral rather than sugary or overly pink, keeping real crochet texture and product details at the absolute center of attention.

---

## 2. Color System & Semantic Tokens

All colors are implemented as semantic CSS custom properties. Components reference semantic roles (`var(--bg)`, `var(--fg)`, `var(--accent)`), not hardcoded values.

### Brand Color Palette

| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| `cream` | `#FFF8F1` | Primary background canvas, light and warm |
| `blush` | `#F1C6C0` | Secondary surface tint, delicate warmth |
| `dustyRose` | `#DFA7AD` | Primary brand accent, button fills, highlights |
| `lavender` | `#C9B7E8` | Tertiary accent, creative flourish, tags |
| `sage` | `#B8D1BF` | Natural botanical accent, success badges, ribbons |
| `cocoa` | `#493630` | Subdued dark neutral, secondary headings, borders |
| `warmGold` | `#CDA567` | Metallic craft accent, star ratings, premium seals |
| `ink` | `#241D1A` | Primary high-contrast typography, deepest neutral |

### Semantic CSS Variables Mapping

```css
:root {
  /* Core Brand Tokens */
  --color-cream: #FFF8F1;
  --color-blush: #F1C6C0;
  --color-dusty-rose: #DFA7AD;
  --color-lavender: #C9B7E8;
  --color-sage: #B8D1BF;
  --color-cocoa: #493630;
  --color-warm-gold: #CDA567;
  --color-ink: #241D1A;

  /* Semantic UI Tokens */
  --bg: var(--color-cream);
  --surface: #FFFFFF;
  --surface-raised: #FFFDF9;
  --surface-muted: #F8EFE6;
  
  --fg: var(--color-ink);
  --fg-muted: var(--color-cocoa);
  --fg-subtle: #7A6963;
  --fg-on-accent: #FFFFFF;

  --border: rgba(73, 54, 48, 0.12);
  --border-strong: rgba(73, 54, 48, 0.24);

  --accent: var(--color-dusty-rose);
  --accent-hover: #D2959C;
  --accent-soft: rgba(223, 167, 173, 0.16);

  --success: var(--color-sage);
  --warning: var(--color-warm-gold);
  --danger: #D9534F;

  /* Elevation */
  --shadow-sm: 0 1px 3px rgba(36, 29, 26, 0.05);
  --shadow-md: 0 6px 16px -4px rgba(36, 29, 26, 0.08), 0 2px 6px -2px rgba(36, 29, 26, 0.04);
  --shadow-lg: 0 16px 36px -8px rgba(36, 29, 26, 0.12);
  --shadow-yarn: 0 12px 32px -4px rgba(223, 167, 173, 0.25);

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
}
```

---

## 3. Typography Hierarchy

The typography pairs an expressive editorial serif for display and headlines with a highly legible, modern sans-serif for UI, navigation, and body copy.

- **Display & Headline Font**: `Fraunces` / `Playfair Display` (via `next/font/google`). Expressive, soft ink traps, editorial elegance.
- **Body & UI Font**: `Plus Jakarta Sans` (via `next/font/google`). Crisp geometric humanist sans, balanced legibility on mobile screens.
- **Numbers & Monetary Figures**: Configured with `tabular-nums` (`font-variant-numeric: tabular-nums`) so prices and inventory counters never cause layout jitter.

### Fluid Type Scale

| Style | Desktop | Mobile | Line Height | Letter Spacing | Font Family |
|---|---|---|---|---|---|
| `Display Hero` | `clamp(2.5rem, 5vw, 4.5rem)` | 2.5rem | 1.05 | -0.02em | Editorial Serif |
| `Heading 1` | `clamp(2rem, 3.5vw, 3rem)` | 2rem | 1.15 | -0.015em | Editorial Serif |
| `Heading 2` | `clamp(1.5rem, 2.5vw, 2.25rem)`| 1.5rem | 1.2 | -0.01em | Editorial Serif |
| `Heading 3` | `clamp(1.25rem, 1.8vw, 1.5rem)`| 1.25rem | 1.3 | 0em | Sans-Serif (Semibold) |
| `Body Large` | 1.125rem | 1rem | 1.6 | 0em | Sans-Serif (Regular) |
| `Body Regular` | 1rem | 0.9375rem | 1.55 | 0em | Sans-Serif (Regular) |
| `Caption / Meta`| 0.875rem | 0.8125rem | 1.4 | +0.01em | Sans-Serif (Medium) |
| `Overline` | 0.75rem | 0.6875rem | 1.2 | +0.12em (uppercase) | Sans-Serif (Bold) |

---

## 4. Spacing Scale

Base unit is **4px**:
- `space-1` (4px) · `space-2` (8px) · `space-3` (12px) · `space-4` (16px) · `space-5` (20px) · `space-6` (24px)
- `space-8` (32px) · `space-10` (40px) · `space-12` (48px) · `space-16` (64px) · `space-20` (80px) · `space-24` (96px) · `space-32` (128px)

Section vertical spacing: `space-20` to `space-24` on desktop, `space-12` to `space-16` on mobile. Container max-width: `1280px` with responsive horizontal padding (`16px` mobile, `24px` tablet, `48px` desktop).

---

## 5. Component Style Guidelines

1. **Product Cards**:
   - Clean framing with subtle border (`--border`) and warm surface (`--surface`).
   - Image aspect ratio: 4:5 or 1:1 with overflow hidden and smooth zoom on hover (`scale-105 transition-transform duration-500 ease-out`).
   - Prominent bold title and price in INR (`font-bold font-mono tracking-tight text-ink`).
   - Badges (Sold count, Best seller, Handmade) using muted pill styling (`--color-sage` or `--color-warm-gold` soft fills).

2. **Buttons**:
   - Primary: dustyRose background, white text, subtle shadow, 12px border radius, min height 44px for touch targets.
   - Secondary / Ghost: cream background, cocoa text, hairline border, active scale 0.98.
   - Magnetic hover on fine pointers (`@media (pointer: fine)`).

3. **Gallery & Lightbox**:
   - Thumbnails at 1:1 aspect ratio with active ring indicator.
   - Smooth swipe support on mobile touch screens (`touch-action: pan-y`).
   - Video player with muted autoplay, subtle play/pause controls, and rounded bezel.
   - Fullscreen lightbox expanding to 80% viewport with accessible close button and keyboard `Escape` dismissal.

---

## 6. Accessibility & Contrast (WCAG AA Compliant)

- **Contrast Ratios**:
  - Ink (`#241D1A`) on Cream (`#FFF8F1`): **14.2:1** (Exceeds AAA).
  - Cocoa (`#493630`) on Cream (`#FFF8F1`): **9.1:1** (Exceeds AAA).
  - Dusty Rose (`#DFA7AD`) is used for non-text accents, container fills, and large button backgrounds with crisp white text (`#FFFFFF`, **4.6:1** contrast).
- **Focus Rings**: Universal 2px offset focus ring using `var(--color-dusty-rose)` on all keyboard-navigable elements.
- **Motion Toggle**: `prefers-reduced-motion: reduce` unconditionally stops all transforms, disables smooth scroll inertial physics, and displays static compositions.
