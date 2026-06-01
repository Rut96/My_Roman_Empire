import { useEffect } from 'react'
import { asset } from '../../utils/asset'
import './DonutArchive.css'

interface Props { onClose: () => void }

const DONUT_PHOTOS = [
  'anya_fun/child/9_VJiumboajZHi0BYEEsyaE1xuxOkaJK0eS95WLF6h4fmX0KxjZTOqRbncLrFdx74UScVGo5.jpg',
  'anya_fun/child/anya_and_sveta.jpg',
  'anya_fun/child/anya_condemnation.jpg',
  'anya_fun/child/anya_hunting.jpg',
  'anya_fun/child/anya_school.jpg',
  'anya_fun/child/anya_with_family_close.jpg',
  'anya_fun/child/anya_with_family.jpg',
  'anya_fun/child/little_anya_and_rock.jpg',
  'anya_fun/child/teen.jpg',
  'anya_fun/child/teen2.jpg',
  'anya_fun/cringe/crazy_face.jpg',
  'anya_fun/cringe/deamon_face_3.jpg',
  'anya_fun/cringe/demon_face_2.jpg',
  'anya_fun/cringe/demon_face.jpg',
  'anya_fun/cringe/disgust_and_surprise.jpg',
  'anya_fun/cringe/disgust_face.jpg',
  'anya_fun/cringe/funny_face.jpg',
  'anya_fun/cringe/with_cigarette.jpg',
  'anya_fun/dark_estetic_photo/AW0yx9f8I3ZqnKo-5WLEO6QfIUqkrcL3yDraL2Zb6ttlDTUFfe-xV5F08i4xU7m3-J4NCfE5.jpg',
  'anya_fun/dark_estetic_photo/DYjQQw6-GpvD-ukZp9tAATVnWs94kfg3ZaOzXkos9X09fO7dqwM8c-mOxhKYGbiKunjOJ3Su.jpg',
  'anya_fun/dark_estetic_photo/KAqhG5Z67Hhmqo5u2vO7cpwcghjpvE7Ev_yLb5Es6LfOyAf-pW0GQ8EO5euxjv6JLr4LayH4.jpg',
  'anya_fun/dark_estetic_photo/t5Qq-Z3Se6WieXsXrTKFokEJQQvKmK24XllVBkO3GcsrwUDqx1jiTbq1igo_UmHU6McnvJS-.jpg',
  'anya_fun/dark_estetic_photo/ybTeEQ_SQPkXsrqOw2i9pEyXLmBE08dx2dcbRrdr7Fi7wwbIlfoAqLt6Jjre71ZzSY2T5tQd.jpg',
  'anya_fun/face/rat.jpg',
  'anya_fun/face/satisfaid.jpg',
  'anya_fun/face/sweety.jpg',
  'anya_fun/face/tired_unhappy.jpg',
]

export function DonutArchive({ onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="donut-archive-backdrop" onClick={onClose}>
      <div className="donut-archive" onClick={e => e.stopPropagation()}>
        <button className="donut-archive-close" onClick={onClose}>✕</button>
        <h2 className="donut-archive-title">🍩 Архив пышек</h2>
        <p className="donut-archive-subtitle">Засекреченные материалы</p>
        <div className="donut-archive-grid">
          {DONUT_PHOTOS.map((src, i) => (
            <div key={i} className="donut-archive-cell">
              <img src={asset(src)} alt="" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
