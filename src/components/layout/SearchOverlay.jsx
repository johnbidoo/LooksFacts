import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategory } from '../../data/categories'
import { filterProducts } from '../../utils/catalogue'
import Price from '../product/Price'
import ProductImage from '../product/ProductImage'
import Icon from '../ui/Icon'

const SUGGESTIONS = ['Niacinamide', 'Vitamin C', 'Retinol', 'Ceramides', 'Salicylic acid', 'Sunscreen', 'CeraVe', 'The Ordinary']

export default function SearchOverlay({ open, onClose }) {
  if (!open) return null
  return <SearchPanel onClose={onClose} />
}

/* Mounted only while open, so state resets each time the overlay opens. */
function SearchPanel({ onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => (query.trim() ? filterProducts({ query }) : []), [query])

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const goToAll = (q) => {
    const term = q.trim()
    navigate(term ? `/skinfacts?q=${encodeURIComponent(term)}` : '/skinfacts')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default bg-black/30"
      />
      <div className="relative max-h-[90vh] animate-slide-down overflow-y-auto bg-white shadow-2xl">
        <div className="container-page py-5 sm:py-7">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              goToAll(query)
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands or ingredients"
                aria-label="Search products, brands or ingredients"
                className="h-13 w-full rounded-full border border-line-strong bg-white pr-4 pl-12 text-base text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-13 shrink-0 rounded-full px-3 text-sm font-semibold text-ink hover:bg-sand"
            >
              Cancel
            </button>
          </form>

          {!query.trim() && (
            <div className="mt-6">
              <p className="eyebrow">Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => setQuery(s)} className="chip">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && (
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">
                  {results.length} {results.length === 1 ? 'product' : 'products'}
                </p>
                {results.length > 0 && (
                  <button type="button" onClick={() => goToAll(query)} className="text-sm font-semibold text-ink underline underline-offset-2">
                    View all results
                  </button>
                )}
              </div>
              {results.length === 0 ? (
                <p className="mt-4 text-sm">
                  No products match &ldquo;{query}&rdquo;. Try a brand, a product type or an ingredient such as
                  &ldquo;niacinamide&rdquo;.
                </p>
              ) : (
                <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                  {results.slice(0, 8).map((x) => (
                    <li key={x.id}>
                      <Link
                        to={`/skinfacts/${x.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sand"
                      >
                        <ProductImage category={x.category} brand={x.brand} seed={x.id} className="h-14 w-14 shrink-0" rounded="rounded-md" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">{x.brand}</span>
                          <span className="block truncate text-sm font-medium text-ink">{x.name}</span>
                          <span className="block text-xs text-ink-soft">{getCategory(x.category).singular}</span>
                        </span>
                        <Price price={x.price} className="text-sm font-semibold text-ink" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
