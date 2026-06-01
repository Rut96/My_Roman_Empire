import { useEffect } from 'react'
import { useBoredomStore } from '../store/boredomStore'

export function useBoredomIndex() {
  const { index, status, recalculate } = useBoredomStore()

  useEffect(() => {
    const interval = setInterval(recalculate, 10_000)

    let moveTimer: ReturnType<typeof setTimeout>
    const onMove = () => {
      clearTimeout(moveTimer)
      moveTimer = setTimeout(recalculate, 500)
    }
    window.addEventListener('mousemove', onMove)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', onMove)
      clearTimeout(moveTimer)
    }
  }, [recalculate])

  return { index, status }
}
