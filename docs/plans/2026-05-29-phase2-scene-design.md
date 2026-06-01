# Phase 2 — Scene Design

## Overview

Populate the Scene with Anya, floating objects, polaroid photos, and 5 doors.
Add mouse-driven parallax with a single rAF loop (no React rerenders).

## Parallax Architecture

Inspired by telhaclarke.com.au (WorksGrid implementation):

- Single `mousemove` listener stores raw position in a ref (not state)
- Mouse mapped to `[-1, 1]` range
- rAF loop lerps `current` toward `target` with factor `0.09`
- Each object's DOM node gets `style.transform` written directly via ref
- Formula: `translate(depth * 15 * mx, depth * 15 * my) rotate(Xdeg)`
- Zero React rerenders during mouse movement

Depth values and resulting max displacement:
| Layer | Objects | depth | max px |
|-------|---------|-------|--------|
| Far background | Small faded photos | 1–1.5 | ±15–22px |
| Mid | Doors, larger photos | 2–2.5 | ±30–37px |
| Near | Manga, donut, cat, шпагат | 3–3.5 | ±45–52px |
| Center | Anya | 0.01 | ~0px |

## Components

### `useMousePosition.ts`
Hook that attaches a `mousemove` listener and stores `{x, y}` mapped to `[-1, 1]`
in a ref. Returns the ref — no state, no rerenders.

### `sceneObjects.ts`
Data array of 15 objects (5 doors + 4 floating + 5 photos + Anya center) with
`id`, `type`, `x`, `y`, `depth`, `rotation`, `scale`, `src/folder`, `cursor`.
Coordinates in `vw/vh` from screen center (0,0).

### `AnyaCenter.tsx`
- `anya_full/anya_full.png`, `mix-blend-mode: lighten`
- `position: absolute`, centered, height `40vh`
- CSS `@keyframes float`: `translateY(0 → -12px)`, 4s ease-in-out infinite
- depth `0.01` — essentially static

### `FloatingObject.tsx`
- Props: `src`, `x`, `y`, `depth`, `rotation`, `scale`, `cursorType?`
- `mix-blend-mode: lighten` (black-background assets)
- Exposes a `ref` that Scene's rAF loop writes transforms into
- Hover: `scale(1.05)` via CSS transition

### `PhotoCard.tsx`
- Polaroid style: `border: 8px solid #f5f0e8`, `border-bottom: 28px`
- CSS `--rotation` var for initial tilt
- Hover: `rotate(0deg) scale(1.05)`, `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Exposes ref for parallax

### `Door.tsx`
- Two layers: arch image (static, `pointer-events: none`) + sash split into left/right halves
- Sash split via `object-position: left` / `object-position: right` on a `width: 200%` img
- Hover: `filter: brightness(1.15) drop-shadow(0 0 20px rgba(201,165,123,0.4))`
- Label appears below on hover (room name)
- No open animation yet (Phase 3)
- `data-cursor` attribute for cursor state changes

### `Scene.tsx`
- Renders `AnyaCenter`, all `FloatingObject`s, `PhotoCard`s, `Door`s
- Starts single rAF loop on mount
- Collects refs array for all parallax objects
- Each tick: lerp mouse, apply transforms via refs
- Museum title at bottom center

## CSS Notes

- All black-background assets: `mix-blend-mode: lighten`
- Scene: `position: fixed; inset: 0; overflow: hidden`
- Objects positioned with `position: absolute; left: calc(50% + Xvw); top: calc(50% + Yvh)`
- No new CSS variables needed beyond what Phase 1 defined
