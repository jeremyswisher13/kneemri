import type { SearchPatternStep } from "@/types/content";

/**
 * Hip & pelvis MRI systematic search pattern (7 steps).
 * Authored + adversarially verified (MSK radiologist / sports-med / curriculum lenses).
 */
export const hipSearchPatternSteps: SearchPatternStep[] = [
  {
    number: 1,
    name: "Verify Protocol & Clinical Question",
    shortName: "Verify",
    description:
      "Confirm side, protocol, arthrogram status, available planes/sequences, and the exact management question before narrowing your attention. Let the symptom location steer the read.",
    checklistItems: [
      "Confirm correct patient, side, and any comparison imaging",
      "Identify protocol: large-FOV pelvis screen vs small-FOV dedicated hip, non-contrast vs MR arthrogram",
      "Inventory planes and sequences: axial, coronal, sagittal, oblique-axial along the neck, T1, PD/T2 FS, STIR",
      "Localize the symptom: anterior/groin, lateral, or posterior/buttock pain",
      "State the management question: rehab, injection, surgical/ortho referral, or urgent escalation",
    ],
    pearls: [
      "Pain location tells you where to spend your time: groin = intra-articular or adductor/symphysis, lateral = abductor/GTPS, posterior = hamstring origin or sacrum.",
      "If FAI or a labral tear is the question, confirm the oblique-axial-along-the-neck images exist before committing to an alpha-angle judgment.",
    ],
  },
  {
    number: 2,
    name: "Bones, Marrow & Stress Injury",
    shortName: "Bones",
    description:
      "Sweep the proximal femur, acetabulum, and pelvic ring first: T1 for marrow replacement, fluid-sensitive (STIR/T2 FS) for edema and fracture lines. This is where the highest-stakes findings hide.",
    checklistItems: [
      "Femoral neck for a stress fracture line, explicitly noting compression (inferomedial) vs TENSION (superolateral) side",
      "Femoral head for a subchondral double-line/serpiginous lesion (AVN) or subchondral insufficiency-fracture line",
      "Diffuse marrow edema pattern: BMES vs AVN vs insufficiency fracture",
      "Apophyses/avulsion sites: ASIS, AIIS, ischial tuberosity, lesser trochanter",
      "Sacrum and pubic rami for insufficiency/stress fracture; T1 review for marrow replacement",
    ],
    pearls: [
      "Tension-side (superolateral) femoral-neck stress fracture = non-weight-bearing and urgent surgical referral; compression-side is usually conservative. Always state the side.",
      "Isolated femoral-head marrow edema is a differential, not a diagnosis: chase a subchondral line, a double-line rim, or a transient pattern before reassuring. A lesser-trochanter avulsion in an adult without trauma is a tumor red flag.",
    ],
  },
  {
    number: 3,
    name: "Cartilage, Joint Surface & Effusion",
    shortName: "Cartilage",
    description:
      "Trace acetabular and femoral cartilage for delamination vs full-thickness loss, assess subchondral change and joint space, and characterize any effusion before turning to the labrum.",
    checklistItems: [
      "Acetabular cartilage, especially anterosuperior, for delamination (undermining fluid cleft) vs full-thickness defect",
      "Femoral head cartilage surface integrity and the central/fovea region",
      "Subchondral cysts and subchondral marrow change as load markers",
      "Joint-space narrowing and osteophytes (early OA staging)",
      "Characterize any effusion/synovitis; in the right clinical setting consider septic arthritis",
    ],
    pearls: [
      "Hip cartilage is thin; early delamination hides under an intact-looking surface and is the case where MR arthrography (with traction) earns its place.",
      "Diffuse cartilage loss and joint-space narrowing predict poor outcomes from labral surgery and shift the referral target from preservation toward arthroplasty.",
    ],
  },
  {
    number: 4,
    name: "Labrum & FAI Morphology",
    shortName: "Labrum & FAI",
    description:
      "Assess the labrum by quadrant, trace any paralabral cyst to its tear, and read the femoral/acetabular morphology (cam/pincer) that drives FAI management. Measure the alpha angle on the oblique-axial neck.",
    checklistItems: [
      "Anterosuperior labrum for a tear; distinguish it from a normal sublabral recess or chondrolabral variant",
      "Paralabral cyst as a secondary sign pointing to an underlying tear",
      "Cam: anterosuperior head-neck bump and elevated alpha angle (>55 degrees) on oblique-axial/radial images",
      "Pincer: crossover sign, coxa profunda, acetabular retroversion/over-coverage (LCEA)",
      "Adjacent acetabular rim cartilage for chondrolabral injury/delamination; note os acetabuli and herniation pit",
    ],
    pearls: [
      "Asymptomatic cam/pincer morphology and labral signal changes are common: report the morphology, but FAI is a clinical-plus-imaging diagnosis.",
      "A paralabral cyst is your cue to hunt for the labral tear you may have skimmed past; the adjacent chondral status, not the tear alone, often drives the surgical decision.",
    ],
  },
  {
    number: 5,
    name: "Abductors, Lateral & Posterior Soft Tissue",
    shortName: "Abductors & Hamstring",
    description:
      "Evaluate the gluteus medius/minimus footprint and peritrochanteric tissues for lateral pain, then the proximal hamstring origin for posterior pain, grading tears and retraction.",
    checklistItems: [
      "Gluteus medius/minimus footprints on the greater trochanter for tendinopathy, partial or full-thickness retracted tear, atrophy/fatty infiltration",
      "Peritrochanteric bursal fluid and ITB / external snapping-hip clues",
      "Proximal hamstring origin at the ischial tuberosity: COUNT tendons involved and measure retraction",
      "Apply muscle-strain grading (1 feathery edema, 2 partial with fluid, 3 complete with retraction)",
      "Sciatic nerve proximity to a retracted hamstring stump",
    ],
    pearls: [
      "Lateral hip pain (GTPS) is usually abductor tendinopathy/tearing, not primary bursitis: name the tendon, because a full-thickness retracted abductor tear is a surgical referral.",
      "For the proximal hamstring, tendon count and retraction distance decide rehab vs surgical referral, so always state both.",
    ],
  },
  {
    number: 6,
    name: "Flexors, Adductors & Pubic Symphysis",
    shortName: "Flexors & Symphysis",
    description:
      "Work through the anterior and groin structures: iliopsoas, rectus femoris/AIIS, adductors, and the pubic symphysis / rectus-adductor aponeurosis.",
    checklistItems: [
      "Iliopsoas: tendinosis, bursa distension, and internal snapping-hip clues",
      "Rectus femoris / AIIS origin: strain, avulsion, or apophyseal injury (direct and indirect heads)",
      "Adductor (especially longus) origin: tendinosis, partial or complete tear",
      "Pubic symphysis: edema, secondary cleft sign, aponeurotic plate disruption (athletic pubalgia)",
      "Differentiate intra-articular groin pain from extra-articular adductor/symphysis sources",
    ],
    pearls: [
      "Athletic pubalgia / core-muscle injury at the rectus-adductor aponeurosis is extra-articular and managed differently from a labral tear: inspect the symphysis on every groin-pain study and do not call the normal central primary cleft pathologic.",
      "Anterior snapping hip is usually the iliopsoas tendon: pair tendinosis with bursa distension and the clinical snap, since the snap itself is a dynamic diagnosis.",
    ],
  },
  {
    number: 7,
    name: "Don't-Miss & Final Management Review",
    shortName: "Don't-Miss",
    description:
      "Run the safety sweep for findings that change disposition today, then translate the whole study into a clear management next step.",
    checklistItems: [
      "Re-check for tension-side femoral-neck stress fracture, occult/insufficiency fracture, and pre-collapse AVN",
      "Effusion + synovitis + periarticular edema: consider septic arthritis (urgent aspiration)",
      "Confluent low-T1 marrow replacement, periosteal reaction, or a soft-tissue mass: consider neoplasm/metastasis",
      "Skeletally immature: SCFE (urgent) and Legg-Calve-Perthes; consider referred pelvic/oncologic pathology",
      "Summarize: rehab/injection candidate, surgical/ortho referral, or urgent escalation",
    ],
    pearls: [
      "Negative radiographs do not exclude an occult or tension-side femoral-neck fracture; MRI is the sensitive test and the disposition can be surgical.",
      "Confluent low-T1 marrow darker than muscle or an intervertebral disc, or a soft-tissue mass, outranks every degenerative finding; do not let satisfaction of search bury it. A subtle adolescent SCFE is non-weight-bearing plus urgent referral.",
    ],
  },
];
