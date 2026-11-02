"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { CarbonMol, Layer } from "./SigmaPi3D";

const DensityCanvas  = dynamic(() => import("./SigmaPi3D").then(m => m.DensityCanvas),  { ssr: false });
const RotationCanvas = dynamic(() => import("./SigmaPi3D").then(m => m.RotationCanvas), { ssr: false });

// Keep in sync with SigmaPi3D (not imported, so three.js stays out of the initial bundle)
const SIGMA_COLOR = "#34d399";
const PI_COLOR    = "#60a5fa";
const PI2_COLOR   = "#a78bfa";
const C_COLOR     = "#6b7280";
const H_COLOR     = "#f1f5f9";

const tabStyle = (active: boolean): React.CSSProperties => ({
  border: active ? "1px solid rgba(52,211,153,0.6)" : "1px solid rgba(52,211,153,0.2)",
  color: active ? "rgba(52,211,153,0.95)" : "rgba(52,211,153,0.45)",
  background: active ? "rgba(52,211,153,0.08)" : "transparent",
  cursor: "pointer", letterSpacing: "0.12em", borderRadius: "4px",
});

const chipStyle = (color: string, on: boolean): React.CSSProperties => ({
  border: `1px solid ${color}${on ? "88" : "33"}`,
  color: on ? color : `${color}77`,
  background: on ? `${color}12` : "transparent",
  cursor: "pointer", letterSpacing: "0.1em", borderRadius: "4px",
});

// ── σ / π density viewer ─────────────────────────────────────────────────────

const MOL_INFO: Record<CarbonMol, { label: string; name: string; bond: string; makeup: string; length: string; text: string }> = {
  ethane: {
    label: "C₂H₆", name: "Ethane", bond: "SINGLE  C–C", makeup: "1σ", length: "154 pm",
    text: "One shared pair, and it's a σ bond: a single sausage of electron density lying right along the line between the two carbons. Toggle π on and nothing appears; a single bond has no π bond.",
  },
  ethene: {
    label: "C₂H₄", name: "Ethene", bond: "DOUBLE  C=C", makeup: "1σ + 1π", length: "134 pm",
    text: "The σ bond is still there along the axis. The second pair forms a π bond: two lobes, one above and one below the axis. It comes from the dumbbell-shaped p orbitals you met in lesson 2.3, one on each carbon, overlapping side by side. Notice that all six atoms lie in one flat plane, with the π lobes sticking out above and below it.",
  },
  ethyne: {
    label: "C₂H₂", name: "Ethyne", bond: "TRIPLE  C≡C", makeup: "1σ + 2π", length: "120 pm",
    text: "Still one σ bond on the axis, now wrapped by two π bonds at right angles to each other: one above and below, one in front and behind. Together they surround the axis in a cylinder of electron density. Three shared pairs pull the carbons closest of all.",
  },
};

// ── 2D line notation, color-coded to match the 3D bond regions ───────────────

type Pt = { x: number; y: number };

const C1: Pt = { x: 135, y: 70 };
const C2: Pt = { x: 205, y: 70 };

const H_POSITIONS: Record<CarbonMol, Pt[]> = {
  ethane: [{ x: 135, y: 25 }, { x: 135, y: 115 }, { x: 80, y: 70 }, { x: 205, y: 25 }, { x: 205, y: 115 }, { x: 260, y: 70 }],
  ethene: [{ x: 97, y: 32 }, { x: 97, y: 108 }, { x: 243, y: 32 }, { x: 243, y: 108 }],
  ethyne: [{ x: 70, y: 70 }, { x: 270, y: 70 }],
};

// C–C bond lines as y-offsets from the axis
const CC_LINES: Record<CarbonMol, { dy: number; layer: Layer; color: string }[]> = {
  ethane: [{ dy: 0, layer: "sigma", color: SIGMA_COLOR }],
  ethene: [{ dy: -5, layer: "pi", color: PI_COLOR }, { dy: 5, layer: "sigma", color: SIGMA_COLOR }],
  ethyne: [
    { dy: -8, layer: "pi", color: PI_COLOR },
    { dy: 0, layer: "sigma", color: SIGMA_COLOR },
    { dy: 8, layer: "pi", color: PI2_COLOR },
  ],
};

// Trim a segment so it stops short of the atom labels at both ends
function trimmed(a: Pt, b: Pt, gap: number) {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len, uy = (b.y - a.y) / len;
  return { x1: a.x + ux * gap, y1: a.y + uy * gap, x2: b.x - ux * gap, y2: b.y - uy * gap };
}

function LineNotation({ mol, layers }: { mol: CarbonMol; layers: Record<Layer, boolean> }) {
  const hs = H_POSITIONS[mol];
  const half = hs.length / 2;
  const atomText: React.CSSProperties = { fontFamily: "monospace", fontWeight: 700 };
  return (
    <svg viewBox="0 0 340 140" width="100%" style={{ maxWidth: "380px", display: "block", margin: "0 auto" }}>
      {/* C–H bonds — σ bonds too, drawn fainter */}
      {hs.map((h, i) => (
        <line key={`ch-${i}`} {...trimmed(i < half ? C1 : C2, h, 11)}
          stroke={SIGMA_COLOR} strokeWidth="1.5" opacity={layers.sigma ? 0.4 : 0.1} />
      ))}

      {/* C–C bond lines */}
      {CC_LINES[mol].map(({ dy, layer, color }) => (
        <line key={`cc-${dy}`} x1={C1.x + 13} y1={C1.y + dy} x2={C2.x - 13} y2={C2.y + dy}
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          opacity={layers[layer] ? 1 : 0.15} style={{ transition: "opacity 0.3s" }} />
      ))}

      {/* Atoms */}
      {[C1, C2].map((c, i) => (
        <text key={`c-${i}`} x={c.x} y={c.y} textAnchor="middle" dominantBaseline="central"
          style={{ ...atomText, fontSize: "20px", fill: "#9ca3af" }}>C</text>
      ))}
      {hs.map((h, i) => (
        <text key={`h-${i}`} x={h.x} y={h.y} textAnchor="middle" dominantBaseline="central"
          style={{ ...atomText, fontSize: "16px", fill: "#d1d5db" }}>H</text>
      ))}
    </svg>
  );
}

export function SigmaPiDensityViewer() {
  const [mol, setMol] = useState<CarbonMol>("ethene");
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ sigma: true, pi: true });
  const info = MOL_INFO[mol];

  return (
    <div>
      {/* Molecule tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(Object.keys(MOL_INFO) as CarbonMol[]).map(m => (
          <button key={m} onClick={() => setMol(m)} className="font-heading text-xs px-4 py-2 transition-all duration-200" style={tabStyle(mol === m)}>
            {MOL_INFO[m].label}
          </button>
        ))}
        <span className="ml-auto font-heading text-xs self-center" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
          {info.name}
        </span>
      </div>

      {/* Layer toggles */}
      <div className="flex gap-2 mb-2 flex-wrap items-center">
        <span className="font-heading mr-1" style={{ color: "var(--oc-text-dim)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>SHOW</span>
        <button onClick={() => setLayers(l => ({ ...l, sigma: !l.sigma }))} className="font-heading text-xs px-3 py-1.5" style={chipStyle(SIGMA_COLOR, layers.sigma)}>
          {layers.sigma ? "■" : "□"} σ BOND
        </button>
        <button onClick={() => setLayers(l => ({ ...l, pi: !l.pi }))} className="font-heading text-xs px-3 py-1.5" style={chipStyle(PI_COLOR, layers.pi)}>
          {layers.pi ? "■" : "□"} π BONDS
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-2 mt-3 font-heading flex-wrap"
        style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.65rem" }}>
        <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: C_COLOR, marginRight: 5, verticalAlign: "middle" }} />C</span>
        <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: H_COLOR, marginRight: 5, verticalAlign: "middle" }} />H</span>
        <span><span style={{ display: "inline-block", width: 14, height: 8, borderRadius: 4, border: `1.5px solid ${SIGMA_COLOR}`, marginRight: 5, verticalAlign: "middle" }} />σ BOND</span>
        <span><span style={{ display: "inline-block", width: 14, height: 8, borderRadius: 4, border: `1.5px solid ${PI_COLOR}`, marginRight: 5, verticalAlign: "middle" }} />π BOND</span>
        {mol === "ethyne" && (
          <span><span style={{ display: "inline-block", width: 14, height: 8, borderRadius: 4, border: `1.5px solid ${PI2_COLOR}`, marginRight: 5, verticalAlign: "middle" }} />2ND π BOND</span>
        )}
      </div>

      {/* Canvas */}
      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>
        <DensityCanvas mol={mol} layers={layers} />
      </div>
      <p className="font-heading mt-1.5 text-center" style={{ color: "var(--oc-text-dim)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
        BOND REGIONS SHOWN FOR THE C–C BOND · DRAG TO ROTATE
      </p>

      {/* 2D line notation */}
      <div className="mt-3 p-3" style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px" }}>
        <p className="font-heading mb-1" style={{ color: "var(--oc-text-dim)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
          SAME MOLECULE · LINE NOTATION
        </p>
        <LineNotation mol={mol} layers={layers} />
        <div className="flex gap-4 flex-wrap justify-center font-heading" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--oc-text-dim)" }}>
          <span><span style={{ display: "inline-block", width: 16, height: 3, background: SIGMA_COLOR, verticalAlign: "middle", marginRight: 5 }} />σ BOND</span>
          <span><span style={{ display: "inline-block", width: 16, height: 3, background: PI_COLOR, verticalAlign: "middle", marginRight: 5 }} />π BOND</span>
          {mol === "ethyne" && (
            <span><span style={{ display: "inline-block", width: 16, height: 3, background: PI2_COLOR, verticalAlign: "middle", marginRight: 5 }} />2ND π BOND</span>
          )}
          <span><span style={{ display: "inline-block", width: 16, height: 2, background: SIGMA_COLOR, opacity: 0.4, verticalAlign: "middle", marginRight: 5 }} />C–H (ALSO σ)</span>
        </div>
      </div>

      {/* Info chips */}
      <div className="flex gap-2 mt-4 mb-3 flex-wrap">
        {[info.bond, info.makeup, `C–C LENGTH ${info.length}`].map(chip => (
          <span key={chip} className="font-heading text-xs px-3 py-1.5"
            style={{ border: "1px solid rgba(148,163,184,0.25)", color: "var(--oc-text-dim)", borderRadius: "4px", letterSpacing: "0.1em", fontSize: "0.65rem" }}>
            {chip}
          </span>
        ))}
      </div>
      <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)", minHeight: "96px" }}>{info.text}</p>
    </div>
  );
}

// ── Rotation lab ─────────────────────────────────────────────────────────────

type RotMol = "ethane" | "ethene";

export function BondRotationLab() {
  const [mol, setMol]         = useState<RotMol>("ethene");
  const [deg, setDeg]         = useState(0);
  const [thermal, setThermal] = useState(true);
  const tRef = useRef(0);

  // "Room temperature": ethane spins freely; ethene only wobbles a few degrees
  useEffect(() => {
    if (!thermal) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      tRef.current += dt;
      setDeg(mol === "ethane"
        ? (tRef.current * 120) % 360
        : 5 * Math.sin(tRef.current * 9) + 2 * Math.sin(tRef.current * 23));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [thermal, mol]);

  function selectMol(m: RotMol) {
    tRef.current = 0;
    setMol(m);
    setDeg(0);
    setThermal(true);
  }

  // Fold any angle (negative wobble, continuous spin) into 0–180° for the slider and readout
  const signed  = ((((deg + 180) % 360) + 360) % 360) - 180;
  const shown   = Math.abs(signed);
  const overlap = Math.round(Math.cos((deg * Math.PI) / 180) ** 2 * 100);

  let status: { text: string; color: string };
  if (mol === "ethane") {
    status = { text: "σ BOND INTACT · ROTATES FREELY", color: SIGMA_COLOR };
  } else if (overlap > 95) {
    status = { text: "π BOND INTACT · LOCKED IN PLANE", color: PI_COLOR };
  } else if (overlap > 5) {
    status = { text: "π BOND STRAINED · p ORBITALS MISALIGNED", color: "#f5a623" };
  } else {
    status = { text: "π BOND BROKEN · NO SIDE-BY-SIDE OVERLAP", color: "#ef4444" };
  }

  const explanation = mol === "ethane"
    ? "At room temperature, ethane's two ends spin freely, billions of times per second. The σ bond is shaped like a sausage around the axis, so it looks the same from every angle and survives any amount of twisting. Drag the slider to twist it yourself."
    : "At room temperature, ethene only wobbles. The σ bond doesn't mind twisting, but the π bond only exists while the two p orbitals point the same way. Drag the slider to force a twist: at 90° the p orbitals are at right angles, so the overlap and the π bond are gone. That takes far more energy than room-temperature jostling can supply, so all six atoms stay locked in the same plane. Twist all the way to 180° and the overlap returns, but the molecule is now flipped end for end.";

  const secondaryBtn: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.2)", color: "var(--oc-text-dim)", background: "transparent",
    cursor: "pointer", letterSpacing: "0.12em", borderRadius: "4px",
  };

  return (
    <div>
      {/* Molecule tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["ethane", "ethene"] as RotMol[]).map(m => (
          <button key={m} onClick={() => selectMol(m)} className="font-heading text-xs px-4 py-2 transition-all duration-200" style={tabStyle(mol === m)}>
            {m === "ethane" ? "C₂H₆ · SINGLE" : "C₂H₄ · DOUBLE"}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>
        <RotationCanvas mol={mol} angle={(deg * Math.PI) / 180} />
      </div>

      {/* Twist slider */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1 font-heading" style={{ fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          <span style={{ color: "var(--oc-text-dim)" }}>TWIST BETWEEN THE TWO ENDS</span>
          <span style={{ color: "var(--oc-text)" }}>{Math.round(shown)}°</span>
        </div>
        <input
          type="range" min={0} max={180} step={1}
          value={Math.round(shown)}
          onChange={e => { setThermal(false); setDeg(Number(e.target.value)); }}
          className="w-full accent-emerald-400"
          aria-label="Twist angle in degrees"
        />
      </div>

      {/* π overlap readout (ethene only — a σ bond's overlap never changes) */}
      {mol === "ethene" && (
        <div className="p-3 mt-3" style={{ border: "1px solid rgba(148,163,184,0.2)", borderRadius: "4px" }}>
          <div className="flex items-center justify-between mb-2 font-heading" style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}>
            <span style={{ color: "var(--oc-text-dim)" }}>π OVERLAP</span>
            <span className="text-sm" style={{ color: "var(--oc-text)" }}>{overlap}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(148,163,184,0.12)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overlap}%`, background: PI_COLOR, transition: thermal ? "none" : "width 0.15s" }} />
          </div>
        </div>
      )}

      <p className="font-heading mt-3 mb-2" style={{ color: status.color, fontSize: "0.7rem", letterSpacing: "0.1em" }}>{status.text}</p>
      <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)", minHeight: "120px" }}>{explanation}</p>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setThermal(t => !t)}
          className="font-heading text-xs px-5 py-3 transition-all duration-200"
          style={{ border: "1px solid rgba(52,211,153,0.4)", color: "rgba(52,211,153,0.9)", background: "rgba(52,211,153,0.05)", cursor: "pointer", letterSpacing: "0.15em", borderRadius: "4px" }}>
          {thermal ? "■  PAUSE" : "▶  ROOM TEMPERATURE"}
        </button>
        {mol === "ethene" && (
          <button onClick={() => { setThermal(false); setDeg(90); }} className="font-heading text-xs px-4 py-3 transition-all duration-200" style={secondaryBtn}>
            JUMP TO 90°
          </button>
        )}
        <button onClick={() => { setThermal(false); setDeg(0); }} className="font-heading text-xs px-4 py-3 transition-all duration-200" style={secondaryBtn}>
          ↩ RESET
        </button>
      </div>
    </div>
  );
}
