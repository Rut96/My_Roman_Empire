import { create } from 'zustand'

interface BoredomStore {
  index: number
  status: string
  recalculate: () => void
}

function getStatus(index: number): string {
  if (index < 50)       return 'Скучаю'
  if (index < 200)      return 'Сильно скучаю'
  if (index < 1_000)    return 'Безобразие'
  if (index < 10_000)   return 'Где Аня?'
  if (index < 100_000)  return 'Требуется встреча'
  return 'Критический. Срочно обнять.'
}

export const useBoredomStore = create<BoredomStore>((set, get) => ({
  index: 3650,
  status: getStatus(3650),
  recalculate: () => {
    const prev = get().index
    const bump = Math.floor(Math.random() * 15) + 3
    const next = prev + bump
    set({ index: next, status: getStatus(next) })
  },
}))
