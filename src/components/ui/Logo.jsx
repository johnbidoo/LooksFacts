import { Link } from 'react-router-dom'

export function LogoMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-sage-deep" />
      <path d="M11 8.5v15h10.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21.5" cy="10.5" r="2.6" fill="#C9D8C0" />
    </svg>
  )
}

export default function Logo({ className = '', inverted = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="LooksFacts home">
      <LogoMark className="h-8 w-8" />
      <span className={`text-[1.3rem] leading-none font-bold tracking-[-0.04em] ${inverted ? 'text-white' : 'text-ink'}`}>
        LooksFacts
      </span>
    </Link>
  )
}
