import type { QuizQuestion } from "@/types/content";

/**
 * Elbow MRI pre/post knowledge assessment (primary-care sports-medicine audience).
 * Matched PARALLEL FORMS (shared parallelId): 12 parallel pairs across the 8 blueprint
 * domains (the four highest-yield domains carry a second pair) -> a 12-item pre form and
 * a 12-item post form that share NO items. Each post item sits at a different answer
 * position than its pre mate; no answer key dominates either form (each letter x3).
 * Authored from the MSK-verified blueprint + an adversarial item-writer/MSK verification.
 */
export const elbowPrePostQuizQuestions: QuizQuestion[] = [
  {
    "id": "elbow-q-protocol-pre",
    "domain": "elbow-orientation-protocol",
    "moduleId": "elbow-mri-orientation",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-protocol",
    "stem": "A 19-year-old collegiate baseball pitcher reports medial elbow pain at ball release and loss of velocity over the season. On the moving-valgus exam he is most tender through the late-cocking arc, and you suspect a partial undersurface tear of the anterior bundle of the UCL. A non-contrast 3T elbow MRI shows periligamentous edema but no clear surface-reaching defect, and the read is called equivocal. Which imaging step is most appropriate to answer the clinical question?",
    "options": [
      {
        "key": "A",
        "text": "MR arthrography of the elbow to look for contrast undercutting the sublime-tubercle attachment beyond the cartilage edge (the T-sign)"
      },
      {
        "key": "B",
        "text": "Repeat non-contrast MRI in a dedicated FABS (flexion-abduction-supination) position to grade the UCL"
      },
      {
        "key": "C",
        "text": "Routine elbow MR arthrography in an ABER position as the validated standard for every suspected UCL tear"
      },
      {
        "key": "D",
        "text": "No further imaging is needed; UCL partial tears are diagnosed on the common-flexor origin alone"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The clinical question is a suspected partial undersurface UCL tear after an equivocal non-contrast study, so the next step is MR arthrography: intra-articular contrast undercuts the sublime-tubercle attachment and reveals the T-sign (fluid/contrast tracking BEYOND the articular-cartilage edge while proximal fibers stay attached), and it is the most sensitive study for the undersurface tear. B is wrong because FABS is a dedicated DISTAL BICEPS footprint view (partial-vs-complete grading and retraction), not a UCL test. C is wrong because there is no validated routine elbow 'ABER' arthrogram; the elbow-specific evidence base for valgus/abduction positioning adjuncts is thin (unlike the shoulder ABER), and arthrography is added selectively, not for every suspected UCL tear. D is wrong because the common-flexor origin overlies but does not substitute for the UCL; you must image the ligament itself, and a partial undersurface tear is exactly what contrast is needed to confirm.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-protocol-post",
    "domain": "elbow-orientation-protocol",
    "moduleId": "elbow-mri-orientation",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-protocol",
    "stem": "A 47-year-old man felt a tearing pop in the antecubital fossa while lowering a heavy box and now has a painful, bruised proximal arm. On exam the hook test is difficult to interpret because of swelling, and you cannot tell whether the distal biceps tendon is partially or completely torn or how far any complete tear has retracted, which will determine whether the surgeon can do a direct anatomic repair. Which imaging approach most directly answers that question?",
    "options": [
      {
        "key": "A",
        "text": "Routine elbow MR arthrography, since intra-articular contrast is required to evaluate any suspected tendon tear"
      },
      {
        "key": "B",
        "text": "A coronal-only protocol, because the distal biceps and its retraction are best assessed on the coronal plane"
      },
      {
        "key": "C",
        "text": "MRI including a dedicated FABS (flexion-abduction-supination) view to lay the radial-tuberosity footprint flat for partial-vs-complete grading and retraction"
      },
      {
        "key": "D",
        "text": "MR arthrography in an elbow ABER position, the validated routine for distal biceps tears"
      }
    ],
    "correctAnswer": "C",
    "explanation": "The question is distal biceps partial-vs-complete plus retraction, and the FABS (flexion-abduction-supination, prone) view is the dedicated technique that lays the bifurcated radial-tuberosity footprint flat for partial-tear grading and for measuring how far a complete tear has retracted (also noting lacertus fibrosus status, which tethers the stump and can mask a complete tear). A is wrong because the distal biceps is an extra-articular structure best seen on non-contrast fluid-sensitive imaging; arthrography is reserved for intra-articular questions (T-sign, loose bodies, OCD stability) and is not required for a tendon tear. B is wrong because the distal biceps and its retraction are read on the SAGITTAL plane (and FABS), not coronal alone; coronal is the UCL/T-sign plane. D is wrong because there is no validated routine elbow 'ABER' arthrogram for the distal biceps; that conflates a shoulder positioning maneuver and the wrong contrast indication.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-search-pre",
    "domain": "elbow-search-pattern",
    "moduleId": "elbow-search-pattern",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-search",
    "stem": "A 46-year-old recreational tennis player has 5 months of refractory lateral elbow pain that worsened after a corticosteroid injection, plus a vague sense of the elbow 'giving way' when pushing up from a chair. Coronal T2 FS MRI shows a thickened, intermediate-to-fluid-bright common extensor origin with a deep, full-thickness gap at the lateral epicondyle that undercuts toward the radiocapitellar joint. The reading focuses on the extensor tendon and is about to sign the case as lateral epicondylitis. Which interpretation most appropriately completes the linked search and directs management?",
    "options": [
      {
        "key": "A",
        "text": "The full-thickness common-extensor gap is the entire lesion; report lateral epicondylitis and manage with rehab, since a tendon read does not require tracing the adjacent ligament"
      },
      {
        "key": "B",
        "text": "Trace the LUCL to the supinator crest, because a deep extensor tear undercutting the radiocapitellar joint can take the LUCL origin and produce posterolateral rotatory instability that changes management to ligament repair/reconstruction"
      },
      {
        "key": "C",
        "text": "Reactive lateral-epicondyle marrow edema accompanying the tendinosis is itself diagnostic of an LCL tear, so refer for reconstruction on that basis"
      },
      {
        "key": "D",
        "text": "Read the tendons before the bones and ligaments and call the case complete once the extensor tendon is graded, because the mechanical symptoms reflect simple tendinopathy"
      }
    ],
    "correctAnswer": "B",
    "explanation": "This is a satisfaction-of-search trap: after an obvious lateral epicondylitis you must complete the linked lateral search and trace the LUCL to the supinator crest. The LUCL/RCL origin lies deep to the common extensor tendon, so a deep, full-thickness extensor gap that undercuts/communicates with the radiocapitellar joint can take the LUCL and produce posterolateral rotatory instability (PLRI) — a surgical problem and a recognized complication of prior lateral steroid injection/release, fitting the 'giving way' history. That escalates from rehab to ligament repair/reconstruction, making B correct. A stops at the tendinopathy and misses the LUCL → PLRI — the named misconception. C over-calls reactive epicondyle marrow edema (and thin RCL signal) as an LCL tear, which the reference explicitly warns against; edema alone does not equal a ligament tear. D endorses reading tendons before bones/ligaments and signing off early — the exact habit the search pattern (bones/marrow and ligaments before satisfaction-of-search on a tendon) is built to prevent, and it ignores the instability symptoms.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-search-post",
    "domain": "elbow-search-pattern",
    "moduleId": "elbow-search-pattern",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-search",
    "stem": "A 24-year-old man is referred after an elbow dislocation that was reduced on the field; he now has recurrent instability with the forearm in varus and feels the elbow shift when bearing weight on a flexed arm. MRI/CT shows a torn LUCL at its humeral origin and a small fracture of the anteromedial facet of the coronoid; the radial head and the rest of the coronoid are intact, and the fragment measures only a few millimeters. The interpreting clinician notes the coronoid fragment is small and is inclined to treat it as a stable injury. Which interpretation most appropriately completes the post-dislocation search and directs management?",
    "options": [
      {
        "key": "A",
        "text": "Because the anteromedial facet fragment is only a few millimeters, it is mechanically stable and the elbow can be managed nonoperatively with early motion"
      },
      {
        "key": "B",
        "text": "The LUCL tear is the only relevant lesion; the small coronoid fragment can be ignored once the lateral ligament is documented"
      },
      {
        "key": "C",
        "text": "Reading the ligaments before the bones is acceptable here, so the coronoid does not need a dedicated review once the LUCL is called"
      },
      {
        "key": "D",
        "text": "Despite its small size, the anteromedial coronoid facet fracture with the LUCL injury indicates varus posteromedial rotatory instability and is surgical, so it must be reported and referred"
      }
    ],
    "correctAnswer": "D",
    "explanation": "In any post-dislocation elbow the read is a circle — LCL/LUCL, then the coronoid (including the anteromedial facet), then the radial head — and a small fragment does not mean a stable elbow. The anteromedial coronoid facet fracture looks small on imaging but, combined with an LUCL injury, defines varus posteromedial rotatory instability (VPMRI); it is highly unstable, surgical, and drives early arthrosis if missed, making D correct. A is the named misconception — judging the fragment stable because it looks small — when the anteromedial facet is precisely the small-but-unstable, surgical lesion. B stops at the LUCL and drops the coronoid, the satisfaction-of-search miss this concept targets. C endorses skipping a dedicated coronoid review after calling the ligament; the disciplined search reviews the bones/coronoid in every post-dislocation elbow rather than stopping once one structure is named.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-ocd-stability-pre",
    "domain": "elbow-bones-marrow-osteochondral",
    "moduleId": "elbow-bones-marrow",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-ocd-stability",
    "stem": "A 15-year-old competitive baseball pitcher has 3 months of lateral elbow pain and catching. Coronal and sagittal fat-suppressed T2 images show a focal anterolateral capitellar osteochondral lesion. A high-signal cartilage cleft extends from the articular surface down to the fragment interface, and the fragment is no longer congruent with the parent bone. There is no joint-fluid-signal line completely undercutting the fragment, but surrounding marrow edema is present. Which interpretation most appropriately drives management?",
    "options": [
      {
        "key": "A",
        "text": "The surrounding marrow edema is itself the instability sign, so this lesion is unstable on that basis and surgery is indicated"
      },
      {
        "key": "B",
        "text": "This is Panner disease, which is the same entity as capitellar OCD at this age and resolves with rest alone"
      },
      {
        "key": "C",
        "text": "The cartilage cleft reaching the fragment with loss of congruity makes this an unstable lesion; stop throwing and refer for surgical evaluation"
      },
      {
        "key": "D",
        "text": "Because no subchondral cyst measures at least 5 mm, the validated elbow criterion for instability is not met and continued throwing is appropriate"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Instability is judged by whether the fragment is mechanically compromised. A high-signal cartilage cleft (delamination) reaching the fragment is one of the recognized unstable signs — along with a fluid-bright line completely undercutting the fragment, a sizeable or multiple subchondral cysts, and a displaced fragment/loose body — and here the lesion has also lost congruity, so the correct action is to stop throwing and refer (C). Surrounding marrow edema alone is NOT a stability sign; it appears in both stable and unstable lesions, so it cannot by itself classify the lesion as unstable (A). Panner disease and OCD are different entities — Panner is an osteochondrosis of the entire ossific nucleus in a younger child (~5–10 yr) with no fragment or cyst, whereas this focal adolescent fragmenting lesion is OCD; they are not the same (B). The 5 mm cyst figure is a knee-derived (De Smet) criterion not validated for the capitellum, so the absence of a 5 mm cyst neither rules out instability nor justifies continued throwing — and a cartilage cleft reaching the fragment is already an unstable sign here regardless of cyst size (D).",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-ocd-stability-post",
    "domain": "elbow-bones-marrow-osteochondral",
    "moduleId": "elbow-bones-marrow",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-ocd-stability",
    "stem": "A 14-year-old gymnast has lateral elbow pain. Coronal and sagittal fat-suppressed T2 images show a focal capitellar osteochondral lesion with a continuous joint-fluid-signal line tracking completely beneath the fragment, separating it from the parent bone. The overlying cartilage and the demarcating margin are otherwise present, and there is mild surrounding marrow edema. Which interpretation most appropriately drives management?",
    "options": [
      {
        "key": "A",
        "text": "A fluid-bright line completely undercutting the fragment makes this an unstable lesion; stop the aggravating activity and refer for surgical evaluation"
      },
      {
        "key": "B",
        "text": "The surrounding marrow edema is the determining instability sign, so the fragment is unstable purely on that basis"
      },
      {
        "key": "C",
        "text": "Any isolated high-T2 line at the interface is definitely an unstable lesion even without a cartilage breach or cyst, so this is unstable for that reason"
      },
      {
        "key": "D",
        "text": "This is Panner disease rather than OCD, so it will remodel with rest and needs no stability assessment"
      }
    ],
    "correctAnswer": "A",
    "explanation": "A T2 fluid-bright line that completely undercuts the fragment and matches joint-fluid signal is the most reliable unstable sign in capitellar OCD — it indicates the fragment is no longer fixed to the parent bone — so the correct action is to stop the aggravating activity and refer (A). Surrounding marrow edema alone is NOT a stability criterion because it is present in both stable and unstable lesions; it cannot determine instability by itself (B). An ISOLATED high-T2 line without a cartilage breach or cyst is actually INDETERMINATE (it can be healing granulation tissue), not automatically unstable — the distinction here is that this line fully undercuts the fragment, which is what makes it unstable (C). Panner disease is a different entity from OCD — an osteochondrosis of the whole ossific nucleus in a younger child (~5–10 yr) with no fragment or undercutting fluid line — so calling this focal undercut fragment Panner and skipping the stability assessment is incorrect (D).",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-ucl-tsign-pre",
    "domain": "elbow-ucl-valgus",
    "moduleId": "elbow-ucl-valgus",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-ucl-tsign",
    "stem": "A 19-year-old college pitcher has medial elbow pain late in his throwing motion. Coronal T2 fat-saturated MR arthrography shows fluid/contrast tracking medially along the sublime tubercle and undercutting the distal attachment of the UCL anterior bundle BEYOND the edge of the articular cartilage, while the proximal fibers remain attached, forming an inverted 'T' with the joint-fluid column. There is no full-thickness gap or medial extravasation. The moving-valgus test reproduces his pain. How should this finding most appropriately direct management?",
    "options": [
      {
        "key": "A",
        "text": "The contrast tracking only a couple of millimetres under the most distal fibers is the expected normal distal synovial recess, so no UCL injury should be reported"
      },
      {
        "key": "B",
        "text": "Because distal UCL tears definitively outnumber proximal tears, the location alone confirms a full-thickness tear and mandates immediate Tommy John reconstruction"
      },
      {
        "key": "C",
        "text": "The partial-thickness MRI grade by itself dictates surgery, so proceed directly to reconstruction regardless of the athlete's demand or the moving-valgus exam"
      },
      {
        "key": "D",
        "text": "This is the T-sign of a partial undersurface (distal) UCL tear; manage by integrating the lesion features, the athlete's demand, and the moving-valgus exam rather than by the MRI grade alone"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Contrast undercutting the distal UCL attachment BEYOND the articular-cartilage edge while proximal fibers stay attached is the T-sign of a partial-thickness undersurface (articular-sided, distal) tear — the classic throwing injury, best shown on MR arthrography. The correct management integrates lesion features (location/surface, acute vs chronic), the athlete's demand, and the moving-valgus exam, not the MRI grade alone. Option A is the named recess trap: a couple of millimetres of undercutting can be a normal synovial recess, but here the fluid extends BEYOND the cartilage edge, which is the abnormal threshold — so this is not simply a normal recess. Option B is false on two counts: distal-versus-proximal predominance is genuinely not uniform in the literature (proximal partials are at least as common in several series), and an undersurface T-sign with intact proximal fibers is partial, not full-thickness, so it does not mandate reconstruction. Option C misstates management: no single MRI cutoff drives the decision — surgeons weight location, surface, chronicity, demand, and the moving-valgus exam, and most low-grade partials in throwers are managed nonoperatively first.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-ucl-tsign-post",
    "domain": "elbow-ucl-valgus",
    "moduleId": "elbow-ucl-valgus",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-ucl-tsign",
    "stem": "A 24-year-old javelin thrower has medial elbow pain at release. Coronal fluid-sensitive fat-saturated MRI (with intra-articular contrast) shows high-signal fluid undermining the sublime-tubercle insertion of the UCL anterior bundle and extending PAST the articular-cartilage margin, while the more proximal fibers stay attached and intact; no full-thickness defect or contrast extravasation is seen. Her moving-valgus test is positive in the painful arc. Which interpretation and management plan is most appropriate?",
    "options": [
      {
        "key": "A",
        "text": "The few millimetres of fluid under the most distal fibers represent the normal distal synovial recess, so the UCL should be reported as intact"
      },
      {
        "key": "B",
        "text": "This is the T-sign of a partial undersurface (distal) UCL tear; base management on the lesion features together with the athlete's demand and the moving-valgus exam, not on the MRI grade alone"
      },
      {
        "key": "C",
        "text": "Since distal tears definitively predominate over proximal tears, the distal location establishes a full-thickness tear and routine ulnar-nerve transposition should accompany the reconstruction"
      },
      {
        "key": "D",
        "text": "The partial-thickness grade on MRI alone determines the operation, so refer for reconstruction independent of her throwing demand or the moving-valgus exam"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Fluid undermining the distal/sublime-tubercle UCL attachment and extending BEYOND the articular-cartilage margin with intact proximal fibers is the T-sign of a partial-thickness undersurface (distal) tear. Management is driven by the lesion (location/surface, acute vs chronic), the athlete's demand, and the moving-valgus exam — not by the MRI grade in isolation. Option A is the recess trap: a sliver of undercutting can be a normal synovial recess, but fluid extending PAST the cartilage edge is the abnormal threshold, so this is a tear, not a normal recess. Option C is wrong twice over: distal-versus-proximal predominance is not uniform in the literature (it is not true that distal tears definitively predominate), an undersurface T-sign with attached proximal fibers is partial rather than full-thickness, and ulnar-nerve transposition with UCL reconstruction is SELECTIVE (for preoperative ulnar symptoms or instability), not routine. Option D misstates management: no single MRI grade dictates the operation — location, surface, chronicity, demand, and the moving-valgus exam together drive it, and most low-grade partials in throwers are treated nonoperatively first.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-lucl-plri-pre",
    "domain": "elbow-lcl-plri",
    "moduleId": "elbow-lcl-plri",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-lucl-plri",
    "stem": "A 24-year-old rock climber sustained a simple posterolateral elbow dislocation that was reduced on the field and is now concentrically reduced and stable on exam. MRI shows an avulsed lateral ulnar collateral ligament (LUCL) at the lateral epicondyle with intact medial structures, and a separate small anteromedial coronoid facet fragment with surrounding marrow edema. Which interpretation most accurately frames the instability and surgical risk in this elbow?",
    "options": [
      {
        "key": "A",
        "text": "The LUCL injury threatens posterolateral rotatory instability, while the anteromedial coronoid facet fracture is a distinct varus posteromedial rotatory instability lesion that is surgical despite its small size"
      },
      {
        "key": "B",
        "text": "The LUCL tear and the anteromedial coronoid facet fracture reflect the same single instability mechanism, so naming one is sufficient for the report"
      },
      {
        "key": "C",
        "text": "The anteromedial coronoid facet fragment is small and therefore mechanically stable, so it can be left out of the impression"
      },
      {
        "key": "D",
        "text": "Because the elbow dislocated, the primary lesion is a torn medial (ulnar) collateral ligament, and valgus is the only post-traumatic instability to address"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The LUCL (lateral epicondyle → posterior to the radial head → supinator crest) is the principal restraint to posterolateral rotatory instability (PLRI), so its avulsion must be flagged in any post-dislocation elbow. The anteromedial coronoid facet fracture is a SEPARATE, distinct mechanism — varus posteromedial rotatory instability (VPMRI) — and although the fragment looks small on radiographs it is highly unstable and surgical, with untreated VPMRI driving early arthrosis; A captures both correctly. B is wrong because PLRI and VPMRI are different mechanisms, not one lesion. C is wrong because at the coronoid 'small does not mean stable' — the anteromedial facet fragment is the classic small-but-unstable surgical lesion. D inverts the O'Driscoll circle: a simple dislocation disrupts soft tissue lateral-to-medial (LUCL → capsule → MCL), so the LCL — not the MCL — is the primary lesion in most simple dislocations, and valgus is not the only post-traumatic instability.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-lucl-plri-post",
    "domain": "elbow-lcl-plri",
    "moduleId": "elbow-lcl-plri",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-lucl-plri",
    "stem": "A 31-year-old laborer is referred 8 weeks after a simple elbow dislocation with recurrent painful clicking and a positive lateral pivot-shift apprehension sign. MRI demonstrates an attenuated, surface-disrupted lateral ulnar collateral ligament arcing from the lateral epicondyle toward the supinator crest, plus a small anteromedial coronoid facet fracture. The medial (ulnar) collateral ligament is intact. Which interpretation best characterizes the two findings and their surgical relevance?",
    "options": [
      {
        "key": "A",
        "text": "Because the elbow dislocated, the dominant lesion is an ulnar collateral ligament tear and valgus is the only meaningful post-traumatic instability"
      },
      {
        "key": "B",
        "text": "The anteromedial coronoid facet fragment is small, so it is stable and need not change management"
      },
      {
        "key": "C",
        "text": "The lateral ulnar collateral ligament injury underlies posterolateral rotatory instability, and the anteromedial coronoid facet fracture is a separate varus posteromedial rotatory instability lesion that is surgical even though it is small"
      },
      {
        "key": "D",
        "text": "The lateral ulnar collateral ligament tear and the anteromedial coronoid facet fracture are simply two expressions of one and the same instability mechanism"
      }
    ],
    "correctAnswer": "C",
    "explanation": "The LUCL (lateral epicondyle → posterior to the radial head → supinator crest) is the key restraint to posterolateral rotatory instability (PLRI), which fits this patient's recurrent clicking and positive pivot-shift; its competence must be commented on in every post-dislocation elbow. The anteromedial coronoid facet fracture is a DISTINCT lesion of varus posteromedial rotatory instability (VPMRI) — small on radiographs but highly unstable and surgical — so C is correct. A inverts the O'Driscoll circle: simple dislocations disrupt lateral-to-medial (LUCL → capsule → MCL), making the LCL, not the MCL, the primary lesion, so valgus is not the only post-traumatic instability. B is wrong because at the coronoid 'small does not mean stable' — the anteromedial facet fragment is the classic small-but-unstable surgical fracture. D is wrong because PLRI and VPMRI are two separate mechanisms, not one.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-biceps-lacertus-pre",
    "domain": "elbow-tendons-biceps-triceps-epicondylitis",
    "moduleId": "elbow-tendons",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-biceps-lacertus",
    "stem": "A 47-year-old man felt a painful 'pop' in the front of his elbow lifting a heavy box 8 days ago. He has antecubital bruising but, surprisingly, near-normal flexion and supination strength on exam. MRI shows the distal biceps tendon completely discontinuous at the radial tuberosity with an empty footprint, yet the stump is held at the level of the tuberosity with only minimal retraction; the lacertus fibrosus is intact and taut. How should this finding most appropriately direct management?",
    "options": [
      {
        "key": "A",
        "text": "Because strength is preserved and the tendon has not retracted, call this a partial tear and manage nonoperatively with rehabilitation"
      },
      {
        "key": "B",
        "text": "Recognize a complete distal biceps tear tethered by an intact lacertus and refer for surgical repair, noting the intact lacertus masks the injury clinically and limits retraction"
      },
      {
        "key": "C",
        "text": "Attribute the symptoms to bicipitoradial bursitis as the primary diagnosis and treat with an image-guided corticosteroid injection"
      },
      {
        "key": "D",
        "text": "Defer any referral and plan for tendon grafting only if he presents again beyond a fixed 6-week window"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The tendon is fully discontinuous with an empty footprint, so this is a COMPLETE tear regardless of preserved strength or minimal retraction. An intact lacertus fibrosus tethers the stump, limits proximal retraction, and can mask a complete tear both clinically (preserved flexion/supination) and on imaging — the classically missed complete tear — but it is still a surgical repair. Calling it a partial tear (A) is the trap: completeness is defined by discontinuity at the footprint, not by retraction or strength. Bicipitoradial bursitis is only a CLUE to scrutinize the insertion, not the diagnosis, and steroid injection (C) does not address a torn tendon. Surgical timing is a guideline, not a hard deadline: earlier anatomic repair is technically easier, and many primary repairs succeed at and beyond ~4-6 weeks, so withholding referral pending an arbitrary 6-week graft cutoff (D) is wrong — referral is appropriate now.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-biceps-lacertus-post",
    "domain": "elbow-tendons-biceps-triceps-epicondylitis",
    "moduleId": "elbow-tendons",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-biceps-lacertus",
    "stem": "A 52-year-old roofer on chronic dialysis fell onto his hand and now cannot extend the elbow against gravity. MRI shows the triceps tendon torn across roughly 70% of its width at the olecranon insertion, with a fluid-filled gap involving the deep central fibers and a thin intact superficial expansion; a small avulsed osseous flake sits adjacent to the olecranon. How should this finding most appropriately direct management?",
    "options": [
      {
        "key": "A",
        "text": "Because the superficial expansion is intact and it is not a full-thickness gap, label it triceps tendinosis and manage with activity modification alone"
      },
      {
        "key": "B",
        "text": "Diagnose olecranon bursitis as the cause of the weakness and arrange aspiration of the bursa"
      },
      {
        "key": "C",
        "text": "Withhold any surgical referral unless follow-up imaging beyond a fixed 6-week deadline shows further retraction"
      },
      {
        "key": "D",
        "text": "Recognize a high-grade partial triceps tear with extension weakness and refer for surgical repair, since deep-fiber tears with weakness are repaired and the intact superficial expansion makes the tear look milder than it is"
      }
    ],
    "correctAnswer": "D",
    "explanation": "The deep central triceps fibers fail first while the superficial expansion can stay intact, so a clinically near-complete injury can look only partial on imaging. A high-grade partial (commonly >50% width torn, or ANY tear with extension weakness against resistance) is a surgical lesion and should not be undercalled — here a ~70% deep-fiber tear with loss of active extension and an avulsed flake clinches it. Calling it tendinosis because the superficial layer is intact (A) is exactly the undercall to avoid, since the patient cannot extend against gravity. Olecranon bursitis (B) does not produce extension weakness or an insertional tendon gap and would not explain these findings. Surgical timing is a guideline, not a fixed deadline, and a repairable tendon tear should be referred now rather than waiting for an arbitrary 6-week cutoff before acting (C).",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-nerve-localize-pre",
    "domain": "elbow-nerves-entrapment",
    "moduleId": "elbow-nerves",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-nerve-localize",
    "stem": "A 22-year-old pitcher reports 5 weeks of medial elbow discomfort and a weak pinch grip; he cannot make a normal 'OK' sign and the distal thumb and index finger collapse. Sensation is fully intact throughout the hand. Elbow MRI shows STIR hyperintensity isolated to the pronator quadratus, flexor pollicis longus, and the index/middle portions of flexor digitorum profundus, with no muscle change in flexor carpi ulnaris, the ulnar intrinsics, or the extensor compartment, and no discrete compressive mass. Which interpretation is most appropriate?",
    "options": [
      {
        "key": "A",
        "text": "Posterior interosseous nerve entrapment at the arcade of Frohse, supported by the supinator and extensor denervation pattern"
      },
      {
        "key": "B",
        "text": "Ulnar neuropathy at the cubital tunnel, because mild nerve T2 signal at the medial epicondyle is enough to confirm entrapment"
      },
      {
        "key": "C",
        "text": "An anterior interosseous nerve (Kiloh-Nevin) pattern; because an AIN palsy is frequently Parsonage-Turner rather than compression, pivot to EMG and observation before any decompression"
      },
      {
        "key": "D",
        "text": "An acute denervation pattern that must have arisen within the past few days given the muscle edema"
      }
    ],
    "correctAnswer": "C",
    "explanation": "The denervation pattern localizes the lesion: isolated edema in pronator quadratus, FPL, and the index/middle FDP with no sensory loss is the pure-motor anterior interosseous nerve (Kiloh-Nevin) distribution, and the inability to flex the distal thumb/index ('OK' sign) confirms it. The key teaching point is that an AIN palsy is frequently neuralgic amyotrophy (Parsonage-Turner) rather than mechanical compression, so the work-up pivots to EMG/observation and surgery is usually NOT indicated. Option A is wrong on localization and on a named misconception: PIN entrapment denervates the EXTENSOR compartment with radially-deviated wrist extension, not the PQ/FPL/FDP flexors, and the supinator is variably involved/often spared rather than a constant PIN feature. Option B applies the wrong nerve and the wrong rule: mild ulnar T2 brightness alone does not diagnose entrapment, which must be anchored to caliber change plus FCU/ulnar-FDP/intrinsic denervation against the contralateral side and the ipsilateral median internal control. Option D is wrong on the denervation timeline: there is NO MRI muscle change in the first roughly 2-4 weeks, then subacute T2/STIR edema appears, so the edema cannot date the injury to the past few days.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-nerve-localize-post",
    "domain": "elbow-nerves-entrapment",
    "moduleId": "elbow-nerves",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-nerve-localize",
    "stem": "A 48-year-old recreational tennis player has 6 weeks of difficulty extending the fingers, and on exam the wrist extends with marked radial deviation while finger and thumb extension are weak; sensation over the dorsal hand is normal. Elbow MRI shows STIR hyperintensity throughout the extensor digitorum, extensor digiti minimi, extensor carpi ulnaris, and the thumb extensors, while the supinator shows no signal change; flexor carpi ulnaris and the ulnar intrinsics are normal. Which interpretation is most appropriate?",
    "options": [
      {
        "key": "A",
        "text": "Posterior interosseous nerve entrapment at the arcade of Frohse; the spared supinator does not exclude it, because supinator denervation is variable and often absent rather than a constant feature"
      },
      {
        "key": "B",
        "text": "Ulnar neuropathy at the cubital tunnel, since the extensor-compartment edema reflects ulnar intrinsic denervation"
      },
      {
        "key": "C",
        "text": "An anterior interosseous nerve palsy, which always requires surgical decompression once muscle edema is seen"
      },
      {
        "key": "D",
        "text": "Denervation that must be only a few days old because muscle T2 hyperintensity is already present"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The denervation pattern localizes the lesion: edema confined to the extensor compartment (extensor digitorum, EDM, ECU, thumb extensors) with motor finger drop and radially-deviated wrist extension (ECRL spared) is the posterior interosseous nerve, which is most commonly compressed at the arcade of Frohse. The trap is the normal supinator: its branches frequently arise proximal to the arcade, so the supinator is variably involved and often spared, and a normal supinator does NOT exclude PIN entrapment. Option B misapplies the ulnar nerve: ulnar neuropathy denervates FCU, the ulnar FDP, and the ulnar intrinsics, not the extensor compartment, and intrinsic edema would not explain an extensor-compartment pattern. Option C states a named misconception: an AIN palsy is frequently Parsonage-Turner rather than compression, so it usually does NOT need decompression and the work-up pivots to EMG/observation; this case is in any event a PIN, not AIN, distribution. Option D is wrong on the denervation timeline: there is NO MRI muscle change for roughly the first 2-4 weeks before subacute T2/STIR edema develops, so the edema cannot date the lesion to a few days.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-dontmiss-pre",
    "domain": "elbow-dont-miss",
    "moduleId": "elbow-dont-miss",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-dontmiss",
    "stem": "A 54-year-old plumber presents after a week of progressive posterior elbow swelling, low-grade fever, and a tender, warm, erythematous fluctuant olecranon prominence. An elbow MRI is obtained and shows a distended olecranon bursa with complex fluid, wall thickening, and surrounding soft-tissue edema; the underlying joint, marrow, and tendons are unremarkable. Which step is the most appropriate next management?",
    "options": [
      {
        "key": "A",
        "text": "Report the complex bursal fluid as an aseptic (gout/repetitive-trauma) bursitis, since the joint and marrow are normal, and treat with compression and NSAIDs"
      },
      {
        "key": "B",
        "text": "Recommend MR arthrography to confirm whether the bursa communicates with the joint before any intervention"
      },
      {
        "key": "C",
        "text": "Interpret the complex bursal fluid and wall thickening as confidently excluding infection, and start oral anti-inflammatories alone"
      },
      {
        "key": "D",
        "text": "Aspirate the bursa for Gram stain, culture, and crystals, because MRI cannot reliably exclude septic bursitis in a warm, fluctuant bursa"
      }
    ],
    "correctAnswer": "D",
    "explanation": "A red, warm, fluctuant olecranon bursa with systemic signs must be aspirated for Gram stain, culture, and crystals: MRI cannot reliably distinguish septic from aseptic bursitis, so imaging features alone cannot exclude infection (D). Calling it aseptic gout/trauma bursitis because the joint and marrow look normal (A) is unsafe, since septic bursitis can be superficial and spare the joint. MR arthrography (B) adds cost and delay, does not answer the infection question, and is not indicated here. Treating it as confidently non-infected on signal characteristics (C) is exactly the misconception to avoid: complex fluid and wall thickening occur in both septic and aseptic bursitis. The management-changing don't-miss step is the diagnostic aspiration.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-dontmiss-post",
    "domain": "elbow-dont-miss",
    "moduleId": "elbow-dont-miss",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-dontmiss",
    "stem": "A 39-year-old recreational weightlifter is sent in with 10 days of a tender, hot, red, fluctuant swelling over the point of the elbow and a temperature of 38.1 C. MRI demonstrates a fluid-filled, thick-walled olecranon bursa with heterogeneous internal signal and adjacent subcutaneous edema; the elbow joint, articular cartilage, and marrow signal are normal. What is the most appropriate next step in management?",
    "options": [
      {
        "key": "A",
        "text": "Conclude the heterogeneous bursal fluid reflects a chronic aseptic (repetitive-trauma) bursitis and manage with an elbow pad and activity modification"
      },
      {
        "key": "B",
        "text": "Aspirate the bursa and send fluid for Gram stain, culture, and crystal analysis, since MRI cannot reliably exclude a septic bursitis"
      },
      {
        "key": "C",
        "text": "Treat empirically as a gout flare with colchicine alone on the basis of the imaging appearance, without sampling the fluid"
      },
      {
        "key": "D",
        "text": "Obtain a post-contrast MRI to determine from the enhancement pattern whether the bursa is infected before deciding on treatment"
      }
    ],
    "correctAnswer": "B",
    "explanation": "A hot, red, fluctuant olecranon bursa with fever requires aspiration for Gram stain, culture, and crystals because MRI cannot reliably separate septic from aseptic bursitis, and a normal-appearing joint and marrow do not exclude superficial infection (B). Labeling it a chronic aseptic repetitive-trauma bursitis from the imaging (A) or treating it empirically as gout without sampling (C) both commit the error that imaging or pattern recognition can exclude infection. A post-contrast MRI (D) cannot reliably make the septic-versus-aseptic distinction either, so it adds delay without answering the question. Fluid sampling is the definitive, management-changing step.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-ucl-chronic-pre",
    "domain": "elbow-ucl-valgus",
    "moduleId": "elbow-ucl-valgus",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-ucl-chronic",
    "stem": "A 24-year-old college pitcher has 4 months of medial elbow pain that builds across an outing without a single 'pop.' Coronal T2 FS MRI shows a thickened, heterogeneous UCL anterior bundle with a small ossific focus at the sublime tubercle and mild traction marrow change, but no fluid-bright full-thickness gap or retraction. On dynamic valgus-stress ultrasound the medial ulnohumeral joint opens 2 mm more than the contralateral asymptomatic elbow during applied valgus. He wants to keep pitching competitively. Which interpretation most appropriately drives the management conversation?",
    "options": [
      {
        "key": "A",
        "text": "The thickening, sublime-tubercle ossification, and traction change indicate chronic valgus overload, and the side-to-side dynamic-US gapping difference adds the functional instability data that the static MRI cannot, so the repair-versus-reconstruction discussion is driven by chronicity, lesion features, and his demand together"
      },
      {
        "key": "B",
        "text": "The ossific focus at the sublime tubercle establishes an acute full-thickness UCL avulsion, so he should be referred directly for urgent reconstruction"
      },
      {
        "key": "C",
        "text": "Because the static MRI shows no full-thickness gap, the dynamic ultrasound is unnecessary and he can be cleared to keep pitching without further instability assessment"
      },
      {
        "key": "D",
        "text": "Any UCL that is thickened on MRI meets the threshold for reconstruction, so the imaging alone mandates Tommy John surgery regardless of the exam"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The thickened, heterogeneous, ossified UCL with sublime-tubercle traction marrow change is the picture of CHRONIC valgus overload, not an acute event, and the painless gradual onset fits. Static MRI grades the ligament but cannot quantify functional instability; dynamic valgus-stress ultrasound supplies that, where a side-to-side medial-gapping difference on the order of ~1-2 mm (thresholds vary by study) is the commonly cited functional-instability range. Repair +/- internal brace versus reconstruction is then decided by location, surface, acute-vs-chronic tissue quality, and athlete demand together, not by any single MRI number (A). The ossific focus at the sublime tubercle is a chronic traction change, NOT proof of an acute full-thickness avulsion (B). The dynamic ultrasound is precisely what static MRI cannot replace for functional gapping, so skipping it and clearing him is wrong (C). Not every thickened UCL needs reconstruction; thickening alone is not a surgical threshold (D).",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-ucl-chronic-post",
    "domain": "elbow-ucl-valgus",
    "moduleId": "elbow-ucl-valgus",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-ucl-chronic",
    "stem": "A 27-year-old javelin thrower reports a season of progressively worsening medial elbow pain that fades with rest and returns with throwing, never with a discrete tearing event. Coronal T2 FS MRI shows an attenuated, irregularly thickened UCL anterior bundle with low-signal ossification along the sublime tubercle and adjacent traction marrow edema, without a fluid-filled full-thickness defect or fiber retraction. He asks whether the scan alone settles whether he needs surgery. Which interpretation most appropriately frames the next step?",
    "options": [
      {
        "key": "A",
        "text": "The sublime-tubercle ossification proves an acute full-thickness UCL rupture, so he should bypass any further testing and proceed to reconstruction"
      },
      {
        "key": "B",
        "text": "Because any visible UCL thickening crosses the operative threshold, the MRI by itself dictates ligament reconstruction"
      },
      {
        "key": "C",
        "text": "The attenuation, thickening, ossification, and traction edema indicate chronic valgus overload, and adding dynamic valgus-stress ultrasound to measure side-to-side medial gapping supplies the functional-instability data the static MRI cannot, so management is decided by chronicity, lesion features, and demand together rather than a single MRI cutoff"
      },
      {
        "key": "D",
        "text": "Since the static MRI shows no full-thickness gap, dynamic ultrasound adds nothing and he can return to throwing without an instability assessment"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Attenuation with irregular thickening, sublime-tubercle ossification, and traction marrow edema, plus a gradual, rest-responsive course, is the signature of CHRONIC valgus overload rather than an acute tear. The static MRI characterizes the ligament but cannot measure functional instability, so the appropriate next step is dynamic valgus-stress ultrasound; a side-to-side medial-gapping difference on the order of ~1-2 mm (thresholds vary by study) is the commonly cited functional-instability range. The decision between repair +/- internal brace and reconstruction then turns on location, surface, acute-vs-chronic tissue, and athlete demand together, not a single MRI cutoff (C). Sublime-tubercle ossification is a chronic traction change, not proof of an acute full-thickness rupture (A). Thickening alone is not an operative threshold, so the MRI cannot dictate reconstruction by itself (D refers to clearing him, B to mandating surgery)—and skipping the dynamic ultrasound discards exactly the functional gapping data static MRI cannot provide (D).",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-little-league-pre",
    "domain": "elbow-bones-marrow-osteochondral",
    "moduleId": "elbow-bones-marrow",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-little-league",
    "stem": "A 12-year-old Little League pitcher has medial elbow pain that started after a hard throw two innings into a game; he could not finish pitching. Elbow MRI shows the medial epicondyle apophysis avulsed and displaced about 7 mm, with the bony fragment lying within the ulnohumeral joint and a moderate effusion. On the coronal images the trochlear ossification center is visible but the medial epicondyle is no longer in its normal position. What is the most appropriate management?",
    "options": [
      {
        "key": "A",
        "text": "Throwing rest alone, because a widened fluid-bright physis with marrow edema and no fragment heals nonoperatively"
      },
      {
        "key": "B",
        "text": "Refer for surgical fixation, because the fragment is displaced and incarcerated in the joint"
      },
      {
        "key": "C",
        "text": "Reassure that a visible trochlea without a visible medial epicondyle simply means the epicondyle has not yet ossified per the fixed CRITOE ages, and continue pitching"
      },
      {
        "key": "D",
        "text": "Treat as capitellar osteochondritis dissecans and obtain MR arthrography to grade the lesion"
      }
    ],
    "correctAnswer": "B",
    "explanation": "This is a displaced, intra-articular (incarcerated) medial epicondyle avulsion, and either intra-articular incarceration OR valgus instability mandates surgical fixation regardless of the millimetre number; here the ~7 mm displacement also exceeds the widely taught ~5 mm throwing-athlete trigger, so the fragment must be retrieved and fixed rather than rested. The CRITOE clue confirms it: the trochlea never ossifies before the medial epicondyle, so 'seeing' the trochlea but not the epicondyle means the epicondyle has been avulsed — often into the joint. Option A describes simple Little League apophysitis (a widened, fluid-bright physis with edema and NO displaced fragment), which is the nonoperative entity — but this case has a displaced incarcerated fragment, so rest alone is wrong. Option C misapplies CRITOE: the exact ossification ages are only approximate, the robust rule is the ORDER, and a missing epicondyle with a present trochlea signals avulsion, not normal sequential ossification — returning to pitch would be dangerous. Option D mistakes a medial-sided bony avulsion for capitellar OCD/Panner, which is a lateral-compartment osteochondral lesion of the capitellum, not a displaced apophyseal fragment, and arthrography would only delay needed surgery.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-little-league-post",
    "domain": "elbow-bones-marrow-osteochondral",
    "moduleId": "elbow-bones-marrow",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-little-league",
    "stem": "A 13-year-old catcher who also pitches felt a sudden medial pop while throwing a runner out and now has medial elbow pain and a sense of the elbow 'opening up' with valgus stress. His elbow had briefly dislocated and reduced on the field. MRI shows the medial epicondyle apophysis avulsed; the fragment is displaced roughly 3 mm and sits at the medial joint margin, and there is medial ulnohumeral gapping on the valgus-stressed views. On coronal images the trochlear ossification center is present while the medial epicondyle is absent from its expected site. What is the most appropriate management?",
    "options": [
      {
        "key": "A",
        "text": "Continue throwing rest only, treating this as Little League apophysitis with a widened fluid-bright physis and no fragment"
      },
      {
        "key": "B",
        "text": "Reassure that the absent medial epicondyle with a visible trochlea reflects the fixed CRITOE ossification ages and clear him to return to catching"
      },
      {
        "key": "C",
        "text": "Diagnose Panner disease of a normal secondary ossification center and manage conservatively with observation"
      },
      {
        "key": "D",
        "text": "Refer for surgical fixation, because demonstrated valgus instability mandates surgery regardless of the millimetre displacement"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Even though the fragment is displaced only ~3 mm — below the often-cited ~5 mm throwing-athlete threshold — demonstrated valgus instability (medial gapping after a transient dislocation) is an independent operative trigger that mandates surgery regardless of the millimetre number, so the right move is comparing to the clinical/dynamic picture rather than a hard mm cutoff and referring for fixation. The CRITOE clue supports avulsion: because the trochlea never ossifies before the medial epicondyle, a present trochlea with an absent epicondyle means the epicondyle has avulsed (here also at risk of joint incarceration after the dislocation). Option A is the trap of treating an unstable displaced avulsion as simple apophysitis — apophysitis is a widened, fluid-bright physis with edema and NO displaced fragment and NO instability, which is not this case. Option B misuses CRITOE: the exact ages are only approximate and the reliable rule is the ORDER, so a missing epicondyle beside a visible trochlea signals avulsion, not normal sequential ossification — clearing him to catch would be unsafe. Option C is wrong because Panner is a self-limited osteochondrosis of the entire capitellar (lateral) ossific nucleus in a younger child, not a displaced medial apophyseal fragment with valgus instability, and calling it a normal center would miss a surgical injury.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-lat-epi-lucl-pre",
    "domain": "elbow-tendons-biceps-triceps-epicondylitis",
    "moduleId": "elbow-tendons",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-lat-epi-lucl",
    "stem": "A 47-year-old right-handed carpenter has 9 months of refractory lateral elbow pain that worsened after two prior corticosteroid injections, and now reports a sense of the elbow 'giving way' when he pushes up from a chair. Elbow MRI shows a deep, full-thickness gap in the common extensor (ECRB) origin with fluid-bright signal that undercuts and communicates with the radiocapitellar joint, and the high-signal cleft extends into and disrupts the lateral ulnar collateral ligament traced toward the supinator crest. Which interpretation most appropriately directs management?",
    "options": [
      {
        "key": "A",
        "text": "High-grade lateral epicondylitis is always managed with arthroscopic or open extensor debridement, so refer for routine tendon debridement alone"
      },
      {
        "key": "B",
        "text": "The reactive marrow edema at the lateral epicondyle and the thin adjacent radial collateral ligament signal are the true findings, indicating an isolated low-grade LCL sprain to manage conservatively"
      },
      {
        "key": "C",
        "text": "A full-thickness common-extensor tear that undercuts the radiocapitellar joint and involves the LUCL implies posterolateral rotatory instability, so refer for ligament repair/reconstruction rather than routine debridement"
      },
      {
        "key": "D",
        "text": "Tendinosis and a full-thickness extensor gap carry the same grade and prognosis, so the gap does not change the plan from a standard tendinopathy program"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Tracing the LUCL to the supinator crest is the discipline that separates ordinary tennis elbow from an instability lesion. A deep/full-thickness common-extensor (ECRB) tear whose fluid-bright gap undercuts and communicates with the radiocapitellar joint AND disrupts the LUCL implies posterolateral rotatory instability (PLRI) — a classic complication of prior lateral steroid injection/release — and is a ligament repair/reconstruction problem, not a routine debridement. (A) is the trap that high-grade lateral epicondylitis is 'always just a debridement'; debriding the tendon without addressing the incompetent LUCL leaves the instability uncorrected. (B) mistakes reactive lateral-epicondyle marrow edema and thin RCL signal — expected companions of epicondylitis — for the lesion and undercalls a documented LUCL disruption with mechanical symptoms; thin RCL signal is not an LCL tear. (D) is wrong because tendinosis and a full-thickness gap are NOT graded the same: the surface-reaching, joint-communicating, ligament-involving gap is exactly what escalates management.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-lat-epi-lucl-post",
    "domain": "elbow-tendons-biceps-triceps-epicondylitis",
    "moduleId": "elbow-tendons",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-lat-epi-lucl",
    "stem": "A 52-year-old recreational tennis player has lateral elbow pain that never settled after a prior lateral-release procedure, and she now describes painful clicking and apprehension when she extends the loaded elbow. Elbow MRI demonstrates a full-thickness defect of the common extensor (ECRB) origin with a fluid-bright cleft that undercuts and communicates with the radiocapitellar joint and extends into the lateral ulnar collateral ligament followed toward the supinator crest, with mild posterolateral radiocapitellar incongruity. Which interpretation most appropriately directs management?",
    "options": [
      {
        "key": "A",
        "text": "A full-thickness common-extensor tear that undercuts the radiocapitellar joint and involves the LUCL implies posterolateral rotatory instability, so refer for ligament repair/reconstruction rather than routine debridement"
      },
      {
        "key": "B",
        "text": "High-grade lateral epicondylitis is always treated by extensor debridement, so refer for a routine tendon debridement and expect resolution"
      },
      {
        "key": "C",
        "text": "The lateral-epicondyle marrow edema and a thin reactive radial collateral ligament signal are the real abnormality, so call it a minor LCL sprain and continue a home program"
      },
      {
        "key": "D",
        "text": "It is medial epicondylitis that involves the LUCL, so this lateral finding is incidental and the LUCL does not need to be addressed"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Following the LUCL to the supinator crest is what converts a refractory 'tennis elbow' read into an instability diagnosis. A full-thickness common-extensor (ECRB) tear whose fluid-bright cleft undercuts and communicates with the radiocapitellar joint AND disrupts the LUCL — here with posterolateral radiocapitellar incongruity, a secondary PLRI sign, after a prior lateral release — implies posterolateral rotatory instability and is a ligament repair/reconstruction problem, not a routine debridement. (B) is the misconception that high-grade lateral epicondylitis is 'always just a debridement'; debriding the tendon alone leaves the incompetent LUCL and the instability unaddressed. (C) mistakes reactive lateral-epicondyle marrow edema and thin RCL signal — normal companions of epicondylitis — for the lesion and undercalls a real LUCL disruption; thin RCL signal is not an LCL tear. (D) reverses the pairing: it is LATERAL epicondylitis whose deep extensor tear can take the LUCL (PLRI), whereas MEDIAL epicondylitis pairs with the UCL — so the LUCL involvement here is central to the plan, not incidental.",
    "cognitiveLevel": "analyze"
  },
  {
    "id": "elbow-q-ulnar-sublux-pre",
    "domain": "elbow-nerves-entrapment",
    "moduleId": "elbow-nerves",
    "prePostMapping": "parallel-pre",
    "parallelId": "elbow-q-ulnar-sublux",
    "stem": "A 24-year-old right-handed pitcher has medial elbow aching and intermittent little-finger numbness that worsens with throwing. A dedicated elbow MRI obtained with the elbow flexed shows the ulnar nerve enlarged with T2 hyperintensity at the medial epicondyle, and on the flexed axial images the nerve perches on and rides anteriorly over the tip of the medial epicondyle. There is mild denervation edema in the flexor carpi ulnaris. The referring surgeon plans an in-situ cubital tunnel decompression. What is the most appropriate way the MRI should shape that operative plan?",
    "options": [
      {
        "key": "A",
        "text": "Recommend in-situ decompression as planned, because dynamic subluxation of the nerve does not change the choice of operation"
      },
      {
        "key": "B",
        "text": "Report only 'ulnar neuritis,' since T2 signal in the nerve is sufficient and the nerve's position is a normal finding to ignore"
      },
      {
        "key": "C",
        "text": "Hold any surgical comment because nerve T2 hyperintensity alone, without attention to caliber or muscle denervation, establishes the diagnosis"
      },
      {
        "key": "D",
        "text": "Report the dynamic anterior subluxation of the ulnar nerve over the medial epicondyle as the structural driver, which favors transposition over in-situ decompression"
      }
    ],
    "correctAnswer": "D",
    "explanation": "The management-changing finding is the structural cause, not the signal alone. Anterior flexion subluxation of the ulnar nerve over the medial epicondyle is a recognized reason to favor anterior transposition over a simple in-situ decompression, because in-situ release leaves the nerve free to keep subluxating; the report should name that dynamic instability rather than stopping at 'neuritis.' (A) is wrong because dynamic subluxation specifically does change the operation — it is the classic indication to transpose. (B) is wrong because the subluxating position is the key abnormal finding, not a normal variant to ignore, and 'neuritis' alone omits the driver of the surgical decision. (C) is wrong because the diagnosis is anchored to caliber change plus muscle denervation plus clinical correlation — mild ulnar-nerve T2 brightness can be normal, so signal alone is not enough.",
    "cognitiveLevel": "apply"
  },
  {
    "id": "elbow-q-ulnar-sublux-post",
    "domain": "elbow-nerves-entrapment",
    "moduleId": "elbow-nerves",
    "prePostMapping": "parallel-post",
    "parallelId": "elbow-q-ulnar-sublux",
    "stem": "A 32-year-old recreational weightlifter reports a painful snapping at the inner elbow with repeated flexion and new ulnar-sided hand tingling. On flexed-elbow axial MRI, BOTH the medial head of the triceps and the ulnar nerve displace anteriorly over the medial epicondyle during flexion, and the ulnar nerve is mildly enlarged with denervation edema in the first dorsal interosseous. The consulting team proposes a standard in-situ ulnar nerve decompression alone. How should the MRI most appropriately influence the plan?",
    "options": [
      {
        "key": "A",
        "text": "Endorse in-situ decompression alone, since the snapping triceps is incidental and needs no specific surgical treatment"
      },
      {
        "key": "B",
        "text": "Report the snapping triceps with concurrent ulnar nerve subluxation as the structural cause, which favors transposition and means the triceps itself must be addressed, not just the nerve"
      },
      {
        "key": "C",
        "text": "Describe 'ulnar neuritis' only, treating the anterior position of the nerve and triceps in flexion as a normal finding that does not alter management"
      },
      {
        "key": "D",
        "text": "Make the diagnosis on the nerve's T2 signal alone, without weighting nerve caliber change or muscle denervation"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Snapping triceps — the medial triceps head subluxating over the medial epicondyle together with the ulnar nerve in flexion — is the structural diagnosis that changes the operation: it favors transposition, and the triceps itself must be addressed, because transposing or decompressing the nerve alone leaves the snapping triceps to continue irritating it and the symptoms recur. (A) is wrong because the snapping triceps is not incidental; failing to treat it is a setup for persistent symptoms. (C) is wrong because the dynamic subluxation of both structures is the management-changing finding, not a normal variant, and 'neuritis' alone hides the driver of the decision. (D) is wrong because the diagnosis rests on caliber change plus muscle denervation plus clinical correlation — mild ulnar-nerve T2 hyperintensity occurs in asymptomatic elbows, so signal alone is insufficient.",
    "cognitiveLevel": "apply"
  }
];
