/**
 * Minimal line-icon set (1.5px stroke, 24px grid). Inline SVG so we don't
 * need an icon dependency.
 */
const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M4.75 20c.9-3.6 3.8-5.5 7.25-5.5s6.35 1.9 7.25 5.5" />
    </>
  ),
  menu: <path d="M4 7.5h16M4 12h16M4 16.5h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  arrowUp: <path d="M12 19V5m-5 5 5-5 5 5" />,
  arrowDown: <path d="M12 5v14m-5-5 5 5 5-5" />,
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l.8 12.2c.1.9.8 1.8 1.8 1.8h5.8c1 0 1.7-.9 1.8-1.8L17.5 7" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.75v.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 3 19.5h18L12 4Z" />
      <path d="M12 10v4.5M12 17v.25" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.75" />
      <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </>
  ),
  moon: <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" />,
  sliders: (
    <>
      <path d="M4 7h10m4 0h2M4 17h4m4 0h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  swap: <path d="M7 4 4 7l3 3M4 7h13M17 20l3-3-3-3M20 17H7" />,
  external: <path d="M14 5h5v5M19 5l-8 8M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10" />,
  leaf: (
    <>
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  list: <path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" />,
  wallet: (
    <>
      <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6H18a1 1 0 0 1 1 1v2.5" />
      <path d="M4 7.5v10A1.5 1.5 0 0 0 5.5 19H19a1 1 0 0 0 1-1v-7.5a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 1 4 7.5Z" />
      <path d="M16 14.25h.01" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 4h5M10 4v5.5L5.2 17.6A1.6 1.6 0 0 0 6.6 20h10.8a1.6 1.6 0 0 0 1.4-2.4L14 9.5V4" />
      <path d="M7.5 14h9" />
    </>
  ),
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.5, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  )
}
