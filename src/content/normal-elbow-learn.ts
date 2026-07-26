/**
 * Interactive "master normal first" content for the Normal Elbow MRI workstation.
 * Mirrors the other Normal MRI workstations: each plane (keyed by its SERIES id in
 * NormalElbowMriPage) has a Guided Tour, a Knowledge Check, "watch for" pearls,
 * reading points, and an anatomy + ultrasound correlate.
 *
 * Marker coordinates are PERCENTAGES of the displayed slice image (x = left,
 * y = top). sliceIndex is 0-based into that plane's stack (slice_01.jpg = index 0).
 *
 * Teaching notes + quiz keys were authored from the MSK-verified Elbow blueprint.
 * Orientation is VERIFIED from anatomy (radial head = lateral; basilic vein =
 * medial; humerus = superior): coronal & axial are medial-LEFT / lateral-RIGHT
 * (axial also anterior-top / posterior-bottom); sagittal is anterior-LEFT /
 * posterior-RIGHT. The axial ulnar-nerve marker was corrected from the lateral
 * to the posteromedial (cubital-tunnel) side after a 3-radiologist cross-check.
 * Remaining (x, y) positions are close and may be fine-tuned on the actual
 * images via the Adjust (admin) workbench.
 */
import type {
  PlaneLearn,
  AdvancedQ,
  ImageCaqQ,
  CorrelationItem,
  StructureCorrelate,
  StructureReading,
} from "./normal-mri-types";

export type { PlaneLearn, AdvancedQ, ImageCaqQ, CorrelationItem, StructureCorrelate, StructureReading };

export const normalElbowLearn: Record<string, PlaneLearn> = {
  // ───────────────────────────────────────────────────────────────────────
  // CORONAL T2 FS  (stack: normal-elbow-coronal, 25 slices)
  // The plane for the UCL anterior bundle to the sublime tubercle, the RCL/LUCL
  // origin, the common flexor/extensor origins, and the radiocapitellar (OCD)
  // face. Scroll anterior → posterior; the joint is mid-stack (~index 12). The
  // round radial-head disc marks the LATERAL side.
  // ───────────────────────────────────────────────────────────────────────
  "cor-t2fs": {
    tour: [
      {
        sliceIndex: 12,
        markers: [],
        title: "Get oriented",
        note: "Coronal T2 FS through the elbow: the distal humerus is above, the proximal radius and ulna below, and the joint runs across the middle. Fat-sat makes fluid and edema bright. This is the plane for the UCL anterior bundle (to the sublime tubercle), the common flexor and extensor origins off the epicondyles, the RCL/LUCL origin, and the radiocapitellar surface where capitellar OCD lives. The rounded radial-head disc sits on the LATERAL side.",
      },
      {
        sliceIndex: 12,
        markers: [{ x: 62, y: 50, label: "Capitellum" }],
        title: "Capitellum",
        note: "The capitellum is the rounded lateral condyle of the distal humerus, articulating with the radial head. It is THE site of osteochondritis dissecans in the adolescent thrower/gymnast — read its subchondral signal here on the coronal, then confirm on the sagittal (OCD is read on both planes together).",
      },
      {
        sliceIndex: 12,
        markers: [{ x: 46, y: 50, label: "Trochlea" }],
        title: "Trochlea",
        note: "The trochlea is the spool-shaped medial articular surface of the distal humerus, articulating with the trochlear notch of the ulna. Trace its smooth subchondral cortex; the transverse trochlear ridge/groove is a normal contour, not an osteochondral lesion.",
      },
      {
        sliceIndex: 12,
        markers: [{ x: 65, y: 64, label: "Radial head" }],
        title: "Radial head",
        note: "The radial head is the round disc of the proximal radius articulating with the capitellum laterally — the most common site of an occult fracture after a fall on the outstretched hand. Confirm the cortex is smooth and the marrow uniform; the posterolateral capitellar pseudodefect nearby is a normal bare-area groove.",
      },
      {
        sliceIndex: 12,
        markers: [{ x: 37, y: 56, label: "UCL (anterior bundle)" }],
        title: "Ulnar collateral ligament (anterior bundle)",
        note: "The anterior bundle of the UCL is the primary valgus restraint, running from the anteroinferior medial epicondyle to the sublime tubercle of the coronoid. Normal = a thin, taut, uniformly dark band to its distal attachment. The thrower's partial undersurface tear can produce a T-sign: fluid undercutting these distal fibers beyond the articular-cartilage edge.",
      },
      {
        sliceIndex: 12,
        markers: [{ x: 34, y: 44, label: "Common flexor origin" }],
        title: "Common flexor-pronator origin",
        note: "The common flexor-pronator tendon arises off the medial epicondyle and overlies the UCL. It is the site of medial epicondylitis (golfer's elbow) — read it together with the UCL and the ulnar nerve (the medial 'valgus triad'), since valgus overload injures all three.",
      },
      {
        sliceIndex: 12,
        markers: [{ x: 69, y: 44, label: "Common extensor origin" }],
        title: "Common extensor origin",
        note: "The common extensor tendon (ECRB) arises off the lateral epicondyle — the site of lateral epicondylitis (tennis elbow). The LUCL/RCL origin lies deep to it, so always trace the LUCL to the supinator crest: a deep extensor tear that takes the LUCL implies posterolateral rotatory instability.",
      },
      {
        sliceIndex: 12,
        markers: [],
        title: "Do-not-overcall checkpoint",
        note: "Before leaving the coronal stack, pause on the normal variants: the posterolateral capitellar pseudodefect is a posterior non-articular bare-area groove, not OCD by itself; a tiny distal UCL recess is not automatically a T-sign; and mild signal near the common extensor/LCL origin needs a real tear pattern before you call instability. Orthogonal confirmation is the habit.",
      },
    ],
    quiz: [
      {
        id: "ec-cor-q1",
        sliceIndex: 12,
        marker: { x: 62, y: 50 },
        prompt: "On this coronal T2 FS image, what is the marked rounded lateral condyle of the distal humerus?",
        options: ["Trochlea", "Capitellum", "Radial head", "Olecranon"],
        answer: 1,
        explanation:
          "The rounded LATERAL condyle articulating with the radial head is the capitellum — the site of osteochondritis dissecans in the young thrower/gymnast. The trochlea is the spool-shaped MEDIAL articular surface that articulates with the ulna.",
      },
      {
        id: "ec-cor-q2",
        sliceIndex: 12,
        marker: { x: 37, y: 56 },
        prompt: "The thin dark band running from the medial epicondyle toward the sublime tubercle is the:",
        options: ["Lateral ulnar collateral ligament", "Anterior bundle of the UCL", "Annular ligament", "Common extensor tendon"],
        answer: 1,
        explanation:
          "The anterior bundle of the UCL is the primary valgus restraint, inserting on the sublime tubercle — where the thrower's undersurface (T-sign) tear classically occurs. The LUCL is the lateral restraint to posterolateral rotatory instability.",
      },
      {
        id: "ec-cor-q3",
        sliceIndex: 12,
        marker: { x: 69, y: 44 },
        prompt: "Tendinosis of the marked origin off the lateral epicondyle is the lesion in lateral epicondylitis. Which adjacent ligament must you always trace here?",
        options: ["The anterior bundle of the UCL", "The LUCL to the supinator crest", "The annular ligament around the radial neck", "The transverse (Cooper) ligament"],
        answer: 1,
        explanation:
          "The LUCL/RCL origin lies deep to the common extensor tendon, so a deep extensor tear can take the LUCL and produce posterolateral rotatory instability (PLRI) — trace the LUCL to the supinator crest before signing off any high-grade lateral epicondylitis.",
      },
      {
        id: "ec-cor-q4",
        sliceIndex: 12,
        marker: { x: 46, y: 50 },
        prompt: "What is the marked spool-shaped medial articular surface of the distal humerus?",
        options: ["Capitellum", "Trochlea", "Radial head", "Olecranon"],
        answer: 1,
        explanation:
          "The trochlea is the spool-shaped MEDIAL distal-humeral articular surface and articulates with the trochlear notch of the ulna. The capitellum is the rounded LATERAL surface that articulates with the radial head.",
      },
      {
        id: "ec-cor-q5",
        sliceIndex: 12,
        marker: { x: 65, y: 64 },
        prompt: "What is the marked round proximal-radial structure articulating with the capitellum?",
        options: ["Coronoid process", "Radial head", "Olecranon", "Sublime tubercle"],
        answer: 1,
        explanation:
          "The radial head is the round disc of the proximal radius directly beneath the capitellum on the lateral side. Its smooth cortex and uniform marrow are important checks when an occult fracture is suspected after trauma.",
      },
      // Reasoning items below reuse the SAME reviewed coronal markers as the
      // identification items above — no new coordinates. Each pairs a marker
      // with the management decision that structure drives.
      {
        id: "ec-cor-q6",
        sliceIndex: 12,
        marker: { x: 62, y: 50 },
        prompt:
          "An 8-year-old gymnast has lateral elbow pain, and the ENTIRE ossific nucleus of the marked structure is low-signal and fragmented-appearing, with no discrete fragment, no subchondral cyst, and no loose body. What is the most likely diagnosis?",
        options: ["Panner disease", "Capitellar osteochondritis dissecans", "The posterolateral capitellar pseudodefect", "Radiocapitellar septic arthritis"],
        answer: 0,
        explanation:
          "Panner disease is a self-limited osteochondrosis of the WHOLE capitellar ossific nucleus in a younger child (~5–10 yr) — fragmented-looking and low signal, but with no discrete fragment, cyst, or loose body. Capitellar OCD is the tempting answer, and it fails on both age and extent: OCD is a FOCAL anterolateral/central lesion of the adolescent (~12–17 yr) that can fragment and shed a loose body. The pseudodefect is a small posterolateral bare-area groove, not a diffuse nucleus abnormality.",
      },
      {
        id: "ec-cor-q7",
        sliceIndex: 12,
        marker: { x: 62, y: 50 },
        prompt:
          "A fellow reports a contour notch at the POSTEROLATERAL margin of the marked capitellum as an osteochondral lesion. Why is that an over-call?",
        options: [
          "That notch is the normal capitellar pseudodefect (a bare-area groove); true OCD is anterolateral/central at the radiocapitellar contact zone",
          "It is the pseudodefect, but true OCD is also posterolateral, so location cannot separate the two",
          "Any capitellar contour notch is an OCD — the pseudodefect only occurs at the trochlea",
          "It is the transverse trochlear ridge, a normal variant of the capitellum",
        ],
        answer: 0,
        explanation:
          "The pseudodefect is a normal posterolateral/postero-inferior bare-area groove at the capitellum–lateral-epicondyle junction, while true capitellar OCD sits anterolateral/central in the radiocapitellar contact zone with a corroborating sign (fluid rim, cyst, cartilage breach, or fragment). The tempting distractor keeps the pseudodefect label but abandons the location rule — location is exactly what separates variant from lesion here. The transverse trochlear ridge is a normal contour of the TROCHLEA, not the capitellum.",
      },
      {
        id: "ec-cor-q8",
        sliceIndex: 12,
        marker: { x: 46, y: 50 },
        prompt: "A ridge and shallow groove interrupt the contour of the marked spool-shaped surface. What is this most likely to be?",
        options: ["The normal transverse trochlear ridge/groove", "An osteochondral defect", "A displaced loose body", "The capitellar pseudodefect"],
        answer: 0,
        explanation:
          "The transverse trochlear ridge and its adjacent groove are a normal bony contour of the trochlea. Calling it an osteochondral defect is the over-call this course guards against: an osteochondral lesion needs a corroborating sign — a fluid rim, a subchondral cyst, a cartilage breach, or a fragment — not a contour alone. The capitellar pseudodefect is the analogous normal groove, but it lies laterally at the capitellum, not on the trochlea.",
      },
      {
        id: "ec-cor-q9",
        sliceIndex: 12,
        marker: { x: 37, y: 56 },
        prompt:
          "On a thrower's coronal image, which finding indicates a FULL-thickness tear of the marked ligament rather than the partial undersurface (T-sign) pattern?",
        options: [
          "Fluid-bright signal spanning the entire thickness with a gap/retraction, or medial extravasation through the defect",
          "Fluid undercutting the distal fibers beyond the articular-cartilage edge while the proximal fibers stay attached",
          "A couple of millimetres of fluid at the distal attachment on the sublime tubercle",
          "A thickened, heterogeneous, partly ossified band with no surface-reaching defect",
        ],
        answer: 0,
        explanation:
          "A full-thickness tear shows fluid-bright signal across the whole thickness with a gap or retraction, or fluid/contrast extravasating medially through the defect. The tempting distractor describes the T-sign, which is by definition an articular-sided PARTIAL tear — the proximal fibers are still attached — a different grade and a different conversation. A couple of millimetres of fluid at the attachment can be a normal synovial recess, and a thickened/heterogeneous/ossified band without a surface-reaching defect reads as chronic sprain.",
      },
      {
        id: "ec-cor-q10",
        sliceIndex: 12,
        marker: { x: 37, y: 56 },
        prompt:
          "The marked band is the anterior bundle of the UCL. Which component of the UCL complex forms the floor of the cubital tunnel and contributes little to valgus restraint?",
        options: ["Posterior bundle", "Anterior bundle", "Transverse (Cooper) ligament", "Annular ligament"],
        answer: 0,
        explanation:
          "The posterior bundle forms the floor of the cubital tunnel — it matters to the ulnar nerve, not to valgus stability. The anterior bundle is the primary valgus restraint across the functional throwing arc and the band reconstructed in Tommy John surgery. The transverse (Cooper) ligament runs coronoid-to-olecranon with a negligible mechanical role and does not floor the tunnel, and the annular ligament is a LATERAL structure encircling the radial neck.",
      },
      {
        id: "ec-cor-q11",
        sliceIndex: 12,
        marker: { x: 34, y: 44 },
        prompt:
          "In a 45-year-old golfer the marked common flexor-pronator origin is thickened with intermediate — not fluid-bright — signal, and there is no surface-reaching defect. What is the best description?",
        options: ["Tendinosis (degenerative/angiofibroblastic), no tear", "A partial-thickness tear", "A full-thickness tear of the origin", "A grade 3 flexor-pronator muscle strain"],
        answer: 0,
        explanation:
          "Thickening with intermediate signal and no surface-reaching fluid or gap is tendinosis — and despite the '-itis' in medial epicondylitis, the underlying process is degenerative angiofibroblastic tendinosis rather than inflammation. The tempting distractor, a partial tear, requires FLUID-BRIGHT signal reaching a surface or a focal discontinuity; a full-thickness tear requires a complete fluid-bright gap at the origin. A grade 3 strain is complete discontinuity with retraction, typically at the myotendinous junction, not at the bony origin.",
      },
      {
        id: "ec-cor-q12",
        sliceIndex: 12,
        marker: { x: 69, y: 44 },
        prompt:
          "Alongside tendinosis of the marked common extensor origin you see reactive lateral-epicondyle marrow edema and thin signal within the RCL, with the deep fibers intact and no fluid-bright gap. How should this be reported?",
        options: [
          "Common extensor tendinosis with reactive change — do NOT call an LCL tear from reactive marrow edema or thin RCL signal alone",
          "A full-thickness LUCL tear implying posterolateral rotatory instability",
          "A deep extensor tear communicating with the radiocapitellar joint, converting this into a ligament reconstruction",
          "An Osborne–Cotterill posterolateral capitellar impaction lesion",
        ],
        answer: 0,
        explanation:
          "Reactive lateral-epicondyle marrow edema and thin RCL signal commonly accompany lateral epicondylitis and must not be over-called as an LCL tear. The surgical lesion you are hunting is specific and absent here: a deep/full-thickness common extensor tear with a FLUID-BRIGHT GAP that undercuts or communicates with the radiocapitellar joint AND involves the LUCL — that combination implies PLRI, but the deep fibers in this case are intact. The Osborne–Cotterill lesion is a posterolateral capitellar impaction fracture after dislocation, a different entity.",
      },
      {
        id: "ec-cor-q13",
        sliceIndex: 12,
        marker: { x: 65, y: 64 },
        prompt: "A line drawn through the central long axis of the radial neck should pass through which structure?",
        options: ["Capitellum", "Trochlea", "Coronoid process", "Olecranon"],
        answer: 0,
        explanation:
          "The radiocapitellar line — drawn along the central long axis of the radial NECK (not the shaft), and most reliable on the LATERAL view — should pass through the CAPITELLUM; a line that misses points to radial-head subluxation or dislocation, including an occult Monteggia injury. Treat it as SUGGESTIVE, not pathognomonic: in 116 normal pediatric elbows the neck line still missed the capitellum in about 1% of tracings and passed through the central third only about three-quarters of the time on the lateral view (roughly half on AP), and it is degraded by forearm rotation, observer bias, and young age (least reliable under 5). So correlate with the contralateral side rather than calling instability off the line alone. The trochlea is the medial distal-humeral surface and articulates with the ulna, so it is never the radial-head partner; the coronoid and olecranon are ulnar processes.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // AXIAL T2 FS  (stack: normal-elbow-axial, 34 slices)
  // The plane for the nerves (ulnar in the cubital tunnel, radial/PIN), the
  // common flexor/extensor origins in cross-section, the annular ligament, and
  // the distal biceps footprint. Joint/epicondyle level ~index 16.
  // ───────────────────────────────────────────────────────────────────────
  "axi-t2fs": {
    tour: [
      {
        sliceIndex: 16,
        markers: [],
        title: "Get oriented",
        note: "Axial T2 FS cross-section through the elbow: the bone is central, ringed by the flexor-pronator (medial), extensor (lateral), brachialis (anterior), and triceps (posterior) compartments. This is the plane for the nerves — the ulnar nerve in the cubital tunnel, the radial nerve/PIN at the radiocapitellar level — and for the annular ligament and the distal biceps footprint. Compare a nerve to its mate and the other side.",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 20, y: 61, label: "Ulnar nerve (cubital tunnel)" }],
        title: "Ulnar nerve (cubital tunnel)",
        note: "The ulnar nerve sits in the cubital tunnel posterior to the medial epicondyle, beneath Osborne's retinaculum. Normal = an ovoid nerve of caliber and signal similar to the median nerve and the contralateral side. Assess for flexion subluxation, an anconeus epitrochlearis, or a ganglion — a structural cause can shift operative planning from in-situ decompression toward transposition. (Mild T2 brightness alone can be normal.)",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 30, y: 55, label: "Common flexor-pronator" }],
        title: "Common flexor-pronator (cross-section)",
        note: "The common flexor-pronator mass arises off the medial epicondyle anteromedially. In cross-section, grade tendinosis vs a surface-reaching tear at the origin; the ulnar nerve sits just posterior to it, which is why golfer's elbow and ulnar neuritis travel together.",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 72, y: 42, label: "Common extensor origin" }],
        title: "Common extensor (cross-section)",
        note: "The common extensor origin arises off the lateral epicondyle anterolaterally. Cross-section helps grade extensor tendinosis vs a deep tear; the radial nerve and its PIN branch run nearby at the radiocapitellar level (the PIN dives under the arcade of Frohse into the supinator).",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 45, y: 33, label: "Brachialis" }],
        title: "Brachialis",
        note: "The brachialis is the broad anterior muscle that inserts on the coronoid/ulnar tuberosity — the primary elbow flexor, lying behind the biceps. The distal biceps tendon runs through the antecubital fossa toward its radial-tuberosity footprint; a dedicated FABS view can help when routine axial/sagittal images leave partial-vs-complete tear status uncertain.",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 50, y: 82, label: "Triceps" }],
        title: "Triceps",
        note: "The triceps occupies the posterior compartment and inserts broadly on the olecranon. Its deep central fibers can tear first while the superficial expansion stays intact — so a triceps tear can look partial despite significant extension weakness. Watch for a medial triceps head subluxing with the ulnar nerve (snapping triceps).",
      },
      {
        sliceIndex: 16,
        markers: [],
        title: "Do-not-overcall checkpoint",
        note: "On axial elbow MRI, do not diagnose cubital tunnel syndrome from a bright ulnar nerve alone. Compare nerve size and signal with the median nerve and the other side, then look for denervation or a structural cause such as subluxation, an accessory anconeus epitrochlearis, a ganglion, or snapping triceps. For distal biceps, routine axial images matter, and FABS is a problem-solving view rather than a replacement.",
      },
    ],
    quiz: [
      {
        id: "ec-axi-q1",
        sliceIndex: 16,
        marker: { x: 20, y: 61 },
        prompt: "The marked nerve sits posterior to the medial epicondyle. Mild T2 brightness here can be normal — what anchors a diagnosis of cubital tunnel syndrome?",
        options: ["T2 signal alone", "Caliber change + muscle denervation + clinical correlation", "Any anterior position of the nerve", "The presence of a normal Osborne retinaculum"],
        answer: 1,
        explanation:
          "The ulnar nerve in the cubital tunnel can show mild T2 brightness normally, so anchor the call to nerve enlargement PLUS FCU/ulnar-intrinsic denervation PLUS clinical correlation — and look for a structural cause (subluxation, accessory muscle) that can change operative planning.",
      },
      {
        id: "ec-axi-q2",
        sliceIndex: 16,
        marker: { x: 30, y: 55 },
        prompt: "Why does the common flexor-pronator origin (medial epicondylitis) travel with ulnar neuritis?",
        options: ["They share a blood supply", "The cubital tunnel and ulnar nerve sit immediately posterior to the flexor-pronator origin", "The flexor origin is innervated by the ulnar nerve", "Both are restraints to valgus stress"],
        answer: 1,
        explanation:
          "The cubital tunnel sits just posterior to the common flexor-pronator origin, so medial epicondylitis and ulnar neuritis coexist — when you call medial epicondylitis, always interrogate the ulnar nerve and the UCL (the medial triad).",
      },
      {
        id: "ec-axi-q3",
        sliceIndex: 16,
        marker: { x: 72, y: 42 },
        prompt: "What is the marked tendon origin on the anterolateral side of this axial elbow?",
        options: ["Common flexor-pronator origin", "Common extensor origin", "Distal triceps tendon", "Distal biceps tendon"],
        answer: 1,
        explanation:
          "The common extensor origin is anterolateral at the lateral epicondyle. On axial images, use this level to grade tendinosis or a deep tear and to inspect the adjacent lateral ligament complex.",
      },
      {
        id: "ec-axi-q4",
        sliceIndex: 16,
        marker: { x: 45, y: 33 },
        prompt: "What is the marked broad muscle immediately anterior to the elbow joint?",
        options: ["Triceps", "Anconeus", "Brachialis", "Supinator"],
        answer: 2,
        explanation:
          "The brachialis is the broad anterior elbow flexor lying deep to the biceps and inserting on the coronoid process and ulnar tuberosity. The triceps occupies the posterior compartment.",
      },
      {
        id: "ec-axi-q5",
        sliceIndex: 16,
        marker: { x: 50, y: 82 },
        prompt: "What is the marked posterior muscle-tendon unit inserting on the olecranon?",
        options: ["Brachialis", "Distal biceps", "Common extensor", "Triceps"],
        answer: 3,
        explanation:
          "The triceps occupies the posterior compartment and inserts on the olecranon. Its deep fibers can fail while the superficial expansion remains intact, so continuity should be assessed across the full footprint.",
      },
      // Reasoning items below reuse the reviewed brachialis / triceps / common
      // flexor / common extensor markers only. The axial ulnar-nerve marker is
      // deliberately NOT used for new items: its exact position is the one
      // known-ambiguous marker in the app and is still awaiting MSK review.
      {
        id: "ec-axi-q6",
        sliceIndex: 16,
        marker: { x: 45, y: 33 },
        prompt:
          "The marked anterior compartment also carries the distal biceps tendon toward its radial-tuberosity footprint. Which structure decides whether a COMPLETE distal biceps tear retracts?",
        options: ["The lacertus fibrosus", "The bicipitoradial bursa", "The annular ligament", "The brachialis insertion on the coronoid"],
        answer: 0,
        explanation:
          "The lacertus fibrosus is the aponeurotic expansion from the medial musculotendinous junction into the forearm flexor fascia; intact, it tethers a fully torn biceps so the tendon does not retract and the exam can look preserved — the classic complete tear undercalled as partial. A distended bicipitoradial bursa is the tempting answer but is only a CLUE to scrutinize the footprint, not the tether. The annular ligament stabilizes the radial head, and the brachialis is a separate muscle whose coronoid insertion is untouched by a biceps rupture.",
      },
      {
        id: "ec-axi-q7",
        sliceIndex: 16,
        marker: { x: 50, y: 82 },
        prompt:
          "A powerlifter has posterior elbow pain and weak extension against resistance. The deep central fibers of the marked tendon are torn with a fluid gap while the superficial expansion stays in continuity. What should the report say?",
        options: [
          "A high-grade partial tear — state the percentage of width torn and the gap, and flag it for repair consideration",
          "Tendinosis, because the superficial expansion is intact",
          "A complete rupture, because any deep-fiber gap is by definition full-thickness",
          "A normal variant — a fluid cleft normally separates the deep and superficial triceps layers",
        ],
        answer: 0,
        explanation:
          "The deep central triceps fibers fail first while the superficial expansion can stay intact, so a clinically near-complete injury looks partial — report the PERCENTAGE of width torn and the gap rather than the word 'partial' alone. Calling it tendinosis is the tempting undercall, but high-grade partials (commonly >50% width, or any tear with extension weakness against resistance) and complete ruptures prompt repair. It is not complete, since the superficial expansion is continuous, and a fluid-filled cleft between the layers is not a normal triceps finding.",
      },
      {
        id: "ec-axi-q8",
        sliceIndex: 16,
        marker: { x: 50, y: 82 },
        prompt:
          "In a patient with flexion-provoked medial snapping and ulnar symptoms, why does it matter whether the MEDIAL head of the marked triceps subluxates over the medial epicondyle?",
        options: [
          "Snapping triceps must be addressed at surgery — transposing the nerve alone leaves the snapping mechanism behind",
          "It is a normal flexion finding with no operative consequence",
          "It establishes a triceps tendon rupture requiring urgent repair",
          "It localizes the symptoms to the shoulder, so no elbow surgery is warranted",
        ],
        answer: 0,
        explanation:
          "The medial head of the triceps can subluxate over the medial epicondyle in flexion together with the ulnar nerve (snapping triceps), and recognizing it is management-changing: an anterior transposition that ignores the triceps leaves the snapping mechanism, so the operation must address both. Dynamic/flexion imaging is what reveals it — a static neutral study underdiagnoses it, which is why it is worth naming explicitly. It is neither a normal flexion finding nor evidence of a tendon rupture.",
      },
      {
        id: "ec-axi-q9",
        sliceIndex: 16,
        marker: { x: 72, y: 42 },
        prompt:
          "The radial nerve divides at the radiocapitellar level near the marked lateral compartment. Beneath which structure is the posterior interosseous nerve most commonly compressed?",
        options: ["The arcade of Frohse (the proximal edge of the supinator)", "Osborne's retinaculum", "The lacertus fibrosus", "The annular ligament"],
        answer: 0,
        explanation:
          "The PIN enters the supinator beneath the arcade of Frohse — that muscle's proximal, often fibrous edge — which is its most common compression point. Osborne's retinaculum roofs the CUBITAL TUNNEL and is an ulnar-nerve structure on the medial side; the lacertus fibrosus is an anteromedial median-nerve (pronator syndrome) site; and the annular ligament stabilizes the radial head rather than tunnelling a nerve. Localize PIN syndrome by extensor-compartment denervation, remembering the supinator itself is often spared.",
      },
      {
        id: "ec-axi-q10",
        sliceIndex: 16,
        marker: { x: 30, y: 55 },
        prompt: "You call medial epicondylitis at the marked origin. Which ligament lies deep to it and must be traced to its distal attachment before you sign off?",
        options: [
          "The anterior bundle of the UCL, traced to the sublime tubercle",
          "The LUCL, traced to the supinator crest",
          "The annular ligament, traced around the radial neck",
          "The posterior bundle of the UCL, traced to the olecranon",
        ],
        answer: 0,
        explanation:
          "The common flexor-pronator tendon drapes directly over the anterior bundle of the UCL, so every medial epicondylitis read must trace that bundle to the sublime tubercle — a concomitant UCL tear is what shifts a thrower's conversation toward reconstruction. Tracing the LUCL to the supinator crest is the correct habit on the LATERAL side beneath the common extensor, which makes it the tempting but wrong-sided answer here. The annular ligament is lateral, and the posterior bundle is the cubital-tunnel floor with a minimal valgus role.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // SAGITTAL IR / STIR  (stack: normal-elbow-sagittal, 30 slices)
  // The plane for the distal biceps and triceps, the trochlea/capitellum
  // contour, the coronoid and olecranon fossae (loose bodies), and the fat pads.
  // Read capitellar OCD on coronal + sagittal together. Joint level ~index 14.
  // ───────────────────────────────────────────────────────────────────────
  "sag-ir": {
    tour: [
      {
        sliceIndex: 14,
        markers: [],
        title: "Get oriented",
        note: "Sagittal IR/STIR through the elbow in profile: the distal humerus arcs into the trochlea/capitellum, the coronoid sits anteroinferiorly and the olecranon posteroinferiorly. Fluid-sensitive, so effusion and edema are bright. This is the plane for the distal biceps and triceps, the fat pads, the coronoid/olecranon fossae (where loose bodies hide), and the anterior-to-posterior extent of a capitellar OCD.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 55, y: 49, label: "Trochlea / capitellum" }],
        title: "Trochlea / capitellum (articular surface)",
        note: "The distal-humeral articular surface curves through this slice, capped by its hyaline cartilage. Trace the contour as smooth; read a capitellar OCD here together with the coronal face to judge the lesion's anterior-to-posterior extent and the overlying cartilage. A thin posterolateral radiocapitellar plica/synovial fold can be normal; it becomes clinically relevant when thickened, edematous, or tied to snapping/catching.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 45, y: 60, label: "Coronoid process" }],
        title: "Coronoid process",
        note: "The coronoid is the anterior beak of the proximal ulna and the keystone of post-traumatic stability — an anteromedial facet fracture can look small on radiographs yet imply varus posteromedial rotatory instability, so it deserves instability-focused surgical review. The sublime tubercle on its medial aspect is the UCL's distal attachment.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 63, y: 60, label: "Olecranon" }],
        title: "Olecranon & triceps insertion",
        note: "The olecranon is the posterior beak of the ulna where the triceps inserts. In the thrower, the posteromedial olecranon is the site of the valgus-extension-overload osteophyte and a posterior loose body. Sweep the olecranon fossa just above it for loose bodies on this fluid-sensitive plane.",
      },
      {
        sliceIndex: 14,
        markers: [
          { x: 47, y: 38, label: "Anterior fat pad" },
          { x: 62, y: 40, label: "Olecranon fossa / posterior fat-pad location" },
        ],
        title: "Fat pads (coronoid & olecranon fossae)",
        note: "The anterior fat pad sits in the coronoid fossa and is normally visible; the posterior fat pad hides in the olecranon fossa and is normally NOT seen. After trauma, an elevated anterior fat pad or any visible posterior fat pad signals an effusion/hemarthrosis from an occult fracture until proven otherwise.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 33, y: 55, label: "Brachialis / distal biceps" }],
        title: "Brachialis & distal biceps (anterior)",
        note: "Anteriorly, the brachialis fills the antecubital fossa and the distal biceps tendon dives toward its radial-tuberosity footprint. A complete biceps tear retracts UNLESS an intact lacertus fibrosus tethers it — so on a dedicated FABS view, report partial-vs-complete, the retraction distance, and the lacertus.",
      },
      {
        sliceIndex: 14,
        markers: [],
        title: "Do-not-overcall checkpoint",
        note: "On sagittal images, a thin posterolateral radiocapitellar plica can be normal, and a capitellar contour finding still needs the coronal face before you call OCD. A visible posterior fat pad after trauma is abnormal, but a normally seen anterior fat pad is not. For distal biceps/triceps tears, describe continuity, gap/retraction, and functional-grade clues rather than relying on one plane.",
      },
    ],
    quiz: [
      {
        id: "ec-sag-q1",
        sliceIndex: 14,
        marker: { x: 62, y: 40 },
        prompt: "After elbow trauma with a normal radiograph, which fat-pad finding signals an occult fracture until proven otherwise?",
        options: ["A visible anterior fat pad", "A displaced/elevated POSTERIOR fat pad", "Absence of the anterior fat pad", "A small joint effusion alone"],
        answer: 1,
        explanation:
          "The posterior fat pad is normally hidden in the olecranon fossa; a visible/displaced posterior fat pad after trauma means a hemarthrosis from an occult intra-articular fracture (most often the radial head) until proven otherwise. The anterior fat pad is normally seen.",
      },
      {
        id: "ec-sag-q2",
        sliceIndex: 14,
        marker: { x: 45, y: 60 },
        prompt: "The marked anterior beak of the proximal ulna is the keystone of post-traumatic stability. A small fracture of which part implies varus posteromedial rotatory instability?",
        options: ["The olecranon tip", "The anteromedial coronoid facet", "The radial styloid", "The sublime tubercle only"],
        answer: 1,
        explanation:
          "An anteromedial coronoid facet fracture may look small on radiographs but can imply varus posteromedial rotatory instability (VPMRI) and needs instability-focused surgical review — 'small does not mean stable' at the coronoid. The sublime tubercle (medial) is the UCL's distal attachment.",
      },
      {
        id: "ec-sag-q3",
        sliceIndex: 14,
        marker: { x: 55, y: 49 },
        prompt: "A thin posterolateral radiocapitellar synovial fold on this sagittal elbow MRI is best interpreted how?",
        options: [
          "A normal plica/fold unless thickened, edematous, or associated with snapping/catching",
          "A displaced loose body until proven otherwise",
          "A capitellar OCD instability sign by itself",
          "A UCL T-sign seen on the wrong plane",
        ],
        answer: 0,
        explanation:
          "A posterolateral radiocapitellar plica/synovial fold can be a normal thin fold in the radiocapitellar recess. Do not call it a loose body or OCD instability sign by itself; worry when it is thickened/edematous or matches mechanical snapping/catching.",
      },
      {
        id: "ec-sag-q4",
        sliceIndex: 14,
        marker: { x: 63, y: 60 },
        prompt: "What is the marked posterior process of the proximal ulna where the triceps inserts?",
        options: ["Coronoid process", "Radial head", "Olecranon", "Capitellum"],
        answer: 2,
        explanation:
          "The olecranon is the posterior beak of the proximal ulna and the triceps insertion. In a thrower, inspect its posteromedial margin and the adjacent olecranon fossa for valgus-extension-overload change and loose bodies.",
      },
      {
        id: "ec-sag-q5",
        sliceIndex: 14,
        marker: { x: 33, y: 55 },
        prompt: "Which anterior muscle-tendon region is marked in the antecubital fossa?",
        options: ["Brachialis and distal biceps", "Triceps and anconeus", "Common extensor and LUCL", "Flexor-pronator and UCL"],
        answer: 0,
        explanation:
          "The anterior antecubital region contains the brachialis and the distal biceps tendon as it approaches the radial-tuberosity footprint. The triceps and anconeus are posterior, while the common tendon and collateral-ligament groups sit along the epicondyles.",
      },
      // Reasoning items below reuse the SAME reviewed sagittal markers as the
      // identification items above — no new coordinates.
      {
        id: "ec-sag-q6",
        sliceIndex: 14,
        marker: { x: 47, y: 38 },
        prompt: "The marked anterior fat pad is normally visible in the coronoid fossa. What does it mean when it is lifted into a triangular 'sail' after trauma?",
        options: [
          "A joint effusion/hemarthrosis — search the marrow for an occult intra-articular fracture",
          "Nothing — anterior fat-pad displacement is normal at any degree",
          "A loose body has pushed it out of the coronoid fossa",
          "A complete distal biceps tear with proximal retraction",
        ],
        answer: 0,
        explanation:
          "The anterior fat pad is normally SEEN, but ELEVATION into a triangular sail sign means the joint is distended — after trauma that is a hemarthrosis, and the occult intra-articular fracture (radial head first in an adult; supracondylar, then the non-union-prone lateral condyle, in a child) must be hunted in the marrow. The tempting distractor confuses 'normally visible' with 'displacement is normal': visibility is normal, displacement is not. A loose body is a discrete fragment rather than a diffuse fat-pad displacement, and a biceps tear does not distend the joint capsule.",
      },
      {
        id: "ec-sag-q7",
        sliceIndex: 14,
        marker: { x: 63, y: 60 },
        prompt:
          "A pitcher has posterior elbow pain and catching, with a posteromedial osteophyte at the marked process and a posterior loose body. Which structure must also be assessed before an osteophyte debridement is recommended?",
        options: [
          "The UCL — debriding the valgus-extension-overload osteophyte without addressing valgus laxity can unmask instability",
          "The annular ligament, the usual cause of posterior catching",
          "The lacertus fibrosus, which tethers the olecranon",
          "The anterior fat pad, which is resected with the osteophyte",
        ],
        answer: 0,
        explanation:
          "The posteromedial olecranon osteophyte is the chronic end of valgus extension overload: UCL insufficiency lets the posteromedial olecranon impinge in the olecranon fossa. The osteophyte generates the catching, but debriding it without addressing the underlying valgus laxity can unmask instability — so the UCL is interrogated on every VEO elbow. The annular ligament stabilizes the radial head laterally, the lacertus fibrosus belongs to the distal biceps, and the anterior fat pad is a normal anterior structure.",
      },
      {
        id: "ec-sag-q8",
        sliceIndex: 14,
        marker: { x: 63, y: 60 },
        prompt: "In an adolescent thrower with posterior elbow pain, what separates an olecranon stress FRACTURE from a lower-grade stress reaction?",
        options: [
          "A discrete low-signal line in addition to marrow edema; edema without a line is a stress reaction",
          "The amount of marrow edema alone — more edema means fracture",
          "A visible posterior fat pad, which is specific for an olecranon stress fracture",
          "Any bright signal in the olecranon apophysis, which is always pathologic in a teenager",
        ],
        answer: 0,
        explanation:
          "A discrete low-signal LINE plus marrow edema makes it a stress fracture (longer rest, with fixation considered if it widens or displaces); edema without a line is a lower-grade stress reaction. Grading by edema volume is the tempting error — edema is the smoke, the line is the fire. A visible posterior fat pad indicates an effusion/hemarthrosis and does not localize to one bone. And the olecranon apophysis fuses in the mid-to-late teens (later in throwers), so apophyseal signal calls for contralateral comparison rather than a blanket call.",
      },
      {
        id: "ec-sag-q9",
        sliceIndex: 14,
        marker: { x: 62, y: 40 },
        prompt: "A 55-year-old laborer who has never thrown has locking and catching, and a loose body sits in the marked olecranon fossa. What is the most likely source?",
        options: [
          "Primary elbow osteoarthritis — coronoid/olecranon-tip and fossa osteophytes with chondral loss",
          "A thrower's valgus-extension-overload osteophyte",
          "Capitellar osteochondritis dissecans",
          "Synovial chondromatosis, the most common cause of elbow loose bodies",
        ],
        answer: 0,
        explanation:
          "In a non-thrower or laborer, primary elbow osteoarthritis — coronoid- and olecranon-tip osteophytes, fossa osteophytes, and capitellar/radial-head chondral loss — is the most common source of loose bodies and mechanical symptoms. Valgus extension overload and capitellar OCD are genuine sources, but they belong to the overhead thrower and the adolescent respectively, so they are the wrong population here. Synovial chondromatosis does shed bodies but is uncommon and is not the leading cause.",
      },
      {
        id: "ec-sag-q10",
        sliceIndex: 14,
        marker: { x: 55, y: 49 },
        prompt:
          "A subtle contour irregularity of the marked articular surface is visible on this sagittal image but cannot be found anywhere on the coronal stack. What is the correct interpretation?",
        options: [
          "Treat it as partial-volume averaging or a normal contour — an osteochondral lesion must be confirmed on coronal AND sagittal",
          "Report a capitellar OCD, since the sagittal plane best profiles the cartilage contour",
          "Report an unstable OCD, because a lesion invisible on the orthogonal plane must be displaced",
          "Report Panner disease, which is a sagittal-only diagnosis",
        ],
        answer: 0,
        explanation:
          "A finding present on one plane and absent on the orthogonal plane is partial-volume averaging or a normal contour until proven otherwise — which is exactly why capitellar OCD is read on coronal AND sagittal together, the coronal supplying the radiocapitellar face and the sagittal the anterior-to-posterior extent. The tempting distractor (sagittal alone profiles the contour best) is the classic protocol error this course corrects. On MRI, instability is judged at the fragment–bone interface, not by which plane shows the lesion (and the surgeon adds the physeal status and motion exam), and Panner is a diffuse whole-nucleus process in a young child rather than a plane-specific call.",
      },
      {
        id: "ec-sag-q11",
        sliceIndex: 14,
        marker: { x: 45, y: 60 },
        prompt: "Two classification systems are applied to the marked process after trauma. Which pairing is correct?",
        options: [
          "O'Driscoll classifies the anteromedial facet (the VPMRI lesion); Regan–Morrey grades coronoid height",
          "Regan–Morrey classifies the anteromedial facet; O'Driscoll grades coronoid height",
          "Mason grades coronoid height; O'Driscoll classifies the radial head",
          "Both systems grade coronoid height and are interchangeable",
        ],
        answer: 0,
        explanation:
          "O'Driscoll classifies the ANTEROMEDIAL FACET — the fragment that implies varus posteromedial rotatory instability and is surgical even when it looks small on radiographs — while Regan–Morrey grades coronoid HEIGHT (I tip avulsion, II ≤50%, III >50%). Swapping the two is the common error, and it matters because the facet, not the height, is what flags the VPMRI mechanism. Mason is the RADIAL HEAD system, and the two coronoid schemes answer different questions, so they are not interchangeable.",
      },
      {
        id: "ec-sag-q12",
        sliceIndex: 14,
        marker: { x: 33, y: 55 },
        prompt:
          "Standard planes foreshorten the distal biceps as it turns toward the radial tuberosity. Which dedicated positioning lays that footprint flat for partial-vs-complete grading and retraction measurement?",
        options: [
          "FABS — Flexed elbow, ABducted shoulder, Supinated forearm, patient prone",
          "ABER — abduction/external rotation, as used at the shoulder",
          "A valgus-stress coronal acquisition of the medial joint",
          "Full extension with the forearm pronated and the arm at the side",
        ],
        answer: 0,
        explanation:
          "FABS (Flexed elbow, ABducted shoulder, Supinated forearm, prone with the arm overhead) lays the distal biceps in-plane all the way to the radial tuberosity, which is what makes partial-vs-complete grading and retraction measurement reliable. ABER is a SHOULDER position for the anteroinferior labrum. A valgus/flexed elbow positioning adjunct targets the medial joint and the UCL — the wrong structure, and with a thin elbow-specific evidence base. Extension with pronation foreshortens the tendon further, which is the very problem FABS solves.",
      },
    ],
  },
};

/** title → "watch for" pearl, keyed by tour-step title. */
export const structureElbowPearl: Record<string, string> = {
  Capitellum:
    "Watch for an osteochondral lesion of the capitellum — on MRI, judge stability at the interface: a fluid line completely undercutting the fragment, a sizeable/multiple cyst, a cartilage breach, or a displaced fragment = unstable. Surrounding edema alone is not, and an isolated high-T2 line is indeterminate. The MRI interface is not the whole call: the validated clinical classification also counts a closed capitellar physis, fragmentation, or ≥20° motion loss as unstable.",
  "Radial head":
    "Watch for an occult radial-head fracture after a fall — a marrow-edema line with a displaced posterior fat pad; the surgical trigger is a mechanical block to forearm rotation or comminution (Mason III), not the 2 mm number alone.",
  "Ulnar collateral ligament (anterior bundle)":
    "Watch for the T-sign — fluid undercutting the distal UCL beyond the articular-cartilage edge — which supports a thrower's partial undersurface tear in the right clinical setting; MR arthrography is the most sensitive study, but symptoms and laxity still matter.",
  "Common flexor-pronator origin":
    "Watch the medial 'valgus triad' together: the flexor-pronator origin, the UCL to the sublime tubercle, and the ulnar nerve just posterior — valgus overload injures all three.",
  "Common extensor origin":
    "Watch the LUCL deep to the extensor origin: a deep common-extensor tear that takes the LUCL implies posterolateral rotatory instability — a ligament-reconstruction problem, not a debridement, and a classic post-injection/post-release complication.",
  "Ulnar nerve (cubital tunnel)":
    "Watch for a structural cause that can change operative planning — dynamic flexion subluxation of the nerve, an anconeus epitrochlearis, or a snapping triceps may favor transposition over in-situ decompression.",
  "Triceps":
    "Watch the deep central triceps fibers — they tear first while the superficial expansion stays intact, so a 'partial' triceps tear with extension weakness against resistance should still trigger high-grade tear/repair consideration.",
  "Coronoid process":
    "Watch the anteromedial coronoid facet — a small-looking fracture can imply varus posteromedial rotatory instability and should trigger surgical review; in any post-dislocation elbow, also comment on the LUCL (the usual primary lesion).",
  "Olecranon & triceps insertion":
    "Watch the posteromedial olecranon in the thrower for a valgus-extension-overload osteophyte and a posterior loose body — and remember debriding the osteophyte without addressing UCL laxity can unmask valgus instability.",
  "Trochlea / capitellum (articular surface)":
    "Watch for a posterolateral radiocapitellar plica: a thin fold can be normal, but thickened/edematous plica with snapping/catching can mimic a loose body or OCD symptoms.",
  "Fat pads (coronoid & olecranon fossae)":
    "A visible posterior fat pad after adult elbow trauma is a fracture until proven otherwise — radial head first.",
  "Brachialis & distal biceps (anterior)":
    "Watch the lacertus fibrosus — an intact lacertus tethers a complete distal biceps tear so it neither retracts nor shows an obvious clinical gap, the classic mimic of a partial tear.",
};

/** title → inline reading point (normal variant + key measurement) woven into the tour. */
export const structureElbowReading: Record<string, StructureReading> = {
  Capitellum: {
    variant:
      "The posterolateral capitellar PSEUDODEFECT (a normal bare-area groove) and the transverse trochlear ridge are normal contours — do not call them osteochondral lesions.",
    measure:
      "OCD stability is qualitative, not a single cutoff: the 5 mm subchondral-cyst figure is knee-derived (De Smet) and not validated for the capitellum — teach 'sizeable or multiple cysts.' And the MRI interface is not the only input: the validated clinical classification (Takahara) calls a lesion unstable with a CLOSED capitellar physis, fragmentation, or ≥20° motion loss, and defect size predicts the outcome of excision — so report physeal status and lesion size alongside the interface findings.",
  },
  "Ulnar collateral ligament (anterior bundle)": {
    variant:
      "A small synovial recess at the distal UCL is normal — the T-sign threshold is fluid tracking BEYOND the articular-cartilage edge, not any sliver of fluid at the attachment, and it should be interpreted with symptoms/laxity rather than as an automatic surgical indication.",
    measure:
      "On dynamic valgus-stress ultrasound there are two published measures and they are NOT interchangeable: the STRESS DELTA — the rest-to-valgus increase in medial ulnohumeral joint space in the injured elbow, abnormal above about 2.4 mm — and the STRESS DELTA DIFFERENCE, the side-to-side comparison of that increase, abnormal above about 1 mm (the more sensitive of the two). Flexion angle and applied load are not standardized, so quote the criterion being used rather than one universal cutoff.",
  },
  "Radial head": {
    measure:
      "Mason framework: I = non-/minimally displaced, II = displaced (commonly >2 mm) partial-articular, III = comminuted — but the surgical trigger is a mechanical block to rotation, not the 2 mm number alone.",
  },
  "Ulnar nerve (cubital tunnel)": {
    variant:
      "Mild ulnar-nerve T2 hyperintensity occurs in asymptomatic elbows; there is no universal cross-sectional-area cutoff — compare to the median nerve and the contralateral side.",
  },
  "Trochlea / capitellum (articular surface)": {
    variant:
      "A thin low-signal posterolateral radiocapitellar synovial plica/fold may be normal. It should not be mistaken for a loose body or an unstable OCD fragment unless it is thickened/edematous, trapped in the joint, or matches mechanical symptoms.",
    measure:
      "A posterolateral radiocapitellar fold is present in about three-quarters of asymptomatic elbows and averages about 3 mm — so 3 mm is a NORMAL value, not a pathologic threshold, and symptomatic and asymptomatic plicae overlap in thickness. There is no validated cutoff. Call it clinically relevant only when it is clearly enlarged relative to normal (symptomatic series run nearer 7 mm mediolateral, or the fold covers a substantial portion of the radial head) and/or edematous, AND the snapping/catching is concordant.",
  },
  "Brachialis & distal biceps (anterior)": {
    variant:
      "An intact lacertus fibrosus can leave the stump near the radial neck despite a full rupture — report complete-vs-partial AND lacertus integrity, not just the retraction distance.",
  },
};

/** title → pathology case bridge ("See it injured →"), keyed by tour-step title. */
export const structureElbowCase: Record<string, { caseId: string; label: string }> = {
  Capitellum: { caseId: "elbow-capitellar-ocd", label: "Capitellar OCD — stable vs unstable" },
  "Radial head": { caseId: "elbow-occult-radial-head-fracture", label: "Occult radial-head fracture vs pseudodefect" },
  "Ulnar collateral ligament (anterior bundle)": { caseId: "elbow-ucl-tear-thrower", label: "UCL tear in a thrower (T-sign)" },
  "Common flexor-pronator origin": { caseId: "elbow-medial-epicondylitis-ulnar", label: "Medial epicondylitis + ulnar neuritis" },
  "Common extensor origin": { caseId: "elbow-lateral-epicondylitis-lucl", label: "Lateral epicondylitis + LUCL tear" },
  "Ulnar nerve (cubital tunnel)": { caseId: "elbow-cubital-tunnel-ulnar-neuritis", label: "Cubital tunnel syndrome" },
  "Coronoid process": { caseId: "elbow-veo-posteromedial-loose-body", label: "Valgus extension overload + loose body" },
  "Olecranon & triceps insertion": { caseId: "elbow-veo-posteromedial-loose-body", label: "VEO posteromedial osteophyte + loose body" },
  "Brachialis & distal biceps (anterior)": { caseId: "elbow-distal-biceps-tear", label: "Distal biceps tear (retraction + lacertus)" },
};

/** title → anatomy + ultrasound correlate panel (keyed by tour-step title). */
export const elbowStructureCorrelate: Record<string, StructureCorrelate> = {
  "Ulnar collateral ligament (anterior bundle)": {
    ultrasound: {
      seen: true,
      appearance:
        "The UCL anterior bundle is superficial and well seen on US as a fibrillar band from the medial epicondyle to the sublime tubercle — and US uniquely adds the DYNAMIC valgus-stress test (side-to-side medial joint-gapping) that static MRI cannot.",
      tip: "Long-axis over the medial joint with the elbow flexed ~30°, then apply valgus stress and compare medial gapping to the contralateral side.",
      image: { src: "/images/teaching/us/elbow-ucl.jpg", caption: "Long-axis US of the UCL anterior bundle from the medial epicondyle (2a) with a labeled overlay (2b).", attribution: "Manske RC, Voight M, Wolfe C, Page P. Int J Sports Phys Ther 2023;18(2). CC BY-NC 4.0." },
    },
  },
  "Common extensor origin": {
    ultrasound: {
      seen: true,
      appearance:
        "The common extensor origin is superficial and ideal for US — hypoechoic swelling, neovascularity on Doppler, and intrasubstance tears of tennis elbow are readily shown, and US guides a peritendinous injection.",
      tip: "Long-axis over the lateral epicondyle; the ECRB origin is the deep component to scrutinize.",
      image: { src: "/images/teaching/us/elbow-common-extensor.jpg", caption: "Long-axis US of the common extensor origin at the lateral epicondyle (E); radial head (R).", attribution: "Allen GM, Jacobson JA, in IDKD 'Musculoskeletal Diseases 2021–2024' (NCBI Bookshelf NBK570156). CC BY 4.0." },
    },
  },
  "Common flexor-pronator origin": {
    ultrasound: {
      seen: true,
      appearance:
        "The common flexor-pronator origin is superficial and well seen on US for golfer's elbow — but always interrogate the UCL and ulnar nerve alongside it.",
      image: { src: "/images/teaching/us/elbow-common-flexor.jpg", caption: "Long-axis US of the common flexor-pronator origin at the medial epicondyle (ME).", attribution: "Konarski W, et al. Healthcare 2022;10(8):1529. CC BY 4.0." },
    },
  },
  "Ulnar nerve (cubital tunnel)": {
    ultrasound: {
      seen: true,
      appearance:
        "The ulnar nerve is superficial in the cubital tunnel and excellent on US — measure its cross-sectional area and, crucially, perform the DYNAMIC test for flexion subluxation/dislocation over the medial epicondyle and for snapping triceps, which static MRI can miss.",
      tip: "Short-axis posterior to the medial epicondyle, then flex the elbow to watch for nerve (± medial triceps head) subluxation.",
      image: { src: "/images/teaching/us/elbow-ulnar-nerve.jpg", caption: "Short-axis US of the ulnar nerve in the cubital tunnel (2a) with a labeled anatomic overlay (2b).", attribution: "Manske RC, Voight M, Page P, Wolfe C. Int J Sports Phys Ther 2024;19(4):502–6. CC BY-NC 4.0." },
    },
  },
  "Brachialis & distal biceps (anterior)": {
    ultrasound: {
      seen: true,
      appearance:
        "The distal biceps is superficial in the antecubital fossa on US; a complete tear may show a retracted balled-up stump, while an intact lacertus can tether it — US can provide quick confirmation, though MRI and selected FABS imaging better profile the footprint and retraction.",
      image: { src: "/images/teaching/us/elbow-distal-biceps.jpg", caption: "Long-axis US of the distal biceps tendon in the antecubital fossa toward the radial tuberosity (RT).", attribution: "Daoukas S, Galanis D. Ultrasound 2025. CC BY 4.0." },
    },
  },
  "Radial head": {
    ultrasound: {
      seen: true,
      appearance:
        "US shows the radial head cortex and the radiocapitellar joint, and a posterior fat-pad elevation / joint effusion (the lipohemarthrosis of an occult fracture) — but the marrow fracture line itself is an MRI finding.",
      image: { src: "/images/teaching/us/elbow-radial-head.jpg", caption: "US of the radiocapitellar joint and radial head.", attribution: "Malahias MA, et al. Arch Bone Jt Surg 2018;6(6):539. CC BY-NC 3.0." },
    },
  },
};

// Board-style Advanced challenge bank + image-anchored CAQ bank + cross-plane
// correlations — authored separately (MSK-verified workflow) and merged in.
export const elbowAdvanced: AdvancedQ[] = [
  {
    "id": "elb-adv-1",
    "topic": "Protocol & planes — reading capitellar OCD and the distal biceps footprint",
    "prompt": "A 14-year-old gymnast has lateral elbow pain and a radiograph showing capitellar lucency; you are asked to characterize a possible osteochondritis dissecans (OCD) lesion and judge its stability. As you set up the elbow MRI protocol, which approach best matches each structure to the plane and sequence that answers the question?",
    "options": [
      "Read the capitellar OCD on the sagittal plane alone, since it best profiles the cartilage contour",
      "Read the capitellar OCD on coronal plus sagittal together, with fluid-sensitive fat-sat for the interface and add MR/CT arthrography when stability will change the operation",
      "Order a routine MR arthrogram on every elbow because intra-articular contrast is required to call any OCD",
      "Use the FABS (flexion–abduction–supination) view to stage the OCD because it lays the capitellum flat"
    ],
    "answer": 1,
    "explanation": "Capitellar OCD is read on coronal AND sagittal together (the coronal face plus the anterior-to-posterior extent), not sagittal alone, with fluid-sensitive fat-sat to judge the interface; MR or CT arthrography is added only when stability will change the operation. Reading on sagittal alone is the classic protocol error this course corrects. Non-contrast 3T answers most cases, so a routine arthrogram on every elbow is wrong. FABS is the dedicated distal-biceps-footprint view (partial-vs-complete grading and retraction), not an OCD-staging tool."
  },
  {
    "id": "elb-adv-2",
    "topic": "Capitellar OCD stability — which sign makes it unstable",
    "prompt": "A 15-year-old pitcher has a focal anterolateral capitellar osteochondral lesion. On coronal and sagittal fluid-sensitive images you see a T2 fluid-bright line, matching joint-fluid signal, completely undercutting the fragment at the interface, plus a high-signal cartilage cleft reaching the fragment. Which interpretation is correct?",
    "options": [
      "These are instability signs — the lesion is unstable and warrants surgical referral",
      "Surrounding marrow edema is present, so the lesion is unstable by that criterion alone",
      "An isolated high-T2 interface line like this is always definitive for an unstable fragment",
      "The fragment is stable because no subchondral cyst exceeds the 5 mm threshold"
    ],
    "answer": 0,
    "explanation": "A T2 fluid-bright line (matching joint fluid) completely undercutting the fragment plus a cartilage cleft reaching the fragment are reliable instability signs — stop throwing and obtain sports-orthopedic/surgical evaluation. Surrounding marrow edema ALONE is not a stability sign (it occurs in stable and unstable lesions). An ISOLATED high-T2 line without a cartilage breach or cyst is indeterminate, not definitive. The '5 mm cyst' figure is De Smet's knee-derived criterion not validated for the capitellum — the teaching is 'sizeable or multiple' cysts, so invoking a 5 mm cutoff to call this stable is wrong (and a cartilage cleft is already present here)."
  },
  {
    "id": "elb-adv-3",
    "topic": "UCL T-sign — partial undersurface tear vs the normal distal recess",
    "prompt": "A 20-year-old collegiate pitcher has medial elbow pain and a positive moving-valgus test. On coronal MR arthrography, contrast tracks medially along the sublime tubercle under the distal UCL attachment while the proximal fibers stay attached. Which feature best supports the T-sign pattern of a partial undersurface tear rather than a normal distal synovial recess?",
    "options": [
      "Any undercutting of the most distal fibers at all, regardless of how far it extends",
      "Contrast/fluid extending BEYOND the edge of the articular cartilage at the sublime tubercle",
      "Surrounding flexor-pronator tendinosis being present on the same image",
      "Mild T2 hyperintensity within the ulnar nerve in the adjacent cubital tunnel"
    ],
    "answer": 1,
    "explanation": "The abnormal threshold for the T-sign pattern is fluid/contrast tracking BEYOND the articular-cartilage edge at the sublime tubercle while proximal fibers remain attached — that supports a partial undersurface (articular-sided) distal tear in the right clinical setting. A couple of millimetres of undercutting of the most distal fibers can be a normal synovial recess, so 'any undercutting at all' overcalls it. Flexor-pronator tendinosis and mild ulnar-nerve T2 signal are associated valgus-overload findings but do not define the T-sign. MR arthrography is the most sensitive study for this lesion.",
  },
  {
    "id": "elb-adv-4",
    "topic": "LCL/PLRI & the coronoid — the anteromedial facet fracture",
    "prompt": "A 34-year-old falls and sustains a transient elbow subluxation. CT and MRI show a small anteromedial coronoid facet fracture together with an LUCL injury; the radial head and the rest of the coronoid are intact. Despite the fragment looking small on radiographs, why does this pattern deserve urgent instability-focused surgical review?",
    "options": [
      "It is a Regan–Morrey type I coronoid-tip avulsion, which is always managed nonoperatively",
      "It implies varus posteromedial rotatory instability (VPMRI) and untreated drives early arthrosis",
      "It is part of the terrible triad, which by definition includes a radial head fracture here",
      "Small coronoid fragments are inherently stable, so the LUCL injury alone drives treatment"
    ],
    "answer": 1,
    "explanation": "An anteromedial coronoid facet fracture plus LUCL injury defines varus posteromedial rotatory instability (VPMRI) — a distinct instability mechanism from PLRI. The fragment can look small on radiographs but be unstable and treatment-changing; untreated VPMRI can drive early arthrosis (classify with the O'Driscoll anteromedial-facet system). Regan–Morrey classifies coronoid HEIGHT, not this facet, and 'always nonoperative' is false. The terrible triad requires a radial head fracture, which is absent here. 'Small means stable' at the coronoid is exactly the trap this teaches against."
  },
  {
    "id": "elb-adv-5",
    "topic": "Distal biceps & lacertus — the non-retracted complete tear",
    "prompt": "A 47-year-old man felt a tearing sensation lifting a heavy box with the elbow flexed; he has antecubital ecchymosis and weak supination. MRI shows full discontinuity of the distal biceps at the radial tuberosity, but the stump sits near the radial neck with little retraction. How should this be characterized and managed?",
    "options": [
      "A partial tear, because the limited retraction indicates some fibers still reach the tuberosity",
      "A complete tear with an intact lacertus fibrosus tethering the stump — still an anatomic repair consideration in the right patient",
      "Tendinosis, since a balled-up stump is absent and retraction is minimal",
      "A complete tear that must be grafted because it is already beyond the 2-week repair deadline"
    ],
    "answer": 1,
    "explanation": "Full discontinuity at the tuberosity is a complete tear; an INTACT lacertus fibrosus tethers it so it does not retract and can mimic a partial tear clinically and on imaging — the classic missed complete tear. In an active/medically fit patient it remains an anatomic repair consideration, so calling it partial or tendinosis undercalls it. Report complete-vs-partial AND lacertus integrity with retraction in cm. There is no hard 2-4-week deadline: earlier repair is technically easier and chronic irreducible tears need a graft, but many primary repairs succeed out to ~4-6 weeks and beyond — a fixed deadline is a teaching error."
  },
  {
    "id": "elb-adv-6",
    "topic": "Triceps tear — deep central fibers and when to repair",
    "prompt": "A 40-year-old powerlifter (on chronic anabolic steroids) has posterior elbow pain and weak extension after a forced flexion injury; a small olecranon flake is noted on the lateral radiograph. MRI shows the deep central triceps fibers are torn with a fluid gap while the superficial expansion remains in continuity. Which statement is correct?",
    "options": [
      "This is best called tendinosis because the superficial fibers are intact",
      "A high-grade partial tear with deep-fiber disruption and extension weakness should be repaired, not dismissed as tendinosis",
      "Superficial-expansion continuity excludes a surgically relevant injury regardless of the exam",
      "Triceps tears never displace an olecranon flake, so the radiographic finding is incidental"
    ],
    "answer": 1,
    "explanation": "The deep central triceps fibers fail first while the superficial expansion can stay intact, so a clinically near-complete tear can look partial — report the percentage of width torn and the gap. Complete ruptures and high-grade partials (commonly >50% width, especially with extension weakness against resistance) usually prompt repair consideration, so labeling this 'tendinosis' undercalls a surgical lesion. Intact superficial fibers do not exclude a surgically relevant deep tear. An avulsed olecranon flake is the classic radiographic tip-off to a triceps avulsion, not incidental — anabolic steroids are a known risk factor."
  },
  {
    "id": "elb-adv-7",
    "topic": "Epicondylitis + LUCL — refractory tennis elbow that becomes instability",
    "prompt": "A 46-year-old tennis player has chronic lateral elbow pain refractory to rehab and prior steroid injection. MRI shows common extensor (ECRB) tendinosis, and a deep full-thickness tear with a fluid-bright gap that undercuts and communicates with the radiocapitellar joint and involves the LUCL. What does this combination most importantly imply?",
    "options": [
      "Isolated lateral epicondylitis that will resolve with continued conservative care",
      "Reactive lateral-epicondyle marrow edema that should be reported as an LCL tear",
      "A deep extensor tear involving the LUCL implying posterolateral rotatory instability (PLRI) — a ligament repair/reconstruction problem",
      "An LUCL injury that is irrelevant because the common extensor tendinosis is the pain generator"
    ],
    "answer": 2,
    "explanation": "A deep/full-thickness common-extensor tear with a fluid-bright gap that undercuts/communicates with the radiocapitellar joint and INVOLVES the LUCL implies PLRI — this converts a routine 'tennis elbow' debridement into a ligament repair/reconstruction, and it is a known complication of prior lateral steroid injection/release. Treating it as isolated epicondylitis misses the surgical lesion. Reactive epicondyle marrow edema or thin RCL signal should NOT, by itself, be over-called as an LCL tear — but here there is a defined deep tear involving the LUCL, which is the management-changing finding to trace every time."
  },
  {
    "id": "elb-adv-8",
    "topic": "Ulnar / cubital tunnel — anchoring the diagnosis and what changes operative planning",
    "prompt": "A 38-year-old has numbness in the ulnar two digits worse with elbow flexion. On axial images the ulnar nerve subluxates over the medial epicondyle in flexion, and the medial head of the triceps subluxates with it; there is FCU denervation edema. Beyond confirming neuritis, which finding most changes operative planning?",
    "options": [
      "Mild ulnar-nerve T2 hyperintensity alone, which is sufficient to diagnose entrapment",
      "Comparing the ulnar nerve only to the median nerve, since side-to-side comparison is unhelpful",
      "Dynamic nerve subluxation with a co-existing snapping triceps — the triceps may need to be addressed, not just the nerve",
      "The FCU denervation edema itself, which is the expected accompaniment of this presentation"
    ],
    "answer": 2,
    "explanation": "Dynamic ulnar-nerve subluxation may favor transposition over in-situ decompression, and a co-existing snapping triceps (the medial triceps head subluxing with the nerve) can require addressing the triceps mechanism rather than treating the nerve alone — that is the operative-planning finding. Mild ulnar-nerve T2 brightness occurs in asymptomatic elbows, so signal alone does not diagnose entrapment; anchor to caliber change + denervation + clinical correlation. Compare caliber/signal to BOTH the contralateral side and the ipsilateral median nerve. FCU denervation edema supports the diagnosis but does not by itself change the operation — and note that denervation edema is only CONSISTENTLY present from ~2-4 weeks even though it can appear within days, so it neither dates the injury nor drives the surgical decision."
  },
  {
    "id": "elb-adv-9",
    "topic": "PIN / AIN — the Parsonage–Turner caveat and supinator sparing",
    "prompt": "A 32-year-old develops an acute, painful inability to flex the distal interphalangeal joints of the index and middle fingers and the thumb, with weak pinch and NO sensory loss. MRI shows isolated pronator quadratus edema. What is the best next step?",
    "options": [
      "Urgent surgical decompression at the arcade of Frohse, since this is a PIN compression",
      "Recognize a likely AIN palsy that is frequently Parsonage–Turner — pivot to EMG and observation rather than surgery",
      "Diagnose ulnar neuropathy at the cubital tunnel from the intrinsic weakness",
      "Attribute the deficit to supinator denervation, the constant feature of this syndrome"
    ],
    "answer": 1,
    "explanation": "Pure motor weakness of FPL and the FDP to index/middle with isolated pronator quadratus edema and no sensory loss localizes to the anterior interosseous nerve (Kiloh–Nevin). An AIN palsy is frequently neuralgic amyotrophy (Parsonage–Turner) rather than mechanical compression — so surgery is usually NOT indicated and the work-up pivots to EMG and observation. The arcade of Frohse compresses the PIN (a radial-nerve, extensor-compartment motor problem), not the AIN. The pattern is not ulnar. The supinator is variably involved/often spared in PIN syndrome and is not denervated in an AIN palsy — it is not a constant feature."
  },
  {
    "id": "elb-adv-10",
    "topic": "Occult fracture & loose body — the radial-head surgical trigger",
    "prompt": "A 30-year-old falls on an outstretched hand. The radiograph shows a displaced posterior fat pad but no visible fracture line; MRI confirms a radial head/neck fracture (a displaced partial-articular fragment, Mason II) with marrow edema, and forearm rotation is smooth without a mechanical block. What is the correct interpretation?",
    "options": [
      "The displaced posterior fat pad is a normal variant and excludes an occult fracture",
      "Surgery is mandated solely because the articular fragment is displaced more than 2 mm",
      "A displaced posterior fat pad signals an occult intra-articular fracture; the surgical trigger is a mechanical block, not the 2 mm number alone",
      "The posterolateral capitellar pseudodefect explains the findings, so no fracture is present"
    ],
    "answer": 2,
    "explanation": "Any visible (displaced) posterior fat pad in an adult after trauma indicates hemarthrosis from an occult intra-articular fracture — radial head most common — until proven otherwise, and MRI shows the line + marrow edema. The surgical trigger is a mechanical BLOCK to forearm rotation, an articular fragment displaced enough to impede motion, or comminution (Mason III) — NOT the 2 mm number alone; many Mason II fractures without a block are managed nonoperatively, so '>2 mm mandates surgery' is wrong. The posterior fat pad is a real sign, not a normal variant, and the capitellar pseudodefect is a posterolateral bare-area groove that must not be used to explain away a genuine fracture."
  },
  {
    "id": "elb-adv-11",
    "topic": "Panner vs capitellar OCD — age, focality, and reversibility",
    "prompt": "An 8-year-old gymnast has lateral elbow pain and a mild flexion contracture. MRI shows the ENTIRE capitellar ossific nucleus is low-signal and fragmented-appearing, with no discrete fragment, no subchondral cyst, and no loose body. Which interpretation is correct?",
    "options": [
      "Panner disease — a self-limited osteochondrosis of the whole capitellar nucleus at this age, managed conservatively",
      "Capitellar OCD — a fragmented appearance is diagnostic regardless of age or extent",
      "An unstable OCD, since involvement of the entire nucleus is the most severe instability sign",
      "A normal CRITOE secondary ossification center, so no follow-up or activity modification is needed"
    ],
    "answer": 0,
    "explanation": "Panner disease is an osteochondrosis/AVN of the ENTIRE capitellar ossific nucleus in a younger child (~5-10 yr): the nucleus looks fragmented and low signal, but there is no discrete fragment, no subchondral cyst, and no loose body, and it remodels and heals with conservative management. Capitellar OCD is the tempting call and fails on both age and extent — it is FOCAL (anterolateral/central) in the adolescent (~12-17 yr) and can fragment, delaminate, and shed a loose body. Extent of involvement is not a stability criterion: ON MRI, instability lives at the fragment-bone interface (a fluid line undercutting a fragment, a sizeable/multiple cyst, a cartilage cleft, or displacement). The imaging interface is only part of the call for a true OCD — the validated clinical classification (Takahara) rates a capitellar OCD unstable if ANY of a CLOSED capitellar physis, fragmentation, or ≥20° loss of elbow motion is present, and defect size predicts the outcome of fragment excision — so report the interface findings, the physeal status, and the lesion size and let the surgeon combine them with the motion exam. (None of that applies here: this is Panner in an open-physis child, not an OCD.) A normal secondary ossification center can look fragmented and must not be called Panner or OCD — but a symptomatic child with a diffusely low-signal nucleus is the Panner picture, so discharging him as normal is not the safe read."
  },
  {
    "id": "elb-adv-12",
    "topic": "CRITOE — the incarcerated medial epicondyle after a spontaneously reduced dislocation",
    "prompt": "A 9-year-old had a painful elbow injury; the joint is clinically reduced on arrival. On imaging you can identify the trochlear ossification center, but you cannot find the medial epicondyle ossification center. What does this mean?",
    "options": [
      "The medial epicondyle has been avulsed — classically trapped intra-articularly after a transient dislocation that spontaneously reduced",
      "The medial epicondyle simply has not ossified yet, because the trochlea normally ossifies first",
      "The trochlea has ossified early, a recognized normal variant at this age",
      "This is a lateral condyle (Salter-Harris IV) fracture, which explains the absent center"
    ],
    "answer": 0,
    "explanation": "CRITOE's load-bearing rule is that the trochlea NEVER ossifies before the medial epicondyle. A visible trochlea with an absent medial epicondyle therefore means the epicondyle has been AVULSED — and after a transient dislocation that spontaneously reduced, the high-stakes scenario is an intra-articularly incarcerated fragment. Both tempting distractors invert the ossification order, which is precisely the error the mnemonic exists to prevent (the exact ages vary widely, so trust the ORDER and compare with the contralateral side). A lateral condyle fracture is a different pediatric miss — the most non-union-prone elbow fracture, on the LATERAL side — and would not remove the medial epicondyle center."
  },
  {
    "id": "elb-adv-13",
    "topic": "The dislocated elbow — which ligament fails first and what decides disposition",
    "prompt": "A 28-year-old sustains a simple elbow dislocation that is reduced in the emergency department. Post-reduction imaging shows a concentrically reduced joint with an LUCL injury, an intact radial head, and no coronoid fracture. Which statement best reflects the expected pattern and disposition?",
    "options": [
      "Soft-tissue failure runs lateral-to-medial, so the LCL/LUCL is usually the primary lesion and valgus stability is often preserved; a concentrically reduced, stable elbow with an LUCL injury is often managed nonoperatively",
      "The MCL fails first in most simple dislocations, so a UCL reconstruction should be planned",
      "Any LUCL injury after dislocation mandates ligament reconstruction regardless of whether the joint stays reduced",
      "Because the elbow reduced and the radiographs are now normal, no ligament comment is required"
    ],
    "answer": 0,
    "explanation": "By the O'Driscoll circle, dislocation disrupts soft tissue from LATERAL to MEDIAL — LCL/LUCL first, then the anterior and posterior capsule, and the MCL last — so the LCL is the primary lesion in most simple dislocations and valgus stability is often preserved. Disposition turns on whether the joint stays CONCENTRICALLY REDUCED: a stable, reduced elbow with an LUCL injury is often nonoperative, whereas recurrent PLRI, an anteromedial coronoid facet fracture (VPMRI), and the terrible triad are surgical. Assuming the MCL fails first reverses the circle. And silence is never right — comment explicitly on LUCL integrity in every post-dislocation elbow, and hunt the Osborne-Cotterill posterolateral capitellar impaction and heterotopic ossification."
  },
  {
    "id": "elb-adv-14",
    "topic": "Posterior elbow in the thrower — stress reaction vs stress fracture, and the VEO trap",
    "prompt": "A 17-year-old pitcher has posterior elbow pain at ball release. MRI shows posteromedial olecranon marrow edema WITHOUT a discrete low-signal line, plus a small posteromedial olecranon osteophyte and a posterior loose body. How should this be read and managed?",
    "options": [
      "A stress REACTION (edema without a line) with valgus-extension-overload change — and the UCL must be assessed before any osteophyte debridement",
      "A completed olecranon stress fracture, since marrow edema at this site is the diagnostic criterion",
      "Isolated valgus extension overload — debride the osteophyte and the loose body; the UCL is downstream and irrelevant",
      "Expected throwing adaptation — posteromedial edema, osteophytes, and small bodies need no restriction"
    ],
    "answer": 0,
    "explanation": "Edema WITHOUT a discrete low-signal line is a lower-grade stress REACTION; a line plus edema makes it a stress fracture (longer rest, with fixation considered if it widens or displaces) — the line, not the edema, is the grading feature, which is why 'edema is the diagnostic criterion' is wrong. The management trap is the second half: the posteromedial osteophyte and posterior loose body are valgus-extension-overload changes driven by UCL insufficiency, so debriding the osteophyte without addressing valgus laxity can unmask instability — always interrogate the UCL. Calling a symptomatic athlete with a loose body 'expected adaptation' misses a mechanical lesion."
  },
  {
    "id": "elb-adv-15",
    "topic": "Staging muscle denervation — the three phases and how early edema can appear",
    "prompt": "A patient describes ulnar-sided hand weakness that began 5 days ago. MRI shows a normal-appearing FCU and normal ulnar intrinsics with no muscle edema and no fatty atrophy. What is the correct interpretation?",
    "options": [
      "A normal muscle appearance does not exclude denervation — edema is only CONSISTENTLY seen from about 2-4 weeks; correlate with EMG and repeat imaging if the deficit persists",
      "Denervation is excluded, because a muscle that is going to denervate always shows edema by day 5",
      "The absence of edema means the process has already reached the chronic, irreversible phase",
      "Muscle edema is the chronic phase, so a normal-looking muscle means the lesion is fresh and reversible"
    ],
    "answer": 0,
    "explanation": "Denervation has THREE phases. EARLY/LATENT: muscle signal is often still normal — edema is only CONSISTENTLY seen from about 2-4 weeks, so a normal-looking muscle in the first weeks excludes nothing. (Edema has been detected experimentally within hours and clinically within about four days, so its presence alone does not date the injury to weeks.) SUBACUTE: diffuse T2/STIR muscle edema, potentially reversible with reinnervation. CHRONIC: T1 fatty atrophy, not reversible. At 5 days a normal-looking muscle is therefore uninformative, so the right move is EMG and follow-up imaging. The strongest distractor argues from absence — but no muscle is guaranteed to show edema by day 5, and a normal study never excludes denervation. Chronicity is marked by T1 fatty atrophy, not by the absence of edema — and naming the affected muscles is what localizes the nerve and level."
  },
  {
    "id": "elb-adv-16",
    "topic": "The warm olecranon bursa — what MRI can and cannot do",
    "prompt": "A 52-year-old plumber has a red, warm, fluctuant swelling over the olecranon. MRI shows a distended olecranon bursa with rim enhancement and surrounding soft-tissue edema; the elbow joint itself looks normal. What is the correct next step?",
    "options": [
      "Aspirate the bursa — MRI cannot reliably exclude infection, and gout, RA, and repetitive trauma produce an overlapping picture",
      "Report aseptic bursitis, since the joint is normal and the process is confined to the bursa",
      "Rim enhancement is specific for infection, so start antibiotics without aspirating",
      "Reassure and treat with a compressive wrap, since MRI showed no septic arthritis or osteomyelitis"
    ],
    "answer": 0,
    "explanation": "A red, warm, fluctuant olecranon bursa is ASPIRATED, not just imaged: the diagnosis rests on aspiration plus the clinical picture, and MRI cannot reliably exclude infection. Aseptic causes — gout, rheumatoid arthritis, repetitive trauma — can look identical, so declaring it aseptic from the images is exactly the error to avoid; conversely rim enhancement is not specific enough to commit to antibiotics without a tap. A normal-appearing joint does not clear the bursa. MRI's job here is to map extent and raise the alarm, and separately to escalate urgently when a joint effusion carries aggressive periarticular edema and rim enhancement."
  },
  {
    "id": "elb-adv-17",
    "topic": "The marrow red flag — confluent low-T1 replacement and its benign mimics",
    "prompt": "A 24-year-old competitive cyclist who smokes has an elbow MRI for lateral pain. The distal humeral metaphyseal marrow is diffusely lower in T1 signal than fat, but it stays AT OR ABOVE skeletal muscle, retains interspersed fat, spares the epiphyseal fat, is symmetric with the other side, and has no soft-tissue mass or cortical destruction. Best interpretation?",
    "options": [
      "Red-marrow reconversion — a benign pattern; replacement is suggested when confluent T1 drops BELOW muscle/disc, loses interspersed fat, and keeps company with a mass, cortical destruction, or a wide transition zone",
      "Marrow-replacing infiltration until proven otherwise, because any diffuse low-T1 marrow is a red flag",
      "Osteomyelitis, since low-T1 marrow in a symptomatic patient is the defining pattern",
      "A stress injury, because low T1 in an athlete always indicates an occult fracture line"
    ],
    "answer": 0,
    "explanation": "Red-marrow reconversion in an athlete or smoker lowers T1 but stays AT OR ABOVE muscle signal, retains interspersed fat, spares subchondral/epiphyseal fat, and is symmetric — a benign pattern. The red flag is different: confluent low-T1 marrow that drops BELOW skeletal muscle or disc and lacks interspersed fat, and it is most convincing when it keeps dangerous company (a soft-tissue mass, cortical destruction, or a wide transition zone). Treating any low T1 as infiltration over-calls the commonest benign mimic. Osteomyelitis and stress injury also lower T1, but each needs its own company — clinical infection, or a discrete low-signal line with geographic edema — so the discriminator is signal level relative to muscle plus the company it keeps, not T1 alone."
  },
  {
    "id": "elb-adv-18",
    "topic": "The mechanical elbow — where loose bodies hide, the plica mimic, and the pre-op count",
    "prompt": "A 45-year-old machinist with no throwing history has locking and catching, and the surgeon wants a usable pre-operative loose-body count. Which approach is correct?",
    "options": [
      "Sweep the dependent recesses (coronoid fossa, olecranon fossa, radiocapitellar recess) against bright fluid on sagittal fluid-sensitive images, exclude a thickened radiocapitellar plica as a mimic, and report location plus a MINIMUM count — CT/CT arthrography adds bone detail, but no modality gives a reliable exact count",
      "A single fluid-sensitive sequence suffices, and joint fluid pooling in the olecranon fossa can be counted as a body",
      "Report any thin posterolateral radiocapitellar synovial fold as a loose body, since both cause catching",
      "Hand the surgeon an exact pre-operative body count from the MRI, since fluid-sensitive imaging reliably detects and enumerates every ossified fragment"
    ],
    "answer": 0,
    "explanation": "Loose bodies migrate to the dependent recesses — coronoid fossa, olecranon fossa, and radiocapitellar recess — and are most conspicuous against bright joint fluid on sagittal fluid-sensitive images; GRE blooms ossified bodies, and CT or CT arthrography adds bone detail for ossified fragments. Be explicit about the limits: against an arthroscopic reference standard, MRI and CT arthrography perform SIMILARLY — sensitive for posteriorly based bodies but poorly specific, and unreliable both for anterior bodies and for the exact number — so report location and a MINIMUM count, and state that the number may be an underestimate rather than promising an exact pre-operative count. A thickened, edematous radiocapitellar plica with concordant snapping/catching is the mimic to exclude — but note that roughly 3 mm is the NORMAL width of this fold, not a pathologic threshold (symptomatic and asymptomatic plicae overlap), so a thin fold is a normal structure and must not be reported as a body. Fluid in a fossa is an effusion, not a fragment. One more habit for this patient: in a non-thrower or laborer, primary elbow osteoarthritis — not a throwing lesion — is the most common source of both the bodies and the symptoms."
  },
  {
    "id": "elb-adv-19",
    "topic": "Radial tunnel syndrome vs PIN syndrome — the normal MRI and the hunt for a mass",
    "prompt": "A 41-year-old has lateral forearm pain just distal to the lateral epicondyle, tender over the mobile wad, with NO weakness of finger extension. The elbow MRI is normal. What is the best interpretation?",
    "options": [
      "Radial tunnel syndrome — pain without a motor deficit, frequently with a normal MRI; state that no mass is present at the arcade of Frohse rather than manufacturing a finding",
      "PIN syndrome — a normal MRI is expected because the supinator is always spared",
      "The normal MRI excludes a peripheral nerve problem, so the pain must be referred from the cervical spine",
      "Report presumed common-extensor tendinosis, since lateral pain with a normal MRI is by definition tennis elbow"
    ],
    "answer": 0,
    "explanation": "Radial tunnel syndrome is PAIN WITHOUT a motor deficit and often has a normal MRI — say so plainly, and use the study to report or exclude a mass (ganglion, lipoma, distended bicipitoradial bursa) at the arcade of Frohse, because a space-occupying lesion is what shifts management from therapy to surgical referral. PIN syndrome is the tempting distractor but is a MOTOR syndrome (digit drop with radially deviated wrist extension because ECRL is spared), and supinator involvement is variable — often spared because its motor branches arise proximal to the arcade — so 'always spared' is neither true nor an explanation for a normal study. A normal MRI does not exclude a clinical nerve problem, and inventing tendinosis to explain lateral pain is precisely the over-read to avoid."
  },
  {
    "id": "elb-adv-20",
    "topic": "UCL management in a thrower — what MRI does and does not decide",
    "prompt": "A 21-year-old collegiate pitcher has a proximal (humeral-sided) partial UCL tear with no T-sign, an intact flexor-pronator origin, a normal-caliber ulnar nerve, and a mildly positive moving-valgus test. The coach asks whether he needs Tommy John surgery. What is the most accurate framing?",
    "options": [
      "Most partial/low-grade tears — especially proximal ones — are managed nonoperatively first, with reconstruction reserved for full-thickness tears or high-grade partials that fail rehab in a high-demand thrower; the MRI grade alone does not decide it",
      "Any partial UCL tear on MRI is an automatic indication for reconstruction in a collegiate pitcher",
      "MRI supplies the side-to-side medial gapping measurement that defines functional valgus instability",
      "Ulnar nerve transposition should be performed routinely with every UCL reconstruction"
    ],
    "answer": 0,
    "explanation": "Management is driven by the lesion PLUS athlete demand PLUS the moving-valgus exam, not by the MRI grade in isolation. Most partial/low-grade tears are treated nonoperatively first (rest, flexor-pronator and kinetic-chain rehab, a structured return-to-throwing program; PRP is increasingly used, especially for PROXIMAL partials), while reconstruction is the conversation for full-thickness tears or high-grade/symptomatic partials that fail several months of rehab in a thrower wanting high-level return — and repair with an internal brace has re-emerged for acute avulsion-type tears with good tissue. The number MRI cannot supply is the dynamic one: medial ulnohumeral gapping on valgus-stress ULTRASOUND. Two published measures exist and they are not interchangeable — the STRESS DELTA (the rest-to-valgus increase in medial joint space in the injured elbow, abnormal above about 2.4 mm) and the STRESS DELTA DIFFERENCE (the side-to-side comparison of that increase, abnormal above about 1 mm, the more sensitive of the two). Flexion angle and applied load are not standardized, so quote the criterion being used rather than a single universal cutoff. And concurrent ulnar nerve transposition is SELECTIVE — for preoperative ulnar symptoms or instability — not routine, since routine transposition adds morbidity."
  }
];

export const elbowImageCaq: ImageCaqQ[] = [
  {
    "id": "elb-caq-1",
    "topic": "UCL anterior bundle to the sublime tubercle — the T-sign concept",
    "dir": "/images/teaching/stacks/normal-elbow-coronal",
    "count": 25,
    "startIndex": 12,
    "plane": "Coronal T2 FS",
    "vignette": "On this coronal T2 FS image, follow the medial side from the medial epicondyle down to the sublime tubercle of the coronoid and trace the anterior bundle of the ulnar collateral ligament — normally a thin, taut, uniformly low-signal band reaching the sublime tubercle, where a tiny synovial recess can be a normal finding. A 22-year-old pitcher has medial elbow pain at ball release and a positive moving-valgus test. As you scroll this plane, what is the abnormal threshold that distinguishes a partial undersurface (T-sign) tear from the normal distal recess, and what study best confirms it?",
    "options": [
      "Fluid/contrast tracking along the sublime tubercle BEYOND the edge of the articular cartilage while proximal fibers stay attached — the T-sign of a partial undersurface tear; MR arthrography is the most sensitive study",
      "Any fluid undercutting the most distal UCL fibers by even 1–2 mm is diagnostic of a full-thickness tear; non-contrast MRI is fully sufficient",
      "Thickening and intermediate (not fluid-bright) signal of the proximal anterior bundle without any undercutting; dynamic valgus ultrasound is the most sensitive test",
      "Fluid tracking along the posterior bundle in the cubital tunnel floor; CT arthrography is the most sensitive study"
    ],
    "answer": 0,
    "explanation": "Key: the T-sign pattern is fluid/contrast undermining the distal/sublime-tubercle attachment BEYOND the articular-cartilage edge while the proximal fibers remain attached — supporting an articular-sided partial tear in the right clinical setting — and MR arthrography is the most sensitive study for it. The strongest distractor (any 1–2 mm undercutting = full-thickness) is wrong because a couple of millimetres of undercutting can be a normal synovial recess; the abnormal threshold is fluid extending past the cartilage margin, and undersurface tracking is partial, not full-thickness. Proximal thickening with intermediate signal describes chronic sprain/tendinosis, not the T-sign. The posterior bundle is the cubital-tunnel floor and contributes little to valgus restraint — the T-sign is a distal anterior-bundle phenomenon.",
  },
  {
    "id": "elb-caq-2",
    "topic": "Capitellar OCD — why it is read on coronal AND sagittal, and the instability signs",
    "dir": "/images/teaching/stacks/normal-elbow-coronal",
    "count": 25,
    "startIndex": 12,
    "plane": "Coronal T2 FS",
    "vignette": "On this coronal T2 FS image, find the radiocapitellar joint and the convex articular surface of the capitellum — the anterolateral/central capitellum is where osteochondritis dissecans lives. (Remember the normal posterolateral capitellar pseudodefect groove is a bare area, NOT a lesion.) A 14-year-old gymnast has lateral elbow pain and catching. If the capitellum here showed an osteochondral lesion, which approach and finding correctly drive the stable-vs-unstable call?",
    "options": [
      "Surrounding marrow edema alone confirms instability, so the lesion can be staged from this single coronal image",
      "Read the lesion on coronal AND sagittal together; instability is suggested by a T2 fluid-bright line completely undercutting the fragment, a sizeable/multiple subchondral cyst, a cartilage cleft reaching the fragment, or a displaced fragment",
      "A single subchondral cyst measuring exactly ≥5 mm is the validated capitellar threshold and is sufficient by itself to call the lesion unstable",
      "An isolated high-T2 line at the interface without a cartilage breach or cyst is definitively unstable and mandates immediate surgery"
    ],
    "answer": 1,
    "explanation": "Key: capitellar OCD is assessed on coronal + sagittal together (not one plane alone), and ON MRI instability is suggested by a fluid-bright line completely undercutting the fragment, a sizeable or multiple subchondral cysts, a high-signal cartilage cleft reaching the fragment, or a displaced fragment/loose body — while the validated clinical classification adds a closed capitellar physis, fragmentation, or ≥20° motion loss, so report physeal status and lesion size too. The strongest distractor (marrow edema alone = unstable) is wrong because surrounding edema is present in both stable and unstable lesions and is NOT a stability sign. The '≥5 mm cyst' option is wrong because the 5 mm figure is a knee-derived (De Smet) criterion not validated for the capitellum — teach 'sizeable or multiple,' not a hard cutoff. An isolated high-T2 line without a cartilage breach or cyst is INDETERMINATE (possibly healing granulation tissue), not definitively unstable."
  },
  {
    "id": "elb-caq-3",
    "topic": "Ulnar nerve in the cubital tunnel — caliber/signal, the internal control, and flexion subluxation",
    "dir": "/images/teaching/stacks/normal-elbow-axial",
    "count": 34,
    "startIndex": 16,
    "plane": "Axial T2 FS",
    "vignette": "On this axial T2 FS image, find the ulnar nerve in the cubital tunnel — posterior to the medial epicondyle, beneath Osborne's retinaculum, and compare it with the median nerve on the anterior side of the same slice. A 35-year-old thrower has medial elbow pain with little-finger numbness. Knowing there is no universal cross-sectional-area cutoff and that mild T2 signal can be normal, what best anchors a confident diagnosis of ulnar neuritis on this plane?",
    "options": [
      "Any T2 hyperintensity of the ulnar nerve by itself, since signal alone is diagnostic of neuritis",
      "Caliber enlargement plus T2 signal greater than the ipsilateral median-nerve internal control and the contralateral side, together with denervation of FCU/ulnar FDP/ulnar intrinsics — anchored to caliber change + denervation + clinical correlation, not signal alone",
      "The presence of the anterior fat pad on this slice, which indicates an effusion and therefore neuritis",
      "Subluxation of the radial nerve/PIN over the lateral epicondyle in flexion"
    ],
    "answer": 1,
    "explanation": "Key: because there is no universal CSA cutoff and mild ulnar-nerve T2 brightness occurs in asymptomatic elbows, the diagnosis is anchored to caliber change plus muscle denervation plus clinical correlation, using the ipsilateral median nerve and the contralateral side as internal controls — not signal alone. The strongest distractor (any T2 hyperintensity = neuritis) is wrong precisely because isolated signal can be normal. The anterior fat pad is a different structure entirely (an effusion sign, not a nerve finding). Radial-nerve/PIN subluxation over the lateral epicondyle is the wrong nerve and side — the management-changing dynamic finding here is ULNAR-nerve flexion subluxation over the MEDIAL epicondyle (which favors transposition), best assessed on axial images in flexion."
  },
  {
    "id": "elb-caq-4",
    "topic": "Common flexor-pronator and common extensor origins in cross-section — the companion ligament to trace",
    "dir": "/images/teaching/stacks/normal-elbow-axial",
    "count": 34,
    "startIndex": 16,
    "plane": "Axial T2 FS",
    "vignette": "On this axial T2 FS image, identify the common extensor origin off the lateral epicondyle and the common flexor-pronator origin off the medial epicondyle in cross-section — both are normally uniform low-signal tendon. A 46-year-old recreational tennis player has refractory lateral elbow pain that failed prior steroid injection. As you read these origins, which companion structure must you always trace, and why does it change management?",
    "options": [
      "Trace the brachialis to the coronoid, because brachialis tendinosis is the usual cause of lateral epicondylitis",
      "Trace the LUCL to the supinator crest with lateral epicondylitis (and the anterior-bundle UCL with medial epicondylitis), because a deep common-extensor tear that undercuts the radiocapitellar joint and involves the LUCL implies PLRI — a surgical problem and a known complication of prior lateral steroid injection/release",
      "Trace the annular ligament only, because a deep extensor tear most often avulses the annular ligament off the radial neck",
      "Trace the posterior bundle of the UCL, because lateral epicondylitis destabilizes the cubital tunnel floor"
    ],
    "answer": 1,
    "explanation": "Key: the common-extensor origin (ECRB) sits superficial to the LUCL/RCL origin, so with lateral epicondylitis you must trace the LUCL to the supinator crest — a deep/full-thickness extensor tear that undercuts the radiocapitellar joint and involves the LUCL implies posterolateral rotatory instability, converting 'tennis elbow' into a surgical instability problem (and a known complication of prior lateral steroid injection/release). On the medial side the companion is the anterior-bundle UCL. The brachialis distractor is wrong — brachialis is an anterior flexor unrelated to the extensor origin. The annular ligament is not the lesion that hides beneath a deep extensor tear (the LUCL is), and the posterior bundle of the UCL is a medial cubital-tunnel structure, not a lateral companion."
  },
  {
    "id": "elb-caq-5",
    "topic": "Distal biceps and triceps insertions on sagittal — the lacertus/deep-fiber 'masked complete tear'",
    "dir": "/images/teaching/stacks/normal-elbow-sagittal",
    "count": 30,
    "startIndex": 14,
    "plane": "Sagittal IR/STIR",
    "vignette": "On this sagittal IR/STIR image, follow the anterior soft tissues to the distal biceps heading toward the radial tuberosity, and posteriorly the triceps inserting broadly on the olecranon — both normally smooth, continuous, low-signal tendons. A 50-year-old man felt a painful anterior 'pop' lifting a heavy box and has a vague antecubital mass but can still flex. What concept must you keep in mind so you do not undercall the injury on this plane?",
    "options": [
      "A complete distal biceps tear with an INTACT lacertus fibrosus may NOT retract and can mimic a partial tear clinically and on imaging — report partial-vs-complete AND lacertus status and state retraction in cm; likewise the triceps deep central fibers tear first while the superficial expansion stays intact",
      "A balled-up, retracted stump with an empty tuberosity is the only way a complete distal biceps tear can present, so preserved flexion excludes a complete tear",
      "The bicipitoradial bursa fluid is itself the diagnosis of a complete tear and no insertion assessment is needed",
      "The distal biceps and triceps are best graded on the coronal plane, so a sagittal read cannot characterize either tendon"
    ],
    "answer": 0,
    "explanation": "Key: the lacertus fibrosus tethers the distal biceps, so a COMPLETE tear with an intact lacertus may not retract and can masquerade as a partial tear (the commonly missed complete tear) — you must report partial-vs-complete AND lacertus-intact-vs-torn and state retraction in cm; analogously, the triceps deep central fibers fail first while the superficial expansion stays intact, so a clinically near-complete tear can look partial. The strongest distractor (empty tuberosity is the only presentation) is wrong because that is the DISRUPTED-lacertus pattern; an intact lacertus prevents retraction. Bicipitoradial bursitis is a clue to scrutinize the insertion, not a diagnosis by itself. Distal biceps grading is done on axial/FABS and sagittal, not the coronal plane."
  },
  {
    "id": "elb-caq-6",
    "topic": "Fat pads and the dependent recesses for loose bodies on sagittal",
    "dir": "/images/teaching/stacks/normal-elbow-sagittal",
    "count": 30,
    "startIndex": 14,
    "plane": "Sagittal IR/STIR",
    "vignette": "On this sagittal IR/STIR image, find the anterior fat pad (normally seen, hugging the coronoid fossa) and the posterior fat pad in the olecranon fossa, and sweep the coronoid fossa, olecranon fossa, and radiocapitellar recess. A 40-year-old laborer has elbow locking and catching, and you suspect a loose body. Which statement about reading this plane is correct?",
    "options": [
      "A visible anterior fat pad is always pathologic, whereas the posterior fat pad is normally seen in the olecranon fossa",
      "Loose bodies are best detected on the coronal plane against dark cortex, and the posterior fat pad is normally elevated",
      "Loose bodies migrate to the dependent recesses (coronoid fossa, olecranon fossa, radiocapitellar recess) and are best seen against bright joint fluid on sagittal fluid-sensitive images; a normally HIDDEN posterior fat pad that becomes visible/elevated after trauma signals an effusion/hemarthrosis (occult fracture until proven otherwise)",
      "Any fluid in the olecranon fossa is a loose body, and the radiocapitellar recess never harbors bodies"
    ],
    "answer": 2,
    "explanation": "Key: loose bodies migrate to the dependent recesses (coronoid fossa, olecranon fossa, radiocapitellar recess) and are most conspicuous against bright joint fluid on sagittal fluid-sensitive images; the anterior fat pad is NORMALLY seen, but the posterior fat pad is normally HIDDEN in the olecranon fossa, so a visible/elevated posterior fat pad after trauma means an effusion/hemarthrosis and an occult intra-articular fracture until proven otherwise. The first distractor reverses the fat-pad rule (the anterior pad is normal; the posterior pad being visible is the abnormal sign). Loose bodies are best seen on sagittal against bright fluid, not on coronal against dark cortex. And fluid in the olecranon fossa is an effusion, not itself a loose body — the radiocapitellar recess is in fact one of the classic niches that DOES harbor bodies."
  },
  {
    "id": "elb-caq-7",
    "topic": "Radiocapitellar plica - normal fold vs mechanical symptoms",
    "dir": "/images/teaching/stacks/normal-elbow-sagittal",
    "count": 30,
    "startIndex": 14,
    "plane": "Sagittal IR/STIR",
    "vignette": "On this sagittal IR/STIR image, trace the radiocapitellar articulation and the posterolateral recess. A fellow sees a thin low-signal synovial fold near the radiocapitellar joint in an otherwise normal elbow and wonders whether to call a loose body. Which interpretation is safest?",
    "options": [
      "A thin posterolateral radiocapitellar plica/fold can be normal; call it clinically relevant only if thickened, edematous, trapped, or matching snapping/catching symptoms",
      "Any synovial fold at the radiocapitellar joint is a displaced loose body and should be reported as mechanical",
      "The fold is a capitellar OCD instability sign even when the cartilage and subchondral interface are smooth",
      "The fold is the distal UCL T-sign and should be evaluated only on coronal MR arthrography"
    ],
    "answer": 0,
    "explanation": "A posterolateral radiocapitellar plica/synovial fold is a recognized normal structure when thin and smooth. It becomes a potential pain generator when thickened or edematous and when it matches lateral snapping/catching. A loose body should be a discrete intra-articular fragment, and OCD instability depends on the capitellar cartilage/subchondral interface, not a thin synovial fold."
  }
];

const ELBOW_COR = "/images/teaching/stacks/normal-elbow-coronal";
const ELBOW_AXI = "/images/teaching/stacks/normal-elbow-axial";
const ELBOW_SAG = "/images/teaching/stacks/normal-elbow-sagittal";

// Cross-plane correlation drill. Each item uses structures already anchored in
// the elbow workstation, keeping the first elbow bank conservative and visual.
export const elbowCrossPlane: CorrelationItem[] = [
  {
    id: "exp-radial-head-cor-axi",
    prompt:
      "This is the radial head on the coronal image, articulating with the capitellum laterally. Find the same radial head on the axial stack.",
    explanation:
      "The radial head is the lateral round proximal-radius structure. Coronal shows it under the capitellum; axial shows the radial head as the lateral round bone. Do not confuse it with the medial ulna/coronoid side.",
    from: { plane: "Coronal T2-FS", dir: ELBOW_COR, sliceIndex: 12, x: 65, y: 64, label: "Radial head" },
    to: {
      plane: "Axial T2-FS",
      dir: ELBOW_AXI,
      sliceIndex: 20,
      candidates: [
        { x: 61, y: 54 }, // radial head
        { x: 39, y: 61 }, // proximal ulna/coronoid side
        { x: 30, y: 50 }, // flexor-pronator mass
        { x: 74, y: 43 }, // lateral extensor compartment
      ],
      answer: 0,
    },
  },
  {
    id: "exp-capitellum-sag-cor",
    prompt:
      "This sagittal slice profiles the distal-humeral articular surface. Find the capitellum on the coronal image - the lateral OCD face.",
    explanation:
      "Capitellar OCD is a two-plane read: coronal shows the radiocapitellar face, and sagittal shows the anterior-to-posterior extent. A posterolateral pseudodefect/plica region is common, so a contour finding needs sagittal correlation and marrow/cartilage context.",
    from: { plane: "Sagittal IR/STIR", dir: ELBOW_SAG, sliceIndex: 14, x: 55, y: 49, label: "Capitellum/trochlea surface" },
    to: {
      plane: "Coronal T2-FS",
      dir: ELBOW_COR,
      sliceIndex: 12,
      candidates: [
        { x: 62, y: 50 }, // capitellum
        { x: 46, y: 50 }, // trochlea
        { x: 65, y: 64 }, // radial head
        { x: 69, y: 44 }, // common extensor origin
      ],
      answer: 0,
    },
  },
  {
    id: "exp-coronoid-sag-cor",
    prompt:
      "This is the coronoid process on sagittal. On the coronal image, find the medial coronoid/sublime-tubercle region where the anterior UCL inserts.",
    explanation:
      "The coronoid is the anterior proximal-ulnar buttress. Its medial sublime tubercle is the distal attachment of the anterior UCL; that is where the thrower's distal undersurface/T-sign tear classically occurs. This is a region to correlate, not a sagittal-only call.",
    from: { plane: "Sagittal IR/STIR", dir: ELBOW_SAG, sliceIndex: 14, x: 45, y: 60, label: "Coronoid process" },
    to: {
      plane: "Coronal T2-FS",
      dir: ELBOW_COR,
      sliceIndex: 12,
      candidates: [
        { x: 37, y: 56 }, // UCL distal/sublime tubercle region
        { x: 65, y: 64 }, // radial head
        { x: 62, y: 50 }, // capitellum
        { x: 69, y: 44 }, // common extensor origin
      ],
      answer: 0,
    },
  },
  {
    id: "exp-flexor-cor-axi",
    prompt:
      "This is the common flexor-pronator origin on the coronal medial epicondyle. Find the same flexor-pronator mass in cross-section on axial.",
    explanation:
      "The flexor-pronator origin is medial and superficial to the UCL. On axial it sits anteromedial to the cubital tunnel, with the ulnar nerve just posterior - the reason medial epicondylitis and ulnar neuritis travel together.",
    from: { plane: "Coronal T2-FS", dir: ELBOW_COR, sliceIndex: 12, x: 34, y: 44, label: "Common flexor-pronator" },
    to: {
      plane: "Axial T2-FS",
      dir: ELBOW_AXI,
      sliceIndex: 16,
      candidates: [
        { x: 30, y: 55 }, // common flexor-pronator
        { x: 20, y: 61 }, // ulnar nerve
        { x: 72, y: 42 }, // common extensor origin
        { x: 45, y: 33 }, // brachialis
      ],
      answer: 0,
    },
  },
  {
    id: "exp-extensor-cor-axi",
    prompt:
      "This is the common extensor origin on the coronal lateral epicondyle. Find it in cross-section on axial.",
    explanation:
      "The common extensor origin is lateral. In lateral epicondylitis, a deep tear can involve the LUCL/RCL origin underneath it and imply posterolateral rotatory instability - so lateral tendon and lateral ligament are read together.",
    from: { plane: "Coronal T2-FS", dir: ELBOW_COR, sliceIndex: 12, x: 69, y: 44, label: "Common extensor origin" },
    to: {
      plane: "Axial T2-FS",
      dir: ELBOW_AXI,
      sliceIndex: 16,
      candidates: [
        { x: 72, y: 42 }, // common extensor origin
        { x: 30, y: 55 }, // common flexor-pronator
        { x: 20, y: 61 }, // ulnar nerve
        { x: 50, y: 82 }, // triceps
      ],
      answer: 0,
    },
  },
  {
    id: "exp-brachialis-biceps-sag-axi",
    prompt:
      "This anterior sagittal marker is the brachialis/distal-biceps corridor. Find the anterior flexor compartment on axial.",
    explanation:
      "Brachialis fills the anterior elbow and the distal biceps dives toward the radial tuberosity. Axial and sagittal views both matter for partial-vs-complete distal biceps tears; a FABS view can help when the footprint is subtle.",
    from: { plane: "Sagittal IR/STIR", dir: ELBOW_SAG, sliceIndex: 14, x: 33, y: 55, label: "Brachialis / distal biceps" },
    to: {
      plane: "Axial T2-FS",
      dir: ELBOW_AXI,
      sliceIndex: 16,
      candidates: [
        { x: 45, y: 33 }, // brachialis/anterior flexor compartment
        { x: 50, y: 82 }, // triceps
        { x: 72, y: 42 }, // common extensor origin
        { x: 20, y: 61 }, // ulnar nerve
      ],
      answer: 0,
    },
  },
  {
    id: "exp-triceps-axi-sag",
    prompt:
      "This is the posterior triceps compartment on axial. Find its olecranon/triceps-insertion region on sagittal.",
    explanation:
      "Triceps is posterior on axial and inserts broadly on the olecranon on sagittal. Deep central fibers may tear while superficial expansion remains intact, so a 'partial-looking' tear can still be clinically important when extension is weak.",
    from: { plane: "Axial T2-FS", dir: ELBOW_AXI, sliceIndex: 16, x: 50, y: 82, label: "Triceps" },
    to: {
      plane: "Sagittal IR/STIR",
      dir: ELBOW_SAG,
      sliceIndex: 14,
      candidates: [
        { x: 63, y: 60 }, // olecranon/triceps insertion region
        { x: 45, y: 60 }, // coronoid
        { x: 47, y: 38 }, // anterior fat pad
        { x: 33, y: 55 }, // brachialis/distal biceps
      ],
      answer: 0,
    },
  },
];
