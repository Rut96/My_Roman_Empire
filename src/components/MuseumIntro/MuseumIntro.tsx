import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import anyaOpenVideo from '../../assets/video/anya_open.mp4'
import { asset } from '../../utils/asset'
import './MuseumIntro.css'

interface Props {
  onComplete: () => void
}

const ZOOM_START_TIME = 4.5

type Phase = 'idle' | 'expanding' | 'playing'

export function MuseumIntro({ onComplete }: Props) {
  const videoRef      = useRef<HTMLVideoElement>(null)
  const leftRef       = useRef<HTMLDivElement>(null)
  const rightRef      = useRef<HTMLDivElement>(null)
  const doorsRef      = useRef<HTMLDivElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const enterRef      = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const animatedRef   = useRef(false)
  const tlRef         = useRef<gsap.core.Timeline | null>(null)
  const zoomRef       = useRef<gsap.core.Tween | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
      zoomRef.current?.kill()
    }
  }, [])

  function startDoorAnimation() {
    if (animatedRef.current) return
    animatedRef.current = true
    window.scrollTo(0, 0)

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => onCompleteRef.current(),
        })
      },
    })
    tlRef.current = tl

    tl.set(doorsRef.current, { perspective: 1400 })
    tl.to(leftRef.current,  { rotateY: -115, duration: 1.2, ease: 'power2.inOut' }, 0)
    tl.to(rightRef.current, { rotateY:  115, duration: 1.2, ease: 'power2.inOut' }, 0)
    tl.to(enterRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0)
  }

  function handleEnter() {
    if (phase !== 'idle') return
    setPhase('expanding')

    const container = enterRef.current
    if (!container) return

    // Video is portrait (9:16 after rotation metadata applied by browser)
    const targetH = Math.min(window.innerHeight * 0.85, window.innerWidth * 0.55 * (16 / 9))
    const targetW = targetH * (9 / 16)

    gsap.to(container, {
      width: targetW,
      height: targetH,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        setPhase('playing')
        videoRef.current?.play().catch(() => startDoorAnimation())
      },
    })
  }

  useEffect(() => {
    if (phase !== 'playing') return
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (video.currentTime < ZOOM_START_TIME) return
      video.removeEventListener('timeupdate', onTimeUpdate)
      const remaining = video.duration - video.currentTime
      if (!isFinite(remaining) || remaining <= 0) return
      zoomRef.current = gsap.to(video, {
        scale: 3.5,
        duration: remaining,
        ease: 'power2.in',
      })
    }

    const onEnded = () => startDoorAnimation()

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [phase])

  return (
    <div className="museum-intro" ref={overlayRef}>

      {/* Expandable container: starts as "Войти" button, grows to video window */}
      <div
        className={`museum-intro-enter${phase !== 'idle' ? ' museum-intro-enter--open' : ''}`}
        ref={enterRef}
        onClick={handleEnter}
      >
        {phase === 'idle' && (
          <span className="museum-intro-enter-label">· Войти ·</span>
        )}
        <video
          ref={videoRef}
          className="museum-intro-video"
          src={anyaOpenVideo}
          muted
          playsInline
          preload="auto"
          style={{ opacity: phase === 'playing' ? 1 : 0 }}
        />
      </div>

      {/* Door panels — swing open at the end */}
      <div className="museum-intro-doors" ref={doorsRef}>
        <div className="museum-intro-door museum-intro-door--left" ref={leftRef}>
          <img
            src={asset('doors/main_door/main_door_wide_left.png')}
            alt=""
            draggable={false}
            className="museum-intro-door-img"
          />
        </div>
        <div className="museum-intro-door museum-intro-door--right" ref={rightRef}>
          <img
            src={asset('doors/main_door/main_door_wide_right.png')}
            alt=""
            draggable={false}
            className="museum-intro-door-img"
          />
        </div>
      </div>


    </div>
  )
}
