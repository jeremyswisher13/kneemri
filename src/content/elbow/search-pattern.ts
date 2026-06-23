import type { SearchPatternStep } from "@/types/content";

/**
 * Elbow MRI systematic search pattern (8 steps).
 * Bones/marrow early; the medial "valgus triad" (UCL + flexor-pronator + ulnar
 * nerve) and the post-traumatic "lateral circle" (LUCL → coronoid → radial head)
 * are read as linked groups so a tendinopathy never ends the search.
 * Authored from an adversarially MSK-verified blueprint (radiology + sports-med lenses).
 */
export const elbowSearchPatternSteps: SearchPatternStep[] = [
  {
    number: 1,
    name: "Verify Protocol & Clinical Question",
    shortName: "Verify",
    description:
      "Confirm side, protocol, and the planes/sequences you actually have, then let the symptom location steer the read before you narrow your attention.",
    checklistItems: [
      "Confirm correct patient, side, and any comparison / contralateral imaging",
      "Identify protocol: non-contrast vs MR arthrogram; is a FABS view present for the distal biceps?",
      "Inventory planes and sequences (axial, coronal, sagittal, FABS; T1, PD/T2 FS, STIR) and note artifact",
      "State the exact question: UCL vs medial epicondylitis vs ulnar nerve vs OCD vs distal biceps vs post-trauma instability",
      "Map the symptom: medial (valgus triad), lateral (epicondylitis / LCL / PLRI), anterior (biceps), posterior (triceps / olecranon / valgus-extension overload), or mechanical (loose body / plica)",
    ],
    pearls: [
      "Coronal answers the UCL, the epicondyle origins, and the radiocapitellar (OCD) face; axial answers the nerves; sagittal answers loose bodies and the anterior-to-posterior extent of an OCD. Confirm a finding in ≥2 planes.",
      "MR arthrography earns its place only when it will change the decision — confirming a partial undersurface UCL tear (T-sign), judging OCD stability, or counting loose bodies. Non-contrast 3T answers most cases.",
    ],
  },
  {
    number: 2,
    name: "Bones, Marrow & Osteochondral",
    shortName: "Bones",
    description:
      "Sweep the radial head, capitellum, trochlea, olecranon, and coronoid first — T1 for marrow replacement, fluid-sensitive for edema and fracture lines. Tie every edema signal to a line, physis, cyst, or fragment.",
    checklistItems: [
      "Radial head, capitellum, trochlea, olecranon, coronoid: marrow edema tied to a fracture line, physis, cyst, or fragment",
      "Capitellar OCD vs Panner; judge OCD stability (fluid undercutting the fragment, sizeable or multiple subchondral cysts, cartilage breach, displaced fragment) — read on CORONAL + SAGITTAL together",
      "Thrower stress: medial epicondyle apophysis (Little League elbow), olecranon stress reaction vs fracture / persistent physis, posteromedial olecranon (valgus-extension-overload) osteophyte",
      "Occult fracture (posterior fat-pad sign; lateral condyle in children); use CRITOE and the radiocapitellar line",
      "Sweep the coronoid + olecranon fossae and the radiocapitellar recess for loose bodies; in a non-thrower, consider primary OA as the source",
    ],
    pearls: [
      "Stability changes management in capitellar OCD: a T2-bright line undercutting the fragment, a sizeable/multiple subchondral cysts, a breached cartilage surface, or a displaced fragment/loose body all argue unstable → surgical referral. (The 5 mm cyst figure is a knee-derived criterion, not validated for the capitellum — teach 'sizeable or multiple.')",
      "Panner disease is the younger child (≈5–10 yr), is reversible, and spares the surface; OCD is the older adolescent thrower/gymnast with a discrete fragment that can become unstable.",
    ],
  },
  {
    number: 3,
    name: "Medial Ligament — UCL & Valgus Overload",
    shortName: "UCL",
    description:
      "Trace the anterior bundle of the UCL from the medial epicondyle to the sublime tubercle, then read it together with the flexor-pronator origin and the ulnar nerve — the medial 'valgus triad.'",
    checklistItems: [
      "Anterior bundle from the medial epicondyle to the sublime tubercle on coronal",
      "Partial undersurface tear (T-sign: fluid tracking beyond the articular-cartilage edge at the distal attachment) vs full-thickness; record location proximal / mid / distal",
      "Chronic attenuation, thickening, or ossification; sublime-tubercle marrow edema or a traction spur",
      "Link to the flexor-pronator origin and the ulnar nerve — valgus overload injures all three together",
    ],
    pearls: [
      "The T-sign is the partial undersurface tear — fluid/contrast undercuts the most distal fibers at the sublime tubercle. A couple of millimetres of undercutting can be a normal recess; MR arthrography is more sensitive than non-contrast for this.",
      "In a thrower, every medial-pain read is UCL + flexor-pronator origin + ulnar nerve. A concomitant UCL tear shifts a 'medial epicondylitis' diagnosis toward UCL reconstruction.",
    ],
  },
  {
    number: 4,
    name: "Lateral Ligament — LCL Complex, PLRI & Coronoid",
    shortName: "LCL",
    description:
      "Trace the lateral ulnar collateral ligament and the radial collateral / annular ligaments, then read the coronoid and radial head as a post-traumatic circle. Comment on LUCL integrity in EVERY post-dislocation or post-lateral-surgery elbow.",
    checklistItems: [
      "LUCL (epicondyle → posterior to the radial head → supinator crest), RCL, and annular ligament; trace on coronal + axial",
      "Humeral-origin avulsion and the undersurface tear deep to the common extensor; secondary PLRI signs (posterolateral radial subluxation, radiocapitellar incongruity)",
      "Coronoid: the anteromedial-facet fracture (small but unstable → varus posteromedial rotatory instability) and Regan–Morrey height; the terrible-triad pattern",
      "Post-dislocation Osborne–Cotterill posterolateral capitellar impaction and heterotopic ossification",
    ],
    pearls: [
      "A deep/full-thickness common-extensor tear that undercuts toward the radiocapitellar joint and involves the LUCL implies posterolateral rotatory instability → this is a ligament repair/reconstruction problem, not just tendinosis (and a known complication of prior lateral steroid injection or release).",
      "Small does not mean stable at the coronoid: the anteromedial-facet fracture implies varus posteromedial rotatory instability and is surgical; the terrible triad (dislocation + radial head + coronoid) hinges on the coronoid and the LCL.",
    ],
  },
  {
    number: 5,
    name: "Tendons — Biceps, Triceps & Epicondyle Origins",
    shortName: "Tendons",
    description:
      "Grade the distal biceps and triceps for partial vs complete, and the common flexor and extensor origins for tendinosis vs tear — always tracing the adjacent ligament (UCL with medial, LUCL with lateral).",
    checklistItems: [
      "Distal biceps (best on FABS): partial vs complete, retraction in cm, lacertus fibrosus intact vs torn; bicipitoradial bursitis as a clue",
      "Triceps: partial (deep-fiber, report % width) vs complete avulsion ± an olecranon flake fragment",
      "Lateral (ECRB) epicondylitis grade — trace the LUCL to the supinator crest; medial (flexor-pronator) epicondylitis grade — trace the UCL",
      "Apply a grade 1 / 2 / 3 muscle-strain framework to flexor-pronator and extensor strains",
    ],
    pearls: [
      "An empty radial tuberosity with retraction is a complete distal biceps tear — but a complete tear with an INTACT lacertus fibrosus may NOT retract and is the classic mimic; comment on the lacertus, because it informs the surgical approach. Repair timing is a guideline (earlier is technically easier), not a hard deadline.",
      "Don't undercall the triceps: a complete rupture is surgical, and a high-grade partial (commonly >50% width, or any tear with extension weakness against resistance) is repaired.",
    ],
  },
  {
    number: 6,
    name: "Nerves — Ulnar, Median / AIN, Radial / PIN",
    shortName: "Nerves",
    description:
      "Read the three nerves by caliber + signal against an internal control, and let muscle denervation be the localizing secondary sign. Anchor the diagnosis to a structural change, not signal alone.",
    checklistItems: [
      "Ulnar nerve in the cubital tunnel: caliber/signal vs the contralateral side and the ipsilateral median nerve; flexion subluxation; anconeus epitrochlearis; snapping triceps",
      "Median / AIN: isolated pronator-quadratus / FPL / FDP (index–middle) denervation — consider Parsonage–Turner before calling mechanical compression",
      "Radial / PIN at the arcade of Frohse: extensor-compartment denervation (supinator variably spared); radial tunnel = pain with a normal MRI",
      "Use muscle denervation edema (subacute) and fatty atrophy (chronic) as the localizing sign; hunt a mass/ganglion as the cause",
    ],
    pearls: [
      "A structural cause changes the operation: dynamic ulnar-nerve subluxation, an anconeus epitrochlearis, or snapping triceps favor transposition (and the triceps must be addressed) over in-situ decompression.",
      "An AIN palsy is frequently neuralgic amyotrophy (Parsonage–Turner), not mechanical compression → usually no surgery; pivot to EMG/observation. Denervation shows no MRI change for the first ~2–4 weeks, then T2/STIR edema, then chronic T1 fatty atrophy.",
    ],
  },
  {
    number: 7,
    name: "Cartilage, Joint, Capsule, Bursa & Synovium",
    shortName: "Joint",
    description:
      "Trace the radiocapitellar and ulnotrochlear cartilage, characterize effusion/synovitis, and clear the dependent recesses for loose bodies — watching for the plica that mimics them.",
    checklistItems: [
      "Radiocapitellar and ulnotrochlear cartilage; effusion and synovitis",
      "Radiocapitellar plica / posterolateral synovial fold (pathologic when thickened beyond ~3 mm with mechanical symptoms) as a mimic of a loose body or OCD",
      "Olecranon bursitis — aseptic vs septic (aspirate the warm bursa; MRI cannot exclude infection)",
      "Loose bodies in the dependent recesses; primary OA osteophytes at the coronoid and olecranon tips",
    ],
    pearls: [
      "A red/warm/fluctuant olecranon bursa needs aspiration, not just imaging — MRI cannot reliably exclude a septic bursa.",
      "The radiocapitellar plica is a real mechanical cause of lateral catching, but it is also a loose-body/OCD mimic — call it pathologic only when it's thickened (>~3 mm) with concordant mechanical symptoms.",
    ],
  },
  {
    number: 8,
    name: "Masses, Management Review & Red Flags",
    shortName: "Review",
    description:
      "Before you sign off, hunt a mass as the hidden cause, exclude the infection/tumor red flags, and name the single management-changing finding.",
    checklistItems: [
      "Masses / ganglia (often the real entrapment cause); a distended bicipitoradial bursa compressing the PIN",
      "Confluent low-T1 marrow replacement, cortical destruction, or a soft-tissue mass: infection / tumor red flags",
      "Confirm any surgically urgent injury (complete biceps / triceps / UCL / LUCL avulsion, anteromedial coronoid facet, an instability pattern)",
      "Summarize the single management-changing finding: rehab/injection, surgical referral, or urgent escalation",
    ],
    pearls: [
      "When a nerve looks denervated without an obvious tunnel cause, look one more time for a ganglion or mass — it is frequently the surgically treatable cause.",
      "End every read with the disposition, not just the finding: what does this change — continue rehab, inject, refer, or escalate urgently?",
    ],
  },
];
