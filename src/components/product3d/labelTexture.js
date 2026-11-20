import { CanvasTexture, SRGBColorSpace } from 'three'

const FONT = 'Geist, system-ui, "Segoe UI", sans-serif'

/** Wrap text into lines that fit `maxWidth`. */
function wrap(ctx, text, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

/** Largest font size (<= max) at which `text` fits in `width`. */
function fit(ctx, text, weight, max, width) {
  let size = max
  do {
    ctx.font = `${weight} ${size}px ${FONT}`
    size -= 2
  } while (ctx.measureText(text).width > width && size > 16)
  return size + 2
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

function toTexture(canvas) {
  const t = new CanvasTexture(canvas)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  return t
}

/**
 * Front label: brand, product name, category and size.
 * Drawn with a transparent background so it sits on the packaging colour.
 */
export function frontLabel(product, categoryLabel, color) {
  const W = 1024
  const H = 640
  const [c, ctx] = makeCanvas(W, H)
  const pad = 110
  const maxW = W - pad * 2
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  const brand = product.brand.toUpperCase()
  const bSize = fit(ctx, brand, 700, 96, maxW)
  ctx.font = `700 ${bSize}px ${FONT}`
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(bSize * 0.12)}px`
  ctx.fillText(brand, W / 2, 210)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  ctx.globalAlpha = 0.4
  ctx.fillRect(W / 2 - 50, 250, 100, 4)
  ctx.globalAlpha = 1

  ctx.font = `500 54px ${FONT}`
  const lines = wrap(ctx, product.name, maxW).slice(0, 3)
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 340 + i * 66))

  ctx.globalAlpha = 0.65
  ctx.font = `400 36px ${FONT}`
  ctx.fillText(`${categoryLabel} · ${product.size}`, W / 2, 340 + lines.length * 66 + 40)
  ctx.globalAlpha = 1
  return toTexture(c)
}

/** Back label: key ingredients and an "illustrative model" note. */
export function backLabel(product, color) {
  const W = 1024
  const H = 640
  const [c, ctx] = makeCanvas(W, H)
  const pad = 120
  const maxW = W - pad * 2
  ctx.fillStyle = color
  ctx.textAlign = 'left'

  ctx.font = `700 34px ${FONT}`
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px'
  ctx.fillText('KEY INGREDIENTS', pad, 150)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  ctx.font = `400 40px ${FONT}`
  let y = 215
  for (const line of wrap(ctx, product.keyIngredients.join(' · '), maxW).slice(0, 4)) {
    ctx.fillText(line, pad, y)
    y += 54
  }

  ctx.globalAlpha = 0.35
  ctx.fillRect(pad, y + 6, maxW, 2)
  ctx.globalAlpha = 0.6
  ctx.font = `400 28px ${FONT}`
  y += 56
  for (const line of wrap(
    ctx,
    'Brand-promoted key ingredients only — not a full ingredient list. Illustrative LooksFacts model, not actual packaging.',
    maxW,
  )) {
    ctx.fillText(line, pad, y)
    y += 38
  }
  ctx.globalAlpha = 1

  // Simple barcode motif
  let x = W - pad - 170
  for (let i = 0; i < 34; i++) {
    const w = (i * 7) % 3 === 0 ? 6 : 3
    ctx.fillRect(x, H - 150, w, 70)
    x += w + 2
  }
  return toTexture(c)
}
