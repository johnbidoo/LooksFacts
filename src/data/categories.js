/**
 * Product categories. `shape` drives the placeholder packaging illustration,
 * `tint` the background behind it. `step` maps the category to a routine step.
 */
export const CATEGORIES = [
  {
    id: 'cleanser',
    label: 'Cleansers',
    singular: 'Cleanser',
    shape: 'tube',
    tint: '#EEF0EA',
    step: 'cleanse',
    blurb: 'Remove sunscreen, oil and debris without stripping the skin barrier.',
  },
  {
    id: 'toner',
    label: 'Toners',
    singular: 'Toner',
    shape: 'bottle',
    tint: '#F1EDE6',
    step: 'tone',
    blurb: 'Lightweight liquids that hydrate or prep the skin after cleansing.',
  },
  {
    id: 'serum',
    label: 'Serums',
    singular: 'Serum',
    shape: 'dropper',
    tint: '#F3E9E1',
    step: 'treat',
    blurb: 'Concentrated formulas built around one or two active ingredients.',
  },
  {
    id: 'treatment',
    label: 'Treatments',
    singular: 'Treatment',
    shape: 'smalltube',
    tint: '#ECE8E1',
    step: 'treat',
    blurb: 'Targeted products for concerns such as breakouts or pigmentation.',
  },
  {
    id: 'exfoliant',
    label: 'Exfoliants',
    singular: 'Exfoliant',
    shape: 'bottle',
    tint: '#EDEFE8',
    step: 'treat',
    blurb: 'Chemical exfoliants (AHAs, BHAs, PHAs) that loosen dead skin cells.',
  },
  {
    id: 'moisturiser',
    label: 'Moisturisers',
    singular: 'Moisturiser',
    shape: 'jar',
    tint: '#F2ECE3',
    step: 'moisturise',
    blurb: 'Creams, lotions and gels that hydrate and support the skin barrier.',
  },
  {
    id: 'eye-cream',
    label: 'Eye creams',
    singular: 'Eye cream',
    shape: 'pump',
    tint: '#EFEAE6',
    step: 'moisturise',
    blurb: 'Formulas designed for the thinner skin around the eyes.',
  },
  {
    id: 'sunscreen',
    label: 'Sunscreens',
    singular: 'Sunscreen',
    shape: 'tube',
    tint: '#F4EEDF',
    step: 'protect',
    blurb: 'Broad-spectrum UV protection — the last step of every morning routine.',
  },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

export function getCategory(id) {
  return CATEGORY_MAP[id] ?? CATEGORIES[0]
}
