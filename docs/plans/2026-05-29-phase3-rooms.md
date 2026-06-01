# Phase 3 — Doors & Rooms Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add door-open animation, room overlay system, and full content for all 5 rooms.

**Architecture:** Zustand `roomStore` tracks `activeRoom`. `Room.tsx` is a generic overlay rendered when `activeRoom === id`. Door clicks call `openRoom(id)`. MemoryToast uses its own `memoryStore` with seen-tracking.

**Tech Stack:** React 18, TypeScript, Zustand, GSAP (installed), canvas-confetti, html2canvas, CSS animations.

---

## Task 1: Install dependencies + roomStore + memories + memoryStore

**Files:**
- Modify: `src/store/roomStore.ts` (empty → fill)
- Modify: `src/data/memories.ts` (empty → fill)
- Create: `src/store/memoryStore.ts`

**Step 1: Install new packages**

```bash
cd /Users/rutli/Desktop/Programming/PetProjects/AnyaB/new_version
npm install canvas-confetti html2canvas
npm install --save-dev @types/canvas-confetti @types/html2canvas
```

**Step 2: Write `src/store/roomStore.ts`**

```ts
import { create } from 'zustand'

interface RoomStore {
  activeRoom: string | null
  openRoom: (id: string) => void
  closeRoom: () => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  activeRoom: null,
  openRoom:  (id) => set({ activeRoom: id }),
  closeRoom: ()   => set({ activeRoom: null }),
}))
```

**Step 3: Write `src/data/memories.ts`**

```ts
export interface Memory {
  id: string
  title: string
  text: string
}

export const MEMORIES: Memory[] = [
  {
    id: '002',
    title: 'Игра «Римская империя»',
    text: 'Многократно предпринимались попытки вовлечь объект в игру под названием «Римская империя». Шутка строилась на том, что Аня в римском стиле неизбежно превращалась в Ануса. Объект каждый раз сопротивлялся. Игра тем не менее продолжалась.',
  },
  {
    id: '003',
    title: 'Дело о пропавшей рыбе',
    text: 'По официальной версии, всю рыбу в холодильнике съела гостья. По неофициальной — и единственно правдивой — её съела сама хозяйка. Гостья узнала об этом слишком поздно. Родители так ничего и не выяснили.',
  },
  {
    id: '004',
    title: 'Операция «Лапша. 02:00»',
    text: 'Двое подростков. Кастрюля. Тёмный коридор. В момент пересечения с дверью родителей содержимое было утрачено. Уборка производилась в полной тишине и в положении сидя на полу. Смех заглушался подушкой. Операция была признана успешной.',
  },
  {
    id: '005',
    title: 'Дача. Лес. Дерево.',
    text: 'Объект А последовательно и настойчиво пыталась завлечь объект Б в лесной массив. Объект Б применял стратегию пассивного сопротивления: забирался на ближайшее дерево с мангой и оставался там до возвращения объекта А с добычей. Так прошло всё лето. И следующее. И, кажется, ещё одно.',
  },
  {
    id: '006',
    title: 'Маршрут «Буквоед — Пышечная №1»',
    text: 'Утверждённый годами маршрут культурного развития. Начинался у книжных полок, заканчивался у прилавка с пышками. Учебные заведения в этот маршрут не входили принципиально. Вещдок: сахарная пудра на учебниках.',
  },
  {
    id: '007',
    title: 'Феномен взаимной ревности',
    text: 'Зафиксированы многолетние случаи ревности к посторонним друзьям с обеих сторон. С возрастом интенсивность снизилась — стороны окончательно убедились, что заменить друг друга невозможно. Никакой другой друг не проходит верификацию.',
  },
  {
    id: '008',
    title: 'Состояние жилых помещений',
    text: 'В комнатах обоих субъектов на протяжении многих лет наблюдался идентичный уровень хаоса. Поверхности — заняты. Полы — частично. Родители — в отчаянии. Объекты — в гармонии.',
  },
  {
    id: '009',
    title: 'Шаурма. Одна. На двоих.',
    text: 'Финансовая стратегия и одновременно ритуал. Делилась строго пополам. Спорили только из-за того, кому достанется кусок с большим количеством мяса. Чаще доставался Ане. Это считается нормой.',
  },
]
```

**Step 4: Create `src/store/memoryStore.ts`**

```ts
import { create } from 'zustand'
import { MEMORIES } from '../data/memories'
import type { Memory } from '../data/memories'

interface MemoryStore {
  visible: boolean
  current: Memory | null
  seen: Set<string>
  show: () => void
  hide: () => void
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  visible: false,
  current: null,
  seen: new Set(),
  show: () => {
    const { seen } = get()
    let pool = MEMORIES.filter(m => !seen.has(m.id))
    if (pool.length === 0) {
      set({ seen: new Set() })
      pool = [...MEMORIES]
    }
    const pick = pool[Math.floor(Math.random() * pool.length)]
    set(s => ({
      visible: true,
      current: pick,
      seen: new Set([...s.seen, pick.id]),
    }))
  },
  hide: () => set({ visible: false }),
}))
```

**Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 6: Commit**

```bash
git add src/store/roomStore.ts src/store/memoryStore.ts src/data/memories.ts package.json package-lock.json
git commit -m "feat: add roomStore, memoryStore, memories data; install confetti + html2canvas"
```

---

## Task 2: Room wrapper component

**Files:**
- Create: `src/components/Room/Room.tsx`
- Create: `src/components/Room/Room.css`

**Step 1: Create `src/components/Room/Room.tsx`**

```tsx
import { useEffect } from 'react'
import { useRoomStore } from '../../store/roomStore'
import './Room.css'

interface Props {
  id: string
  title?: string
  children: React.ReactNode
}

export function Room({ id, title, children }: Props) {
  const { activeRoom, closeRoom } = useRoomStore()
  const isOpen = activeRoom === id

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRoom()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeRoom])

  if (!isOpen) return null

  return (
    <div className="room-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeRoom() }}>
      <div className="room-content">
        <button className="room-close" onClick={closeRoom} aria-label="Закрыть">✕</button>
        {title && <h2 className="room-title">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
```

**Step 2: Create `src/components/Room/Room.css`**

```css
.room-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(14, 11, 10, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: room-fade-in 0.2s ease forwards;
}

@keyframes room-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.room-content {
  position: relative;
  background: var(--bg-room);
  border: 1px solid var(--border);
  border-radius: 2px;
  width: min(90vw, 900px);
  max-height: 88vh;
  overflow-y: auto;
  padding: 3rem 3.5rem 3.5rem;
  animation: room-slide-up 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s both;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

@keyframes room-slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.room-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  cursor: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s;
}

.room-close:hover {
  color: var(--text-primary);
  border-color: var(--warm-1);
}

.room-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 400;
  color: var(--warm-1);
  letter-spacing: 0.15em;
  margin: 0 0 2rem;
  text-transform: uppercase;
}

/* Museum plaque style — used across rooms */
.museum-plaque {
  border: 1px solid var(--warm-1);
  padding: 1.25rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1.8;
  display: inline-block;
  margin-top: 1.5rem;
}

.museum-plaque .plaque-id {
  color: var(--warm-1);
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.65rem;
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/components/Room/Room.tsx src/components/Room/Room.css
git commit -m "feat: add Room overlay wrapper component"
```

---

## Task 3: MemoryToast + Navbar wiring

**Files:**
- Create: `src/components/MemoryToast/MemoryToast.tsx`
- Create: `src/components/MemoryToast/MemoryToast.css`
- Modify: `src/components/Navbar/Navbar.tsx`

**Step 1: Create `src/components/MemoryToast/MemoryToast.tsx`**

```tsx
import { useEffect } from 'react'
import { useMemoryStore } from '../../store/memoryStore'
import './MemoryToast.css'

export function MemoryToast() {
  const { visible, current, hide } = useMemoryStore()

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(hide, 8000)
    return () => clearTimeout(timer)
  }, [visible, current, hide])

  if (!visible || !current) return null

  return (
    <div className="memory-toast" onClick={hide}>
      <span className="memory-toast-id">ЭКСПОНАТ №{current.id}</span>
      <h3 className="memory-toast-title">{current.title}</h3>
      <p className="memory-toast-text">{current.text}</p>
      <span className="memory-toast-close">× закрыть</span>
    </div>
  )
}
```

**Step 2: Create `src/components/MemoryToast/MemoryToast.css`**

```css
.memory-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  background: var(--bg-card);
  border: 1px solid var(--warm-1);
  padding: 2rem 2.5rem;
  width: min(88vw, 520px);
  cursor: none;
  animation: toast-in 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) both;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
}

@keyframes toast-in {
  from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}

.memory-toast-id {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.25em;
  color: var(--warm-1);
  display: block;
  margin-bottom: 0.75rem;
}

.memory-toast-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.memory-toast-text {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 1.25rem;
}

.memory-toast-close {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}
```

**Step 3: Update `src/components/Navbar/Navbar.tsx`**

```tsx
import { useBoredomIndex } from '../../hooks/useBoredomIndex'
import { useMemoryStore } from '../../store/memoryStore'
import './Navbar.css'

export function Navbar() {
  const { index, status } = useBoredomIndex()
  const showMemory = useMemoryStore(s => s.show)

  const formattedIndex = index.toLocaleString('ru-RU')

  return (
    <nav className="navbar">
      <span className="navbar-title">🏛️ Музей воспоминаний</span>

      <button className="navbar-btn" onClick={showMemory}>
        ⛏ Раскопать воспоминание
      </button>

      <span className="navbar-boredom">
        ⏱ Индекс скучания:&nbsp;
        <strong>{formattedIndex}%</strong>
        &nbsp;—&nbsp;{status}
      </span>

      <button className="navbar-btn" disabled>
        🔇
      </button>
    </nav>
  )
}
```

**Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/components/MemoryToast/ src/components/Navbar/Navbar.tsx
git commit -m "feat: add MemoryToast and wire Navbar dig-memory button"
```

---

## Task 4: Door animation + Scene wiring

**Files:**
- Modify: `src/components/Door/Door.tsx`
- Modify: `src/components/Scene/Scene.tsx`

**Step 1: Update `src/components/Door/Door.tsx`**

Add `isOpen?: boolean` prop. Apply `.door-open` class to `.door-sashes` when open.

```tsx
import { forwardRef } from 'react'
import { asset } from '../../utils/asset'
import type { SceneObject } from '../../data/sceneObjects'
import './Door.css'

type Props = Pick<SceneObject, 'folder' | 'arch' | 'sash' | 'x' | 'y' | 'rotation' | 'label' | 'id'>
  & { onClick?: (id: string) => void; isOpen?: boolean }

export const Door = forwardRef<HTMLDivElement, Props>(
  ({ folder, arch, sash, x, y, rotation, label, id, onClick, isOpen }, ref) => {
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
        <div className={`door-sashes${isOpen ? ' door-open' : ''}`}>
          <div className="door-half door-left">
            <img src={sashSrc} alt="" draggable={false} style={{ objectPosition: 'left' }} />
          </div>
          <div className="door-half door-right">
            <img src={sashSrc} alt="" draggable={false} style={{ objectPosition: 'right' }} />
          </div>
        </div>

        <img src={archSrc} alt="" draggable={false} className="door-arch" />

        {label && <span className="door-label">{label}</span>}
      </div>
    )
  }
)
Door.displayName = 'Door'
```

**Step 2: Update `src/components/Scene/Scene.tsx`**

Import `useRoomStore`, pass `openRoom` as onClick, pass `isOpen` to each Door.

```tsx
import { useEffect, useRef } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'
import { SCENE_OBJECTS } from '../../data/sceneObjects'
import { useRoomStore } from '../../store/roomStore'
import { AnyaCenter } from './AnyaCenter'
import { FloatingObject } from './FloatingObject'
import { PhotoCard } from './PhotoCard'
import { Door } from '../Door/Door'
import './Scene.css'

const PARALLAX_STRENGTH = 15
const LERP_FACTOR = 0.09

export function Scene() {
  const mouse = useMousePosition()
  const objRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  const anyaRef = useRef<HTMLDivElement>(null)
  const { openRoom, activeRoom } = useRoomStore()

  useEffect(() => {
    let rafId: number

    const tick = () => {
      const m = mouse.current
      m.current.x += (m.target.x - m.current.x) * LERP_FACTOR
      m.current.y += (m.target.y - m.current.y) * LERP_FACTOR

      const mx = m.current.x
      const my = m.current.y

      if (anyaRef.current) {
        const px = 0.01 * PARALLAX_STRENGTH * mx
        const py = 0.01 * PARALLAX_STRENGTH * my
        anyaRef.current.style.transform =
          `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`
      }

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
          isOpen={activeRoom === d.id}
          onClick={openRoom}
        />
      ))}

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

      <AnyaCenter ref={anyaRef} />

      <p className="scene-title">· · · Музей воспоминаний · · ·</p>
    </div>
  )
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/components/Door/Door.tsx src/components/Scene/Scene.tsx
git commit -m "feat: wire door open animation and room store into Scene"
```

---

## Task 5: App.tsx — render all rooms + MemoryToast

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update `src/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Cursor } from './components/Cursor/Cursor'
import { Navbar } from './components/Navbar/Navbar'
import { Scene } from './components/Scene/Scene'
import { Room } from './components/Room/Room'
import { MemoryToast } from './components/MemoryToast/MemoryToast'
import { Kindergarten } from './components/rooms/Kindergarten/Kindergarten'
import { Truancy } from './components/rooms/Truancy/Truancy'
import { DreamGarden } from './components/rooms/DreamGarden/DreamGarden'
import { Gym } from './components/rooms/Gym/Gym'
import { Final } from './components/rooms/Final/Final'

export default function App() {
  return (
    <BrowserRouter basename="/Anya_Roman_Empire/">
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<Scene />} />
      </Routes>

      {/* Rooms — rendered outside Routes so they overlay the scene */}
      <Room id="kindergarten" title="Садик"><Kindergarten /></Room>
      <Room id="truancy"      title="Прогулы"><Truancy /></Room>
      <Room id="garden"       title="Сад мечты"><DreamGarden /></Room>
      <Room id="sport"        title="Спортзал"><Gym /></Room>
      <Room id="final"        title="Финал"><Final /></Room>

      <MemoryToast />
    </BrowserRouter>
  )
}
```

Note: Room components (Kindergarten etc.) don't exist yet — TypeScript will error until Task 6–10 create them. Implement this task LAST among tasks 5–10, or create empty placeholder components first.

**Recommended:** Create all 5 room stub files before writing App.tsx. Each stub:

```tsx
// e.g. src/components/rooms/Kindergarten/Kindergarten.tsx
export function Kindergarten() {
  return <div>Садик — soon</div>
}
```

Create stubs for all 5, then write App.tsx, then fill in room content in tasks 6–10.

**Step 2: Create room stub files**

Create these 5 stub pairs (tsx + css):
- `src/components/rooms/Kindergarten/Kindergarten.tsx` + `Kindergarten.css`
- `src/components/rooms/Truancy/Truancy.tsx` + `Truancy.css`
- `src/components/rooms/DreamGarden/DreamGarden.tsx` + `DreamGarden.css`
- `src/components/rooms/Gym/Gym.tsx` + `Gym.css`
- `src/components/rooms/Final/Final.tsx` + `Final.css`

Each stub tsx:
```tsx
import './ComponentName.css'
export function ComponentName() {
  return <div className="room-stub">скоро</div>
}
```

**Step 3: Write App.tsx** (as shown above)

**Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/App.tsx src/components/rooms/
git commit -m "feat: wire all rooms and MemoryToast into App"
```

---

## Task 6: Kindergarten room

**Files:**
- Modify: `src/components/rooms/Kindergarten/Kindergarten.tsx`
- Modify: `src/components/rooms/Kindergarten/Kindergarten.css`

**Step 1: Write `Kindergarten.tsx`**

```tsx
import { useMemoryStore } from '../../../store/memoryStore'
import { asset } from '../../../utils/asset'
import './Kindergarten.css'

const PHOTOS = [
  { src: 'anya_fun/child/little_anya_and_rock.jpg', rotation: -4 },
  { src: 'anya_fun/child/anya_with_family.jpg',     rotation:  3 },
  { src: 'anya_fun/child/anya_and_sveta.jpg',       rotation: -2 },
]

export function Kindergarten() {
  const showMemory = useMemoryStore(s => s.show)

  return (
    <div className="kindergarten">
      <div className="kinder-photos">
        {PHOTOS.map((p, i) => (
          <div
            key={i}
            className="kinder-photo"
            style={{ '--rot': `${p.rotation}deg` } as React.CSSProperties}
          >
            <img src={asset(p.src)} alt="" draggable={false} />
          </div>
        ))}
      </div>

      <div className="museum-plaque">
        <span className="plaque-id">ЭКСПОНАТ №001</span>
        Объект:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;дружба<br />
        Возраст:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;слишком много лет<br />
        Состояние:&nbsp;&nbsp;&nbsp;&nbsp;удивительно рабочее<br />
        Происхождение:&nbsp;средняя группа детского сада, ~1999
      </div>

      <button className="kinder-memory-btn" onClick={showMemory}>
        ⛏ Раскопать воспоминание
      </button>
    </div>
  )
}
```

**Step 2: Write `Kindergarten.css`**

```css
.kindergarten {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
}

.kinder-photos {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.kinder-photo {
  background: #f5f0e8;
  padding: 6px 6px 22px;
  box-shadow: 2px 4px 12px rgba(0,0,0,0.5);
  transform: rotate(var(--rot));
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: none;
}

.kinder-photo:hover {
  transform: rotate(0deg) scale(1.05);
}

.kinder-photo img {
  display: block;
  height: 20vh;
  width: auto;
  object-fit: cover;
}

.kinder-memory-btn {
  background: none;
  border: 1px solid var(--warm-1);
  color: var(--warm-1);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 0.6rem 1.2rem;
  cursor: none;
  transition: background 0.2s, color 0.2s;
}

.kinder-memory-btn:hover {
  background: var(--warm-1);
  color: var(--bg-deep);
}
```

**Step 3: Verify TypeScript + commit**

```bash
npx tsc --noEmit
git add src/components/rooms/Kindergarten/
git commit -m "feat: Kindergarten room with photos, plaque, memory button"
```

---

## Task 7: Truancy room

**Files:**
- Modify: `src/data/books.ts` (empty → fill)
- Modify: `src/components/rooms/Truancy/Truancy.tsx`
- Modify: `src/components/rooms/Truancy/Truancy.css`

**Step 1: Write `src/data/books.ts`**

```ts
export interface Book {
  id: string
  title: string
  annotation: string
}

export const BOOKS: Book[] = [
  { id: 'b1', title: 'Как пропустить всё, но выглядеть элегантно',  annotation: 'Глава 1: Буквоед как прикрытие. Классика жанра.' },
  { id: 'b2', title: 'Тёмная эстетика и почему она права',           annotation: 'Вывод: права. Дополнительных аргументов не требуется.' },
  { id: 'b3', title: 'Берсерк, но с растяжкой',                      annotation: 'Том 1 из бесконечной серии. Гатс одобряет шпагат.' },
  { id: 'b4', title: 'Реклама: выживание среди Excel',               annotation: 'Мемуары. Жанр: трагикомедия. Автор жив.' },
  { id: 'b5', title: 'Садик. Начало великой саги',                   annotation: 'Приквел, ~1999. Рекомендован к прочтению в обратном порядке.' },
  { id: 'b6', title: 'Пышки: запах победы',                          annotation: 'Кулинарная философия. Глава 1: маршрут «Буквоед → Пышечная».' },
  { id: 'b7', title: 'Чёрный — это новый чёрный',                    annotation: 'Хрестоматия, 29-е переиздание. Актуальность не снижается.' },
]
```

**Step 2: Write `Truancy.tsx`**

```tsx
import { useState } from 'react'
import { BOOKS } from '../../../data/books'
import { asset } from '../../../utils/asset'
import './Truancy.css'

export function Truancy() {
  const [openBook, setOpenBook] = useState<string | null>(null)

  const toggleBook = (id: string) => {
    setOpenBook(prev => prev === id ? null : id)
  }

  return (
    <div className="truancy">
      {/* Background shelves */}
      <div
        className="truancy-bg"
        style={{ backgroundImage: `url(${asset('bukvoed_photo/shelves_bl.png')})` }}
      />

      <div className="truancy-content">
        {/* We-reading photo */}
        <div className="truancy-photo-wrap">
          <div className="truancy-polaroid">
            <img src={asset('bukvoed_photo/we_reading.png')} alt="" draggable={false} />
            <span className="truancy-photo-caption">культурное развитие в процессе</span>
          </div>
        </div>

        {/* Collage area */}
        <div className="truancy-collage">
          {/* Receipt */}
          <div className="truancy-receipt" title="Официальная причина: культурное развитие. Неофициальная: пышки.">
            <div className="receipt-header">ПЫШЕЧНАЯ №1</div>
            <div className="receipt-divider">─────────────────</div>
            <div className="receipt-row"><span>Пышки    ×2</span><span>14₽</span></div>
            <div className="receipt-row"><span>Кофе     ×1</span><span>80₽</span></div>
            <div className="receipt-row"><span>Культура ×∞</span><span>∞</span></div>
            <div className="receipt-divider">─────────────────</div>
            <div className="receipt-footer">СПАСИБО ЗА ВИЗИТ</div>
          </div>

          {/* Stickers */}
          <div className="truancy-sticker" style={{ transform: 'rotate(-3deg)' }}>
            мы вообще-то пошли учиться
          </div>
          <div className="truancy-sticker" style={{ transform: 'rotate(2deg)' }}>
            местонахождение: неизвестно,<br />но пахнет пышками
          </div>
        </div>

        {/* Bookshelf */}
        <div className="truancy-shelf">
          {BOOKS.map(book => (
            <div
              key={book.id}
              className={`shelf-book${openBook === book.id ? ' shelf-book--open' : ''}`}
              onClick={() => toggleBook(book.id)}
            >
              <span className="shelf-book-spine">{book.title}</span>
              {openBook === book.id && (
                <div className="shelf-book-annotation">{book.annotation}</div>
              )}
            </div>
          ))}
        </div>

        {/* Museum plaque */}
        <div className="museum-plaque" style={{ marginTop: '1.5rem' }}>
          <span className="plaque-id">ЭКСПОНАТ №006</span>
          МАРШРУТ «БУКВОЕД — ПЫШЕЧНАЯ №1»<br />
          Утверждённый годами маршрут культурного развития.<br />
          Учебные заведения в маршрут не входили принципиально.<br />
          Вещдок: сахарная пудра на учебниках.
        </div>

        {/* Easter egg hint */}
        <span className="truancy-hint">b — секрет</span>
      </div>
    </div>
  )
}
```

**Step 3: Write `Truancy.css`**

```css
.truancy {
  position: relative;
  min-height: 60vh;
}

.truancy-bg {
  position: absolute;
  inset: -3rem -3.5rem;
  background-size: cover;
  background-position: center;
  opacity: 0.18;
  pointer-events: none;
}

.truancy-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Polaroid */
.truancy-photo-wrap { display: flex; }

.truancy-polaroid {
  background: #f5f0e8;
  padding: 6px 6px 22px;
  box-shadow: 2px 4px 12px rgba(0,0,0,0.5);
  transform: rotate(-2deg);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  cursor: none;
}

.truancy-polaroid:hover {
  transform: rotate(0deg) scale(1.03);
}

.truancy-polaroid:hover .truancy-photo-caption {
  opacity: 1;
}

.truancy-polaroid img {
  display: block;
  height: 18vh;
  object-fit: cover;
}

.truancy-photo-caption {
  position: absolute;
  bottom: 2px;
  left: 0; right: 0;
  text-align: center;
  font-family: var(--font-hand);
  font-size: 0.75rem;
  color: #555;
  opacity: 0;
  transition: opacity 0.25s;
}

/* Collage */
.truancy-collage {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

/* Receipt */
.truancy-receipt {
  background: #f9f5ec;
  color: #333;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 1rem 1.25rem;
  line-height: 1.9;
  box-shadow: 1px 2px 8px rgba(0,0,0,0.4);
  transform: rotate(1deg);
  cursor: none;
  min-width: 180px;
  transition: transform 0.3s ease;
}

.truancy-receipt:hover {
  transform: rotate(0deg) scale(1.04);
}

.receipt-header { text-align: center; font-weight: bold; margin-bottom: 0.25rem; }
.receipt-divider { color: #aaa; }
.receipt-row { display: flex; justify-content: space-between; }
.receipt-footer { text-align: center; margin-top: 0.25rem; font-size: 0.65rem; }

/* Stickers */
.truancy-sticker {
  background: #fffde7;
  color: #333;
  font-family: var(--font-hand);
  font-size: 0.85rem;
  padding: 0.75rem 1rem;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
  line-height: 1.5;
  max-width: 180px;
}

/* Bookshelf */
.truancy-shelf {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  padding: 0.5rem 0;
  border-bottom: 2px solid var(--border);
  flex-wrap: wrap;
}

.shelf-book {
  background: var(--bg-card);
  border: 1px solid var(--border);
  width: 2.2rem;
  height: 9rem;
  cursor: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), background 0.2s;
  flex-shrink: 0;
}

.shelf-book:hover {
  background: var(--bg-room);
  transform: translateY(-6px);
}

.shelf-book--open {
  transform: translateY(-16px);
  background: var(--bg-room);
  border-color: var(--warm-1);
}

.shelf-book-spine {
  font-family: var(--font-serif);
  font-size: 0.55rem;
  color: var(--text-secondary);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  overflow: hidden;
  max-height: 8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 4px 2px;
}

.shelf-book-annotation {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--warm-1);
  padding: 0.75rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  pointer-events: none;
  max-width: 260px;
  white-space: normal;
  line-height: 1.5;
}

/* Easter egg hint */
.truancy-hint {
  position: absolute;
  bottom: 0;
  right: 0;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
  opacity: 0.4;
  letter-spacing: 0.1em;
}
```

**Step 4: Verify + commit**

```bash
npx tsc --noEmit
git add src/data/books.ts src/components/rooms/Truancy/
git commit -m "feat: Truancy room with shelf, receipt, polaroid, stickers"
```

---

## Task 8: DreamGarden room

**Files:**
- Modify: `src/components/rooms/DreamGarden/DreamGarden.tsx`
- Modify: `src/components/rooms/DreamGarden/DreamGarden.css`

**Step 1: Write `DreamGarden.tsx`**

```tsx
import { useState, useRef } from 'react'
import gsap from 'gsap'
import './DreamGarden.css'

const POTS = [
  { id: 1, wish: 'спокойствие',    emoji: '🌿', label: 'лаванда' },
  { id: 2, wish: 'деньги',         emoji: '🌻', label: 'подсолнух' },
  { id: 3, wish: 'здоровье',       emoji: '🌱', label: 'молодой росток' },
  { id: 4, wish: 'меньше работы',  emoji: '🍃', label: 'плющ' },
  { id: 5, wish: 'вкусная еда',    emoji: '🌸', label: 'яблоня в цвету' },
  { id: 6, wish: 'силы',           emoji: '🌾', label: 'пшеница' },
  { id: 7, wish: 'садик мечты',    emoji: '🪴', label: 'домашнее деревце' },
]

export function DreamGarden() {
  const [grown, setGrown] = useState<Set<number>>(new Set())
  const plantRefs = useRef<Map<number, HTMLDivElement | null>>(new Map())

  const handlePotClick = (id: number) => {
    if (grown.has(id)) return
    const el = plantRefs.current.get(id)
    if (el) {
      gsap.fromTo(
        el,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.8, ease: 'power3.out',
          transformOrigin: 'bottom center' }
      )
    }
    setGrown(prev => new Set([...prev, id]))
  }

  const handleWater = () => {
    plantRefs.current.forEach(el => {
      if (!el) return
      gsap.to(el, {
        rotation: 8, duration: 0.2, ease: 'power1.out', yoyo: true,
        repeat: 3, onComplete: () => gsap.set(el, { rotation: 0 })
      })
    })
  }

  const allGrown = grown.size === POTS.length

  return (
    <div className="dream-garden">
      <div className="garden-pots">
        {POTS.map(pot => (
          <div
            key={pot.id}
            className={`garden-pot${grown.has(pot.id) ? ' garden-pot--grown' : ''}`}
            onClick={() => handlePotClick(pot.id)}
          >
            <div
              className="garden-plant"
              ref={el => plantRefs.current.set(pot.id, el)}
              style={{ opacity: grown.has(pot.id) ? 1 : 0, scaleY: grown.has(pot.id) ? 1 : 0 } as React.CSSProperties}
            >
              <span className="garden-plant-emoji">{pot.emoji}</span>
            </div>
            <div className="garden-pot-body">🪣</div>
            <span className="garden-wish">{pot.wish}</span>
          </div>
        ))}
      </div>

      {allGrown && (
        <p className="garden-final">
          Пусть всё, что ты растишь — растения, планы, мышцы, мечты и внутренний дзен —
          растёт красиво, спокойно и без Excel-таблиц.
        </p>
      )}

      <div className="garden-actions">
        <button className="garden-water-btn" onClick={handleWater}>
          🚿 Полить всё
        </button>
      </div>

      <div className="museum-plaque" style={{ marginTop: '1.5rem' }}>
        <span className="plaque-id">ЭКСПОНАТ №004</span>
        Теплица личная<br />
        Статус:&nbsp;&nbsp;в процессе<br />
        Урожай:&nbsp;ожидается
      </div>
    </div>
  )
}
```

**Step 2: Write `DreamGarden.css`**

```css
.dream-garden {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.garden-pots {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.garden-pot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  cursor: none;
  min-width: 72px;
}

.garden-pot--grown { cursor: default; }

.garden-plant {
  font-size: 2.2rem;
  line-height: 1;
  transform-origin: bottom center;
}

.garden-plant-emoji { display: block; }

.garden-pot-body {
  font-size: 2rem;
  line-height: 1;
}

.garden-wish {
  font-family: var(--font-hand);
  font-size: 0.78rem;
  color: var(--text-secondary);
  text-align: center;
  max-width: 80px;
}

.garden-final {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.8;
  border-left: 2px solid var(--plant);
  padding-left: 1.25rem;
  animation: fade-up 0.6s ease both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.garden-actions { display: flex; gap: 1rem; }

.garden-water-btn {
  background: none;
  border: 1px solid var(--plant);
  color: var(--plant);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 0.5rem 1rem;
  cursor: none;
  transition: background 0.2s, color 0.2s;
}

.garden-water-btn:hover {
  background: var(--plant);
  color: var(--bg-deep);
}
```

**Step 3: Verify + commit**

```bash
npx tsc --noEmit
git add src/components/rooms/DreamGarden/
git commit -m "feat: DreamGarden room with grow animation and watering button"
```

---

## Task 9: Gym room

**Files:**
- Modify: `src/components/rooms/Gym/Gym.tsx`
- Modify: `src/components/rooms/Gym/Gym.css`

**Step 1: Write `Gym.tsx`**

```tsx
import { useState, useRef } from 'react'
import gsap from 'gsap'
import { asset } from '../../../utils/asset'
import './Gym.css'

const STATS = [
  { key: 'STR', label: 'STR', value: 80, note: 'растёт' },
  { key: 'DEX', label: 'DEX', value: 100, note: 'шпагат ✓' },
  { key: 'INT', label: 'INT', value: 90, note: 'буквоед' },
  { key: 'CHA', label: 'CHA', value: 100, note: 'тёмная элегантность' },
  { key: 'LUK', label: 'LUK', value: 80, note: 'пышки находятся всегда' },
  { key: 'RES', label: 'RES', value: 35, note: 'низкая, но держится' },
]

const WEIGHT_LABELS = [
  { max: 50,   label: 'норма' },
  { max: 200,  label: 'впечатляет' },
  { max: 500,  label: 'героически' },
  { max: 9999, label: 'Аня всё равно справилась' },
]

const POSTERS = [
  'Растяжка — это форма медитации с болью.',
  'Сегодня шпагат, завтра — мир.',
  'DEX: MAX',
]

export function Gym() {
  const [weight, setWeight] = useState(0)
  const [shpagat, setShpagat] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const shpagatRef = useRef<HTMLImageElement>(null)

  const weightLabel = WEIGHT_LABELS.find(w => weight <= w.max)?.label ?? 'норма'

  const handleShpagat = () => {
    setShpagat(true)
    if (shpagatRef.current) {
      gsap.fromTo(
        shpagatRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      )
    }
  }

  return (
    <div className="gym">
      {/* Posters */}
      <div className="gym-posters">
        {POSTERS.map((p, i) => (
          <div key={i} className="gym-poster">{p}</div>
        ))}
      </div>

      {/* RPG card */}
      <div className="rpg-card">
        <div className="rpg-header">АНЯ  •  LVL ∞</div>
        <div className="rpg-divider">═══════════════════════════════</div>
        {STATS.map(s => (
          <div key={s.key} className="rpg-stat">
            <span className="rpg-stat-key">{s.label}</span>
            <div className="rpg-bar-track">
              <div className="rpg-bar-fill" style={{ width: `${s.value}%` }} />
            </div>
            <span className="rpg-stat-note">{s.note}</span>
          </div>
        ))}
        <div className="rpg-divider">═══════════════════════════════</div>
        <div className="rpg-footer">
          <span>Класс: &nbsp;&nbsp;Тёмный Садовник</span><br />
          <span>Стихия: Растяжка</span>
        </div>
      </div>

      {/* Weight slider */}
      <div className="gym-weight">
        <label className="gym-weight-label">
          Добавить веса: <strong>{weight} кг</strong>
          &nbsp;—&nbsp;<em>{weightLabel}</em>
        </label>
        <input
          type="range" min={0} max={9999} value={weight}
          onChange={e => setWeight(Number(e.target.value))}
          className="gym-slider"
        />
      </div>

      {/* Buttons */}
      <div className="gym-actions">
        <button className="gym-btn gym-btn--primary" onClick={handleShpagat}>
          Сесть на шпагат
        </button>
        <button className="gym-btn gym-btn--danger" onClick={() => setSkipped(true)}>
          Пропустить тренировку
        </button>
      </div>

      {skipped && (
        <p className="gym-skip-msg">
          ✕&ensp;Невозможно. Она теперь тягает веса.
        </p>
      )}

      {shpagat && (
        <img
          ref={shpagatRef}
          src={asset('шпагат.png')}
          alt="шпагат"
          className="gym-shpagat"
          draggable={false}
        />
      )}
    </div>
  )
}
```

**Step 2: Write `Gym.css`**

```css
.gym {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Posters */
.gym-posters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.gym-poster {
  border: 1px solid var(--border);
  padding: 0.5rem 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

/* RPG card */
.rpg-card {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.7;
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 1.25rem 1.5rem;
  max-width: 420px;
}

.rpg-header {
  text-align: center;
  color: var(--warm-1);
  letter-spacing: 0.2em;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.rpg-divider {
  color: var(--border);
  margin: 0.25rem 0;
  font-size: 0.65rem;
}

.rpg-stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rpg-stat-key {
  width: 2.5rem;
  color: var(--warm-2);
  flex-shrink: 0;
}

.rpg-bar-track {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.rpg-bar-fill {
  height: 100%;
  background: var(--warm-1);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.rpg-stat-note {
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
  min-width: 120px;
}

.rpg-footer {
  margin-top: 0.25rem;
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

/* Weight */
.gym-weight {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gym-weight-label {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.gym-slider {
  width: 100%;
  max-width: 360px;
  accent-color: var(--warm-1);
  cursor: none;
}

/* Actions */
.gym-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.gym-btn {
  background: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  padding: 0.55rem 1.1rem;
  cursor: none;
  transition: background 0.2s, color 0.2s;
}

.gym-btn--primary {
  border: 1px solid var(--warm-1);
  color: var(--warm-1);
}
.gym-btn--primary:hover { background: var(--warm-1); color: var(--bg-deep); }

.gym-btn--danger {
  border: 1px solid #666;
  color: var(--text-muted);
}
.gym-btn--danger:hover { border-color: #c0392b; color: #c0392b; }

.gym-skip-msg {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: #c0392b;
  margin: 0;
}

.gym-shpagat {
  height: 20vh;
  mix-blend-mode: lighten;
  display: block;
}
```

**Step 3: Verify + commit**

```bash
npx tsc --noEmit
git add src/components/rooms/Gym/
git commit -m "feat: Gym room with RPG stats, weight slider, shpagat animation"
```

---

## Task 10: Final room

**Files:**
- Modify: `src/components/rooms/Final/Final.tsx`
- Modify: `src/components/rooms/Final/Final.css`

**Step 1: Write `Final.tsx`**

```tsx
import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas'
import './Final.css'

export function Final() {
  const [giftOpened, setGiftOpened] = useState(false)
  const [finalVisible, setFinalVisible] = useState(false)
  const finalLineRef = useRef<HTMLParagraphElement>(null)
  const certRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver for final line
  useEffect(() => {
    const el = finalLineRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFinalVisible(true) },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleGift = () => {
    setGiftOpened(true)
    confetti({ particleCount: 200, spread: 160, origin: { y: 0.6 } })
  }

  const handleSaveCert = async () => {
    if (!certRef.current) return
    const canvas = await html2canvas(certRef.current, { backgroundColor: '#161210' })
    const link = document.createElement('a')
    link.download = 'anya-certificate.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="final">
      {/* Block 1 — Museum announcement */}
      <div className="final-announcement">
        <p className="final-mono">ОБЪЯВЛЕНИЕ АДМИНИСТРАЦИИ МУЗЕЯ</p>
        <p className="final-mono final-mono--body">
          Сегодня главному экспонату исполняется 29 лет.<br />
          За этот срок объект:<br />
          освоил шпагат, выжил в рекламе, прочитал слишком много манги,<br />
          начал тягать веса, мечтает о собственном саде с растениями —<br />
          и при всём этом остаётся невозможно элегантным.<br />
          <br />
          Музей подтверждает: экспонат функционирует исправно,<br />
          обладает повышенной ценностью и переводу в другие коллекции<br />
          не подлежит.
        </p>
      </div>

      <div className="final-divider" />

      {/* Block 2 — Personal letter */}
      <div className="final-letter">
        <p className="final-letter-text">
          Ань.
        </p>
        <p className="final-letter-text">
          Мы знакомы столько, сколько я себя помню. Я правда не могу
          вспомнить себя без тебя — ты есть в каждом детском воспоминании,
          в каждом подростковом, в каждом сейчас. И при этом совсем не
          чувствуется, что прошло столько лет — с тобой время идёт как-то иначе.
        </p>
        <p className="final-letter-text">
          Спасибо, что ты выросла именно такой. Сильной, странной,
          утончённой — такой, какой никто кроме тебя быть не умеет. В тебе
          есть что-то благородное и тёплое одновременно, и это редкое
          сочетание. Спасибо, что разрешаешь мне быть рядом всё это время
          и видеть, как ты становишься собой — всё больше и больше с каждым годом.
        </p>
        <p className="final-letter-text">
          Пусть этот год будет к тебе добрым. Пусть растёт всё, что ты
          растишь — твой будущий сад, мышцы, мечты, спокойствие. Пусть
          будет меньше Excel и больше леса (я опять буду на дереве, ты знаешь).
        </p>
        <p className="final-letter-text">
          И помни: сколько бы ни появлялось у нас новых друзей — главная
          всё равно ты. Это не обсуждается. Это уже как факт из учебника.
        </p>
      </div>

      {/* Final line — appears on scroll */}
      <p
        ref={finalLineRef}
        className={`final-line${finalVisible ? ' final-line--visible' : ''}`}
      >
        Я люблю тебя.<br />
        С днём рождения.
      </p>

      <div className="final-divider" />

      {/* Certificate */}
      <div ref={certRef} className="final-cert">
        <div className="cert-inner">
          <div className="cert-top">─────────────────────────────────────</div>
          <div className="cert-title">С Е Р Т И Ф И К А Т</div>
          <div className="cert-top">─────────────────────────────────────</div>
          <p className="cert-body">Настоящим подтверждается, что Аня:</p>
          <ul className="cert-list">
            <li>пережила детский сад</li>
            <li>достигла уровня «тягает веса»</li>
            <li>имеет право на пышки</li>
            <li>обладает тёмной элегантностью</li>
            <li>является официально любимой подругой</li>
          </ul>
          <div className="cert-footer">
            <span>Дата выдачи:&nbsp;&nbsp;02 июня 2026</span><br />
            <span>Подпись:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;человек, который</span><br />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;знает слишком много</span>
          </div>
          <div className="cert-seal">[ печать ❤ ]</div>
          <div className="cert-top">─────────────────────────────────────</div>
        </div>
      </div>

      <div className="final-actions">
        <button className="final-btn" onClick={handleSaveCert}>
          Сохранить сертификат
        </button>

        {!giftOpened ? (
          <button className="final-btn final-btn--gift" onClick={handleGift}>
            Открыть подарок 🎁
          </button>
        ) : (
          <div className="final-gift-reveal">
            <p className="final-gift-text">
              🎁 Настоящий подарок — это ты сама. И этот сайт.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Write `Final.css`**

```css
.final {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 2rem;
}

/* Announcement */
.final-announcement {
  border: 1px solid var(--border);
  padding: 1.5rem 2rem;
}

.final-mono {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--warm-1);
  letter-spacing: 0.18em;
  margin: 0 0 0.75rem;
}

.final-mono--body {
  color: var(--text-secondary);
  line-height: 1.9;
  letter-spacing: 0.04em;
}

/* Divider */
.final-divider {
  border: none;
  border-top: 1px solid var(--border);
}

/* Letter */
.final-letter { display: flex; flex-direction: column; gap: 1.25rem; }

.final-letter-text {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  line-height: 1.9;
  color: var(--text-primary);
  margin: 0;
}

/* Final line */
.final-line {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-style: italic;
  color: var(--warm-2);
  text-align: center;
  line-height: 1.6;
  margin: 1rem 0;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.final-line--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Certificate */
.final-cert {
  background: var(--bg-card);
  border: 1px solid var(--warm-1);
  padding: 2rem;
  max-width: 480px;
}

.cert-inner {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1.8;
  text-align: center;
}

.cert-top { color: var(--border); margin: 0.5rem 0; }

.cert-title {
  color: var(--warm-1);
  letter-spacing: 0.4em;
  font-size: 0.85rem;
  margin: 0.5rem 0;
}

.cert-body {
  margin: 1rem 0 0.5rem;
  color: var(--text-primary);
}

.cert-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  text-align: left;
  display: inline-block;
}

.cert-list li::before { content: '• '; color: var(--warm-1); }

.cert-footer { text-align: left; margin: 0.75rem 0; }

.cert-seal {
  color: var(--warm-1);
  margin: 0.75rem 0 0.5rem;
  font-size: 0.85rem;
}

/* Actions */
.final-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.final-btn {
  background: none;
  border: 1px solid var(--warm-1);
  color: var(--warm-1);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 0.6rem 1.2rem;
  cursor: none;
  transition: background 0.2s, color 0.2s;
}

.final-btn:hover { background: var(--warm-1); color: var(--bg-deep); }

.final-btn--gift {
  border-color: var(--warm-3);
  color: var(--warm-3);
}
.final-btn--gift:hover { background: var(--warm-3); color: var(--bg-deep); }

.final-gift-reveal {
  animation: fade-up 0.5s ease both;
}

.final-gift-text {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--warm-2);
  margin: 0;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Step 3: Verify + commit**

```bash
npx tsc --noEmit
git add src/components/rooms/Final/
git commit -m "feat: Final room with letter, certificate, confetti, gift reveal"
```

---

## Done

Phase 3 complete. All 5 rooms open from doors, MemoryToast works from navbar, door animation plays on click.
