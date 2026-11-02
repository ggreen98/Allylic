"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "sea" | "conduct" | "strike";

// ── Lattice geometry (SVG units) ─────────────────────────────────────────────

const W = 390, H = 232;
const COLS = 6, ROWS = 4, GAP = 50, X0 = 45, Y0 = 40;
const SPLIT_Y = Y0 + 1.5 * GAP;              // boundary between the top and bottom layers
const N_ELECTRONS = COLS * ROWS;             // Na: 1 valence electron per atom
const BOUNDS = { x0: 18, x1: 372, y0: 14, y1: 214 };
const TRAIL_LEN = 50;
const MAX_SPEED = 1.8;
const STRIKE_FRAMES = 140;

const ION_POSITIONS = Array.from({ length: ROWS * COLS }, (_, i) => ({
  row: Math.floor(i / COLS),
  col: i % COLS,
}));

interface Electron { x: number; y: number; vx: number; vy: number }
interface Point { x: number; y: number }

// What one animation frame renders — copied out of the simulation refs each tick
interface Snapshot { electrons: Point[]; trail: Point[]; t: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease  = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// Strike timeline: layers slide over the first half, ionic crystal cracks over the second
function strikePhases(t: number) {
  return {
    slide: ease(clamp(t / 0.5, 0, 1)),
    crack: ease(clamp((t - 0.55) / 0.45, 0, 1)),
  };
}

// ── Mode copy ────────────────────────────────────────────────────────────────

const MODES: Record<Mode, { tab: string; heading: string; text: string }> = {
  sea: {
    tab: "ELECTRON SEA",
    heading: "A SEA OF SHARED ELECTRONS",
    text:
      "Each sodium atom releases its 1 valence electron into the whole metal, leaving behind a grid of Na⁺ ions. The electrons (blue) don't belong to any one ion. Follow the yellow one: it wanders through the entire metal. The attraction between the positive ions and this shared sea of electrons is the metallic bond.",
  },
  conduct: {
    tab: "CONDUCT",
    heading: "CONNECT A BATTERY",
    text:
      "The electrons keep zig-zagging randomly, but the battery adds a slight lean toward the positive terminal. That slow, collective drift of the whole sea is the electric current. (Even this animation exaggerates it; the real drift is slower than a snail.) Solid ionic compounds and most molecular substances have no free electrons, which is why they don't conduct as solids.",
  },
  strike: {
    tab: "STRIKE IT",
    heading: "METAL vs IONIC CRYSTAL",
    text:
      "Hit both solids. In the metal, the top layers slide along, but the electron sea flows with them, so the bonding never breaks: the metal bends. In the ionic crystal, sliding one layer lines up like charges (+ against +, − against −). They repel, and the crystal cracks apart.",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export function MetallicBondSimulator() {
  const [mode, setModeState] = useState<Mode>("sea");
  const [snap, setSnap]      = useState<Snapshot>({ electrons: [], trail: [], t: 0 });

  const modeRef      = useRef<Mode>("sea");
  const electronsRef = useRef<Electron[]>([]);
  const trailRef     = useRef<Point[]>([]);
  const strikeRef    = useRef({ t: 0, running: false });

  function setMode(m: Mode) {
    modeRef.current = m;
    strikeRef.current = { t: 0, running: false };
    trailRef.current = [];
    setModeState(m);
  }

  function strike() {
    if (strikeRef.current.t > 0) {
      strikeRef.current = { t: 0, running: false };
    } else {
      strikeRef.current = { t: 0, running: true };
    }
  }

  useEffect(() => {
    // Random start positions — generated client-side only to avoid hydration mismatch
    electronsRef.current = Array.from({ length: N_ELECTRONS }, () => ({
      x: BOUNDS.x0 + Math.random() * (BOUNDS.x1 - BOUNDS.x0),
      y: BOUNDS.y0 + Math.random() * (BOUNDS.y1 - BOUNDS.y0),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      const m = modeRef.current;
      const s = strikeRef.current;

      // Advance strike animation; track how far the top layer moved this frame
      const prevSlide = strikePhases(s.t).slide;
      if (s.running) {
        s.t = Math.min(1, s.t + dt / STRIKE_FRAMES);
        if (s.t >= 1) s.running = false;
      }
      const slideDelta = (strikePhases(s.t).slide - prevSlide) * GAP;

      const jitter = reduceMotion ? 0.15 : 0.5;
      // Kept well below the random speed: real drift is ~10¹⁰× slower than thermal motion
      const drift  = m === "conduct" ? 0.3 : 0;

      for (const e of electronsRef.current) {
        e.vx = clamp(e.vx + (Math.random() - 0.5) * jitter * dt, -MAX_SPEED, MAX_SPEED);
        e.vy = clamp(e.vy + (Math.random() - 0.5) * jitter * dt, -MAX_SPEED, MAX_SPEED);
        e.x += (e.vx + drift) * dt * (reduceMotion ? 0.3 : 1);
        e.y += e.vy * dt * (reduceMotion ? 0.3 : 1);

        // Electrons in the top half get carried along when the layers slide
        if (slideDelta > 0 && e.y < SPLIT_Y) e.x += slideDelta;

        if (m === "conduct") {
          // Circuit: electrons leaving at + re-enter from the battery at −
          if (e.x > BOUNDS.x1) e.x = BOUNDS.x0;
          if (e.x < BOUNDS.x0) e.x = BOUNDS.x1;
        } else {
          if (e.x < BOUNDS.x0 || e.x > BOUNDS.x1) { e.vx *= -1; e.x = clamp(e.x, BOUNDS.x0, BOUNDS.x1); }
        }
        if (e.y < BOUNDS.y0 || e.y > BOUNDS.y1) { e.vy *= -1; e.y = clamp(e.y, BOUNDS.y0, BOUNDS.y1); }
      }

      // Trail for the highlighted electron — reset on wrap-around jumps
      const lead = electronsRef.current[0];
      const trail = trailRef.current;
      const prev = trail[trail.length - 1];
      if (prev && Math.abs(prev.x - lead.x) > 40) trail.length = 0;
      trail.push({ x: lead.x, y: lead.y });
      if (trail.length > TRAIL_LEN) trail.shift();

      setSnap({
        electrons: electronsRef.current.map(e => ({ x: e.x, y: e.y })),
        trail: [...trail],
        t: s.t,
      });
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { slide, crack } = strikePhases(snap.t);
  const struck = snap.t > 0;
  const done   = snap.t >= 1;
  const info   = MODES[mode];

  // ── Metal panel ────────────────────────────────────────────────────────────
  const metalPanel = (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {/* Battery terminals */}
      {mode === "conduct" && (
        <>
          <rect x={2} y={BOUNDS.y0} width={10} height={BOUNDS.y1 - BOUNDS.y0} fill="rgba(96,165,250,0.15)" stroke="rgba(96,165,250,0.5)" />
          <text x={7} y={H / 2} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: "14px", fill: "#60a5fa", fontFamily: "monospace", fontWeight: 700 }}>−</text>
          <rect x={W - 12} y={BOUNDS.y0} width={10} height={BOUNDS.y1 - BOUNDS.y0} fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" />
          <text x={W - 7} y={H / 2} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: "13px", fill: "#ef4444", fontFamily: "monospace", fontWeight: 700 }}>+</text>
          <text x={W / 2} y={H - 3} textAnchor="middle"
            style={{ fontSize: "8px", fill: "rgba(96,165,250,0.7)", fontFamily: "monospace", letterSpacing: "0.12em" }}>
            e⁻ FLOW  →  →  →
          </text>
        </>
      )}

      {/* Na⁺ ions */}
      {ION_POSITIONS.map(({ row, col }) => {
        const dx = row < 2 ? slide * GAP : 0;
        const cx = X0 + col * GAP + dx;
        const cy = Y0 + row * GAP;
        return (
          <g key={`m-${row}-${col}`}>
            <circle cx={cx} cy={cy} r={15} fill="rgba(148,163,184,0.18)" stroke="rgba(148,163,184,0.55)" strokeWidth="1" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: "9px", fill: "#cbd5e1", fontFamily: "monospace", fontWeight: 700 }}>Na⁺</text>
          </g>
        );
      })}

      {/* Highlighted electron's path */}
      {mode === "sea" && snap.trail.length > 1 && (
        <polyline
          points={snap.trail.map(p => `${p.x},${p.y}`).join(" ")}
          fill="none" stroke="rgba(255,215,0,0.35)" strokeWidth="1.5"
        />
      )}

      {/* Electrons */}
      {snap.electrons.map((e, i) => (
        <circle key={i} cx={e.x} cy={e.y}
          r={mode === "sea" && i === 0 ? 4.2 : 3.2}
          fill={mode === "sea" && i === 0 ? "#ffd700" : "#60a5fa"}
          opacity={mode === "sea" && i === 0 ? 1 : 0.85}
        />
      ))}
    </svg>
  );

  // ── Ionic panel (strike mode only) ─────────────────────────────────────────
  const ionicPanel = (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <g transform={`translate(0 ${-crack * 24}) rotate(${-crack * 4} ${W / 2} ${SPLIT_Y})`}>
        {ION_POSITIONS.filter(p => p.row < 2).map(p => <IonicIon key={`t-${p.row}-${p.col}`} {...p} dx={slide * GAP} />)}
      </g>
      {ION_POSITIONS.filter(p => p.row >= 2).map(p => <IonicIon key={`b-${p.row}-${p.col}`} {...p} dx={0} />)}

      {/* Like-charge repulsion once the layers line up */}
      {slide > 0.95 && Array.from({ length: COLS - 1 }, (_, c) => {
        const x = X0 + (c + 1) * GAP;
        return (
          <text key={`rep-${c}`} x={x} y={SPLIT_Y} textAnchor="middle" dominantBaseline="central"
            opacity={Math.min(1, (slide - 0.95) * 20)}
            style={{ fontSize: "13px", fill: "#ef4444", fontFamily: "monospace", fontWeight: 700 }}>
            ↕
          </text>
        );
      })}

      {/* Fracture line */}
      {crack > 0 && (
        <polyline
          points={Array.from({ length: 15 }, (_, i) => `${BOUNDS.x0 + i * 25.3},${SPLIT_Y + (i % 2 === 0 ? -4 : 4)}`).join(" ")}
          fill="none" stroke="#ef4444" strokeWidth="1.5" opacity={crack}
        />
      )}
    </svg>
  );

  const tabStyle = (active: boolean): React.CSSProperties => ({
    border: active ? "1px solid rgba(52,211,153,0.6)" : "1px solid rgba(52,211,153,0.2)",
    color: active ? "rgba(52,211,153,0.95)" : "rgba(52,211,153,0.45)",
    background: active ? "rgba(52,211,153,0.08)" : "transparent",
    cursor: "pointer", letterSpacing: "0.12em", borderRadius: "4px",
  });

  const panelLabel = (label: string, outcome: string | null, good: boolean) => (
    <div className="flex items-center justify-between mt-2 font-heading" style={{ fontSize: "0.65rem", letterSpacing: "0.1em" }}>
      <span style={{ color: "var(--oc-text-dim)" }}>{label}</span>
      {outcome && <span style={{ color: good ? "#34d399" : "#ef4444" }}>{outcome}</span>}
    </div>
  );

  return (
    <div>
      {/* Mode tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(Object.keys(MODES) as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="font-heading text-xs px-4 py-2 transition-all duration-200" style={tabStyle(mode === m)}>
            {MODES[m].tab}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-2 font-heading flex-wrap"
        style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
        <span>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#94a3b8", marginRight: 5, verticalAlign: "middle" }} />
          Na⁺ ION
        </span>
        <span>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#60a5fa", marginRight: 5, verticalAlign: "middle" }} />
          DELOCALIZED ELECTRON
        </span>
        {mode === "strike" && (
          <>
            <span>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", marginRight: 5, verticalAlign: "middle" }} />
              Na⁺ (IONIC)
            </span>
            <span>
              <span style={{ display: "inline-block", width: 11, height: 11, borderRadius: "50%", background: "#66bb66", marginRight: 5, verticalAlign: "middle" }} />
              Cl⁻
            </span>
          </>
        )}
      </div>

      {/* Panels */}
      {mode === "strike" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>{metalPanel}</div>
            {panelLabel("METAL · Na", done ? "BENDS ✓" : null, true)}
          </div>
          <div>
            <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>{ionicPanel}</div>
            {panelLabel("IONIC CRYSTAL · NaCl", done ? "SHATTERS ✗" : null, false)}
          </div>
        </div>
      ) : (
        <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>{metalPanel}</div>
      )}

      {/* Stage info */}
      <div className="mt-4 mb-4" style={{ minHeight: "72px" }}>
        <p className="font-heading mb-1" style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.78rem" }}>
          {info.heading}
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{info.text}</p>
      </div>

      {/* Controls */}
      {mode === "strike" && (
        <button onClick={strike}
          className="font-heading text-xs px-6 py-3 transition-all duration-200"
          style={{
            border: "1px solid rgba(52,211,153,0.4)", color: "rgba(52,211,153,0.9)",
            background: "rgba(52,211,153,0.05)", cursor: "pointer", letterSpacing: "0.15em", borderRadius: "4px",
          }}
        >
          {struck ? "↩  RESET" : "▶  STRIKE BOTH"}
        </button>
      )}
    </div>
  );
}

// Alternating Na⁺ / Cl⁻ — after a one-column slide, row 1 sits on like charges in row 2
function IonicIon({ row, col, dx }: { row: number; col: number; dx: number }) {
  const isNa = (row + col) % 2 === 0;
  const cx = X0 + col * GAP + dx;
  const cy = Y0 + row * GAP;
  return (
    <g>
      <circle cx={cx} cy={cy} r={isNa ? 11 : 17}
        fill={isNa ? "rgba(167,139,250,0.2)" : "rgba(102,187,102,0.18)"}
        stroke={isNa ? "rgba(167,139,250,0.6)" : "rgba(102,187,102,0.55)"} strokeWidth="1" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "12px", fill: isNa ? "#c4b5fd" : "#86efac", fontFamily: "monospace", fontWeight: 700 }}>
        {isNa ? "+" : "−"}
      </text>
    </g>
  );
}
