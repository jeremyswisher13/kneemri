import type { TopicFlashcards } from "@/content/flashcards/module-flashcards";

/**
 * Hip MRI spaced-repetition flashcards, keyed by hip module id + topicIndex.
 */
export const hipModuleFlashcards: Record<string, TopicFlashcards[]> = {
  "hip-mri-basics": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-hip-mri-basics-t0-1",
          question: "Large-FOV pelvis screen vs small-FOV dedicated hip — which for which question?",
          answer: "Large-FOV screen for bilateral/referred problems (insufficiency fractures, sacroiliitis, occult marrow lesions, unclear pain source) and the contralateral hip. Small-FOV dedicated hip for intra-articular detail (labrum, cartilage, cam/pincer/FAI). A screen will underdiagnose labral/chondral disease.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-hip-mri-basics-t1-1",
          question: "Which MRI plane is essential for measuring the alpha angle, and what is the cam-morphology threshold?",
          answer: "Oblique-axial along the femoral neck (or radial reformats), which lays the anterosuperior head-neck junction flat. Alpha angle >55 degrees indicates cam morphology. Never measure it on a standard true-axial slice.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-hip-mri-basics-t3-1",
          question: "How do you prove a bright marrow signal is benign fat rather than pathology?",
          answer: "Pair T1 with a fat-sat sequence: fat is bright on T1 and drops out (goes dark) on fat-sat/STIR. A signal that stays bright on fat-sat is not fat and must be characterized. A confluent low-T1 lesion darker than muscle/disc is a tumor red flag.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-hip-mri-basics-t4-1",
          question: "When does MR arthrography change hip management versus non-contrast MRI?",
          answer: "Order MRA when a labral/chondral finding would push toward arthroscopy or alter the operative plan (FAI, suspected labral detachment/chondral delamination). For marrow (stress fracture, AVN, tumor), tendon/muscle, or advanced OA questions, non-contrast suffices and MRA adds a needle with no payoff.",
        },
      ],
    },
  ],
  "hip-anatomy": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-hip-anatomy-t0-1",
          question: "On hip MRI, where do most pathologic labral tears and FAI rim chondral injuries occur, and why does location matter for management?",
          answer: "At the anterosuperior chondrolabral junction (weight-bearing zone). Anterosuperior disruption with adjacent cartilage delamination drives surgical weighting in FAI; the same-appearing cleft posteroinferiorly is usually a benign sublabral sulcus.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-hip-anatomy-t1-1",
          question: "What is the zona orbicularis and what is the classic pitfall?",
          answer: "A normal circular low-signal capsular condensation that waists the femoral neck on coronal images. The pitfall is mistaking it for a capsular tear or paralabral cyst and over-referring a normal hip.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-hip-anatomy-t3-1",
          question: "What MRI-based threshold for a proximal hamstring origin tear triggers surgical referral?",
          answer: "A commonly used surgical-referral threshold is a complete 3-tendon avulsion, or a 2-tendon avulsion with >2 cm retraction, especially in an active patient. Lesser tears usually begin with rehabilitation but may still merit referral when symptoms persist. Always report tendon count, retraction distance, chronicity, and sciatic-nerve findings.",
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: "fc-hip-anatomy-t5-1",
          question: "How do you distinguish a benign herniation pit from concerning pathology on hip MRI?",
          answer: "A herniation (fibrocystic) pit is a small, corticated, T2-bright/T1-dark cyst at the anterosuperior femoral neck — often incidental but associated with cam FAI. If symptomatic, look for cam morphology (alpha angle >55°); it is not a marrow-replacing lesion.",
        },
      ],
    },
  ],
  "hip-search-pattern": [
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-hip-search-pattern-t1-1",
          question: "In the 7-step hip/pelvis search pattern, why is bone/marrow read as step 2 rather than last?",
          answer: "The disposition-changing lesions hide in bone/marrow — tension-side neck fracture, AVN, SIFK, confluent low-T1 marrow. Reading them early (while attention is freshest) instead of at the fatigued end of the study prevents the highest-stakes miss. Use both T1 (marrow replacement) and fluid-sensitive (edema/fracture line).",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-hip-search-pattern-t2-1",
          question: "On which plane is the alpha angle measured, and what value is abnormal?",
          answer: "Oblique-axial along the femoral neck (or radial reformats); alpha angle >55 degrees is abnormal (cam morphology). A routine axial foreshortens the neck and misrepresents the bump — confirm the dedicated oblique-axial/radial images exist before reporting a number.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-hip-search-pattern-t4-1",
          question: "Name the four classic satisfaction-of-search traps on hip/pelvis MRI and the defeat tactic.",
          answer: "Tension-side (superolateral) femoral-neck stress fracture, sacral/pubic ramus insufficiency fracture, pubic symphysis (secondary cleft/athletic pubalgia), and marrow (confluent low-T1 darker than muscle/disc = tumor; adult atraumatic lesser-trochanter avulsion = pathologic-fracture red flag). Defeat with a deliberate second bone/marrow + pelvic-ring pass after the soft-tissue read.",
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: "fc-hip-search-pattern-t5-1",
          question: "How does the presence or absence of a subchondral fracture line change hip management?",
          answer: "No fracture line = transient bone marrow edema = rehab. A subchondral fracture line (SIFK) carries collapse risk and is urgent; a superolateral femoral-neck line is a surgical emergency. The fracture line is the hinge between conservative and surgical management.",
        },
      ],
    },
  ],
  "hip-bones-stress": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-hip-bones-stress-t0-1",
          question: "On hip MRI, which femoral-neck stress fracture location is a surgical emergency, and what is the immediate management?",
          answer: "A TENSION-side (superolateral) fracture line — high risk of completion/displacement and AVN. Make the patient non-weight-bearing and obtain urgent orthopedic referral for fixation. Infero-medial (compression) lines are lower risk and managed with protected weight-bearing.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-hip-bones-stress-t1-1",
          question: "What MRI finding marks the ARCO pre-collapse to post-collapse transition in femoral-head AVN, and why does it matter?",
          answer: "The subchondral fracture / crescent sign (ARCO II→III). Pre-collapse hips (I–II) are candidates for joint-preserving treatment (core decompression); post-collapse hips (III–IV) generally progress to arthroplasty. Always check the contralateral hip.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-hip-bones-stress-t2-1",
          question: "How do you distinguish transient BME syndrome (BMES) from AVN and SIFK on MRI?",
          answer: "BMES = diffuse homogeneous marrow edema of the head/neck with NO subchondral fracture line, NO necrotic segment, and NO double-line sign; it is self-limiting. AVN shows a geographic lesion with a double-line sign; SIFK shows a subchondral low-signal fracture line with collapse risk.",
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: "fc-hip-bones-stress-t5-1",
          question: "A young female athlete has a sacral ala stress fracture on MRI. What additional work-up is essential?",
          answer: "Screen for the female athlete triad / RED-S — relative energy deficiency, menstrual dysfunction, and low bone mineral density — and address bone health, since this underlies the fatigue fracture. In older patients, bilateral ala edema with the Honda/H sign signals an osteoporotic insufficiency fracture.",
        },
      ],
    },
  ],
  "hip-fai-labrum": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-hip-fai-labrum-t0-1",
          question: "In which plane should the alpha angle be measured, and what value defines pathologic cam morphology?",
          answer: "Measure on oblique-axial/radial images angled along the femoral neck (a straight axial under-samples the anterosuperior bump). Alpha angle >55° = pathologic cam; 50–55° borderline; <50° normal. Treat as one input alongside symptoms and a chondrolabral lesion — asymptomatic cam morphology is common.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-hip-fai-labrum-t2-1",
          question: "How do you distinguish a normal sublabral recess from an anterosuperior labral tear on MR arthrogram?",
          answer: "A recess is a smooth-walled cleft at the labral base that parallels the cartilage and does not enter the labral body. A tear shows contrast extending into the labral substance with frayed/blunted margins and secondary signs (paralabral cyst, chondral loss, FAI morphology). Trajectory and margins decide it, not location, since sublabral sulci also occur anterosuperiorly.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-hip-fai-labrum-t3-1",
          question: "What does a paralabral cyst tell you, and what should you do when you see one?",
          answer: "It is a specific secondary sign of an underlying full-thickness labral tear (joint fluid pumped through a one-way valve). Use it as a flag: go back and scrutinize the adjacent labrum for the tear, even if subtle, and note any mass effect on adjacent structures.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-hip-fai-labrum-t4-1",
          question: "Why does rim chondral injury at the chondrolabral junction drive the FAI surgical decision?",
          answer: "It is the strongest imaging predictor of arthroscopic outcome. Reparable delamination/wave sign with an intact labrum favors osteochondroplasty + chondrolabral repair; diffuse full-thickness loss or Tönnis 2–3 joint-space narrowing predicts scope failure and steers toward conservative care or arthroplasty.",
        },
      ],
    },
  ],
  "hip-cartilage-oa": [
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-hip-cartilage-oa-t1-1",
          question: "On MRI, how does cam-shear chondral delamination differ from full-thickness loss, and why does it matter surgically?",
          answer: "Delamination = a deep cartilage-bone cleavage (thin fluid undercutting an intact, normal-thickness anterosuperior surface); full-thickness = a focal defect down to bone. Delaminated flaps are unstable and must be addressed (debridement/fixation) along with cam osteoplasty, or isolated cam correction fails.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-hip-cartilage-oa-t2-1",
          question: "What MRI feature distinguishes a benign subchondral geode from a tumor red flag?",
          answer: "A geode is small, rounded, well-corticated, T2-bright/T1-dark, and sits at the cartilage defect/load point. The red flag is confluent marrow signal lower in T1 than adjacent muscle or disc (marrow replacement): work it up, don't call it OA.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-hip-cartilage-oa-t3-1",
          question: "What cartilage/joint-space threshold shifts a hip from arthroscopy to arthroplasty?",
          answer: "Diffuse circumferential cartilage loss with established joint-space narrowing (Tönnis grade ≥2, space ≤~2 mm), confirmed on a weightbearing radiograph, predicts arthroscopy failure and moves the patient into arthroplasty territory.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-hip-cartilage-oa-t4-1",
          question: "When does MR arthrography with traction improve chondral detection?",
          answer: "When standard MRI is equivocal and you suspect FAI/labral or chondral pathology: traction separates the apposed surfaces so contrast fills defects and undercuts delaminated flaps. Reserve this invasive test for cases where the result changes whether you operate.",
        },
      ],
    },
  ],
  "hip-tendons-muscles": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-hip-tendons-muscles-t0-1",
          question: "Which gluteus medius/minimus tear pattern mandates surgical referral rather than conservative GTPS management?",
          answer: "A full-thickness, retracted abductor tendon tear with fatty muscle atrophy — the 'rotator cuff tear of the hip.' Tendinopathy and low-grade partial tears get PT and image-guided injection.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-hip-tendons-muscles-t1-1",
          question: "What two numbers must a proximal hamstring avulsion report include for surgical planning?",
          answer: "Tendon count (how many of the 3 tendons are torn) and retraction distance from the ischial tuberosity. A 2–3 tendon avulsion retracted >2 cm in an active patient favors surgical repair.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-hip-tendons-muscles-t2-1",
          question: "State the universal muscle-strain grades 1–3 and the key management shift.",
          answer: "Grade 1 = feathery/interstitial edema without architectural fiber disruption, relative rest. Grade 2 = partial tear with fiber discontinuity at the myotendinous junction, PT. Grade 3 = complete rupture ± retraction, consider surgical referral. In adolescents the same mechanism avulses the AIIS apophysis.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-hip-tendons-muscles-t3-1",
          question: "How do you confirm internal snapping hip, and why is MRI often unhelpful?",
          answer: "Internal snapping (iliopsoas over the iliopectineal eminence) is a dynamic diagnosis; resting MRI is frequently normal. Confirm with dynamic ultrasound. Don't blame an incidental labral tear.",
        },
      ],
    },
  ],
  "hip-dont-miss": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-hip-dont-miss-t0-1",
          question: "On femoral-neck stress fracture, which side of the neck makes it a surgical emergency, and what do you do?",
          answer: "A fracture line on the SUPEROLATERAL (tension) side is unstable and a surgical emergency — make the patient non-weight-bearing and obtain urgent ortho referral. Compression-side (inferomedial) fractures are managed with protected weight-bearing.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-hip-dont-miss-t1-1",
          question: "In femoral-head AVN, which MRI finding separates joint-preserving surgery from arthroplasty?",
          answer: "The subchondral fracture / crescent sign with loss of sphericity. Pre-collapse hips (intact contour, double-line sign only) can be offered core decompression; once the subchondral fracture/collapse appears, the hip trends toward arthroplasty. Check the contralateral hip — AVN is often bilateral.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-hip-dont-miss-t3-1",
          question: "What is the highest-yield T1 check for distinguishing benign marrow from tumor replacement in the hip?",
          answer: "Compare marrow to muscle/disc on T1. Normal red marrow is BRIGHTER than skeletal muscle; confluent marrow that is DARKER than muscle or disc is replaced/abnormal (tumor red flag) and warrants metastatic/myeloma workup. Refer soft-tissue masses (deep, >5 cm, enlarging) to a sarcoma center before any biopsy.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-hip-dont-miss-t4-1",
          question: "Which MRI sign localizes athletic pubalgia, and where is the lesion?",
          answer: "The secondary cleft sign — fluid/contrast tracking inferolaterally from the pubic symphysis — localizes a microtear of the rectus abdominis–adductor longus aponeurosis at the pubic attachment. The hip joint typically looks normal; a dedicated symphysis protocol is needed. Most cases respond to a core/adductor rehab program.",
        },
      ],
    },
  ],
};
