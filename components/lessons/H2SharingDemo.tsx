"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const CovalentBond3D = dynamic(() => import("./CovalentBond3D"), { ssr: false });

// Minimal H₂ demo for the lesson intro — just the shared pair, no polarity/ΔEN
export function H2SharingDemo() {
  const [showDensity, setShow] = useState(false);

  return (
    <div>
      {/* Atom legend */}
      <div className="flex items-center gap-5 mb-2 font-heading flex-wrap"
        style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
        <span>
          <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: "#c0c0c0", marginRight: 5, verticalAlign: "middle" }} />
          H — HYDROGEN
        </span>
        {showDensity && (
          <span>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#34d399", marginRight: 5, verticalAlign: "middle" }} />
            SHARED ELECTRONS
          </span>
        )}
      </div>

      {/* Canvas */}
      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>
        <CovalentBond3D mol="H2" showDensity={showDensity} caption="1 SHARED PAIR · 2 ELECTRONS" />
      </div>

      {/* Stage info */}
      <div className="mt-4 mb-4" style={{ minHeight: "72px" }}>
        <p className="font-heading mb-1"
          style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.78rem" }}>
          {!showDensity ? "TWO HYDROGEN ATOMS" : "ONE SHARED PAIR"}
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
          {!showDensity
            ? "Each hydrogen atom has just 1 electron, but it needs 2 to fill its first shell. Neither atom can take the other's electron. Drag to rotate."
            : "Each atom puts its 1 electron into a shared pair. The pair sits between the two nuclei, and both atoms count both electrons as their own. Each hydrogen now has a full shell of 2. That shared pair is the covalent bond holding H₂ together."}
        </p>
      </div>

      {/* Controls */}
      <button onClick={() => setShow(s => !s)}
        className="font-heading text-xs px-6 py-3 transition-all duration-200"
        style={{
          border: "1px solid rgba(52,211,153,0.4)",
          color: "rgba(52,211,153,0.9)",
          background: "rgba(52,211,153,0.05)",
          cursor: "pointer", letterSpacing: "0.15em", borderRadius: "4px",
        }}
      >
        {!showDensity ? "▶  SHARE THE ELECTRONS" : "↩  RESET"}
      </button>
    </div>
  );
}
