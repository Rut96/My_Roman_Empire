import { create } from 'zustand'

const DOOR_ANIM_MS = 800  // matches door-half transition 0.75s + small buffer

interface RoomStore {
  activeRoom: string | null   // popup is visible
  openingRoom: string | null  // door is animating, popup not yet shown
  openRoom: (id: string) => void
  closeRoom: () => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  activeRoom: null,
  openingRoom: null,
  openRoom: (id) => {
    set({ openingRoom: id })
    setTimeout(() => set({ activeRoom: id, openingRoom: null }), DOOR_ANIM_MS)
  },
  closeRoom: () => set({ activeRoom: null, openingRoom: null }),
}))
