import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/categories'
import CurrencySelect from '../ui/CurrencySelect'
import Logo from '../ui/Logo'

const YEAR = new Date().getFullYear()

const COLUMNS = [
  {
    title: 'Shop by category',
    links: CATEGORIES.slice(0, 5).map((c) => ({ to: `/skinfacts?category=${c.id}`, label: c.label })),
  },
  {
    title: 'Tools',
    links: [
      { to: '/skinfacts', label: 'SkinFacts catalogue' },
      { to: '/routine', label: 'Routine Builder' },
      { to: '/budget', label: 'Budget Finder' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { to: '/learn/spf-explained', label: 'What SPF really means' },
      { to: '/skinfacts?category=sunscreen', label: 'Sunscreens' },
      { to: '/skinfacts?q=niacinamide', label: 'Niacinamide products' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white/70">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-4">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Discover skincare products, understand what&apos;s in them and build a routine that fits your skin and your
            budget.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-1 text-ink">
            <span className="pl-3 text-xs font-medium text-ink-soft">Currency</span>
            <CurrencySelect />
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs leading-relaxed text-white/50 md:flex-row md:justify-between md:gap-10">
          <p className="shrink-0">&copy; {YEAR} LooksFacts</p>
          <p className="max-w-3xl md:text-right">
            General information only — not a substitute for advice from a dermatologist or healthcare professional.
            Product details are a curated dataset and have not been independently verified. Prices are indicative
            Australian RRPs; other currencies are approximate conversions.
          </p>
        </div>
      </div>
    </footer>
  )
}
