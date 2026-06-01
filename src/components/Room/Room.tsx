import { useEffect } from 'react'
import { useRoomStore } from '../../store/roomStore'
import { useDarkModeStore } from '../../store/darkModeStore'
import { asset } from '../../utils/asset'
import './Room.css'

interface Props {
  id: string
  title?: string
  contentClassName?: string
  noWallBg?: boolean
  bgImage?: string
  children: React.ReactNode
}

export function Room({ id, title, contentClassName, noWallBg, bgImage, children }: Props) {
  const { activeRoom, closeRoom } = useRoomStore()
  const darkMode = useDarkModeStore(s => s.active)
  const isOpen = activeRoom === id

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRoom()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeRoom])

  if (!isOpen) return null

  return (
    <div className="room-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeRoom() }}>
      <div
        className={`room-content${contentClassName ? ' ' + contentClassName : ''}`}
        style={!noWallBg ? { backgroundImage: `url(${asset(bgImage ?? (darkMode ? 'background/wall2.png' : 'background/wall1.png'))})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        onWheel={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
      >
        <button className="room-close" onClick={closeRoom} aria-label="Закрыть">✕</button>
        {title && <h2 className="room-title">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
