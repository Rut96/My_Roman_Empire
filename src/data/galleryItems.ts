export type GallerySize = 'small' | 'med' | 'big' | 'door'

export interface GalleryPhoto {
  id: string
  type: 'photo'
  size: GallerySize
  y: number        // vertical offset vh (-25 to +25), set via GSAP on mount
  speed: number
  src: string
  rotation: number
  caption?: string
  catPeek?: 'left' | 'right'
}

export interface GalleryDoor {
  id: string
  type: 'door'
  size: 'door'
  y: number        // vertical offset vh
  speed: number
  folder: string
  arch: string
  sash: string
  label: string
}

export type GalleryItem = GalleryPhoto | GalleryDoor

// DEPTH:
//   FRONT  speed ≥ 1.3   → full color, moves furthest left  (closer)
//   MID    0.95–1.29     → slightly muted
//   BACK   < 0.95        → desaturated/faded, moves least   (further)
//
// Y = vertical offset in vh. Applied via gsap.set on mount.
// Negative = above center, positive = below center.

export const GALLERY_ITEMS: GalleryItem[] = [
  // ── LEFT→RIGHT ORDER = visual flow in gallery ──────────

  { id: 'g_family',          type: 'photo', size: 'big',   y: -10, speed: 1.35,
    src: 'anya_fun/child/anya_with_family.jpg',            rotation: -2, catPeek: 'right' },
  { id: 'g_child9',          type: 'photo', size: 'small', y: 12,  speed: 0.72,
    src: 'anya_fun/child/9_VJiumboajZHi0BYEEsyaE1xuxOkaJK0eS95WLF6h4fmX0KxjZTOqRbncLrFdx74UScVGo5.jpg', rotation: 5 },
  { id: 'g_disco',           type: 'photo', size: 'big',   y: -5,  speed: 1.4,
    src: 'our_photos/teen/on_disco.jpg',                   rotation: 0, catPeek: 'left' },
  { id: 'g_kinder',          type: 'door',  size: 'door',  y: 8,   speed: 0.85,
    folder: 'kindergarten', arch: 'door_kendergarten_arch.png', sash: 'door_kendergarten_sashes.png', label: 'Ранние Годы' },
  { id: 'g_classmates',      type: 'photo', size: 'med',   y: -15, speed: 0.72,
    src: 'our_photos/teen/with_ckassmates.jpg',            rotation: 2, catPeek: 'left' },
  { id: 'g_school',          type: 'photo', size: 'small', y: 18,  speed: 1.05,
    src: 'anya_fun/child/anya_school.jpg',                 rotation: -3 },
  { id: 'g_bar',             type: 'photo', size: 'big',   y: -8,  speed: 1.35,
    src: 'our_photos/adult/in_the_bar.jpg',                rotation: 0, catPeek: 'right' },
  { id: 'g_cringe',          type: 'photo', size: 'med',   y: 5,   speed: 1.35,
    src: 'our_photos/teen/cringe.jpg',                     rotation: -4 },
  { id: 'g_condemnation',    type: 'photo', size: 'small', y: -18, speed: 0.7,
    src: 'anya_fun/child/anya_condemnation.jpg',           rotation: -6 },
  { id: 'g_rock',            type: 'photo', size: 'small', y: 18,  speed: 0.68,
    src: 'anya_fun/child/little_anya_and_rock.jpg',        rotation: 6 },
  { id: 'g_cringe2',         type: 'photo', size: 'small', y: -5,  speed: 1.1,
    src: 'our_photos/teen/cringe_2.jpg',                   rotation: 3 },
  { id: 'g_dasha',           type: 'photo', size: 'med',   y: -14, speed: 1.35,
    src: 'our_photos/adult/anya_me_and_dasha.jpg',         rotation: -3 },
  { id: 'g_truancy',         type: 'door',  size: 'door',  y: 10,  speed: 0.9,
    folder: 'truancy', arch: 'door_truancy_arch.png', sash: 'door_truancy_sashes.png', label: 'Прогулы' },
  { id: 'g_with_cigarette',  type: 'photo', size: 'small', y: 15,  speed: 0.72,
    src: 'anya_fun/cringe/with_cigarette.jpg',             rotation: -3 },
  { id: 'g_bukvoed',         type: 'photo', size: 'big',   y: -10, speed: 1.45,
    src: 'bukvoed_photo/we_reading.png',                   rotation: 0, catPeek: 'right' },
  { id: 'g_disgust_surprise',type: 'photo', size: 'small', y: -3,  speed: 1.05,
    src: 'anya_fun/cringe/disgust_and_surprise.jpg',       rotation: -4 },
  { id: 'g_teen',            type: 'photo', size: 'small', y: 0,   speed: 1.05,
    src: 'anya_fun/child/teen.jpg',                        rotation: -4 },
  { id: 'g_sleeping',        type: 'photo', size: 'small', y: -18, speed: 1.3,
    src: 'our_photos/adult/anya_and_me_sleeping.jpg',      rotation: 3 },
  { id: 'g_crazy',           type: 'photo', size: 'med',   y: 14,  speed: 1.3,
    src: 'anya_fun/cringe/crazy_face.jpg',                 rotation: 4 },
  { id: 'g_teen2',           type: 'photo', size: 'small', y: -18, speed: 1.0,
    src: 'anya_fun/child/teen2.jpg',                       rotation: 4 },
  { id: 'g_shelves',         type: 'photo', size: 'small', y: 8,   speed: 0.65,
    src: 'bukvoed_photo/shelves_bl.png',                   rotation: 2 },
  { id: 'g_demon1',          type: 'photo', size: 'med',   y: -12, speed: 1.35,
    src: 'anya_fun/cringe/demon_face.jpg',                 rotation: -3, catPeek: 'left' },
  { id: 'g_masks',           type: 'photo', size: 'small', y: 15,  speed: 1.2,
    src: 'our_photos/adult/with_mask_on.jpg',              rotation: -2 },
  { id: 'g_garden',          type: 'door',  size: 'door',  y: -5,  speed: 0.9,
    folder: 'garden', arch: 'door_garden_arch.png', sash: 'door_garden_leaves.png', label: 'Сад мечты' },
  { id: 'g_dark1',           type: 'photo', size: 'small', y: -15, speed: 0.72,
    src: 'anya_fun/dark_estetic_photo/AW0yx9f8I3ZqnKo-5WLEO6QfIUqkrcL3yDraL2Zb6ttlDTUFfe-xV5F08i4xU7m3-J4NCfE5.jpg', rotation: -4 },
  { id: 'g_masks2',          type: 'photo', size: 'med',   y: 10,  speed: 1.35,
    src: 'our_photos/adult/with+mask_on_ugly_faces.jpg',   rotation: 3, catPeek: 'right' },
  { id: 'g_sveta',           type: 'photo', size: 'small', y: -17, speed: 0.72,
    src: 'anya_fun/child/anya_and_sveta.jpg',              rotation: -3 },
  { id: 'g_friends',         type: 'photo', size: 'small', y: 0,   speed: 1.1,
    src: 'our_photos/teen/with_friends.jpg',               rotation: 4 },
  { id: 'g_dark2',           type: 'photo', size: 'small', y: 18,  speed: 0.68,
    src: 'anya_fun/dark_estetic_photo/KAqhG5Z67Hhmqo5u2vO7cpwcghjpvE7Ev_yLb5Es6LfOyAf-pW0GQ8EO5euxjv6JLr4LayH4.jpg', rotation: -7 },
  { id: 'g_together_teen',   type: 'photo', size: 'small', y: -8,  speed: 1.25,
    src: 'our_photos/adult/together.jpg',                  rotation: -2 },
  { id: 'g_hunting',         type: 'photo', size: 'small', y: 18,  speed: 0.7,
    src: 'anya_fun/child/anya_hunting.jpg',                rotation: -5 },
  { id: 'g_demon2',          type: 'photo', size: 'small', y: -5,  speed: 0.68,
    src: 'anya_fun/cringe/demon_face_2.jpg',               rotation: 5 },
  { id: 'g_sport',           type: 'door',  size: 'door',  y: -10, speed: 0.9,
    folder: 'sport', arch: 'door_sport_arch.png', sash: 'door_sport_sashes.png', label: 'Спортзал' },
  { id: 'g_funny',           type: 'photo', size: 'small', y: 5,   speed: 0.72,
    src: 'anya_fun/cringe/funny_face.jpg',                 rotation: 6 },
  { id: 'g_disgust_face',    type: 'photo', size: 'small', y: -17, speed: 0.75,
    src: 'anya_fun/cringe/disgust_face.jpg',               rotation: -6 },
  { id: 'g_dark3',           type: 'photo', size: 'small', y: 12,  speed: 0.72,
    src: 'anya_fun/dark_estetic_photo/t5Qq-Z3Se6WieXsXrTKFokEJQQvKmK24XllVBkO3GcsrwUDqx1jiTbq1igo_UmHU6McnvJS-.jpg', rotation: 5 },
  { id: 'g_family_close',    type: 'photo', size: 'small', y: -5,  speed: 1.0,
    src: 'anya_fun/child/anya_with_family_close.jpg',      rotation: 3 },
  { id: 'g_tired',           type: 'photo', size: 'med',   y: 14,  speed: 1.05,
    src: 'anya_fun/face/tired_unhappy.jpg',                rotation: 5, catPeek: 'left' },
  { id: 'g_dark4',           type: 'photo', size: 'small', y: -15, speed: 0.65,
    src: 'anya_fun/dark_estetic_photo/ybTeEQ_SQPkXsrqOw2i9pEyXLmBE08dx2dcbRrdr7Fi7wwbIlfoAqLt6Jjre71ZzSY2T5tQd.jpg', rotation: -4 },
  { id: 'g_deamon3',         type: 'photo', size: 'small', y: 0,   speed: 0.72,
    src: 'anya_fun/cringe/deamon_face_3.jpg',              rotation: 2 },
  { id: 'g_dark_dyj',        type: 'photo', size: 'small', y: -10, speed: 1.1,
    src: 'anya_fun/dark_estetic_photo/DYjQQw6-GpvD-ukZp9tAATVnWs94kfg3ZaOzXkos9X09fO7dqwM8c-mOxhKYGbiKunjOJ3Su.jpg', rotation: -2 },
  { id: 'g_sweety',          type: 'photo', size: 'small', y: 15,  speed: 1.0,
    src: 'anya_fun/face/sweety.jpg',                       rotation: -2 },
  { id: 'g_rat',             type: 'photo', size: 'small', y: -17, speed: 0.72,
    src: 'anya_fun/face/rat.jpg',                          rotation: 2 },
  { id: 'g_shpagat',         type: 'photo', size: 'small', y: 8,   speed: 1.05,
    src: 'anya_fun/anya.jpg',                              rotation: 3 },
  { id: 'g_satisfaid',       type: 'photo', size: 'small', y: -10, speed: 1.2,
    src: 'anya_fun/face/satisfaid.jpg',                    rotation: 5 },
  { id: 'g_together_last',   type: 'photo', size: 'big',   y: -5,  speed: 1.2,
    src: 'our_photos/adult/together.jpg',                  rotation: 4 },

  // ── ФИНАЛ (separate section, not in strip) ───────────
  { id: 'g_final',           type: 'door',  size: 'door',  y: 0,   speed: 0.7,
    folder: 'final', arch: 'door_final_arch.png', sash: 'door_final_sash.png', label: 'Финал' },
]
