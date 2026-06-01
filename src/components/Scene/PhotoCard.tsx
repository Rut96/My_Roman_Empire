import { forwardRef } from 'react'
import { asset } from '../../utils/asset'
import type { SceneObject } from '../../data/sceneObjects'

type Props = Pick<SceneObject, 'src' | 'x' | 'y' | 'rotation' | 'scale' | 'cursor'> & {
  gallery?: boolean
}

export const PhotoCard = forwardRef<HTMLDivElement, Props>(
  ({ src, x, y, rotation, scale = 1, cursor, gallery }, ref) => (
    <div
      ref={ref}
      className={`photo-card${gallery ? ' photo-card--gallery' : ''}`}
      data-cursor={cursor}
      style={gallery ? {} : {
        left:      `calc(50% + ${x}vw)`,
        top:       `calc(50% + ${y}vh)`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
      } as React.CSSProperties}
    >
      <img src={asset(src!)} alt="" draggable={false} className="photo-card-img" />
    </div>
  )
)
PhotoCard.displayName = 'PhotoCard'
