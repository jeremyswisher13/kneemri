/**
 * Interactive "master normal first" content for the Normal Elbow MRI workstation.
 * Mirrors knee/shoulder/hip: each plane (keyed by its SERIES id in
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
        note: "The anterior bundle of the UCL is the primary valgus restraint, running from the anteroinferior medial epicondyle to the sublime tubercle of the coronoid. Normal = a thin, taut, uniformly dark band to its distal attachment. The thrower's partial undersurface tear — the T-sign — is fluid undercutting these distal fibers beyond the articular-cartilage edge.",
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
          "The anterior bundle of the UCL is the primary valgus restraint, inserting on the sublime tubercle — where the thrower's undersurface (T-sign) tear occurs. The LUCL is the lateral restraint to posterolateral rotatory instability.",
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
        note: "The ulnar nerve sits in the cubital tunnel posterior to the medial epicondyle, beneath Osborne's retinaculum. Normal = an ovoid nerve of caliber and signal similar to the median nerve and the contralateral side. Assess for flexion subluxation, an anconeus epitrochlearis, or a ganglion — a structural cause that tips surgery from in-situ decompression toward transposition. (Mild T2 brightness alone can be normal.)",
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
        note: "The brachialis is the broad anterior muscle that inserts on the coronoid/ulnar tuberosity — the primary elbow flexor, lying behind the biceps. The distal biceps tendon runs through the antecubital fossa toward its radial-tuberosity footprint (best profiled on a dedicated FABS view).",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 50, y: 82, label: "Triceps" }],
        title: "Triceps",
        note: "The triceps occupies the posterior compartment and inserts broadly on the olecranon. Its deep central fibers can tear first while the superficial expansion stays intact — so a triceps tear can look partial despite significant extension weakness. Watch for a medial triceps head subluxing with the ulnar nerve (snapping triceps).",
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
          "The ulnar nerve in the cubital tunnel can show mild T2 brightness normally, so anchor the call to nerve enlargement PLUS FCU/ulnar-intrinsic denervation PLUS clinical correlation — and look for a structural cause (subluxation, accessory muscle) that changes the operation.",
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
        note: "The distal-humeral articular surface curves through this slice, capped by its hyaline cartilage. Trace the contour as smooth; read a capitellar OCD here together with the coronal face to judge the lesion's anterior-to-posterior extent and the overlying cartilage.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 45, y: 60, label: "Coronoid process" }],
        title: "Coronoid process",
        note: "The coronoid is the anterior beak of the proximal ulna and the keystone of post-traumatic stability — the anteromedial facet fracture (small on radiographs) implies varus posteromedial rotatory instability and is surgical. The sublime tubercle on its medial aspect is the UCL's distal attachment.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 63, y: 60, label: "Olecranon" }],
        title: "Olecranon & triceps insertion",
        note: "The olecranon is the posterior beak of the ulna where the triceps inserts. In the thrower, the posteromedial olecranon is the site of the valgus-extension-overload osteophyte and a posterior loose body. Sweep the olecranon fossa just above it for loose bodies on this fluid-sensitive plane.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 47, y: 38, label: "Anterior fat pad" }],
        title: "Fat pads (coronoid & olecranon fossae)",
        note: "The anterior fat pad sits in the coronoid fossa and is normally visible; the posterior fat pad hides in the olecranon fossa and is normally NOT seen. After trauma, a displaced/elevated posterior fat pad ('sail sign' on radiograph) signals a hemarthrosis from an occult fracture until proven otherwise.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 33, y: 55, label: "Brachialis / distal biceps" }],
        title: "Brachialis & distal biceps (anterior)",
        note: "Anteriorly, the brachialis fills the antecubital fossa and the distal biceps tendon dives toward its radial-tuberosity footprint. A complete biceps tear retracts UNLESS an intact lacertus fibrosus tethers it — so on a dedicated FABS view, report partial-vs-complete, the retraction distance, and the lacertus.",
      },
    ],
    quiz: [
      {
        id: "ec-sag-q1",
        sliceIndex: 14,
        marker: { x: 47, y: 38 },
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
          "The anteromedial coronoid facet fracture looks small on radiographs but implies varus posteromedial rotatory instability (VPMRI) and is surgical — 'small does not mean stable' at the coronoid. The sublime tubercle (medial) is the UCL's distal attachment.",
      },
    ],
  },
};

/** title → "watch for" pearl, keyed by tour-step title. */
export const structureElbowPearl: Record<string, string> = {
  Capitellum:
    "Watch for an osteochondral lesion of the capitellum — judge stability on the interface: a fluid line completely undercutting the fragment, a sizeable/multiple cyst, a cartilage breach, or a displaced fragment = unstable. Surrounding edema alone is not, and an isolated high-T2 line is indeterminate.",
  "Radial head":
    "Watch for an occult radial-head fracture after a fall — a marrow-edema line with a displaced posterior fat pad; the surgical trigger is a mechanical block to forearm rotation or comminution (Mason III), not the 2 mm number alone.",
  "Ulnar collateral ligament (anterior bundle)":
    "Watch for the T-sign — fluid undercutting the distal UCL beyond the articular-cartilage edge — the thrower's partial undersurface tear that is occult on static exam; MR arthrography is the most sensitive study.",
  "Common flexor-pronator origin":
    "Watch the medial 'valgus triad' together: the flexor-pronator origin, the UCL to the sublime tubercle, and the ulnar nerve just posterior — valgus overload injures all three.",
  "Common extensor origin":
    "Watch the LUCL deep to the extensor origin: a deep common-extensor tear that takes the LUCL implies posterolateral rotatory instability — a ligament-reconstruction problem, not a debridement, and a classic post-injection/post-release complication.",
  "Ulnar nerve (cubital tunnel)":
    "Watch for a structural cause that changes the operation — dynamic flexion subluxation of the nerve, an anconeus epitrochlearis, or a snapping triceps favor transposition over in-situ decompression.",
  "Triceps":
    "Watch the deep central triceps fibers — they tear first while the superficial expansion stays intact, so a 'partial' triceps tear with extension weakness against resistance is still a surgical repair.",
  "Coronoid process":
    "Watch the anteromedial coronoid facet — a small-looking fracture implies varus posteromedial rotatory instability and is surgical; in any post-dislocation elbow, also comment on the LUCL (the usual primary lesion).",
  "Olecranon & triceps insertion":
    "Watch the posteromedial olecranon in the thrower for a valgus-extension-overload osteophyte and a posterior loose body — and remember debriding the osteophyte without addressing UCL laxity can unmask valgus instability.",
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
      "OCD stability is qualitative, not a single cutoff: the 5 mm subchondral-cyst figure is knee-derived (De Smet) and not validated for the capitellum — teach 'sizeable or multiple cysts.'",
  },
  "Ulnar collateral ligament (anterior bundle)": {
    variant:
      "A small synovial recess at the distal UCL is normal — the abnormal T-sign threshold is fluid tracking BEYOND the articular-cartilage edge, not any sliver of fluid at the attachment.",
    measure:
      "On dynamic valgus-stress ultrasound, a side-to-side medial gapping difference on the order of ~1–2 mm (thresholds vary by study) is the commonly cited functional-instability range.",
  },
  "Radial head": {
    measure:
      "Mason framework: I = non-/minimally displaced, II = displaced (commonly >2 mm) partial-articular, III = comminuted — but the surgical trigger is a mechanical block to rotation, not the 2 mm number alone.",
  },
  "Ulnar nerve (cubital tunnel)": {
    variant:
      "Mild ulnar-nerve T2 hyperintensity occurs in asymptomatic elbows; there is no universal cross-sectional-area cutoff — compare to the median nerve and the contralateral side.",
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
        "The distal biceps is superficial in the antecubital fossa on US; a complete tear shows a retracted balled-up stump, while an intact lacertus tethers it — US is a quick first-line confirmation, though FABS MRI better profiles the footprint.",
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
    "explanation": "A T2 fluid-bright line (matching joint fluid) completely undercutting the fragment plus a cartilage cleft reaching the fragment are reliable instability signs — stop throwing and refer for surgery. Surrounding marrow edema ALONE is not a stability sign (it occurs in stable and unstable lesions). An ISOLATED high-T2 line without a cartilage breach or cyst is indeterminate, not definitive. The '5 mm cyst' figure is De Smet's knee-derived criterion not validated for the capitellum — the teaching is 'sizeable or multiple' cysts, so invoking a 5 mm cutoff to call this stable is wrong (and a cartilage cleft is already present here)."
  },
  {
    "id": "elb-adv-3",
    "topic": "UCL T-sign — partial undersurface tear vs the normal distal recess",
    "prompt": "A 20-year-old collegiate pitcher has medial elbow pain and a positive moving-valgus test. On coronal MR arthrography, contrast tracks medially along the sublime tubercle under the distal UCL attachment while the proximal fibers stay attached. Which feature confirms this is the T-sign of a partial undersurface tear rather than a normal distal synovial recess?",
    "options": [
      "Any undercutting of the most distal fibers at all, regardless of how far it extends",
      "Contrast/fluid extending BEYOND the edge of the articular cartilage at the sublime tubercle",
      "Surrounding flexor-pronator tendinosis being present on the same image",
      "Mild T2 hyperintensity within the ulnar nerve in the adjacent cubital tunnel"
    ],
    "answer": 1,
    "explanation": "The abnormal threshold for the T-sign is fluid/contrast tracking BEYOND the articular-cartilage edge at the sublime tubercle while proximal fibers remain attached — that defines the partial undersurface (articular-sided) distal tear. A couple of millimetres of undercutting of the most distal fibers can be a normal synovial recess, so 'any undercutting at all' overcalls it. Flexor-pronator tendinosis and mild ulnar-nerve T2 signal are associated valgus-overload findings but do not define the T-sign. MR arthrography is the most sensitive study for this lesion."
  },
  {
    "id": "elb-adv-4",
    "topic": "LCL/PLRI & the coronoid — the anteromedial facet fracture",
    "prompt": "A 34-year-old falls and sustains a transient elbow subluxation. CT and MRI show a small anteromedial coronoid facet fracture together with an LUCL injury; the radial head and the rest of the coronoid are intact. Despite the fragment looking small on radiographs, why is this a surgical lesion?",
    "options": [
      "It is a Regan–Morrey type I coronoid-tip avulsion, which is always managed nonoperatively",
      "It implies varus posteromedial rotatory instability (VPMRI) and untreated drives early arthrosis",
      "It is part of the terrible triad, which by definition includes a radial head fracture here",
      "Small coronoid fragments are inherently stable, so the LUCL injury alone drives treatment"
    ],
    "answer": 1,
    "explanation": "An anteromedial coronoid facet fracture plus LUCL injury defines varus posteromedial rotatory instability (VPMRI) — a distinct instability mechanism from PLRI. The fragment looks small on radiographs but is highly unstable and surgical, and untreated VPMRI drives early arthrosis (classify with the O'Driscoll anteromedial-facet system). Regan–Morrey classifies coronoid HEIGHT, not this facet, and 'always nonoperative' is false. The terrible triad requires a radial head fracture, which is absent here. 'Small means stable' at the coronoid is exactly the trap this teaches against."
  },
  {
    "id": "elb-adv-5",
    "topic": "Distal biceps & lacertus — the non-retracted complete tear",
    "prompt": "A 47-year-old man felt a tearing sensation lifting a heavy box with the elbow flexed; he has antecubital ecchymosis and weak supination. MRI shows full discontinuity of the distal biceps at the radial tuberosity, but the stump sits near the radial neck with little retraction. How should this be characterized and managed?",
    "options": [
      "A partial tear, because the limited retraction indicates some fibers still reach the tuberosity",
      "A complete tear with an intact lacertus fibrosus tethering the stump — still a surgical repair",
      "Tendinosis, since a balled-up stump is absent and retraction is minimal",
      "A complete tear that must be grafted because it is already beyond the 2-week repair deadline"
    ],
    "answer": 1,
    "explanation": "Full discontinuity at the tuberosity is a complete tear; an INTACT lacertus fibrosus tethers it so it does not retract and can mimic a partial tear clinically and on imaging — the classic missed complete tear. It is still a surgical/anatomic repair, so calling it partial or tendinosis undercalls it. Report complete-vs-partial AND lacertus integrity with retraction in cm. There is no hard 2-4-week deadline: earlier repair is technically easier and chronic irreducible tears need a graft, but many primary repairs succeed out to ~4-6 weeks and beyond — a fixed deadline is a teaching error."
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
    "explanation": "The deep central triceps fibers fail first while the superficial expansion can stay intact, so a clinically near-complete tear can look partial — report the percentage of width torn and the gap. Complete ruptures and high-grade partials (commonly >50% width, or ANY tear with extension weakness against resistance) are repaired, so labeling this 'tendinosis' undercalls a surgical lesion. Intact superficial fibers do not exclude a surgically relevant deep tear. An avulsed olecranon flake is the classic radiographic tip-off to a triceps avulsion, not incidental — anabolic steroids are a known risk factor."
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
    "topic": "Ulnar / cubital tunnel — anchoring the diagnosis and what changes the operation",
    "prompt": "A 38-year-old has numbness in the ulnar two digits worse with elbow flexion. On axial images the ulnar nerve subluxates over the medial epicondyle in flexion, and the medial head of the triceps subluxates with it; there is FCU denervation edema. Beyond confirming neuritis, which finding most changes the operation?",
    "options": [
      "Mild ulnar-nerve T2 hyperintensity alone, which is sufficient to diagnose entrapment",
      "Comparing the ulnar nerve only to the median nerve, since side-to-side comparison is unhelpful",
      "Dynamic nerve subluxation with a co-existing snapping triceps — the triceps must be addressed, not just the nerve",
      "Subacute FCU denervation edema, which appears within the first few days of injury"
    ],
    "answer": 2,
    "explanation": "Dynamic ulnar-nerve subluxation favors transposition over in-situ decompression, and a co-existing snapping triceps (the medial triceps head subluxing with the nerve) means the triceps must be addressed, not just the nerve transposed — that is the operation-changing finding. Mild ulnar-nerve T2 brightness occurs in asymptomatic elbows, so signal alone does not diagnose entrapment; anchor to caliber change + denervation + clinical correlation. Compare caliber/signal to BOTH the contralateral side and the ipsilateral median nerve. Denervation shows no MRI change for ~2-4 weeks, then SUBACUTE edema — it is not a first-few-days finding."
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
    "explanation": "Key: the T-sign is fluid/contrast undermining the distal/sublime-tubercle attachment BEYOND the articular-cartilage edge while the proximal fibers remain attached — an articular-sided partial tear — and MR arthrography is the most sensitive study for it. The strongest distractor (any 1–2 mm undercutting = full-thickness) is wrong because a couple of millimetres of undercutting can be a normal synovial recess; the abnormal threshold is fluid extending past the cartilage margin, and undersurface tracking is partial, not full-thickness. Proximal thickening with intermediate signal describes chronic sprain/tendinosis, not the T-sign. The posterior bundle is the cubital-tunnel floor and contributes little to valgus restraint — the T-sign is a distal anterior-bundle phenomenon."
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
    "explanation": "Key: capitellar OCD is assessed on coronal + sagittal together (not one plane alone), and instability is suggested by a fluid-bright line completely undercutting the fragment, a sizeable or multiple subchondral cysts, a high-signal cartilage cleft reaching the fragment, or a displaced fragment/loose body. The strongest distractor (marrow edema alone = unstable) is wrong because surrounding edema is present in both stable and unstable lesions and is NOT a stability sign. The '≥5 mm cyst' option is wrong because the 5 mm figure is a knee-derived (De Smet) criterion not validated for the capitellum — teach 'sizeable or multiple,' not a hard cutoff. An isolated high-T2 line without a cartilage breach or cyst is INDETERMINATE (possibly healing granulation tissue), not definitively unstable."
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
  }
];

export const elbowCrossPlane: CorrelationItem[] = [];
