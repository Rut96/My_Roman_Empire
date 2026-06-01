import { create } from 'zustand'

interface LegendStore {
  active: boolean
  timerId: ReturnType<typeof setTimeout> | null
  activate: () => void
}

export const useLegendStore = create<LegendStore>((set) => ({
  active: false,
  timerId: null,
  activate: () => set((s) => {
    if (s.timerId) clearTimeout(s.timerId)
    const id = setTimeout(() => set({ active: false, timerId: null }), 10_000)
    return { active: true, timerId: id }
  }),
}))
