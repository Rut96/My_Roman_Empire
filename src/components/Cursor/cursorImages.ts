import { asset } from '../../utils/asset'
import type { CursorState } from '../../store/cursorStore'

export const CURSOR_IMAGES: Record<CursorState, string> = {
  neutral:  asset('anya_face_cursor/neutral.png'),
  happy:    asset('anya_face_cursor/happy.png'),
  loved:    asset('anya_face_cursor/loved.png'),
  judging:  asset('anya_face_cursor/judging.jpg'),
  unhappy:  asset('anya_face_cursor/unhappy.png'),
  disgust:  asset('anya_face_cursor/disgust.jpg'),
  dark:     asset('anya_face_cursor/dark.png'),
  bored:    asset('anya_face_cursor/neutral.png'),
  garden:   asset('anya_face_cursor/garden_cursor.webp'),
  coffee:   asset('anya_face_cursor/anya_coffe_close.webp'),
}
