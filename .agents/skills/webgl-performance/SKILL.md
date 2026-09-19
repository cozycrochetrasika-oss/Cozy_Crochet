---
name: webgl-performance
description: >
  Use when optimizing the cost of Three.js/WebGL scenes: draw calls, geometry and polygon
  budgets, texture memory and compression, shader complexity, render resolution and DPR capping,
  animation-loop and useFrame cost, model/GLTF loading, GPU memory management, instancing, and
  avoiding React rerenders inside the render loop. Also use for low-end/integrated GPU behavior
  and mobile WebGL quality tiers. Invoked by prompts like "make the 3D scene faster", "too many
  draw calls", "the WebGL hero is laggy on mobile", "lower GPU load", "reduce texture memory".
---

# WebGL Performance

A premium 3D scene that chugs on an integrated GPU is not premium. Budget every cost, measure,
and degrade gracefully. This skill is the performance companion to `3d-web-design` — read both
together, then apply `visual-qa` at the end.

## Budget first

- **Frame budget**: 60 fps needs every frame ~16.7 ms total, of which WebGL should take a small
  fraction on mid-tier hardware. Cost is dominated by *pixels drawn* × *fragment work*, then
  overdraw, then draw calls.
- **Set per-project budgets in `DESIGN_SYSTEM.md`** and keep them there: draw calls, tris,
  texture MB, dpr caps, particle counts. Anything that breaks a budget is a PR-blocker, not a
  suggestion.

## Render resolution & DPR

- **Cap device pixel ratio**: `gl.dpr` `[1, 1.75]` desktop, `[1, 1.25]` mobile. Retina does not
  need full native resolution for interpolated content.
- Clamp `size` to the canvas parent, not the window; never render bigger than the element.
- On weak GPUs, render at a fixed lower scale and let post-processing upsample. Consider
  drei's `AdaptiveDpr` or a manual quality tier for low framerates.
- Cap/disable post-processing passes (`@react-three/postprocessing`): every effect = extra
  render targets and full-screen passes. Bloom + DoF together can double the fill rate.

## Geometry

- **Triangle budgets**: hero object purpose-built (50k–150k tris is plenty; a yarn-like hero
  from primitives is far cheaper than an imported high-poly scan).
- Prefer **merged/batched geometry** over many small meshes; use `InstancedMesh` for repeated
  items (confetti, leaves, floating yarn) — one draw call instead of hundreds.
- Reduce segments/segments where nobody zooms: default `SphereGeometry`/`TorusGeometry` segments
  are usually overkill; cut them.
- Use **LOD** (`THREE.LOD` or swap materials in `useFrame` by distance) when the scene has
  multiple objects.
- Let three merge nearby geometry where static with the same material
  (`BufferGeometryUtils.mergeGeometries`).

## Textures

- **Size to usage**: hero mesh ≤ 1024², decorative ≤ 512² (or 256²), never a 4k texture on a
  small product.
- **Compress**: KTX2/Basis via `gltf-transform` (or WebP), `generateMipmaps: true` when scaling
  down, `minFilter` GPU-compressed, `colorSpace: SRGBColorSpace` for color, linear for data.
- **Memory**: one texture per purpose, shared across instances via one material. Watch RGBA
  float or HDR textures (env maps are big — use small equirect or 6-face HDR, or a `RoomEnvironment`).
- Check `(material.map.image.width * height * 4)` sums against the texture budget.

## Shaders & materials

- **Reuse materials**, don't clone per object: shared material = shared compiled shader program.
- Keep custom shader code short and uniform-driven. Avoid per-fragment branching loops,
  `for` loops with data-dependent bounds, and expensive math in the fragment stage.
- Prefer derivatives/`#ifdef` over dynamic branching — the shader compiler can't optimize
  conditionals cheaply.
- Cheap material first: `MeshStandardMaterial`/`MeshPhysicalMaterial` over raw PBR custom
  shaders unless the look demands it. Disable features you don't use (no `envMap` on every
  floor, no roughness map when flat is fine).
- **Shadow cost is real**: each shadow-casting light does another pass. ≤ 2 shadow lights,
  `shadow.mapSize` ≤ 2048 (hero) and 1024 elsewhere; disable shadows on mobile/weak GPUs.

## Draw calls

- Target < 150 draw calls desktop, < 50 strong mobile (see `DESIGN_SYSTEM.md`), measured with
  `renderer.info.render.calls`.
- Techniques: `InstancedMesh`, merged geometry, `Transmission` sparingly, one canvas per page
  (never multiple WebGL contexts with full scenes), batched materials by `material.id`.
- Reduce overdraw: small/transparent particles, opacity-tested materials, tight bounding boxes,
  no full-screen DOM overlays above the canvas burning the compositor.

## Animation loops

- **Never update React state per frame** — drive 3D from `useFrame` reading refs. React
  rerenders every frame kill 60 fps (`suspense`/store writes should be events, not rAF).
- Pause when not visible: `IntersectionObserver` gate on the canvas container; stop `useFrame`
  work (or set a frozen flag) off-screen; respect `document.hidden` (tab switch loses GL
  context silently on some drivers).
- Use easing libraries (`maath` `damp`, lerp) in `useFrame`, not setState.
- One render loop (R3F manages it); don't add competing `requestAnimationFrame` loops that
  mutate the scene.

## Model loading

- **Compress models**: Draco (geometry) or Meshopt (materials+geometry), `gltf-transform`
  optimize, quantized positions/normals, GPU-compressed textures.
- **Load lazily**: `useGLTF` inside `Suspense`; preload only the hero model and only after
  critical UI paints. Below-hero models load on scroll (`inView`).
- Cache GLTFs (`useGLTF` cache) so revisits don't refetch; verify the served model is
  `Content-Encoding: gzip/br` from the host.
- Trap footguns: `KHR_materials_unlit` on every part, huge AO maps, embedded screenshots.

## GPU memory & leaks

- Dispose on unmount: geometries, materials, textures, render targets,
  post-processing passes (`effect.dispose()`, `renderer.renderLists.dispose()`).
- Don't rebuild geometries/materials/textures inside `useFrame` or per-render effects.
- Watch `THREE.Cache`, `useLoader` caches, and cloned materials multiplying memory.
- Use `renderer.info.memory` (geometries/textures) as the leak check before/after route changes.

## React & R3F rerender discipline

- `const { gl, scene, camera } = useThree()` once; read in `useFrame`.
- Components that only mutate scene refs don't need React rerenders — keep props stable,
  memoize the scene subtree (`React.memo`), split heavy/static and interactive parts.
- Avoid `setState` on scroll/pointer in the scene; write to refs, let `useFrame` read them.

## Responsive quality tiers

- One `deviceQuality()` detection (GPU tier via `WEBGL_debug_renderer_info`, memory, dpr,
  coarse pointer, mobile OS flags) that returns: **high** / **medium** / **low**.
  - High: full dpr, shadows, particles ≤ budget, optional bloom/DoF.
  - Medium: dpr 1.25, shadows reduced or off, fewer particles, no DoF.
  - Low: dpr 1 (or ≤ 0.75 scale), no shadows, particles minimal/off, no post-processing,
    lower-LOD geometry, simpler background.
- Apply at init; re-assess on `context lost`/resize if needed. Content parity: the fallback
  image/video must look intentional (see `3d-web-design`).

## Measure, don't guess

- Inspect with browser DevTools: `Performance` panel (GPU + scripting frames),
  `three` `renderer.info` (draw calls/tris), memory snapshots; use the Chrome DevTools MCP
  (`visual-qa`) to capture on real widths (320/375/768/1440) and mid-tier emulation.
- Test low-end GPU explicitly (device emulation with `GPU` throttling, integrated-GPU laptop).
- Verify no WebGL context loss on tab-switch/resize, no unhandled shader compile errors.

## Checklist before "done"

- dpr capped per tier; draw calls and tris within budget; textures compressed and size-checked;
  shaders minimal; loop paused off-screen; model lazy-loaded and compressed; dispose on
  unmount; no React-state per frame; low tier verified at 320–414 px with a weak GPU; fallback
  renders when WebGL is absent.