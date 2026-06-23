import type { MeasurementSection } from "@/components/ui/MeasurementsCard";

/**
 * Elbow MRI Quick Reference content. Rendered with the shared collapsible section
 * renderer (MeasurementsCard), mirroring the Shoulder/Hip reference. Concise and
 * management-focused for primary-care sports-medicine fellows. Authored from an
 * adversarially MSK-verified blueprint and kept consistent with the Elbow modules/
 * cases: capitellar OCD read on coronal+sagittal (the 5 mm cyst is knee-derived, not
 * validated for the capitellum → "sizeable/multiple"); no hard distal-biceps repair
 * deadline; AIN palsy is often Parsonage–Turner not compression; the radial-head
 * surgical trigger is a mechanical block, not the 2 mm number alone.
 */

// ── Tab 1: Normal anatomy, planes, sequences, variants ──────────────────────
export const elbowAnatomySections: MeasurementSection[] = [
  {
    title: "Planes — what each one answers",
    items: [
      {
        label: "Axial",
        detail:
          "Cross-sections the four compartments. Best for the ulnar nerve in the cubital tunnel (and dynamic flexion subluxation), the radial nerve/PIN at the radiocapitellar level, the common flexor/extensor origins, the annular ligament around the radial neck, and the distal biceps footprint.",
      },
      {
        label: "Coronal",
        detail:
          "The UCL anterior bundle to the sublime tubercle, the RCL/LUCL complex, the common flexor and extensor origins, and the capitellar/trochlear articular surfaces. This is the plane to read the T-sign. (Currently the only sequences on hand are coronal and axial T2 FS.)",
      },
      {
        label: "Sagittal",
        detail:
          "The distal biceps and triceps, the brachialis, the anterior/posterior fat pads, the trochlea/capitellum cartilage contour, and the olecranon/coronoid fossae for loose bodies. Read capitellar OCD on coronal + sagittal together.",
      },
      {
        label: "FABS (Flexion–ABduction–Supination, prone)",
        detail:
          "A dedicated view that lays the distal biceps footprint flat at the radial tuberosity for partial-tear grading and retraction measurement.",
      },
    ],
  },
  {
    title: "Sequences — what they're for",
    items: [
      {
        label: "Fluid-sensitive fat-sat (T2 FS / STIR)",
        detail:
          "Edema, partial/complete tendon and ligament tears, the OCD fluid rim, marrow injury, effusions, and subacute muscle denervation edema. A finding is more convincing when fluid-bright signal points to it.",
      },
      {
        label: "T1-weighted",
        detail:
          "Anatomy, marrow replacement (confluent low-T1 below muscle signal is the red flag), arthrogram contrast, occult fracture lines, and chronic fatty muscle atrophy.",
      },
      {
        label: "MR arthrography",
        detail:
          "Most sensitive for the UCL undersurface (T-sign) tear and intra-articular loose bodies/chondral delamination — intra-articular contrast undercuts a partial tear and outlines bodies. An abduction/valgus or flexed positioning adjunct can help open the medial joint (the elbow-specific evidence base is thin, unlike the shoulder ABER). Add it only when it changes the decision.",
      },
    ],
  },
  {
    title: "Medial compartment",
    items: [
      {
        label: "UCL (ulnar collateral) complex",
        detail:
          "The anterior bundle is the primary valgus restraint (origin anteroinferior medial epicondyle → insertion at the sublime tubercle of the coronoid); the posterior bundle (cubital tunnel floor) and transverse/Cooper ligament are secondary. Normal anterior bundle = thin, taut, uniformly low signal to the sublime tubercle; a small synovial recess can be normal.",
      },
      {
        label: "Common flexor-pronator origin",
        detail:
          "Uniform low-signal tendon off the medial epicondyle; the site of medial epicondylitis. It overlies the UCL — read the two together.",
      },
      {
        label: "Ulnar nerve",
        detail:
          "In the cubital tunnel posterior to the medial epicondyle beneath Osborne's retinaculum. Assess caliber/signal and flexion subluxation; compare to the median nerve and the contralateral side.",
      },
    ],
  },
  {
    title: "Lateral compartment",
    items: [
      {
        label: "Common extensor origin (ECRB)",
        detail:
          "Off the lateral epicondyle; the site of lateral epicondylitis (angiofibroblastic tendinosis).",
      },
      {
        label: "RCL / LUCL complex",
        detail:
          "The radial collateral ligament blends into the annular ligament; the lateral ulnar collateral ligament (LUCL: lateral epicondyle → posterior to the radial head → supinator crest) is the key restraint to posterolateral rotatory instability. The LUCL/RCL origin lies deep to the common extensor tendon — a deep extensor tear can take it.",
      },
      {
        label: "Annular ligament & radiocapitellar joint",
        detail:
          "The annular ligament stabilizes the radial head (best on axial); the capitellum is the OCD site (anterolateral/central).",
      },
      {
        label: "Radial nerve / PIN",
        detail:
          "Divides at the radiocapitellar level; the posterior interosseous nerve enters the supinator under the arcade of Frohse.",
      },
      {
        label: "Pseudodefect of the capitellum",
        detail:
          "A normal posterolateral/postero-inferior bare-area groove — NOT an osteochondral lesion. Do not over-call it.",
      },
    ],
  },
  {
    title: "Anterior, posterior compartments & coronoid",
    items: [
      {
        label: "Distal biceps tendon",
        detail:
          "Bifurcated footprint on the radial tuberosity; the lacertus fibrosus is the aponeurotic expansion that tethers it; the bicipitoradial bursa sits between the tendon and the tuberosity.",
      },
      {
        label: "Brachialis",
        detail:
          "Inserts on the coronoid/ulnar tuberosity; the primary elbow flexor, lying behind the biceps.",
      },
      {
        label: "Triceps tendon",
        detail:
          "Inserts broadly on the olecranon; the deep central fibers can tear first while the superficial expansion stays intact.",
      },
      {
        label: "Olecranon, coronoid & fossae",
        detail:
          "The valgus-extension-overload posteromedial olecranon osteophyte and loose-body niches; the coronoid (sublime tubercle medially, anteromedial facet laterally) is the keystone of post-traumatic stability.",
      },
      {
        label: "Fat pads",
        detail:
          "The anterior fat pad is normally seen (elevation = the sail sign); the posterior fat pad is normally hidden in the olecranon fossa — any visible posterior fat pad after trauma means effusion/hemarthrosis.",
      },
    ],
  },
  {
    title: "Normal variants — don't overcall",
    items: [
      {
        label: "Capitellar pseudodefect & trochlear groove",
        detail:
          "The posterolateral capitellar bare-area groove and the transverse trochlear ridge/groove are normal — not osteochondral lesions.",
      },
      {
        label: "Distal-UCL synovial recess",
        detail:
          "A small normal synovial recess sits near the distal UCL. The abnormal T-sign threshold is fluid tracking BEYOND the articular-cartilage edge — a couple of millimetres of undercutting can be normal.",
      },
      {
        label: "Mild ulnar-nerve T2 signal",
        detail:
          "Mild ulnar-nerve T2 hyperintensity occurs in asymptomatic elbows — anchor the diagnosis to caliber change + muscle denervation + clinical correlation, not signal alone.",
      },
      {
        label: "Reactive epicondyle edema / thin RCL",
        detail:
          "Reactive lateral-epicondyle marrow edema and thin RCL signal accompany lateral epicondylitis — do not over-call an LCL tear.",
      },
      {
        label: "CRITOE ossification centers",
        detail:
          "Skeletally immature secondary ossification centers (capitellum, radial head, internal/medial epicondyle, trochlea, olecranon, external/lateral epicondyle) — do not call Panner or OCD on a normal center.",
      },
    ],
  },
];

// ── Tab 2: Measurements, grading systems & management thresholds ────────────
export const elbowMeasurementSections: MeasurementSection[] = [
  {
    title: "UCL grading & the T-sign",
    items: [
      {
        label: "Grading: sprain → partial undersurface → full-thickness",
        detail:
          "Sprain/low-grade: periligamentous/intrasubstance edema, fibers grossly intact, no surface-reaching defect. Partial undersurface tear = the T-sign (below). Full-thickness: fiber discontinuity across the whole thickness, a gap/retraction, or medial extravasation. Always describe location (proximal/mid/distal) and acute vs chronic. A <50%/>50% partial call is a descriptive heuristic, not a validated graded scale.",
      },
      {
        label: "The T-sign (partial undersurface tear)",
        detail:
          "Fluid/contrast undermines the distal/sublime-tubercle attachment BEYOND the articular-cartilage edge while the proximal fibers stay attached (articular-sided, not full-thickness). The abnormal threshold is fluid extending past the cartilage margin — a couple of millimetres can be a normal recess. MR arthrography is the most sensitive study.",
      },
      {
        label: "Management & the dynamic-US threshold",
        detail:
          "Repair ± internal brace vs reconstruction is driven by location/surface/acute-vs-chronic + athlete demand + the moving-valgus exam — NOT a single MRI cutoff. Distal/full-thickness tears do worse nonoperatively. On dynamic valgus-stress ultrasound, a side-to-side medial gapping difference of ~>1 mm (commonly cited ~1.5–2 mm) is the functional threshold.",
      },
    ],
  },
  {
    title: "Capitellar OCD — stability criteria",
    items: [
      {
        label: "Stable (rest + follow-up)",
        detail:
          "No fluid-bright surrounding signal, intact overlying cartilage, an in-situ fragment, and a low-signal demarcating margin → throwing rest and serial follow-up.",
      },
      {
        label: "Unstable — any of (surgical referral)",
        detail:
          "A T2 fluid-bright line completely undercutting the fragment (matching joint-fluid signal); a sizeable or multiple subchondral cyst(s); a high-signal cartilage cleft reaching the fragment; or a displaced fragment/loose body. NOTE: the 5 mm cyst figure is a knee-derived (De Smet) criterion not validated for the capitellum — teach 'sizeable or multiple.'",
      },
      {
        label: "Not stability signs / indeterminate",
        detail:
          "Surrounding marrow edema alone is NOT a stability sign; an isolated high-T2 line without a cartilage breach or cyst is INDETERMINATE. Read on coronal + sagittal; add MR/CT arthrography when stability will change the operation.",
      },
      {
        label: "OCD vs Panner",
        detail:
          "OCD = adolescent (~12–17 yr), focal anterolateral capitellum, fragmentation possible. Panner = osteochondrosis age ~5–10 yr, the whole ossific nucleus, self-limited, no fragment/cyst.",
      },
    ],
  },
  {
    title: "Medial epicondyle avulsion & olecranon stress (young thrower)",
    items: [
      {
        label: "Little League elbow (apophysitis)",
        detail:
          "A widened, fluid-bright medial epicondyle physis with marrow edema; managed with throwing rest.",
      },
      {
        label: "Avulsion — operative triggers",
        detail:
          "Report exact displacement in mm and whether the fragment is intra-articular/incarcerated (a transiently dislocated elbow can trap it after spontaneous reduction). Operative triggers in a throwing athlete: displacement ≥5 mm, an intra-articular/incarcerated fragment, or valgus instability — incarceration/instability mandates surgery regardless of the mm (the general-population mm cutoff is debated).",
      },
      {
        label: "Olecranon stress + CRITOE",
        detail:
          "A discrete low-signal line + edema = stress fracture; edema only = stress reaction. The olecranon apophysis fuses mid-to-late teens (~15–17 yr, later in throwers) — compare to the contralateral side, not a hard cutoff. CRITOE rule: the trochlea never ossifies before the medial epicondyle, so a visible trochlea without the medial epicondyle implies the epicondyle is avulsed (often intra-articular).",
      },
    ],
  },
  {
    title: "Distal biceps tear — retraction & the lacertus",
    items: [
      {
        label: "Partial vs complete",
        detail:
          "Partial = usually an undersurface tear at the radial-tuberosity footprint (best on FABS). Complete = full discontinuity with a balled-up, wavy stump.",
      },
      {
        label: "Retraction & the lacertus fibrosus",
        detail:
          "State retraction (where the stump sits, in cm) and the lacertus status. An INTACT lacertus tethers the tendon, limits retraction, and can mask a complete tear clinically and on imaging; a DISRUPTED lacertus allows proximal retraction and an empty tuberosity. Bicipitoradial bursitis is a clue to scrutinize the insertion, not a diagnosis.",
      },
      {
        label: "Surgical timing (a guideline, not a deadline)",
        detail:
          "Earlier anatomic repair is technically easier; chronic retracted tears that won't reach the tuberosity (often only after many weeks-to-months, when irreducible) need a graft. Many primary repairs succeed out to ~4–6 weeks and beyond — do NOT teach a hard 2–4 week / graft-after-6-week cutoff.",
      },
    ],
  },
  {
    title: "Triceps tear",
    items: [
      {
        label: "Tendinosis vs partial vs complete",
        detail:
          "The deep central fibers fail first while the superficial expansion stays intact — so it can look partial despite near-complete clinical weakness. Complete = a full-thickness gap with a retracted stump ± an olecranon flake. Report the percentage of tendon width torn and the gap.",
      },
      {
        label: "When to repair",
        detail:
          "A complete rupture is surgical; high-grade partials (commonly >50% width torn, or ANY tear with extension weakness against resistance) are repaired — don't undercall as 'tendinosis.'",
      },
    ],
  },
  {
    title: "Epicondylitis & the adjacent ligament",
    items: [
      {
        label: "Grading",
        detail:
          "Tendinosis (thickening + intermediate signal, intact fibers, no surface-reaching fluid/gap) → partial-thickness tear → full-thickness gap at the origin. Lateral = common extensor (ECRB); medial = common flexor/pronator.",
      },
      {
        label: "The companion to always check",
        detail:
          "Trace the LUCL to the supinator crest with lateral epicondylitis, and the anterior-bundle UCL with medial epicondylitis — the adjacent ligament is where the surgery hides.",
      },
      {
        label: "Escalation",
        detail:
          "A deep/full-thickness common-extensor tear with a fluid-bright gap that undercuts/communicates with the radiocapitellar joint and INVOLVES the LUCL implies PLRI → ligament repair/reconstruction (a known complication of prior lateral steroid injection/release). A concomitant UCL tear with medial epicondylitis shifts a thrower toward UCL reconstruction. Don't over-call reactive epicondyle edema or thin RCL signal as an LCL tear.",
      },
    ],
  },
  {
    title: "LCL complex, PLRI & the coronoid (post-trauma instability)",
    items: [
      {
        label: "LUCL & PLRI",
        detail:
          "LUCL: lateral epicondyle → posterior to the radial head → supinator crest; the primary restraint to posterolateral rotatory instability. Trace it on coronal + axial (partial-volume averaging causes misses). There is no standardized single MRI measurement — call it on continuity, surface, and radiocapitellar alignment plus the clinical pivot-shift.",
      },
      {
        label: "The O'Driscoll circle",
        detail:
          "A dislocation disrupts soft tissue lateral-to-medial (LUCL → capsule → MCL), so the LCL is the primary lesion in most simple dislocations. Look for the Osborne–Cotterill posterolateral capitellar impaction and heterotopic ossification after any dislocation.",
      },
      {
        label: "Coronoid classifications & surgical patterns",
        detail:
          "Regan–Morrey by HEIGHT (I = tip avulsion, II = ≤50%, III = >50%); O'Driscoll for the ANTEROMEDIAL FACET (the VPMRI lesion). Persistent/recurrent PLRI → LUCL repair/reconstruction; the anteromedial coronoid facet fracture (small on radiographs) implies varus posteromedial rotatory instability and is surgical; the terrible triad (dislocation + radial head + coronoid fracture) is surgical with the coronoid and LCL as keystones. Comment on LUCL integrity in EVERY post-dislocation or post-lateral-surgery elbow.",
      },
    ],
  },
  {
    title: "Ulnar nerve / cubital tunnel",
    items: [
      {
        label: "What to report",
        detail:
          "Nerve enlargement and T2 hyperintensity at/just distal to the medial epicondyle, plus denervation of FCU, the ulnar FDP, and the ulnar intrinsics. Compare caliber/signal to the median nerve and the contralateral side (no universal cross-sectional-area cutoff; mild T2 brightness can be normal). Assess flexion subluxation on axial; look for an anconeus epitrochlearis, ganglion, or osteophyte. Snapping triceps can coexist.",
      },
      {
        label: "What changes the operation",
        detail:
          "Anchor the diagnosis to caliber change + muscle denervation + clinical correlation, not signal alone. Dynamic subluxation or an accessory muscle favors transposition over in-situ decompression; snapping triceps means the triceps must be addressed, not just the nerve.",
      },
    ],
  },
  {
    title: "PIN / radial tunnel & AIN",
    items: [
      {
        label: "PIN syndrome",
        detail:
          "The PIN compresses most commonly at the arcade of Frohse. PIN syndrome = motor digit drop with radially-deviated wrist extension (ECRL spared) and extensor-compartment denervation; the SUPINATOR is variably involved/often spared (its branches arise proximal to the arcade) — don't assert supinator denervation as a constant feature. Radial tunnel syndrome = pain without a motor deficit and often a normal MRI; report any mass at the arcade.",
      },
      {
        label: "AIN (Kiloh–Nevin) — and the Parsonage–Turner caveat",
        detail:
          "Pure motor: FPL, the FDP to index/middle, and pronator quadratus (classically isolated PQ edema). An AIN palsy is frequently neuralgic amyotrophy (Parsonage–Turner) rather than mechanical compression → usually NO surgery; pivot to EMG/observation.",
      },
      {
        label: "Denervation timeline",
        detail:
          "No MRI change for the first ~2–4 weeks → subacute T2/STIR muscle edema → chronic T1 fatty atrophy. Use the denervated muscle to localize the lesion.",
      },
    ],
  },
  {
    title: "Occult fracture & alignment",
    items: [
      {
        label: "The displaced posterior fat pad",
        detail:
          "Any visible (displaced) posterior fat pad in an adult after trauma = hemarthrosis from an occult intra-articular fracture (radial head most common; supracondylar and the non-union-prone lateral condyle/Salter-Harris IV in children) until proven otherwise. MRI shows the line + marrow edema and distinguishes a true fracture from a bone bruise.",
      },
      {
        label: "Radiocapitellar line",
        detail:
          "A line through the central long axis of the radial neck must bisect the capitellum on EVERY projection — failure = radial head subluxation/dislocation (think occult Monteggia).",
      },
      {
        label: "Mason radial-head framework & the surgical trigger",
        detail:
          "Mason I = non-/minimally displaced, II = displaced (commonly >2 mm) partial-articular, III = comminuted whole-head. The surgical trigger is a mechanical BLOCK to forearm rotation, an articular fragment displaced enough to impede motion, or comminution (Mason III) — NOT the 2 mm number alone (many Mason II without a block are managed nonoperatively).",
      },
    ],
  },
  {
    title: "Loose bodies, radiocapitellar plica & olecranon bursitis",
    items: [
      {
        label: "Loose bodies",
        detail:
          "They migrate to the dependent recesses (coronoid fossa, olecranon fossa, radiocapitellar recess) and are best seen against bright joint fluid on sagittal fluid-sensitive images; GRE blooms ossified bodies; CT/CT arthrography is most sensitive for small ossified bodies and for counting them pre-op. Primary elbow OA (coronoid/olecranon-tip and fossa osteophytes, chondral loss) is the most common source in non-throwers.",
      },
      {
        label: "Radiocapitellar plica",
        detail:
          "A thickened radiocapitellar plica/posterolateral synovial fold causes lateral catching and mimics a loose body/OCD — considered pathologic when thickened beyond ~3 mm with mechanical symptoms.",
      },
      {
        label: "Olecranon bursitis",
        detail:
          "Aseptic vs septic — MRI cannot reliably exclude infection. A red/warm/fluctuant bursa needs ASPIRATION, not just imaging.",
      },
    ],
  },
  {
    title: "Protocol — when each study changes management",
    items: [
      {
        label: "Non-contrast MRI",
        detail:
          "The first study for most questions: tendons, OCD, nerves, occult fracture, loose bodies. Non-contrast 3T answers most cases.",
      },
      {
        label: "MR arthrography",
        detail:
          "Add it for a suspected UCL undersurface (T-sign) tear and for loose-body/chondral-delamination detection when non-contrast MRI is equivocal, or when OCD stability will change the operation.",
      },
      {
        label: "CT, radiograph & dynamic ultrasound",
        detail:
          "CT is best for osseous fragment/loose-body quantification and complex fracture mapping (coronoid, terrible triad). Radiograph is first-line for the fat-pad sign, the radiocapitellar line, and osteophytes; dynamic ultrasound confirms ulnar-nerve subluxation and UCL valgus gapping that static MRI cannot.",
      },
    ],
  },
];
