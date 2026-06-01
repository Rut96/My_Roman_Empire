import { create } from 'zustand'

interface DarkModeStore {
  active: boolean
  toggle: () => void
}

export const useDarkModeStore = create<DarkModeStore>((set) => ({
  active: false,
  toggle: () => set((s) => {
    const next = !s.active
    if (next) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    return { active: next }
  }),
}))
