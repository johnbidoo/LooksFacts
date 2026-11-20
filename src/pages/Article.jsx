import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { getArticle } from '../data/articles'
import NotFound from './NotFound'

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mt-14 mb-4 text-[1.6rem] leading-tight font-semibold tracking-[-0.015em]">
          {block.text}
        </h2>
      )
    case 'list':
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4">
              <span className="mt-[0.7em] h-px w-4 shrink-0 bg-sage" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <aside className="my-10 rounded-card border-l-2 border-sage bg-sage-soft/60 px-6 py-6 sm:px-8">
          <p className="flex items-center gap-2 text-[0.94rem] font-medium text-ink">
            <Icon name="info" size={18} className="text-sage-deep" />
            {block.title}
          </p>
          <p className="mt-2">{block.text}</p>
        </aside>
      )
    case 'p':
    default:
      return <p className="my-5">{block.text}</p>
  }
}

export default function Article() {
  const { slug } = useParams()
  const article = getArticle(slug)
  if (!article) return <NotFound />

  return (
    <article>
      <header className="border-b border-line bg-sand">
        <div className="container-page max-w-[52rem] pt-10 pb-14 md:pt-14 md:pb-20">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
            <Icon name="arrowLeft" size={16} /> Home
          </Link>
          <p className="eyebrow mt-10">
            {article.topic} · {article.readingTime}
          </p>
          <h1 className="mt-5 animate-fade-up text-[clamp(2.3rem,5vw,3.8rem)] leading-[1.06] font-semibold tracking-[-0.03em]">
            {article.title}
          </h1>
          <p className="mt-6 text-[1.12rem] leading-[1.7]">{article.dek}</p>
        </div>
      </header>

      <div className="container-page max-w-[52rem] py-12 text-[1.04rem] leading-[1.8] md:py-16">
        {article.body.map((b, i) => (
          <Block key={i} block={b} />
        ))}

        <div className="mt-16 border-t border-line pt-8">
          <h2 className="eyebrow">Further reading</h2>
          <ul className="mt-4 space-y-2 text-[0.94rem]">
            {article.furtherReading.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="mt-8 text-[0.85rem] leading-relaxed text-ink-soft">
            This article is general information and is not medical advice. If you have concerns about
            your skin or sun exposure, speak with a GP or dermatologist.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button to="/skinfacts?category=sunscreen">
            Browse sunscreens <Icon name="arrowRight" size={16} />
          </Button>
          <Button to="/routine" variant="secondary">
            Add SPF to your routine
          </Button>
        </div>
      </div>
    </article>
  )
}
