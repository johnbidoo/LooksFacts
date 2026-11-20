import Icon from '../ui/Icon'

/** Shows how much confidence we have in a product entry's details. */
export default function InfoStatus({ info, compact = false }) {
  const sample = info === 'sample'
  if (compact) {
    return sample ? (
      <span className="inline-flex items-center rounded-full bg-clay-soft px-2 py-0.5 text-[0.68rem] font-semibold tracking-wide text-clay uppercase">
        Sample data
      </span>
    ) : null
  }
  return (
    <div className={`flex gap-3 rounded-lg p-4 text-sm leading-relaxed ${sample ? 'bg-clay-soft text-ink' : 'bg-sand text-ink-muted'}`}>
      <Icon name="info" size={18} className={`mt-0.5 ${sample ? 'text-clay' : 'text-ink-soft'}`} />
      <p>
        {sample ? (
          <>
            <strong className="font-semibold text-ink">Sample data.</strong> Some details for this product are incomplete or
            uncertain. Check the product label or the brand&apos;s website before relying on them.
          </>
        ) : (
          <>
            Key ingredients reflect what the brand promotes and are not a full ingredient list. Details have{' '}
            <strong className="font-semibold text-ink">not been independently verified</strong> by LooksFacts. Price is an
            indicative Australian RRP.
          </>
        )}
      </p>
    </div>
  )
}
