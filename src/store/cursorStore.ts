import { create } from 'zustand'

export type CursorState =
  | 'neutral'
  | 'happy'
  | 'loved'
  | 'judging'
  | 'unhappy'
  | 'disgust'
  | 'dark'
  | 'bored'
  | 'garden'
  | 'coffee'

interface CursorStore {
  state: CursorState
  coffeeOverride: boolean
  setState: (s: CursorState) => void
  toggleCoffee: () => void
}

export const useCursorStore = create<CursorStore>((set) => ({
  state: 'neutral',
  coffeeOverride: false,
  setState: (s) => set({ state: s }),
  toggleCoffee: () => set(s => {
    const next = !s.coffeeOverride
    return { coffeeOverride: next, state: next ? 'coffee' : 'neutral' }
  }),
}))
