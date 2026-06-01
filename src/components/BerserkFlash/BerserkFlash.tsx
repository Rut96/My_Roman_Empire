import { useEffect, useState } from 'react'
import './BerserkFlash.css'

interface Props { onDone: () => void }

export function BerserkFlash({ onDone }: Props) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1900)
    const t2 = setTimeout(onDone, 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`berserk-flash ${fading ? 'berserk-flash--out' : ''}`}>
      <div className="berserk-sword">⚔</div>
      <p className="berserk-quote">
        "Мечтай. Даже если твоя мечта причиняет боль."
      </p>
      <p className="berserk-attr">— Берсерк</p>
    </div>
  )
}
