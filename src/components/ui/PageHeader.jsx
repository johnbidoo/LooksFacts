/** Standard header for top-level tool pages. */
export default function PageHeader({ eyebrow, title, intro, aside, children, tone = 'sand' }) {
  return (
    <header className={tone === 'sand' ? 'bg-sand' : 'bg-white'}>
      <div className="container-page grid gap-6 py-10 md:py-14 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-[1.05rem]">{intro}</p>}
        </div>
        {aside && <div className="lg:col-span-4 lg:justify-self-end">{aside}</div>}
      </div>
      {children}
    </header>
  )
}
