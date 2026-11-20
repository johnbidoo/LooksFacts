import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import ProductImage from '../components/product/ProductImage'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { CATEGORIES, CATEGORY_MAP } from '../data/categories'
import { PRODUCTS, SKIN_TYPES } from '../data/products'
import { countByCategory, filterProducts, SORTS, sortProducts } from '../utils/catalogue'

const COUNTS = countByCategory()

export default function SkinFacts() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = CATEGORY_MAP[params.get('category')] ? params.get('category') : 'all'
  const skinType = SKIN_TYPES.some((s) => s.id === params.get('skin')) ? params.get('skin') : 'all'
  const sort = SORTS.some((s) => s.id === params.get('sort')) ? params.get('sort') : 'featured'

  /** Update one or more URL params; defaults are removed to keep URLs clean. */
  const update = (patch, { replace = true } = {}) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if (!v || v === 'all' || (k === 'sort' && v === 'featured')) next.delete(k)
      else next.set(k, v)
    })
    setParams(next, { replace })
  }

  const results = useMemo(
    () => sortProducts(filterProducts({ query, category, skinType }), sort),
    [query, category, skinType, sort],
  )

  const activeCat = category !== 'all' ? CATEGORY_MAP[category] : null
  const hasFilters = query || category !== 'all' || skinType !== 'all'

  return (
    <>
      {/* Header */}
      <header className="bg-sand">
        <div className="container-page py-8 md:py-12">
          <p className="eyebrow">SkinFacts</p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
                {activeCat ? activeCat.label : 'All skincare products'}
              </h1>
              <p className="mt-3 text-base leading-relaxed">
                {activeCat
                  ? activeCat.blurb
                  : `Browse ${PRODUCTS.length} well-known products by category, brand or key ingredient.`}
              </p>
            </div>
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="relative w-full lg:max-w-sm"
            >
              <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
              <input
                type="search"
                value={query}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search products, brands, ingredients"
                aria-label="Search the catalogue"
                className="h-12 w-full rounded-full border border-line-strong bg-white pr-10 pl-11 text-[0.95rem] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => update({ q: '' })}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-sand hover:text-ink"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </form>
          </div>
        </div>
      </header>

      {/* Category rail */}
      <div className="sticky top-16 z-30 border-b border-line bg-white lg:top-[4.5rem]">
        <div className="container-page">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" role="group" aria-label="Filter by category">
            <button type="button" className="chip" aria-pressed={category === 'all'} onClick={() => update({ category: 'all' }, { replace: false })}>
              All <span className="opacity-60">{PRODUCTS.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={category === c.id}
                onClick={() => update({ category: c.id }, { replace: false })}
              >
                {c.label} <span className="opacity-60">{COUNTS[c.id] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="container-page py-6 md:py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <p className="mr-auto text-sm text-ink-muted" aria-live="polite">
            <strong className="font-semibold text-ink">{results.length}</strong> {results.length === 1 ? 'product' : 'products'}
            {query && (
              <>
                {' '}
                for &ldquo;<span className="text-ink">{query}</span>&rdquo;
              </>
            )}
          </p>

          <label className="relative">
            <span className="sr-only">Skin type</span>
            <select value={skinType} onChange={(e) => update({ skin: e.target.value })} className="field h-10 appearance-none pr-9 text-sm font-medium">
              <option value="all">All skin types</option>
              {SKIN_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft" />
          </label>

          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="field h-10 appearance-none pr-9 text-sm font-medium">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft" />
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: false })}
              className="h-10 rounded-full px-3 text-sm font-semibold text-ink underline underline-offset-2 hover:text-sage-deep"
            >
              Clear all
            </button>
          )}
        </div>

        {skinType !== 'all' && (
          <p className="mt-3 text-xs text-ink-soft">
            Showing products the brand positions for {SKIN_TYPES.find((s) => s.id === skinType).label.toLowerCase()} skin.
            Products without a stated skin type are hidden.
          </p>
        )}

        {/* Grid */}
        {results.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {results.map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-xl bg-sand px-6 py-16 text-center">
            <ProductImage category={activeCat?.id ?? 'serum'} brand="" bare className="h-28 w-24" />
            <h2 className="mt-4 text-xl font-semibold">No products found</h2>
            <p className="mt-2 max-w-md text-sm">
              Try a different search term, choose another category or clear your filters. You can search by brand, product
              type or ingredient.
            </p>
            <Button className="mt-6" onClick={() => setParams(new URLSearchParams())}>
              Clear filters
            </Button>
          </div>
        )}

        <p className="mt-14 border-t border-line pt-6 text-xs leading-relaxed text-ink-soft">
          This catalogue is a curated local dataset for the LooksFacts MVP. Key ingredients reflect what brands promote and
          are not full ingredient lists; entries marked &ldquo;Sample data&rdquo; have incomplete or uncertain details.
          Prices are indicative Australian RRPs and vary by retailer. Nothing here has been independently verified.
        </p>
      </section>
    </>
  )
}
