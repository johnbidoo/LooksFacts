import { Link } from 'react-router-dom'
import { getCategory } from '../../data/categories'
import InfoStatus from './InfoStatus'
import Price from './Price'
import ProductImage from './ProductImage'

export default function ProductCard({ product, footer = null }) {
  const cat = getCategory(product.category)
  return (
    <article className="group relative flex flex-col">
      <Link to={`/skinfacts/${product.id}`} className="flex flex-1 flex-col" aria-label={`${product.brand} ${product.name}`}>
        <div className="relative">
          <ProductImage
            category={product.category}
            brand={product.brand}
            seed={product.id}
            src={product.image}
            className="aspect-square w-full"
            hoverZoom
          />
          <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[0.7rem] font-semibold text-ink shadow-sm">
            {cat.singular}
          </span>
          <span className="absolute top-3 right-3">
            <InfoStatus info={product.info} compact />
          </span>
        </div>
        <div className="flex flex-1 flex-col pt-3.5">
          <p className="text-xs font-semibold tracking-[0.06em] text-ink-soft uppercase">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-[0.95rem] leading-snug font-medium text-ink group-hover:underline group-hover:underline-offset-2">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-1 text-[0.8rem] text-ink-soft">{product.keyIngredients.slice(0, 3).join(' · ')}</p>
          <div className="mt-auto flex items-baseline justify-between gap-2 pt-3">
            <Price price={product.price} className="text-base font-semibold text-ink" />
            <span className="text-xs text-ink-soft">{product.size}</span>
          </div>
        </div>
      </Link>
      {footer}
    </article>
  )
}
