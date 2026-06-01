import React, { useEffect, useRef } from 'react'
import { useCursorStore } from '../../store/cursorStore'
import { useLegendStore } from '../../store/legendStore'
import { CURSOR_IMAGES } from './cursorImages'
import './Cursor.css'

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const rafId = useRef<number>(0)
  const state = useCursorStore((s) => s.state)
  const legendActive = useLegendStore(s => s.active)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const loop = () => {
      const LERP = 0.15
      pos.current.x += (target.current.x - pos.current.x) * LERP
      pos.current.y += (target.current.y - pos.current.y) * LERP
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px)`
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  // Idle timer → bored (starts on mount, resets on mousemove)
  useEffect(() => {
    const setState = useCursorStore.getState().setState
    let idleTimer: ReturnType<typeof setTimeout> = setTimeout(
      () => setState('bored'),
      5000
    )

    const onMove = () => {
      clearTimeout(idleTimer)
      if (useCursorStore.getState().state === 'bored') setState('neutral')
      idleTimer = setTimeout(() => setState('bored'), 5000)
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(idleTimer)
    }
  }, [])

  return (
    <div ref={cursorRef} className="cursor-root">
      <img
        src={CURSOR_IMAGES[state]}
        alt=""
        className="cursor-face"
        draggable={false}
      />
      {state === 'bored' && (
        <span className="cursor-bored-label">ну и где подарок?</span>
      )}
      {legendActive && (
        <div className="cursor-sparkles">
          {[0,1,2,3,4,5].map(i => (
            <span key={i} className="sparkle" style={{ '--i': i } as React.CSSProperties}>✨</span>
          ))}
        </div>
      )}
    </div>
  )
}
