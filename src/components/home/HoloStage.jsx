import { Link } from 'react-router-dom'
import Price from '../product/Price'
import ProductImage from '../product/ProductImage'

const PARTICLES = [12, 24, 37, 49, 58, 66, 78, 88]

/**
 * Hologram-style showcase for the homepage banner. Products (photos when
 * available, otherwise illustrations) are "projected" above a light disc.
 * Pure CSS effects — styles live in index.css under "Hologram stage".
 */
export default function HoloStage({ products }) {
  const [left, center, right] = products
  const slots = [
    { p: left, cls: 'left-[4%] bottom-[22%] w-[34%]', delay: '-2s', tag: 'left-[2%] top-[14%]' },
    { p: center, cls: 'left-1/2 -translate-x-1/2 bottom-[21%] w-[44%] z-10', delay: '0s', tag: 'left-1/2 -translate-x-1/2 top-[4%]' },
    { p: right, cls: 'right-[4%] bottom-[22%] w-[34%]', delay: '-4s', tag: 'right-[2%] top-[14%]' },
  ].filter((s) => s.p)

  return (
    <div className="holo-stage h-full min-h-[380px] w-full sm:min-h-[460px]">
      <div className="holo-floor" aria-hidden="true" />
      <div className="holo-beam" aria-hidden="true" />
      <div className="holo-base" aria-hidden="true" />
      {PARTICLES.map((x, i) => (
        <span key={x} className="holo-particle" style={{ left: `${x}%`, animationDelay: `${-i * 0.7}s` }} aria-hidden="true" />
      ))}

      {slots.map(({ p, cls, delay, tag }) => (
        <div key={p.id}>
          <Link
            to={`/skinfacts/${p.id}`}
            className={`holo-item absolute block ${cls}`}
            style={{ animationDelay: `${delay}, ${delay}` }}
            aria-label={`${p.brand} ${p.name}`}
          >
            <div className="holo-render">
              <ProductImage category={p.category} brand={p.brand} seed={p.id} bare holo className="aspect-[5/6] w-full" rounded="" />
            </div>
          </Link>
          <Link
            to={`/skinfacts/${p.id}`}
            className={`holo-tag absolute z-20 hidden max-w-[42%] rounded-md px-2.5 py-1.5 font-mono text-[0.68rem] leading-tight transition-colors hover:text-white sm:block ${tag}`}
          >
            <span className="block truncate opacity-70">{p.brand}</span>
            <span className="block truncate font-semibold">{p.name}</span>
            <Price price={p.price} className="block opacity-80" />
          </Link>
        </div>
      ))}

      <div className="holo-scan" aria-hidden="true" />
      <div className="holo-lines" aria-hidden="true" />
    </div>
  )
}
