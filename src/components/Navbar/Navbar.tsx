import { useState, useRef } from 'react'
import { useBoredomIndex } from '../../hooks/useBoredomIndex'
import { useRoomStore } from '../../store/roomStore'
import { useDarkModeStore } from '../../store/darkModeStore'
import { useLegendStore } from '../../store/legendStore'

import { getHallName } from '../../utils/hallNames'
import { asset } from '../../utils/asset'
import './Navbar.css'

function getTier(status: string): number {
  if (status === 'Скучаю') return 0
  if (status === 'Сильно скучаю') return 1
  if (status === 'Безобразие' || status === 'Где Аня?') return 2
  return 3 // Требуется встреча, Критический
}

function getTooltip(status: string): string {
  if (status === 'Скучаю') return 'пока ничего'
  if (status === 'Сильно скучаю') return 'давно не виделись!'
  if (status === 'Безобразие') return 'требуется встреча!'
  if (status === 'Где Аня?') return 'SOS, скучаю!'
  if (status === 'Требуется встреча') return 'это невыносимо'
  return 'всё пропало.'
}

export function Navbar() {
  const { index, status } = useBoredomIndex()
  const activeRoom = useRoomStore(s => s.activeRoom)
  const darkActive = useDarkModeStore(s => s.active)
  const toggleDark = useDarkModeStore(s => s.toggle)
  const legendActive = useLegendStore(s => s.active)
  const [spinning, setSpinning]       = useState(false)
  const [showError, setShowError]     = useState(false)
  const [spinDisplay, setSpinDisplay] = useState('')
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const formattedIndex = index.toLocaleString('ru-RU')
  const tier = getTier(status)
  const tooltipText = getTooltip(status)

  function handleRecalculate() {
    if (spinning) return
    setSpinning(true)
    setShowError(false)

    spinRef.current = setInterval(() => {
      const rand = Math.floor(Math.random() * 9_999_999_999_999)
      setSpinDisplay(rand.toLocaleString('ru-RU'))
    }, 60)

    setTimeout(() => {
      if (spinRef.current) clearInterval(spinRef.current)
      setSpinning(false)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    }, 1500)
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <a className="nav-title" href="#">Музей воспоминаний</a>
        <div className="nav-sep" />
        <div className="hall-indicator">
          <span className="hall-dot" />
          <span>зал:</span>
          <span className="hall-name">{getHallName(activeRoom)}</span>
        </div>
      </div>

      <div className="nav-center">
        <div className={`boredom tier-${tier}`}>
          <div className="boredom-main">
            <span className="boredom-status-badge">индекс скучания</span>
            <span className="boredom-number">
              {spinning ? spinDisplay : formattedIndex}
            </span>
          </div>
          <span className="boredom-tooltip">{tooltipText}</span>
        </div>

        <button
          className="navbar-btn"
          onClick={handleRecalculate}
          disabled={spinning}
        >
          Пересчитать ↻
        </button>
      </div>

      <div className="nav-right">
        <button className="anya-toggle" onClick={toggleDark}>
          <img
            className="anya-face"
            src={asset(darkActive ? 'anya_face_cursor/dark.png' : 'anya_face_cursor/happy.png')}
            width={28}
            height={28}
            alt=""
          />
        </button>

        {legendActive && (
          <span className="navbar-legend">⚡ ЛЕГЕНДА АКТИВИРОВАНА</span>
        )}
      </div>

      {showError && (
        <div className="navbar-error-toast">
          ❌ Ошибка: невозможно посчитать, слишком много.
          <br />
          <span>* система не справилась с любовью</span>
        </div>
      )}
    </nav>
  )
}
