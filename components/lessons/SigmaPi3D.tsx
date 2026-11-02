"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export type CarbonMol = "ethane" | "ethene" | "ethyne";
export type Layer = "sigma" | "pi";

type Vec3 = [number, number, number];

const SIGMA_COLOR = "#34d399";
const PI_COLOR    = "#60a5fa";
const PI2_COLOR   = "#a78bfa";   // ethyne's second π bond, so the two can be told apart
const C_COLOR     = "#6b7280";
const H_COLOR     = "#f1f5f9";

const C_R = 0.4;
const H_R = 0.26;
const STICK_R = 0.075;

// ── Geometry ─────────────────────────────────────────────────────────────────
// C–C axis is x. Ethene lies flat in the xz plane so its π lobes point up/down (±y).
// C–C distance shrinks with more shared pairs: 1.54 → 1.34 → 1.20 Å, scaled.

const HALF: Record<CarbonMol, number> = { ethane: 1.2, ethene: 1.05, ethyne: 0.95 };
const CH_LEN = 1.4;

// H positions around one carbon in its local frame (carbon at origin, +x points away from the other carbon)
function hydrogens(mol: CarbonMol, staggerDeg = 0): Vec3[] {
  if (mol === "ethyne") return [[CH_LEN, 0, 0]];
  if (mol === "ethene") {
    // 120° from the C=C axis, in the molecular plane
    const ax = CH_LEN * Math.cos(Math.PI / 3), r = CH_LEN * Math.sin(Math.PI / 3);
    return [[ax, 0, r], [ax, 0, -r]];
  }
  // tetrahedral: 109.5° from the C–C axis, three H's 120° apart around it
  const tilt = (109.5 * Math.PI) / 180;
  const ax = -CH_LEN * Math.cos(tilt), r = CH_LEN * Math.sin(tilt);
  return [90, 210, 330].map(deg => {
    const a = ((deg + staggerDeg) * Math.PI) / 180;
    return [ax, r * Math.cos(a), r * Math.sin(a)] as Vec3;
  });
}

// Bond regions as capsules lying along x (or along y when vertical, for p orbitals)
interface LobeDef { layer: Layer; pos: Vec3; radius: number; length: number; squash: Vec3; color: string; vertical?: boolean }

const sigmaLobe = (half: number): LobeDef => ({
  layer: "sigma", pos: [0, 0, 0], radius: 0.3, length: half * 1.3, squash: [1, 1, 1], color: SIGMA_COLOR,
});

const piPair = (half: number, axis: "y" | "z", offset: number, color: string): LobeDef[] =>
  [1, -1].map(dir => ({
    layer: "pi" as const,
    pos: (axis === "y" ? [0, dir * offset, 0] : [0, 0, dir * offset]) as Vec3,
    radius: 0.25,
    length: half * 1.05,
    // flattened toward the axis, a little wider sideways
    squash: (axis === "y" ? [1, 0.85, 1.15] : [1, 1.15, 0.85]) as Vec3,
    color,
  }));

const LOBES: Record<CarbonMol, LobeDef[]> = {
  ethane: [sigmaLobe(HALF.ethane)],
  ethene: [sigmaLobe(HALF.ethene), ...piPair(HALF.ethene, "y", 0.64, PI_COLOR)],
  ethyne: [
    sigmaLobe(HALF.ethyne),
    ...piPair(HALF.ethyne, "y", 0.62, PI_COLOR),
    ...piPair(HALF.ethyne, "z", 0.62, PI2_COLOR),
  ],
};

// ── Fresnel "isosurface" material ────────────────────────────────────────────
// Nearly clear where the surface faces you, bright at the silhouette — the look of a
// density isosurface in molecular modeling software. Atoms and sticks stay visible inside.

const LOBE_OPACITY = 0.9;

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float rim = pow(1.0 - facing, 2.2);
    vec3 col = mix(uColor * 0.8, mix(uColor, vec3(1.0), 0.3), rim);
    gl_FragColor = vec4(col, uOpacity * (0.12 + 0.55 * rim));
    #include <colorspace_fragment>
  }
`;

function Lobe({ def, visible, opacityScale = 1 }: { def: LobeDef; visible: boolean; opacityScale?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(def.color) }, uOpacity: { value: 0 } }),
    [def.color],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = visible ? LOBE_OPACITY * opacityScale : 0;
    const u = matRef.current.uniforms.uOpacity;
    u.value = THREE.MathUtils.lerp(u.value, target, Math.min(1, delta * 6));
  });

  return (
    // CapsuleGeometry runs along y — rotate it onto the C–C (x) axis unless it's a p orbital
    <mesh position={def.pos} scale={def.squash} rotation={[0, 0, def.vertical ? 0 : Math.PI / 2]}>
      <capsuleGeometry args={[def.radius, def.length, 16, 32]} />
      <shaderMaterial
        ref={matRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}
        transparent depthWrite={false}
      />
    </mesh>
  );
}

// ── Ball-and-stick pieces ────────────────────────────────────────────────────

function Atom({ pos, r, color }: { pos: Vec3; r: number; color: string }) {
  return (
    <mesh position={pos}>
      <sphereGeometry args={[r, 48, 48]} />
      <meshPhysicalMaterial color={color} roughness={0.35} metalness={0.05} clearcoat={0.6} clearcoatRoughness={0.25} />
    </mesh>
  );
}

const Y_AXIS = new THREE.Vector3(0, 1, 0);

function Stick({ a, b }: { a: Vec3; b: Vec3 }) {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, dir.normalize());
  const mid = va.add(vb).multiplyScalar(0.5);
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[STICK_R, STICK_R, len, 20]} />
      <meshPhysicalMaterial color="#9ca3af" roughness={0.4} metalness={0.1} clearcoat={0.4} />
    </mesh>
  );
}

// One carbon plus its hydrogens and C–H sticks. side = −1 (left) or +1 (right).
function CarbonEnd({ mol, side, staggerDeg = 0 }: { mol: CarbonMol; side: 1 | -1; staggerDeg?: number }) {
  const c: Vec3 = [side * HALF[mol], 0, 0];
  const hs = hydrogens(mol, staggerDeg).map(([hx, hy, hz]) => [c[0] + side * hx, hy, hz] as Vec3);
  return (
    <>
      <Atom pos={c} r={C_R} color={C_COLOR} />
      {hs.map((h, i) => (
        <group key={i}>
          <Stick a={c} b={h} />
          <Atom pos={h} r={H_R} color={H_COLOR} />
        </group>
      ))}
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={1.6} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#a5b4fc" />
      <directionalLight position={[0, 3, -6]} intensity={0.8} />
    </>
  );
}

// p orbital on a carbon (dumbbell along ±y), drawn as a faint ghost so the π overlap reads clearly
function POrbital({ x }: { x: number }) {
  return (
    <>
      {([1, -1] as const).map(dir => (
        <Lobe key={dir} visible opacityScale={0.55} def={{
          layer: "pi", pos: [x, dir * 0.62, 0], radius: 0.2, length: 0.42, squash: [1, 1, 1], color: PI_COLOR, vertical: true,
        }} />
      ))}
    </>
  );
}

// ── Density viewer ───────────────────────────────────────────────────────────

function DensityScene({ mol, layers }: { mol: CarbonMol; layers: Record<Layer, boolean> }) {
  return (
    <>
      <OrbitControls enablePan={false} minDistance={4} maxDistance={14} autoRotate autoRotateSpeed={0.6} />
      <Lights />
      <Stick a={[-HALF[mol], 0, 0]} b={[HALF[mol], 0, 0]} />
      <CarbonEnd mol={mol} side={-1} />
      <CarbonEnd mol={mol} side={1} staggerDeg={60} />
      {LOBES[mol].map((def, i) => (
        <Lobe key={`${mol}-${i}`} def={def} visible={layers[def.layer]} />
      ))}
    </>
  );
}

export function DensityCanvas({ mol, layers }: { mol: CarbonMol; layers: Record<Layer, boolean> }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 2.6, 7.2], fov: 45 }} style={{ height: "340px", width: "100%" }} gl={{ antialias: true, alpha: true }}>
      <DensityScene mol={mol} layers={layers} />
    </Canvas>
  );
}

// ── Rotation lab ─────────────────────────────────────────────────────────────

function RotationScene({ mol, angle }: { mol: "ethane" | "ethene"; angle: number }) {
  const half = HALF[mol];
  const overlap = Math.cos(angle) ** 2;
  return (
    <>
      <OrbitControls enablePan={false} minDistance={4} maxDistance={14} />
      <Lights />
      <Stick a={[-half, 0, 0]} b={[half, 0, 0]} />

      {/* Both ends counter-rotate about the C–C axis — only the relative twist matters */}
      <group rotation={[-angle / 2, 0, 0]}>
        <CarbonEnd mol={mol} side={-1} />
        {mol === "ethene" && <POrbital x={-half} />}
      </group>
      <group rotation={[angle / 2, 0, 0]}>
        <CarbonEnd mol={mol} side={1} staggerDeg={60} />
        {mol === "ethene" && <POrbital x={half} />}
      </group>

      {/* σ bond is symmetric around the axis, so twisting never changes it */}
      <Lobe def={sigmaLobe(half)} visible />

      {/* π bond fades as the p orbitals stop lining up; stays midway between the two ends */}
      {mol === "ethene" && piPair(half, "y", 0.64, PI_COLOR).map((def, i) => (
        <Lobe key={`p-${i}`} def={def} visible opacityScale={overlap} />
      ))}
    </>
  );
}

export function RotationCanvas({ mol, angle }: { mol: "ethane" | "ethene"; angle: number }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [3, 2.6, 6.4], fov: 45 }} style={{ height: "340px", width: "100%" }} gl={{ antialias: true, alpha: true }}>
      <RotationScene mol={mol} angle={angle} />
    </Canvas>
  );
}
