import { useMemoryStore } from '../../store/memoryStore'
import './FloatingMemoryBtn.css'

export function FloatingMemoryBtn() {
  const showMemory = useMemoryStore(s => s.show)

  return (
    <button className="floating-memory-btn" onClick={showMemory}>
      ⛏ Раскопать
    </button>
  )
}
