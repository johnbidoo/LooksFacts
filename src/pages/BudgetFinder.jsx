import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Price from '../components/product/Price'
import ProductCard from '../components/product/ProductCard'
import ProductImage from '../components/product/ProductImage'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import { CATEGORIES, getCategory } from '../data/categories'
import { getProduct, PRODUCTS } from '../data/products'
import { useCurrency } from '../hooks/useCurrency'
import { basePrice, filterProducts, findCheaperAlternatives, sharedIngredients, sortProducts } from '../utils/catalogue'
import { convertToBase, CURRENCIES } from '../utils/currency'

const MAX_COMPARE = 4

/** Money text for an AUD amount in the active currency, with ≈ when converted. */
function Money({ aud, className = '' }) {
  const { formatPrice } = useCurrency()
  const { text, estimated } = formatPrice({ AUD: aud })
  return (
    <span className={`tabular-nums ${className}`}>
      {estimated && '≈'}
      {text}
    </span>
  )
}

function MoneyInput({ id, label, value, onChange, placeholder }) {
  const { currency } = useCurrency()
  const symbol = new Intl.NumberFormat(CURRENCIES[currency].locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' })
    .formatToParts(0)
    .find((p) => p.type === 'currency')?.value
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-ink-soft">{symbol}</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="field pl-9 tabular-nums"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cheaper alternatives                                                */
/* ------------------------------------------------------------------ */

function AlternativeFinder({ sourceId, onSource, compareIds, onToggleCompare }) {
  const source = getProduct(sourceId)
  const alternatives = source ? findCheaperAlternatives(source, { limit: 6 }) : []

  return (
    <section className="container-page scroll-mt-24 py-10 md:py-14" id="alternatives">
      <h2 className="section-title">Find a cheaper alternative</h2>
      <p className="mt-1.5 max-w-2xl text-sm sm:text-base">
        Choose a product you use or are considering. We&apos;ll show lower-priced products in the same category that share
        at least one key ingredient.
      </p>

      <div className="mt-6 max-w-xl">
        <label htmlFor="source" className="mb-1.5 block text-sm font-semibold text-ink">
          Product
        </label>
        <div className="relative">
          <select id="source" value={sourceId} onChange={(e) => onSource(e.target.value)} className="field appearance-none pr-10">
            <option value="">Select a product…</option>
            {CATEGORIES.map((c) => (
              <optgroup key={c.id} label={c.label}>
                {sortProducts(
                  PRODUCTS.filter((x) => x.category === c.id),
                  'price-desc',
                ).map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.brand} — {x.name} (A${x.price.AUD.toFixed(2)})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <Icon name="chevronDown" size={18} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-soft" />
        </div>
      </div>

      {source && (
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Source */}
          <div className="rounded-xl bg-ink p-5 text-white lg:col-span-4 lg:self-start">
            <p className="text-xs font-semibold tracking-[0.12em] text-white/50 uppercase">Your product</p>
            <div className="mt-4 flex gap-4">
              <ProductImage category={source.category} brand={source.brand} seed={source.id} className="h-24 w-24 shrink-0" rounded="rounded-lg" />
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">{source.brand}</p>
                <Link to={`/skinfacts/${source.id}`} className="font-semibold text-white hover:underline">
                  {source.name}
                </Link>
                <p className="mt-1 text-xs text-white/60">
                  {getCategory(source.category).singular} · {source.size}
                </p>
                <Price price={source.price} className="mt-2 block text-xl font-semibold" />
              </div>
            </div>
            <p className="mt-4 text-xs text-white/60">Key ingredients</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {source.keyIngredients.map((i) => (
                <span key={i} className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* Alternatives */}
          <div className="lg:col-span-8">
            {alternatives.length === 0 ? (
              <div className="rounded-xl bg-sand p-8 text-sm">
                No lower-priced {getCategory(source.category).label.toLowerCase()} in our catalogue share a key ingredient
                with this product yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {alternatives.map(({ product: x, shared, saving }) => {
                  const pct = Math.round((saving / basePrice(source)) * 100)
                  const inCompare = compareIds.includes(x.id)
                  return (
                    <li key={x.id} className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center">
                      <Link to={`/skinfacts/${x.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                        <ProductImage category={x.category} brand={x.brand} seed={x.id} className="h-20 w-20 shrink-0" rounded="rounded-lg" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{x.brand}</p>
                          <p className="font-semibold text-ink hover:underline">{x.name}</p>
                          <p className="mt-0.5 text-xs text-ink-soft">
                            Shares: <span className="text-ink-muted">{shared.join(', ')}</span>
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1.5">
                        <Price price={x.price} className="text-lg font-semibold text-ink" />
                        <span className="rounded-full bg-clay-soft px-2.5 py-1 text-xs font-semibold text-clay">
                          Save <Money aud={saving} /> ({pct}%)
                        </span>
                      </div>
                      <Button size="sm" variant={inCompare ? 'accent' : 'secondary'} onClick={() => onToggleCompare(x.id)}>
                        <Icon name={inCompare ? 'check' : 'plus'} size={15} /> Compare
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
            <p className="mt-4 text-xs leading-relaxed text-ink-soft">
              Sharing a key ingredient doesn&apos;t make products equivalent. Concentration, formula, texture and
              packaging can all differ. Prices are indicative RRPs.
            </p>
            {!compareIds.includes(source.id) && (
              <button type="button" onClick={() => onToggleCompare(source.id)} className="mt-3 text-sm font-semibold text-ink underline underline-offset-2">
                Add {source.name} to comparison
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Comparison                                                          */
/* ------------------------------------------------------------------ */

function Comparison({ ids, onRemove, onClear }) {
  const items = ids.map(getProduct).filter(Boolean)
  if (!items.length) return null
  const cheapest = Math.min(...items.map(basePrice))

  return (
    <section className="scroll-mt-24 border-y border-line bg-sand py-10 md:py-14" id="compare">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Compare products</h2>
            <p className="mt-1.5 text-sm">
              {items.length} of {MAX_COMPARE} selected · price differences are shown against the cheapest option.
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={onClear}>
            Clear comparison
          </Button>
        </div>

        <div className="no-scrollbar -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-flow-col auto-cols-[260px] gap-4 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:grid-cols-4">
            {items.map((x) => {
              const diff = basePrice(x) - cheapest
              const others = items.filter((o) => o.id !== x.id)
              const shared = [...new Set(others.flatMap((o) => sharedIngredients(x, o)))]
              return (
                <article key={x.id} className="flex flex-col rounded-xl bg-white p-4">
                  <div className="relative">
                    <ProductImage category={x.category} brand={x.brand} seed={x.id} className="aspect-[4/3] w-full" rounded="rounded-lg" />
                    <button
                      type="button"
                      onClick={() => onRemove(x.id)}
                      aria-label={`Remove ${x.name} from comparison`}
                      className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white text-ink shadow-sm hover:bg-sand"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                  <p className="mt-3 text-xs font-semibold tracking-wide text-ink-soft uppercase">{x.brand}</p>
                  <Link to={`/skinfacts/${x.id}`} className="font-semibold text-ink hover:underline">
                    {x.name}
                  </Link>

                  <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink-soft">Price</dt>
                      <dd>
                        <Price price={x.price} className="font-semibold text-ink" />
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink-soft">Difference</dt>
                      <dd className={diff === 0 ? 'font-semibold text-sage-deep' : 'font-semibold text-clay'}>
                        {diff === 0 ? 'Cheapest' : <>+<Money aud={diff} /></>}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink-soft">Category</dt>
                      <dd className="text-ink">{getCategory(x.category).singular}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink-soft">Size</dt>
                      <dd className="text-ink">{x.size}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-soft">Key ingredients</dt>
                      <dd className="mt-1.5 flex flex-wrap gap-1.5">
                        {x.keyIngredients.map((i) => (
                          <span key={i} className={`rounded-full px-2.5 py-1 text-xs font-medium ${shared.includes(i) ? 'bg-sage-soft text-sage-deep' : 'bg-sand text-ink-muted'}`}>
                            {i}
                          </span>
                        ))}
                      </dd>
                    </div>
                    {x.info === 'sample' && <p className="text-xs text-clay">Sample data — details uncertain.</p>}
                  </dl>
                  <Button size="sm" variant="secondary" className="mt-auto w-full" disabled title="Verified retailer links coming soon">
                    Where to buy · soon
                  </Button>
                </article>
              )
            })}
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          Highlighted ingredients are shared with at least one other product in the comparison.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BudgetFinder() {
  const { currency } = useCurrency()
  const [params, setParams] = useSearchParams()
  const [budget, setBudget] = useState('')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [sort, setSort] = useState('price-asc')
  const [compareIds, setCompareIds] = useState(() => (getProduct(params.get('compare') ?? '') ? [params.get('compare')] : []))

  const sourceId = getProduct(params.get('compare') ?? '') ? params.get('compare') : ''
  const setSource = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('compare', id)
    else next.delete('compare')
    setParams(next, { replace: true })
  }

  const toggleCompare = (id) =>
    setCompareIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= MAX_COMPARE ? ids : [...ids, id]))

  // Inputs are in the active currency; filtering is done on AUD base prices.
  const toAUD = (v) => (v === '' || Number.isNaN(Number(v)) ? null : convertToBase(Number(v), currency))
  const budgetAUD = toAUD(budget)
  const minAUD = toAUD(min)
  const maxAUD = toAUD(max)
  const upper = [budgetAUD, maxAUD].filter((v) => v != null)
  const effectiveMax = upper.length ? Math.min(...upper) : null
  const invalidRange = minAUD != null && effectiveMax != null && minAUD > effectiveMax

  const results = useMemo(
    () => sortProducts(filterProducts({ query, category, minAUD, maxAUD: effectiveMax }), sort),
    [query, category, minAUD, effectiveMax, sort],
  )

  const hasFilters = budget || min || max || query || category !== 'all'
  const reset = () => {
    setBudget('')
    setMin('')
    setMax('')
    setQuery('')
    setCategory('all')
  }

  return (
    <>
      <PageHeader
        eyebrow="Budget Finder"
        title="Great skincare, on your budget"
        intro="Set a budget, filter by price and compare products side by side. Find lower-priced options that share key ingredients with what you already use."
      />

      <AlternativeFinder sourceId={sourceId} onSource={setSource} compareIds={compareIds} onToggleCompare={toggleCompare} />

      <Comparison ids={compareIds} onRemove={toggleCompare} onClear={() => setCompareIds([])} />

      {/* Shop within budget */}
      <section className="container-page py-10 md:py-14">
        <h2 className="section-title">Shop within your budget</h2>
        <p className="mt-1.5 text-sm sm:text-base">Prices are entered and shown in {currency}. Change currency from the top of the page.</p>

        <div className="mt-6 grid gap-4 rounded-xl border border-line p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <MoneyInput id="budget" label="Budget per product" value={budget} onChange={setBudget} placeholder="e.g. 30" />
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="cat" className="mb-1.5 block text-sm font-semibold text-ink">
              Category
            </label>
            <div className="relative">
              <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className="field appearance-none pr-9">
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft" />
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="bq" className="mb-1.5 block text-sm font-semibold text-ink">
              Search
            </label>
            <div className="relative">
              <Icon name="search" size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft" />
              <input id="bq" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Product, brand or ingredient" className="field pl-10" />
            </div>
          </div>
          <MoneyInput id="min" label="Min price" value={min} onChange={setMin} placeholder="0" />
          <MoneyInput id="max" label="Max price" value={max} onChange={setMax} placeholder="Any" />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="mr-auto text-sm" aria-live="polite">
            <strong className="font-semibold text-ink">{results.length}</strong> {results.length === 1 ? 'product' : 'products'}
            {effectiveMax != null && (
              <>
                {' '}
                up to <Money aud={effectiveMax} className="font-semibold text-ink" />
              </>
            )}
          </p>
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="field h-10 appearance-none pr-9 text-sm font-medium">
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
            <Icon name="chevronDown" size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft" />
          </label>
          {hasFilters && (
            <button type="button" onClick={reset} className="text-sm font-semibold text-ink underline underline-offset-2">
              Reset
            </button>
          )}
        </div>

        {invalidRange && <p className="mt-3 text-sm text-clay">The minimum price is higher than your maximum or budget.</p>}

        {results.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {results.map((x) => {
              const inCompare = compareIds.includes(x.id)
              const full = !inCompare && compareIds.length >= MAX_COMPARE
              return (
                <ProductCard
                  key={x.id}
                  product={x}
                  footer={
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCompare(x.id)}
                        disabled={full}
                        title={full ? `You can compare up to ${MAX_COMPARE} products` : undefined}
                        className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition-colors disabled:opacity-40 ${
                          inCompare ? 'border-sage-deep bg-sage-deep text-white' : 'border-line-strong text-ink hover:border-ink'
                        }`}
                      >
                        <Icon name={inCompare ? 'check' : 'plus'} size={14} /> Compare
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSource(x.id)
                          document.getElementById('alternatives')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-line-strong text-xs font-semibold text-ink hover:border-ink"
                      >
                        <Icon name="swap" size={14} /> Cheaper
                      </button>
                    </div>
                  }
                />
              )
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-sand px-6 py-12 text-center">
            <h3 className="text-lg font-semibold">No products in this range</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm">Try increasing your budget, widening the price range or choosing another category.</p>
            <Button className="mt-5" onClick={reset}>
              Reset filters
            </Button>
          </div>
        )}
      </section>

      {/* Sticky compare tray */}
      {compareIds.length > 0 && (
        <div className="sticky bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
          <div className="container-page flex items-center gap-3 py-3">
            <div className="flex -space-x-2">
              {compareIds.map((id) => {
                const x = getProduct(id)
                return <ProductImage key={id} category={x.category} brand="" seed={x.id} className="h-10 w-10 ring-2 ring-white" rounded="rounded-full" />
              })}
            </div>
            <p className="mr-auto text-sm font-medium text-ink">
              {compareIds.length} of {MAX_COMPARE} selected
            </p>
            <Button size="sm" href="#compare">
              View comparison
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
