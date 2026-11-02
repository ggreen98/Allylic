import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { Term } from "@/components/ui/Term";
import { MetallicBondSimulator } from "@/components/lessons/MetallicBondSimulator";

export const metadata = {
  title: "Metallic Bonding — Chemistry I | Allylic",
  description: "Learn how metal atoms share their valence electrons with the entire solid, and how that sea of electrons explains why metals conduct, bend, and shine.",
};

function HistoryNote({ title, label = "FROM HISTORY", children }: { title: string; label?: string; children: React.ReactNode }) {
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

export default function MetallicBondingLesson() {
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
          <span style={{ color: "var(--oc-green)" }}>METALLIC BONDING</span>
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
            LESSON 3.3
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
          METALLIC BONDING
        </h1>
        <p className="text-base leading-relaxed mb-10 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In <Term id="ionic-bond">ionic bonding</Term>, one atom gives an{" "}
          <Term id="electron">electron</Term> and another takes it. In{" "}
          <Term id="covalent-bond">covalent bonding</Term>, two atoms share a pair. But what happens
          when every atom in the material is a metal, and none of them hold on to their outer electrons
          very tightly? They stop keeping track of whose electrons are whose and share them with the
          whole solid. That&apos;s a <Term id="metallic-bond">metallic bond</Term>.
        </p>

        {/* ── THE ELECTRON SEA ────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          A SEA OF ELECTRONS
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Remember the two students sharing a library book from lesson 3.2? Metallic bonding is more
            like the public library itself. The books don&apos;t belong to any one reader; they belong to
            the whole town, and anyone can pick one up.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Metal atoms have only a few <Term id="valence-electron">valence electrons</Term> (sodium
            has 1, magnesium 2, aluminum 3), and as you saw with{" "}
            <Term id="ionization-energy">ionization energy</Term> in lesson 2.5, those electrons are
            loosely held. When billions of metal atoms pack together into a solid, each one releases its
            valence electrons into a pool shared by the entire piece of metal.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            What&apos;s left behind is a tightly packed, repeating grid of positive metal ions (
            <Term id="cation">cations</Term>), surrounded by electrons that are free to move anywhere in
            the solid. These are called <Term id="delocalized-electron">delocalized electrons</Term>,
            because they aren&apos;t located on any one atom or between any one pair of atoms. Chemists
            call this picture the <Term id="electron-sea">electron sea model</Term>.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            The <Term id="metallic-bond">metallic bond</Term> is the attraction between the positive ions
            and the negative sea around them. Unlike a covalent bond, it doesn&apos;t point from one
            specific atom to another. Every ion is attracted to the electrons all around it, in every
            direction at once.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Notice what&apos;s missing: the <Term id="octet-rule">octet rule</Term>. In ionic and covalent
            bonding, atoms give, take, or share electrons until each one has a full set of 8 (or 2 for
            hydrogen). That works best for nonmetals like carbon, nitrogen, oxygen, and fluorine, the elements
            that build organic molecules. Metallic bonding doesn&apos;t work that way. A sodium ion in sodium
            metal still keeps its 10 inner electrons, the same full, neon-like core it has in NaCl. What&apos;s
            different is where its one valence electron goes. In NaCl it goes to a chlorine atom that needs it
            to finish its own octet. In a metal it goes into the sea, shared by the entire solid, and no partner
            atom completes a shell with it. The bond comes from the collective attraction between the ions and
            the sea, not from atoms trading or sharing electrons to fill their shells.
          </p>

          {/* Simulator */}
          <div
            className="p-6 mb-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
              INSIDE A PIECE OF SODIUM
            </p>
            <MetallicBondSimulator />
          </div>

          {/* Model note */}
          <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(148,163,184,0.2)", background: "rgba(148,163,184,0.04)", borderRadius: "4px" }}>
            <span className="font-heading shrink-0" style={{ fontSize: "0.65rem", color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>MODEL NOTE</span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
              The electron sea is a simplified picture, but it explains almost everything about how metals
              behave. In more advanced courses you&apos;ll meet <em>band theory</em>, which describes the
              same delocalized electrons using energy levels that stretch across the whole metal.
            </p>
          </div>
        </div>

        {/* ── PROPERTIES OF METALS ────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          WHAT THE ELECTRON SEA EXPLAINS
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Nearly every property we think of as &ldquo;metallic&rdquo; comes straight from those free-moving
            electrons:
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="p-4" style={{ border: "1px solid #60a5fa33", background: "#60a5fa08", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#60a5fa", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                CONDUCT ELECTRICITY
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                An electric current is just moving charge. Metals have mobile electrons already in place, so
                they have high <Term id="electrical-conductivity">electrical conductivity</Term>. Silver is the
                best conductor of any element; copper is a close second and much cheaper, which is why it&apos;s
                in nearly every wire.
              </p>
              <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--oc-text-muted)" }}>
                <strong style={{ color: "var(--oc-text)" }}>Reality check:</strong> the electrons themselves
                zip around randomly at about 1,600 km/s, but the current is only their slow overall drift, about
                0.07 mm per second in a typical wire. Lights still turn on instantly because the push travels
                down the wire at close to the speed of light, starting every electron drifting at once. Think of
                a tube already packed with marbles: push one in, and one pops out the far end immediately.
              </p>
            </div>
            <div className="p-4" style={{ border: "1px solid #f5a62333", background: "#f5a62308", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#f5a623", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                CONDUCT HEAT
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Heat a metal at one end and the electrons there speed up. Because they roam freely, they carry
                that energy through the metal quickly. That&apos;s why a metal spoon in hot soup gets hot all the
                way up the handle, and a wooden one doesn&apos;t.
              </p>
            </div>
            <div className="p-4" style={{ border: "1px solid #34d39933", background: "#34d39908", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#34d399", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                BEND INSTEAD OF SHATTER
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Metals are <Term id="malleability">malleable</Term> (they can be hammered into sheets) and{" "}
                <Term id="ductility">ductile</Term> (they can be drawn into wires). Layers of ions can slide
                past each other because the electron sea moves with them, so no bond is ever broken. The
                opposite is <Term id="brittleness">brittle</Term>: cracking instead of bending, like the ionic
                crystal in the STRIKE IT mode above.
              </p>
            </div>
            <div className="p-4" style={{ border: "1px solid #a855f733", background: "#a855f708", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#a855f7", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                SHINE
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Metals have <Term id="luster">luster</Term>. When light hits a metal surface, the free electrons
                absorb it and immediately re-emit it, sending most of the light straight back to your eye.
              </p>
            </div>
          </div>

          <HistoryNote title="ARMOR OF PROOF">
            In the 1500s and 1600s, armorers tested a new breastplate by firing a pistol at it. A good plate
            came away with a dent: no hole, no crack. The steel had soaked up the bullet&apos;s energy by
            deforming, which is malleability doing its job. Armor that passed was sold as &ldquo;armor of
            proof,&rdquo; and many surviving breastplates still carry their proof dent. It&apos;s the origin
            of &ldquo;proof&rdquo; in words like bulletproof.
          </HistoryNote>
        </div>

        {/* ── BOND STRENGTH ───────────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          STRONGER AND WEAKER METALS
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Not every metallic bond is equally strong. A good way to compare them is melting point: the
            stronger the attraction between the ions and the electron sea, the more energy it takes to pull
            the solid apart. Two things make that attraction stronger:
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            <strong style={{ color: "var(--oc-text)" }}>More delocalized electrons per atom.</strong> Moving
            across period 3, sodium gives 1 electron to the sea, magnesium 2, and aluminum 3. A denser sea and
            more highly charged ions mean a stronger pull.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            <strong style={{ color: "var(--oc-text)" }}>Smaller atoms.</strong> Going down group 1,{" "}
            <Term id="atomic-radius">atomic radius</Term> grows (the same trend you saw in lesson 2.5), so the
            electron sea sits farther from each nucleus and is held more weakly. The larger the atomic radius,
            the lower the melting point.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              {
                title: "ACROSS PERIOD 3",
                note: "more electrons in the sea → higher melting point",
                detailHeader: "e⁻ IN SEA",
                color: "#60a5fa",
                rows: [
                  { el: "Na", detail: "1 per atom", mp: "98 °C" },
                  { el: "Mg", detail: "2 per atom", mp: "650 °C" },
                  { el: "Al", detail: "3 per atom", mp: "660 °C" },
                ],
              },
              {
                title: "DOWN GROUP 1",
                note: "larger atomic radius → lower melting point",
                detailHeader: "ATOMIC RADIUS",
                color: "#f5a623",
                rows: [
                  { el: "Li", detail: "152 pm", mp: "181 °C" },
                  { el: "Na", detail: "186 pm", mp: "98 °C" },
                  { el: "K",  detail: "227 pm", mp: "64 °C" },
                ],
              },
            ].map(({ title, note, detailHeader, color, rows }) => (
              <div key={title} className="p-4" style={{ border: `1px solid ${color}33`, background: `${color}08`, borderRadius: "4px" }}>
                <p className="font-heading text-xs mb-1" style={{ color, letterSpacing: "0.1em", fontSize: "0.7rem" }}>{title}</p>
                <p className="text-xs mb-3" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.05em" }}>{note}</p>
                <div className="grid gap-y-1.5 gap-x-3" style={{ gridTemplateColumns: "2.5rem 1fr auto" }}>
                  {["", detailHeader, "MELTING POINT"].map((h, i) => (
                    <span key={`h-${i}`} className={`font-heading ${i === 2 ? "text-right" : ""}`}
                      style={{ color: "var(--oc-text-dim)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                      {h}
                    </span>
                  ))}
                  {rows.map(({ el, detail, mp }) => (
                    <div key={el} className="contents">
                      <span className="font-heading text-sm" style={{ color: "var(--oc-text)" }}>{el}</span>
                      <span className="text-xs self-center" style={{ color: "var(--oc-text-dim)" }}>{detail}</span>
                      <span className="font-heading text-sm text-right" style={{ color }}>{mp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Transition metals push this to the extreme. Their d electrons can join the sea too, so metals like
            iron (1538 °C) and tungsten (3422 °C, the highest melting point of any metal) are held together very
            strongly. At the other end, mercury melts at −39 °C, so it&apos;s a liquid at room temperature.
          </p>
        </div>

        {/* ── ALLOYS ──────────────────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          MIXING METALS: ALLOYS
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Pure metals are often too soft to be useful. Pure gold can be bent by hand, and pure iron is
            soft enough to dent and bend under everyday loads. The fix is an <Term id="alloy">alloy</Term>: a metal mixed with one or more
            other elements.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            The electron sea doesn&apos;t care which ions it surrounds, so the mixture still bonds metallically.
            But atoms of a different size make the layers lumpy. Like trying to slide a stack of trays with
            marbles stuck between them, the layers can&apos;t glide past each other as easily, so the alloy is
            harder and stronger than the pure metal.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              { name: "BRASS", recipe: "copper + zinc", color: "#f5a623", text: "Harder than copper and resists corrosion. Used in musical instruments, door hardware, and plumbing fittings." },
              { name: "BRONZE", recipe: "copper + tin", color: "#fb923c", text: "One of the first alloys humans made, around 5,000 years ago — strong enough to give its name to the Bronze Age." },
              { name: "STEEL", recipe: "iron + a little carbon", color: "#94a3b8", text: "Small carbon atoms tuck into the gaps between iron atoms and jam the layers. Even about 1% carbon makes iron dramatically stronger. Add chromium and you get stainless steel." },
            ].map(({ name, recipe, color, text }) => (
              <div key={name} className="p-4" style={{ border: `1px solid ${color}33`, background: `${color}08`, borderRadius: "4px" }}>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <p className="font-heading text-xs" style={{ color, letterSpacing: "0.1em", fontSize: "0.7rem" }}>{name}</p>
                  <span className="font-heading text-xs" style={{ color: "var(--oc-text-dim)", fontSize: "0.6rem", letterSpacing: "0.08em" }}>{recipe}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Hard vs brittle */}
          <p className="font-heading mb-3 mt-8" style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.78rem" }}>
            HARD ISN&apos;T THE OPPOSITE OF BRITTLE
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            It&apos;s easy to mix these up. <Term id="hardness">Hardness</Term> is how well a material resists
            being scratched or dented. <Term id="brittleness">Brittleness</Term> is whether it cracks instead of
            bending once it does give way. A material can be hard and brittle, soft and tough, or anything in
            between:
          </p>

          <div className="mb-6 p-4" style={{ border: "1px solid rgba(148,163,184,0.2)", borderRadius: "4px" }}>
            <div className="grid gap-y-2 gap-x-4" style={{ gridTemplateColumns: "1fr auto auto" }}>
              {["MATERIAL", "HARD?", "BRITTLE?"].map((h, i) => (
                <span key={h} className={`font-heading ${i > 0 ? "text-right" : ""}`}
                  style={{ color: "var(--oc-text-dim)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                  {h}
                </span>
              ))}
              {[
                { name: "Pure gold", hard: "soft", brittle: "no, bends", bad: false },
                { name: "Table salt (ionic)", hard: "soft", brittle: "yes, shatters", bad: true },
                { name: "Steel", hard: "hard", brittle: "no, tough", bad: false },
                { name: "Cast iron (lots of carbon)", hard: "very hard", brittle: "yes, cracks", bad: true },
                { name: "Diamond (covalent)", hard: "hardest natural", brittle: "yes, can shatter", bad: true },
              ].map(({ name, hard, brittle, bad }) => (
                <div key={name} className="contents">
                  <span className="text-sm" style={{ color: "var(--oc-text)" }}>{name}</span>
                  <span className="text-sm text-right" style={{ color: "var(--oc-text-muted)" }}>{hard}</span>
                  <span className="text-sm text-right" style={{ color: bad ? "#ef4444" : "#34d399" }}>{brittle}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Look at the first two rows: gold and table salt are about equally soft, but hit them and gold
            flattens while salt shatters. The difference is the bonding, not the hardness.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            In metals, hardness and brittleness are two ends of the same dial: how easily the layers can slide.
            Layers that slide freely make a metal soft and malleable. Jam them with a few carbon atoms and you
            get steel, which is harder but still tough. Jam them too much (cast iron has 2 to 4% carbon) and
            the layers can barely move at all, so the metal is very hard but cracks if you drop it. Metalworkers
            have spent thousands of years learning to balance the two.
          </p>

          <HistoryNote title="THE KATANA: TWO STEELS IN ONE BLADE">
            Japanese swordsmiths solved the hard-vs-brittle problem by giving one blade both properties. Before
            quenching the hot blade in water, they coated it in clay: a thin layer over the edge and a thick
            layer over the spine. The edge cooled fast and became extremely hard, so it held a razor edge. The
            spine cooled slowly and stayed softer and tougher, so it absorbed shocks instead of snapping. The
            wavy line where the two zones meet, the <em>hamon</em>, is still visible on the finished sword, and
            the uneven cooling is part of what gives the blade its curve.
          </HistoryNote>
        </div>

        {/* ── THREE WAYS TO BOND ──────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THREE WAYS TO BOND
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            You&apos;ve now seen all three major types of chemical bond. What separates them is what happens to
            the valence electrons:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                name: "IONIC",
                color: "#a78bfa",
                rows: [
                  ["BETWEEN", "metal + nonmetal"],
                  ["ELECTRONS", "transferred"],
                  ["OCTET RULE?", "yes: ions reach a full octet"],
                  ["EXAMPLE", "NaCl"],
                  ["SOLID CONDUCTS?", "no"],
                  ["WHEN STRUCK", "shatters"],
                ],
              },
              {
                name: "COVALENT",
                color: "#34d399",
                rows: [
                  ["BETWEEN", "nonmetal + nonmetal"],
                  ["ELECTRONS", "shared between 2 atoms"],
                  ["OCTET RULE?", "yes: shared pairs complete it"],
                  ["EXAMPLE", "H₂O"],
                  ["SOLID CONDUCTS?", "usually no"],
                  ["WHEN STRUCK", "usually soft, crumbles"],
                  ["EXCEPTION", "diamond: covalent, very hard"],
                ],
              },
              {
                name: "METALLIC",
                color: "#60a5fa",
                rows: [
                  ["BETWEEN", "metal + metal"],
                  ["ELECTRONS", "shared by the whole solid"],
                  ["OCTET RULE?", "no: electrons go to the sea, not a partner"],
                  ["EXAMPLE", "Cu"],
                  ["SOLID CONDUCTS?", "yes"],
                  ["WHEN STRUCK", "bends"],
                ],
              },
            ].map(({ name, color, rows }) => (
              <div key={name} className="p-4" style={{ border: `1px solid ${color}33`, background: `${color}08`, borderRadius: "4px" }}>
                <p className="font-heading text-xs mb-3" style={{ color, letterSpacing: "0.1em", fontSize: "0.75rem" }}>{name}</p>
                <div className="flex flex-col gap-2">
                  {rows.map(([label, value]) => (
                    <div key={label}>
                      <p className="font-heading" style={{ color: "var(--oc-text-dim)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>{label}</p>
                      <p className="text-sm" style={{ color: "var(--oc-text-muted)" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <HistoryNote title="NAPOLEON'S CRUMBLING BUTTONS" label="MYTH vs CHEMISTRY">
              A popular story says that during Napoleon&apos;s 1812 retreat from Russia, his soldiers&apos; tin
              buttons crumbled to dust in the cold. Historians doubt it, but the chemistry behind it is real.
              Below 13 °C, shiny metallic tin can slowly rearrange into gray tin, which has the same structure as
              diamond: each atom locked into fixed covalent bonds with its neighbors. With no electron sea, it
              stops behaving like a metal. It expands, can&apos;t bend, and crumbles into powder. Same element,
              different bonding, completely different material. Chemists call it &ldquo;tin pest.&rdquo;
            </HistoryNote>
          </div>
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
              "In a metal, every atom releases its valence electrons into a sea shared by the entire solid.",
              "A metallic bond is the attraction between the positive metal ions and the delocalized electrons around them.",
              "Mobile electrons make metals good conductors of electricity and heat, and give them their luster.",
              "Layers of metal ions can slide without breaking bonds, so metals are malleable and ductile instead of brittle.",
              "Metallic bonds get stronger with more delocalized electrons per atom and with smaller ions.",
              "Alloys mix in atoms of different sizes, which jam the layers and make the metal harder. Jam them too much and it turns brittle.",
              "Hardness (resisting scratches and dents) and brittleness (cracking instead of bending) are different properties: salt and gold are equally soft, but only salt shatters.",
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
            UP NEXT
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            With all three bond types covered, lesson 3.4 goes back inside the covalent bond. You&apos;ll see
            where sigma and pi electrons actually sit, and why a double bond locks two atoms so they can&apos;t
            twist.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/covalent-bonding"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.12em" }}
          >
            ← PREV: COVALENT BONDING
          </Link>
          <Link
            href="/courses/chemistry-1/lessons/sigma-pi-bonds"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em" }}
          >
            NEXT: SIGMA &amp; PI BONDS →
          </Link>
        </div>

      </div>
    </main>
  );
}
