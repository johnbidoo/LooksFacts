import { Component, lazy, Suspense, useState } from 'react'
import ProductImage from '../product/ProductImage'

// Three.js is only downloaded when a product page is opened.
const Product3D = lazy(() => import('./Product3D'))

function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}
const WEBGL = typeof window !== 'undefined' && supportsWebGL()

/** Falls back to the flat image if the 3D viewer throws. */
class ViewerBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Product media with a 3D / image toggle. Shows the product photo first when
 * one exists, otherwise the interactive 3D model (where WebGL is available).
 */
export default function ProductViewer({ product }) {
  // Real photos are the default view; otherwise the 3D model (where WebGL works)
  const [mode, setMode] = useState(product.image || !WEBGL ? 'image' : '3d')

  const image = (
    <ProductImage
      category={product.category}
      brand={product.brand}
      seed={product.id}
      src={product.image}
      alt={`${product.brand} ${product.name}`}
      className="h-full w-full"
    />
  )

  return (
    <div>
      <div className="relative aspect-square w-full">
        {mode === '3d' ? (
          <ViewerBoundary fallback={image}>
            <Suspense
              fallback={
                <div className="relative h-full w-full">
                  {image}
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-soft">
                    Loading 3D view…
                  </span>
                </div>
              }
            >
              <Product3D product={product} />
            </Suspense>
          </ViewerBoundary>
        ) : (
          image
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        {WEBGL ? (
          <div className="inline-flex rounded-full bg-sand p-1" role="group" aria-label="Product view">
            {[
              ['3d', '3D view'],
              ['image', product.image ? 'Photo' : 'Image'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
                className={`h-8 rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-colors ${
                  mode === id ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <p className="text-right text-xs text-ink-soft">
          {mode === '3d' ? 'Illustrative 3D model — not actual packaging' : product.image ? 'Product photo' : 'Illustration'}
        </p>
      </div>
    </div>
  )
}
