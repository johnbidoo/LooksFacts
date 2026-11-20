import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { BASE_CURRENCY, CURRENCIES, formatMoney, resolvePrice } from '../utils/currency'
import { CurrencyContext } from './currencyContext'

export function CurrencyProvider({ children }) {
  const [stored, setStored] = useLocalStorage('lf.currency', BASE_CURRENCY)
  const currency = CURRENCIES[stored] ? stored : BASE_CURRENCY

  /** Format a product price object, e.g. { AUD: 21.99 }. */
  const formatPrice = useCallback(
    (price, opts) => {
      const { amount, estimated } = resolvePrice(price, currency)
      return { text: formatMoney(amount, currency, opts), amount, estimated }
    },
    [currency],
  )

  /** Format a raw amount already expressed in the active currency. */
  const format = useCallback((amount, opts) => formatMoney(amount, currency, opts), [currency])

  const value = useMemo(
    () => ({ currency, setCurrency: setStored, formatPrice, format }),
    [currency, setStored, formatPrice, format],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
