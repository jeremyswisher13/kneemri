import type { TopicFlashcards } from "@/content/flashcards/module-flashcards";

/**
 * Shoulder spaced-repetition flashcards.
 *
 * Keyed by shoulder module ID and topicIndex so they slot into the shared
 * `getFlashcardsForTopic()` lookup exactly like the knee cards. Kept concise
 * and management-focused (1–2 cards per key topic) for primary care sports
 * medicine fellows — high-yield recall, not exhaustive coverage.
 */
export const shoulderModuleFlashcards: Record<string, TopicFlashcards[]> = {
  // ─── Module 1: Shoulder MRI Orientation ─────────────────────────────
  "shoulder-mri-orientation": [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-shoulder-mri-orientation-t0-1',
          question:
            "When is an MR arthrogram preferred over a routine non-contrast shoulder MRI?",
          answer:
            "When subtle labral/instability lesions, an articular-sided (undersurface) partial cuff tear, or the postoperative labrum are in question and non-contrast MRI is equivocal or discordant with the exam. Intra-articular contrast distends the joint and outlines the labrum.",
        },
        {
          id: 'fc-shoulder-mri-orientation-t0-2',
          question: "What does a routine non-contrast shoulder MRI answer well?",
          answer:
            "Most primary care questions: cuff tendinosis/tears, subacromial-subdeltoid bursitis, AC joint disease, marrow/occult fracture, and findings supporting adhesive capsulitis.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-shoulder-mri-orientation-t1-1',
          question:
            "Which plane is the workhorse for supraspinatus/infraspinatus tears and the AC joint?",
          answer:
            "Oblique coronal (parallel to the supraspinatus). Trace the cuff from the musculotendinous junction to the greater tuberosity footprint.",
        },
        {
          id: 'fc-shoulder-mri-orientation-t1-2',
          question:
            "Which plane best shows the subscapularis, the biceps in/out of its groove, the labrum (Bankart), and Hill-Sachs?",
          answer:
            "Axial. The oblique sagittal is best for muscle bulk/fatty infiltration (Goutallier 'Y' view), which tendon is torn, the rotator interval, and acromial morphology.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-shoulder-mri-orientation-t2-1',
          question:
            "Which sequence makes a cuff tear most convincing, and why?",
          answer:
            "Fluid-sensitive fat-saturated (T2/PD FS): a tear is convincing when fluid-bright signal reaches a tendon surface or fills a defect.",
        },
        {
          id: 'fc-shoulder-mri-orientation-t2-2',
          question: "What is the magic-angle pitfall in the shoulder?",
          answer:
            "Intermediate signal in the distal supraspinatus where it curves ~55° to the main field on short-TE (T1/PD) sequences. It resolves on T2 — do not call it a tear.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-shoulder-mri-orientation-t3-1',
          question:
            "For primary care sports medicine, what is the goal when reading a shoulder MRI?",
          answer:
            "Answer the management question — is there a structural/surgical lesion, a red flag, or a finding that changes the next step (referral, injection, rehab)? — rather than cataloguing every degenerative change.",
        },
      ],
    },
  ],

  // ─── Module 2: Shoulder Search Pattern ──────────────────────────────
  "shoulder-search-pattern": [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-shoulder-search-pattern-t0-1',
          question:
            "Which high-miss areas is a shoulder search pattern designed to catch?",
          answer:
            "Upper-border subscapularis, the biceps pulley / medial biceps subluxation, the posterior and posterosuperior labrum, suprascapular/spinoglenoid denervation, and the AC joint.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-shoulder-search-pattern-t1-1',
          question:
            "What is satisfaction-of-search, and how do you guard against it on shoulder MRI?",
          answer:
            "Stopping after the first obvious finding (e.g., a supraspinatus tear) and missing a second lesion. Finish the full checklist every time — a cuff tear does not exclude a labral tear, a biceps lesion, or denervation.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-shoulder-search-pattern-t4-1',
          question: "Name three superior-labral 'don't-overcall' variants.",
          answer:
            "Sublabral recess, sublabral foramen, and the Buford complex (absent anterosuperior labrum + a cord-like middle glenohumeral ligament).",
        },
        {
          id: 'fc-shoulder-search-pattern-t4-2',
          question:
            "How do you distinguish a sublabral recess from a SLAP tear?",
          answer:
            "A recess is smooth, medial, parallels the glenoid, and stops at the biceps anchor. A SLAP extends laterally into the labrum or posterior to the anchor with irregular margins.",
        },
      ],
    },
  ],

  // ─── Module 3: Rotator Cuff ─────────────────────────────────────────
  "shoulder-rotator-cuff": [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-shoulder-rotator-cuff-t0-1',
          question: "How does tendinosis look versus a cuff tear?",
          answer:
            "Tendinosis = tendon thickening + intermediate signal WITHOUT a surface-reaching fluid-bright defect. A tear shows fluid-bright signal reaching a surface (partial) or spanning articular-to-bursal (full-thickness).",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-shoulder-rotator-cuff-t1-1',
          question:
            "Articular- versus bursal-sided partial tear — which surface is which, and which is more common?",
          answer:
            "Articular = the deep surface facing the joint (the most common partial tear, 'PASTA'). Bursal = the superficial surface under the subacromial bursa.",
        },
        {
          id: 'fc-shoulder-rotator-cuff-t1-2',
          question:
            "How is partial-tear depth graded, and why does it matter?",
          answer:
            "Low-grade <50% vs high-grade >50% of tendon thickness. A high-grade partial behaves clinically closer to a significant structural lesion — not 'just tendinosis.'",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-shoulder-rotator-cuff-t2-1',
          question:
            "What five things should every full-thickness cuff tear report include?",
          answer:
            "(1) which tendon(s); (2) surface/thickness; (3) AP tear size; (4) retraction (Patte stage); (5) muscle atrophy / fatty infiltration (Goutallier grade). Surface and muscle quality are what change management.",
        },
        {
          id: 'fc-shoulder-rotator-cuff-t2-2',
          question: "What does the Patte stage describe?",
          answer:
            "Tendon retraction: Stage 1 near the footprint, Stage 2 to the humeral head, Stage 3 to the glenoid. More retraction = harder repair.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-shoulder-rotator-cuff-t3-1',
          question:
            "What Goutallier grade predicts poor healing / an irreparable tear, and where is it assessed?",
          answer:
            "Grade ≥3 (fat ≥ muscle). Assess on the oblique-sagittal 'Y' view at the scapular spine.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-shoulder-rotator-cuff-t4-1',
          question:
            "Medial subluxation of the biceps out of its groove should trigger a search for what?",
          answer:
            "An upper-border subscapularis tear / biceps pulley lesion — the classic 'hidden lesion.' Inspect the subscapularis on axial and sagittal images.",
        },
      ],
    },
  ],

  // ─── Module 4: Labrum & Instability ─────────────────────────────────
  "shoulder-labrum-instability": [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-shoulder-labrum-instability-t0-1',
          question: "What does a normal labrum look like?",
          answer:
            "Triangular, uniformly low signal, firmly attached to the glenoid rim. Interpret superior labral signal in the context of age and sport before calling a SLAP tear.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-shoulder-labrum-instability-t1-1',
          question:
            "A spinoglenoid notch paralabral cyst is found — what associated finding must you check?",
          answer:
            "Infraspinatus denervation edema (acute) or fatty atrophy (chronic) from compression of the suprascapular nerve branch.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-shoulder-labrum-instability-t2-1',
          question:
            "What is the classic bipolar lesion of an anterior shoulder dislocation?",
          answer:
            "An anteroinferior labral Bankart lesion plus a posterolateral humeral-head Hill-Sachs impaction.",
        },
        {
          id: 'fc-shoulder-labrum-instability-t2-2',
          question: "Define Bankart, Perthes, ALPSA, and HAGL.",
          answer:
            "Bankart (soft-tissue) = anteroinferior labrum detached with torn periosteum; the osseous Bankart variant is an anteroinferior glenoid rim fracture (it drives the bone-loss/surgical-referral assessment). Perthes = labrum stripped but periosteum intact and minimally displaced (easily missed). ALPSA = labroligamentous complex displaced medially and 'rolled up' on the glenoid neck (chronic). HAGL = inferior glenohumeral ligament avulsed from the HUMERAL side ('J-sign' axillary pouch).",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-shoulder-labrum-instability-t4-1',
          question:
            "Which instability findings push toward surgery and warrant CT quantification?",
          answer:
            "Significant glenoid bone loss (approaching ~20%, with lower subcritical thresholds increasingly used) or an engaging / off-track Hill-Sachs. CT (often 3D) quantifies bone loss best — MRI/MRA may underestimate it.",
        },
      ],
    },
  ],

  // ─── Module 5: Biceps, Rotator Interval & AC Joint ──────────────────
  "shoulder-biceps-interval-ac": [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-shoulder-biceps-interval-ac-t0-1',
          question:
            "Where do you check the long head of biceps, and what is normal versus abnormal?",
          answer:
            "Centered in the bicipital groove on axial images. Fluid tracking only around the tendon reflects the joint's fluid; medial perching/subluxation out of the groove is abnormal and a red flag.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-shoulder-biceps-interval-ac-t1-1',
          question:
            "Medial biceps subluxation implies injury to what, and which tendon should you scrutinize?",
          answer:
            "The biceps pulley (coracohumeral / superior glenohumeral ligament sling). Scrutinize the upper-border subscapularis — the 'hidden lesion.'",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-shoulder-biceps-interval-ac-t2-1',
          question: "What MRI findings support adhesive capsulitis?",
          answer:
            "Obliteration of the subcoracoid fat triangle in the rotator interval, coracohumeral ligament thickening, and a thickened/edematous axillary pouch and capsule. Correlate with painful global ROM loss — the diagnosis is clinical.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-shoulder-biceps-interval-ac-t3-1',
          question: "When does AC joint arthrosis matter on MRI?",
          answer:
            "When it correlates with focal AC tenderness: look for capsular hypertrophy, marrow edema on BOTH sides of the joint, and inferior osteophytes contacting the cuff. Asymptomatic AC degeneration is common — don't over-attribute pain to it.",
        },
      ],
    },
  ],

  // ─── Module 6: Arthritis, Bursa & Don't-Miss ────────────────────────
  "shoulder-arthritis-bursa-dontmiss": [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-shoulder-arthritis-bursa-dontmiss-t0-1',
          question:
            "What acromiohumeral interval values signal cuff insufficiency and cuff-tear arthropathy?",
          answer:
            "Normal >7 mm. <7 mm suggests cuff insufficiency with superior humeral migration. <5 mm is consistent with a chronic massive tear / cuff-tear arthropathy.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-shoulder-arthritis-bursa-dontmiss-t1-1',
          question:
            "What is the imaging clue and the management pivot for calcific tendinitis?",
          answer:
            "A focal LOW-signal deposit on T1 AND T2 (easy to miss) with surrounding edema, often in the supraspinatus near the footprint. It is usually managed conservatively first (NSAIDs, activity modification, physical therapy); ultrasound-guided barbotage/aspiration or a subacromial injection is added for refractory or acutely painful (resorptive-phase) cases. The key point: it is NOT a structural cuff-repair problem. Radiographs/ultrasound show the deposit best.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-shoulder-arthritis-bursa-dontmiss-t2-1',
          question: "Match the denervated muscle to the paralabral cyst location.",
          answer:
            "Spinoglenoid notch cyst → infraspinatus denervation. Suprascapular notch cyst → BOTH supraspinatus and infraspinatus.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-shoulder-arthritis-bursa-dontmiss-t3-1',
          question:
            "Name shoulder MRI red flags that change management urgently.",
          answer:
            "Suspected septic arthritis/osteomyelitis, an aggressive marrow-replacing or soft-tissue mass, and acute occult fracture. Communicate directly and don't anchor on degenerative findings.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-shoulder-arthritis-bursa-dontmiss-t4-1',
          question:
            "What makes a shoulder MRI impression 'management-changing'?",
          answer:
            "It states the structural diagnosis, its severity/repairability (tendon, size, retraction, muscle quality; bone loss; denervation), and the implied next step (rehab, injection, referral) — rather than a list of every degenerative change.",
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
      {
        id: 'fc-shoulder-arthritis-bursa-dontmiss-t5-1',
        question: "What are the three MRI grades of a muscle strain, and where do strains most commonly occur?",
        answer: "Grade 1 = perifascial 'feathery' edema with intact architecture; Grade 2 = partial tear with fiber disruption plus fluid/hematoma; Grade 3 = complete tear with retraction. The myotendinous junction is the most common site.",
      },
      {
        id: 'fc-shoulder-arthritis-bursa-dontmiss-t5-2',
        question: "What is the classic mechanism and the most surgically relevant tear location for a pectoralis major rupture?",
        answer: "Eccentric load with the arm extended/abducted — classically the bottom of a bench press. The most surgically relevant location is avulsion of the tendon from its humeral insertion at the lateral lip of the bicipital (intertubercular) groove; the sternocostal head tears most often (inferior sternocostal fibers first).",
      },
      {
        id: 'fc-shoulder-arthritis-bursa-dontmiss-t5-3',
        question: "What MRI sign indicates a complete humeral-sided avulsion of the pectoralis major, and what should the report state?",
        answer: "The 'empty bicipital groove' — the avulsed tendon is absent from the lateral lip of the intertubercular groove (partial/MTJ tears retain tendon there). Report which head(s), tear location (intramuscular vs MTJ vs humeral avulsion), completeness, and retraction; acute complete avulsions in active patients are referred for surgical repair.",
      },
      ],
    },
  ],
};
