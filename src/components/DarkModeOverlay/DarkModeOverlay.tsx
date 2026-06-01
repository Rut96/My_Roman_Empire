import { useEffect, useState } from 'react'
import './DarkModeOverlay.css'

interface Props { onDone: () => void }

export function DarkModeOverlay({ onDone }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 4000)
    const t2 = setTimeout(onDone, 4600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`dark-overlay ${visible ? 'dark-overlay--in' : 'dark-overlay--out'}`}>
      Даже в самой тёмной тьме... найдётся пышка.
    </div>
  )
}
