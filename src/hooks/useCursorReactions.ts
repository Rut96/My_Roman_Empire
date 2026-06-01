import { useEffect, useRef } from 'react'
import { useCursorStore } from '../store/cursorStore'
import { useDarkModeStore } from '../store/darkModeStore'
import type { CursorState } from '../store/cursorStore'
import type { CursorCategory } from '../components/Cursor/cursorCategory'

function resolveCursorState(category: CursorCategory | null, darkMode: boolean): CursorState {
  if (category === 'cringe') return darkMode ? 'unhappy' : 'judging'
  if (category === 'loved')  return 'loved'
  if (category === 'happy')  return 'happy'
  if (category === 'garden') return 'garden'
  // Coffee override replaces the default neutral cursor
  if (useCursorStore.getState().coffeeOverride) return 'coffee'
  return darkMode ? 'dark' : 'neutral'
}

export function useCursorReactions() {
  const hoveredCategory = useRef<CursorCategory | null>(null)

  // Re-resolve cursor when dark mode toggles
  useEffect(() => {
    let prevActive = useDarkModeStore.getState().active
    return useDarkModeStore.subscribe((state) => {
      if (state.active !== prevActive) {
        prevActive = state.active
        const resolved = resolveCursorState(hoveredCategory.current, state.active)
        useCursorStore.getState().setState(resolved)
      }
    })
  }, [])

  // Event delegation: mouseover / mouseout on document
  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>('[data-cursor-cat]')
      if (!el) return
      const category = el.dataset.cursorCat as CursorCategory
      hoveredCategory.current = category
      const darkMode = useDarkModeStore.getState().active
      useCursorStore.getState().setState(resolveCursorState(category, darkMode))
    }

    const onLeave = (e: MouseEvent) => {
      // Only fire when leaving a categorized element to an uncategorized one
      const from = e.target as Element
      const to   = e.relatedTarget as Element | null
      if (!from.closest('[data-cursor-cat]')) return
      if (to?.closest('[data-cursor-cat]')) return
      hoveredCategory.current = null
      const darkMode = useDarkModeStore.getState().active
      useCursorStore.getState().setState(resolveCursorState(null, darkMode))
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onLeave)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [])
}
