import { useMemoryStore } from '../../store/memoryStore'
import './MemoryToast.css'

export function MemoryToast() {
  const { visible, current, hide } = useMemoryStore()

  if (!visible || !current) return null

  return (
    <div className="memory-toast-backdrop" onClick={hide}>
      <div className="memory-toast" onClick={e => e.stopPropagation()}>
        <span className="memory-toast-id">ЭКСПОНАТ №{current.id}</span>
        <h3 className="memory-toast-title">{current.title}</h3>
        <p className="memory-toast-text">{current.text}</p>
        <span className="memory-toast-close">кликни вне карточки</span>
      </div>
    </div>
  )
}
