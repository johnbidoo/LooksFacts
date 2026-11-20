import { ContactShadows } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { BoxGeometry, CylinderGeometry, LatheGeometry, Vector2 } from 'three'
import { getCategory } from '../../data/categories'
import { packTone } from '../../utils/packaging'
import { backLabel, frontLabel } from './labelTexture'

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const SEG = 72

/** Points for a lathe with rounded bottom/top edges. */
function roundedProfile(r, h, cr = 0.06, top = true) {
  const pts = [new Vector2(0, 0)]
  const arc = (cx, cy, a0, a1) => {
    for (let i = 0; i <= 8; i++) {
      const a = a0 + ((a1 - a0) * i) / 8
      pts.push(new Vector2(cx + Math.cos(a) * cr, cy + Math.sin(a) * cr))
    }
  }
  arc(r - cr, cr, -Math.PI / 2, 0)
  if (top) {
    arc(r - cr, h - cr, 0, Math.PI / 2)
    pts.push(new Vector2(0, h))
  } else {
    pts.push(new Vector2(r, h))
  }
  return pts
}

/** Bottle with rounded base, shoulder and neck. */
function bottleProfile(r, bodyH, neckR, neckH, shoulder = 0.25, cr = 0.08) {
  const pts = [new Vector2(0, 0)]
  for (let i = 0; i <= 8; i++) {
    const a = -Math.PI / 2 + (Math.PI / 2) * (i / 8)
    pts.push(new Vector2(r - cr + Math.cos(a) * cr, cr + Math.sin(a) * cr))
  }
  pts.push(new Vector2(r, bodyH - shoulder))
  for (let i = 1; i <= 12; i++) {
    const t = i / 12
    const ease = 1 - (1 - t) * (1 - t)
    pts.push(new Vector2(r + (neckR - r) * ease, bodyH - shoulder + shoulder * t))
  }
  pts.push(new Vector2(neckR, bodyH + neckH))
  pts.push(new Vector2(0, bodyH + neckH))
  return pts
}

/**
 * Squeeze-tube flattening: progressively widens in x and flattens in z
 * towards the crimped end (top), like a real cosmetic tube.
 */
function flattenTube(geom, y0, y1, widen = 1.22, flat = 0.08) {
  const pos = geom.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    const t = Math.min(1, Math.max(0, (y - y0) / (y1 - y0)))
    const k = Math.pow(t, 1.6)
    pos.setX(i, pos.getX(i) * (1 + (widen - 1) * k))
    pos.setZ(i, pos.getZ(i) * (1 - (1 - flat) * k))
  }
  pos.needsUpdate = true
  geom.computeVertexNormals()
  return geom
}

/** Open cylinder segment used to wrap a label around the packaging. */
function labelBand(r, h, centre, arc) {
  return new CylinderGeometry(r, r, h, SEG, 1, true, centre - arc / 2, arc)
}

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

function Plastic({ color, gloss = 0.5 }) {
  return <meshPhysicalMaterial color={color} roughness={0.34} clearcoat={gloss} clearcoatRoughness={0.25} />
}

function Cap({ color }) {
  return <meshPhysicalMaterial color={color} roughness={0.42} metalness={0.05} clearcoat={0.3} clearcoatRoughness={0.4} />
}

function Glass() {
  return (
    <meshPhysicalMaterial color="#dfe6e1" transmission={0.92} roughness={0.08} thickness={0.6} ior={1.48} attenuationColor="#c9d6cf" attenuationDistance={1.2} clearcoat={1} clearcoatRoughness={0.05} />
  )
}

function Label({ map }) {
  return <meshStandardMaterial map={map} transparent roughness={0.55} polygonOffset polygonOffsetFactor={-2} depthWrite={false} />
}

/* ------------------------------------------------------------------ */
/* Shapes. Each is built standing on y = 0.                            */
/* ------------------------------------------------------------------ */

function Jar({ tone, front, back }) {
  const g = useMemo(() => {
    const r = 1
    const h = 0.86
    return {
      body: new LatheGeometry(roundedProfile(r, h, 0.1, false), SEG),
      lid: new LatheGeometry(roundedProfile(1.03, 0.4, 0.07), SEG),
      front: labelBand(r * 1.004, 0.62, 0, Math.PI * 0.62),
      back: labelBand(r * 1.004, 0.62, Math.PI, Math.PI * 0.62),
    }
  }, [])
  useDisposeAll(g)
  return (
    <group>
      <mesh geometry={g.body} castShadow receiveShadow>
        <Plastic color={tone.body} />
      </mesh>
      <mesh geometry={g.front} position-y={0.43}>
        <Label map={front} />
      </mesh>
      <mesh geometry={g.back} position-y={0.43}>
        <Label map={back} />
      </mesh>
      <mesh geometry={g.lid} position-y={0.86} castShadow>
        <Cap color={tone.cap} />
      </mesh>
    </group>
  )
}

function Tube({ tone, front, back, small = false }) {
  const s = small ? 0.62 : 1
  const g = useMemo(() => {
    const r = 0.48 * s
    const capH = 0.42 * s
    const bodyH = 2.0 * s
    const body = new CylinderGeometry(r, r, bodyH, SEG, 40, true)
    body.translate(0, capH + bodyH / 2, 0)
    flattenTube(body, capH, capH + bodyH)
    const shoulder = new LatheGeometry(roundedProfile(r, 0.08 * s, 0.05 * s, false), SEG)
    shoulder.rotateX(Math.PI)
    shoulder.translate(0, capH + 0.08 * s, 0)
    const fl = labelBand(r * 1.006, bodyH * 0.6, 0, Math.PI * 0.8)
    fl.translate(0, capH + bodyH * 0.42, 0)
    flattenTube(fl, capH, capH + bodyH)
    const bl = labelBand(r * 1.006, bodyH * 0.6, Math.PI, Math.PI * 0.8)
    bl.translate(0, capH + bodyH * 0.42, 0)
    flattenTube(bl, capH, capH + bodyH)
    return {
      body,
      shoulder,
      front: fl,
      back: bl,
      cap: new LatheGeometry(roundedProfile(r * 0.92, capH, 0.05 * s), SEG),
      crimp: new BoxGeometry(r * 2 * 1.22 + 0.02, 0.16 * s, 0.07 * s),
      crimpY: capH + bodyH + 0.04 * s,
    }
  }, [s])
  useDisposeAll(g)
  return (
    <group>
      <mesh geometry={g.cap} castShadow>
        <Cap color={tone.cap} />
      </mesh>
      <mesh geometry={g.shoulder} castShadow>
        <Plastic color={tone.body} />
      </mesh>
      <mesh geometry={g.body} castShadow receiveShadow>
        <meshPhysicalMaterial color={tone.body} roughness={0.38} clearcoat={0.4} side={2} />
      </mesh>
      <mesh geometry={g.front}>
        <Label map={front} />
      </mesh>
      <mesh geometry={g.back}>
        <Label map={back} />
      </mesh>
      <mesh geometry={g.crimp} position-y={g.crimpY} castShadow>
        <Plastic color={tone.body} gloss={0.2} />
      </mesh>
    </group>
  )
}

function Dropper({ tone, front, back }) {
  const g = useMemo(() => {
    const r = 0.56
    return {
      glass: new LatheGeometry(bottleProfile(r, 1.25, 0.2, 0.12, 0.28, 0.1), SEG),
      liquid: new LatheGeometry(roundedProfile(r * 0.9, 0.8, 0.08), SEG),
      front: labelBand(r * 1.006, 0.6, 0, Math.PI * 0.7),
      back: labelBand(r * 1.006, 0.6, Math.PI, Math.PI * 0.7),
      collar: new LatheGeometry(roundedProfile(0.27, 0.36, 0.04), SEG),
      bulb: new LatheGeometry(
        [
          [0, 0],
          [0.17, 0],
          [0.18, 0.08],
          [0.17, 0.3],
          [0.15, 0.4],
          [0.1, 0.46],
          [0, 0.48],
        ].map(([x, y]) => new Vector2(x, y)),
        SEG,
      ),
    }
  }, [])
  useDisposeAll(g)
  return (
    <group>
      <mesh geometry={g.liquid} position-y={0.04}>
        <meshPhysicalMaterial color={tone.body === '#2A2926' ? '#C9A46B' : '#E8D3A8'} roughness={0.1} transmission={0.6} thickness={0.6} />
      </mesh>
      <mesh geometry={g.glass} castShadow receiveShadow>
        <Glass />
      </mesh>
      <mesh geometry={g.front} position-y={0.52}>
        <meshStandardMaterial color={tone.body} roughness={0.6} />
      </mesh>
      <mesh geometry={g.front} position-y={0.52} scale={1.002}>
        <Label map={front} />
      </mesh>
      <mesh geometry={g.back} position-y={0.52} scale={1.002}>
        <Label map={back} />
      </mesh>
      <mesh geometry={g.collar} position-y={1.33} castShadow>
        <Cap color={tone.cap} />
      </mesh>
      <mesh geometry={g.bulb} position-y={1.67} castShadow>
        <meshPhysicalMaterial color={tone.cap} roughness={0.6} sheen={0.4} />
      </mesh>
    </group>
  )
}

function Bottle({ tone, front, back }) {
  const g = useMemo(() => {
    const r = 0.58
    return {
      body: new LatheGeometry(bottleProfile(r, 1.75, 0.24, 0.1, 0.3, 0.1), SEG),
      cap: new LatheGeometry(roundedProfile(0.3, 0.42, 0.05), SEG),
      front: labelBand(r * 1.006, 0.95, 0, Math.PI * 0.75),
      back: labelBand(r * 1.006, 0.95, Math.PI, Math.PI * 0.75),
    }
  }, [])
  useDisposeAll(g)
  return (
    <group>
      <mesh geometry={g.body} castShadow receiveShadow>
        <Plastic color={tone.body} />
      </mesh>
      <mesh geometry={g.front} position-y={0.75}>
        <Label map={front} />
      </mesh>
      <mesh geometry={g.back} position-y={0.75}>
        <Label map={back} />
      </mesh>
      <mesh geometry={g.cap} position-y={1.83} castShadow>
        <Cap color={tone.cap} />
      </mesh>
    </group>
  )
}

function Pump({ tone, front, back }) {
  const g = useMemo(() => {
    const r = 0.42
    return {
      body: new LatheGeometry(roundedProfile(r, 1.35, 0.12, false), SEG),
      front: labelBand(r * 1.006, 0.8, 0, Math.PI * 0.75),
      back: labelBand(r * 1.006, 0.8, Math.PI, Math.PI * 0.75),
      collar: new LatheGeometry(roundedProfile(0.22, 0.18, 0.03), SEG),
      stem: new CylinderGeometry(0.06, 0.06, 0.18, 24),
      head: new LatheGeometry(roundedProfile(0.16, 0.16, 0.05), SEG),
      nozzle: new CylinderGeometry(0.035, 0.04, 0.22, 16),
    }
  }, [])
  useDisposeAll(g)
  return (
    <group>
      <mesh geometry={g.body} castShadow receiveShadow>
        <Plastic color={tone.body} />
      </mesh>
      <mesh geometry={g.front} position-y={0.62}>
        <Label map={front} />
      </mesh>
      <mesh geometry={g.back} position-y={0.62}>
        <Label map={back} />
      </mesh>
      <mesh geometry={g.collar} position-y={1.35} castShadow>
        <Cap color={tone.cap} />
      </mesh>
      <mesh geometry={g.stem} position-y={1.62}>
        <Cap color={tone.cap} />
      </mesh>
      <mesh geometry={g.head} position-y={1.68} castShadow>
        <Cap color={tone.cap} />
      </mesh>
      <mesh geometry={g.nozzle} position={[0, 1.77, 0.17]} rotation-x={Math.PI / 2}>
        <Cap color={tone.cap} />
      </mesh>
    </group>
  )
}

/** Dispose memoised geometries when the shape unmounts. */
function useDisposeAll(g) {
  useEffect(
    () => () => Object.values(g).forEach((v) => v && typeof v.dispose === 'function' && v.dispose()),
    [g],
  )
}

/** Approximate bounding sizes (height, max width) before normalising. */
const DIMS = {
  jar: [1.26, 2.06],
  tube: [2.5, 1.2],
  smalltube: [1.55, 0.75],
  dropper: [2.15, 1.12],
  bottle: [2.25, 1.16],
  pump: [1.95, 0.84],
}

/**
 * Procedural packaging model for a product, normalised to fit the viewer
 * and centred on the origin. Returns its scaled height via `onHeight`.
 */
export default function Packaging3D({ product, targetHeight = 2.2 }) {
  const cat = getCategory(product.category)
  const tone = packTone(product.id)
  const textColor = tone.text

  const maps = useMemo(
    () => ({ front: frontLabel(product, cat.singular, textColor), back: backLabel(product, textColor) }),
    [product, cat.singular, textColor],
  )
  useEffect(() => () => Object.values(maps).forEach((m) => m.dispose()), [maps])

  const [h, w] = DIMS[cat.shape] ?? DIMS.bottle
  const scale = targetHeight / Math.max(h, w * 0.95)
  const props = { tone, front: maps.front, back: maps.back }

  let shape
  switch (cat.shape) {
    case 'jar':
      shape = <Jar {...props} />
      break
    case 'tube':
      shape = <Tube {...props} />
      break
    case 'smalltube':
      shape = <Tube {...props} small />
      break
    case 'dropper':
      shape = <Dropper {...props} />
      break
    case 'pump':
      shape = <Pump {...props} />
      break
    default:
      shape = <Bottle {...props} />
  }

  return (
    // Centred vertically; the contact shadow sits exactly at the product's base
    <group position-y={(-h * scale) / 2}>
      <group scale={scale}>{shape}</group>
      <StudioShadow />
    </group>
  )
}

/** Soft studio contact shadow, placed at y = 0 of its parent. */
export function StudioShadow() {
  return <ContactShadows position-y={-0.005} opacity={0.4} scale={7} blur={2.6} far={2.5} resolution={512} color="#3a332b" />
}
