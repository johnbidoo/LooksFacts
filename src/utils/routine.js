import { getCategory } from '../data/categories'

/** Logical routine steps, in recommended application order. */
export const STEPS = [
  { id: 'cleanse', label: 'Cleanser', categories: ['cleanser'] },
  { id: 'tone', label: 'Toner', optional: true, categories: ['toner'] },
  { id: 'treat', label: 'Serum / treatment', categories: ['serum', 'treatment', 'exfoliant'] },
  { id: 'moisturise', label: 'Moisturiser', categories: ['moisturiser', 'eye-cream'] },
  { id: 'protect', label: 'Sunscreen', amOnly: true, categories: ['sunscreen'] },
]

export const TIMES = {
  am: { id: 'am', label: 'Morning', icon: 'sun' },
  pm: { id: 'pm', label: 'Evening', icon: 'moon' },
}

export const stepsFor = (time) => STEPS.filter((s) => !(s.amOnly && time === 'pm'))

export function stepOf(product) {
  const stepId = getCategory(product.category).step
  return STEPS.find((s) => s.id === stepId) ?? STEPS[2]
}

export const stepIndex = (product) => STEPS.indexOf(stepOf(product))

/* ---------------- Ingredient classification for caution notes ---------------- */

const has = (product, words) =>
  product.keyIngredients.some((i) => words.some((w) => i.toLowerCase().includes(w)))

export const CLASSES = {
  retinoid: (x) => has(x, ['retin']),
  aha: (x) => has(x, ['glycolic', 'lactic', 'mandelic']) || x.keyIngredients.some((i) => i === 'AHA'),
  bha: (x) => has(x, ['salicylic', 'betaine salicylate']) || x.keyIngredients.some((i) => i === 'BHA'),
  pha: (x) => x.keyIngredients.some((i) => i === 'PHA'),
  benzoyl: (x) => has(x, ['benzoyl peroxide']),
  vitaminC: (x) => has(x, ['vitamin c', 'ascorb']),
}

const acid = (x) => CLASSES.aha(x) || CLASSES.bha(x) || CLASSES.pha(x)

const names = (list) => list.map((x) => `${x.brand} ${x.name}`).join(', ')

/**
 * General, conservative caution notes for a routine. These are common
 * guidance points, not a safety assessment of any specific combination.
 */
export function routineNotes({ am, pm }) {
  const notes = []

  for (const [time, list] of [
    ['am', am],
    ['pm', pm],
  ]) {
    const label = TIMES[time].label.toLowerCase()
    const retinoids = list.filter(CLASSES.retinoid)
    const acids = list.filter(acid)
    const bp = list.filter(CLASSES.benzoyl)
    const vitC = list.filter(CLASSES.vitaminC)

    if (retinoids.length && acids.some((x) => !retinoids.includes(x))) {
      notes.push({
        level: 'caution',
        title: `Retinoid and exfoliating acids in your ${label} routine`,
        text: `Using a retinoid alongside AHAs/BHAs can increase dryness and irritation, especially when starting out. Many people alternate them on different nights. Products: ${names([...new Set([...retinoids, ...acids])])}.`,
      })
    }
    if (retinoids.length && bp.length) {
      notes.push({
        level: 'caution',
        title: `Benzoyl peroxide and a retinoid in your ${label} routine`,
        text: 'Benzoyl peroxide may make some retinoids less effective and the pairing can be drying. They are often used at different times of day or on alternate days.',
      })
    }
    if (acids.length >= 2) {
      notes.push({
        level: 'caution',
        title: `Several exfoliating products in your ${label} routine`,
        text: `Layering multiple acid products can over-exfoliate and irritate the skin barrier. Consider using one at a time. Products: ${names(acids)}.`,
      })
    }
    if (vitC.length && acids.some((x) => !vitC.includes(x))) {
      notes.push({
        level: 'info',
        title: `Vitamin C with exfoliating acids (${label})`,
        text: 'Some people find this combination irritating. If you notice stinging or redness, try using them at different times of day.',
      })
    }
    if (time === 'am' && retinoids.length) {
      notes.push({
        level: 'info',
        title: 'Retinoid in your morning routine',
        text: 'Retinoids are usually recommended for evening use. Check the product label for directions.',
      })
    }
  }

  const all = [...am, ...pm]
  const hasSunscreen = am.some((x) => x.category === 'sunscreen')
  if (am.length && !hasSunscreen) {
    notes.push({
      level: 'info',
      title: 'No sunscreen in your morning routine',
      text: 'Daily broad-spectrum sunscreen is widely recommended in Australia, typically as the last morning step.',
    })
  }
  if (!hasSunscreen && all.some((x) => CLASSES.retinoid(x) || acid(x))) {
    notes.push({
      level: 'caution',
      title: 'Exfoliants or retinoids without daytime sun protection',
      text: 'AHAs and retinoids can increase sun sensitivity. Sunscreen is commonly advised when using them.',
    })
  }

  return notes
}
