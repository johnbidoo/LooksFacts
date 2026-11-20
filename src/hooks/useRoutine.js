import { useCallback, useMemo } from 'react'
import { getProduct } from '../data/products'
import { stepIndex } from '../utils/routine'
import { useLocalStorage } from './useLocalStorage'

const EMPTY = { am: [], pm: [] }

/** Morning/evening routines stored as product IDs in localStorage. */
export function useRoutine() {
  const [raw, setRaw] = useLocalStorage('lf.routine.v1', EMPTY)

  // Drop unknown IDs (e.g. if the catalogue changes)
  const ids = useMemo(
    () => ({
      am: (raw?.am ?? []).filter((id) => getProduct(id)),
      pm: (raw?.pm ?? []).filter((id) => getProduct(id)),
    }),
    [raw],
  )

  const products = useMemo(() => ({ am: ids.am.map(getProduct), pm: ids.pm.map(getProduct) }), [ids])

  const update = useCallback(
    (time, fn) => setRaw((prev) => ({ ...EMPTY, ...prev, [time]: fn((prev?.[time] ?? []).filter((id) => getProduct(id))) })),
    [setRaw],
  )

  const add = useCallback((time, id) => update(time, (l) => (l.includes(id) ? l : [...l, id])), [update])
  const remove = useCallback((time, id) => update(time, (l) => l.filter((x) => x !== id)), [update])
  const move = useCallback(
    (time, index, dir) =>
      update(time, (l) => {
        const j = index + dir
        if (j < 0 || j >= l.length) return l
        const next = [...l]
        ;[next[index], next[j]] = [next[j], next[index]]
        return next
      }),
    [update],
  )
  const clear = useCallback((time) => update(time, () => []), [update])
  const sortRecommended = useCallback(
    (time) => update(time, (l) => [...l].sort((a, b) => stepIndex(getProduct(a)) - stepIndex(getProduct(b)))),
    [update],
  )

  return { ids, products, add, remove, move, clear, sortRecommended }
}
