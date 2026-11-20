import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Price from '../components/product/Price'
import ProductImage from '../components/product/ProductImage'
import ProductPicker from '../components/routine/ProductPicker'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import { getProduct } from '../data/products'
import { useCurrency } from '../hooks/useCurrency'
import { useRoutine } from '../hooks/useRoutine'
import { routineNotes, stepOf, stepsFor, TIMES } from '../utils/routine'

function AddFromLink({ product, ids, onAdd, onDismiss }) {
  const canPm = product.category !== 'sunscreen'
  return (
    <div className="container-page pt-6">
      <div className="flex flex-col gap-4 rounded-xl border border-ink bg-white p-4 sm:flex-row sm:items-center">
        <ProductImage category={product.category} brand={product.brand} seed={product.id} className="h-16 w-16 shrink-0" rounded="rounded-md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink-soft">Add to which routine?</p>
          <p className="truncate font-semibold text-ink">
            {product.brand} {product.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['am', 'pm'].map((t) =>
            t === 'pm' && !canPm ? null : (
              <Button key={t} size="sm" variant={ids[t].includes(product.id) ? 'ghost' : 'primary'} disabled={ids[t].includes(product.id)} onClick={() => onAdd(t)}>
                <Icon name={TIMES[t].icon} size={16} /> {ids[t].includes(product.id) ? `In ${TIMES[t].label.toLowerCase()}` : TIMES[t].label}
              </Button>
            ),
          )}
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

function RoutineItem({ product, index, count, onMove, onRemove }) {
  const step = stepOf(product)
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 sm:gap-4 sm:p-4">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white tabular-nums">{index + 1}</span>
      <Link to={`/skinfacts/${product.id}`} className="shrink-0">
        <ProductImage category={product.category} brand={product.brand} seed={product.id} className="h-16 w-16" rounded="rounded-lg" />
      </Link>
      <div className="min-w-0 flex-1">
        <span className="tag">{step.label}</span>
        <Link to={`/skinfacts/${product.id}`} className="mt-1 block truncate text-sm font-semibold text-ink hover:underline sm:text-base">
          {product.name}
        </Link>
        <p className="truncate text-xs text-ink-soft">
          {product.brand} · {product.keyIngredients.slice(0, 3).join(', ')}
        </p>
      </div>
      <Price price={product.price} className="hidden text-sm font-semibold text-ink md:block" />
      <div className="flex shrink-0 items-center gap-0.5">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Move ${product.name} up`} className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-sand disabled:opacity-25">
          <Icon name="arrowUp" size={18} />
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`Move ${product.name} down`} className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-sand disabled:opacity-25">
          <Icon name="arrowDown" size={18} />
        </button>
        <button type="button" onClick={onRemove} aria-label={`Remove ${product.name}`} className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-clay-soft hover:text-clay">
          <Icon name="trash" size={18} />
        </button>
      </div>
    </li>
  )
}

function Summary({ products }) {
  const { formatPrice } = useCurrency()
  const unique = useMemo(() => [...new Map([...products.am, ...products.pm].map((x) => [x.id, x])).values()], [products])
  const total = formatPrice({ AUD: unique.reduce((s, x) => s + x.price.AUD, 0) })
  const ingredients = [...new Set(unique.flatMap((x) => x.keyIngredients))]

  return (
    <div className="rounded-xl bg-sand p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Routine breakdown</h2>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          ['Morning', products.am.length],
          ['Evening', products.pm.length],
          ['Products', unique.length],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-white p-3">
            <dt className="text-xs text-ink-soft">{k}</dt>
            <dd className="text-xl font-semibold text-ink tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-line-strong/60 pt-4">
        <span className="text-sm">Total cost of products</span>
        <span className="text-xl font-semibold text-ink tabular-nums">
          {total.estimated && <span className="font-normal text-ink-soft">≈</span>}
          {total.text}
        </span>
      </div>
      <p className="mt-1 text-xs text-ink-soft">Based on indicative RRPs; each product counted once.</p>
      {ingredients.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-semibold">Key ingredients in your routine</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ingredients.map((i) => (
              <span key={i} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink-muted">
                {i}
              </span>
            ))}
          </div>
        </>
      )}
      {unique.length > 0 && (
        <Link to="/budget" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-2">
          Look for cheaper alternatives <Icon name="arrowRight" size={15} />
        </Link>
      )}
    </div>
  )
}

function Notes({ notes }) {
  return (
    <div className="rounded-xl border border-line p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Ingredient notes</h2>
      {notes.length === 0 ? (
        <p className="mt-2 text-sm">No common caution points detected in your current routine.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {notes.map((n) => (
            <li key={n.title} className={`rounded-lg p-3.5 text-sm ${n.level === 'caution' ? 'bg-clay-soft' : 'bg-sand'}`}>
              <p className="flex items-start gap-2 font-semibold text-ink">
                <Icon name={n.level === 'caution' ? 'alert' : 'info'} size={17} className={`mt-0.5 ${n.level === 'caution' ? 'text-clay' : 'text-ink-soft'}`} />
                {n.title}
              </p>
              <p className="mt-1 pl-[25px] leading-relaxed">{n.text}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs leading-relaxed text-ink-soft">
        These are general guidance points based on key ingredients only — not a safety assessment or medical advice.
        Always follow product directions, patch test new products, and speak to a pharmacist or dermatologist about
        your skin.
      </p>
    </div>
  )
}

export default function RoutineBuilder() {
  const routine = useRoutine()
  const [params, setParams] = useSearchParams()
  const [time, setTime] = useState(params.get('time') === 'pm' ? 'pm' : 'am')
  const [picker, setPicker] = useState(null) // null | step id | 'all'

  const pending = getProduct(params.get('add') ?? '')
  const dismissPending = () => {
    const next = new URLSearchParams(params)
    next.delete('add')
    setParams(next, { replace: true })
  }

  const list = routine.products[time]
  const notes = useMemo(() => routineNotes(routine.products), [routine.products])
  const steps = stepsFor(time)
  const filledSteps = new Set(list.map((x) => stepOf(x).id))
  const closePicker = useCallback(() => setPicker(null), [])

  return (
    <>
      <PageHeader
        eyebrow="Routine Builder"
        title="Build your routine"
        intro="Create a morning and evening routine from the SkinFacts catalogue. Your routine is saved in this browser — no account needed."
      />

      {pending && (
        <AddFromLink
          product={pending}
          ids={routine.ids}
          onAdd={(t) => {
            routine.add(t, pending.id)
            setTime(t)
          }}
          onDismiss={dismissPending}
        />
      )}

      <div className="container-page grid gap-8 py-8 md:py-10 lg:grid-cols-12">
        <section className="lg:col-span-8" aria-label={`${TIMES[time].label} routine`}>
          {/* AM / PM switch */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full bg-sand p-1" role="tablist" aria-label="Routine time">
              {Object.values(TIMES).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={time === t.id}
                  onClick={() => setTime(t.id)}
                  className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors ${
                    time === t.id ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <Icon name={t.icon} size={17} /> {t.label}
                  <span className="text-xs font-medium text-ink-soft tabular-nums">{routine.products[t.id].length}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {list.length > 1 && (
                <Button size="sm" variant="ghost" onClick={() => routine.sortRecommended(time)}>
                  <Icon name="list" size={16} /> Sort into recommended order
                </Button>
              )}
              {list.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.confirm(`Clear your ${TIMES[time].label.toLowerCase()} routine?`) && routine.clear(time)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Step checklist */}
          <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {steps.map((s, i) => {
              const done = filledSteps.has(s.id)
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setPicker(s.id)}
                    className={`flex h-full w-full flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
                      done ? 'border-sage-deep/30 bg-sage-soft' : 'border-dashed border-line-strong hover:border-ink'
                    }`}
                  >
                    <span className="flex w-full items-center justify-between text-xs text-ink-soft">
                      Step {i + 1}
                      {done ? <Icon name="check" size={15} className="text-sage-deep" strokeWidth={2.2} /> : <Icon name="plus" size={15} />}
                    </span>
                    <span className="text-sm font-semibold text-ink">{s.label}</span>
                    {s.optional && <span className="text-xs text-ink-soft">Optional</span>}
                  </button>
                </li>
              )
            })}
          </ol>

          {/* Routine list */}
          {list.length > 0 ? (
            <ol className="mt-6 space-y-3">
              {list.map((x, i) => (
                <RoutineItem
                  key={x.id}
                  product={x}
                  index={i}
                  count={list.length}
                  onMove={(dir) => routine.move(time, i, dir)}
                  onRemove={() => routine.remove(time, x.id)}
                />
              ))}
            </ol>
          ) : (
            <div className="mt-6 rounded-xl bg-sand px-6 py-12 text-center">
              <Icon name={TIMES[time].icon} size={28} className="mx-auto text-ink-soft" />
              <h3 className="mt-3 text-lg font-semibold">Your {TIMES[time].label.toLowerCase()} routine is empty</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm">
                Start with a cleanser, then add the steps you use. Choose a step above or browse all products.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => setPicker('all')}>
              <Icon name="plus" size={18} /> Add product
            </Button>
            <Button to="/skinfacts" variant="secondary">
              Browse SkinFacts
            </Button>
          </div>
          {time === 'pm' && (
            <p className="mt-4 text-xs text-ink-soft">Sunscreen isn&apos;t included in evening routines.</p>
          )}
        </section>

        <aside className="space-y-4 lg:col-span-4">
          <Summary products={routine.products} />
          <Notes notes={notes} />
        </aside>
      </div>

      {picker && (
        <ProductPicker
          time={time}
          initialStep={picker}
          selectedIds={routine.ids[time]}
          onAdd={(id) => routine.add(time, id)}
          onClose={closePicker}
        />
      )}
    </>
  )
}
