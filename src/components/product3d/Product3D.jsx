import { CameraControls, CameraControlsImpl, Center, Environment, Gltf, Lightformer, Resize } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import Packaging3D, { StudioShadow } from './Packaging3D'

/**
 * Optional real 3D models: drop `<product-id>.glb` into src/assets/models/
 * and it replaces the procedural packaging for that product.
 */
const MODELS = Object.fromEntries(
  Object.entries(import.meta.glob('../../assets/models/*.glb', { eager: true, query: '?url', import: 'default' })).map(
    ([path, url]) => [path.split('/').pop().replace(/\.glb$/, ''), url],
  ),
)

const { ACTION } = CameraControlsImpl

const POLAR = Math.PI / 2.15 // slightly above eye level
const VIEWS = [
  { id: 'front', label: 'Front', azimuth: 0 },
  { id: 'side', label: 'Side', azimuth: Math.PI / 2 },
  { id: 'back', label: 'Back', azimuth: Math.PI },
]

/** Studio lighting from in-scene light panels — no external HDR download. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2} position={[-5, 1, 1]} scale={[3, 6, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.5} position={[5, 1, -1]} scale={[3, 6, 1]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={0.8} position={[0, 1, -6]} scale={4} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.6} position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} color="#f2ede5" />
    </Environment>
  )
}

/** Slow turntable spin while the user isn't interacting. */
function AutoSpin({ controls, enabled }) {
  useFrame((_, delta) => {
    if (enabled) controls.current?.rotate(delta * 0.35, 0, false)
  })
  return null
}

function Model({ product }) {
  const url = MODELS[product.id]
  if (url) {
    return (
      <group position-y={-1.1}>
        <Center bottom>
          <Resize height scale={2.2}>
            <Gltf src={url} castShadow receiveShadow />
          </Resize>
        </Center>
        <StudioShadow />
      </group>
    )
  }
  return <Packaging3D product={product} />
}

export default function Product3D({ product }) {
  const controls = useRef(null)
  const [spin, setSpin] = useState(true)
  const [view, setView] = useState(null)
  const idleTimer = useRef(null)

  useEffect(() => () => clearTimeout(idleTimer.current), [])

  const goTo = (v) => {
    const c = controls.current
    if (!c) return
    setSpin(false)
    setView(v.id)
    c.normalizeRotations()
    // Take the shortest way round to the target angle
    let target = v.azimuth
    const current = c.azimuthAngle
    while (target - current > Math.PI) target -= Math.PI * 2
    while (target - current < -Math.PI) target += Math.PI * 2
    c.rotateTo(target, POLAR, true)
  }

  const zoom = (dir) => {
    setSpin(false)
    controls.current?.dolly(dir * 0.9, true)
  }

  const reset = () => {
    setView(null)
    controls.current?.reset(true)
    setSpin(true)
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-card bg-[radial-gradient(120%_90%_at_50%_30%,#ffffff_0%,#f3f0eb_60%,#e9e4dc_100%)]">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.35, 6], fov: 30, near: 0.1, far: 50 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.1
        }}
        aria-label={`Interactive 3D view of ${product.brand} ${product.name}`}
        role="img"
      >
        <Suspense fallback={null}>
          <Studio />
          <directionalLight position={[2.5, 5, 3]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
          <ambientLight intensity={0.45} />
          <Model product={product} />
        </Suspense>
        <CameraControls
          ref={controls}
          makeDefault
          minDistance={2.6}
          maxDistance={9}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.58}
          smoothTime={0.28}
          draggingSmoothTime={0.12}
          // Rotate + zoom only; no panning so the product stays centred
          mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.DOLLY, right: ACTION.NONE, wheel: ACTION.DOLLY }}
          touches={{ one: ACTION.TOUCH_ROTATE, two: ACTION.TOUCH_DOLLY, three: ACTION.NONE }}
          onStart={() => {
            setSpin(false)
            setView(null)
            clearTimeout(idleTimer.current)
          }}
          onEnd={() => {
            clearTimeout(idleTimer.current)
            idleTimer.current = setTimeout(() => setSpin(true), 6000)
          }}
        />
        <AutoSpin controls={controls} enabled={spin} />
      </Canvas>

      {/* Hint */}
      <p className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[0.7rem] font-medium text-ink-soft backdrop-blur">
        Drag to rotate · Scroll or pinch to zoom
      </p>

      {/* Controls */}
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-full bg-white/90 p-1 shadow-sm backdrop-blur" role="group" aria-label="Camera views">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => goTo(v)}
              aria-pressed={view === v.id}
              className={`h-8 rounded-full px-3 text-xs font-semibold transition-colors ${
                view === v.id ? 'bg-ink text-white' : 'text-ink hover:bg-sand'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-sm backdrop-blur">
          <button type="button" onClick={() => zoom(1)} aria-label="Zoom in" className="grid h-8 w-8 place-items-center rounded-full text-ink hover:bg-sand">
            <Icon name="plus" size={16} />
          </button>
          <button type="button" onClick={() => zoom(-1)} aria-label="Zoom out" className="grid h-8 w-8 place-items-center rounded-full text-ink hover:bg-sand">
            <Icon name="minus" size={16} />
          </button>
          <button
            type="button"
            onClick={() => setSpin((s) => !s)}
            aria-pressed={spin}
            aria-label={spin ? 'Pause rotation' : 'Auto-rotate'}
            className={`grid h-8 w-8 place-items-center rounded-full ${spin ? 'bg-ink text-white' : 'text-ink hover:bg-sand'}`}
          >
            <Icon name="swap" size={15} />
          </button>
          <button type="button" onClick={reset} className="h-8 rounded-full px-3 text-xs font-semibold text-ink hover:bg-sand">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
