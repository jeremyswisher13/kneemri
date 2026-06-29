import type { CaseMetadata } from "@/content/cases";

type TeachingImage = NonNullable<CaseMetadata["teachingImages"]>[number];

const elbowUclUsImage: TeachingImage = {
  src: "/images/teaching/us/elbow-ucl.jpg",
  alt: "Long-axis ultrasound of the elbow UCL anterior bundle",
  caption: "US correlate: long-axis UCL anterior bundle from the medial epicondyle with a labeled overlay.",
  attribution: "Manske RC, Voight M, Wolfe C, Page P. Int J Sports Phys Ther 2023;18(2). CC BY-NC 4.0.",
  step: 3,
};

const elbowCommonFlexorUsImage: TeachingImage = {
  src: "/images/teaching/us/elbow-common-flexor.jpg",
  alt: "Long-axis ultrasound of the common flexor-pronator origin at the medial epicondyle",
  caption: "US correlate: common flexor-pronator origin at the medial epicondyle.",
  attribution: "Konarski W, et al. Healthcare 2022;10(8):1529. CC BY 4.0.",
  step: 5,
};

const elbowUlnarNerveUsImage: TeachingImage = {
  src: "/images/teaching/us/elbow-ulnar-nerve.jpg",
  alt: "Short-axis ultrasound of the ulnar nerve in the cubital tunnel",
  caption: "US correlate: ulnar nerve in the cubital tunnel with labeled anatomic overlay.",
  attribution: "Manske RC, Voight M, Page P, Wolfe C. Int J Sports Phys Ther 2024;19(4):502-6. CC BY-NC 4.0.",
  step: 6,
};

const elbowDistalBicepsUsImage: TeachingImage = {
  src: "/images/teaching/us/elbow-distal-biceps.jpg",
  alt: "Long-axis ultrasound of the distal biceps tendon toward the radial tuberosity",
  caption: "US correlate: distal biceps tendon in the antecubital fossa toward the radial tuberosity.",
  attribution: "Daoukas S, Galanis D. Ultrasound 2025. CC BY 4.0.",
  step: 5,
};

const elbowCommonExtensorUsImage: TeachingImage = {
  src: "/images/teaching/us/elbow-common-extensor.jpg",
  alt: "Long-axis ultrasound of the common extensor origin at the lateral epicondyle",
  caption: "US correlate: common extensor origin at the lateral epicondyle with the radial head deep.",
  attribution: "Allen GM, Jacobson JA, in IDKD 'Musculoskeletal Diseases 2021-2024' (NCBI Bookshelf NBK570156). CC BY 4.0.",
  step: 5,
};

const elbowRadialHeadUsImage: TeachingImage = {
  src: "/images/teaching/us/elbow-radial-head.jpg",
  alt: "Ultrasound of the radiocapitellar joint and radial head",
  caption: "US correlate: radiocapitellar joint and radial head; the MRI task is still to confirm a true fracture line plus edema.",
  attribution: "Malahias MA, et al. Arch Bone Jt Surg 2018;6(6):539. CC BY-NC 3.0.",
  step: 2,
};

/**
 * Elbow MRI teaching cases (primary-care sports-medicine audience).
 * Text authored from the MSK-verified blueprint + an adversarial MSK-radiologist pass.
 * Mirrors hipCaseRegistry. radiopaediaUrl links to real example cases (search scope).
 */
export const elbowCaseRegistry: CaseMetadata[] = [
  {
    "id": "elbow-ucl-tear-thrower",
    "title": "UCL Tear in a Thrower (Distal Avulsion + T-Sign)",
    "difficulty": "foundational",
    "tier": "core",
    "clinicalScenario": "A 19-year-old collegiate pitcher reports progressive medial elbow pain and loss of velocity over a single season, culminating in a 'pop' and sharp pain at ball release. The moving-valgus stress test is positive, reproducing his pain through the late-cocking/acceleration arc. The clinical question is a thrower's UCL injury versus isolated medial epicondylitis versus ulnar neuritis.",
    "keyDiagnoses": [
      "Partial undersurface (distal/sublime-tubercle) tear of the UCL anterior bundle with the T-sign",
      "Sublime-tubercle and adjacent ulnar marrow edema (chronic valgus traction)",
      "Flexor-pronator (common flexor) origin tendinosis",
      "Ulnar neuritis as the third member of the valgus-overload triad (interrogated, low-grade)"
    ],
    "tags": [
      "ucl-tear",
      "t-sign",
      "thrower",
      "valgus-overload",
      "mr-arthrography",
      "moving-valgus-test",
      "flexor-pronator-tendinosis"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=ulnar%20collateral%20ligament%20tear%20elbow",
    "radiopaediaTitle": "UCL tear / T-sign (thrower's elbow) — Radiopaedia cases",
    "teachingImages": [
      elbowUclUsImage,
      elbowCommonFlexorUsImage,
      elbowUlnarNerveUsImage
    ],
    "modelReport": {
      "findings": "PROTOCOL: Elbow MR arthrography (direct intra-articular gadolinium) with coronal and axial fluid-sensitive fat-saturated sequences and T1; the medial joint is the target. Clinical question: thrower's medial elbow pain with a 'pop' at release and a positive moving-valgus test — UCL undersurface tear versus medial epicondylitis versus ulnar neuritis. MR arthrography was chosen because it is the most sensitive study for the partial undersurface UCL tear (T-sign), which is undercalled on non-contrast MRI and occult on the static valgus-stress exam — at arthroscopy it is detected only when valgus stress is applied (the arthroscopic valgus-stress test), not on resting inspection.\n\nBONES & MARROW: Marrow edema at the sublime tubercle of the medial coronoid with a small adjacent traction-type change, consistent with chronic valgus overload at the distal UCL attachment. No capitellar osteochondral lesion (no fluid-undercut fragment, no sizeable or multiple subchondral cysts, no displaced fragment); the radiocapitellar lateral-compartment surface is preserved. No posteromedial olecranon (valgus-extension-overload) osteophyte and no olecranon stress line. Medial epicondyle physis is closed (skeletally mature) — this is a ligament/tendon injury, not a Little League apophyseal avulsion.\n\nLIGAMENTS (UCL — key region): The anterior bundle of the UCL is thickened with intrasubstance T2 hyperintensity, indicating a chronic-on-acute process. At the DISTAL (sublime-tubercle) attachment, intra-articular contrast/fluid undermines the deep fibers and tracks BEYOND the edge of the articular cartilage — the T-sign — while the more proximal/humeral fibers remain attached. This is a partial-thickness, articular-sided (undersurface) DISTAL tear, not a full-thickness tear (no fiber discontinuity spanning the whole thickness, no gap/retraction, no medial extravasation through a complete defect). Estimated involvement is greater than 50% of the undersurface fibers — reported as a descriptive heuristic, not a validated graded scale. The lateral ligament complex (LUCL to the supinator crest, RCL, annular ligament) is intact, with no posterolateral rotatory-instability signs.\n\nTENDONS: The common flexor-pronator origin off the medial epicondyle shows tendinosis (thickening and intermediate signal) without a surface-reaching fluid gap or full-thickness tear. The common extensor origin, distal biceps (footprint and lacertus), and triceps insertion are intact.\n\nNERVES: The ulnar nerve in the cubital tunnel shows mild T2 hyperintensity without definite caliber enlargement; no flexion subluxation demonstrated on the available images, no anconeus epitrochlearis, and no FCU/ulnar-intrinsic denervation edema. Findings are at most low-grade ulnar neuritis — anchor any neuritis call to caliber change plus denervation plus clinical correlation, not signal alone. Median/AIN and radial/PIN territories are unremarkable.\n\nJOINT: Small joint effusion/contrast distension as expected for an arthrogram. Radiocapitellar and ulnotrochlear cartilage preserved; no loose body in the coronoid, olecranon, or radiocapitellar recesses; no pathologic radiocapitellar plica.",
      "impression": "1. Partial-thickness UNDERSURFACE (articular-sided) DISTAL tear of the UCL anterior bundle at the sublime tubercle — the T-SIGN — with a thickened, intrasubstance-abnormal ligament (chronic-on-acute). This is the management-changing finding: a distal undersurface tear is prognostically worse, more often occult, and is the lesion missed on non-contrast MRI and the static valgus exam (at arthroscopy it is seen only with applied valgus stress).\n2. Sublime-tubercle and adjacent ulnar marrow edema/traction change, consistent with chronic valgus overload.\n3. Flexor-pronator origin tendinosis without a full-thickness tear.\n4. Mild ulnar nerve T2 signal without caliber change, subluxation, or denervation — at most low-grade neuritis; correlate clinically.\n5. The full valgus-overload triad is documented (UCL + flexor-pronator + ulnar nerve). Treatment is driven by the lesion (distal, undersurface, >50% by heuristic) PLUS the positive moving-valgus exam PLUS this collegiate pitcher's demand — NOT by MRI alone. Recommend sports-medicine/orthopedic referral for an operative-versus-nonoperative discussion — repair ± internal brace favors an ACUTE, good-quality avulsion-type tear, whereas this thickened, chronic-on-acute distal ligament in a high-demand pitcher leans toward reconstruction (Tommy John); concurrent ulnar nerve transposition is selective, not routine, and is not indicated by these low-grade nerve findings."
    },
    "teachingPoints": [
      "The T-sign IS the partial undersurface tear: intra-articular contrast/fluid undercuts the most distal UCL fibers at the sublime tubercle and tracks BEYOND the edge of the articular cartilage while the proximal fibers stay attached. The abnormal threshold is fluid extending past the cartilage margin — a couple of millimetres of undercutting can be a normal distal synovial recess. MR arthrography is the most sensitive study; this lesion is undercalled on non-contrast MRI and occult on the static valgus-stress exam — at arthroscopy it is detected only when valgus stress is applied (the arthroscopic valgus-stress test, Timmerman–Andrews), not on resting visual inspection.",
      "Always characterize four things: surface (undersurface/articular-sided vs full-thickness), location (proximal/mid/DISTAL), acute vs chronic, and a size estimate. The <50%/>50% partial call is a descriptive heuristic, NOT a validated graded UCL scale — do not imply a cutoff drives the decision by itself.",
      "Distal (sublime-tubercle) tears are a recognized, prognostically WORSE, and more often occult pattern, and they do worse nonoperatively — which is why naming the location matters. But distal-versus-proximal predominance is genuinely NOT uniform in the literature; teach distal tears as an important under-recognized pattern, not as the more common lesion (several series report proximal/humeral-sided partials as at least as frequent).",
      "Management is driven by the lesion + the moving-valgus exam + the athlete's demand, not the MRI alone. Repair ± internal brace has re-emerged for acute avulsion-type tears with good tissue (often younger/earlier-return athletes), while reconstruction (Tommy John) is the conversation for full-thickness tears or high-grade/symptomatic partials in throwers wanting high-level return — so 'avulsion off bone vs shredded midsubstance' is a distinction the surgeon wants.",
      "Every thrower's medial-pain read is the valgus triad: UCL + flexor-pronator origin + ulnar nerve — they injure together. Document ulnar neuritis/subluxation, but concurrent ulnar nerve transposition with UCL surgery is SELECTIVE (for preoperative ulnar symptoms or instability), not routine; anchor any neuritis call to caliber change + denervation + clinical correlation, not T2 signal alone."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm this is MR arthrography (direct intra-articular gadolinium) — the most sensitive study for the partial undersurface UCL tear (T-sign)",
          "Clinical question is a thrower's medial pain with a 'pop' at release and a positive moving-valgus test: UCL vs medial epicondylitis vs ulnar neuritis",
          "Confirm coronal fluid-sensitive sequences are present — coronal is the plane that answers the UCL and the T-sign; confirm any finding in ≥2 planes"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "Sublime-tubercle and adjacent ulnar marrow edema/traction change from chronic valgus overload — the bony footprint of the distal UCL injury",
          "Pertinent negative: no capitellar OCD (no fluid-undercut fragment, no sizeable or multiple subchondral cysts, no displaced fragment) and a preserved radiocapitellar surface",
          "Pertinent negative: no posteromedial olecranon (valgus-extension-overload) osteophyte or olecranon stress line; medial epicondyle physis closed (not Little League apophysitis)"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Anterior bundle thickened with intrasubstance T2 hyperintensity (chronic-on-acute)",
          "T-SIGN at the distal/sublime-tubercle attachment: contrast/fluid undermines the deep fibers BEYOND the articular-cartilage edge while proximal fibers stay attached — a partial undersurface DISTAL tear, not full-thickness",
          "Record location (distal), surface (undersurface), acute-vs-chronic, and a >50% heuristic estimate; link to the flexor-pronator origin and ulnar nerve as the valgus triad"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "Pertinent negative: LUCL intact from the lateral epicondyle to the supinator crest; no humeral-origin avulsion or undersurface tear",
          "Pertinent negative: no posterolateral rotatory-instability signs (no posterolateral radial subluxation, normal radiocapitellar alignment)",
          "Pertinent negative: coronoid intact — no anteromedial-facet fracture, no terrible-triad pattern (this is an isolated medial valgus injury, not post-traumatic instability)"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "Common flexor-pronator origin tendinosis (thickening + intermediate signal) WITHOUT a surface-reaching fluid gap or full-thickness tear",
          "Trace the UCL with this medial epicondylitis: the concomitant distal UCL tear is what shifts management toward reconstruction in a thrower",
          "Pertinent negative: distal biceps (footprint + lacertus), triceps insertion, and common extensor origin intact"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Ulnar nerve with mild T2 hyperintensity but no definite caliber enlargement and no FCU/ulnar-intrinsic denervation — at most low-grade neuritis (anchor to caliber + denervation + clinical correlation, not signal alone)",
          "No flexion subluxation, anconeus epitrochlearis, or snapping triceps demonstrated — so no structural driver favoring transposition over in-situ decompression",
          "Pertinent negative: median/AIN (pronator quadratus/FPL/FDP) and radial/PIN (extensor compartment) territories unremarkable"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Radiocapitellar and ulnotrochlear cartilage preserved; small effusion/contrast distension expected for an arthrogram",
          "Pertinent negative: no loose body in the coronoid, olecranon, or radiocapitellar recesses",
          "Pertinent negative: no pathologic (>~3 mm, symptomatic) radiocapitellar plica and no olecranon bursitis"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "No mass/ganglion as an occult cause and no infection/tumor red flag (no confluent low-T1 marrow replacement or cortical destruction)",
          "Name the single management-changing finding: the distal undersurface UCL tear (T-sign) — prognostically worse and occult on MRI/static valgus exam (seen at arthroscopy only with applied valgus stress)",
          "Disposition: sports-medicine/orthopedic referral driven by lesion + moving-valgus exam + athlete demand (repair ± internal brace vs reconstruction); ulnar transposition is selective, not routine"
        ]
      }
    ],
    "residentVisible": true
  },
  {
    "id": "elbow-capitellar-ocd",
    "title": "Capitellar Osteochondritis Dissecans — Stable vs Unstable",
    "difficulty": "intermediate",
    "tier": "core",
    "clinicalScenario": "A 13-year-old competitive gymnast (also pitches Little League) presents with several months of progressive lateral elbow pain, intermittent catching, and a fixed 15-degree loss of terminal extension (flexion contracture). Pain worsens with weight-bearing on the arms and with throwing; radiographs show a focal anterolateral capitellar lucency, prompting MRI to characterize the lesion and judge its stability.",
    "keyDiagnoses": [
      "Capitellar osteochondritis dissecans (OCD) of the adolescent thrower/gymnast",
      "Stability assessment: fluid undercutting / subchondral cyst(s) / cartilage breach / displaced fragment as the management hinge",
      "Panner disease (the key age-based differential — excluded here)",
      "Radiocapitellar (lateral compartment) valgus-overload osteochondral injury"
    ],
    "tags": [
      "capitellar-ocd",
      "osteochondritis-dissecans",
      "stability-assessment",
      "panner-vs-ocd",
      "thrower-elbow",
      "surgical-referral",
      "lateral-elbow-pain"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=capitellar%20osteochondritis%20dissecans",
    "radiopaediaTitle": "Capitellar osteochondritis dissecans (OCD) — Radiopaedia cases",
    "modelReport": {
      "findings": "PROTOCOL: Non-contrast 3T elbow MRI with fluid-sensitive fat-suppressed (PD/T2 FS) and T1 sequences. The capitellar lesion is interrogated on CORONAL and SAGITTAL together (coronal for the medial-lateral face, sagittal for anterior-to-posterior extent). Clinical question: capitellar OCD versus Panner, and — if OCD — stable versus unstable, because that determines rest versus surgical referral.\n\nBONES & MARROW: There is a FOCAL subchondral signal abnormality in the ANTEROLATERAL capitellum at the radiocapitellar contact zone. The ossific nucleus is otherwise normally ossified for age, and the abnormality is discrete and lesional — NOT a diffuse low-signal involvement of the entire capitellar ossific nucleus (i.e., this is OCD, not Panner). The lesion is demarcated peripherally by a partially low-signal margin. Surrounding reactive marrow edema extends into the capitellar metaphysis; this edema is noted but is NOT by itself a stability sign. No medial epicondyle apophyseal widening to suggest a concurrent Little League (medial) lesion. The radial head, trochlea, olecranon, and coronoid are normal; no occult fracture line.\n\nOSTEOCHONDRAL STABILITY (the management-defining read): At the lesion interface there is a T2 fluid-bright line that closely matches joint-fluid signal and COMPLETELY UNDERCUTS the osteochondral fragment, separating it from the underlying capitellum. A sizeable subchondral cyst (with a smaller satellite cyst) sits deep to the fragment. The overlying articular cartilage demonstrates a high-signal cleft that REACHES the fragment surface (a cartilage breach/delamination). The fragment remains in situ (non-displaced) but is mechanically separated by these findings. Taken together — fluid undercutting + a sizeable/multiple cyst(s) + a cartilage breach — the lesion is UNSTABLE. (No criterion here is an isolated high-T2 line alone, which would be indeterminate.)\n\nLIGAMENTS: The anterior bundle of the UCL traces intact from the medial epicondyle to the sublime tubercle with no T-sign (no fluid tracking beyond the articular-cartilage edge at the distal attachment) — pertinent negative given the throwing history. The lateral collateral / LUCL complex and annular ligament are intact; no posterolateral instability sign.\n\nTENDONS: Common extensor (ECRB) and common flexor-pronator origins are normal without tendinosis or tear. Distal biceps and triceps insertions are intact.\n\nNERVES: The ulnar nerve in the cubital tunnel is normal in caliber and signal relative to the median nerve and shows no flexion subluxation; no ulnar, median/AIN, or radial/PIN denervation.\n\nJOINT: Small joint effusion. Critically, the dependent recesses (coronoid fossa, olecranon fossa, radiocapitellar recess) are swept and are CLEAR — no separate intra-articular loose body. No pathologically thickened radiocapitellar plica to mimic the OCD. The pseudodefect of the capitellum (normal posterolateral bare-area groove) is distinct from the anterolateral lesion and is not over-called.",
      "impression": "1. CAPITELLAR OSTEOCHONDRITIS DISSECANS (OCD), anterolateral capitellum, in a skeletally immature gymnast/thrower — focal and lesional, distinguishing it from Panner disease (which is a self-limited osteochondrosis of the whole ossific nucleus in a younger child).\n2. The lesion is UNSTABLE — this is the management-changing line: a T2 fluid-bright line (matching joint fluid) completely undercuts the fragment, with a sizeable/multiple subchondral cyst(s) and a high-signal cartilage cleft reaching the fragment. Any ONE of these is a surgical-referral sign; here there are three.\n3. Fragment is currently in situ (non-displaced) and the dependent recesses are clear of a loose body — but the undercutting/cyst/cartilage-breach pattern still places this in the unstable, surgical category.\n4. Surrounding marrow edema is present but was NOT used as a stability criterion; UCL (no T-sign) and the LUCL complex are intact.\n5. DISPOSITION: orthopedic/sports-surgery referral for an unstable capitellar OCD; recommend throwing/loading cessation in the interim. (Stable lesions — intact cartilage, no fluid undercutting, low-signal demarcating margin — are managed with rest and serial follow-up instead.)"
    },
    "teachingPoints": [
      "OCD vs Panner is settled by AGE + FOCALITY, not severity: capitellar OCD is the older adolescent (~12-17 yr) thrower/gymnast with a FOCAL anterolateral lesion that can fragment; Panner is the younger child (~5-10 yr), involves the WHOLE ossific nucleus, is self-limited/reversible, and characteristically does NOT shed a discrete fragment or form a subchondral cyst. Get the age and the focality right before you talk stability.",
      "Stability is the management hinge, and it is read on CORONAL + SAGITTAL together. Call it UNSTABLE (→ surgical referral) if ANY one of: a T2 fluid-bright line completely undercutting the fragment (matching joint-fluid signal); a sizeable or multiple subchondral cyst(s); a high-signal cartilage cleft reaching the fragment; or a displaced fragment/loose body. STABLE (→ throwing rest + serial follow-up) = no surrounding fluid-bright signal, intact overlying cartilage, an in-situ fragment, and a low-signal demarcating margin.",
      "Two traps that change the disposition: surrounding marrow EDEMA ALONE is NOT a stability sign (it is present in both stable and unstable lesions), and an ISOLATED high-T2 line without a cartilage breach or cyst is INDETERMINATE (it can be healing granulation tissue). Don't upgrade a lesion to 'unstable' on edema, and don't let a lone interface line by itself drive surgery — get MR/CT arthrography when stability will change the operation.",
      "Teach the stability signs QUALITATIVELY. The 5 mm cyst figure is De Smet's KNEE-derived criterion and is NOT validated for the capitellum — say 'sizeable or multiple subchondral cysts.' Likewise the often-quoted ~0.92 sensitivity / ~0.85 specificity is OCD-wide (predominantly knee) data extrapolated to the elbow, so cite the SIGNS, not a borrowed accuracy number.",
      "Always sweep the dependent recesses (coronoid fossa, olecranon fossa, radiocapitellar recess) for a separate loose body — a displaced fragment/loose body is itself an instability criterion and a mechanical-symptom source — and don't mistake the normal capitellar pseudodefect (posterolateral bare-area groove) or a thickened radiocapitellar plica for the OCD lesion."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm fluid-sensitive (PD/T2 FS) and T1 sequences with BOTH coronal and sagittal coverage of the capitellum — OCD is read on coronal + sagittal together",
          "State the exact question: capitellar OCD vs Panner, and (if OCD) stable vs unstable, since that drives rest vs surgical referral",
          "Lateral-pain, mechanically-catching adolescent gymnast/thrower with a capitellar lucency on radiographs — map the search to the radiocapitellar (OCD) face"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "FOCAL anterolateral capitellar osteochondral lesion (OCD), NOT diffuse whole-nucleus involvement — excludes Panner by focality and age",
          "UNSTABLE interface: a T2 fluid-bright line (matching joint fluid) completely undercutting the fragment + a sizeable/multiple subchondral cyst(s) + a cartilage cleft reaching the fragment — the management-changing findings, read on coronal + sagittal",
          "Surrounding marrow edema is present but explicitly NOT used as a stability sign; no medial epicondyle apophyseal stress lesion; radial head/trochlea/olecranon normal"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Anterior-bundle UCL intact from medial epicondyle to sublime tubercle — NO T-sign (no fluid beyond the articular-cartilage edge) (pertinent negative in a thrower)",
          "No sublime-tubercle traction spur or marrow edema of chronic valgus overload",
          "Flexor-pronator origin and ulnar nerve (the medial triad) are addressed and normal"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "LUCL (epicondyle → posterior to radial head → supinator crest), RCL, and annular ligament intact — no posterolateral rotatory instability sign",
          "No coronoid anteromedial-facet fracture and no terrible-triad pattern (no post-traumatic instability here)",
          "Radiocapitellar alignment maintained; the lesion is osteochondral, not ligamentous"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "Common extensor (ECRB) origin normal — no lateral epicondylitis to account for the lateral pain (the OCD is the source)",
          "Common flexor-pronator origin normal",
          "Distal biceps and triceps insertions intact"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Ulnar nerve normal in caliber/signal vs the median-nerve internal control and contralateral side; no flexion subluxation",
          "No median/AIN or radial/PIN denervation (no target-muscle edema or fatty atrophy)",
          "No mass or ganglion as an entrapment cause"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Overlying radiocapitellar cartilage shows a high-signal cleft REACHING the fragment (a cartilage breach — an instability criterion); ulnotrochlear cartilage preserved",
          "Small effusion; dependent recesses (coronoid/olecranon fossae, radiocapitellar recess) swept and CLEAR of a separate loose body",
          "No pathologically thickened radiocapitellar plica and no over-call of the normal capitellar pseudodefect as the lesion"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "No marrow-replacement, cortical-destruction, or soft-tissue-mass red flags — this is osteochondral, not infection/tumor",
          "Confirm the single management-changing finding: an UNSTABLE capitellar OCD (fluid undercutting + cyst + cartilage breach) → surgical referral, not rest",
          "Disposition stated explicitly: orthopedic/sports-surgery referral with interim throwing/loading cessation; a stable lesion would instead be rest + serial follow-up"
        ]
      }
    ],
    "residentVisible": true
  },
  {
    "id": "elbow-distal-biceps-tear",
    "title": "Distal Biceps Tendon Tear (Retraction + Lacertus)",
    "difficulty": "foundational",
    "tier": "core",
    "clinicalScenario": "A 48-year-old man felt a sudden tearing sensation in the front of the elbow while lifting a heavy box with the elbow flexed at about 90 degrees. He has antecubital ecchymosis, weak and painful resisted supination, and a positive hook test (the examiner cannot hook a finger under an intact distal biceps tendon laterally).",
    "keyDiagnoses": [
      "Complete distal biceps tendon tear (avulsion) from the radial tuberosity",
      "Bicipitoradial bursitis (reactive fluid at the footprint)",
      "Lacertus fibrosus status as the retraction-limiting variable (intact vs disrupted)",
      "Empty radial tuberosity footprint with proximal tendon retraction"
    ],
    "tags": [
      "distal-biceps-tear",
      "radial-tuberosity",
      "lacertus-fibrosus",
      "tendon-retraction",
      "fabs-view",
      "surgical-referral",
      "hook-test"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=distal%20biceps%20tendon%20tear",
    "radiopaediaTitle": "Distal biceps tendon tear — Radiopaedia cases",
    "teachingImages": [
      elbowDistalBicepsUsImage
    ],
    "modelReport": {
      "findings": "PROTOCOL: Non-contrast elbow MRI with axial, coronal, and sagittal fluid-sensitive (T2 FS/STIR) and T1 sequences, including a dedicated FABS (flexion-abduction-supination, prone) view to lay the distal biceps footprint flat at the radial tuberosity. Clinical question: distal biceps tendon injury after a mechanical pop with weak supination and a positive hook test.\n\nBONES & MARROW: Radial head, capitellum, trochlea, olecranon, and coronoid are intact without fracture line or osteochondral lesion. There is mild reactive marrow edema at the radial (bicipital) tuberosity at the biceps footprint, but the empty footprint is the dominant finding. No capitellar OCD, no loose body, no posterior fat-pad sign to suggest occult intra-articular fracture.\n\nLIGAMENTS: The anterior bundle of the UCL is intact to the sublime tubercle with no T-sign. The LCL/LUCL complex and annular ligament are intact - no post-traumatic instability pattern. (These are pertinent negatives, since the injury here is a flexor mechanism avulsion, not a valgus or posterolateral instability event.)\n\nTENDONS (DISTAL BICEPS - key region): There is full-thickness discontinuity of the distal biceps tendon at the radial-tuberosity footprint. The tuberosity footprint is EMPTY, and the torn tendon end is balled-up and wavy. On the FABS view the footprint is profiled and confirmed denuded. The stump is retracted proximally; it sits approximately 4 cm proximal to the radial tuberosity (measured from the tuberosity to the distal tendon margin on the long-axis/sagittal and FABS images). The LACERTUS FIBROSUS is DISRUPTED, which has allowed this degree of proximal retraction and the empty tuberosity. Fluid and a small hematoma fill the bicipitoradial bursa and the gap between the stump and the denuded footprint. The brachialis is intact (an important pertinent negative - it preserves some elbow flexion and can mask the deficit clinically). Triceps and common flexor/extensor origins are intact.\n\nNERVES: The radial nerve / PIN at the radiocapitellar level and the median nerve are normal in caliber and signal; no mass or distended bursa is compressing the PIN. No muscle denervation edema.\n\nJOINT: Small radiocapitellar/ulnotrochlear effusion. Articular cartilage preserved. No synovitis or loose body.",
      "impression": "1. COMPLETE (full-thickness) distal biceps tendon tear avulsed from the radial tuberosity, with an EMPTY footprint and a balled-up retracted stump.\n2. The lacertus fibrosus is DISRUPTED, with proximal retraction of approximately 4 cm - the two management-changing variables (complete-vs-partial and retraction + lacertus status) both point toward an anatomic surgical repair, and the degree of retraction with a torn lacertus is the surgically significant feature.\n3. Reactive bicipitoradial bursitis and a small footprint hematoma; intact brachialis (preserves some flexion and can mask the clinical deficit).\n4. No UCL/LCL instability pattern and no PIN compression. Recommend prompt orthopedic/sports-surgery referral for distal biceps repair - earlier anatomic repair is technically easier (a guideline, not a hard 2-4-week deadline); a chronically retracted, irreducible tendon may require graft reconstruction."
    },
    "teachingPoints": [
      "The two management-changing variables in every distal biceps tear are (1) PARTIAL vs COMPLETE and (2) RETRACTION distance plus LACERTUS FIBROSUS status. Report all three explicitly: partial tears are usually undersurface at the radial-tuberosity footprint (and are managed conservatively first), while a complete tear with retraction is a surgical/anatomic repair.",
      "The lacertus fibrosus is the key tether. An INTACT lacertus limits retraction and can leave the stump near the radial neck despite a FULL rupture - it masks the tear clinically and on imaging (the classic missed complete tear) and changes the surgical approach. A DISRUPTED lacertus, as here, allows proximal retraction and an empty tuberosity. Always state which it is.",
      "Management/disposition pearl: a complete distal biceps avulsion in an active patient is a surgical referral for anatomic repair. Earlier repair is technically easier - frame timing as a GUIDELINE (earlier is better), NOT a hard 2-4-week deadline. Many primary repairs succeed out to roughly 4-6 weeks and beyond; chronic, retracted, irreducible tears that will not reach the tuberosity are the ones that need a graft.",
      "Pitfall: an intact brachialis preserves some elbow flexion and an intact lacertus preserves some gross strength, so the patient may not look as weak as expected - weak SUPINATION and a positive HOOK test are the more reliable clinical clues. Do not let preserved flexion talk you out of a complete tear.",
      "The FABS view (flexion-abduction-supination, prone) profiles the footprint and is the best plane to grade partial-vs-complete and measure retraction; bicipitoradial bursitis is a CLUE to scrutinize the insertion, not a diagnosis. A large distended bursa can also compress the PIN, so check the radial nerve."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm a dedicated FABS view is present to profile the distal biceps footprint, plus axial/coronal/sagittal fluid-sensitive and T1 sequences",
          "The clinical question is anterior - a distal biceps mechanism injury after a pop with weak supination and a positive hook test",
          "Map the symptom to the anterior compartment (biceps), not the medial valgus triad or the lateral instability circle"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "Mild reactive marrow edema at the radial (bicipital) tuberosity at the avulsed footprint",
          "No radial-head or other fracture line, no capitellar OCD, no loose body",
          "No posterior fat-pad sign - argues against an occult intra-articular fracture"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Anterior bundle of the UCL intact to the sublime tubercle with NO T-sign (pertinent negative)",
          "No sublime-tubercle marrow edema or traction spur",
          "This is a flexor-mechanism avulsion, not a valgus-overload injury"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "LUCL, RCL, and annular ligament intact - no posterolateral rotatory instability pattern (pertinent negative)",
          "Coronoid intact, no anteromedial-facet fracture",
          "No radiocapitellar incongruity or post-dislocation impaction"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "COMPLETE distal biceps tear with an EMPTY radial-tuberosity footprint and a balled-up wavy stump, profiled on FABS - the key finding",
          "Retraction approximately 4 cm with a DISRUPTED lacertus fibrosus (the lacertus status and retraction distance are the management-changing variables)",
          "Triceps and common flexor/extensor origins intact; bicipitoradial bursitis as a corroborating clue"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Radial nerve / PIN normal at the radiocapitellar level - no compression by the distended bicipitoradial bursa (pertinent negative to check)",
          "Ulnar and median nerves normal in caliber and signal",
          "No muscle denervation edema"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Bicipitoradial bursa distended with fluid/hematoma at the footprint",
          "Small radiocapitellar/ulnotrochlear effusion; cartilage preserved",
          "No loose body or radiocapitellar plica"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "No mass, ganglion, or marrow-replacement red flag - the distended bursa is reactive, not a tumor",
          "Confirm the surgically relevant injury: a complete distal biceps avulsion with a disrupted lacertus and ~4 cm retraction",
          "Single management-changing line: prompt orthopedic referral for anatomic repair; earlier is technically easier (a guideline, not a hard deadline), and a chronic irreducible tear needs graft"
        ]
      }
    ],
    "residentVisible": true
  },
  {
    "id": "elbow-lateral-epicondylitis-lucl",
    "title": "Lateral Epicondylitis + Partial Common Extensor / LUCL Tear",
    "difficulty": "foundational",
    "tier": "core",
    "clinicalScenario": "A 45-year-old recreational tennis player presents with chronic lateral elbow pain refractory to a dedicated rehabilitation program, tender over the lateral epicondyle. The clinical question is the grade of common-extensor pathology and, critically, whether the adjacent lateral ulnar collateral ligament is involved.",
    "keyDiagnoses": [
      "Common extensor origin (ECRB) tendinosis with a deep partial-thickness tear (lateral epicondylitis)",
      "Deep common-extensor tear undercutting/communicating with the radiocapitellar joint and INVOLVING the lateral ulnar collateral ligament (LUCL) — the PLRI-implying lesion",
      "Posterolateral rotatory instability (PLRI) pattern from LUCL incompetence",
      "Reactive lateral-epicondyle marrow edema and thin RCL signal — NOT, by themselves, an LCL tear"
    ],
    "tags": [
      "lateral-epicondylitis",
      "common-extensor-tear",
      "lucl-tear",
      "plri",
      "ligament-reconstruction",
      "tennis-elbow",
      "surgical-referral"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=lateral%20epicondylitis%20common%20extensor%20tendon%20tear",
    "radiopaediaTitle": "Lateral epicondylitis / common extensor tendon tear — Radiopaedia cases",
    "teachingImages": [
      elbowCommonExtensorUsImage
    ],
    "modelReport": {
      "findings": "PROTOCOL: Non-contrast 3T elbow MRI; coronal and axial fluid-sensitive fat-saturated (T2 FS) and T1 sequences. Clinical question: chronic lateral epicondylitis refractory to rehab — grade the common extensor origin and, critically, assess the adjacent LUCL for a deep tear implying posterolateral rotatory instability. The deep common-extensor/LUCL interface is read on coronal + axial together.\n\nBONES & MARROW: Reactive marrow edema is present within the lateral epicondyle at the common extensor origin. This is a reactive change accompanying tendinosis and is NOT, by itself, evidence of a ligament tear. The capitellum, radial head, trochlea, olecranon, and coronoid are otherwise intact — no osteochondral lesion, no fracture line, and no posteromedial olecranon (valgus-extension-overload) osteophyte. No loose body in the coronoid, olecranon, or radiocapitellar recesses.\n\nLIGAMENTS (LATERAL COMPLEX — the key region): The common extensor origin is thickened and T2-hyperintense at the lateral epicondyle. There is a deep, fluid-bright partial-thickness tear at the undersurface of the origin that undercuts toward and communicates with the radiocapitellar joint. Critically, the LATERAL ULNAR COLLATERAL LIGAMENT (LUCL) — which arises deep to the common extensor tendon and arcs posterior to the radial head to the supinator crest — is traced on coronal and axial images and is INVOLVED by this deep tear, with loss of its normal taut low-signal continuity at the humeral origin. The radial collateral ligament (RCL) shows thin reactive signal but no discrete gap; thin RCL signal in this setting is NOT over-called as an isolated LCL tear. The annular ligament around the radial neck is intact. Secondary signs of posterolateral rotatory instability — subtle posterolateral radial subluxation/radiocapitellar incongruity — are sought and, where present, support an instability pattern rather than tendinosis alone.\n\nMEDIAL LIGAMENT: The anterior bundle of the UCL is traced from the medial epicondyle to the sublime tubercle and is intact — uniformly low in signal, no T-sign (no fluid tracking beyond the articular-cartilage edge at the distal attachment), no full-thickness defect. No sublime-tubercle traction spur.\n\nTENDONS: The common extensor (ECRB) origin shows tendinosis with the deep partial-thickness tear described above (not a full-thickness gap with retraction). The common flexor-pronator origin is normal. The distal biceps footprint at the radial tuberosity is intact with an intact lacertus fibrosus; no bicipitoradial bursitis. The triceps insertion on the olecranon is intact with no deep-fiber tear or olecranon flake.\n\nNERVES: The ulnar nerve in the cubital tunnel is normal in caliber and signal relative to the median nerve and shows no flexion subluxation; no anconeus epitrochlearis. The radial nerve/PIN at the arcade of Frohse is unremarkable with no extensor-compartment denervation. No mass or ganglion.\n\nJOINT: Small joint effusion. The radiocapitellar and ulnotrochlear cartilage is preserved. No pathologically thickened radiocapitellar plica. No synovitis. The olecranon bursa is not distended.",
      "impression": "1. Lateral epicondylitis: common extensor (ECRB) origin tendinosis with a DEEP partial-thickness undersurface tear that undercuts and communicates with the radiocapitellar joint.\n2. The deep common-extensor tear extends to the lateral ulnar collateral ligament (LUCL) origin — this is the finding to flag, because it RAISES CONCERN FOR posterolateral rotatory instability (PLRI). Note, however, that MRI LUCL signal abnormality is common in lateral epicondylitis and is usually subclinical: a PLRI diagnosis requires loss of LUCL continuity PLUS secondary signs (radiocapitellar incongruity / posterolateral radial subluxation) PLUS a positive clinical pivot-shift. Recommend orthopedic/elbow-surgery referral with correlation of the pivot-shift exam and secondary signs before committing to a ligament repair/reconstruction (rather than extensor debridement) plan.\n3. Reactive lateral-epicondyle marrow edema and thin RCL signal are present but are NOT independent evidence of an LCL tear and should not be over-called.\n4. Anterior-bundle UCL intact (no T-sign); ulnar, median/AIN, and radial/PIN nerves intact; no loose body, mass, or osteochondral lesion. ('Tennis elbow' here is tendinosis, not inflammation — but a frankly discontinuous LUCL with secondary instability signs is the lesion that changes the plan.)"
    },
    "teachingPoints": [
      "'Tennis elbow' is angiofibroblastic TENDINOSIS of the common extensor origin (ECRB), not an inflammatory process — which is why corticosteroid injection gives only short-term benefit and may worsen long-term outcomes. Grade it as tendinosis vs partial-thickness vs full-thickness, and treat tendinosis/low-grade partials with load-based rehab first.",
      "The management-changing companion is the LUCL: trace it to the supinator crest on EVERY lateral-epicondylitis read. A deep/full-thickness common-extensor tear that undercuts or communicates with the radiocapitellar joint and INVOLVES the LUCL implies PLRI — this shifts the plan from tendon debridement to ligament repair/reconstruction and warrants surgical referral.",
      "Don't over-call the reactive findings: lateral-epicondyle marrow edema and a thin RCL signal routinely accompany lateral epicondylitis and are NOT, by themselves, an LCL tear. Anchor an LUCL/PLRI call to loss of ligament continuity, an undersurface tear deep to the common extensor, and secondary signs (posterolateral radial subluxation/radiocapitellar incongruity) plus the clinical pivot-shift — not edema alone.",
      "PLRI from an undercutting deep extensor/LUCL tear is a classic post-injection and post-lateral-release complication. In a patient who has had prior lateral steroid injections or a release and now has refractory or new mechanical lateral symptoms, specifically interrogate the LUCL for iatrogenic injury.",
      "Disposition: tendinosis and low-grade partial tears are rehab-first (eccentric loading, activity modification; injection is at best temporizing and potentially harmful). A deep extensor tear INVOLVING the LUCL with PLRI is the surgical exception — refer to orthopedics/elbow surgery for ligament repair/reconstruction. Name the single management-changing finding (LUCL involvement) explicitly in the impression."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm non-contrast elbow MRI with coronal AND axial fluid-sensitive sequences — both are needed to trace the deep extensor/LUCL interface",
          "Clinical question is refractory lateral epicondylitis: grade the common extensor AND assess the adjacent LUCL",
          "Map the symptom as lateral (epicondylitis / LCL / PLRI) and confirm any prior injection/release history that raises iatrogenic LUCL suspicion"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "Reactive lateral-epicondyle marrow edema at the common extensor origin — a reactive change, NOT independent evidence of a ligament tear",
          "Capitellum/radial head/trochlea/olecranon/coronoid intact — no capitellar OCD, fracture, or VEO osteophyte",
          "No loose body in the coronoid, olecranon, or radiocapitellar recesses"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Anterior-bundle UCL traced from medial epicondyle to sublime tubercle and intact",
          "NO T-sign — no fluid tracking beyond the articular-cartilage edge at the distal attachment",
          "No sublime-tubercle traction spur or chronic attenuation (excludes a competing medial valgus process)"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "LUCL traced (epicondyle → posterior to the radial head → supinator crest) on coronal + axial and INVOLVED by the deep undersurface extensor tear — the management-changing finding implying PLRI",
          "Deep common-extensor tear undercuts/communicates with the radiocapitellar joint; look for secondary PLRI signs (posterolateral radial subluxation, radiocapitellar incongruity)",
          "Thin RCL reactive signal and an intact annular ligament — do NOT over-call thin RCL signal as an isolated LCL tear; no coronoid anteromedial-facet fracture"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "Lateral (ECRB) common extensor origin: tendinosis with a DEEP partial-thickness undersurface tear (not a full-thickness retracted gap) — trace the LUCL to the supinator crest as the companion",
          "Common flexor-pronator origin normal (medial epicondylitis not present)",
          "Distal biceps footprint intact with intact lacertus; triceps insertion intact with no deep-fiber tear or olecranon flake"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Ulnar nerve normal in caliber/signal vs the median nerve, no flexion subluxation or anconeus epitrochlearis",
          "Radial nerve/PIN at the arcade of Frohse unremarkable with no extensor-compartment denervation (lateral pain is tendinous/ligamentous here, not PIN entrapment)",
          "No mass or ganglion as an occult cause"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Radiocapitellar and ulnotrochlear cartilage preserved; small joint effusion only",
          "No pathologically thickened radiocapitellar plica (>~3 mm) mimicking a loose body / mechanical cause",
          "Olecranon bursa not distended; no synovitis"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "No mass/ganglion, no confluent low-T1 marrow replacement or cortical destruction — no infection/tumor red flags",
          "Confirm the single management-changing finding: a deep common-extensor tear INVOLVING the LUCL → PLRI → ligament repair/reconstruction, not debridement",
          "Disposition: tendinosis/low-grade partials are rehab-first (injection temporizing/potentially harmful); LUCL involvement raises concern for PLRI — flag it, and correlate the pivot-shift exam + secondary instability signs before a reconstruction call"
        ]
      }
    ],
    "residentVisible": true
  },
  {
    "id": "elbow-medial-epicondylitis-ulnar",
    "title": "Medial Epicondylitis with Adjacent Ulnar Neuritis",
    "difficulty": "intermediate",
    "tier": "core",
    "clinicalScenario": "A 50-year-old right-handed recreational golfer reports several months of medial elbow pain that worsens with the golf swing and resisted wrist flexion/pronation, now accompanied by intermittent tingling along the ring and small fingers. Exam shows tenderness just distal to the medial epicondyle over the flexor-pronator origin, a positive Tinel sign over the cubital tunnel, and pain with resisted forearm pronation; there is no frank valgus instability.",
    "keyDiagnoses": [
      "Medial (common flexor-pronator) epicondylitis with a partial-thickness origin tear",
      "Ulnar neuritis in the cubital tunnel (enlarged, T2-hyperintense ulnar nerve)",
      "Intact anterior-bundle ulnar collateral ligament (the third member of the medial triad - interrogated and cleared)",
      "Ulnar nerve without flexion subluxation (stable in the groove)"
    ],
    "tags": [
      "medial-epicondylitis",
      "ulnar-neuritis",
      "cubital-tunnel",
      "flexor-pronator",
      "medial-triad",
      "selective-transposition",
      "medial-elbow-pain"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=medial%20epicondylitis%20ulnar%20neuritis",
    "radiopaediaTitle": "Medial epicondylitis with ulnar neuritis — Radiopaedia cases",
    "teachingImages": [
      elbowCommonFlexorUsImage,
      elbowUlnarNerveUsImage,
      elbowUclUsImage
    ],
    "modelReport": {
      "findings": "PROTOCOL: Non-contrast elbow MRI with axial, coronal, and sagittal fluid-sensitive fat-saturated (T2 FS/STIR) and T1 sequences; contralateral cubital-tunnel axial images obtained for nerve comparison. Clinical question: medial epicondylitis vs ulnar neuritis vs UCL injury (the medial triad) in a golfer with medial pain and ulnar-sided paresthesias.\n\nBONES & MARROW: Mild reactive marrow edema at the medial epicondyle at the common flexor-pronator origin. No sublime-tubercle traction spur or marrow edema. Radiocapitellar joint, capitellum, trochlea, olecranon, and coronoid are normal - no osteochondral lesion, no posteromedial valgus-extension-overload osteophyte, no loose body. No occult fracture; posterior fat pad not displaced.\n\nLIGAMENTS (UCL - the third member of the triad): The anterior bundle of the ulnar collateral ligament is traced on coronal images from the medial epicondyle to the sublime tubercle and is thin, taut, and uniformly low in signal. There is NO surface-reaching defect and NO fluid undercutting the distal fibers beyond the articular-cartilage edge - the T-sign is ABSENT. No chronic attenuation, thickening, or ossification. The lateral collateral/LUCL complex is intact.\n\nTENDONS (flexor-pronator origin - key region): The common flexor-pronator tendon off the medial epicondyle is thickened with intermediate-to-fluid-bright intrasubstance signal and a focal partial-thickness tear at its deep origin; the fibers are NOT fully discontinuous and there is no retraction (medial epicondylitis with a partial-thickness origin tear, not a full-thickness avulsion). The common extensor origin and the distal biceps and triceps are normal.\n\nNERVES (ulnar nerve - key region): The ulnar nerve in the cubital tunnel, immediately posterior to the medial epicondyle and the flexor-pronator origin, is enlarged and T2-hyperintense relative to BOTH the ipsilateral median nerve (internal control) and the contralateral ulnar nerve - a caliber change, not signal alone. There is no discrete mass, ganglion, anconeus epitrochlearis, or osteophyte narrowing the tunnel. On the flexion axial images the nerve remains seated in the retrocondylar groove WITHOUT subluxation over the medial epicondyle; no snapping-triceps medial-head subluxation. Early/subtle T2 signal is noted in the flexor carpi ulnaris, but there is no established fatty atrophy of FCU, the ulnar FDP, or the ulnar intrinsics. The median/AIN and radial/PIN are normal.\n\nJOINT: Trace physiologic effusion. Radiocapitellar and ulnotrochlear cartilage preserved. No synovitis, no pathologic radiocapitellar plica, no olecranon bursitis.",
      "impression": "1. Medial (common flexor-pronator) epicondylitis with a partial-thickness origin tear - thickening, intrasubstance fluid signal, and a focal deep partial tear, NOT a full-thickness avulsion.\n2. Ulnar neuritis in the cubital tunnel: the ulnar nerve is enlarged and T2-hyperintense versus both the ipsilateral median nerve and the contralateral side, with early FCU denervation signal - concordant with the ring/small-finger paresthesias. This concomitant ulnar involvement is the management-changing finding.\n3. The anterior-bundle UCL is intact (T-sign absent) - the third member of the medial triad is cleared; no valgus-instability lesion.\n4. The ulnar nerve is STABLE in the groove without flexion subluxation, and there is no anconeus epitrochlearis or mass. Disposition: this is a REHAB-first picture (activity/swing modification, flexor-pronator and kinetic-chain rehabilitation, nerve hygiene/night extension splinting) - but the documented ulnar neuritis means the ulnar nerve must be addressed in any operative plan, and a subluxating nerve or accessory muscle (neither present here) would specifically shift management toward selective transposition."
    },
    "teachingPoints": [
      "The MEDIAL TRIAD: medial epicondylitis (golfer's elbow), the anterior-bundle UCL, and the ulnar nerve travel together because the cubital tunnel sits immediately posterior to the flexor-pronator origin. When you call medial epicondylitis, do not stop - always interrogate the ulnar nerve AND trace the UCL to the sublime tubercle. Calling 'medial epicondylitis' and stopping is the classic satisfaction-of-search miss.",
      "Anchor the ulnar-neuritis call to STRUCTURE, not signal alone: mild ulnar-nerve T2 hyperintensity occurs in asymptomatic elbows. Make the diagnosis on caliber enlargement + muscle denervation (FCU/ulnar FDP/ulnar intrinsics) + clinical correlation, using the ipsilateral median nerve and the contralateral ulnar nerve as internal controls. Denervation edema is subacute (T2/STIR) and progresses to chronic T1 fatty atrophy - name the phase.",
      "Management/disposition pearl: uncomplicated medial epicondylitis with ulnar neuritis is REHAB-first (swing/activity modification, flexor-pronator and kinetic-chain rehab, nerve hygiene, night extension splinting). The presence of ulnar symptoms changes the OPERATIVE plan if surgery is later needed - the nerve must be addressed, not ignored, when the flexor-pronator origin is debrided.",
      "The single most operative-changing nerve finding is DYNAMIC SUBLUXATION: an ulnar nerve that subluxates over the medial epicondyle in flexion (or a coexisting anconeus epitrochlearis or snapping triceps) favors selective ANTERIOR TRANSPOSITION over in-situ decompression. Assess subluxation on flexion axial images and look for the accessory muscle - it is absent here, so this nerve is stable.",
      "Pitfall: do not overcall the UCL. A couple of millimetres of fluid undercutting the distal UCL can be a normal synovial recess; the abnormal T-sign is fluid tracking BEYOND the articular-cartilage edge. But DO trace it every time - a concomitant UCL tear in a thrower (less so this older golfer) shifts the conversation from rehab toward UCL reconstruction, and transposition with reconstruction is selective (for preoperative ulnar symptoms/instability), not routine."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm non-contrast elbow MRI with axial (for the nerves), coronal (for the UCL/epicondyle origins), and sagittal sequences, plus contralateral cubital-tunnel images for nerve comparison",
          "State the exact question: medial epicondylitis vs ulnar nerve vs UCL - the medial triad - in a golfer with medial pain and ulnar paresthesias",
          "Map the symptom to the MEDIAL compartment (valgus/medial triad), directing a linked UCL + flexor-pronator + ulnar-nerve read"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "Mild reactive marrow edema at the medial epicondyle at the flexor-pronator origin",
          "No sublime-tubercle traction spur and no posteromedial valgus-extension-overload osteophyte",
          "Capitellum/radiocapitellar joint normal - no OCD or loose body; posterior fat pad not displaced"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Anterior-bundle UCL traced from the medial epicondyle to the sublime tubercle is thin, taut, and uniformly low signal",
          "T-sign ABSENT - no fluid undercutting the distal fibers beyond the articular-cartilage edge (pertinent negative; do not overcall a normal recess)",
          "Explicitly links the UCL read to the flexor-pronator origin and the ulnar nerve as the medial triad"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "LUCL/RCL/annular complex intact - no PLRI lesion",
          "No secondary PLRI signs (no posterolateral radial subluxation, radiocapitellar congruent)",
          "Coronoid normal - no anteromedial-facet fracture (pertinent negative in this non-trauma case)"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "Common flexor-pronator origin thickened with intrasubstance fluid signal and a focal deep PARTIAL-thickness tear - medial epicondylitis, NOT a full-thickness avulsion or retraction",
          "Common extensor origin normal - no lateral epicondylitis",
          "Distal biceps and triceps intact"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Ulnar nerve enlarged and T2-hyperintense versus the ipsilateral median nerve AND the contralateral side - caliber change, not signal alone (the key finding)",
          "No flexion subluxation over the medial epicondyle, and no anconeus epitrochlearis, ganglion, osteophyte, or snapping triceps as a cause",
          "Early subacute FCU denervation signal without chronic fatty atrophy; median/AIN and radial/PIN normal"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Radiocapitellar and ulnotrochlear cartilage preserved; only a trace physiologic effusion",
          "No pathologic radiocapitellar plica and no loose body",
          "No olecranon bursitis or synovitis"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "No mass/ganglion in the cubital tunnel as the entrapment cause; no marrow-replacement or soft-tissue red flags",
          "Name the single management-changing finding: concomitant ulnar neuritis alongside the medial epicondylitis (and the absence of nerve subluxation that would otherwise mandate transposition)",
          "Disposition: rehab-first (swing/activity modification, flexor-pronator rehab, nerve hygiene/night splinting); the documented ulnar neuritis means the nerve must be addressed if surgery follows, with selective transposition reserved for a subluxating nerve or accessory muscle"
        ]
      }
    ],
    "residentVisible": false
  },
  {
    "id": "elbow-cubital-tunnel-ulnar-neuritis",
    "title": "Cubital Tunnel Syndrome — Ulnar Neuritis ± Subluxation",
    "difficulty": "intermediate",
    "tier": "core",
    "clinicalScenario": "A 38-year-old recreational thrower presents with several weeks of numbness and tingling in the ulnar two digits (ring and small fingers), worse with sustained elbow flexion such as holding a phone or sleeping with the elbow bent. Tinel sign is positive over the cubital tunnel, the flexion-compression test reproduces the paresthesias, and there is early grip-fatigue but no fixed clawing yet.",
    "keyDiagnoses": [
      "Cubital tunnel syndrome — ulnar neuritis at the medial epicondyle",
      "Dynamic ulnar nerve subluxation over the medial epicondyle in flexion",
      "Anconeus epitrochlearis accessory muscle (structural contributor)",
      "Subacute FCU / ulnar-FDP denervation edema (no fixed fatty atrophy)"
    ],
    "tags": [
      "cubital-tunnel",
      "ulnar-neuritis",
      "nerve-subluxation",
      "anconeus-epitrochlearis",
      "snapping-triceps",
      "transposition",
      "denervation-edema"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=cubital%20tunnel%20syndrome%20ulnar%20neuritis",
    "radiopaediaTitle": "Cubital tunnel syndrome / ulnar neuritis — Radiopaedia cases",
    "teachingImages": [
      elbowUlnarNerveUsImage
    ],
    "modelReport": {
      "findings": "PROTOCOL: Non-contrast 3T elbow MRI with axial, coronal, and sagittal fluid-sensitive (T2 FS/STIR) and T1 sequences; dedicated axial images obtained in elbow FLEXION to interrogate dynamic ulnar-nerve position. Clinical question: cubital tunnel syndrome — define the structural cause and whether the nerve subluxates, since that changes the operation.\n\nBONES & MARROW: Medial epicondyle, trochlea, radial head, capitellum, olecranon, and coronoid are intact without marrow edema, stress line, or osteochondral lesion. No posteromedial olecranon (valgus-extension-overload) osteophyte and no traction spur at the sublime tubercle to crowd the cubital tunnel. No loose body in the dependent recesses.\n\nLIGAMENTS: The anterior bundle of the UCL is thin, taut, and uniformly low signal to the sublime tubercle with no T-sign (fluid beyond the articular-cartilage edge) and no full-thickness gap — pertinent negative in a thrower, since the UCL, flexor-pronator origin, and ulnar nerve travel as the medial valgus triad. The LCL/LUCL complex is intact.\n\nTENDONS: Common flexor-pronator origin off the medial epicondyle shows mild tendinosis without a surface-reaching tear. Common extensor origin, distal biceps footprint, and triceps insertion are intact. Critically, the MEDIAL HEAD OF THE TRICEPS is interrogated for snapping-triceps physiology: on the flexion axial images it tracks normally and does NOT subluxate over the epicondyle with the nerve (pertinent negative — when present it co-subluxates and changes the operation).\n\nNERVES (key region): The ulnar nerve is ENLARGED and T2-hyperintense at and just distal to the medial epicondyle within the cubital tunnel, with loss of the normal fascicular architecture; caliber and signal exceed the ipsilateral MEDIAN nerve (internal control) and the contralateral ulnar nerve. STRUCTURAL CAUSE: an ANCONEUS EPITROCHLEARIS accessory muscle replaces Osborne's retinaculum over the tunnel, reducing the cross-sectional space; no ganglion, and no osteophyte. DYNAMIC FINDING: on the flexion axial series the ulnar nerve SUBLUXATES anteriorly over the apex of the medial epicondyle (it sits posterior to the epicondyle in extension). Secondary sign of denervation: subacute T2/STIR feathery edema within the flexor carpi ulnaris and the ulnar half of the FDP, WITHOUT T1 fatty atrophy — i.e., subacute, not chronic and not hyperacute. The median/AIN and radial/PIN territories are normal with no denervation.\n\nJOINT: Small physiologic effusion. Radiocapitellar and ulnotrochlear cartilage preserved; no synovitis, no pathologically thickened radiocapitellar plica, and no olecranon bursitis.",
      "impression": "1. Cubital tunnel syndrome: an enlarged, T2-hyperintense ulnar nerve at/just distal to the medial epicondyle with subacute FCU and ulnar-FDP denervation edema — concordant with the patient's flexion-provoked ulnar paresthesias and positive Tinel.\n2. A STRUCTURAL cause is present: an anconeus epitrochlearis accessory muscle crowding the tunnel, PLUS dynamic anterior SUBLUXATION of the nerve over the medial epicondyle in flexion — these are the management-changing findings: a subluxating nerve and an accessory muscle favor anterior TRANSPOSITION over simple in-situ decompression.\n3. No snapping triceps (the medial triceps head does not co-subluxate), no ganglion, no osteophyte, and no UCL tear — pertinent negatives that refine the surgical plan.\n4. Denervation is SUBACUTE (T2 edema without fatty atrophy), implying potentially reversible muscle change; correlate with EMG/nerve conduction and clinical severity. First-line for mild/intermittent disease is conservative (activity/flexion avoidance, night extension splinting, nerve glides); the subluxation + accessory muscle is what tips a surgical candidate toward transposition."
    },
    "teachingPoints": [
      "Cubital tunnel syndrome is the SECOND most common compression neuropathy after carpal tunnel — and the most common at the elbow. The MRI job is not just to confirm an enlarged, T2-bright nerve, but to define the STRUCTURAL cause (accessory muscle, ganglion, osteophyte) and the dynamic behavior, because that is what changes the operation.",
      "Management/disposition pearl: the finding that changes the operation is a SUBLUXATING nerve, an accessory muscle (anconeus epitrochlearis), or a co-existing snapping triceps — any of these favors anterior TRANSPOSITION (and the triceps must be addressed if it snaps) over simple in-situ decompression. Always image in flexion and explicitly state whether the nerve subluxates and whether the medial triceps head subluxates with it.",
      "Snapping triceps is the don't-miss companion: the medial head of the triceps can subluxate over the medial epicondyle in flexion together with the ulnar nerve. If you decompress or transpose the nerve but ignore a snapping triceps, the patient keeps snapping — so interrogate the triceps on the flexion images every time you call ulnar subluxation.",
      "Anchor the diagnosis to CALIBER change plus muscle DENERVATION plus clinical correlation — not signal alone. Mild ulnar-nerve T2 hyperintensity occurs in asymptomatic elbows, so compare the nerve to the ipsilateral MEDIAN nerve (internal control) and the CONTRALATERAL ulnar nerve. There is no universal cross-sectional-area cutoff.",
      "Stage the denervation by timing: there is NO MRI change for the first ~2-4 weeks, then SUBACUTE (potentially reversible) T2/STIR muscle edema in FCU and the ulnar FDP, then CHRONIC T1 fatty atrophy. Subacute edema is a subacute, not hyperacute, finding — and fatty atrophy signals later, less reversible disease that raises the urgency of decompression."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm the exact question is a NERVE problem (cubital tunnel/ulnar neuritis), so the read centers on axial sequences and dynamic flexion imaging",
          "Verify dedicated axial images obtained in elbow FLEXION are present — static-extension imaging alone will miss dynamic subluxation",
          "Map the symptom as MEDIAL/posterior and request contralateral comparison for the nerve as an internal reference"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "No osteophyte or sublime-tubercle traction spur crowding the cubital tunnel (a structural cause to actively exclude)",
          "No posteromedial olecranon valgus-extension-overload osteophyte and no loose body",
          "Medial epicondyle and trochlea intact without marrow edema or stress lesion"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Anterior-bundle UCL thin and intact to the sublime tubercle with NO T-sign (fluid beyond the articular-cartilage edge) — pertinent negative in the medial valgus triad",
          "No chronic UCL attenuation, ossification, or sublime-tubercle marrow edema",
          "Reinforces that the medial pain/symptom triad here is nerve-dominant, not a UCL injury"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "LUCL traced to the supinator crest is intact — no PLRI",
          "No coronoid (anteromedial-facet) fracture or post-traumatic instability pattern",
          "Radiocapitellar alignment normal — excludes a competing lateral/instability cause"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "Mild common flexor-pronator (medial epicondyle) tendinosis without a surface-reaching tear",
          "Distal biceps and common extensor origins intact",
          "Interrogate the MEDIAL TRICEPS head for snapping-triceps physiology — here it does NOT co-subluxate with the nerve (key pertinent negative that affects the operation)"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Ulnar nerve ENLARGED and T2-hyperintense at/just distal to the medial epicondyle, exceeding the ipsilateral median nerve and contralateral side — the key finding",
          "Dynamic anterior SUBLUXATION of the nerve over the epicondyle in flexion PLUS an anconeus epitrochlearis accessory muscle — the management-changing structural causes (favor transposition)",
          "Subacute FCU and ulnar-FDP denervation edema WITHOUT fatty atrophy (subacute, not hyperacute); median/AIN and radial/PIN territories normal"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Radiocapitellar and ulnotrochlear cartilage preserved with only a small physiologic effusion",
          "No pathologically thickened radiocapitellar plica and no synovitis",
          "No olecranon bursitis — no septic/aseptic bursa to aspirate"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "Hunt for a ganglion/mass as the entrapment cause — none here; the cause is the accessory muscle plus dynamic subluxation",
          "No confluent low-T1 marrow replacement, cortical destruction, or soft-tissue mass (infection/tumor red flags absent)",
          "Single management-changing summary: a subluxating nerve + anconeus epitrochlearis tips a surgical candidate toward TRANSPOSITION over in-situ decompression; conservative care first-line for mild/intermittent disease"
        ]
      }
    ],
    "residentVisible": false
  },
  {
    "id": "elbow-veo-posteromedial-loose-body",
    "title": "Valgus Extension Overload — Posteromedial Loose Body",
    "difficulty": "advanced",
    "tier": "advanced",
    "clinicalScenario": "A 34-year-old veteran right-handed professional baseball pitcher reports deep posterior elbow pain that is sharpest at ball release (terminal extension), a 10-degree loss of terminal extension, and an intermittent painful catching/locking sensation. He has a long history of high-volume throwing, and on exam there is posteromedial olecranon tenderness, pain on forced extension with valgus (the valgus-extension-overload provocation), and equivocal medial laxity on the moving-valgus test.",
    "keyDiagnoses": [
      "Valgus extension overload (VEO) of the throwing elbow",
      "Posteromedial olecranon osteophyte with posteromedial trochlear chondral wear (kissing lesion)",
      "Intra-articular loose body in the posterior compartment / olecranon fossa",
      "Co-existing ulnar collateral ligament (UCL) insufficiency - the upstream driver"
    ],
    "tags": [
      "valgus-extension-overload",
      "posteromedial-olecranon-osteophyte",
      "loose-body",
      "ucl-insufficiency",
      "thrower-elbow",
      "surgical-referral",
      "posterior-impingement"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=valgus%20extension%20overload%20elbow",
    "radiopaediaTitle": "Valgus extension overload / posteromedial olecranon osteophyte — Radiopaedia cases",
    "modelReport": {
      "findings": "PROTOCOL: Non-contrast 3T elbow MRI of the throwing (right) arm with coronal, axial, and sagittal fluid-sensitive fat-saturated (T2 FS/STIR) and T1 sequences. Clinical question: posterior elbow pain and mechanical catching at ball release in a professional pitcher - valgus extension overload versus a loose body, with the UCL specifically in question. NOTE: sagittal fluid-sensitive images are the workhorse for clearing the dependent recesses for loose bodies; MR arthrography or a valgus-applied adjunct is reserved for if the UCL undersurface remains equivocal.\n\nBONES & MARROW: There is a posteromedial olecranon OSTEOPHYTE projecting from the olecranon tip into the olecranon fossa, with reactive subchondral marrow edema at the posteromedial olecranon and a mirror-image (kissing) marrow change at the posteromedial trochlea/medial wall of the fossa - the impaction signature of valgus extension overload. The radial head, capitellum, and coronoid are intact; no capitellar OCD or osteochondral lesion. At the sublime tubercle there is mild marrow edema and a small traction spur, a bony clue to chronic valgus overload. No acute fracture line.\n\nLIGAMENTS (MEDIAL - read as the valgus triad): The anterior bundle of the UCL is thickened and heterogeneous from the medial epicondyle to the sublime tubercle, consistent with chronic attenuation. At the distal/sublime-tubercle attachment, fluid tracks under the most distal fibers BEYOND the edge of the articular cartilage (a T-sign), indicating a partial undersurface (articular-sided) tear superimposed on chronic change; the proximal fibers remain attached and there is no full-thickness gap or medial extravasation. This UCL insufficiency is the upstream driver of the posteromedial impingement.\n\nLIGAMENTS (LATERAL): The LCL complex including the LUCL traced to the supinator crest is intact and in continuity; radiocapitellar alignment is normal. No secondary signs of posterolateral rotatory instability.\n\nTENDONS: The common flexor-pronator origin shows mild tendinosis without a surface-reaching tear (the medial companion to the UCL injury). The common extensor origin, distal biceps footprint, and triceps insertion on the olecranon are intact; no triceps deep-fiber tear.\n\nNERVES: The ulnar nerve in the cubital tunnel is mildly enlarged with increased T2 signal relative to the median nerve - consistent with low-grade ulnar neuritis, the third member of the valgus-overload triad - but without dynamic subluxation, an anconeus epitrochlearis, or muscle denervation. Median/AIN and radial/PIN territories show no denervation.\n\nCARTILAGE, JOINT & LOOSE BODIES (key region): Posteromedial trochlear/olecranon-fossa chondral wear accompanies the osteophyte. A small joint effusion is present. On sagittal fluid-sensitive images there is a discrete, rounded intra-articular LOOSE BODY in the posterior compartment / olecranon fossa, low in signal against the bright effusion - the mechanical catching source. The coronoid and radial fossae and the radiocapitellar recess were specifically cleared; no additional bodies identified, though small ossified bodies can be undercounted on MRI (CT/CT arthrography is most sensitive for counting them pre-operatively). No pathologically thickened radiocapitellar plica.",
      "impression": "1. Valgus extension overload of the throwing elbow: posteromedial olecranon osteophyte with kissing posteromedial trochlear/olecranon-fossa chondral wear and reactive marrow edema.\n2. Discrete intra-articular LOOSE BODY in the posterior compartment / olecranon fossa - the mechanical catching/locking source; the coronoid and radial fossae and radiocapitellar recess were cleared (CT is more sensitive for counting small ossified bodies pre-op).\n3. CO-EXISTING UCL INSUFFICIENCY - chronic attenuation of the anterior bundle with a distal undersurface (T-sign) partial tear and a sublime-tubercle traction spur. THIS IS THE MANAGEMENT-CHANGING FINDING: the loose body and osteophyte explain the catching, but the underlying UCL laxity is the upstream driver and MUST be addressed - isolated debridement/osteophyte excision without accounting for the UCL can unmask or worsen valgus instability.\n4. Low-grade ulnar neuritis without subluxation or denervation, completing the valgus-overload triad.\n5. Recommend sports-medicine/elbow-surgery referral. Disposition is loose-body removal and judicious osteophyte management (preserving native olecranon to avoid increasing UCL strain), with the UCL and the throwing kinetic chain explicitly assessed and managed in the same decision."
    },
    "teachingPoints": [
      "Valgus extension overload is a CHAIN, not a single lesion: repetitive throwing valgus overloads the UCL, and the resulting medial laxity lets the posteromedial olecranon impact the olecranon-fossa wall in terminal extension, producing the posteromedial osteophyte, kissing chondral wear, and ultimately a loose body. Read the whole chain, starting upstream at the UCL.",
      "The management-changing pearl: the loose body and osteophyte cause the catching, but the UCL is the keystone. Debriding the osteophyte or removing the loose body WITHOUT addressing UCL insufficiency can UNMASK or WORSEN valgus instability - and over-resecting the posteromedial olecranon itself increases UCL strain. Always grade the UCL (T-sign? full-thickness? chronic attenuation?) before signing off a 'simple loose body.'",
      "Hunt loose bodies systematically on SAGITTAL fluid-sensitive images, sweeping the dependent recesses - olecranon fossa (classic in VEO), coronoid fossa, and radiocapitellar recess - against bright joint fluid. Know the limit of the modality: MRI undercounts small ossified bodies, so when an exact pre-operative count matters, CT or CT arthrography is more sensitive.",
      "Context changes the differential for the same loose-body pattern: in a THROWER it is valgus extension overload (UCL -> posteromedial impingement -> osteophyte/loose body), but in a NON-thrower or laborer the identical olecranon-fossa loose body and tip osteophytes are usually PRIMARY OA - a different counseling and surgical conversation, without the UCL-reconstruction overlay.",
      "Complete the medial triad in every thrower: UCL + flexor-pronator origin + ulnar nerve travel together. Document the ulnar neuritis and any flexor-pronator tendinosis, but anchor the ulnar-nerve call to caliber change plus denervation plus clinical correlation, not mild T2 signal alone - and note that concurrent ulnar nerve transposition with UCL surgery is selective, for pre-operative ulnar symptoms or instability, not routine."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm the THROWING (right) elbow with coronal, axial, and sagittal fluid-sensitive sequences - sagittal is essential for the loose-body sweep",
          "The exact question is posterior pain and mechanical catching at ball release: valgus extension overload vs a loose body, with the UCL specifically in question",
          "Map the symptom as posterior (VEO/olecranon) AND medial (valgus triad) - do not stop at one compartment"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "Posteromedial olecranon OSTEOPHYTE with reactive subchondral edema and a kissing posteromedial trochlear/fossa marrow change - the VEO impaction signature",
          "Sublime-tubercle marrow edema and a small traction spur (bony clue to chronic valgus overload)",
          "Pertinent negative: no capitellar OCD, no radial-head fracture; sweep the coronoid/olecranon fossae and radiocapitellar recess for loose bodies (found posteriorly here)"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Chronically thickened/attenuated anterior-bundle UCL with a distal undersurface T-sign (fluid tracking beyond the articular-cartilage edge at the sublime tubercle) - partial undersurface tear, the UPSTREAM DRIVER",
          "No full-thickness gap, retraction, or medial extravasation",
          "Explicitly link to the flexor-pronator origin and ulnar nerve - this is the finding that converts a 'simple loose body' into a UCL-aware operation"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "LUCL traced to the supinator crest is intact and in continuity; normal radiocapitellar alignment - pertinent negative for PLRI",
          "No coronoid anteromedial-facet fracture and no terrible-triad pattern (non-traumatic thrower)",
          "No Osborne-Cotterill impaction or heterotopic ossification"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "Mild common flexor-pronator tendinosis (medial companion to the UCL injury) without a surface-reaching tear",
          "Triceps insertion on the olecranon intact - pertinent negative for a deep-fiber tear given posterior pain",
          "Distal biceps footprint and common extensor origin intact"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Mild ulnar-nerve enlargement and T2 hyperintensity vs the median nerve - low-grade ulnar neuritis completing the valgus triad",
          "No dynamic flexion subluxation, anconeus epitrochlearis, or ulnar-innervated muscle denervation",
          "Median/AIN and radial/PIN territories normal"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Posteromedial trochlear/olecranon-fossa chondral wear with a small joint effusion",
          "Discrete intra-articular LOOSE BODY in the posterior compartment/olecranon fossa, low signal against bright fluid on sagittal images - the catching source",
          "No pathologically thickened radiocapitellar plica mimicking a loose body; no olecranon bursitis"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "No mass/ganglion and no low-T1 marrow replacement or cortical destruction - infection/tumor red flags excluded",
          "Name the single management-changing finding: the co-existing UCL insufficiency that must be addressed alongside loose-body removal/osteophyte management",
          "Disposition: elbow-surgery referral for loose-body removal with UCL-aware, kinetic-chain management - avoid isolated posteromedial over-resection that increases UCL strain"
        ]
      }
    ],
    "residentVisible": false
  },
  {
    "id": "elbow-occult-radial-head-fracture",
    "title": "Occult Radial Head Fracture vs Normal Variant (Pseudodefect)",
    "difficulty": "intermediate",
    "tier": "core",
    "clinicalScenario": "A 30-year-old presents after a fall on the outstretched hand (FOOSH) with lateral elbow pain, tenderness over the radial head, and painful, mechanically limited forearm pronation/supination. Radiographs show a displaced posterior fat-pad sign (elbow effusion/hemarthrosis) but no definite fracture line. MRI is requested to confirm an occult fracture and exclude an osteochondral lesion.",
    "keyDiagnoses": [
      "Non-displaced radial head/neck fracture (occult on radiograph)",
      "Hemarthrosis with a displaced posterior fat-pad sign",
      "Capitellar pseudodefect and transverse trochlear ridge — normal variants (NOT osteochondral lesions)",
      "No mechanical block to forearm rotation and no comminution (non-operative Mason I pattern)"
    ],
    "tags": [
      "occult-radial-head-fracture",
      "posterior-fat-pad-sign",
      "pseudodefect",
      "trochlear-ridge",
      "normal-variant",
      "mason-framework",
      "foosh"
    ],
    "radiopaediaUrl": "https://radiopaedia.org/search?lang=us&scope=cases&q=occult%20radial%20head%20fracture",
    "radiopaediaTitle": "Occult radial head fracture (fat-pad sign) — Radiopaedia cases",
    "teachingImages": [
      elbowRadialHeadUsImage
    ],
    "modelReport": {
      "findings": "PROTOCOL: Non-contrast elbow MRI with T1 and fluid-sensitive fat-suppressed (T2 FS/STIR) sequences in coronal, sagittal, and axial planes. Clinical question: occult fracture in an adult after a FOOSH with a displaced posterior fat-pad sign on radiograph and no visible fracture line; exclude an osteochondral lesion.\n\nBONES & MARROW: There is a non-displaced, obliquely oriented FRACTURE LINE through the radial head extending into the proximal radial neck, low-signal on T1 with surrounding fat-suppressed-bright marrow EDEMA on the fluid-sensitive sequences. The line reaches the articular surface but the fragments are anatomically aligned without a step-off or depression. Importantly, this is a true fracture (a discrete LINE plus marrow edema), not merely a bone bruise (which would show edema WITHOUT a line). The capitellum, trochlea, olecranon, and coronoid show no fracture line or marrow edema. The radiocapitellar line (central long axis of the radial neck) bisects the capitellum on every plane — no radial-head subluxation/dislocation (no occult Monteggia).\n\nNORMAL VARIANTS — DO NOT OVERCALL: The posterolateral capitellar bare-area groove (the PSEUDODEFECT of the capitellum) is seen at the capitellum–lateral-epicondyle junction and is a normal contour, NOT an osteochondral lesion — there is no fluid-undercut fragment, no subchondral cyst, and no cartilage breach to suggest capitellar OCD. The transverse TROCHLEAR RIDGE/groove is likewise a normal osseous landmark and must not be called a fracture or osteochondral defect.\n\nLIGAMENTS: The anterior bundle of the ulnar collateral ligament is intact to the sublime tubercle with no T-sign (no fluid tracking beyond the articular-cartilage edge). The lateral ulnar collateral ligament and radial collateral/annular ligament complex are intact; no secondary signs of posterolateral rotatory instability and no posterolateral capitellar (Osborne–Cotterill) impaction.\n\nTENDONS: Common extensor and common flexor-pronator origins are normal without tendinosis or tear. Distal biceps and triceps insertions are intact.\n\nNERVES: Ulnar nerve in the cubital tunnel is normal in caliber and signal; median/AIN and radial/PIN territories show no muscle denervation edema.\n\nJOINT, CARTILAGE & CAPSULE: There is a moderate joint EFFUSION/hemarthrosis distending the capsule and displacing the posterior fat pad out of the olecranon fossa — the imaging correlate of the radiographic fat-pad sign. Radiocapitellar and ulnotrochlear cartilage are intact. No intra-articular loose body in the coronoid fossa, olecranon fossa, or radiocapitellar recess; no thickened radiocapitellar plica.",
      "impression": "1. Non-displaced occult RADIAL HEAD/NECK fracture (fracture line + marrow edema) with a hemarthrosis displacing the posterior fat pad — confirming the radiographic fat-pad sign. A displaced posterior fat pad after trauma with a normal radiograph is an occult intra-articular fracture (radial head most common in adults) until proven otherwise; MRI confirms it and distinguishes a true fracture (line + edema) from a bone bruise (edema only).\n2. The capitellar PSEUDODEFECT and the transverse TROCHLEAR RIDGE are NORMAL VARIANTS — not osteochondral lesions; no capitellar OCD.\n3. MANAGEMENT-CHANGING LINE: there is NO mechanical block to forearm rotation, no displaced articular fragment impeding motion, and no comminution — this is a stable, non-displaced (Mason I) pattern appropriate for NON-OPERATIVE management (early protected range of motion). The operative trigger would be a mechanical block to rotation, an articular fragment displaced enough to impede motion, or comminution of the whole head (Mason III) — NOT the 2 mm number alone.\n4. Ligaments (UCL, LCL/LUCL) and tendons intact; no instability pattern. (In a child, the same fat pad would prompt a dedicated search for the non-union-prone lateral condyle/Salter-Harris IV fracture.)"
    },
    "teachingPoints": [
      "A displaced posterior fat-pad sign with a normal radiograph is an OCCULT INTRA-ARTICULAR FRACTURE until proven otherwise — in an adult after a FOOSH, the radial head is the most common culprit. Do not 'reassure away' an effusion just because no line is visible on plain film; image it or treat it as a fracture.",
      "MRI earns its keep by distinguishing a TRUE FRACTURE (a discrete low-signal LINE plus marrow edema) from a BONE BRUISE (marrow edema WITHOUT a line). That distinction changes immobilization, follow-up, and counseling on healing time.",
      "The don't-overcall counterpoint: the capitellar PSEUDODEFECT (posterolateral bare-area groove) and the transverse TROCHLEAR RIDGE are normal variants — calling either an osteochondral lesion or fracture sends a patient down an unnecessary surgical pathway. Capitellar OCD requires a fluid-undercut fragment, a sizeable/multiple subchondral cyst (the 5 mm figure is knee-derived, not validated for the capitellum), a cartilage breach, or a displaced fragment — none of which a pseudodefect has.",
      "The radial-head SURGICAL TRIGGER is functional, not a single number: a mechanical BLOCK to forearm rotation, an articular fragment displaced enough to impede motion, or comminution of the whole head (Mason III). The '2 mm' figure alone does not mandate surgery — many minimally displaced Mason I/II fractures without a block are managed non-operatively with early motion.",
      "Run the radiocapitellar line on every projection/plane (it must bisect the capitellum) to avoid missing an occult Monteggia, and in CHILDREN convert the same fat-pad sign into a dedicated hunt for the non-union-prone lateral condyle (Salter-Harris IV) fracture — a classic pediatric miss with very different stakes."
    ],
    "searchPatternFindings": [
      {
        "step": 1,
        "stepName": "Verify Protocol & Clinical Question",
        "expectedFindings": [
          "Confirm a non-contrast elbow MRI with T1 and fluid-sensitive (T2 FS/STIR) coronal, sagittal, and axial sequences — T1 to show the occult fracture line, fluid-sensitive to show marrow edema",
          "State the exact question: occult fracture after a FOOSH with a displaced posterior fat-pad sign and no visible radiographic line",
          "Map the symptom as lateral/mechanical (radial head, painful forearm rotation) to steer the search; an MR arthrogram is not needed for this question"
        ]
      },
      {
        "step": 2,
        "stepName": "Bones, Marrow & Osteochondral",
        "expectedFindings": [
          "Non-displaced radial head/neck FRACTURE LINE (low T1) with surrounding fat-suppressed-bright marrow edema — a true fracture, not a bone bruise (edema only)",
          "Pertinent negative: capitellar pseudodefect and transverse trochlear ridge are NORMAL — not osteochondral lesions or fractures",
          "Radiocapitellar line bisects the capitellum (no occult Monteggia); in a child, specifically clear the non-union-prone lateral condyle fracture"
        ]
      },
      {
        "step": 3,
        "stepName": "Medial Ligament — UCL & Valgus Overload",
        "expectedFindings": [
          "Anterior-bundle UCL intact to the sublime tubercle",
          "No T-sign — no fluid tracking beyond the articular-cartilage edge at the distal attachment",
          "No sublime-tubercle marrow edema or traction spur to suggest valgus overload"
        ]
      },
      {
        "step": 4,
        "stepName": "Lateral Ligament — LCL Complex, PLRI & Coronoid",
        "expectedFindings": [
          "LUCL, RCL, and annular ligament intact — no posterolateral rotatory instability after this FOOSH",
          "Coronoid (including the anteromedial facet) intact — no varus posteromedial rotatory instability pattern and no terrible-triad components",
          "No Osborne–Cotterill posterolateral capitellar impaction or heterotopic ossification"
        ]
      },
      {
        "step": 5,
        "stepName": "Tendons — Biceps, Triceps & Epicondyle Origins",
        "expectedFindings": [
          "Distal biceps and triceps insertions intact — no partial/complete tear or retraction",
          "Common extensor (ECRB) and common flexor-pronator origins normal — no epicondylitis",
          "No flexor-pronator or extensor muscle strain"
        ]
      },
      {
        "step": 6,
        "stepName": "Nerves — Ulnar, Median / AIN, Radial / PIN",
        "expectedFindings": [
          "Ulnar nerve normal in caliber/signal in the cubital tunnel; no flexion subluxation",
          "No median/AIN or radial/PIN muscle denervation edema to suggest entrapment",
          "Pertinent negative: a radial-head/neck fracture sits near the PIN — confirm no secondary nerve involvement"
        ]
      },
      {
        "step": 7,
        "stepName": "Cartilage, Joint, Capsule, Bursa & Synovium",
        "expectedFindings": [
          "Moderate joint effusion/hemarthrosis distending the capsule and displacing the posterior fat pad — the correlate of the radiographic fat-pad sign",
          "Radiocapitellar and ulnotrochlear cartilage intact; no intra-articular loose body in the dependent recesses",
          "No thickened radiocapitellar plica and no olecranon bursitis"
        ]
      },
      {
        "step": 8,
        "stepName": "Masses, Management Review & Red Flags",
        "expectedFindings": [
          "No mass/ganglion, no confluent low-T1 marrow replacement or cortical destruction — no infection/tumor red flag",
          "Confirm the single management-changing point: stable non-displaced (Mason I) radial-head fracture with NO mechanical block, displaced articular fragment, or comminution → non-operative with early protected motion",
          "Disposition: the operative trigger is a mechanical block to rotation, an articular fragment impeding motion, or Mason III comminution — not 2 mm alone; do not overcall the pseudodefect/trochlear ridge as a lesion"
        ]
      }
    ],
    "residentVisible": true
  }
];
