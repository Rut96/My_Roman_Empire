import { forwardRef } from 'react'
import { asset } from '../../utils/asset'
import type { SceneObject } from '../../data/sceneObjects'
import './Door.css'

type Props = Pick<SceneObject, 'folder' | 'arch' | 'sash' | 'x' | 'y' | 'rotation' | 'label' | 'id'>
  & { onClick?: (id: string) => void; isOpen?: boolean; gallery?: boolean }

export const Door = forwardRef<HTMLDivElement, Props>(
  ({ folder, arch, sash, x, y, rotation, label, id, onClick, isOpen, gallery }, ref) => {
    const archSrc = asset(`doors/${folder}/${arch}`)
    const sashSrc = asset(`doors/${folder}/${sash}`)

    return (
      <div
        ref={ref}
        className={`door-wrapper${gallery ? ' door-wrapper--gallery' : ''}`}
        data-label={label}
        style={gallery ? undefined : {
          left:      `calc(50% + ${x}vw)`,
          top:       `calc(50% + ${y}vh)`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        }}
        onClick={() => onClick?.(id!)}
      >
        <div className={`door-sashes${isOpen ? ' door-open' : ''}`}>
          <div className="door-half door-left">
            <img src={sashSrc} alt="" draggable={false} style={{ objectPosition: 'left' }} />
          </div>
          <div className="door-half door-right">
            <img src={sashSrc} alt="" draggable={false} style={{ objectPosition: 'right' }} />
          </div>
        </div>

        <img src={archSrc} alt="" draggable={false} className="door-arch" />

      </div>
    )
  }
)
Door.displayName = 'Door'
