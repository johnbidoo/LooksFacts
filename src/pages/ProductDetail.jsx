import { Link, useParams } from 'react-router-dom'
import InfoStatus from '../components/product/InfoStatus'
import Price from '../components/product/Price'
import ProductCard from '../components/product/ProductCard'
import ProductViewer from '../components/product3d/ProductViewer'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { getCategory } from '../data/categories'
import { describeIngredient } from '../data/ingredients'
import { getProduct, PRODUCTS, SKIN_TYPES } from '../data/products'
import { useCurrency } from '../hooks/useCurrency'
import { findCheaperAlternatives } from '../utils/catalogue'
import NotFound from './NotFound'

function Saving({ amountAUD }) {
  const { formatPrice } = useCurrency()
  const { text, estimated } = formatPrice({ AUD: amountAUD })
  return (
    <span className="rounded-full bg-clay-soft px-2.5 py-1 text-xs font-semibold text-clay">
      Save {estimated && '≈'}
      {text}
    </span>
  )
}

export default function ProductDetail() {
  const { productId } = useParams()
  const product = getProduct(productId)
  if (!product) return <NotFound />

  const cat = getCategory(product.category)
  const alternatives = findCheaperAlternatives(product, { limit: 4 })
  const related = PRODUCTS.filter((x) => x.category === product.category && x.id !== product.id && !alternatives.some((a) => a.product.id === x.id)).slice(0, 4)
  const skinLabels = product.skinTypes.map((id) => SKIN_TYPES.find((s) => s.id === id)?.label).filter(Boolean)

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container-page pt-5 text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/skinfacts" className="hover:text-ink hover:underline">
              SkinFacts
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/skinfacts?category=${cat.id}`} className="hover:text-ink hover:underline">
              {cat.label}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="truncate text-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main */}
      <section className="container-page grid gap-8 py-6 md:grid-cols-2 md:gap-12 md:py-10 lg:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          {/* key resets the viewer when navigating between products */}
          <ProductViewer key={product.id} product={product} />
        </div>

        <div>
          <Link
            to={`/skinfacts?q=${encodeURIComponent(product.brand)}`}
            className="text-sm font-semibold tracking-[0.06em] text-ink-soft uppercase hover:text-ink"
          >
            {product.brand}
          </Link>
          <h1 className="mt-2 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.03em]">{product.name}</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {cat.singular} · {product.size}
          </p>

          <div className="mt-5 flex items-baseline gap-3">
            <Price price={product.price} className="text-2xl font-semibold text-ink" />
            <span className="text-xs text-ink-soft">Indicative RRP</span>
          </div>

          <p className="mt-5 text-base leading-relaxed">{product.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button to={`/routine?add=${product.id}`} size="lg">
              <Icon name="plus" size={18} /> Add to routine
            </Button>
            <Button size="lg" variant="secondary" disabled title="Verified retailer links are coming soon">
              Where to buy <span className="font-normal text-ink-soft">· soon</span>
            </Button>
          </div>

          {/* Facts */}
          <dl className="mt-9 divide-y divide-line border-y border-line">
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-sm font-semibold text-ink">Category</dt>
              <dd className="col-span-2 text-sm">
                <Link to={`/skinfacts?category=${cat.id}`} className="underline underline-offset-2 hover:text-ink">
                  {cat.label}
                </Link>
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-sm font-semibold text-ink">Skin type</dt>
              <dd className="col-span-2 text-sm">
                {skinLabels.length ? skinLabels.join(', ') : <span className="text-ink-soft">Not specified by the brand</span>}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-sm font-semibold text-ink">Size</dt>
              <dd className="col-span-2 text-sm">{product.size}</dd>
            </div>
          </dl>

          {/* Key ingredients */}
          <h2 className="mt-9 text-lg font-semibold">Key ingredients</h2>
          <ul className="mt-4 space-y-3">
            {product.keyIngredients.map((ing) => {
              const info = describeIngredient(ing)
              return (
                <li key={ing} className="rounded-lg border border-line p-4">
                  <Link
                    to={`/skinfacts?q=${encodeURIComponent(ing.replace(/\s*\(.*\)/, ''))}`}
                    className="text-[0.95rem] font-semibold text-ink hover:underline"
                  >
                    {ing}
                  </Link>
                  {info && <p className="mt-1 text-sm leading-relaxed">{info.note}</p>}
                </li>
              )
            })}
          </ul>

          <div className="mt-6">
            <InfoStatus info={product.info} />
          </div>
        </div>
      </section>

      {/* Cheaper alternatives */}
      <section className="bg-sand py-12 md:py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Cheaper alternatives</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed">
                Lower-priced {cat.label.toLowerCase()} that share at least one key ingredient. Sharing an ingredient
                doesn&apos;t make products equivalent — strength, formula and texture can differ.
              </p>
            </div>
            <Button to={`/budget?compare=${product.id}`} variant="secondary" size="sm">
              Compare in Budget Finder
            </Button>
          </div>
          {alternatives.length ? (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
              {alternatives.map(({ product: alt, shared, saving }) => (
                <ProductCard
                  key={alt.id}
                  product={alt}
                  footer={
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line-strong/60 pt-3">
                      <Saving amountAUD={saving} />
                      <span className="text-xs text-ink-soft">Shares {shared.join(', ')}</span>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-lg bg-white p-6 text-sm">
              No lower-priced {cat.singular.toLowerCase()} in our catalogue shares a key ingredient with this product yet.
            </p>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-page py-12 md:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">More {cat.label.toLowerCase()}</h2>
            <Link to={`/skinfacts?category=${cat.id}`} className="text-sm font-semibold text-ink underline underline-offset-2">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {related.map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
