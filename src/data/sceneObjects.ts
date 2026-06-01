export type SceneObjectType = 'door' | 'object' | 'photo'

export interface SceneObject {
  id: string
  type: SceneObjectType
  x: number      // vw from center (0 = center)
  y: number      // vh from center (0 = center)
  depth: number  // parallax multiplier
  rotation: number
  scale?: number
  flip?: boolean // mirror image horizontally
  // For type === 'door'
  folder?: string
  arch?: string
  sash?: string
  label?: string
  // For type === 'object' | 'photo'
  src?: string
  cursor?: string
}

export const SCENE_OBJECTS: SceneObject[] = [
  // ── DOORS ──
  { id: 'kindergarten', type: 'door', folder: 'kindergarten',
    arch: 'door_kendergarten_arch.png', sash: 'door_kendergarten_sashes.png',
    x: -32, y: -18, depth: 2, rotation: -3, label: 'Садик' },

  { id: 'truancy', type: 'door', folder: 'truancy',
    arch: 'door_truancy_arch.png', sash: 'door_truancy_sashes.png',
    x: 28, y: -22, depth: 2, rotation: 2, label: 'Прогулы' },

  { id: 'garden', type: 'door', folder: 'garden',
    arch: 'door_garden_arch.png', sash: 'door_garden_leaves.png',
    x: -26, y: 20, depth: 2, rotation: -2, label: 'Сад мечты' },

  { id: 'sport', type: 'door', folder: 'sport',
    arch: 'door_sport_arch.png', sash: 'door_sport_sashes.png',
    x: 36, y: 8, depth: 2, rotation: 3, label: 'Спортзал' },

  { id: 'final', type: 'door', folder: 'final',
    arch: 'door_final_arch.png', sash: 'door_final_sash.png',
    x: 4, y: 26, depth: 2, rotation: 1, label: 'Финал' },

  // ── FLOATING OBJECTS ──
  { id: 'manga', type: 'object', src: 'anya_full/manga.png',
    x: -22, y: -22, depth: 3.5, rotation: -8, scale: 0.9, cursor: 'bookstore' },

  { id: 'donut', type: 'object', src: 'anya_full/donut.png',
    x: 22, y: -22, depth: 3, rotation: -12, scale: 0.9, flip: true, cursor: 'veggie' },

  // ── PHOTOS ──
  { id: 'p_together', type: 'photo', src: 'our_photos/adult/together.jpg',
    x: -44, y: 5, depth: 2.5, rotation: -6, scale: 0.42 },

  { id: 'p_bar', type: 'photo', src: 'our_photos/adult/in_the_bar.jpg',
    x: 42, y: -12, depth: 2.5, rotation: 5, scale: 0.38 },

  { id: 'p_masks', type: 'photo', src: 'our_photos/adult/with_mask_on.jpg',
    x: -14, y: 34, depth: 2.5, rotation: -3, scale: 0.4 },

  { id: 'p_disco', type: 'photo', src: 'our_photos/teen/on_disco.jpg',
    x: 18, y: 32, depth: 2.5, rotation: 7, scale: 0.36 },

  { id: 'p_sleeping', type: 'photo', src: 'our_photos/adult/anya_and_me_sleeping.jpg',
    x: -36, y: -32, depth: 2, rotation: -9, scale: 0.33 },
]
