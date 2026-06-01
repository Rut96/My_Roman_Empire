import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { asset } from '../../utils/asset'
import { GALLERY_ITEMS } from '../../data/galleryItems'
import type { GalleryItem } from '../../data/galleryItems'
import { useRoomStore } from '../../store/roomStore'
import { useDarkModeStore } from '../../store/darkModeStore'
import { PhotoCard } from './PhotoCard'
import { Door } from '../Door/Door'
import { DarkModeOverlay } from '../DarkModeOverlay/DarkModeOverlay'
import { HeroReveal } from '../HeroReveal/HeroReveal'
import { DoorTooltip } from '../DoorTooltip/DoorTooltip'
import { getCursorCategory } from '../Cursor/cursorCategory'
import { useCursorStore } from '../../store/cursorStore'
import './Scene.css'

gsap.registerPlugin(ScrollTrigger)

const PARALLAX_X_AMP = 60

export function Scene() {
  const { openRoom, activeRoom, openingRoom } = useRoomStore()
  const darkMode = useDarkModeStore(s => s.active)

  const [showDarkOverlay, setShowDarkOverlay] = useState(false)
  const [tooltipLabel, setTooltipLabel] = useState<string | null>(null)

  // ── Lenis smooth scroll + GSAP horizontal parallax ──
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 })
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const section = document.querySelector<HTMLElement>('.scene-gallery')
    const strip = document.querySelector<HTMLElement>('.gallery-strip')
    if (!section || !strip) return

    const getTravel = () => strip.scrollWidth - window.innerWidth

    const cells = document.querySelectorAll<HTMLElement>('.gallery-cell')

    // Set initial vertical scatter (photos only — doors use align-self: flex-end)
    cells.forEach(el => {
      if (el.classList.contains('cell-door')) return
      const y = parseFloat(el.dataset.y ?? '0')
      gsap.set(el, { y: `${y}vh` })
    })

    const finalCell = section.querySelector<HTMLElement>('.gallery-cell--final')

    // Build scroll-linked timeline
    const tl = gsap.timeline({ defaults: { ease: 'none' } })

    // Base: move entire strip left
    tl.to(strip, { x: () => -getTravel() }, 0)

    // Individual parallax offset per cell
    cells.forEach(el => {
      const speed = parseFloat(el.dataset.speed ?? '1')
      tl.to(el, { x: () => -(speed - 1) * PARALLAX_X_AMP }, 0)
    })

    let finaleTriggered = false
    let finaleTl: gsap.core.Timeline | null = null

    const playFinale = () => {
      if (!finalCell) return
      lenis.stop()

      // Snap the scrub timeline to its end so the strip stays frozen
      tl.progress(1, true)
      gsap.killTweensOf(tl, 'progress')

      const rect = finalCell.getBoundingClientRect()

      // Target scale to fill 85% of viewport
      const targetScale = Math.min(
        (window.innerWidth  * 0.85) / rect.width,
        (window.innerHeight * 0.85) / rect.height,
      )

      // Current rendered center → viewport center delta
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dx = window.innerWidth  / 2 - cx
      const dy = window.innerHeight / 2 - cy

      const existingX = (gsap.getProperty(finalCell, 'x') as number) || 0
      const existingY = (gsap.getProperty(finalCell, 'y') as number) || 0

      // Add door-open class so the CSS transition handles the panel swing
      const sashes = finalCell.querySelector<HTMLElement>('.door-sashes')

      finaleTl = gsap.timeline()
        .to(finalCell, {
          scale: targetScale,
          x: existingX + dx,
          y: existingY + dy,
          zIndex: 200,
          duration: 1.5,
          ease: 'power2.inOut',
          overwrite: 'auto',
        })
        .call(() => { sashes?.classList.add('door-open') }, [], '-=0.4')
        .call(() => {
          useRoomStore.getState().openRoom('final')
          lenis.start()
        }, [], '+=0.8')
    }

    ScrollTrigger.create({
      trigger: section,
      pin: true,
      scrub: 1.2,
      animation: tl,
      end: () => `+=${getTravel()}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress >= 0.999 && !finaleTriggered && self.direction === 1 && lenis.isScrolling) {
          finaleTriggered = true
          playFinale()
        }
      },
    })

    // ── Horizontal trackpad scroll → advance gallery ──
    // Capture phase on window → fires before Lenis, stopImmediatePropagation
    // prevents Lenis from overwriting our scroll with deltaY≈0
    const onWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect()
      if (Math.abs(rect.top) > 5) return               // gallery not pinned yet
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return  // vertical scroll
      e.stopImmediatePropagation()
      e.preventDefault()
      lenis.scrollTo(lenis.targetScroll + e.deltaX, { programmatic: false })
    }
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })

    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true })
      finaleTl?.kill()
      lenis.destroy()
      gsap.ticker.remove(ticker)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  // ── Door hover tooltip ──
  useEffect(() => {
    const doors = document.querySelectorAll<HTMLElement>('.door-wrapper')
    const handlers = Array.from(doors).map(door => {
      const onEnter = () => setTooltipLabel(door.dataset.label ?? null)
      const onLeave = () => setTooltipLabel(null)
      door.addEventListener('mouseenter', onEnter)
      door.addEventListener('mouseleave', onLeave)
      return { door, onEnter, onLeave }
    })
    return () => {
      handlers.forEach(({ door, onEnter, onLeave }) => {
        door.removeEventListener('mouseenter', onEnter)
        door.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <DoorTooltip label={tooltipLabel} />
      {/* ── HERO ── */}
      <HeroReveal
        onDarkOverlay={() => setShowDarkOverlay(true)}
      />

      {/* ── GALLERY (horizontal pinned strip, g_final last) ── */}
      <section className="scene-gallery" style={{ backgroundImage: `url(${asset(darkMode ? 'background/wall2.png' : 'background/wall1.png')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnyaCoffee />
        <div className="gallery-strip">
          {GALLERY_ITEMS.flatMap(item => {
            const cell = (
              <GalleryCell
                key={item.id}
                item={item}
                isOpen={item.type === 'door' ? (activeRoom === item.folder || openingRoom === item.folder) : false}
                onDoorClick={openRoom}
              />
            )
            if (item.id === 'g_final') {
              return [
                <div key="spacer-finale" className="gallery-spacer-finale" aria-hidden="true" />,
                cell,
              ]
            }
            return cell
          })}
        </div>
      </section>

      {showDarkOverlay && (
        <DarkModeOverlay onDone={() => setShowDarkOverlay(false)} />
      )}
    </>
  )
}

interface GalleryCellProps {
  item: GalleryItem
  isOpen: boolean
  onDoorClick: ((id: string) => void) | undefined
}

function GalleryCell({ item, isOpen, onDoorClick }: GalleryCellProps) {
  const isFinal = item.id === 'g_final'
  const cursorCat = item.type === 'door' ? 'happy' : getCursorCategory(item.src)
  return (
    <figure
      className={`gallery-cell cell-${item.size}${isFinal ? ' gallery-cell--final' : ''}`}
      data-speed={item.speed}
      data-id={item.id}
      data-y={item.y}
      data-cursor-cat={cursorCat}
    >
      {item.type === 'photo' ? (
        <div className="photo-with-cat">
          <PhotoCard
            gallery
            src={item.src}
            rotation={item.rotation}
            x={0} y={0} scale={1}
          />
          {item.catPeek && (
            <div className={`cat-peek cat-peek--${item.catPeek}`} data-cursor-cat="loved">
              <img src={asset('anya_full/anyas_cat.png')} alt="" draggable={false} />
            </div>
          )}
        </div>
      ) : (
        <Door
          gallery
          id={item.folder}
          folder={item.folder}
          arch={item.arch}
          sash={item.sash}
          x={0} y={0} rotation={0}
          label={item.label}
          isOpen={isOpen}
          onClick={onDoorClick}
        />
      )}
      {item.type === 'photo' && item.caption && (
        <figcaption className="cell-caption">{item.caption}</figcaption>
      )}
    </figure>
  )
}

function AnyaCoffee() {
  const toggleCoffee = useCursorStore(s => s.toggleCoffee)
  const active = useCursorStore(s => s.coffeeOverride)

  return (
    <div
      className={`anya-coffee${active ? ' anya-coffee--active' : ''}`}
      onClick={toggleCoffee}
      role="button"
      aria-label="Переключить курсор"
    >
      <img
        src={asset('anya_face_cursor/anya_coffe.webp')}
        alt=""
        draggable={false}
        className="anya-coffee-img"
      />
    </div>
  )
}
