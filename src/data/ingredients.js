/**
 * Plain-language ingredient notes. Deliberately general and conservative —
 * these describe what an ingredient is commonly used for, not what any
 * specific product will do. To be expanded and referenced in a later
 * evidence-review phase.
 */
const GLOSSARY = [
  { match: ['alpha arbutin'], name: 'Alpha arbutin', note: 'Used to target the look of dark spots and uneven tone.' },
  { match: ['niacinamide'], name: 'Niacinamide', note: 'A form of vitamin B3. Commonly used for oiliness, redness, uneven tone and supporting the skin barrier.' },
  { match: ['hyaluronic acid'], name: 'Hyaluronic acid', note: 'A humectant that attracts and holds water, helping skin feel hydrated and plump.' },
  { match: ['ceramide'], name: 'Ceramides', note: 'Lipids naturally found in the skin barrier. Often included to help reduce moisture loss.' },
  { match: ['salicylic acid', 'betaine salicylate', 'bha'], name: 'Salicylic acid (BHA)', note: 'An oil-soluble exfoliant that works inside pores. Commonly used for blackheads and breakouts.' },
  { match: ['glycolic acid'], name: 'Glycolic acid (AHA)', note: 'A water-soluble exfoliant that loosens dead surface cells. Can increase sun sensitivity.' },
  { match: ['lactic acid'], name: 'Lactic acid (AHA)', note: 'A generally milder AHA exfoliant that also has hydrating properties.' },
  { match: ['aha'], name: 'AHAs', note: 'Alpha hydroxy acids — water-soluble exfoliants for surface texture and dullness.' },
  { match: ['pha'], name: 'PHAs', note: 'Polyhydroxy acids — larger-molecule exfoliants often positioned as gentler than AHAs.' },
  { match: ['lha'], name: 'LHA', note: 'A salicylic acid derivative used as a gentle exfoliant.' },
  { match: ['retinol'], name: 'Retinol', note: 'A vitamin A derivative used for texture, fine lines and breakouts. Usually used at night; can cause irritation when starting.' },
  { match: ['retinal'], name: 'Retinal (retinaldehyde)', note: 'A vitamin A derivative one conversion step closer to retinoic acid than retinol. Night use.' },
  { match: ['retinoate', 'retinoid'], name: 'Retinoids', note: 'The vitamin A family of ingredients. Typically introduced gradually and used at night.' },
  { match: ['azelaic acid'], name: 'Azelaic acid', note: 'Commonly used for redness, breakouts and uneven tone. Generally well tolerated.' },
  { match: ['benzoyl peroxide'], name: 'Benzoyl peroxide', note: 'An antibacterial acne ingredient. Can dry the skin and bleach fabric.' },
  { match: ['vitamin c', 'ascorb'], name: 'Vitamin C', note: 'An antioxidant used for brightness and uneven tone. Stability and strength vary between forms.' },
  { match: ['vitamin e'], name: 'Vitamin E', note: 'An antioxidant and emollient often paired with vitamin C.' },
  { match: ['ferulic acid'], name: 'Ferulic acid', note: 'A plant antioxidant often combined with vitamins C and E.' },
  { match: ['peptide'], name: 'Peptides', note: 'Short chains of amino acids, commonly included in anti-ageing products.' },
  { match: ['panthenol'], name: 'Panthenol (vitamin B5)', note: 'A humectant and soothing ingredient that helps skin hold moisture.' },
  { match: ['squalane'], name: 'Squalane', note: 'A lightweight, stable emollient that softens the skin.' },
  { match: ['glycerin'], name: 'Glycerin', note: 'One of the most common and well-studied humectants in skincare.' },
  { match: ['zinc oxide'], name: 'Zinc oxide', note: 'A mineral UV filter providing broad-spectrum protection.' },
  { match: ['uv filters', 'mexoryl'], name: 'UV filters', note: 'Ingredients that absorb or reflect UV radiation. Sunscreen performance depends on the full formula and how much is applied.' },
  { match: ['caffeine'], name: 'Caffeine', note: 'Commonly used in eye products for the temporary look of puffiness.' },
  { match: ['centella', 'madecassoside'], name: 'Centella asiatica', note: 'A plant extract (and its derivatives) commonly used in soothing products.' },
  { match: ['snail'], name: 'Snail mucin', note: 'Snail secretion filtrate, used in hydrating products.' },
  { match: ['zinc pca'], name: 'Zinc PCA', note: 'A zinc salt commonly included in products for oily skin.' },
  { match: ['thermal', 'volcanic water'], name: 'Mineral / thermal water', note: 'Spring water used by several pharmacy brands; often marketed as soothing.' },
  { match: ['hydrocolloid'], name: 'Hydrocolloid', note: 'A dressing material that absorbs fluid and protects a blemish from picking.' },
]

export function describeIngredient(label) {
  const l = label.toLowerCase()
  return GLOSSARY.find((g) => g.match.some((m) => l.includes(m))) ?? null
}
