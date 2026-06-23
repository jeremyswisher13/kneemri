import type { ModuleMetadata } from "@/content/modules";

export const shoulderModuleRegistry: ModuleMetadata[] = [
  {
    id: "shoulder-mri-orientation",
    number: 1,
    title: "Shoulder MRI Orientation",
    subtitle: "Protocols, planes, sequences, and clinical framing",
    searchPatternStep: 1,
    estimatedMinutes: 18,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      "Non-contrast MRI versus MR arthrogram",
      "Oblique coronal, oblique sagittal, and axial orientation",
      "Key sequences for cuff, labrum, marrow, and capsule",
      "Primary care sports medicine management questions",
    ],
    learningObjectives: [
      "Differentiate routine shoulder MRI from MR arthrography and recognize when each is useful",
      "Orient shoulder MRI planes relative to the glenoid and rotator cuff",
      "Choose the sequence most useful for cuff tears, marrow edema, labral contrast, or capsular inflammation",
      "Translate the clinical question into a focused but complete MRI search pattern",
    ],
    commonMistakes: [
      {
        mistake: "Treating every shoulder MRI as a generic pain study",
        correction:
          "State the management question first: cuff tear severity, instability pattern, biceps/labrum source, adhesive capsulitis support, arthritis severity, or occult trauma.",
      },
      {
        mistake: "Calling a subtle labral abnormality on non-contrast MRI definitive in an overhead athlete",
        correction:
          "Non-contrast MRI can be limited for labral detail. Use exam, history, and whether MR arthrography would change management.",
      },
    ],
    topicContent: [
      {
        content: `### Non-Contrast MRI vs MR Arthrogram

Routine shoulder MRI is excellent for many primary care sports medicine questions:

- Rotator cuff tendinosis and tear severity
- Subacromial-subdeltoid bursitis
- AC joint degeneration
- Bone marrow edema, occult fracture, and arthritis
- Adhesive capsulitis support findings

MR arthrography can improve evaluation of the labrum, subtle instability lesions, partial-thickness undersurface cuff tears, and postoperative labral anatomy.

For primary care fellows, the key question is whether the added detail would change the next step: rehabilitation, injection, surgical referral, or further imaging.`,
        pearl:
          "If instability or labral pathology is the dominant clinical question and non-contrast MRI is equivocal, MR arthrography is often the next imaging conversation.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/mr-arthrogram-ighl-axillary-pouch-coronal-axial.jpg",
            alt: "MR arthrogram showing intra-articular contrast distending the joint",
            caption:
              "MR arthrogram — intra-articular contrast distends the joint and outlines the capsulolabral structures. Panel A (coronal): contrast filling the dependent axillary pouch beneath the inferior glenohumeral ligament (arrow). Panel B (axial): the anterior and posterior bands of the IGHL outlined by contrast. This added detail is what an arthrogram buys you over non-contrast MRI.",
            attribution: "Kadi R et al., J Belg Soc Radiol 2017;101(Suppl 2):3, Fig 22. PMC6251069. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Shoulder MRI Planes

Shoulder MRI planes are prescribed relative to the glenoid rather than the room:

- **Oblique coronal**: parallel to the supraspinatus tendon; best for supraspinatus/infraspinatus tears and retraction.
- **Oblique sagittal**: parallel to the glenoid face (perpendicular to the supraspinatus tendon); best for cuff muscle bulk, fatty infiltration, and localizing the involved tendon.
- **Axial**: best for labrum, glenohumeral ligaments, biceps groove, subscapularis, and instability lesions.

Develop the habit of saying which plane answers which question before you commit to a diagnosis.`,
        pearl:
          "If you cannot orient the glenoid on axial images, slow down. Most labral and instability errors begin with poor orientation.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/normal-supraspinatus-axial-pdfs.jpg",
            alt: "Normal supraspinatus muscle and tendon on MRI",
            caption:
              "Normal supraspinatus architecture — the muscle has distinct anterior and posterior bellies feeding the tendon (panel a is an accompanying anatomical drawing; panels b and c are the corresponding MRI). Trace the cuff from the musculotendinous junction to the greater-tuberosity footprint.",
            attribution: "Perez Yubran A et al., Insights into Imaging 2024;15:55, Fig 1. PMC10899560. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Sequence Roles

- **Fluid-sensitive fat-suppressed sequences** show edema, bursitis, fluid in cuff defects, and marrow injury.
- **T1-weighted images** show anatomy, marrow replacement, muscle fatty infiltration, and arthrogram contrast if present.
- **Intermediate-weighted/PD sequences** are helpful for tendon morphology and labral signal.

When possible, confirm a suspected finding in at least two planes and on a sequence that matches the tissue question.`,
        pearl:
          "A tendon signal abnormality is more convincing when it changes tendon morphology, reaches a surface, or is associated with bursal/joint fluid.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/t1-vs-pdfs-marrow-comparison-shoulder.jpg",
            alt: "T1 versus fluid-sensitive fat-suppressed MRI of the proximal humerus",
            caption:
              "The same proximal humerus on T1 (A) versus fluid-sensitive fat-suppressed PD (B). On T1, fatty marrow is bright and residual red marrow is intermediate (arrow); on fat-suppressed PD the fat signal is darkened so fluid/edema would stand out bright. Confirm a finding on the sequence that matches the tissue question.",
            attribution: "Kadi R et al., J Belg Soc Radiol 2017;101(Suppl 2):3, Fig 2. PMC6251069. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Primary Care Sports Medicine Lens

Your MRI read should help answer practical clinical decisions:

- Is this a rehab-first pain generator?
- Is there a full-thickness or acute traumatic cuff tear needing timely referral?
- Does instability imaging match the athlete's symptoms?
- Is there adhesive capsulitis support that changes injection or therapy planning?
- Are there red flags: infection, tumor, occult fracture, denervation, or destructive arthropathy?

The course uses this clinical lens throughout: identify the structure, classify severity, and say why it matters.`,
        pearl:
          "A useful shoulder MRI impression is not a laundry list. It prioritizes the finding most likely to change treatment.",
      },
    ],
  },
  {
    id: "shoulder-search-pattern",
    number: 2,
    title: "Shoulder Search Pattern",
    subtitle: "A repeatable read for pain, cuff disease, and instability",
    searchPatternStep: null,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 2, 3, 4],
    topics: [
      "Eight-step shoulder MRI checklist",
      "How to avoid satisfaction-of-search misses",
      "Linking MRI findings to management",
      "Structured shoulder MRI impressions",
      "Common normal variants and pitfalls",
    ],
    learningObjectives: [
      "Apply an eight-step shoulder MRI search pattern to every case",
      "Recognize where missed findings cluster: subscapularis, biceps pulley, posterior labrum, denervation, and AC joint",
      "Use structured language that communicates severity and clinical relevance",
    ],
    commonMistakes: [
      {
        mistake: "Stopping after identifying supraspinatus tendinosis",
        correction:
          "Complete the full pattern. Coexisting biceps pulley lesions, subscapularis tears, adhesive capsulitis, or AC joint edema can be the management-changing finding.",
      },
      {
        mistake: "Reporting 'labral tear' without direction or instability context",
        correction:
          "Name the quadrant and pattern: SLAP, Bankart, ALPSA, Perthes, posterior labral tear, reverse Bankart, or degenerative fraying.",
      },
    ],
    topicContent: [
      {
        content: `### The Eight-Step Pattern

1. Verify protocol and clinical question
2. Bones, alignment, and AC joint
3. Rotator cuff tendons
4. Rotator cuff muscles
5. Labrum and instability lesions
6. Biceps, pulley, and rotator interval
7. Cartilage, capsule, bursa, and synovium
8. Nerves, masses, and final management review

This order keeps the read practical: start with context, identify common pain generators, then finish with the less obvious but higher-consequence regions.`,
        pearl:
          "A checklist is not a crutch. It is how experts protect themselves from predictable human misses.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/normal-subscapularis-biceps-groove-axial.jpg",
            alt: "Axial MRI of the normal subscapularis and biceps in the bicipital groove",
            caption:
              "Multi-panel normal shoulder figure — focus on panel (a): an axial image at the bicipital groove where SSC = subscapularis traversing to the lesser tuberosity and the long head of biceps sits centered in the groove (arrowhead). (Panels b–d are additional normal views, including oblique-coronal glenohumeral images.) These are exactly the high-miss regions your checklist forces you to inspect on every read.",
            attribution: "Hindawi/PMC8767392. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Satisfaction of Search

Shoulder MRI is full of attractive first findings: mild cuff tendinosis, AC arthritis, or a small bursal fluid collection. Those findings may be real but not complete.

After the first abnormality, deliberately ask:

- Does this fully explain the symptoms?
- Is there an associated lesion?
- Is there a more urgent diagnosis hidden elsewhere?
- Would the management change if I found one more abnormality?`,
        pearl:
          "The second finding is often the one that changes the plan: biceps instability with subscap tear, paralabral cyst with denervation, or acute cuff tear with retraction.",
      },
      {
        content: `### Management Translation

For primary care sports medicine, useful MRI interpretation includes:

- Pain generator likelihood
- Tear severity and acuity
- Rehab-first versus referral-first features
- Injection-relevant findings
- Red flags needing escalation

Examples:

- Mild tendinosis without tear: usually rehab-first.
- Acute traumatic full-thickness tear with retraction: timely surgical referral.
- Adhesive capsulitis support: consider capsular-focused therapy and image-guided injection when clinically appropriate.
- Instability lesion with bone loss: surgical consultation is more likely.`,
        pearl:
          "The report should help the clinician decide the next visit, not just name anatomy.",
      },
      {
        content: `### Structured Impression

A high-yield shoulder impression answers:

1. What is the dominant diagnosis?
2. How severe is it?
3. What associated findings matter?
4. What should not be missed?

Useful words include: low-grade, high-grade, partial-thickness, full-thickness, retracted, acute, chronic, atrophy, fatty infiltration, instability pattern, capsular thickening, and denervation.`,
        pearl:
          "Avoid vague phrases like 'signal change' unless you also say whether it reaches a surface, disrupts fibers, or changes management.",
      },
      {
        content: `### Pitfalls and Variants

Common shoulder MRI pitfalls:

- Sublabral recess versus SLAP tear
- Buford complex versus absent anterosuperior labrum
- Magic angle artifact in tendons
- Mild bursal fluid overcalled as impingement
- Degenerative labral fraying overcalled as traumatic tear
- Missing upper-border subscapularis tears
- Ignoring muscle atrophy in cuff tear severity

Pitfall control comes from two-plane confirmation and clinical correlation.`,
        pearl:
          "Normal variants cluster around the superior and anterosuperior labrum. Be careful before turning a variant into a surgical diagnosis.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/sublabral-recess-coronal-arthrogram.jpg",
            alt: "MR arthrogram of a normal sublabral recess",
            caption:
              "Normal sublabral RECESS on MR arthrogram — a smooth band of contrast undercutting the superior labrum at the biceps-labral attachment (arrows), following the glenoid contour and STOPPING at the anchor. A SLAP, by contrast, extends laterally into the labrum or posterior to the anchor with irregular margins.",
            attribution: "Kadi R et al., J Belg Soc Radiol 2017;101(Suppl 2):3, Fig 13. PMC6251069. CC BY 4.0.",
          },
          {
            src: "/images/teaching/shoulder/modules/sublabral-foramen-axial-arthrogram.jpg",
            alt: "MR arthrogram of a normal sublabral foramen",
            caption:
              "Normal sublabral FORAMEN — a focal unattached anterosuperior labrum (1–3 o'clock) with contrast insinuating between the labrum and the glenoid rim (arrows). A normal variant, not a labral detachment.",
            attribution: "Kadi R et al., J Belg Soc Radiol 2017;101(Suppl 2):3, Fig 14. PMC6251069. CC BY 4.0.",
          },
          {
            src: "/images/teaching/shoulder/modules/buford-complex-axial-arthrogram.jpg",
            alt: "MR arthrogram of a Buford complex",
            caption:
              "BUFORD complex — a thick, cord-like middle glenohumeral ligament (white arrow) with an ABSENT anterosuperior labrum (black arrow). Mistaking the cord-like MGHL for a torn or displaced labrum is a classic trap.",
            attribution: "Kadi R et al., J Belg Soc Radiol 2017;101(Suppl 2):3. PMC6251069. CC BY 4.0.",
          },
        ],
      },
    ],
  },
  {
    id: "shoulder-rotator-cuff",
    number: 3,
    title: "Rotator Cuff",
    subtitle: "Tendinosis, partial tears, full-thickness tears, and reparability clues",
    searchPatternStep: 3,
    estimatedMinutes: 24,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      "Tendinosis versus tear",
      "Partial-thickness tear classification",
      "Full-thickness tear size and retraction",
      "Muscle atrophy and fatty infiltration",
      "Subscapularis and biceps pulley relationship",
    ],
    learningObjectives: [
      "Classify rotator cuff abnormalities by tendon, surface, thickness, and extent",
      "Report tear size, retraction, atrophy, and fatty infiltration in management-relevant language",
      "Recognize subscapularis tears and associated biceps instability",
    ],
    commonMistakes: [
      {
        mistake: "Calling every bright supraspinatus tendon signal a tear",
        correction:
          "Look for fiber disruption, surface extension, tendon thinning, fluid signal, or footprint exposure. Tendinosis is thickened/intermediate signal without a surface defect.",
      },
      {
        mistake: "Reporting a full-thickness cuff tear without muscle quality",
        correction:
          "Always add retraction and muscle atrophy/fatty infiltration because these strongly affect referral urgency and repairability.",
      },
    ],
    topicContent: [
      {
        content: `### Tendinosis vs Tear

**Tendinosis** is tendon thickening and intermediate signal without a discrete fluid-filled gap or surface defect.

**Partial-thickness tears** are subclassified by location:

- Articular-sided (deep, joint-facing surface)
- Bursal-sided (superficial surface)
- Intrasubstance / delaminating (within the tendon, not reaching a surface)

**Full-thickness tears** extend from the articular surface to the bursal surface and may allow fluid to communicate into the subacromial-subdeltoid bursa.`,
        pearl:
          "For primary care, the most important distinction is often rehab-first tendinosis/low-grade partial tear versus referral-priority full-thickness or high-grade traumatic tear.",
        images: [
          {
            src: "/images/teaching/shoulder/tendinosis-real.jpg",
            alt: "MRI of supraspinatus tendinosis",
            caption:
              "Supraspinatus tendinosis — (a) oblique-coronal image (black arrow) shows tendon thickening and intermediate signal at the footprint WITHOUT a discrete surface-reaching fluid-bright defect; (b) axial image (white arrow) for correlation. Contrast with a tear, where fluid signal reaches a tendon surface.",
            attribution: "Cureus 2024. PMC11600663. CC-BY 4.0.",
          },
        ],
      },
      {
        content: `### Partial-Thickness Tears

Classify partial-thickness tears by:

- Tendon involved
- Surface: articular, bursal, or intrasubstance
- Depth: low-grade versus high-grade
- AP extent
- Associated bursitis or biceps/subscapularis abnormality

Articular-sided supraspinatus tears are common. Bursal-sided tears can be more symptomatic in some impingement patterns and may be associated with subacromial bursitis.`,
        pearl:
          "A high-grade partial tear is not 'just tendinosis.' It can behave clinically closer to a significant structural cuff lesion.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/articular-sided-partial-tear-mra-coronal-aber.jpg",
            alt: "MR arthrogram of an articular-sided (PASTA) partial-thickness supraspinatus tear",
            caption:
              "Articular-sided (PASTA) partial tear — contrast undercuts the deep, joint-facing surface of the supraspinatus near the footprint (panel A oblique coronal MR arthrogram; panel B ABER view, arrows). The articular surface is the most common site of a partial-thickness cuff tear.",
            attribution: "Open Orthop J / PMC2930161. CC BY-NC 3.0.",
          },
          {
            src: "/images/teaching/shoulder/modules/bursal-sided-partial-tear-coronal-t1-t2.jpg",
            alt: "Coronal MRI of a bursal-sided partial-thickness supraspinatus tear",
            caption:
              "Bursal-sided partial tear — fluid-bright signal reaches the superficial (bursal) surface of the supraspinatus (arrow), shown on T1 (A) and fluid-sensitive (B). Compare with the articular-sided tear above: surface determines the classification.",
            attribution: "Open Orthop J / PMC2930161. CC BY-NC 3.0.",
          },
        ],
      },
      {
        content: `### Full-Thickness Tears

For full-thickness tears, report:

- Tendons involved
- AP tear size
- Medial retraction: near footprint, humeral head, glenoid, or medial to glenoid
- Muscle atrophy and fatty infiltration
- Superior humeral head migration
- Subacromial-subdeltoid bursal fluid

These details help the sports medicine clinician decide referral timing and frame the surgical conversation.`,
        pearl:
          "An acute traumatic full-thickness tear in an active patient deserves faster referral than chronic degenerative tendinosis.",
        images: [
          {
            src: "/images/teaching/shoulder/fullthickness-supraspinatus.jpg",
            alt: "MRI of a full-thickness supraspinatus tear",
            caption:
              "Full-thickness supraspinatus tear on fluid-sensitive (fat-saturated) sequences — red arrowheads (panels A–C) mark the fluid-bright tendon defect at the footprint. Report tendon(s), AP size, retraction, and muscle quality.",
            attribution: "Cureus 2020. PMC7370661. CC-BY 4.0.",
          },
          {
            src: "/images/teaching/shoulder/modules/fullthickness-supraspinatus-retraction-24mm-coronal-t2.jpg",
            alt: "Coronal T2 MRI measuring retraction of a full-thickness supraspinatus tear",
            caption:
              "How to report retraction: the retracted tendon stump is measured on the coronal fluid-sensitive image (here 24 mm; yellow caliper line, with the red line marking the retracted tendon-stump edge). Stating tendon(s), AP tear size, retraction, and muscle quality is what frames the surgical conversation.",
            attribution: "PMC11241912. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Muscle Quality

Muscle quality can decide whether a tear is repairable.

Look on oblique sagittal images for:

- Supraspinatus fossa occupancy
- Infraspinatus volume
- Fatty infiltration compared with normal muscle
- Edema suggesting acute tear, strain, or denervation

Do not let a dramatic tendon gap distract you from the muscle.`,
        pearl:
          "The tendon tells you what tore; the muscle tells you how long it may have been torn and what options remain.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/goutallier-fatty-infiltration-yview-sagittal-t1.jpg",
            alt: "Sagittal Y-view T1 MRI showing supraspinatus fatty infiltration",
            caption:
              "Goutallier fatty infiltration on the oblique-sagittal 'Y' view at the scapular spine. Magnified insets (a, c; supraspinatus outlined) show increasing intramuscular fat streaks; whole-Y views (b, d) for orientation. Goutallier ≥3 (fat ≥ muscle) predicts poor healing and may indicate an irreparable tear.",
            attribution: "PMC9805608. CC BY-NC-SA 4.0.",
          },
        ],
      },
      {
        content: `### Subscapularis and Biceps Pulley

The upper subscapularis and biceps pulley are a linked system. When one is abnormal, inspect the other.

Look for:

- Upper-border subscapularis partial tear
- Lesser tuberosity footprint involvement
- Medial biceps subluxation or dislocation
- Biceps tenosynovitis
- Rotator interval edema or thickening

Subscapularis pathology is a common undercalled source of anterior shoulder pain.`,
        pearl:
          "Medial biceps displacement is a red flag for a pulley/subscapularis lesion until proven otherwise.",
        images: [
          {
            src: "/images/teaching/shoulder/subscap-biceps-dislocation.jpg",
            alt: "Axial MRI showing medial biceps dislocation with subscapularis tear",
            caption:
              "Upper subscapularis tear with medial dislocation of the long head of biceps out of the bicipital groove — the classic 'hidden lesion.' Medial biceps displacement should trigger a subscapularis/pulley search.",
            attribution: "Lee SU et al., BioMed Research International 2018. PMC6151251. CC-BY 4.0.",
          },
        ],
      },
    ],
  },
  {
    id: "shoulder-labrum-instability",
    number: 4,
    title: "Labrum & Instability",
    subtitle: "SLAP, Bankart spectrum, posterior labrum, and bone loss",
    searchPatternStep: 5,
    estimatedMinutes: 24,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      "Labral quadrants and normal variants",
      "SLAP and biceps anchor abnormalities",
      "Anterior instability: Bankart spectrum and Hill-Sachs",
      "Posterior instability and paralabral cysts",
      "Bone loss and referral relevance",
    ],
    learningObjectives: [
      "Differentiate common labral tear patterns from normal superior labral variants",
      "Connect labral findings with instability direction and osseous lesions",
      "Recognize imaging features that should prompt surgical referral discussion",
    ],
    commonMistakes: [
      {
        mistake: "Calling degenerative superior labral fraying a symptomatic SLAP tear in every middle-aged patient",
        correction:
          "Interpret superior labral signal in age and sport context. Many degenerative superior labral findings are not the primary pain generator.",
      },
      {
        mistake: "Identifying a Bankart lesion but not evaluating glenoid bone loss",
        correction:
          "Instability management depends on soft-tissue injury plus bone loss. Always inspect the glenoid and humeral head.",
      },
    ],
    topicContent: [
      {
        content: `### Labral Orientation

Use axial images to divide the labrum into practical regions:

- Superior labrum and biceps anchor
- Anterosuperior labrum and normal variants
- Anteroinferior labrum for anterior instability
- Posterior labrum for posterior pain or instability
- Inferior labrum and capsular attachments

MR arthrography can be particularly useful when subtle labral pathology is the main question.`,
        pearl:
          "Name the labral quadrant. 'Labral tear' by itself is rarely enough to guide management.",
      },
      {
        content: `### SLAP and the Biceps Anchor

SLAP tears involve the superior labrum anterior-to-posterior around the biceps anchor.

Look for:

- Fluid or contrast undercutting the superior labrum
- Extension into the biceps anchor
- Paralabral cyst
- Associated internal impingement or undersurface cuff change in throwers

Be cautious: sublabral recesses and degenerative fraying are common.`,
        pearl:
          "A SLAP diagnosis is strongest when imaging, exam, sport demands, and symptoms all point the same direction.",
        images: [
          {
            src: "/images/teaching/shoulder/slap-real.jpg",
            alt: "MR arthrogram of a SLAP tear of the superior labrum",
            caption:
              "SLAP tear — contrast/fluid undercuts the superior labrum and extends past the biceps anchor with irregular margins. A normal sublabral recess, by contrast, is smooth and stops at the anchor.",
            attribution: "SA J Radiol 2023. PMC10879901. CC-BY 4.0.",
          },
        ],
      },
      {
        content: `### Anterior Instability

Anterior instability patterns include:

- Bankart lesion: detached anteroinferior labrum
- Bony Bankart: glenoid rim fracture
- Perthes lesion: stripped but minimally displaced labrum
- ALPSA: medially displaced labroligamentous complex
- Hill-Sachs lesion: posterolateral humeral head impaction
- HAGL: humeral avulsion of the inferior glenohumeral ligament

The imaging job is to define the pattern and associated bone loss.`,
        pearl:
          "A first-time dislocation MRI should not end at 'Bankart.' Look for Hill-Sachs, glenoid bone loss, cuff tear in older patients, and HAGL.",
        images: [
          {
            src: "/images/teaching/shoulder/bankart-real.jpg",
            alt: "Axial MR arthrogram showing a Bankart lesion and a Hill-Sachs lesion",
            caption:
              "Anterior-instability bipolar lesion on axial MR arthrogram — black arrow: anteroinferior labral detachment with torn periosteum (soft-tissue Bankart); white arrow: posterolateral humeral-head impaction (Hill-Sachs).",
            attribution: "Omoumi P. J Belg Soc Radiol 2016;100(1):97, Fig. 8. PMC6100670. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Posterior Labrum

Posterior labral tears can be subtle and clinically important in lifters, linemen, throwers, and patients with posterior instability.

Look for:

- Posterior labral detachment or irregularity
- Reverse Bankart pattern
- Reverse Hill-Sachs lesion
- Posterior glenoid cartilage injury
- Spinoglenoid notch paralabral cyst
- Infraspinatus denervation edema or atrophy

Posterior pathology is often missed when the clinical question only says "shoulder pain."`,
        pearl:
          "A cyst near the spinoglenoid notch should trigger a labrum search and muscle denervation check.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/posterior-bankart-reverse-hillsachs-axial-t2fs.jpg",
            alt: "CT and MRI of posterior instability with reverse Hill-Sachs and posterior labral tear",
            caption:
              "Posterior instability — panel A (CT) shows the bony reverse Hill-Sachs (anteromedial humeral-head impaction, blue arrow); panel B (axial T2 FS MRI) shows the posterior labral tear / reverse Bankart (red arrow) with the reverse Hill-Sachs (blue arrow). Easy to miss when the question only says 'shoulder pain.'",
            attribution: "PMC12277762. CC BY 4.0.",
          },
          {
            src: "/images/teaching/shoulder/modules/spinoglenoid-cyst-infraspinatus-denervation-axial-sagittal.jpg",
            alt: "MRI of a spinoglenoid notch paralabral cyst with infraspinatus denervation",
            caption:
              "Spinoglenoid notch paralabral cyst (labeled S) with infraspinatus denervation — axial (a) and sagittal (b). The cyst sits at the notch and the infraspinatus shows denervation edema ('edematous muscles'). A cyst here should always trigger a denervation check.",
            attribution: "PMC7958802. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Bone Loss

Bone loss changes instability management.

Estimate and communicate:

- Glenoid rim fracture or attritional bone loss
- Hill-Sachs size and location
- Whether the pattern seems engaging/off-track when advanced assessment is available
- Associated cartilage injury

Primary care sports medicine fellows do not need to solve every surgical calculation, but they should recognize when bone loss makes referral more important.`,
        pearl:
          "Soft-tissue instability plus meaningful bone loss is a different clinical problem than an isolated labral tear.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/bony-bankart-glenoid-rim-axial-t1.jpg",
            alt: "Axial MRI of a bony Bankart lesion of the anteroinferior glenoid",
            caption:
              "Bony Bankart — an anteroinferior glenoid rim fracture/deficiency (arrowhead) on axial MRI. Significant glenoid bone loss or an engaging Hill-Sachs shifts management toward a bony procedure; CT (often 3D) quantifies bone loss most accurately.",
            attribution: "PMC5996414. CC BY 4.0.",
          },
        ],
      },
    ],
  },
  {
    id: "shoulder-biceps-interval-ac",
    number: 5,
    title: "Biceps, Rotator Interval & AC Joint",
    subtitle: "Anterior shoulder pain, pulley lesions, adhesive capsulitis, and AC pain",
    searchPatternStep: 6,
    estimatedMinutes: 22,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      "Long head biceps tendinosis and tenosynovitis",
      "Pulley lesions and biceps instability",
      "Rotator interval and adhesive capsulitis support findings",
      "AC joint degeneration and distal clavicle edema",
    ],
    learningObjectives: [
      "Trace the long head biceps from anchor through groove and identify instability",
      "Recognize the relationship among biceps pulley, subscapularis, and rotator interval",
      "Identify imaging findings that support adhesive capsulitis or AC joint pain generators",
    ],
    commonMistakes: [
      {
        mistake: "Calling biceps sheath fluid abnormal without checking the joint effusion",
        correction:
          "The biceps sheath communicates with the joint. Interpret sheath fluid alongside effusion, synovitis, and tendon morphology.",
      },
      {
        mistake: "Ignoring AC joint marrow edema because degenerative AC changes are common",
        correction:
          "AC osteoarthritis is common, but focal edema, capsular hypertrophy, and matching superior shoulder pain can make it clinically relevant.",
      },
    ],
    topicContent: [
      {
        content: `### Long Head Biceps

Evaluate the biceps in three zones:

- Anchor at the superior labrum
- Intra-articular segment crossing the humeral head
- Extra-articular segment in the bicipital groove

Look for tendinosis, split tear, partial tear, complete rupture, tenosynovitis, subluxation, or dislocation.`,
        pearl:
          "Biceps pain is often a system problem: anchor, pulley, subscapularis, and groove all need to be checked.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/biceps-tenosynovitis-effusion-axial-t2fs.jpg",
            alt: "Axial MRI of long head biceps tenosynovitis with surrounding fluid",
            caption:
              "Biceps tenosynovitis — fluid surrounds the long head of biceps within the bicipital groove (panel B, the tendon is ringed by bright fluid). Because the sheath communicates with the joint, interpret sheath fluid alongside the joint effusion and tendon morphology.",
            attribution: "PMC9743254. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Pulley Lesions

The biceps pulley includes the superior glenohumeral ligament, coracohumeral ligament, and upper subscapularis/supraspinatus interval.

Pulley failure can produce:

- Medial biceps subluxation
- Biceps dislocation
- Upper-border subscapularis tearing
- Rotator interval edema
- Anterior shoulder pain

On axial images, the biceps should sit centered in the groove.`,
        pearl:
          "When the biceps is perched or medial, the upper subscapularis deserves a second look.",
        images: [
          {
            src: "/images/teaching/shoulder/subscap-sublux-vs-disloc.jpg",
            alt: "Axial MRI comparing medial biceps subluxation versus dislocation",
            caption:
              "Biceps pulley failure: the long head of biceps is displaced medially out of the bicipital groove. Subluxation (perched on the lesser tuberosity) vs frank dislocation (medial to the groove, often into a torn subscapularis).",
            attribution: "Lee SU et al., BioMed Research International 2018. PMC6151251. CC-BY 4.0.",
          },
        ],
      },
      {
        content: `### Adhesive Capsulitis Support

MRI can support but does not replace the clinical diagnosis.

Look for:

- Rotator interval edema
- Coracohumeral ligament thickening
- Axillary pouch capsular thickening
- Pericapsular edema
- Reduced capsular volume on arthrogram

These findings are useful when exam suggests global passive range-of-motion loss.`,
        pearl:
          "Do not diagnose adhesive capsulitis from MRI alone; use MRI to support the clinical picture and exclude competing pathology.",
        images: [
          {
            src: "/images/teaching/shoulder/adhesive-real.jpg",
            alt: "MRI of adhesive capsulitis with rotator interval and axillary pouch changes",
            caption:
              "Adhesive capsulitis support findings — axial image: edematous, thickened soft tissue at the rotator interval with obliteration of the subcoracoid fat (arrows) and coracohumeral ligament thickening. (Axillary-pouch capsular thickening is best assessed on coronal images.) Correlate with painful global ROM loss.",
            attribution: "Insights Imaging 2016. PMC4877356. CC-BY 4.0.",
          },
        ],
      },
      {
        content: `### AC Joint

AC joint findings range from incidental to dominant pain generator.

Assess:

- Joint space narrowing and osteophytes
- Distal clavicle or acromial marrow edema
- Capsular hypertrophy
- Inferior osteophytes contacting the cuff or bursa
- Os acromiale or stress reaction

Correlate with focal tenderness, cross-body adduction pain, and response to diagnostic injection when used.`,
        pearl:
          "The most relevant AC finding is often edema, not the mere presence of osteophytes.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/ac-joint-osteoarthritis-coronal-stir-panelsDEF.jpg",
            alt: "MRI of acromioclavicular joint osteoarthritis with marrow edema",
            caption:
              "AC joint osteoarthritis — beyond joint-space narrowing and osteophytes, the clinically relevant finding is marrow edema on both sides of the joint and capsular hypertrophy (bottom row, circle/arrows). Match it to focal AC tenderness before calling it the pain generator.",
            attribution: "PMC12627108. CC BY 4.0.",
          },
        ],
      },
    ],
  },
  {
    id: "shoulder-arthritis-bursa-dontmiss",
    number: 6,
    title: "Arthritis, Bursa & Don't-Miss Findings",
    subtitle: "Cartilage loss, bursitis, denervation, infection, tumor mimics, and referral flags",
    searchPatternStep: 7,
    estimatedMinutes: 24,
    essentialTopics: [0, 1, 2, 3, 4],
    topics: [
      "Glenohumeral cartilage loss and cuff tear arthropathy",
      "Subacromial-subdeltoid bursitis and synovitis",
      "Paralabral cysts and denervation patterns",
      "Occult fracture, infection, tumor, and inflammatory arthropathy",
      "Management-changing impression language",
      "Muscle-Tendon Injuries Beyond the Cuff",
    ],
    learningObjectives: [
      "Recognize common arthritis and bursitis patterns on shoulder MRI",
      "Identify denervation patterns and space-occupying lesions that should not be missed",
      "Prioritize MRI findings that change urgency, referral, injection planning, or follow-up",
      "Apply the universal MRI muscle-strain grading framework to the shoulder girdle and recognize pectoralis major rupture — including the surgically critical humeral tendon avulsion (\"empty bicipital groove\") — and other non-cuff muscle-tendon injuries (latissimus dorsi/teres major, deltoid) so the report drives correct rehab-versus-referral decisions.",
    ],
    commonMistakes: [
      {
        mistake: "Treating subacromial bursitis as the final diagnosis without checking the cuff",
        correction:
          "Bursal fluid can be reactive to cuff tear, inflammatory disease, or injection. Always pair bursa assessment with cuff integrity.",
      },
      {
        mistake: "Missing denervation because the tendons look intact",
        correction:
          "Inspect muscle edema and fatty change. Suprascapular or axillary nerve patterns can explain weakness with preserved tendon continuity.",
      },
    ],
    topicContent: [
      {
        content: `### Glenohumeral Arthritis

Assess cartilage and joint degeneration:

- Humeral head and glenoid cartilage thinning
- Osteophytes
- Subchondral cysts and marrow edema
- Loose bodies
- Posterior glenoid wear or humeral head subluxation

Also recognize cuff tear arthropathy: chronic massive cuff tear, superior migration, narrowed acromiohumeral interval, and degenerative joint change.`,
        pearl:
          "Arthritis severity helps decide whether symptoms are cuff-dominant, joint-dominant, or mixed.",
        images: [
          {
            src: "/images/teaching/shoulder/massive-real.jpg",
            alt: "MRI of a massive rotator cuff tear with cuff-tear arthropathy",
            caption:
              "Cuff-tear arthropathy — chronic massive cuff tear with superior humeral migration and a narrowed acromiohumeral interval, accompanied by degenerative glenohumeral change.",
            attribution: "Medicine (Baltimore) 2025. PMC12499805. CC-BY 4.0.",
          },
        ],
      },
      {
        content: `### Bursa and Synovium

Subacromial-subdeltoid bursal fluid can reflect:

- Full-thickness cuff tear communication
- Bursitis
- Impingement-associated inflammation
- Recent injection
- Inflammatory arthropathy

Synovitis, erosions, and large effusion should broaden the differential beyond mechanical pain.`,
        pearl:
          "Bursitis is a finding, not always a diagnosis. Ask why the bursa is inflamed.",
        images: [
          {
            src: "/images/teaching/shoulder/calcific-tendinitis.jpg",
            alt: "MRI of calcific tendinitis with reactive subacromial-subdeltoid bursitis",
            caption:
              "Calcific tendinitis with reactive subacromial-subdeltoid bursitis — the hydroxyapatite deposit is LOW signal on T1 AND T2 (easy to miss). This answers 'why is the bursa inflamed?': a deposit, not a structural tear.",
            attribution: "Cureus 2025. PMC12659715. CC-BY 4.0.",
          },
          {
            src: "/images/teaching/shoulder/modules/subacromial-subdeltoid-bursitis-rice-bodies-mri.jpg",
            alt: "MRI of subacromial-subdeltoid bursitis with rice bodies",
            caption:
              "Subacromial-subdeltoid bursitis with rice bodies — a fluid-distended bursa containing multiple small filling defects (rice bodies), a clue to a synovial/inflammatory process. Pair bursal fluid with cuff integrity and broaden the differential.",
            attribution: "PMC11006454. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Paralabral Cysts and Denervation

Paralabral cysts can compress nerves:

- Spinoglenoid notch cyst: infraspinatus denervation
- Suprascapular notch cyst: supraspinatus and infraspinatus denervation
- Quadrilateral space lesion: teres minor and sometimes deltoid denervation

Look for muscle edema acutely and fatty atrophy chronically.`,
        pearl:
          "A cyst plus denervation is a referral-relevant finding even if the labral tear itself looks small.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/spinoglenoid-cyst-infraspinatus-denervation-axial-sagittal.jpg",
            alt: "MRI of a spinoglenoid notch paralabral cyst with infraspinatus denervation",
            caption:
              "Spinoglenoid notch paralabral cyst (labeled S) compressing the suprascapular nerve branch to the infraspinatus — note the denervated 'edematous' infraspinatus (axial a, sagittal b). Muscle edema acutely, fatty atrophy chronically. A cyst plus denervation is referral-relevant even with a small-looking labral tear.",
            attribution: "PMC7958802. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Red Flags

Do not miss:

- Occult fracture or osteonecrosis
- Septic arthritis or osteomyelitis pattern
- Aggressive marrow replacement or soft-tissue mass
- Destructive inflammatory arthropathy
- Acute traumatic cuff tear with retraction
- Posterior dislocation or locked instability pattern

These findings shift the plan away from routine rehab.`,
        pearl:
          "When MRI findings do not fit the common sports pattern, widen the differential before settling on tendinosis.",
        images: [
          {
            src: "/images/teaching/shoulder/modules/humeral-head-subchondral-insufficiency-fracture-marrow-edema-mri.jpg",
            alt: "MRI of humeral head subchondral insufficiency fracture with marrow edema",
            caption:
              "Don't-miss marrow process — diffuse humeral-head marrow edema with subchondral change (arrows), here a subchondral insufficiency-fracture pattern. When marrow signal doesn't fit a routine sports pattern, widen the differential (insufficiency fracture, osteonecrosis, infiltration).",
            attribution: "PMC4402478. CC BY.",
          },
          {
            src: "/images/teaching/shoulder/modules/acromioclavicular-septic-arthritis-effusion-abscess-mri.jpg",
            alt: "MRI of acromioclavicular joint septic arthritis with effusion and abscess",
            caption:
              "Don't-miss infection — AC joint septic arthritis: a joint effusion/abscess (red arrow) with aggressive surrounding soft-tissue edema (blue arrow). Findings like this shift the plan away from routine rehab to urgent communication.",
            attribution: "Sigmund EE et al. / PMC10854883. CC BY 4.0.",
          },
        ],
      },
      {
        content: `### Impression Language

A primary-care-useful impression might say:

- "Low-grade supraspinatus tendinosis without discrete tear; mild bursitis."
- "Acute full-thickness supraspinatus/infraspinatus tear with retraction to the humeral head and no advanced fatty atrophy."
- "Anterior instability pattern with Bankart lesion and Hill-Sachs impaction."
- "Findings supportive of adhesive capsulitis in the appropriate clinical setting."
- "Spinoglenoid notch paralabral cyst with infraspinatus denervation edema."

Lead with the finding that changes management.`,
        pearl:
          "The best impression gives the clinician a next-step hierarchy.",
      },
      {
        content: `### The Universal Muscle-Strain Framework

Strains follow the same MRI grading scheme everywhere in the body. The **myotendinous junction (MTJ)** is the most common site of injury, because it is the mechanically weakest link under eccentric load.

| Grade | What tore | MRI appearance | Typical management |
|---|---|---|---|
| **1** | None (overstretch) | Perifascial **"feathery"** edema; muscle architecture **intact** | Rehab, relative rest |
| **2** | Partial tear | Fiber disruption with focal **fluid/hematoma**; some fibers intact | Rehab; surgery rare, depends on muscle/tendon |
| **3** | Complete tear | Full fiber discontinuity with **retraction** of the torn end | Tendinous avulsions in active patients often referred for repair |

When you see edema, decide which grade it is: feathery edema **between** fibers and fascia with preserved architecture is grade 1; a discrete fluid cleft with disrupted fibers is grade 2; a gap with a retracted stump is grade 3. Always state **location** (intramuscular, MTJ, or tendinous/avulsion), **completeness**, and **retraction** — these are what change the plan.

### Pectoralis Major Rupture — The Key Athletic Injury

The pectoralis major is the **muscle-tendon injury of the chest/shoulder you cannot miss** in a sports population. Classic mechanism: an **eccentric load with the arm extended and abducted** — almost always the **bottom of a bench press** (and anabolic-steroid use raises risk).

Anatomy that drives the read:

- **Two heads** — **clavicular** and **sternocostal (sternal)**. The **sternocostal head tears most often**.
- The tendon inserts on the **lateral lip of the bicipital (intertubercular) groove** via a **bilaminar, U-shaped footprint** (anterior clavicular lamina, posterior sternocostal lamina). The **inferior sternocostal fibers tear first**, so a tear can be functionally complete while clavicular fibers still look intact — read the whole footprint.

**Tear location determines management** — three zones, increasing surgical relevance:

1. **Intramuscular** — usually managed conservatively.
2. **Myotendinous junction** — variable; often non-operative.
3. **Tendinous avulsion off the humeral insertion** — the **most surgically relevant**; acute complete avulsions in active patients are typically referred for **repair**.

**MRI findings:**

- **Hematoma** and edema at the anteromedial axillary fold/chest wall.
- **Retraction** of the torn tendon/muscle medially (the muscle balls up toward the sternum, producing medial chest ecchymosis and an axillary-fold defect clinically).
- The **"empty bicipital groove"** sign — the avulsed tendon is absent from the lateral lip of the intertubercular groove on axial images, the imaging signature of a complete humeral-sided avulsion. Partial and MTJ tears retain tendon at the groove.

Report: **which head(s)**, **tear location** (intramuscular / MTJ / humeral avulsion), **completeness**, and **degree of retraction**. Acute complete tendinous avulsion in an active patient is a **surgical referral**.

### Other Shoulder-Girdle Muscles to Recognize

- **Latissimus dorsi / teres major strains** — seen in **throwers** (the deceleration phase) and **water-skiers/wakeboarders** (sudden traction on a flexed, abducted arm). Look for MTJ feathery edema and grade accordingly; most are managed conservatively, though high-grade tendon avulsions in elite throwers may be discussed surgically.
- **Deltoid tears** — **rare** in isolation; when seen, suspect direct trauma, a massive contiguous cuff tear, or denervation (axillary nerve) mimicking a "tear." A truly torn deltoid is uncommon enough that you should look hard for an alternative explanation.

### Reporting Checklist

- **Which muscle**, and which **head/component** (e.g., sternocostal pectoralis major).
- **Location** of injury: intramuscular, **myotendinous junction**, or **tendinous/avulsion**.
- **Grade/completeness**: feathery edema (1) vs partial with fluid (2) vs complete with retraction (3).
- **Retraction** distance/landmark and **hematoma** size.
- For pectoralis major: is the **bicipital groove empty** (humeral avulsion)? State it explicitly.
- **Management flag**: acute complete tendinous avulsion in an active patient = surgical referral.`,
        pearl: `In a lifter with a bench-press "pop," medial chest ecchymosis, and a soft anterior axillary fold, look straight at the lateral lip of the bicipital groove: an "empty groove" with a retracted, hematoma-wrapped sternocostal tendon is a complete humeral-sided pectoralis major avulsion. That location — not the size of the bruise — is what sends an active patient to surgery, so name it in the impression.`,
      },
    ],
  },
];
