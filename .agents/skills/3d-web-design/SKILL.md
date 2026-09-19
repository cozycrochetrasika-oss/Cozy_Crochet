---
name: 3d-web-design
description: >
  Use when building or planning 3D/WebGL experiences: Three.js scenes, React Three Fiber, Drei,
  post-processing, GLTF/GLB models, custom shaders, particles, instancing, scroll/pointer-driven
  cameras, bloom, or WebGL fallbacks. Invoked by prompts like "add a 3D product viewer",
  "rotate the hero object on scroll", "make an immersive WebGL scene", "add bloom and depth of field".
---

# 3D Web Design

Use 3D when it materially improves the story — a hero product you can rotate, a scene that sells
the craft — never merely to decorate. One strong object beats a room of noise.

## Preferred stack

- `three` — the WebGL library.
- `@react-three/fiber` — React renderer for Three scenes.
- `@react-three/drei` — camera rigs, controls, environments, helpers, text, useGLTF, etc.
- `@react-three/postprocessing` when needed (bloom, depth of field, vignette, chromatic
  aberration).
- `postprocessing` (vanilla, if not using R3F).
- Custom shaders when a material needs a bespoke look (see `@react-three/drei`'s shader material
  helpers or `THREE.ShaderMaterial`).
- GLTF/GLB for models, Draco or Meshopt compression for heavy meshes.
- **GSAP** for coordinated camera/scene motion and timelines with the rest of the DOM.
- **Lenis** for smooth scrolling that the scene can read (drive camera/scroll-driven states from
  Lenis scroll values).

## Camera

- Use a perspective camera with a sensible fov (≈28–50). If using drei, consider
  `CameraControls`, `OrbitControls` only for user-drag contexts, or a custom
  cinematic rig (`useFrame` + easing toward target positions).
- For one hero object: frame it at ~80% of viewport height from a slight three-quarter angle.
- Camera motion must feel deliberate: slow eased moves, small parallax with pointer, gentle drift.
  Never constant orbiting "screensaver" motion except for subtle idle animation.

## Lighting

- Prefer an **environment map** (`drei Environment`, ideally a precomputed HDR) for materials
  that want realistic response, then fill with 2–3 lights max:
  - A key (directional or spot) with visible shadows for the subject.
  - A soft fill (low intensity, complementary temperature).
  - Optional rim light for product pop on dark backgrounds.
- Keep `shadow.mapSize` reasonable (1024–2048); never 4096 for decorative elements.
- Match lighting temperature to the site palette; warm tones fit a handmade/craft brand.

## Materials, textures, models

- Use `DRACOLoader`/`MeshoptDecoder` for compressed GLBs; keep vertex counts purposeful.
- Prefer color/managed texture sizes: the hero mesh maybe 1024², decorative 512² max (or fewer).
- Compress textures (`basis/kTX2` via `gltf-transform` or WebP), `generateMipmaps: true` when
  scaling down, `colorSpace` set correctly (SRGB for color, linear for data).
- When no model is available, build hero objects from primitives — a crochet product can be
  beautifully conveyed with a soft `MeshPhysicalMaterial` sphere/torus approximating yarn and
  threading — composited with DOM imagery.

## Particles, instancing, post-processing

- Particles: use `Points` with a shared `BufferGeometry`, not 1000 mesh clones. Budget
  < 5–10k points on desktop, far fewer or disabled on mobile.
- Instancing: `InstancedMesh` for repeated items (e.g. confetti, floating yarn strands).
- Post-processing (`@react-three/postprocessing`): apply **selectively**. Bloom (low threshold,
  subtle strength), depth of field only when it sells composition. Every effect costs GPU;
  disable most on mobile. Best perf practice:
  - No post effects → faster. Add only what the design needs.
  - Use `adaptive` / resolution scaling on weak GPUs.
- Effects like `Impact`/distortion/displacement: use displacement maps or `onBeforeCompile` /
  custom shaders. Keep animation amplitudes small and eased.

## Shader effects

- Custom shaders for: yarn-like iridescence, soft toon rim, contour lines, noise fades,
  dissolve reveals. Keep them short, uniform-driven, and safe to fall back from.
- Never force high-frequency noise that flickers on mobile GPUs.

## Scroll-controlled scenes

- Drive scene state from scroll progress (from Lenis’ normalized value or `ScrollTrigger`
  progress) passed into a store — never update DOM/React state per frame (causes rerenders).
  Use `useFrame` reading a ref.
- Pin a section over the canvas only if it adds meaning (see `scroll-storytelling`).

## Pointer interaction

- Subtle parallax: map normalized pointer to a small camera offset or target rotation
  (careful to avoid null rotations / gimbal lock). Ease with `maath` `damp` or lerp in `useFrame`.
- For draggable product rotation: use drei `CameraControls` or hand-rolled `useFrame` rotation
  with inertia; the draggable surface must also expose keyboard/ARIA alternative (see
  `interaction-design`).

## Rules

- **Do not add 3D merely for decoration.** Ask: does this 3D sell the product or tell the story?
  If not, use tasteful DOM/CSS instead.
- **Prefer one strong hero object** over a cluttered scene.
- **Use cinematic camera motion** — slow, eased, deliberate.
- **Keep movement controlled** — subtle ranges; respect taste.
- **Optimize polygon count and textures** — import budgets; compress; mipmap.
- **Avoid unnecessarily high device pixel ratios** — cap `dpr` at [1, 1.75] desktop,
  [1, 1.25] mobile; three does not need full retina for interpolated content.
- **Lazy-load large models** — `useGLTF` inside `Suspense`, load only after critical UI paints.
- **Provide graceful fallback when WebGL is unavailable** — detect capability
  (`WebGL2` present, animesh) and render a styled image/video card; never a blank stage.
- **Reduce visual complexity on mobile** — fewer particles, disable/reduce post-processing,
  lower dpr, disable shadows on weak GPUs.
- **Respect `prefers-reduced-motion`** — freeze scene, disable idle animation, and stop scroll
  coupling.
- Never flip a canvas that is off-screen indefinitely; pause `useFrame` work when the section is
  not in view (IntersectionObserver).

## QA checklist

Anti-FOUC, no WebGL console errors, fallback renders, `dpr` cap honored, no layout shift from
canvas mount, mobile frame rate check, reduced-motion respected.