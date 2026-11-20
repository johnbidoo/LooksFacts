/**
 * Educational articles. Content is general information written for an
 * Australian audience and should be reviewed by a qualified professional
 * before the platform launches publicly.
 *
 * Body blocks: { type: 'p' | 'h2' | 'list' | 'callout', ... }
 */
export const ARTICLES = [
  {
    slug: 'spf-explained',
    title: 'What SPF actually measures — and what it doesn’t',
    dek: 'SPF 50 doesn’t mean twice the protection of SPF 25, and most of us apply far less than the amount used in testing. Here’s how to read a sunscreen label with confidence.',
    topic: 'Sun protection',
    readingTime: '5 min read',
    body: [
      {
        type: 'p',
        text: 'Sunscreen is one of the few skincare products with a clear, well-established purpose: reducing the amount of ultraviolet (UV) radiation that reaches your skin. But the number on the front of the bottle is widely misunderstood.',
      },
      { type: 'h2', text: 'SPF is about UVB' },
      {
        type: 'p',
        text: 'SPF stands for Sun Protection Factor. It is a laboratory measure of how well a sunscreen protects against UVB radiation — the part of the UV spectrum mainly responsible for sunburn. It does not, on its own, tell you how well a product protects against UVA.',
      },
      {
        type: 'p',
        text: 'The scale is not linear. Under test conditions, SPF 30 filters roughly 97% of UVB, while SPF 50 filters roughly 98%. The difference sounds small, but it means noticeably less UVB gets through — and the higher number gives you more margin for the ways real-world use falls short of the lab.',
      },
      { type: 'h2', text: 'Why “broad spectrum” matters' },
      {
        type: 'p',
        text: 'UVA radiation penetrates more deeply into the skin and contributes to skin ageing and skin cancer. A sunscreen labelled “broad spectrum” has been tested to show it also protects against UVA. In Australia, broad-spectrum claims are tested against the Australian/New Zealand Standard for sunscreen products (AS/NZS 2604).',
      },
      { type: 'h2', text: 'The amount you apply changes everything' },
      {
        type: 'p',
        text: 'SPF ratings are determined using a fairly thick layer of sunscreen — 2 milligrams per square centimetre of skin. Studies consistently find that people apply considerably less than this, which means the protection they get can be well below the number on the label.',
      },
      {
        type: 'list',
        items: [
          'Apply generously. Cancer Council Australia’s guidance is about half a teaspoon for the face, neck and ears, and a teaspoon for each arm and leg.',
          'Apply 20 minutes before going outdoors.',
          'Reapply every two hours, and after swimming, sweating or towel-drying — regardless of the SPF.',
          '“Water resistant” claims are time-limited (for example, 4 hours). They do not mean waterproof.',
        ],
      },
      { type: 'h2', text: 'Reading an Australian sunscreen label' },
      {
        type: 'p',
        text: 'In Australia, sunscreens whose main purpose is sun protection are regulated as therapeutic goods by the Therapeutic Goods Administration (TGA). These products carry an AUST L number on the label. Moisturisers and make-up with SPF may be regulated differently, so it is worth checking the label rather than assuming the same level of testing.',
      },
      {
        type: 'callout',
        title: 'Common claim: “SPF 50 lets me stay in the sun twice as long”',
        text: 'Not quite. SPF describes a filtering level under test conditions, not a safe time limit. Sweat, water, rubbing and under-application all reduce protection over time — which is why reapplication matters more than the exact number.',
      },
      { type: 'h2', text: 'Sunscreen is one part of sun protection' },
      {
        type: 'p',
        text: 'Health authorities recommend combining sunscreen with protective clothing, a broad-brimmed hat, sunglasses and shade — especially when the UV Index is 3 or above. Sunscreen works best as the last line of defence, not the only one.',
      },
    ],
    furtherReading: [
      'Cancer Council Australia — sun safety guidance',
      'Therapeutic Goods Administration (TGA) — information on sunscreens',
      'AS/NZS 2604 — Sunscreen products: evaluation and classification',
    ],
  },
]

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug)
}
