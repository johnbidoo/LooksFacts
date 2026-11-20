import { useMemo, useRef, useState } from 'react'
import { getCategory } from '../../data/categories'
import { useDialog } from '../../hooks/useDialog'
import { PRODUCTS } from '../../data/products'
import { matchesQuery } from '../../utils/catalogue'
import { STEPS, TIMES, stepsFor } from '../../utils/routine'
import Price from '../product/Price'
import ProductImage from '../product/ProductImage'
import Icon from '../ui/Icon'

/** Modal for adding catalogue products to a routine. Mount only while open. */
export default function ProductPicker({ time, initialStep = 'all', selectedIds, onAdd, onClose }) {
  const [step, setStep] = useState(initialStep)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const steps = stepsFor(time)

  const dialogRef = useDialog(onClose, { initialFocus: inputRef })

  const allowed = useMemo(() => new Set(steps.flatMap((s) => s.categories)), [steps])

  const list = useMemo(() => {
    const cats = step === 'all' ? allowed : new Set(STEPS.find((s) => s.id === step)?.categories)
    return PRODUCTS.filter((x) => cats.has(x.category) && matchesQuery(x, query))
  }, [step, query, allowed])

  return (
    <div ref={dialogRef} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Add products to ${TIMES[time].label.toLowerCase()} routine`}>
      <button type="button" tabIndex={-1} data-dialog-backdrop aria-hidden="true" onClick={onClose} className="absolute inset-0 animate-fade-in cursor-default bg-black/40" />
      <div className="relative flex max-h-[88vh] w-full max-w-2xl animate-slide-down flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="border-b border-line p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Add to {TIMES[time].label.toLowerCase()} routine</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-sand">
              <Icon name="close" />
            </button>
          </div>
          <div className="relative mt-3">
            <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, brand or ingredient"
              aria-label="Search products"
              className="field pl-10"
            />
          </div>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:-mx-5 sm:px-5" role="group" aria-label="Filter by step">
            <button type="button" className="chip h-8 px-3 text-xs" aria-pressed={step === 'all'} onClick={() => setStep('all')}>
              All steps
            </button>
            {steps.map((s) => (
              <button key={s.id} type="button" className="chip h-8 px-3 text-xs" aria-pressed={step === s.id} onClick={() => setStep(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto p-2 sm:p-3">
          {list.length === 0 && <li className="p-8 text-center text-sm text-ink-soft">No matching products.</li>}
          {list.map((x) => {
            const added = selectedIds.includes(x.id)
            return (
              <li key={x.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-sand">
                <ProductImage category={x.category} brand={x.brand} seed={x.id} className="h-14 w-14 shrink-0" rounded="rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{x.brand}</p>
                  <p className="truncate text-sm font-medium text-ink">{x.name}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {getCategory(x.category).singular} · {x.keyIngredients.slice(0, 2).join(', ')}
                  </p>
                </div>
                <Price price={x.price} className="hidden text-sm font-semibold text-ink sm:block" />
                <button
                  type="button"
                  onClick={() => onAdd(x.id)}
                  disabled={added}
                  className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                    added ? 'bg-sage-soft text-sage-deep' : 'bg-ink text-white hover:bg-sage-deep'
                  }`}
                >
                  <Icon name={added ? 'check' : 'plus'} size={16} /> {added ? 'Added' : 'Add'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
