import { Link } from 'react-router-dom'
import Price from '../components/product/Price'
import ProductCard from '../components/product/ProductCard'
import ProductImage from '../components/product/ProductImage'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { CATEGORIES } from '../data/categories'
import { getProduct, PRODUCTS } from '../data/products'
import { useCurrency } from '../hooks/useCurrency'
import { countByCategory, findCheaperAlternatives } from '../utils/catalogue'

const pick = (ids) => ids.map(getProduct).filter(Boolean)

/** Hero: first product is the large feature tile, the next two stack beside it. */
const HERO_PRODUCTS = pick([
  'cerave-moisturising-cream',
  'the-ordinary-niacinamide-10-zinc-1',
  'la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50',
])

const POPULAR = pick([
  'cerave-foaming-cleanser',
  'the-ordinary-hyaluronic-acid-2-b5',
  'the-ordinary-retinol-0-5-in-squalane',
  'la-roche-posay-cicaplast-baume-b5',
  'bondi-sands-fragrance-free-spf50-face-lotion',
  'cosrx-advanced-snail-96-mucin-power-essence',
  'the-ordinary-azelaic-acid-suspension-10',
  'neutrogena-hydro-boost-water-gel',
])

/** Premium products we show a computed cheaper alternative for. */
const SWAP_SOURCES = pick([
  'skinceuticals-c-e-ferulic',
  'paula-s-choice-10-niacinamide-booster',
  'paula-s-choice-skin-perfecting-2-bha-liquid-exfoliant',
])

const COUNTS = countByCategory()

/* ------------------------------------------------------------------ */

function HeroTile({ product, large = false }) {
  return (
    <Link
      to={`/skinfacts/${product.id}`}
      className={`group flex min-h-0 flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 ${
        large ? 'col-span-2 sm:col-span-1 sm:row-span-2' : ''
      }`}
    >
      <ProductImage
        category={product.category}
        brand={product.brand}
        seed={product.id}
        alt={`${product.brand} ${product.name}`}
        priority
        hoverZoom
        rounded=""
        // Fixed heights on phones; on larger screens the grid height is shared
        className={`w-full sm:h-auto sm:min-h-0 sm:flex-1 ${large ? 'h-56' : 'h-32'}`}
      />
      <div
        className={`flex gap-x-3 gap-y-1 border-t border-line px-3.5 py-3 sm:flex-row sm:items-end sm:justify-between sm:px-4 ${
          large ? 'items-end justify-between' : 'flex-col'
        }`}
      >
        <span className="min-w-0">
          <span className="block truncate text-[0.68rem] font-semibold tracking-[0.08em] text-ink-soft uppercase">{product.brand}</span>
          <span
            className={`font-medium text-ink ${large ? 'block truncate text-sm sm:text-base' : 'line-clamp-2 text-xs sm:line-clamp-1 sm:text-sm'}`}
          >
            {product.name}
          </span>
        </span>
        <Price price={product.price} className="shrink-0 text-sm font-semibold text-ink" />
      </div>
    </Link>
  )
}

function Hero() {
  const [feature, ...rest] = HERO_PRODUCTS
  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="grid items-center gap-8 overflow-hidden rounded-2xl bg-sand p-5 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-sage-deep!">Independent skincare information</p>
          <h1 className="mt-4 text-[clamp(2.4rem,5.4vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.045em]">
            Skincare, without the guesswork.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed sm:text-lg">
            Discover {PRODUCTS.length} well-known products, see what&apos;s actually in them, build your routine and find
            cheaper alternatives.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/skinfacts" size="lg">
              Explore products <Icon name="arrowRight" size={18} />
            </Button>
            <Button to="/routine" size="lg" variant="secondary">
              Build your routine
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:h-[500px] sm:grid-rows-2 sm:gap-4 lg:col-span-7 lg:h-[540px]">
          {feature && <HeroTile product={feature} large />}
          {rest.map((p) => (
            <HeroTile key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

const USPS = [
  { icon: 'list', title: `${PRODUCTS.length} products`, text: 'Across 8 skincare categories' },
  { icon: 'flask', title: 'Ingredient-first', text: 'Search by what’s inside' },
  { icon: 'wallet', title: 'Budget-friendly', text: 'Find cheaper alternatives' },
  { icon: 'sun', title: 'AM & PM routines', text: 'Saved in your browser' },
]

function UspStrip() {
  return (
    <section className="container-page">
      <ul className="grid grid-cols-2 gap-px overflow-hidden border-b border-line lg:grid-cols-4">
        {USPS.map((u) => (
          <li key={u.title} className="flex items-center gap-3 py-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-ink">
              <Icon name={u.icon} size={19} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{u.title}</span>
              <span className="block text-xs text-ink-soft sm:text-sm">{u.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SectionHeading({ title, to, linkLabel = 'View all', children }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {children && <p className="mt-1.5 text-sm text-ink-soft sm:text-base">{children}</p>}
      </div>
      {to && (
        <Link to={to} className="shrink-0 text-sm font-semibold text-ink underline underline-offset-4 hover:text-sage-deep">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

function Categories() {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeading title="Shop by category" to="/skinfacts" linkLabel="All products" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/skinfacts?category=${c.id}`}
            className="group flex items-center gap-3 rounded-xl bg-sand p-3 transition-colors hover:bg-sand-deep sm:p-4"
          >
            <ProductImage category={c.id} brand="" seed={`cat-${c.id}`} bare hoverZoom className="h-16 w-14 shrink-0 sm:h-20 sm:w-16" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink sm:text-base">{c.label}</span>
              <span className="block text-xs text-ink-soft">{COUNTS[c.id] ?? 0} products</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Popular() {
  return (
    <section className="container-page pb-12 md:pb-16">
      <SectionHeading title="Popular products" to="/skinfacts">
        Well-known staples people search for most.
      </SectionHeading>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-4">
        {POPULAR.map((x) => (
          <ProductCard key={x.id} product={x} />
        ))}
      </div>
    </section>
  )
}

function SwapSide({ product, label }) {
  return (
    <Link to={`/skinfacts/${product.id}`} className="group min-w-0 flex-1">
      <ProductImage category={product.category} brand={product.brand} seed={product.id} hoverZoom className="aspect-square w-full" rounded="rounded-lg" />
      <p className="mt-3 text-[0.68rem] font-semibold tracking-wide text-ink-soft uppercase">{label}</p>
      <p className="truncate text-xs font-semibold text-ink-soft">{product.brand}</p>
      <p className="line-clamp-2 text-sm font-medium text-ink group-hover:underline">{product.name}</p>
      <Price price={product.price} className="mt-1 block text-sm font-semibold text-ink" />
    </Link>
  )
}

function SwapCard({ source }) {
  const { formatPrice } = useCurrency()
  const alt = findCheaperAlternatives(source, { limit: 1 })[0]
  if (!alt) return null
  const saving = formatPrice({ AUD: alt.saving })

  return (
    <div className="flex flex-col rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <SwapSide product={source} label="Instead of" />
        <span className="mt-[22%] grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand text-ink">
          <Icon name="arrowRight" size={16} />
        </span>
        <SwapSide product={alt.product} label="Try" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
        <span className="text-xs text-ink-soft">Shares {alt.shared.join(', ')}</span>
        <span className="rounded-full bg-clay-soft px-2.5 py-1 text-xs font-semibold text-clay">
          Save {saving.estimated && '≈'}
          {saving.text}
        </span>
      </div>
    </div>
  )
}

function BudgetSwaps() {
  return (
    <section className="bg-sand py-12 md:py-16">
      <div className="container-page">
        <SectionHeading title="Budget swaps" to="/budget" linkLabel="Open Budget Finder">
          Lower-priced products that share key ingredients. Not identical formulas — but a good place to start.
        </SectionHeading>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SWAP_SOURCES.map((x) => (
            <SwapCard key={x.id} source={x} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolBanners() {
  return (
    <section className="container-page grid gap-4 py-12 md:grid-cols-2 md:py-16">
      <div className="flex flex-col justify-between gap-8 rounded-2xl bg-ink p-8 text-white sm:p-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-white/50 uppercase">Routine Builder</p>
          <h2 className="mt-3 text-[1.9rem] leading-tight font-semibold tracking-[-0.03em] text-white">
            Build your morning and evening routine.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Add products step by step, reorder them, and see notes on ingredients that are commonly used with care
            together.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button to="/routine" variant="light" size="lg">
            Start building
          </Button>
          <span className="flex gap-2 text-xs text-white/60">
            {['Cleanse', 'Treat', 'Moisturise', 'Protect'].map((s, i) => (
              <span key={s}>
                {i + 1}. {s}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 rounded-2xl bg-clay-soft p-8 sm:p-10">
        <div>
          <p className="eyebrow text-clay!">Budget Finder</p>
          <h2 className="mt-3 text-[1.9rem] leading-tight font-semibold tracking-[-0.03em]">
            Set a budget. Compare. Spend less.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            Filter by price, compare products side by side and see the price difference between options.
          </p>
        </div>
        <div>
          <Button to="/budget" size="lg">
            Find products in my budget
          </Button>
        </div>
      </div>
    </section>
  )
}

function FeaturedArticle() {
  return (
    <section className="container-page pb-16 md:pb-20">
      <Link
        to="/learn/spf-explained"
        className="group grid overflow-hidden rounded-2xl border border-line transition-shadow hover:shadow-lg hover:shadow-black/5 md:grid-cols-5"
      >
        <div className="relative min-h-52 bg-[#F7EEDC] md:col-span-2">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="200" cy="170" r="70" fill="#F2C879" />
            <g stroke="#E3B460" strokeWidth="5" strokeLinecap="round">
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * Math.PI) / 6
                return (
                  <line key={i} x1={200 + Math.cos(a) * 92} y1={170 + Math.sin(a) * 92} x2={200 + Math.cos(a) * 118} y2={170 + Math.sin(a) * 118} />
                )
              })}
            </g>
          </svg>
          <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">Sun protection</span>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10 md:col-span-3">
          <p className="eyebrow">Featured guide · 5 min read</p>
          <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight font-semibold tracking-[-0.03em] group-hover:underline group-hover:underline-offset-4">
            What SPF actually measures — and what it doesn&apos;t
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
            SPF 50 isn&apos;t twice SPF 25, and most of us apply far less sunscreen than labs test with. How to read an
            Australian sunscreen label with confidence.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">
            Read the guide <Icon name="arrowRight" size={16} />
          </span>
        </div>
      </Link>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <UspStrip />
      <Categories />
      <Popular />
      <BudgetSwaps />
      <ToolBanners />
      <FeaturedArticle />
    </>
  )
}
