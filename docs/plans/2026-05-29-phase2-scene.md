# Phase 2 — Scene Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Populate the Scene with Anya, 4 floating objects, 5 polaroid photos, and 5 doors — all with mouse-driven parallax (no React rerenders).

**Architecture:** Single rAF loop in Scene writes `style.transform` directly to DOM nodes via refs. Mouse position lerped toward target with factor 0.09. Each object has a `depth` multiplier (formula: `depth * 15 * normalizedMouse`). No React state updates during mouse movement.

**Tech Stack:** React 18, TypeScript, GSAP (already installed), CSS animations, Vite public/ for assets.

---

## Asset path helper

All assets live in `public/assets/`. Vite serves `public/` relative to `base`, so use `import.meta.env.BASE_URL` to build paths:

```ts
// src/utils/asset.ts
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}assets/${path}`
```

Use `asset('anya_full/anya_full.png')` everywhere — never hardcode `/assets/...`.

---

### Task 1: Asset helper + sceneObjects data

**Files:**
- Create: `src/utils/asset.ts`
- Create: `src/data/sceneObjects.ts`

**Step 1: Create asset helper**

```ts
// src/utils/asset.ts
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}assets/${path}`
```

**Step 2: Create sceneObjects.ts**

```ts
// src/data/sceneObjects.ts
export type SceneObjectType = 'door' | 'object' | 'photo'

export interface SceneObject {
  id: string
  type: SceneObjectType
  x: number      // vw from center (0 = center)
  y: number      // vh from center (0 = center)
  depth: number  // parallax multiplier
  rotation: number
  scale?: number
  // For type === 'door'
  folder?: string
  arch?: string
  sash?: string
  label?: string
  // For type === 'object' | 'photo'
  src?: string
  cursor?: string
}

export const SCENE_OBJECTS: SceneObject[] = [
  // ── DOORS ──
  { id: 'kindergarten', type: 'door', folder: 'kindergarten',
    arch: 'door_kendergarten_arch.png', sash: 'door_kendergarten_sashes.png',
    x: -32, y: -18, depth: 2, rotation: -3, label: 'Садик' },

  { id: 'truancy', type: 'door', folder: 'truancy',
    arch: 'door_truancy_arch.png', sash: 'door_truancy_sashes.png',
    x: 28, y: -22, depth: 2, rotation: 2, label: 'Прогулы' },

  { id: 'garden', type: 'door', folder: 'garden',
    arch: 'door_garden_arch.png', sash: 'door_garden_leaves.png',
    x: -26, y: 20, depth: 2, rotation: -2, label: 'Сад мечты' },

  { id: 'sport', type: 'door', folder: 'sport',
    arch: 'door_sport_arch.png', sash: 'door_sport_sashes.png',
    x: 36, y: 8, depth: 2, rotation: 3, label: 'Спортзал' },

  { id: 'final', type: 'door', folder: 'final',
    arch: 'door_final_arch.png', sash: 'door_final_sash.png',
    x: 4, y: 26, depth: 2, rotation: 1, label: 'Финал' },

  // ── FLOATING OBJECTS ──
  { id: 'manga', type: 'object', src: 'anya_full/manga.png',
    x: -40, y: -28, depth: 3.5, rotation: -8, scale: 0.65, cursor: 'bookstore' },

  { id: 'donut', type: 'object', src: 'anya_full/donut.png',
    x: -28, y: 22, depth: 3, rotation: 12, scale: 0.45, cursor: 'veggie' },

  { id: 'cat', type: 'object', src: 'anya_full/anyas_cat.png',
    x: 44, y: 18, depth: 3, rotation: -5, scale: 0.55, cursor: 'veggie' },

  { id: 'шпагат', type: 'object', src: 'шпагат.png',
    x: 38, y: -28, depth: 3, rotation: 8, scale: 0.5, cursor: 'veggie' },

  // ── PHOTOS ──
  { id: 'p_together', type: 'photo', src: 'our_photos/adult/together.jpg',
    x: -44, y: 5, depth: 2.5, rotation: -6, scale: 0.42 },

  { id: 'p_bar', type: 'photo', src: 'our_photos/adult/in_the_bar.jpg',
    x: 42, y: -12, depth: 2.5, rotation: 5, scale: 0.38 },

  { id: 'p_masks', type: 'photo', src: 'our_photos/adult/with_mask_on.jpg',
    x: -14, y: 34, depth: 2.5, rotation: -3, scale: 0.4 },

  { id: 'p_disco', type: 'photo', src: 'our_photos/teen/on_disco.jpg',
    x: 18, y: 32, depth: 2.5, rotation: 7, scale: 0.36 },

  { id: 'p_sleeping', type: 'photo', src: 'our_photos/adult/anya_and_me_sleeping.jpg',
    x: -36, y: -32, depth: 2, rotation: -9, scale: 0.33 },
]
```

**Step 3: Commit**

```bash
git add src/utils/asset.ts src/data/sceneObjects.ts
git commit -m "feat: add asset helper and sceneObjects data"
```

---

### Task 2: useMousePosition hook

**Files:**
- Modify: `src/hooks/useMousePosition.ts`

**Step 1: Write the hook**

```ts
// src/hooks/useMousePosition.ts
import { useEffect, useRef } from 'react'

interface MouseRefs {
  target: { x: number; y: number }
  current: { x: number; y: number }
}

/** Returns a ref with lerped mouse position, normalized to [-1, 1]. No state — zero rerenders. */
export function useMousePosition(): React.RefObject<MouseRefs> {
  const mouse = useRef<MouseRefs>({
    target:  { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.target.x = (e.clientX / window.innerWidth)  * 2 - 1
      mouse.current.target.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return mouse
}
```

**Step 2: Commit**

```bash
git add src/hooks/useMousePosition.ts
git commit -m "feat: add useMousePosition hook (lerp ref, zero rerenders)"
```

---

### Task 3: AnyaCenter component

**Files:**
- Create: `src/components/Scene/AnyaCenter.tsx`
- Modify: `src/components/Scene/Scene.css`

**Step 1: Create AnyaCenter.tsx**

```tsx
// src/components/Scene/AnyaCenter.tsx
import { forwardRef } from 'react'
import { asset } from '../../utils/asset'

export const AnyaCenter = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="anya-center" data-depth="0.01">
    <img
      src={asset('anya_full/anya_full.png')}
      alt="Аня"
      className="anya-img"
      draggable={false}
    />
  </div>
))
AnyaCenter.displayName = 'AnyaCenter'
```

**Step 2: Add CSS to Scene.css**

Append to the existing `src/components/Scene/Scene.css`:

```css
/* ── AnyaCenter ── */
.anya-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}

.anya-img {
  height: 40vh;
  display: block;
  mix-blend-mode: lighten;
  animation: float 4s ease-in-out infinite;
  user-select: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}
```

**Step 3: Commit**

```bash
git add src/components/Scene/AnyaCenter.tsx src/components/Scene/Scene.css
git commit -m "feat: add AnyaCenter with float animation"
```

---

### Task 4: FloatingObject component

**Files:**
- Create: `src/components/Scene/FloatingObject.tsx`

**Step 1: Create FloatingObject.tsx**

```tsx
// src/components/Scene/FloatingObject.tsx
import { forwardRef } from 'react'
import { asset } from '../../utils/asset'
import type { SceneObject } from '../../data/sceneObjects'

type Props = Pick<SceneObject, 'id' | 'src' | 'x' | 'y' | 'rotation' | 'scale' | 'cursor'>

export const FloatingObject = forwardRef<HTMLDivElement, Props>(
  ({ src, x, y, rotation, scale = 1, cursor }, ref) => (
    <div
      ref={ref}
      className="floating-object"
      data-cursor={cursor}
      style={{
        left:      `calc(50% + ${x}vw)`,
        top:       `calc(50% + ${y}vh)`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      <img
        src={asset(src!)}
        alt=""
        draggable={false}
        className="floating-object-img"
      />
    </div>
  )
)
FloatingObject.displayName = 'FloatingObject'
```

**Step 2: Add CSS to Scene.css**

```css
/* ── FloatingObject ── */
.floating-object {
  position: absolute;
  z-index: 20;
  cursor: none;
}

.floating-object-img {
  display: block;
  height: 18vh;
  mix-blend-mode: lighten;
  user-select: none;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.floating-object:hover .floating-object-img {
  transform: scale(1.07);
}
```

**Step 3: Commit**

```bash
git add src/components/Scene/FloatingObject.tsx src/components/Scene/Scene.css
git commit -m "feat: add FloatingObject component"
```

---

### Task 5: PhotoCard component

**Files:**
- Create: `src/components/Scene/PhotoCard.tsx`

**Step 1: Create PhotoCard.tsx**

```tsx
// src/components/Scene/PhotoCard.tsx
import { forwardRef } from 'react'
import { asset } from '../../utils/asset'
import type { SceneObject } from '../../data/sceneObjects'

type Props = Pick<SceneObject, 'src' | 'x' | 'y' | 'rotation' | 'scale' | 'cursor'>

export const PhotoCard = forwardRef<HTMLDivElement, Props>(
  ({ src, x, y, rotation, scale = 1, cursor }, ref) => (
    <div
      ref={ref}
      className="photo-card"
      data-cursor={cursor}
      style={{
        left:      `calc(50% + ${x}vw)`,
        top:       `calc(50% + ${y}vh)`,
        '--rotation': `${rotation}deg`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
      } as React.CSSProperties}
    >
      <img src={asset(src!)} alt="" draggable={false} className="photo-card-img" />
    </div>
  )
)
PhotoCard.displayName = 'PhotoCard'
```

**Step 2: Add CSS to Scene.css**

```css
/* ── PhotoCard ── */
.photo-card {
  position: absolute;
  z-index: 15;
  background: #f5f0e8;
  padding: 6px 6px 22px;
  box-shadow: 2px 4px 12px rgba(0,0,0,0.5);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: none;
}

.photo-card:hover {
  transform: translate(-50%, -50%) rotate(0deg) scale(1.08) !important;
  z-index: 50;
}

.photo-card-img {
  display: block;
  height: 12vh;
  object-fit: cover;
  aspect-ratio: 4/3;
  user-select: none;
}
```

**Step 3: Commit**

```bash
git add src/components/Scene/PhotoCard.tsx src/components/Scene/Scene.css
git commit -m "feat: add PhotoCard polaroid component"
```

---

### Task 6: Door component

**Files:**
- Create: `src/components/Door/Door.tsx`
- Create: `src/components/Door/Door.css`

**Step 1: Create Door.tsx**

```tsx
// src/components/Door/Door.tsx
import { forwardRef } from 'react'
import { asset } from '../../utils/asset'
import type { SceneObject } from '../../data/sceneObjects'
import './Door.css'

type Props = Pick<SceneObject, 'folder' | 'arch' | 'sash' | 'x' | 'y' | 'rotation' | 'label' | 'id'>
& { onClick?: (id: string) => void }

export const Door = forwardRef<HTMLDivElement, Props>(
  ({ folder, arch, sash, x, y, rotation, label, id, onClick }, ref) => {
    const archSrc = asset(`doors/${folder}/${arch}`)
    const sashSrc = asset(`doors/${folder}/${sash}`)

    return (
      <div
        ref={ref}
        className="door-wrapper"
        style={{
          left:      `calc(50% + ${x}vw)`,
          top:       `calc(50% + ${y}vh)`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        }}
        onClick={() => onClick?.(id!)}
      >
        {/* Sash — split into left and right halves */}
        <div className="door-sashes">
          <div className="door-half door-left">
            <img src={sashSrc} alt="" draggable={false} style={{ objectPosition: 'left' }} />
          </div>
          <div className="door-half door-right">
            <img src={sashSrc} alt="" draggable={false} style={{ objectPosition: 'right' }} />
          </div>
        </div>

        {/* Arch — static, always on top */}
        <img src={archSrc} alt="" draggable={false} className="door-arch" />

        {/* Label on hover */}
        {label && <span className="door-label">{label}</span>}
      </div>
    )
  }
)
Door.displayName = 'Door'
```

**Step 2: Create Door.css**

```css
/* src/components/Door/Door.css */
.door-wrapper {
  position: absolute;
  z-index: 25;
  cursor: none;
  width: 12vh;   /* doors scale with viewport height */
}

.door-wrapper:hover {
  filter: brightness(1.15) drop-shadow(0 0 20px rgba(201, 165, 123, 0.4));
}

.door-sashes {
  position: relative;
  display: flex;
  width: 100%;
}

.door-half {
  width: 50%;
  overflow: hidden;
  transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
}

.door-half img {
  display: block;
  width: 200%;
  height: auto;
  object-fit: cover;
}

/* Left half: show left portion */
.door-left img  { object-position: left; margin-left: 0; }
/* Right half: show right portion */
.door-right img { object-position: right; margin-left: -100%; }

/* Open state (Phase 3) */
.door-open .door-left  { transform: perspective(1200px) rotateY(-115deg); }
.door-open .door-right { transform: perspective(1200px) rotateY( 115deg); }

.door-arch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 2;
}

.door-label {
  position: absolute;
  bottom: -1.8em;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: var(--font-serif);
  font-size: 0.75rem;
  color: var(--warm-1);
  letter-spacing: 0.08em;
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.door-wrapper:hover .door-label {
  opacity: 1;
}
```

**Step 3: Commit**

```bash
git add src/components/Door/Door.tsx src/components/Door/Door.css
git commit -m "feat: add Door component (arch + sash split, hover glow)"
```

---

### Task 7: Wire Scene with rAF parallax loop

**Files:**
- Modify: `src/components/Scene/Scene.tsx`
- Modify: `src/components/Scene/Scene.css`

**Step 1: Rewrite Scene.tsx**

```tsx
// src/components/Scene/Scene.tsx
import { useEffect, useRef } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'
import { SCENE_OBJECTS } from '../../data/sceneObjects'
import { AnyaCenter } from './AnyaCenter'
import { FloatingObject } from './FloatingObject'
import { PhotoCard } from './PhotoCard'
import { Door } from '../Door/Door'
import './Scene.css'

const PARALLAX_STRENGTH = 15  // px per depth unit at full mouse deflection
const LERP_FACTOR = 0.09

export function Scene() {
  const mouse = useMousePosition()
  // Map from object id → DOM ref
  const objRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  const anyaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number

    const tick = () => {
      const m = mouse.current
      // Lerp toward target
      m.current.x += (m.target.x - m.current.x) * LERP_FACTOR
      m.current.y += (m.target.y - m.current.y) * LERP_FACTOR

      const mx = m.current.x
      const my = m.current.y

      // Apply to Anya (depth 0.01 — almost static)
      if (anyaRef.current) {
        const px = 0.01 * PARALLAX_STRENGTH * mx
        const py = 0.01 * PARALLAX_STRENGTH * my
        anyaRef.current.style.transform =
          `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`
      }

      // Apply to all scene objects
      SCENE_OBJECTS.forEach(obj => {
        const el = objRefs.current.get(obj.id)
        if (!el) return
        const px = obj.depth * PARALLAX_STRENGTH * mx
        const py = obj.depth * PARALLAX_STRENGTH * my
        const rot = obj.rotation ?? 0
        const sc  = obj.scale  ?? 1
        el.style.transform =
          `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotate(${rot}deg) scale(${sc})`
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [mouse])

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    objRefs.current.set(id, el)
  }

  const doors   = SCENE_OBJECTS.filter(o => o.type === 'door')
  const objects = SCENE_OBJECTS.filter(o => o.type === 'object')
  const photos  = SCENE_OBJECTS.filter(o => o.type === 'photo')

  return (
    <div className="scene">
      {/* Far layer — photos */}
      {photos.map(p => (
        <PhotoCard
          key={p.id}
          ref={setRef(p.id)}
          src={p.src}
          x={p.x} y={p.y}
          rotation={p.rotation}
          scale={p.scale}
          cursor={p.cursor}
        />
      ))}

      {/* Mid layer — doors */}
      {doors.map(d => (
        <Door
          key={d.id}
          ref={setRef(d.id)}
          id={d.id}
          folder={d.folder}
          arch={d.arch}
          sash={d.sash}
          x={d.x} y={d.y}
          rotation={d.rotation}
          label={d.label}
        />
      ))}

      {/* Near layer — floating objects */}
      {objects.map(o => (
        <FloatingObject
          key={o.id}
          ref={setRef(o.id)}
          id={o.id}
          src={o.src}
          x={o.x} y={o.y}
          rotation={o.rotation}
          scale={o.scale}
          cursor={o.cursor}
        />
      ))}

      {/* Center — Anya */}
      <AnyaCenter ref={anyaRef} />

      {/* Museum title */}
      <p className="scene-title">· · · Музей воспоминаний · · ·</p>
    </div>
  )
}
```

**Step 2: Add title CSS to Scene.css**

```css
/* ── Museum title ── */
.scene-title {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  pointer-events: none;
  white-space: nowrap;
  z-index: 5;
}
```

**Step 3: Run dev server and verify**

```bash
cd new_version && npm run dev
```

Expected: dark scene with Anya floating in center, 4 objects around her, 5 photos scattered, 5 doors positioned — all smoothly responding to mouse movement.

Check:
- [ ] Anya float animation plays
- [ ] Mouse parallax moves all objects (near faster, far slower)
- [ ] Door hover shows glow + room name label
- [ ] Photo hover straightens + scales up
- [ ] No console errors

**Step 4: Commit**

```bash
git add src/components/Scene/Scene.tsx src/components/Scene/Scene.css
git commit -m "feat: wire Scene with rAF parallax loop — Phase 2 complete"
```

---

## Done

Phase 2 complete. Scene is live with parallax. Phase 3 is door open animation + room content.
