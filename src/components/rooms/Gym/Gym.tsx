import { useState, useRef, useEffect, useCallback } from 'react'
import { asset } from '../../../utils/asset'
import './Gym.css'

/* ── Data ── */

const POSES = [
  { id: 'split',  src: 'sport/anya_pose_split..webp', w: 300, pedestal: 300, glow: 320, offsetY: 0, caption: 'ЭКСПОНАТ · поперечный шпагат\nпроцесс задокументирован' },
  { id: 'bridge', src: 'sport/anya_pose_bridge.webp',  w: 220, pedestal: 210, glow: 230, offsetY: 0, caption: 'ЭКСПОНАТ · мостик\nугол спины признан неуместным' },
  { id: 'fold',   src: 'sport/anya_pose_fold.webp',    w: 160, pedestal: 150, glow: 170, offsetY: 0, caption: 'ЭКСПОНАТ · складка\nголова и колени достигли консенсуса' },
] as const

const STATS = [
  { key: 'STR', pct: 80,  note: 'тягает веса' },
  { key: 'DEX', pct: 100, note: 'шпагат' },
  { key: 'INT', pct: 80,  note: 'много манги' },
  { key: 'CHA', pct: 90,  note: 'мрачный шик' },
  { key: 'WIL', pct: 90,  note: 'не сдаётся' },
  { key: 'SAN', pct: 40,  note: 'после стекла' },
]

const WALL_NOTES = [
  { text: 'растяжка — это\nдиалог с телом.\nтело обычно орёт.', style: { top: '3%', left: '1%', transform: 'rotate(-3.5deg)' } },
  { text: 'сначала шпагат,\nпотом власть\nнад миром', style: { top: '11%', right: '3%', transform: 'rotate(2.4deg)' } },
  { text: 'страдание \nзадокументировано.\nрезультат виден.', style: { top: '44%', left: '0.5%', transform: 'rotate(1.8deg)' } },
  { text: 'боль временна.\nфотка в шпагате —\nнавсегда.', style: { bottom: '18%', right: '1.5%', transform: 'rotate(-2deg)' } },
  { text: 'пн: шпагат ✓\nвт: мостик ✓\nср: всё ✓\nчт: повтор', style: { bottom: '5%', left: '1%', transform: 'rotate(2.5deg)' } },
  { text: 'тело — храм.\nно храм сегодня\nтягает веса.»', style: { bottom: '32%', right: '0.5%', transform: 'rotate(1.4deg)' } },
]

const WEIGHT_THRESHOLDS = [
  { max: 0,    label: '—',                          color: '' },
  { max: 50,   label: 'норма',                      color: 'var(--text-muted)' },
  { max: 200,  label: 'впечатляет',                  color: 'var(--warm-2)' },
  { max: 9998, label: 'Аня всё равно справилась',    color: 'var(--warm-1)' },
  { max: 9999, label: 'Предел измерения превышен\nАня всё равно справилась', color: '#ff5555' },
]

/* ── Helpers ── */

function getPlateConfig(val: number): string[] {
  const plates: string[] = []
  if (val >= 1)    plates.push('s')
  if (val >= 20)   plates.push('s')
  if (val >= 50)   plates.push('m')
  if (val >= 100)  plates.push('m')
  if (val >= 200)  plates.push('l')
  if (val >= 500)  plates.push('l')
  if (val >= 1000) plates.push('xl')
  if (val >= 5000) plates.push('xl')
  if (val >= 9999) { plates.push('xl', 'xl') }
  return plates
}

/* ── Component ── */

export function Gym() {
  const [poseIdx, setPoseIdx] = useState(0)
  const [weight, setWeight] = useState(0)
  const [barsVisible, setBarsVisible] = useState(false)
  const [figureReady, setFigureReady] = useState(false)
  const [achievement, setAchievement] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [shaking, setShaking] = useState(false)
  const [overload, setOverload] = useState(false)

  const statsRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const coneRef = useRef<HTMLDivElement>(null)
  const achieveTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const lastOverload = useRef(0)

  const pose = POSES[poseIdx]

  // Stat bars — IntersectionObserver
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setBarsVisible(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Figure entrance — short delay after mount
  useEffect(() => {
    const t = setTimeout(() => setFigureReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Cycle pose
  const cyclePose = useCallback(() => {
    const img = imgRef.current
    if (img) {
      img.style.transition = 'opacity 0.15s, transform 0.15s'
      img.style.opacity = '0'
      img.style.transform = 'scale(0.91) rotate(-2deg)'
    }
    setTimeout(() => {
      setPoseIdx(i => (i + 1) % POSES.length)
      if (img) {
        img.style.transition = 'opacity 0.25s, transform 0.85s cubic-bezier(0.34,1.56,0.64,1)'
        img.style.opacity = '1'
        img.style.transform = 'scale(1) rotate(0deg)'
      }
      // Spotlight pulse
      const cone = coneRef.current
      if (cone) {
        cone.style.animation = 'gym-spotPulse 0.3s ease'
        setTimeout(() => { cone.style.animation = '' }, 400)
      }
      // Achievement
      setAchievement(true)
      if (achieveTimer.current) clearTimeout(achieveTimer.current)
      achieveTimer.current = setTimeout(() => setAchievement(false), 2800)

    }, 170)
  }, [])

  // Skip workout
  const skipWorkout = useCallback(() => {
    setShaking(true)
    setFeedback('✕  НЕВОЗМОЖНО. ОНА ТЕПЕРЬ ТЯГАЕТ ВЕСА.')
    setTimeout(() => setShaking(false), 500)
    setTimeout(() => setFeedback(''), 3400)
  }, [])

  // Weight change
  const onWeight = useCallback((val: number) => {
    setWeight(val)
    if (val >= 9999) {
      const now = Date.now()
      if (now - lastOverload.current > 3500) {
        lastOverload.current = now
        setOverload(true)
        setTimeout(() => setOverload(false), 900)
      }
    }
  }, [])

  const weightInfo = WEIGHT_THRESHOLDS.find(w => weight <= w.max) ?? WEIGHT_THRESHOLDS[0]
  const plates = getPlateConfig(weight)
  const sliderPct = (weight / 9999 * 100).toFixed(2) + '%'

  return (
    <div className={`gym-hall${overload ? ' gym-hall--shake' : ''}`}>
      {/* Flicker overlay */}
      <div className={`gym-flicker${overload ? ' gym-flicker--active' : ''}`} />

      {/* Achievement */}
      <div className={`gym-achievement${achievement ? ' gym-achievement--show' : ''}`}>
        &#x2B21; ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО
      </div>

      {/* Nameplate */}
      <div className="gym-nameplate-row">
        <div className="gym-nameplate">
          <div className="gym-np-kicker">Музей · Экспозиция 7</div>
          <div className="gym-np-title">Зал тренировок</div>
          <div className="gym-np-sub">тренировочная арка &nbsp;·&nbsp; арка — и сюжетная, и тренировочная</div>
        </div>
      </div>

      {/* Wall notes */}
      {WALL_NOTES.map((note, i) => (
        <div key={i} className="gym-wall-note" style={note.style as React.CSSProperties}>
          {note.text.split('\n').map((line, j) => (
            <span key={j}>{line}{j < note.text.split('\n').length - 1 && <br />}</span>
          ))}
        </div>
      ))}

      {/* Stage */}
      <div className="gym-stage">
        {/* Pedestal with figure */}
        <div className="gym-pedestal-wrap" ref={figureRef}>
          {/* Glow behind figure */}
          <div className="gym-back-glow" ref={coneRef} />
          {/* Figure on pedestal */}
          <div className="gym-figure-mount">
            <img
              ref={imgRef}
              className={`gym-figure-img${figureReady ? ' gym-figure-img--ready' : ''}`}
              src={asset(pose.src)}
              width={pose.w}
              alt="Anya"
              draggable={false}
              style={pose.offsetY ? { transform: `translateY(${pose.offsetY}px)` } : undefined}
            />
          </div>
          <img
            className="gym-pedestal-img"
            src={asset('sport/постамент.png')}
            alt=""
            draggable={false}
          />
          <div className="gym-floor-glow" />
          <div className="gym-figure-caption">
            {pose.caption.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </div>

        </div>

        {/* RPG Card + Buttons */}
        <div className="gym-right-col">
          <div className="gym-stats-card" ref={statsRef}>
            <span className="gym-stats-header">
              АНЯ · LVL &#8734;
              <span className="gym-lvl-tip">(сегодня +1)</span>
            </span>
            {STATS.map(s => (
              <div key={s.key} className="gym-stat-row">
                <span className="gym-stat-key">{s.key}</span>
                <div className="gym-bar-track">
                  <div
                    className="gym-bar-fill"
                    style={{ width: barsVisible ? `${s.pct}%` : '0%' }}
                  />
                </div>
                <span className="gym-stat-note">{s.note}</span>
              </div>
            ))}
            <hr className="gym-stats-divider" />
            <div className="gym-stats-meta">
              Класс:&nbsp;&nbsp; <strong>Тёмный садовник</strong><br />
              Стихия: <strong>Растяжка</strong><br />
              Ульта:&nbsp;&nbsp; <strong>Шпагат под драму</strong>
            </div>
          </div>

          {/* Pose buttons — under stats card */}
          <div className="gym-pose-btns">
            <button className="gym-pose-btn" onClick={cyclePose}>&#x25C9; Сесть на шпагат</button>
            <button className={`gym-pose-btn gym-pose-btn--skip${shaking ? ' gym-btn--refuse' : ''}`} onClick={skipWorkout}>
              &#x2715; Пропустить тренировку
            </button>
            <div className="gym-pose-feedback" style={{ color: feedback ? '#c44' : undefined }}>
              {feedback}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="gym-controls">
        <div className="gym-section-ruler">Пульт управления</div>

        {/* Barbell */}
        <div className="gym-barbell-scene">
          <div className="gym-plate-stack gym-plate-stack--left">
            {[...plates].reverse().map((sz, i) => (
              <div key={i} className={`gym-plate gym-plate--${sz}`} style={{ animationDelay: `${i * 35}ms` }} />
            ))}
          </div>
          <div className="gym-barbell-collar" />
          <div className="gym-barbell-bar" />
          <div className="gym-barbell-collar" />
          <div className="gym-plate-stack">
            {plates.map((sz, i) => (
              <div key={i} className={`gym-plate gym-plate--${sz}`} style={{ animationDelay: `${i * 35}ms` }} />
            ))}
          </div>
        </div>

        <div className="gym-weight-comment" style={{ color: weightInfo.color || undefined }}>
          {weightInfo.label.split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && weightInfo.label.includes('\n') && <br />}</span>
          ))}
        </div>

        {/* Slider */}
        <div className="gym-slider-row">
          <span className="gym-slider-cap">0</span>
          <input
            type="range"
            className="gym-range"
            min={0}
            max={9999}
            value={weight}
            onChange={e => onWeight(Number(e.target.value))}
            style={{ '--wp': sliderPct } as React.CSSProperties}
          />
          <span className="gym-slider-cap gym-slider-cap--r">9999</span>
          <span className="gym-weight-readout">{weight.toLocaleString('ru-RU')} кг</span>
        </div>

      </div>
    </div>
  )
}
