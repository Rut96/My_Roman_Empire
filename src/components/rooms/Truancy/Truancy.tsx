import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BOOKS, type BookEntry } from '../../../data/books'
import { asset } from '../../../utils/asset'
import './Truancy.css'

function lighten(hex: string, amt: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`
}

// ── Shared card content (rendered both on board and in popup) ─────────────────

function FolderContent() {
  return <>
    <span className="tr-tape tr-tape--wide" style={{ transform: 'translateX(10px) rotate(3deg)', margin: '0 0 -4px 0' }} />
    <div className="tr-folder-tab" />
    <div className="tr-folder-body">
      <div className="tr-folder-label">Дело № ПРГ-2019 · Материалы</div>
      <div className="tr-folder-title">Буквоед и Пышечная: хроника пропавшего учебного дня</div>
      <div className="tr-folder-sticker">не трогать</div>
    </div>
  </>
}

function MiniNoteContent() {
  return <>
    <span className="tr-tape tr-tape--narrow" style={{ margin: '0 auto -5px' }} />
    <div className="tr-mini-note-body">явились<br/>на третий день</div>
  </>
}

function MapSvg() {
  return (
    <svg viewBox="0 0 308 210" xmlns="http://www.w3.org/2000/svg" width="308" height="210">
      <defs>
        <filter id="tr-line-rough">
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" seed="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <marker id="tr-arrow-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L7,3 Z" fill="#C8922A" opacity="0.9"/>
        </marker>
        <radialGradient id="tr-vign" cx="50%" cy="50%" r="72%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(90,58,18,0.2)"/>
        </radialGradient>
      </defs>
      <rect width="308" height="210" fill="#EDE0C0"/>
      <rect width="308" height="210" fill="rgba(160,120,60,0.05)"/>
      <rect width="308" height="210" fill="url(#tr-vign)"/>
      <rect x="0" y="0" width="308" height="22" fill="rgba(80,52,18,0.1)"/>
      <text x="154" y="15" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="4" fill="rgba(70,44,12,0.6)">СХЕМА МАРШРУТА</text>
      <line x1="10" y1="22" x2="298" y2="22" stroke="rgba(110,75,25,0.2)" strokeWidth="0.8"/>
      <line x1="56"  y1="24" x2="56"  y2="196" stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <line x1="110" y1="24" x2="110" y2="196" stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <line x1="168" y1="24" x2="168" y2="196" stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <line x1="222" y1="24" x2="222" y2="196" stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <line x1="276" y1="24" x2="276" y2="196" stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <line x1="10" y1="68"  x2="298" y2="68"  stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <line x1="10" y1="110" x2="298" y2="110" stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <line x1="10" y1="152" x2="298" y2="152" stroke="rgba(110,80,30,0.13)" strokeWidth="1"/>
      <text x="83"  y="183" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="rgba(90,62,22,0.4)" letterSpacing="0.5">ул. Лиговская</text>
      <text x="195" y="183" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="rgba(90,62,22,0.4)" letterSpacing="0.5">Садовая ул.</text>
      <text x="22"  y="96"  textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="5.5" fill="rgba(90,62,22,0.35)" transform="rotate(-90,22,96)">Невский пр.</text>
      <polygon points="218,30 287,30 252,22" fill="rgba(90,60,20,0.14)" stroke="rgba(90,60,20,0.28)" strokeWidth="0.8"/>
      <rect x="222" y="30" width="62" height="32" rx="1" fill="rgba(90,60,20,0.1)" stroke="rgba(90,60,20,0.25)" strokeWidth="0.8"/>
      <line x1="232" y1="30" x2="232" y2="62" stroke="rgba(90,60,20,0.16)" strokeWidth="0.8"/>
      <line x1="242" y1="30" x2="242" y2="62" stroke="rgba(90,60,20,0.16)" strokeWidth="0.8"/>
      <line x1="253" y1="30" x2="253" y2="62" stroke="rgba(90,60,20,0.16)" strokeWidth="0.8"/>
      <line x1="264" y1="30" x2="264" y2="62" stroke="rgba(90,60,20,0.16)" strokeWidth="0.8"/>
      <text x="253" y="76" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="14" fill="rgba(70,46,14,0.5)">учёба</text>
      <line x1="216" y1="18" x2="292" y2="82" stroke="rgba(148,28,18,0.78)" strokeWidth="3.5" strokeLinecap="round" filter="url(#tr-line-rough)"/>
      <line x1="292" y1="18" x2="216" y2="82" stroke="rgba(148,28,18,0.78)" strokeWidth="3.5" strokeLinecap="round" filter="url(#tr-line-rough)"/>
      <rect x="12" y="74" width="38" height="30" rx="1" fill="rgba(70,44,14,0.13)" stroke="rgba(70,44,14,0.3)" strokeWidth="0.8"/>
      <rect x="16" y="74" width="30" height="5" fill="rgba(160,105,30,0.38)"/>
      <rect x="17" y="80" width="8" height="12" rx="0.5" fill="rgba(70,44,14,0.1)" stroke="rgba(70,44,14,0.22)" strokeWidth="0.5"/>
      <rect x="29" y="80" width="8" height="12" rx="0.5" fill="rgba(70,44,14,0.1)" stroke="rgba(70,44,14,0.22)" strokeWidth="0.5"/>
      <circle cx="31" cy="106" r="5.5" fill="rgba(190,136,38,0.3)" stroke="rgba(190,136,38,0.65)" strokeWidth="1.2"/>
      <circle cx="31" cy="106" r="2.5" fill="#C8922A" opacity="0.88"/>
      <text x="31" y="125" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="17" fill="rgba(50,30,8,0.85)" fontWeight="600">Буквоед</text>
      <text x="31" y="137" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="5.5" fill="rgba(90,60,18,0.52)" letterSpacing="1.8">СТАРТ</text>
      <rect x="252" y="82" width="42" height="28" rx="2" fill="rgba(150,70,22,0.13)" stroke="rgba(150,70,22,0.32)" strokeWidth="0.8"/>
      <rect x="252" y="82" width="42" height="5" fill="rgba(195,90,32,0.4)"/>
      <rect x="258" y="88" width="9" height="12" rx="4" fill="rgba(150,70,22,0.14)" stroke="rgba(150,70,22,0.25)" strokeWidth="0.5"/>
      <rect x="274" y="90" width="11" height="14" rx="0.5" fill="rgba(150,70,22,0.1)" stroke="rgba(150,70,22,0.22)" strokeWidth="0.5"/>
      <line x1="273" y1="110" x2="273" y2="95" stroke="rgba(190,136,38,0.65)" strokeWidth="1.1"/>
      <polygon points="273,95 283,98 273,101" fill="rgba(200,146,42,0.75)"/>
      <circle cx="273" cy="113" r="6"   fill="rgba(200,146,42,0.3)"  stroke="rgba(200,146,42,0.72)" strokeWidth="1.4"/>
      <circle cx="273" cy="113" r="2.8" fill="#D4A060" opacity="0.92"/>
      <text x="273" y="131" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="15" fill="rgba(50,30,8,0.85)" fontWeight="600">Пышечная №1</text>
      <text x="273" y="143" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="5.5" fill="rgba(90,60,18,0.52)" letterSpacing="1.8">ФИНИШ</text>
      <path d="M 36,106 C 55,100 68,116 92,108 C 110,102 122,117 145,110 C 163,104 172,116 196,110 C 214,106 226,108 262,113"
            stroke="rgba(200,146,42,0.16)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M 36,106 C 55,100 68,116 92,108 C 110,102 122,117 145,110 C 163,104 172,116 196,110 C 214,106 226,108 262,113"
            stroke="#C8922A" strokeWidth="2.6" fill="none" strokeLinecap="round"
            markerEnd="url(#tr-arrow-gold)" filter="url(#tr-line-rough)" opacity="0.88"/>
      <circle cx="92"  cy="108" r="2.2" fill="rgba(200,146,42,0.6)" stroke="rgba(200,146,42,0.8)" strokeWidth="0.8"/>
      <circle cx="145" cy="110" r="2.2" fill="rgba(200,146,42,0.6)" stroke="rgba(200,146,42,0.8)" strokeWidth="0.8"/>
      <circle cx="196" cy="110" r="2.2" fill="rgba(200,146,42,0.6)" stroke="rgba(200,146,42,0.8)" strokeWidth="0.8"/>
      <text x="150" y="97" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="13" fill="rgba(50,30,8,0.45)" transform="rotate(-3,150,97)">культурный маршрут</text>
      <path d="M 50,104 Q 90,80 216,55" stroke="rgba(148,28,18,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="4,5"/>
      <text x="142" y="72" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="10" fill="rgba(148,28,18,0.32)" transform="rotate(-18,142,72)">не сложилось →</text>
      <g transform="translate(15,162)" opacity="0.42">
        <circle cx="10" cy="10" r="9" fill="none" stroke="rgba(70,44,12,0.38)" strokeWidth="0.8"/>
        <line x1="10" y1="1.5" x2="10" y2="18.5" stroke="rgba(70,44,12,0.45)" strokeWidth="0.8"/>
        <line x1="1.5" y1="10" x2="18.5" y2="10" stroke="rgba(70,44,12,0.45)" strokeWidth="0.8"/>
        <polygon points="10,1.5 7.8,9 12.2,9" fill="rgba(70,44,12,0.55)"/>
        <text x="10" y="27" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="rgba(70,44,12,0.48)">С</text>
      </g>
      <line x1="10" y1="197" x2="298" y2="197" stroke="rgba(110,75,25,0.18)" strokeWidth="0.8"/>
      <text x="154" y="206" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill="rgba(90,62,22,0.4)" letterSpacing="1.5">время в пути: весь день · учёба: 0 ч</text>
    </svg>
  )
}

function WallFrameContent() {
  return <>
    <div className="tr-frame-mount">
      <div className="tr-frame-outer">
        <span className="tr-frame-corner tr-frame-corner--tr">◆</span>
        <span className="tr-frame-corner tr-frame-corner--bl">◆</span>
        <div className="tr-frame-inner">
          <MapSvg />
        </div>
      </div>
    </div>
    <div className="tr-frame-caption">Инв. МАП-01 · Реконструкция маршрута · 2019</div>
  </>
}

function YellowNoteContent() {
  return <>
    <span className="tr-tape tr-tape--narrow" />
    <div className="tr-note-body">местонахождение:<br/>неизвестно,<br/>но пахнет<br/>пышками</div>
  </>
}

function FormContent() {
  return <>
    <span className="tr-tape" style={{ margin: '0 auto -5px 18px', transform: 'rotate(2deg)' }} />
    <div className="tr-form-body">
      <span className="tr-form-id">Форма КУЛ-03 · Утверждена ОТК</span>
      <p className="tr-form-heading">Акт о прогуле</p>
      <div className="tr-form-row">
        <span className="tr-form-label">Дата:</span>
        <span className="tr-form-line" />
      </div>
      <div className="tr-form-row">
        <span className="tr-form-label">Место:</span>
        <span className="tr-form-filled">Буквоед / Пышечная</span>
      </div>
      <div className="tr-form-checks">
        <div className="tr-form-check">
          <span className="tr-check-box tr-check-box--on">✗</span>
          <span className="tr-check-text tr-check-text--on">культурная необходимость</span>
        </div>
        <div className="tr-form-check">
          <span className="tr-check-box">○</span>
          <span className="tr-check-text">форс-мажор</span>
        </div>
        <div className="tr-form-check">
          <span className="tr-check-box">○</span>
          <span className="tr-check-text">другое (см. объяснение)</span>
        </div>
      </div>
      <span className="tr-form-stamp">ПОДТВЕРЖДЕНО</span>
    </div>
  </>
}

function ReceiptContent() {
  return <>
    <span className="tr-tape" />
    <div className="tr-receipt-body">
      <span className="tr-receipt-brand">Пышечная №1</span>
      <div className="tr-receipt-lines">2 пышки.<br/>сахарная пудра.<br/>культурное<br/>развитие.</div>
      <div className="tr-receipt-total"><span>итого</span><span>∞</span></div>
      <span className="tr-receipt-rubber">уплачено</span>
    </div>
  </>
}

// ── Popup zoom factors per card ───────────────────────────────────────────────
const PROP_ZOOM: Record<string, number> = {
  folder:    2,
  'mini-note': 2.2,
  map:       1.6,
  'yellow-note': 1.8,
  form:      1.8,
  receipt:   2.2,
}

function PropPopupContent({ id }: { id: string }) {
  switch (id) {
    case 'folder':      return <div className="tr-prop-popup-inner tr-case-file-popup"><FolderContent /></div>
    case 'mini-note':   return <div className="tr-prop-popup-inner tr-mini-note-popup"><MiniNoteContent /></div>
    case 'map':         return <div className="tr-prop-popup-inner tr-wall-frame-popup"><WallFrameContent /></div>
    case 'yellow-note': return <div className="tr-prop-popup-inner tr-yellow-note-popup"><YellowNoteContent /></div>
    case 'form':        return <div className="tr-prop-popup-inner tr-form-popup"><FormContent /></div>
    case 'receipt':     return <div className="tr-prop-popup-inner tr-receipt-popup"><ReceiptContent /></div>
    default:            return null
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export function Truancy() {
  const [selectedId, setSelectedId]   = useState<string | null>(null)
  const [shakingId, setShakingId]     = useState<string | null>(null)
  const [darkActive, setDarkActive]   = useState(false)
  const [hoveredProp, setHoveredProp] = useState<string | null>(null)
  const berserkCount = useRef(0)
  const berserkTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const namedBooks = BOOKS.filter(b => !b.isFiller)
  const selectedBook = selectedId ? (namedBooks.find(b => b.id === selectedId) ?? null) : null

  useEffect(() => () => clearTimeout(berserkTimer.current), [])

  function handleBookClick(book: BookEntry) {
    if (book.isBerserk) {
      berserkCount.current++
      clearTimeout(berserkTimer.current)
      berserkTimer.current = setTimeout(() => { berserkCount.current = 0 }, 1100)
      if (berserkCount.current >= 3) {
        berserkCount.current = 0
        setSelectedId(book.id!)
        setShakingId(book.id!)
        setTimeout(() => { setShakingId(null); setDarkActive(true) }, 780)
        return
      }
    }
    setSelectedId(book.id!)
  }

  function renderBooks() {
    return BOOKS.flatMap((book, i) => {
      const items: React.ReactNode[] = []

      if (book.gap) {
        items.push(
          <div key={`gap-${i}`} className="tr-book-gap" style={{ width: book.gap + 'px' }} />
        )
      }

      const grad = `linear-gradient(to right,${book.colorDark} 0%,${book.color} 22%,${book.color} 78%,${book.colorDark} 100%)`
      const spineStyle = {
        height: book.height + 'px',
        background: grad,
        boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.5),inset 2px 0 5px rgba(255,255,255,0.05),2px 0 6px rgba(0,0,0,0.4)',
      }

      if (book.isFiller) {
        items.push(
          <div key={`filler-${i}`} className="tr-book" style={{ width: book.width + 'px' }}>
            <div className="tr-book-spine" style={spineStyle} />
          </div>
        )
      } else {
        const cls = ['tr-book', 'tr-book--interactive']
        if (book.isBerserk) cls.push('tr-book--berserk')
        if (selectedId === book.id) cls.push('tr-book--selected')
        if (shakingId === book.id) cls.push('tr-book--shaking')

        items.push(
          <div
            key={book.id}
            className={cls.join(' ')}
            style={{ width: book.width + 'px' }}
            onClick={e => { e.stopPropagation(); handleBookClick(book) }}
          >
            <div
              className="tr-book-top"
              style={{ background: `linear-gradient(to right,${lighten(book.colorDark,10)},${lighten(book.color,18)},${lighten(book.colorDark,10)})` }}
            />
            <div className="tr-book-spine" style={spineStyle}>
              {book.titleSize && (
                <span className="tr-book-spine-title" style={{ fontSize: book.titleSize + 'px' }}>
                  {book.title}
                </span>
              )}
            </div>
            {book.bookmark && (
              <div
                className="tr-book-bookmark"
                style={{ right: Math.floor(book.width / 3) + 'px', background: book.bookmark }}
              />
            )}
          </div>
        )
      }

      return items
    })
  }

  return (
    <>
      {/* Hall header */}
      <div className="tr-hall-header">
        <span className="tr-hall-number">ЗАЛ № 2 · ПОСТОЯННАЯ ЭКСПОЗИЦИЯ</span>
        <h1 className="tr-hall-title">ПРОГУЛЫ</h1>
        <p className="tr-hall-subtitle">Маршрут: Буквоед — Пышечная №1. Учебные заведения в маршрут не входили.</p>
        <div className="tr-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
      </div>

      {/* Room scene */}
      <div className="tr-room-scene" onClick={() => setSelectedId(null)}>

        {/* Case file / folder */}
        <div
          className="tr-prop tr-case-file tr-prop--hoverable"
          onMouseEnter={() => setHoveredProp('folder')}
          onMouseLeave={() => setHoveredProp(null)}
        >
          <FolderContent />
        </div>

        {/* Mini note */}
        <div
          className="tr-prop tr-mini-note tr-prop--hoverable"
          onMouseEnter={() => setHoveredProp('mini-note')}
          onMouseLeave={() => setHoveredProp(null)}
        >
          <MiniNoteContent />
        </div>

        {/* Wall frame — route map */}
        <div
          className="tr-prop tr-wall-frame tr-prop--hoverable"
          onMouseEnter={() => setHoveredProp('map')}
          onMouseLeave={() => setHoveredProp(null)}
        >
          <WallFrameContent />
        </div>

        {/* Yellow sticky note */}
        <div
          className="tr-prop tr-yellow-note tr-prop--hoverable"
          onMouseEnter={() => setHoveredProp('yellow-note')}
          onMouseLeave={() => setHoveredProp(null)}
        >
          <YellowNoteContent />
        </div>

        {/* Official form */}
        <div
          className="tr-prop tr-official-form tr-prop--hoverable"
          onMouseEnter={() => setHoveredProp('form')}
          onMouseLeave={() => setHoveredProp(null)}
        >
          <FormContent />
        </div>

        {/* Receipt */}
        <div
          className="tr-prop tr-receipt tr-prop--hoverable"
          onMouseEnter={() => setHoveredProp('receipt')}
          onMouseLeave={() => setHoveredProp(null)}
        >
          <ReceiptContent />
        </div>

        {/* Bookshelf */}
        <div className="tr-bookshelf">
          <div className="tr-books-row">{renderBooks()}</div>
          <img src={asset('shelf.png')} alt="" className="tr-shelf-img" />
          <span className="tr-shelf-label">мы вообще-то пошли учиться</span>
        </div>

      </div>

      {/* Prop popup overlay */}
      {hoveredProp && createPortal(
        <div className="tr-prop-overlay">
          <div
            className="tr-prop-popup"
            style={{ zoom: PROP_ZOOM[hoveredProp] ?? 2 }}
          >
            <PropPopupContent id={hoveredProp} />
          </div>
        </div>,
        document.body
      )}

      {/* Book card backdrop */}
      {createPortal(
        <div
          className={`tr-book-backdrop${selectedBook ? ' tr-book-backdrop--visible' : ''}`}
          onClick={() => setSelectedId(null)}
        />,
        document.body
      )}

      {/* Book card popup — portal to stay visible regardless of scroll */}
      {createPortal(
        <div
          className={`tr-book-card${selectedBook ? ' tr-book-card--visible' : ''}`}
        >
          <span className="tr-bc-tape" />
          <div className="tr-bc-paper">
            <button className="tr-bc-close" onClick={() => setSelectedId(null)}>×</button>
            {selectedBook && (
              <>
                <span className="tr-bc-id">
                  ЗАЛ II · ЭКС. {String(namedBooks.indexOf(selectedBook) + 1).padStart(3, '0')}
                </span>
                <p className="tr-bc-title">{selectedBook.title}</p>
                <span className="tr-bc-rule" />
                <p className="tr-bc-annotation">{selectedBook.annotation}</p>
                {selectedBook.handnote && (
                  <span className="tr-bc-handnote">— {selectedBook.handnote}</span>
                )}
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Dark mode easter egg — rendered via portal to escape room stacking context */}
      {darkActive && createPortal(
        <div className="tr-dark-overlay" onClick={() => setDarkActive(false)}>
          <div className="tr-dark-msg">
            ⚠ ТЁМНЫЙ РЕЖИМ АКТИВИРОВАН
            <span className="tr-dark-sub">нажмите куда угодно, чтобы отключить</span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
