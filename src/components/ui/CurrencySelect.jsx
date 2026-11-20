import { useId } from 'react'
import { useCurrency } from '../../hooks/useCurrency'
import { CURRENCIES, CURRENCY_CODES } from '../../utils/currency'
import Icon from './Icon'

export default function CurrencySelect({ className = '', showLabel = false }) {
  const { currency, setCurrency } = useCurrency()
  const id = useId()

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor={id} className={showLabel ? 'mr-3 text-sm text-ink-muted' : 'sr-only'}>
        Currency
      </label>
      <select
        id={id}
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-full border border-transparent bg-transparent pr-7 pl-3 text-sm font-medium text-ink transition-colors hover:border-line-strong"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code} title={CURRENCIES[code].label}>
            {code}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={14} className="pointer-events-none absolute right-2.5 text-ink-soft" />
    </div>
  )
}
