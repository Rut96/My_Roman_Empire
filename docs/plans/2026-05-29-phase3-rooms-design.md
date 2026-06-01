# Phase 3 — Doors & Rooms Design

## Overview

Full-content implementation of all 5 rooms: door open animation, room overlay system,
and complete interactive content per spec in `info/ROOMS.md`.

## Architecture

### roomStore
Zustand store: `openRoom(id: string)`, `closeRoom()`, `activeRoom: string | null`.

### Room.tsx
Generic full-screen overlay wrapper. Props: `id`, `children`.
- Renders only when `activeRoom === id`
- Fixed inset-0, z-index 100, background `var(--bg-room)`
- ✕ close button top-right
- Esc key closes
- Enter animation: overlay fade-in 200ms, content slide-up+fade 300ms (delay 100ms)
- Exit: reverse
- Scrollable content area for long rooms (Final)

### Door animation
`Door.tsx` gets `isOpen: boolean` prop from Scene.
Scene reads `activeRoom` from roomStore, passes `isOpen={activeRoom === door.id}`.
On click, Scene calls `openRoom(id)`. CSS `.door-open` already stubbed from Phase 2.

## Data

### memories.ts
8 memories (id 002–009) per ROOMS.md spec.

### MemoryToast.tsx
Card with brass border: "ЭКСПОНАТ №XXX", title, text.
Triggered by Navbar button + Sadik room button.
Auto-closes 8s or on click. Tracks `seen` Set in ref to avoid repeats.

### Navbar update
Enable "⛏ Раскопать воспоминание" button — calls MemoryToast.

## Rooms

### Садик
- 3 polaroids: `little_anya_and_rock.jpg`, `anya_with_family.jpg`, `anya_and_sveta.jpg`
- Museum plaque: Экспонат №001 (дружба, средняя группа ~1999)
- "⛏ Раскопать воспоминание" button

### Прогулы
- Background: `bukvoed_photo/shelves_bl.png` + dark overlay
- `we_reading.png` as polaroid, hover shows caption "культурное развитие в процессе"
- SVG receipt (Пышечная №1), hover tooltip
- 2 sticky notes (Caveat font)
- 7 clickable books (slide out → annotation panel), hint "b — секрет" in corner
- Экспонат №006

### Сад мечты
- 7 clickable pots, each with emoji plant
- Click → GSAP grow animation (scaleY 0→1, power3.out, 0.8s, transform-origin bottom)
- After all 7 → completion message fades in
- 🚿 button → all plants wobble (elastic.out)
- Экспонат №004

### Спортзал
- RPG stats card (JetBrains Mono, 6 stats with CSS progress bars)
- Weight slider 0–9999 kg (4 status labels)
- "Сесть на шпагат" → шпагат.png appears (scale 0→1, back.out(1.7))
- "Пропустить тренировку" → red ✕ + text
- 3 motivational posters on walls

### Финал
- Block 1: Museum announcement (mono font, brass border)
- Block 2: Personal letter (Cormorant Garamond, generous line-height)
- Final line "Я люблю тебя. С днём рождения." — fade+slide-up via IntersectionObserver
- SVG certificate + "Сохранить сертификат" → html2canvas → PNG download
- "Открыть подарок 🎁" → canvas-confetti + gift text block appears

## New Dependencies
- `canvas-confetti` + `@types/canvas-confetti`
- `html2canvas`

## New Files
```
src/store/roomStore.ts
src/data/memories.ts (fill from empty)
src/components/Room/Room.tsx + Room.css
src/components/MemoryToast/MemoryToast.tsx + MemoryToast.css
src/components/rooms/Kindergarten/Kindergarten.tsx + .css
src/components/rooms/Truancy/Truancy.tsx + .css
src/components/rooms/DreamGarden/DreamGarden.tsx + .css
src/components/rooms/Gym/Gym.tsx + .css
src/components/rooms/Final/Final.tsx + .css
```

## Modified Files
```
src/components/Door/Door.tsx      — add isOpen prop, apply .door-open class
src/components/Scene/Scene.tsx    — wire openRoom on door click, pass isOpen
src/components/Navbar/Navbar.tsx  — enable memory button
src/App.tsx                       — render rooms + MemoryToast
```
