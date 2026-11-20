import { getCategory } from '../data/categories'
import { PRODUCTS } from '../data/products'

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/** Pre-computed search text per product (name, brand, category, ingredients). */
const SEARCH_INDEX = new Map(
  PRODUCTS.map((x) => [
    x.id,
    norm([x.name, x.brand, getCategory(x.category).label, getCategory(x.category).singular, ...x.keyIngredients].join(' ')),
  ]),
)

/** Every whitespace-separated term must appear somewhere in the product's text. */
export function matchesQuery(product, query) {
  const q = norm(query.trim())
  if (!q) return true
  const hay = SEARCH_INDEX.get(product.id)
  return q.split(/\s+/).every((term) => hay.includes(term))
}

export const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name-asc', label: 'Name: A–Z' },
  { id: 'name-desc', label: 'Name: Z–A' },
]

export const basePrice = (product) => product.price.AUD

export function sortProducts(list, sort) {
  const arr = [...list]
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => basePrice(a) - basePrice(b))
    case 'price-desc':
      return arr.sort((a, b) => basePrice(b) - basePrice(a))
    case 'name-asc':
      return arr.sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`))
    case 'name-desc':
      return arr.sort((a, b) => `${b.brand} ${b.name}`.localeCompare(`${a.brand} ${a.name}`))
    default:
      return arr
  }
}

/**
 * Filter the catalogue.
 * `minAUD` / `maxAUD` are compared against the AUD base price.
 */
export function filterProducts({ query = '', category = 'all', skinType = 'all', minAUD = null, maxAUD = null } = {}) {
  return PRODUCTS.filter(
    (x) =>
      (category === 'all' || x.category === category) &&
      (skinType === 'all' || x.skinTypes.includes(skinType)) &&
      (minAUD == null || basePrice(x) >= minAUD) &&
      (maxAUD == null || basePrice(x) <= maxAUD) &&
      matchesQuery(x, query),
  )
}

export function countByCategory() {
  return PRODUCTS.reduce((acc, x) => ({ ...acc, [x.category]: (acc[x.category] ?? 0) + 1 }), {})
}

/** Ingredient key used for matching ("Vitamin C (L-ascorbic acid)" → "vitamin c"). */
function ingredientKey(label) {
  const l = norm(label)
  if (l.includes('vitamin c') || l.includes('ascorb')) return 'vitamin c'
  if (l.includes('salicyl') || l === 'bha') return 'salicylic acid'
  if (l.includes('ceramide')) return 'ceramides'
  if (l.includes('peptide')) return 'peptides'
  if (l.includes('uv filters')) return null // too generic to imply equivalence
  if (l.includes('retin')) return 'retinoid'
  return l.replace(/\s*\(.*\)\s*/g, '').trim()
}

export function sharedIngredients(a, b) {
  const bKeys = new Set(b.keyIngredients.map(ingredientKey).filter(Boolean))
  return a.keyIngredients.filter((i) => {
    const k = ingredientKey(i)
    return k && bKeys.has(k)
  })
}

/**
 * Cheaper products in the same category that share at least one key
 * ingredient. Sorted by most shared ingredients, then by lowest price.
 * Sharing an ingredient does NOT mean products are equivalent — strength,
 * formula and texture can differ significantly.
 */
export function findCheaperAlternatives(product, { limit = 4, maxAUD = null } = {}) {
  return PRODUCTS.filter(
    (x) =>
      x.id !== product.id &&
      x.category === product.category &&
      basePrice(x) < basePrice(product) &&
      (maxAUD == null || basePrice(x) <= maxAUD),
  )
    .map((x) => ({ product: x, shared: sharedIngredients(product, x), saving: basePrice(product) - basePrice(x) }))
    .filter((r) => r.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length || basePrice(a.product) - basePrice(b.product))
    .slice(0, limit)
}
