export type CursorCategory = 'cringe' | 'loved' | 'happy' | 'garden' | 'default'

/**
 * Determine cursor category from an asset src path.
 * Priority matters: cringe check first (our_photos/teen/cringe.jpg would otherwise match 'loved').
 */
export function getCursorCategory(src: string): CursorCategory {
  if (src.includes('cringe'))               return 'cringe'
  if (src.startsWith('our_photos/'))        return 'loved'
  if (src.includes('dark_estetic_photo'))   return 'loved'
  if (src.startsWith('anya_fun/child/'))    return 'happy'
  if (src.startsWith('school_album/'))      return 'happy'
  return 'default'
}
