import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../../utils/asset'
import { useDarkModeStore } from '../../store/darkModeStore'
import anyaNameVideo from '../../assets/video/anya_name.mov'
import './HeroReveal.css'

gsap.registerPlugin(ScrollTrigger)

interface HeroRevealProps {
  onDarkOverlay: () => void
}

export function HeroReveal({ onDarkOverlay }: HeroRevealProps) {
  const darkMode   = useDarkModeStore(s => s.active)
  const sectionRef = useRef<HTMLElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)
  const anyaRef    = useRef<HTMLDivElement>(null)
  const mangaRef   = useRef<HTMLDivElement>(null)
  const donutRef   = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLDivElement>(null)  // "МОЯ РИМСКАЯ ИМПЕРИЯ" — above head
  const nameRef    = useRef<HTMLDivElement>(null)   // "Аня" video — body area
  const nameVideoRef = useRef<HTMLVideoElement>(null)
  const namePlayedRef = useRef(false)

  const [mangaClicks, setMangaClicks] = useState(0)

  // ── GSAP scroll timeline ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',   // CSS sticky handles pin — no GSAP pin
          scrub: 1.5,
        },
      })

      // Glow grows
      tl.fromTo(glowRef.current,
        { scale: 1, opacity: 0.4, xPercent: -50, yPercent: -50 },
        { scale: 1.4, opacity: 0.8, xPercent: -50, yPercent: -50 },
        0
      )
      // Manga slides in from left
      tl.fromTo(mangaRef.current,
        { x: -300, opacity: 0 },
        { x: 0, opacity: 1 },
        0.1
      )
      // Donut slides in from right
      tl.fromTo(donutRef.current,
        { x: 300, opacity: 0 },
        { x: 0, opacity: 1 },
        0.1
      )
      // "МОЯ РИМСКАЯ ИМПЕРИЯ" drops down from above head
      tl.fromTo(labelRef.current,
        { opacity: 0, y: -24, xPercent: -50 },
        { opacity: 1, y: 0, xPercent: -50 },
        0.2
      )
      // "Аня" video rises up at body level — play on scroll-in
      tl.fromTo(nameRef.current,
        { opacity: 0, y: 40, scale: 0.85, xPercent: -50 },
        {
          opacity: 1, y: 0, scale: 1, xPercent: -50,
          onStart: () => {
            if (namePlayedRef.current) return
            namePlayedRef.current = true
            const video = nameVideoRef.current
            if (!video) return
            video.currentTime = 0
            video.play().catch(() => {})
          },
        },
        0.3
      )
      // Hearts scatter in last
      tl.fromTo('.hero-heart',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, stagger: 0.04 },
        0.45
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ── Manga easter egg: 3 clicks → dark mode ──
  function handleMangaClick() {
    const next = mangaClicks + 1
    setMangaClicks(next)
    if (next === 1 || next === 2) {
      gsap.to(mangaRef.current, { x: '+=6', yoyo: true, repeat: 3, duration: 0.08, ease: 'power1.inOut' })
    } else {
      setMangaClicks(0)
      useDarkModeStore.getState().toggle()
      onDarkOverlay()
    }
  }

  return (
    <section ref={sectionRef} className="hero-reveal">
      <div className="hero-reveal-stage" style={{ backgroundImage: `url(${asset(darkMode ? 'background/wall2.png' : 'background/wall1.png')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Glow */}
        <div ref={glowRef} className="hero-glow" aria-hidden="true" />

        {/* Anya — giant, always visible */}
        <div ref={anyaRef} className="hero-anya">
          <img src={asset('anya_full/anya_full.png')} alt="Аня" draggable={false} />
        </div>

        {/* "МОЯ · РИМСКАЯ · ИМПЕРИЯ" — above Anya's head */}
        <div ref={labelRef} className="hero-label" aria-hidden="true">
          МОЯ · РИМСКАЯ · ИМПЕРИЯ
        </div>

        {/* "Аня" video — centered bottom, plays once on scroll enter */}
        <div ref={nameRef} className="hero-name-video-wrap" aria-hidden="true">
          <video
            ref={nameVideoRef}
            className="hero-name-video"
            src={anyaNameVideo}
            muted
            playsInline
            preload="metadata"
          />
        </div>

        {/* Manga — left */}
        <div
          ref={mangaRef}
          className="hero-side-obj hero-side-obj--manga"
          onClick={handleMangaClick}
        >
          <img src={asset('anya_full/manga.png')} alt="" draggable={false} />
        </div>

        {/* Donut — right */}
        <div
          ref={donutRef}
          className="hero-side-obj hero-side-obj--donut"
          data-cursor-cat="loved"
        >
          <img src={asset('anya_full/donut.png')} alt="" draggable={false} />
        </div>

        {/* Heart/sparkle placeholders — user will replace with real PNGs */}
        <div className="hero-heart" style={{ top: '15vh', left: '20vw' }}>♥</div>
        <div className="hero-heart" style={{ top: '25vh', right: '22vw' }}>♥</div>
        <div className="hero-heart" style={{ top: '45vh', left: '15vw', fontSize: '1.2rem' }}>✦</div>
        <div className="hero-heart" style={{ top: '20vh', right: '15vw', fontSize: '1rem' }}>✦</div>
      </div>
    </section>
  )
}
