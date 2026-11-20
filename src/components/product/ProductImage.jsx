import { useState } from 'react'
import { getCategory } from '../../data/categories'
import { getProduct } from '../../data/products'
import { packTone } from '../../utils/packaging'

/**
 * Illustrated packaging placeholder. Real product photography is a brand
 * asset we don't have rights to yet, so each product gets a clean,
 * consistent illustration based on its category. When a product gains an
 * `image` URL, pass it via `src` and the photo is shown instead.
 */

function Label({ x, y, brand, color, width }) {
  const raw = (brand || '').toUpperCase()
  const text = raw.length > 18 ? `${raw.slice(0, 17)}…` : raw
  // Estimate rendered width (~0.68em per glyph + tracking) and shrink to fit
  // the label area so long brand names never spill off the packaging.
  const tracking = 1.2
  const estimate = (fs) => text.length * (fs * 0.68 + tracking)
  let fontSize = 9.5
  while (fontSize > 5.5 && estimate(fontSize) > width) fontSize -= 0.25
  const overflow = estimate(fontSize) > width
  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fill={color}
        fontFamily="Geist, system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight="600"
        letterSpacing={tracking}
        textLength={overflow ? width : undefined}
        lengthAdjust="spacingAndGlyphs"
      >
        {text}
      </text>
      <line x1={x - 10} x2={x + 10} y1={y + 9} y2={y + 9} stroke={color} strokeOpacity="0.35" strokeWidth="0.8" />
    </g>
  )
}

function Shape({ shape, tone, brand }) {
  const shadow = <ellipse cx="100" cy="214" rx="46" ry="5" fill="#1C1B19" opacity="0.07" />
  switch (shape) {
    case 'jar':
      return (
        <>
          <ellipse cx="100" cy="212" rx="62" ry="6" fill="#1C1B19" opacity="0.07" />
          <rect x="44" y="104" width="112" height="22" rx="4" fill={tone.cap} />
          <rect x="40" y="124" width="120" height="88" rx="12" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.06" />
          <Label x={100} y={170} brand={brand} color={tone.text} width={88} />
        </>
      )
    case 'dropper':
      return (
        <>
          {shadow}
          <rect x="88" y="40" width="24" height="34" rx="11" fill={tone.cap} />
          <rect x="84" y="70" width="32" height="26" rx="3" fill={tone.cap} />
          <rect x="62" y="94" width="76" height="118" rx="10" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.06" />
          <Label x={100} y={152} brand={brand} color={tone.text} width={58} />
        </>
      )
    case 'bottle':
      return (
        <>
          {shadow}
          <rect x="84" y="34" width="32" height="30" rx="4" fill={tone.cap} />
          <path d="M78 64h44l6 18v122a8 8 0 0 1-8 8H80a8 8 0 0 1-8-8V82Z" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.06" />
          <Label x={100} y={144} brand={brand} color={tone.text} width={44} />
        </>
      )
    case 'pump':
      return (
        <>
          <ellipse cx="100" cy="214" rx="34" ry="4" fill="#1C1B19" opacity="0.07" />
          <rect x="94" y="62" width="12" height="22" fill={tone.cap} />
          <rect x="94" y="62" width="34" height="8" rx="3" fill={tone.cap} />
          <rect x="84" y="82" width="32" height="18" rx="4" fill={tone.cap} />
          <rect x="72" y="98" width="56" height="114" rx="14" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.06" />
          <Label x={100} y={156} brand={brand} color={tone.text} width={40} />
        </>
      )
    case 'smalltube':
      return (
        <>
          <ellipse cx="100" cy="214" rx="32" ry="4" fill="#1C1B19" opacity="0.07" />
          <path d="M74 64h52l-6 118H80Z" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.06" />
          <rect x="72" y="58" width="56" height="8" rx="2" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.08" />
          <rect x="82" y="180" width="36" height="32" rx="5" fill={tone.cap} />
          <Label x={100} y={124} brand={brand} color={tone.text} width={40} />
        </>
      )
    case 'tube':
    default:
      return (
        <>
          {shadow}
          <path d="M66 38h68l-8 140H74Z" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.06" />
          <rect x="63" y="32" width="74" height="9" rx="2" fill={tone.body} stroke="#1C1B19" strokeOpacity="0.08" />
          <rect x="76" y="176" width="48" height="36" rx="6" fill={tone.cap} />
          <Label x={100} y={108} brand={brand} color={tone.text} width={52} />
        </>
      )
  }
}

export default function ProductImage({
  category,
  brand,
  seed,
  src,
  alt = '',
  className = '',
  rounded = 'rounded-card',
  hoverZoom = false,
  bare = false,
  priority = false, // eager-load (above-the-fold images such as the hero)
}) {
  const cat = getCategory(category)
  const tone = packTone(seed ?? `${brand}${category}`)
  // `seed` is the product ID wherever a real product is shown, so photos
  // dropped into src/assets/products/ are picked up everywhere automatically.
  const photo = src ?? getProduct(seed ?? '')?.image ?? null
  const [failedSrc, setFailedSrc] = useState(null)
  const showPhoto = photo && failedSrc !== photo

  return (
    <div
      className={`relative isolate overflow-hidden ${rounded} ${className}`}
      style={bare ? undefined : { backgroundColor: cat.tint }}
    >
      {showPhoto ? (
        <img
          src={photo}
          alt={alt || `${brand ?? ''} ${cat.singular}`.trim()}
          width="800"
          height="800"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailedSrc(photo)}
          // Studio shots on white blend into the tile colour
          className={`h-full w-full object-contain p-[9%] mix-blend-multiply transition-transform duration-700 ease-soft ${
            hoverZoom ? 'group-hover:scale-[1.04]' : ''
          }`}
        />
      ) : (
        <svg
          viewBox="0 0 200 240"
          className={`h-full w-full transition-transform duration-700 ease-soft ${
            hoverZoom ? 'group-hover:scale-[1.04]' : ''
          }`}
          role="img"
          aria-label={alt || `${brand ?? ''} ${cat.singular} placeholder illustration`.trim()}
        >
          <Shape shape={cat.shape} tone={tone} brand={brand} />
        </svg>
      )}
    </div>
  )
}
