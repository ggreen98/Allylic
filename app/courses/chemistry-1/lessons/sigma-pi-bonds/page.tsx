import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { Term } from "@/components/ui/Term";
import { SigmaPiDensityViewer, BondRotationLab } from "@/components/lessons/SigmaPiExplorer";

export const metadata = {
  title: "Sigma & Pi Bonds — Chemistry I | Allylic",
  description: "See where sigma and pi electrons sit in single, double, and triple bonds, and discover why a double bond can't twist.",
};

function SideNote({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  return (
    <div className="p-4" style={{ border: "1px solid rgba(245,166,35,0.25)", background: "rgba(245,166,35,0.04)", borderRadius: "4px", borderLeft: "3px solid rgba(245,166,35,0.5)" }}>
      <p className="font-heading mb-1" style={{ color: "rgba(245,166,35,0.6)", letterSpacing: "0.12em", fontSize: "0.55rem" }}>
        {label}
      </p>
      <p className="font-heading mb-2" style={{ color: "#f5a623", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
        {title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{children}</p>
    </div>
  );
}

// 1,2-dichloroethene drawn flat: C=C in the middle, two substituents on each carbon
function Dichloroethene({ cis }: { cis: boolean }) {
  const C1 = { x: 120, y: 80 }, C2 = { x: 200, y: 80 };
  const up = 42, out = 36;
  const left  = [{ x: C1.x - out, y: C1.y - up, el: "Cl" }, { x: C1.x - out, y: C1.y + up, el: "H" }];
  const right = cis
    ? [{ x: C2.x + out, y: C2.y - up, el: "Cl" }, { x: C2.x + out, y: C2.y + up, el: "H" }]
    : [{ x: C2.x + out, y: C2.y - up, el: "H" },  { x: C2.x + out, y: C2.y + up, el: "Cl" }];
  const atomStyle = (el: string): React.CSSProperties => ({
    fontSize: el === "Cl" ? "17px" : "15px", fill: el === "Cl" ? "#66bb66" : "#c0c0c0",
    fontFamily: "monospace", fontWeight: 700,
  });
  return (
    <svg viewBox="0 0 320 160" width="100%" style={{ maxWidth: "320px" }}>
      {/* Double bond */}
      <line x1={C1.x + 12} y1={C1.y - 4} x2={C2.x - 12} y2={C2.y - 4} stroke="#94a3b8" strokeWidth="2" />
      <line x1={C1.x + 12} y1={C1.y + 4} x2={C2.x - 12} y2={C2.y + 4} stroke="#94a3b8" strokeWidth="2" />
      {/* Single bonds to substituents */}
      {left.map(s => <line key={`l-${s.y}`} x1={C1.x - 8} y1={C1.y + (s.y < C1.y ? -8 : 8)} x2={s.x + 12} y2={s.y + (s.y < C1.y ? 10 : -10)} stroke="#94a3b8" strokeWidth="1.5" />)}
      {right.map(s => <line key={`r-${s.y}`} x1={C2.x + 8} y1={C2.y + (s.y < C2.y ? -8 : 8)} x2={s.x - 12} y2={s.y + (s.y < C2.y ? 10 : -10)} stroke="#94a3b8" strokeWidth="1.5" />)}
      {/* Atoms */}
      {[{ ...C1, el: "C" }, { ...C2, el: "C" }, ...left, ...right].map((a, i) => (
        <text key={i} x={a.x} y={a.y} textAnchor="middle" dominantBaseline="central" style={atomStyle(a.el)}>{a.el}</text>
      ))}
    </svg>
  );
}

export default function SigmaPiBondsLesson() {
  return (
    <main
      className="scanlines font-terminal min-h-screen"
      style={{ backgroundColor: "var(--oc-bg)", color: "var(--oc-text)" }}
    >
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{
          background: "var(--oc-nav-bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--oc-green-border-dim)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading" style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>SIGMA &amp; PI BONDS</span>
        </div>

        <div className="flex items-center gap-3">
          <MobileNav />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-3xl mx-auto">

        {/* Lesson label */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-heading text-xs px-2 py-0.5"
            style={{ background: "rgba(52,211,153,0.1)", color: "rgba(52,211,153,0.9)", border: "1px solid rgba(52,211,153,0.3)", letterSpacing: "0.12em" }}
          >
            LESSON 3.4
          </span>
          <span className="text-xs tracking-widest" style={{ color: "var(--oc-text-dim)" }}>
            CHEMISTRY I: GENERAL CHEMISTRY
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          SIGMA &amp; PI BONDS
        </h1>
        <p className="text-base leading-relaxed mb-10 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In lesson 3.2 you learned a quick rule: the first pair two atoms share is a{" "}
          <Term id="sigma-bond">sigma (σ) bond</Term>, and every extra pair is a{" "}
          <Term id="pi-bond">pi (π) bond</Term>. Now it&apos;s time to look inside a double bond and see why
          those two kinds of bond are so different, and why that difference decides whether a molecule
          can twist.
        </p>

        {/* ── TWO WAYS TO OVERLAP ─────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          TWO WAYS TO OVERLAP
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            A covalent bond forms when orbitals from two atoms overlap and share a pair of electrons. There
            are two ways that overlap can happen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="p-4" style={{ border: "1px solid #34d39933", background: "#34d39908", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#34d399", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                σ · HEAD-ON
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                The orbitals point straight at each other and overlap end to end. The shared electrons sit
                directly between the nuclei, on the line connecting them (the bond axis). This is the
                strongest, most direct kind of overlap.
              </p>
            </div>
            <div className="p-4" style={{ border: "1px solid #60a5fa33", background: "#60a5fa08", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#60a5fa", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                π · SIDE BY SIDE
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Two parallel <Term id="p-orbital">p orbitals</Term>, the dumbbell shapes from lesson 2.3,
                lean against each other sideways. Their electrons sit in two lobes, above and below the bond
                axis, with nothing on the axis itself. The overlap is weaker.
              </p>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            There&apos;s only room for one head-on overlap between two atoms, so a bond always starts with one
            σ bond. Any extra shared pairs have to overlap side by side, as π bonds. Explore all three below.
            The 3D view shows only the carbon–carbon bond, so the hydrogens&apos; bonds don&apos;t clutter the
            picture.
          </p>

          {/* Density viewer */}
          <div
            className="p-6 mb-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
              WHERE THE ELECTRONS SIT
            </p>
            <SigmaPiDensityViewer />
          </div>
        </div>

        {/* ── LOCKED ROTATION ─────────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          TRY TO TWIST IT
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Here&apos;s where the shape of the overlap really matters. Imagine grabbing both ends of the
            molecule and twisting them in opposite directions around the bond axis, like wringing out a towel.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            A σ bond is shaped like a sausage wrapped around the axis, so it looks the same from every angle.
            Twisting doesn&apos;t change the overlap at all, which means atoms joined by a single bond can
            spin freely. This is called <Term id="bond-rotation">free rotation</Term>.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            A π bond is different. It only exists while the two p orbitals stay parallel. Twist the two ends
            relative to each other and the p orbitals stop lining up, the side-by-side overlap shrinks, and at 90° the π bond is gone.
            Breaking it takes a lot of energy, so in practice a double bond is locked: the two carbons and
            the four atoms attached to them are locked in the same plane and can&apos;t rotate.
          </p>

          {/* Rotation lab */}
          <div
            className="p-6 mb-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
              ROTATION LAB
            </p>
            <BondRotationLab />
          </div>
        </div>

        {/* ── CIS / TRANS ─────────────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          WHY IT MATTERS: CIS AND TRANS
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Locked rotation has a surprising consequence. Swap two of ethene&apos;s hydrogens for chlorine
            atoms, one on each carbon, and there are two ways to arrange them: both chlorines on the same
            side of the double bond, or on opposite sides.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Around a single bond those two arrangements would just be the same molecule mid-spin. But the
            double bond can&apos;t turn, so neither one can become the other. They are two different compounds
            with the same formula, C₂H₂Cl₂. Molecules like this are called{" "}
            <Term id="cis-trans-isomers">cis–trans isomers</Term> (<em>cis</em> is Latin for &ldquo;on this
            side,&rdquo; <em>trans</em> for &ldquo;across&rdquo;).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { cis: true, name: "CIS-1,2-DICHLOROETHENE", color: "#a855f7", facts: ["Chlorines on the same side", "Polar: the C–Cl dipoles add up", "Boils at 60 °C"] },
              { cis: false, name: "TRANS-1,2-DICHLOROETHENE", color: "#34d399", facts: ["Chlorines on opposite sides", "Nonpolar overall: the dipoles cancel", "Boils at 48 °C"] },
            ].map(({ cis, name, color, facts }) => (
              <div key={name} className="p-4" style={{ border: `1px solid ${color}33`, background: `${color}08`, borderRadius: "4px" }}>
                <p className="font-heading text-xs mb-2" style={{ color, letterSpacing: "0.08em", fontSize: "0.65rem" }}>{name}</p>
                <div className="flex justify-center mb-2"><Dichloroethene cis={cis} /></div>
                <div className="flex flex-col gap-1">
                  {facts.map(f => (
                    <p key={f} className="text-sm" style={{ color: "var(--oc-text-muted)" }}>· {f}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Same atoms, same bonds, but a different shape, so a different <Term id="polarity">polarity</Term>{" "}
            and a different boiling point. You&apos;ll meet many more of these in organic chemistry.
          </p>

          <SideNote title="HOW YOU'RE READING THIS" label="IN YOUR BODY">
            The cells in your retina contain a molecule called retinal, which has a cis double bond that puts
            a kink in its chain. When light hits it, the photon&apos;s energy briefly breaks the π bond. For an
            instant the bond can rotate, and the molecule snaps into the straighter trans shape. That change
            of shape is what triggers the nerve signal your brain reads as light. It happens in about 200
            femtoseconds (0.0000000000002 seconds), making it one of the fastest chemical reactions in
            biology.
          </SideNote>
        </div>

        {/* ── σ vs π ──────────────────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          σ vs π AT A GLANCE
        </h2>
        <div className="max-w-2xl mb-10">
          <div className="mb-6 p-4" style={{ border: "1px solid rgba(148,163,184,0.2)", borderRadius: "4px" }}>
            <div className="grid gap-y-3 gap-x-4" style={{ gridTemplateColumns: "auto 1fr 1fr" }}>
              {["", "σ BOND", "π BOND"].map((h, i) => (
                <span key={`h-${i}`} className="font-heading"
                  style={{ color: i === 1 ? "#34d399" : i === 2 ? "#60a5fa" : "var(--oc-text-dim)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
                  {h}
                </span>
              ))}
              {[
                ["OVERLAP", "head-on", "side by side"],
                ["ELECTRONS SIT", "on the bond axis", "above & below the axis"],
                ["HOW MANY", "exactly 1 in every bond", "0, 1, or 2"],
                ["STRENGTH", "stronger", "weaker"],
                ["ROTATION", "free", "locked"],
                ["REACTIVITY", "tucked in, less exposed", "exposed, more reactive"],
              ].map(([label, sigma, pi]) => (
                <div key={label} className="contents">
                  <span className="font-heading self-center" style={{ color: "var(--oc-text-dim)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>{label}</span>
                  <span className="text-sm" style={{ color: "var(--oc-text-muted)" }}>{sigma}</span>
                  <span className="text-sm" style={{ color: "var(--oc-text-muted)" }}>{pi}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            You can see the strength difference in real <Term id="bond-energy">bond energies</Term>, the energy
            needed to break a bond:
          </p>

          <div className="mb-6 p-4" style={{ border: "1px solid rgba(148,163,184,0.2)", borderRadius: "4px" }}>
            <div className="grid gap-y-2 gap-x-4" style={{ gridTemplateColumns: "auto 1fr auto auto" }}>
              {["BOND", "MAKEUP", "LENGTH", "ENERGY"].map((h, i) => (
                <span key={h} className={`font-heading ${i > 1 ? "text-right" : ""}`}
                  style={{ color: "var(--oc-text-dim)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                  {h}
                </span>
              ))}
              {[
                ["C–C", "1σ", "154 pm", "347 kJ/mol"],
                ["C=C", "1σ + 1π", "134 pm", "614 kJ/mol"],
                ["C≡C", "1σ + 2π", "120 pm", "839 kJ/mol"],
              ].map(([bond, makeup, length, energy]) => (
                <div key={bond} className="contents">
                  <span className="font-heading text-sm" style={{ color: "var(--oc-text)" }}>{bond}</span>
                  <span className="text-sm" style={{ color: "var(--oc-text-muted)" }}>{makeup}</span>
                  <span className="text-sm text-right" style={{ color: "var(--oc-text-muted)" }}>{length}</span>
                  <span className="font-heading text-sm text-right" style={{ color: "#f5a623" }}>{energy}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            A double bond is stronger than a single bond, but not twice as strong. Adding the π bond adds only
            about 267 kJ/mol (614 − 347), less than the 347 kJ/mol of the σ bond alone. The π bond is the
            weaker part of a double bond, and because its electrons sit out in the open above and below the
            axis, it&apos;s also the part that reacts first. That&apos;s why π bonds show up as electron-rich
            red regions on the ESP maps from lesson 3.2.
          </p>
        </div>

        {/* ── QUICK SUMMARY ───────────────────────────────── */}
        <div
          className="max-w-2xl mb-10 p-5"
          style={{ border: "1px solid rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.04)", borderRadius: "4px" }}
        >
          <p className="font-heading text-xs mb-4" style={{ color: "rgba(52,211,153,0.8)", letterSpacing: "0.12em", fontSize: "0.7rem" }}>
            LESSON SUMMARY
          </p>
          <div className="flex flex-col gap-2">
            {[
              "A σ bond forms from head-on overlap; its electrons sit on the bond axis between the nuclei.",
              "A π bond forms from side-by-side overlap of parallel p orbitals; its electrons sit above and below the axis.",
              "Every covalent bond has exactly one σ bond. Single = 1σ, double = 1σ + 1π, triple = 1σ + 2π.",
              "Single bonds rotate freely. Twisting a double bond misaligns the p orbitals and breaks the π bond, so double bonds are locked.",
              "Locked rotation creates cis–trans isomers: same formula, different shape, different properties.",
              "π bonds are weaker and more exposed than σ bonds, which makes them the most reactive part of a multiple bond.",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-heading shrink-0 mt-0.5" style={{ color: "rgba(52,211,153,0.6)", fontSize: "0.65rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── UP NEXT ─────────────────────────────────────── */}
        <div
          className="max-w-2xl mb-16 p-6"
          style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
        >
          <p className="font-heading text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            COMING NEXT
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            You&apos;ve seen that a double bond locks the atoms around it in a plane. But why is water bent, methane
            shaped like a tetrahedron, and carbon dioxide a straight line? Next up is molecular shape: how bonds
            and lone pairs push each other apart into three dimensions.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/metallic-bonding"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.12em" }}
          >
            ← PREV: METALLIC BONDING
          </Link>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em" }}
          >
            BACK TO CHEMISTRY I →
          </Link>
        </div>

      </div>
    </main>
  );
}
