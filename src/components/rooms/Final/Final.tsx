import { useState, useRef, useEffect } from 'react'
import { asset } from '../../../utils/asset'
import './Final.css'

const LETTER_PARAGRAPHS: { text: string; greeting?: boolean }[] = [
  { text: 'Ань.', greeting: true },
  { text: 'Мы знакомы столько, сколько я себя помню. Я правда не могу вспомнить себя без тебя — ты есть в каждом детском воспоминании, в каждом подростковом, в каждом сейчас.' },
  { text: 'И при этом совсем не чувствуется, что прошло столько лет — с тобой время идёт как-то иначе.' },
  { text: 'Спасибо, что ты выросла именно такой. Сильной, странной, утончённой — такой, какой никто кроме тебя быть не умеет. В тебе есть что-то благородное и тёплое одновременно, и это редкое сочетание.' },
  { text: 'Спасибо, что разрешаешь мне быть рядом всё это время и видеть, как ты становишься собой — всё больше и больше с каждым годом.' },
  { text: 'Пусть этот год будет к тебе добрым. Пусть растёт всё, что ты растишь — твой будущий сад, мышцы, мечты, спокойствие.' },
  { text: 'Пусть будет меньше Excel и больше леса (я опять буду на дереве, ты знаешь).' },
  { text: 'И помни: сколько бы ни появлялось у нас новых друзей — главная всё равно ты. Это не обсуждается. Это уже как факт из учебника.' },
]

export function Final() {
  const [letterParasVisible, setLetterParasVisible] = useState<boolean[]>(
    new Array(LETTER_PARAGRAPHS.length).fill(false)
  )
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([])

  const exhibitRef  = useRef<HTMLDivElement>(null)
  const annRef      = useRef<HTMLDivElement>(null)
  const transRef    = useRef<HTMLDivElement>(null)
  const letterRef   = useRef<HTMLDivElement>(null)
  const loveRef     = useRef<HTMLDivElement>(null)
  const certRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections: [string, React.RefObject<HTMLDivElement | null>][] = [
      ['exhibit', exhibitRef],
      ['ann', annRef],
      ['trans', transRef],
      ['letter', letterRef],
      ['love', loveRef],
      ['cert', certRef],
    ]
    const observers = sections.map(([key, ref]) => {
      if (!ref.current) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          setVisible(v => ({ ...v, [key]: true }))
          if (key === 'trans') spawnParticles()
          if (key === 'letter') revealLetter()
        },
        { threshold: 0.15 }
      )
      obs.observe(ref.current)
      return obs
    })
    return () => {
      observers.forEach(o => o?.disconnect())
      timeoutIds.current.forEach(id => clearTimeout(id))
      const container = document.getElementById('fv2Particles')
      if (container) container.innerHTML = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const spawnParticles = () => {
    const container = document.getElementById('fv2Particles')
    if (!container || container.children.length > 0) return
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div')
      p.className = 'fv2-particle'
      p.style.left = Math.random() * 100 + '%'
      p.style.bottom = '0'
      p.style.animation = `fv2FloatUp ${3 + Math.random() * 3}s ${Math.random() * 2.5}s ease infinite`
      container.appendChild(p)
    }
  }

  const revealLetter = () => {
    LETTER_PARAGRAPHS.forEach((_, i) => {
      const id = setTimeout(() => {
        setLetterParasVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, i * 280)
      timeoutIds.current.push(id)
    })
  }

  const handleSaveCert = () => {
    const link = document.createElement('a')
    link.download = 'anya-certificate.png'
    link.href = asset('сертификат2.png')
    link.click()
  }

  return (
    <div className="final-v2">

      {/* Header */}
      <div className="fv2-header">
        <h2 className="fv2-title">Финальный зал</h2>
        <p className="fv2-subtitle">зал завершения экспозиции · вход свободный</p>
      </div>

      {/* Exhibit */}
      <div ref={exhibitRef} className={`fv2-exhibit${visible.exhibit ? ' fv2--visible' : ''}`}>
        <div className="fv2-wooden-frame">
          <img src={asset('anya_fun/anya_car.jpg')} alt="Аня" className="fv2-frame-photo" />
        </div>
        <div className="fv2-nameplate">
          <div className="fv2-plate-kicker">Постоянная экспозиция · бесценный экспонат</div>
          <div className="fv2-plate-title">Аня</div>
          <div className="fv2-plate-sub">Экспонат № 001 · Категория: незаменимое</div>
        </div>
      </div>

      {/* Shelf */}
      <div className="fv2-shelf" />

      {/* Announcement */}
      <div className="fv2-announcement-wrap">
        <div ref={annRef} className={`fv2-announcement${visible.ann ? ' fv2--visible' : ''}`}>
          <div className="fv2-corner fv2-corner--tl" />
          <div className="fv2-corner fv2-corner--tr" />
          <div className="fv2-corner fv2-corner--bl" />
          <div className="fv2-corner fv2-corner--br" />
          <div className="fv2-ann-header">
            <div className="fv2-kicker">Внутренний документ</div>
            <div className="fv2-ann-title">Объявление<br />администрации музея</div>
          </div>
          <div className="fv2-rule" />
          <div className="fv2-ann-body">
            Сегодня главному экспонату исполняется <strong>29 лет</strong>.<br /><br />
            За этот срок объект: освоил шпагат, выжил в рекламе, прочитал
            слишком много манги, начал тягать веса, мечтает о собственном саде
            с растениями — и при всём этом остаётся <em>невозможно элегантным</em>.<br /><br />
            Музей подтверждает: экспонат функционирует исправно, обладает
            повышенной ценностью и переводу в другие коллекции <strong>не подлежит</strong>.
          </div>
          <div className="fv2-ann-seal">
            <span>— Администрация музея</span>
            <span>02.06.2026</span>
          </div>
        </div>
      </div>

      {/* Transition */}
      <div ref={transRef} className={`fv2-transition${visible.trans ? ' fv2--visible' : ''}`}>
        <div className="fv2-particles" id="fv2Particles" />
        <p className="fv2-transition-text">А теперь — не от музея. От меня.</p>
      </div>

      {/* Letter */}
      <div className="fv2-letter-wrap">
        <div ref={letterRef} className={`fv2-letter${visible.letter ? ' fv2--visible' : ''}`}>
          <div className="fv2-letter-body">
            {LETTER_PARAGRAPHS.map((para, i) =>
              para.greeting ? (
                <span
                  key={i}
                  className={`fv2-letter-p fv2-letter-greeting${letterParasVisible[i] ? ' fv2-letter-p--visible' : ''}`}
                >
                  {para.text}
                </span>
              ) : (
                <p
                  key={i}
                  className={`fv2-letter-p${letterParasVisible[i] ? ' fv2-letter-p--visible' : ''}`}
                >
                  {para.text}
                </p>
              )
            )}
          </div>
          <div className="fv2-coffee-stain" />
        </div>
      </div>

      {/* Love */}
      <div className="fv2-love-wrap">
        <div ref={loveRef}>
          <div className={`fv2-love-text${visible.love ? ' fv2--visible' : ''}`}>Я люблю тебя.</div>
          <div className={`fv2-love-line${visible.love ? ' fv2--visible' : ''}`}>С днём рождения.</div>
        </div>
      </div>

      {/* Certificate */}
      <div className="fv2-cert-wrap">
        <div ref={certRef} className={`fv2-cert-img-wrap${visible.cert ? ' fv2--visible' : ''}`}>
          <img
            src={asset('сертификат2.png')}
            alt="Сертификат легенды"
            className="fv2-cert-img"
          />
        </div>

        <div className="fv2-buttons">
          <button className="fv2-btn fv2-btn--download" onClick={handleSaveCert}>↓ Скачать сертификат</button>
        </div>
      </div>

    </div>
  )
}
