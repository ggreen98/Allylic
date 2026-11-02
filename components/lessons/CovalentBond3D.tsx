"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

export type Mol = "H2" | "H2O" | "O2";

// Box-Muller Gaussian sample
function gaussian() {
  return (
    Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-10))) *
    Math.cos(2 * Math.PI * Math.random())
  );
}

// ── Molecule data ─────────────────────────────────────────────────────────────

interface CloudDef {
  cx: number; cy: number; cz: number;
  sigmaX: number; sigmaY: number;
  rotZ?: number;            // radians — orients sigmaX along a bond axis
  count: number;
  color: string;
  maxOpacity: number;
}

interface AtomDef {
  pos:    [number, number, number];
  r:      number;
  color:  string;
  label:  string;
  delta?: { sign: "δ⁺" | "δ⁻"; offset: [number, number, number] };
}

interface MolDef {
  atoms:    AtomDef[];
  clouds:   CloudDef[];
  polarity: "NONPOLAR" | "POLAR";
  bondType: string;
}

// H₂O geometry: 104.5° H–O–H angle, O sits above the two H atoms
const OH_LEN    = 2.0;
const HALF_ANG  = (104.5 / 2) * (Math.PI / 180);
const O_Y       = 0.55;
const H_X       = OH_LEN * Math.sin(HALF_ANG);
const H_Y       = O_Y - OH_LEN * Math.cos(HALF_ANG);
const OH_ROT    = Math.atan2(O_Y - H_Y, H_X);  // bond-axis tilt from horizontal
const OH_SHIFT  = 0.38;                        // cloud centre as fraction of O→H, i.e. pulled toward O

const MOLS: Record<Mol, MolDef> = {
  H2: {
    atoms: [
      { pos: [-1.55, 0, 0], r: 0.50, color: "#c0c0c0", label: "H" },
      { pos: [ 1.55, 0, 0], r: 0.50, color: "#c0c0c0", label: "H" },
    ],
    clouds: [
      { cx: 0, cy: 0, cz: 0, sigmaX: 0.88, sigmaY: 0.52, count: 400, color: "#34d399", maxOpacity: 0.060 },
    ],
    polarity: "NONPOLAR", bondType: "SINGLE BOND",
  },
  H2O: {
    atoms: [
      { pos: [0, O_Y, 0],     r: 0.65, color: "#ff6655", label: "O", delta: { sign: "δ⁻", offset: [0, 1.45, 0] } },
      { pos: [-H_X, H_Y, 0],  r: 0.46, color: "#c0c0c0", label: "H", delta: { sign: "δ⁺", offset: [-0.55, -0.6, 0] } },
      { pos: [ H_X, H_Y, 0],  r: 0.46, color: "#c0c0c0", label: "H", delta: { sign: "δ⁺", offset: [ 0.55, -0.6, 0] } },
    ],
    clouds: [
      // two O–H bonds, each shifted toward oxygen
      { cx: -H_X * OH_SHIFT, cy: O_Y + (H_Y - O_Y) * OH_SHIFT, cz: 0, sigmaX: 0.70, sigmaY: 0.40, rotZ:  OH_ROT, count: 300, color: "#a855f7", maxOpacity: 0.068 },
      { cx:  H_X * OH_SHIFT, cy: O_Y + (H_Y - O_Y) * OH_SHIFT, cz: 0, sigmaX: 0.70, sigmaY: 0.40, rotZ: -OH_ROT, count: 300, color: "#a855f7", maxOpacity: 0.068 },
      // oxygen's two lone pairs — extra negative density on the far side of O
      { cx: 0, cy: O_Y + 0.75, cz: 0, sigmaX: 0.55, sigmaY: 0.38, count: 220, color: "#a855f7", maxOpacity: 0.050 },
    ],
    polarity: "POLAR", bondType: "2 SINGLE BONDS",
  },
  O2: {
    atoms: [
      { pos: [-1.64, 0, 0], r: 0.65, color: "#ff6655", label: "O" },
      { pos: [ 1.64, 0, 0], r: 0.65, color: "#ff6655", label: "O" },
    ],
    clouds: [
      // sigma bond — along the internuclear axis
      { cx: 0, cy: 0,     cz: 0, sigmaX: 0.84, sigmaY: 0.36, count: 280, color: "#60a5fa", maxOpacity: 0.062 },
      // pi bond — two lobes above and below the axis
      { cx: 0, cy:  0.64, cz: 0, sigmaX: 0.72, sigmaY: 0.22, count: 190, color: "#60a5fa", maxOpacity: 0.068 },
      { cx: 0, cy: -0.64, cz: 0, sigmaX: 0.72, sigmaY: 0.22, count: 190, color: "#60a5fa", maxOpacity: 0.068 },
    ],
    polarity: "NONPOLAR", bondType: "DOUBLE BOND",
  },
};

// ── Electron density cloud (instanced) ───────────────────────────────────────

function ElectronDensityCloud({ cfg, visible }: { cfg: CloudDef; visible: boolean }) {
  const meshRef    = useRef<THREE.InstancedMesh>(null!);
  const opacityRef = useRef(0);

  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    const result: THREE.Matrix4[] = [];
    const cos = Math.cos(cfg.rotZ ?? 0);
    const sin = Math.sin(cfg.rotZ ?? 0);
    for (let i = 0; i < cfg.count; i++) {
      const lx = gaussian() * cfg.sigmaX;
      const ly = gaussian() * cfg.sigmaY;
      dummy.position.set(
        cfg.cx + lx * cos - ly * sin,
        cfg.cy + lx * sin + ly * cos,
        cfg.cz + gaussian() * cfg.sigmaY,
      );
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      result.push(dummy.matrix.clone());
    }
    return result;
  }, [cfg.cx, cfg.cy, cfg.cz, cfg.sigmaX, cfg.sigmaY, cfg.rotZ, cfg.count]);

  useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((mat, i) => meshRef.current.setMatrixAt(i, mat));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = visible ? cfg.maxOpacity : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 3.5);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacityRef.current;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, cfg.count]}>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshBasicMaterial color={cfg.color} transparent opacity={0} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────

function Scene({ mol, showDensity, caption }: { mol: Mol; showDensity: boolean; caption?: string }) {
  const data = MOLS[mol];

  const labelStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: "11px",
    userSelect: "none",
    textShadow: "0 0 8px #000, 0 0 14px #000",
    pointerEvents: "none",
    color: "#ffffff",
  };

  const noteStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "7px",
    userSelect: "none",
    pointerEvents: "none",
    letterSpacing: "0.1em",
    textShadow: "0 0 8px #000",
  };

  const densityLabelColor =
    data.polarity === "POLAR" ? "rgba(168,85,247,0.8)" : "rgba(52,211,153,0.7)";

  return (
    <>
      <OrbitControls enablePan={false} minDistance={4} maxDistance={16} />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#223344", "#111122", 0.55]} />
      <pointLight position={[6, 6, 6]} intensity={1.4} />
      <pointLight position={[-5, 4, -4]} intensity={0.6} color="#8899ff" />

      {/* Atoms */}
      {data.atoms.map((atom, i) => (
        <group key={`${mol}-atom-${i}`}>
          <mesh position={atom.pos}>
            <sphereGeometry args={[atom.r, 52, 52]} />
            <meshStandardMaterial color={atom.color} roughness={0.42} metalness={0.06} />
          </mesh>
          <Html position={atom.pos} center distanceFactor={8} style={{ pointerEvents: "none" }}>
            <div style={labelStyle}>{atom.label}</div>
          </Html>

          {/* Partial charge label when polar and density shown */}
          {atom.delta && showDensity && (
            <Html
              position={[
                atom.pos[0] + atom.delta.offset[0],
                atom.pos[1] + atom.delta.offset[1],
                atom.pos[2] + atom.delta.offset[2],
              ]}
              center distanceFactor={8}
              style={{ pointerEvents: "none" }}
            >
              <div style={{ ...noteStyle, color: atom.delta.sign === "δ⁺" ? "#60a5fa" : "#a855f7", fontSize: "9px" }}>
                {atom.delta.sign}
              </div>
            </Html>
          )}
        </group>
      ))}

      {/* Electron density clouds — keyed on mol so they remount on molecule switch */}
      {data.clouds.map((cfg, i) => (
        <ElectronDensityCloud key={`${mol}-${i}`} cfg={cfg} visible={showDensity} />
      ))}

      {/* Bond type annotation */}
      {showDensity && (
        <Html position={[0, -2.4, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{ ...noteStyle, color: densityLabelColor }}>
            {caption ?? `${data.bondType} · ${data.polarity}`}
          </div>
        </Html>
      )}

      {/* Drag hint */}
      {!showDensity && (
        <Html position={[0, -2.4, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{ ...noteStyle, color: "rgba(255,255,255,0.25)" }}>DRAG TO ROTATE</div>
        </Html>
      )}
    </>
  );
}

// ── Canvas export ─────────────────────────────────────────────────────────────

export default function CovalentBond3D({
  mol,
  showDensity,
  caption,
}: {
  mol: Mol;
  showDensity: boolean;
  caption?: string;         // overrides the default "BOND TYPE · POLARITY" annotation
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 8.5], fov: 50 }}
      style={{ height: "320px", width: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene mol={mol} showDensity={showDensity} caption={caption} />
    </Canvas>
  );
}
