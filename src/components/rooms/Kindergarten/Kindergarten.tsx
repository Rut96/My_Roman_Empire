import { asset } from '../../../utils/asset'
import './Kindergarten.css'

export function Kindergarten() {
  return (
    <div className="kinder-hall">

      <header className="kh-header">
        <span className="kh-num">Зал № I &nbsp;·&nbsp; Постоянная экспозиция &nbsp;·&nbsp; Раздел «Биография»</span>
        <h1 className="kh-title">Ранние годы</h1>
        <p className="kh-subtitle">Детство. Садик и начальная школа. Отбор материала осуществлён исследовательской группой.</p>
        <div className="kh-ornament">✦&nbsp;&nbsp;✦&nbsp;&nbsp;✦</div>
      </header>

      <div className="kh-exhibits">

        {/* ── ROW 1: Садик ── */}
        <div className="kh-row">
          <div className="kh-gallery">
            <div className="kh-fw kh-fw--main">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/child/anya_with_family.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.1-A</div>
            </div>
            <div className="kh-fw kh-fw--sub1">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/child/little_anya_and_rock.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.1-B</div>
            </div>
            <div className="kh-fw kh-fw--sub2">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/child/anya_and_sveta.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.1-C</div>
            </div>
          </div>

          <div className="kh-pm">
            <div className="kh-pp">
              <span className="kh-pid">Инв. № RM-1.1 &nbsp;·&nbsp; Досадик / Садик</span>
              <div className="kh-ptitle">Фигурант в естественной среде</div>
              <div className="kh-pattr">~0–3 лет &nbsp;·&nbsp; Ранний период &nbsp;·&nbsp; Сохранность: хорошая</div>
              <div className="kh-pmed">Фотография. Желатиново-серебряный отпечаток. 3 ед.</div>
              <span className="kh-prule" />
              <p className="kh-pdesc">Статус: выживала самостоятельно. До знакомства с подругой.</p>
              <div className="kh-pacc">
                <span>Пост. 1997–2000</span>
                <span>Зал I · Витрина 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Переходный период (reversed) ── */}
        <div className="kh-row">
          <div className="kh-gallery kh-gallery--two">
            <div className="kh-fw kh-fw--main">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/child/anya_school copy.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.2-A</div>
            </div>
            <div className="kh-fw kh-fw--sub1">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/child/anya_condemnation.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.2-B</div>
            </div>
          </div>

          <div className="kh-pm" style={{ transform: 'rotate(-0.3deg)' }}>
            <div className="kh-pp">
              <span className="kh-pid">Инв. № RM-1.2 &nbsp;·&nbsp; Переходный период</span>
              <div className="kh-ptitle">Артефакт неустановленного происхождения</div>
              <div className="kh-pattr">~7–15 лет &nbsp;·&nbsp; Кринж-эпоха &nbsp;·&nbsp; Доступ: ограничен</div>
              <div className="kh-pmed">Фотодокумент. Происхождение: засекречено. 2 ед.</div>
              <span className="kh-prule" />
              <p className="kh-pdesc">Классификация: засекречено. Данные частично уничтожены.</p>
              <div className="kh-pacc">
                <span>Пост. ~2004–2012</span>
                <span>Зал I · Витрина 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 3: Ранняя школа ── */}
        <div className="kh-row">
          <div className="kh-gallery">
            <div className="kh-fw kh-fw--main">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/dark_estetic_photo/KAqhG5Z67Hhmqo5u2vO7cpwcghjpvE7Ev_yLb5Es6LfOyAf-pW0GQ8EO5euxjv6JLr4LayH4.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.3-A</div>
            </div>
            <div className="kh-fw kh-fw--sub1">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/child/teen.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.3-B</div>
            </div>
            <div className="kh-fw kh-fw--sub2">
              <div className="kh-frame">
                <div className="kh-fi">
                  <img src={asset('anya_fun/child/teen2.jpg')} alt="" draggable={false} />
                </div>
              </div>
              <div className="kh-fc">Инв. 1.3-C</div>
            </div>
          </div>

          <div className="kh-pm" style={{ transform: 'rotate(0.6deg)' }}>
            <div className="kh-pp">
              <span className="kh-pid">Инв. № RM-1.3 &nbsp;·&nbsp; Ранняя школа</span>
              <div className="kh-ptitle">Формирование эстетики</div>
              <div className="kh-pattr">~15–∞ лет &nbsp;·&nbsp; Критический этап &nbsp;·&nbsp; Дар музею</div>
              <div className="kh-pmed">Фотодокумент. Смешанная техника. Школьный период. 3 ед.</div>
              <span className="kh-prule" />
              <p className="kh-pdesc">Достижения: тёмная эстетика обнаружена. Экспонат приобретает форму.</p>
              <div className="kh-pacc">
                <span>Пост. ~2006–2008</span>
                <span>Зал I · Витрина 3</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <footer className="kh-quote">
        <span className="kh-qdeco">❝</span>
        <p className="kh-qtext">
          обнаружено в культурном слое.<br />
          <em>возраст установить не представляется возможным.</em><br />
          ценность — бесценна.
        </p>
      </footer>

    </div>
  )
}
