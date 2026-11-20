/**
 * Shared packaging colourways used by both the 2D illustrations
 * (ProductImage) and the 3D models (Product3D), so a product looks the
 * same in both. Chosen deterministically from the product ID.
 */
export const PACK_TONES = [
  { body: '#FFFFFF', cap: '#1C1B19', text: '#1C1B19' },
  { body: '#F7F3EC', cap: '#B98A6E', text: '#3D3832' },
  { body: '#DCE3D5', cap: '#56644F', text: '#2F382B' },
  { body: '#FFFFFF', cap: '#7D8C74', text: '#2F382B' },
  { body: '#2A2926', cap: '#C9BBA6', text: '#F2EDE5' },
  { body: '#EFE4D8', cap: '#FFFFFF', text: '#3D3832' },
]

export function hash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export const packTone = (seed = '') => PACK_TONES[hash(seed) % PACK_TONES.length]
