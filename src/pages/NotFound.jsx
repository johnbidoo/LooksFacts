import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 text-[clamp(2.4rem,5vw,4rem)] leading-tight font-semibold tracking-[-0.03em]">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-4 max-w-md">The link may be out of date, or the page may have moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button to="/">Back to home</Button>
        <Button to="/skinfacts" variant="secondary">
          Browse products
        </Button>
      </div>
    </section>
  )
}
