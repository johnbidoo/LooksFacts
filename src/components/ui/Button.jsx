import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none'

const variants = {
  primary: 'bg-ink text-white hover:bg-sage-deep',
  accent: 'bg-sage-deep text-white hover:bg-ink',
  secondary: 'border border-ink bg-white text-ink hover:bg-ink hover:text-white',
  ghost: 'text-ink hover:bg-sand',
  light: 'bg-white text-ink hover:bg-sage-soft',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-[0.95rem]',
}

/** Renders a router <Link> for `to`, an <a> for `href`, otherwise a <button>. */
export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, type = 'button', ...rest }) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}
