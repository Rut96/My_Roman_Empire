import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './DoorTooltip.css'

interface Props {
  label: string | null
}

export function DoorTooltip({ label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const setX = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const setY = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  // Set up GSAP quickTo for smooth cursor following
  useEffect(() => {
    if (!ref.current) return
    setX.current = gsap.quickTo(ref.current, 'x', { duration: 0.45, ease: 'power2.out' })
    setY.current = gsap.quickTo(ref.current, 'y', { duration: 0.45, ease: 'power2.out' })

    let initialized = false
    const onMove = (e: MouseEvent) => {
      const tx = e.clientX + 24
      const ty = e.clientY - 64
      if (!initialized) {
        gsap.set(ref.current, { x: tx, y: ty })
        initialized = true
      }
      setX.current!(tx)
      setY.current!(ty)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Animate in/out when label changes
  useEffect(() => {
    if (!ref.current) return
    gsap.to(ref.current, {
      opacity: label ? 1 : 0,
      scale: label ? 1 : 0.88,
      duration: label ? 0.1 : 0.2,
      ease: 'power2.out',
    })
  }, [label])

  return (
    <div ref={ref} className="door-tooltip" aria-hidden="true">
      <span className="door-tooltip__orn">✦</span>
      {label}
      <span className="door-tooltip__orn">✦</span>
    </div>
  )
}
