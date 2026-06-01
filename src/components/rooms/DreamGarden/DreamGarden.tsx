import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { asset } from '../../../utils/asset'
import './DreamGarden.css'

const POTS = [
  { id: 1, wish: 'спокойствие', plant: 'lavender', special: false },
  { id: 2, wish: 'деньги', plant: 'money_tree', special: false },
  { id: 3, wish: 'здоровье', plant: 'aloe', special: false },
  { id: 4, wish: 'меньше работы', plant: 'cactus', special: false },
  { id: 5, wish: 'вкусная еда', plant: 'basil', special: false },
  { id: 6, wish: 'силы', plant: 'bamboo', special: false },
  { id: 7, wish: 'любовь', plant: 'rose', special: false },
  { id: 8, wish: 'ещё больше книжек', plant: 'ivy', special: false },
  { id: 9, wish: 'садик мечты', plant: 'tree', special: true },
] as const

// Позиции горшков в % от .dg-tree-zone
const POT_POS = [
  { left: 50.0, bottom: 84.0 },
  { left: 26.0, bottom: 73.0 },
  { left: 73.0, bottom: 73.0 },
  { left: 22.0, bottom: 51.0 },
  { left: 50.0, bottom: 55.0 },
  { left: 78.5, bottom: 51.0 },
  { left: 23.5, bottom: 30.0 },
  { left: 77.0, bottom: 30.0 },
  { left: 50.0, bottom: 16.0 },
]

const FIREFLY_COUNT = 8

export function DreamGarden() {
  // Набор уже политых горшков (произвольный порядок)
  const [wateredPots, setWateredPots] = useState<Set<number>>(new Set())
  // Индекс последнего политого — триггер для GSAP
  const [justWatered, setJustWatered] = useState<number | null>(null)
  // Лейка поднята (следует за курсором)
  const [isPickedUp, setIsPickedUp] = useState(false)
  // Горшок под курсором (когда лейка поднята)
  const [hoveredPot, setHoveredPot] = useState<number | null>(null)

  const allGrown = wateredPots.size === POTS.length

  const plantRefs = useRef<(HTMLImageElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const treeRef = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const petalRefs = useRef<(SVGCircleElement | null)[]>([])
  const wateringCanRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const fireflyRefs = useRef<(HTMLDivElement | null)[]>([])
  // Начальная позиция лейки (центр) для расчёта смещения
  const canOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // --- Анимация роста: срабатывает при изменении justWatered ---
  useGSAP(() => {
    if (justWatered === null) return

    const potDef = POTS[justWatered]
    const plant = plantRefs.current[justWatered]
    if (!plant) return

    const growDuration = potDef.special ? 1.4 : 0.9
    gsap.fromTo(
      plant,
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1, opacity: 1, duration: growDuration,
        ease: 'power3.out', transformOrigin: 'bottom center',
        onComplete: () => {
          gsap.to(plant, {
            rotation: -2, duration: 0.2, ease: 'elastic.out(1, 0.5)',
            yoyo: true, repeat: 1,
            onComplete: () => gsap.set(plant, { rotation: 0 }),
          })
          if (potDef.special) {
            petalRefs.current.forEach((petal, i) => {
              if (!petal) return
              const startX = 38 + Math.random() * 24
              gsap.set(petal, { attr: { cx: startX, cy: 18 }, opacity: 0 } as gsap.TweenVars)
              gsap.to(petal, {
                attr: { cx: startX + (Math.random() - 0.5) * 40, cy: 115 },
                opacity: 0.85, rotation: 360, transformOrigin: 'center',
                duration: 2 + Math.random() * 1.5, delay: i * 0.35 + 0.2,
                ease: 'power1.inOut', repeat: -1, repeatDelay: Math.random() * 0.8,
                onRepeat() {
                  gsap.set(petal, { attr: { cx: 38 + Math.random() * 24, cy: 18 }, opacity: 0 } as gsap.TweenVars)
                },
              } as gsap.TweenVars)
            })
            if (haloRef.current) {
              gsap.fromTo(haloRef.current, { opacity: 0, scale: 0 }, {
                opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)',
              })
            }
          }
        },
      }
    )
  }, { dependencies: [justWatered] })

  // --- Финальное состояние ---
  useGSAP(() => {
    if (!allGrown) return
    const container = containerRef.current
    if (!container) return

    const tl = gsap.timeline({ delay: 0.5 })

    if (glowRef.current) {
      tl.to(glowRef.current, { opacity: 1, duration: 1.8, ease: 'power2.out' }, 0)
    }

    fireflyRefs.current.forEach((fly, i) => {
      if (!fly) return
      const W = container.offsetWidth
      const H = container.offsetHeight
      gsap.set(fly, {
        x: Math.random() * W * 0.7 + W * 0.15,
        y: Math.random() * H * 0.5 + H * 0.1,
      })
      tl.to(fly, { opacity: 0.6, duration: 0.4 }, 0.2 + i * 0.2)
      const float = () => {
        if (!fly || !containerRef.current) return
        const W2 = containerRef.current.offsetWidth
        const H2 = containerRef.current.offsetHeight
        gsap.to(fly, {
          x: Math.random() * W2 * 0.7 + W2 * 0.15,
          y: Math.random() * H2 * 0.5 + H2 * 0.1,
          duration: 3 + Math.random() * 4, ease: 'sine.inOut', onComplete: float,
        })
      }
      tl.call(float, undefined, 1.5 + i * 0.15)
    })

    if (bannerRef.current) {
      gsap.set(bannerRef.current, { xPercent: -50, y: 40 })
      tl.to(bannerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8)
    }

    // Лейка улетает вниз
    if (wateringCanRef.current) {
      tl.to(wateringCanRef.current, { y: 120, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.3)
    }
    document.body.removeAttribute('data-cursor-hidden')
  }, { dependencies: [allGrown] })

  // --- Лейка следует за курсором когда поднята ---
  useEffect(() => {
    if (!isPickedUp) return
    const container = containerRef.current
    const can = wateringCanRef.current
    if (!container || !can) return

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      gsap.to(can, {
        x: cx - canOriginRef.current.x,
        y: cy - canOriginRef.current.y,
        duration: 0.08,
        ease: 'none',
        overwrite: 'auto',
      })
    }

    container.addEventListener('mousemove', handleMove)
    return () => container.removeEventListener('mousemove', handleMove)
  }, [isPickedUp])

  // --- Взять лейку ---
  const handleCanPickUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (allGrown) return

    const can = wateringCanRef.current
    const container = containerRef.current
    if (!can || !container) return

    const canRect = can.getBoundingClientRect()
    const conRect = container.getBoundingClientRect()
    // Запоминаем центр лейки в координатах контейнера
    canOriginRef.current = {
      x: canRect.left - conRect.left + canRect.width / 2,
      y: canRect.top - conRect.top + canRect.height / 2,
    }

    setIsPickedUp(true)
    document.body.setAttribute('data-cursor-hidden', '')
    gsap.to(can, { scale: 1.2, duration: 0.2, ease: 'back.out(1.7)' })
  }

  // --- Положить лейку назад (клик по фону) ---
  const handleBackgroundClick = () => {
    if (!isPickedUp) return
    setIsPickedUp(false)
    setHoveredPot(null)
    document.body.removeAttribute('data-cursor-hidden')
    gsap.to(wateringCanRef.current, {
      x: 0, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)',
    })
  }

  // --- Полить горшок ---
  const handlePotClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPickedUp) return

    const plant = plantRefs.current[idx]

    if (wateredPots.has(idx)) {
      // Уже полит — покачать растение
      if (plant) {
        gsap.to(plant, {
          rotation: -4, duration: 0.1, yoyo: true, repeat: 3,
          ease: 'power1.inOut', onComplete: () => gsap.set(plant, { rotation: 0 }),
        })
      }
      return
    }

    // Анимация капель из лейки
    const can = wateringCanRef.current
    if (can) {
      const drops = can.querySelectorAll('.dg-drop')
      drops.forEach((drop, i) => {
        gsap.fromTo(drop,
          { attr: { cx: 10 + i * 8, cy: 5 }, opacity: 0.9 } as gsap.TweenVars,
          {
            attr: { cx: 10 + i * 14 + Math.sin(i) * 10, cy: 55 + i * 5 },
            opacity: 0, duration: 0.45 + i * 0.07, delay: i * 0.06, ease: 'power2.in',
          } as gsap.TweenVars
        )
      })
      // Лёгкое покачивание лейки при поливе
      gsap.to(can, { rotation: -12, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' })
    }

    const newSet = new Set(wateredPots)
    newSet.add(idx)
    setWateredPots(newSet)
    setJustWatered(idx)
  }

  return (
    <div className="dream-garden" ref={containerRef} onClick={handleBackgroundClick} data-cursor-cat="garden">

      {/* Фоновое фото */}
      <img className="dg-bg" src={asset('garden/garden_background.png')} alt="" draggable={false} />
      <div className="dg-scrim" />

      {/* Шапка */}
      <header className="dg-header">
        <div className="dg-header-sub">персональная теплица</div>
        <h2 className="dg-header-title">Сад мечты</h2>
        <p className="dg-header-hint">
          {!allGrown
            ? `возьми лейку и полей горшки · ${wateredPots.size} / 9`
            : 'все растения посажены ✦'}
        </p>
      </header>

      {/* Светлячки */}
      {Array.from({ length: FIREFLY_COUNT }).map((_, i) => (
        <div key={i} ref={el => { fireflyRefs.current[i] = el }} className="dg-firefly" aria-hidden="true" />
      ))}

      {/* Зона дерева */}
      <div className="dg-tree-zone">
        <img ref={treeRef} className="dg-tree" src={asset('garden/garden_background_tree.png')} alt="" draggable={false} />
        <div ref={glowRef} className="dg-glow" />

        {/* Горшки */}
        <div className="dg-pots-area">
          {POTS.map((pot, idx) => {
            const pos = POT_POS[idx]
            const isWatered = wateredPots.has(idx)
            const isHovered = hoveredPot === idx && isPickedUp && !isWatered

            return (
              <div
                key={pot.id}
                className={[
                  'dg-pot-slot',
                  pot.special ? 'dg-pot-slot--special' : '',
                  isWatered ? 'dg-pot-slot--watered' : '',
                  isHovered ? 'dg-pot-slot--hovered' : '',
                  isPickedUp && !isWatered ? 'dg-pot-slot--targetable' : '',
                ].filter(Boolean).join(' ')}
                style={{ left: `${pos.left}%`, bottom: `${pos.bottom}%` }}
                onClick={e => handlePotClick(idx, e)}
                onMouseEnter={() => isPickedUp && setHoveredPot(idx)}
                onMouseLeave={() => setHoveredPot(null)}
              >
                <div className="dg-plant-wrap">
                  <img
                    ref={el => { plantRefs.current[idx] = el }}
                    src={asset(`garden/herbs/${pot.plant}.png`)}
                    alt={pot.wish}
                    className="dg-plant"
                    draggable={false}
                  />
                </div>

                {pot.special && (
                  <svg className="dg-petals" viewBox="0 0 100 120" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map(i => (
                      <circle key={i} ref={el => { petalRefs.current[i] = el }}
                        cx="50" cy="20" r="4" fill="var(--warm-2)" opacity="0" />
                    ))}
                  </svg>
                )}

                {pot.special && <div ref={haloRef} className="dg-halo" aria-hidden="true" />}

                <img
                  src={asset(`garden/pots/pot_0${pot.id}.png`)}
                  alt="" className="dg-pot-img" draggable={false}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Лейка — клик чтобы взять */}
      {!allGrown && (
        <div
          ref={wateringCanRef}
          className={`dg-watering-can${isPickedUp ? ' dg-watering-can--held' : ''}`}
          onClick={handleCanPickUp}
          role="button"
          aria-label="Взять лейку"
        >
          <img
            src={asset('garden/stuff/watering_can.png')}
            alt="лейка"
            className="dg-can-img"
            draggable={false}
          />

          {/* Капли воды */}
          <svg className="dg-drops" viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
            {[0, 1, 2, 3].map(i => (
              <circle key={i} className={`dg-drop dg-drop--${i}`} cx="10" cy="5" r="3" fill="#A89B8A" opacity="0" />
            ))}
          </svg>

          {!isPickedUp && (
            <span className="dg-can-hint">нажми, чтобы взять</span>
          )}
        </div>
      )}

      {/* Финальная плашка */}
      <div ref={bannerRef} className="dg-banner" aria-live="polite">
        Экспозиция “Сад мечты” подтверждает:
        все посаженные здесь желания подлежат росту,
        цветению и защите от Excel-таблиц.
      </div>
    </div>
  )
}
