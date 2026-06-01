import { create } from 'zustand'
import { MEMORIES } from '../data/memories'
import type { Memory } from '../data/memories'

interface MemoryStore {
  visible: boolean
  current: Memory | null
  seen: Set<string>
  show: () => void
  hide: () => void
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  visible: false,
  current: null,
  seen: new Set(),
  show: () => {
    const { seen } = get()
    let pool = MEMORIES.filter(m => !seen.has(m.id))
    if (pool.length === 0) {
      set({ seen: new Set() })
      pool = [...MEMORIES]
    }
    const pick = pool[Math.floor(Math.random() * pool.length)]
    set(s => ({
      visible: true,
      current: pick,
      seen: new Set([...s.seen, pick.id]),
    }))
  },
  hide: () => set({ visible: false }),
}))
