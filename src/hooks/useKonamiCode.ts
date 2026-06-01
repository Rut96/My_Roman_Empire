import { useEffect } from 'react'

const KONAMI = ['0','2','0','6','9','7']

export function useKonamiCode(onSuccess: () => void) {
  useEffect(() => {
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[idx]) {
        idx++
        if (idx === KONAMI.length) {
          idx = 0
          onSuccess()
        }
      } else {
        idx = e.key === KONAMI[0] ? 1 : 0
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onSuccess])
}
