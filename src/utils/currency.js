/**
 * Currency handling for LooksFacts.
 *
 * Product prices are stored primarily in AUD (the platform's base market).
 * A product may also carry explicit prices for other regions, e.g.
 *   price: { AUD: 21.99, GBP: 12.5 }
 * When a regional price exists we show it as-is. Otherwise we convert from
 * AUD with the fixed indicative rates below and flag the value as estimated.
 *
 * These rates are hard-coded approximations, NOT live exchange rates.
 * Replace with a rates API when a backend is introduced.
 */

export const BASE_CURRENCY = 'AUD'

export const CURRENCIES = {
  AUD: { code: 'AUD', label: 'Australian dollar', locale: 'en-AU', rate: 1 },
  NZD: { code: 'NZD', label: 'New Zealand dollar', locale: 'en-NZ', rate: 1.1 },
  USD: { code: 'USD', label: 'US dollar', locale: 'en-US', rate: 0.65 },
  GBP: { code: 'GBP', label: 'British pound', locale: 'en-GB', rate: 0.51 },
  EUR: { code: 'EUR', label: 'Euro', locale: 'en-IE', rate: 0.6 },
  CAD: { code: 'CAD', label: 'Canadian dollar', locale: 'en-CA', rate: 0.9 },
}

export const CURRENCY_CODES = Object.keys(CURRENCIES)

/** Convert an amount in AUD into the target currency. */
export function convertFromBase(amountAUD, code) {
  const c = CURRENCIES[code] ?? CURRENCIES[BASE_CURRENCY]
  return amountAUD * c.rate
}

/** Convert an amount in the given currency back into AUD (used for budget inputs). */
export function convertToBase(amount, code) {
  const c = CURRENCIES[code] ?? CURRENCIES[BASE_CURRENCY]
  return amount / c.rate
}

/**
 * Resolve a product price object for a currency.
 * @returns {{ amount: number|null, estimated: boolean }}
 */
export function resolvePrice(price, code) {
  if (!price) return { amount: null, estimated: false }
  if (typeof price[code] === 'number') return { amount: price[code], estimated: false }
  if (typeof price[BASE_CURRENCY] === 'number') {
    return { amount: convertFromBase(price[BASE_CURRENCY], code), estimated: code !== BASE_CURRENCY }
  }
  return { amount: null, estimated: false }
}

const formatterCache = new Map()

export function formatMoney(amount, code, { compact = false } = {}) {
  if (amount == null || Number.isNaN(amount)) return '—'
  const key = `${code}-${compact}`
  if (!formatterCache.has(key)) {
    const c = CURRENCIES[code] ?? CURRENCIES[BASE_CURRENCY]
    formatterCache.set(
      key,
      new Intl.NumberFormat(c.locale, {
        style: 'currency',
        currency: c.code,
        currencyDisplay: code === 'AUD' || code === 'USD' ? 'narrowSymbol' : 'symbol',
        minimumFractionDigits: compact ? 0 : 2,
        maximumFractionDigits: compact ? 0 : 2,
      }),
    )
  }
  return formatterCache.get(key).format(amount)
}
