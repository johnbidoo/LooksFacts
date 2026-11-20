import { useCurrency } from '../../hooks/useCurrency'

/**
 * Displays a product price in the active currency. Converted (non-AUD)
 * values are prefixed with "≈" and explained via a tooltip.
 */
export default function Price({ price, className = '' }) {
  const { formatPrice, currency } = useCurrency()
  const { text, estimated } = formatPrice(price)
  return (
    <span
      className={`tabular-nums ${className}`}
      title={estimated ? `Approximate conversion from the AUD price into ${currency}` : 'Indicative RRP — prices vary by retailer'}
    >
      {estimated && <span className="mr-0.5 font-normal text-ink-soft">≈</span>}
      {text}
    </span>
  )
}
