import type { MeasurementSection } from "@/components/ui/MeasurementsCard";

/**
 * Hip MRI Quick Reference content. Rendered with the shared collapsible section
 * renderer (MeasurementsCard), mirroring the Shoulder reference. Concise and
 * management-focused for primary-care sports-medicine fellows. Authored and
 * MSK-radiologist–verified, and kept consistent with the Hip course modules/cases
 * (stellate lesion is superomedial; radiograph-negative double-line = ARCO I; the
 * alpha angle is measured on oblique-axial/radial images; secondary cleft sign).
 */

// ── Tab 1: Normal anatomy, planes, sequences, variants ──────────────────────
export const hipAnatomySections: MeasurementSection[] = [
  {
    title: "Planes — what each one answers",
    items: [
      {
        label: "Large-FOV coronal (both hips + pelvis)",
        detail:
          "The screen. T2 FS Dixon across both hips, sacrum, and symphysis catches marrow lesions, occult/stress fractures, AVN, SI joints, and athletic pubalgia — and lets you compare sides. Use this first when pain is poorly localized or possibly referred. At the symphysis, look for the secondary cleft sign; the normal midline (primary) cleft is not pathology.",
      },
      {
        label: "Dedicated single-hip axial",
        detail:
          "Anterior and posterior labrum, iliopsoas tendon, and the sciatic nerve. Workhorse for anterior/posterior structures once the question is focused and intra-articular.",
      },
      {
        label: "Dedicated single-hip sagittal",
        detail:
          "Anterior head-neck contour (cam bump) and the anterior joint recess / capsule. Profiles the anterosuperior head-neck junction and anterior chondral surfaces.",
      },
      {
        label: "Oblique-axial (along the femoral neck) / radial",
        detail:
          "Added specifically to measure the alpha angle. Prescribed parallel to the femoral neck long axis (or as radial reformats) so the anterosuperior head-neck junction lies flat. The historic >55° threshold remains common, while ≥60° is better supported for classifying cam morphology. Do not quote an angle off a straight axial or coronal image.",
      },
    ],
  },
  {
    title: "Sequences — what they're for",
    items: [
      {
        label: "Fluid-sensitive fat-sat (T2 FS / STIR)",
        detail:
          "Edema, marrow injury, effusion, stress-fracture lines, and AVN reactive edema. A finding is more convincing when fluid-bright signal points to it — read these on every step.",
      },
      {
        label: "T1-weighted",
        detail:
          "Anatomy, marrow replacement (a low-T1 marrow lesion is the red flag), and subtle/occult fracture lines. Fatty marrow is normally bright on T1; loss of that brightness is the warning.",
      },
      {
        label: "Dixon — water vs fat",
        detail:
          "Separates water (edema, fluid) from fat in one acquisition. The water image behaves like a fat-sat fluid sequence; the fat image confirms true marrow fat and fatty muscle infiltration — reliable fat-sat across the wide pelvic FOV.",
      },
      {
        label: "MR arthrography (the labrum)",
        detail:
          "A selective problem-solving examination for subtle labral/chondrolabral tears; intra-articular contrast distends the joint and can outline a defect. High-quality dedicated 3-T MRI performs well first-line, so add arthrography when routine MRI is equivocal or discordant with the examination and the answer will change management.",
      },
    ],
  },
  {
    title: "Normal anatomy checklist",
    items: [
      {
        label: "Femoral head & marrow",
        detail:
          "Spherical with expected fatty marrow on T1. Asphericity / a bump at the anterosuperior head-neck junction suggests cam morphology. Low T1 is not automatically malignant — compare with muscle/disc, distribution, fat content, age, and the fluid-sensitive sequences; confluent replacement darker than muscle is the red flag.",
      },
      {
        label: "Acetabulum, sourcil & coverage",
        detail:
          "Smooth subchondral 'sourcil' (the weight-bearing roof on coronal); assess coverage — undercoverage (dysplasia) vs overcoverage (pincer). The cotyloid (acetabular) fossa is non-articular and normally holds fat + ligamentum teres.",
      },
      {
        label: "Acetabular labrum",
        detail:
          "Triangular, uniformly LOW signal, firmly attached to the rim — best on radial / oblique-axial. The anterosuperior chondrolabral junction is the weight-bearing zone where true tears live.",
      },
      {
        label: "Articular cartilage",
        detail:
          "Thin, intermediate signal over head and acetabulum; assess on fluid-sensitive sequences and (best) MR arthrogram. Look for focal anterosuperior loss / delamination.",
      },
      {
        label: "Capsule, iliofemoral ligament & anterior recess",
        detail:
          "Iliofemoral ligament (Y of Bigelow) is the strong anterior restraint; zona orbicularis normally 'waists' the neck — don't call it a tear. A thin anterior recess is normal; capsule integrity matters post-arthroscopy/dislocation.",
      },
      {
        label: "Abductors & greater trochanter",
        detail:
          "Gluteus medius and minimus — the hip's 'rotator cuff' — insert on the greater trochanter facets with smooth low-signal footprints. This is the GTPS site; most 'trochanteric bursitis' is really gluteal tendinopathy or a footprint tear.",
      },
      {
        label: "Iliopsoas",
        detail:
          "Tendon crosses the anterior joint / pelvic brim toward the lesser trochanter; a small iliopsoas bursa can be normal. Internal (iliopsoas) snapping is a dynamic ultrasound diagnosis, not a static-MRI one.",
      },
      {
        label: "Hamstring origin",
        detail:
          "Conjoint tendon on the ischial tuberosity — uniformly low signal at its footprint. Count the tendons and measure retraction: a complete 3-tendon avulsion, or 2 tendons with >2 cm retraction in an active patient, commonly prompts surgical referral. Also assess the adjacent sciatic nerve.",
      },
      {
        label: "Sciatic nerve",
        detail:
          "Posterior to the hip, just lateral to the ischial tuberosity (near the hamstring origin) — trace it on axial images for caliber, signal, and perineural edema.",
      },
    ],
  },
  {
    title: "Normal variants — don't overcall",
    items: [
      {
        label: "Os acetabuli",
        detail:
          "Corticated ossicle at the anterosuperior acetabular rim with smooth margins. Distinguish from an acute rim fracture (sharp margins + marrow edema); in FAI it can represent a chronic rim stress fragment.",
      },
      {
        label: "Supra-acetabular fossa (12 o'clock)",
        detail:
          "Midline cartilage-filled notch in the acetabular dome at 12 o'clock with smooth margins and no marrow edema — not a chondral defect.",
      },
      {
        label: "Sublabral sulcus / recess",
        detail:
          "Smooth linear cleft paralleling the labral base with NO displacement and NO paralabral cyst. The posteroinferior/inferior junction is the classic benign site; an anterosuperior cleft cannot be called a variant on location alone — smooth margins and absent secondary signs do that.",
      },
      {
        label: "Stellate lesion (superomedial)",
        detail:
          "Normal star-shaped BARE AREA of absent cartilage on the SUPEROMEDIAL acetabular roof — medial to the supra-acetabular fossa, continuous with the acetabular notch. Clean margins, no marrow edema. NOT the anterosuperior weight-bearing dome, so it is not where true tears live.",
      },
      {
        label: "Herniation pit (fibrocystic pit)",
        detail:
          "Small, well-corticated subcortical cyst at the anterosuperior femoral neck (T1-dark, T2-bright). Classically benign and a marker of cam-type FAI — note it and check the alpha angle, but don't escalate to a tumor workup.",
      },
    ],
  },
  {
    title: "Normal labrum vs tear",
    items: [
      {
        label: "Where true tears live",
        detail:
          "The ANTEROSUPERIOR chondrolabral junction (roughly 12–3 o'clock) is the weight-bearing FAI shear zone and the prime site for a real tear. Dedicated small-field-of-view 3-T MRI is a strong first-line study; direct MR arthrography is useful when routine MRI is equivocal or detailed chondrolabral mapping will change management.",
      },
      {
        label: "Normal labrum / smooth sublabral sulcus",
        detail:
          "Low-signal triangle firmly attached to the rim; a sulcus is a SMOOTH-walled cleft at the base that parallels the cartilage and does NOT enter the labral substance.",
      },
      {
        label: "Tear — irregular & undercutting",
        detail:
          "Frayed/blunted/displaced margins with contrast (or fluid) extending INTO the labral substance, often with a paralabral cyst or adjacent chondral loss. A paralabral cyst is a high-yield secondary sign — find the cyst, then scrutinize the adjacent labrum.",
      },
      {
        label: "Don't reflexively call an anterosuperior cleft 'normal'",
        detail:
          "A posteroinferior smooth sulcus is benign, but the same-looking cleft anterosuperiorly is exactly where tears hide. Weigh margins, displacement, and secondary signs — not location alone.",
      },
    ],
  },
];

// ── Tab 2: Measurements, grading & protocol decisions ───────────────────────
export const hipMeasurementSections: MeasurementSection[] = [
  {
    title: "FAI measurements — cam, pincer & version",
    items: [
      {
        label: "Alpha angle (cam)",
        detail:
          "Measured on OBLIQUE-AXIAL (along the femoral neck) or RADIAL images — NOT the straight coronal. The historic >55° cutoff remains common, while ≥60° is the better-supported classification threshold. Report the value and plane; an elevated angle does not by itself diagnose symptomatic FAI.",
      },
      {
        label: "Lateral center-edge angle (LCEA)",
        detail:
          "Acetabular coverage of the femoral head. <~20–25° = dysplasia/undercoverage; ~25–40° = normal; >~40° = overcoverage/pincer (often with coxa profunda).",
      },
      {
        label: "Crossover sign",
        detail:
          "Anterior wall projecting lateral to the posterior wall before they meet = acetabular retroversion, a focal anterosuperior pincer pattern. It is an AP-PELVIS RADIOGRAPH sign (confirm on a well-positioned AP film, not on coronal MRI).",
      },
      {
        label: "Cam morphology is common and often asymptomatic",
        detail:
          "An elevated alpha angle alone does NOT prove symptomatic disease. Correlate with concordant symptoms and chondrolabral injury before any surgical conversation — morphology is not the diagnosis.",
      },
      {
        label: "Femoral version (note)",
        detail:
          "Excessive femoral anteversion OR retroversion of the neck modifies impingement and instability risk; report it when measured, as it co-determines hip-preservation planning.",
      },
    ],
  },
  {
    title: "Acetabular labral tear",
    items: [
      {
        label: "Location — anterosuperior",
        detail:
          "Labral tears most often involve the ANTEROSUPERIOR chondrolabral junction (roughly 12–3 o'clock), but can occur elsewhere. Favor a tear when fluid/signal extends irregularly into the labral substance with morphologic distortion or secondary findings, ideally confirmed on two planes.",
      },
      {
        label: "Choose the problem-solving study",
        detail:
          "Dedicated small-field-of-view 3-T MRI performs well as a first-line study. Direct MR ARTHROGRAPHY can better outline subtle labral/chondrolabral defects when routine or lower-field MRI is equivocal and the answer will change management.",
      },
      {
        label: "Paralabral cyst",
        detail:
          "A paralabral cyst is a secondary sign of an adjacent tear — trace the cyst back to its labral defect. Its presence raises confidence even when the tear itself is subtle.",
      },
      {
        label: "Don't overcall the sulcus",
        detail:
          "A smooth labral recess/sulcus is a normal variant; a tear has irregular margins and reaches the articular surface at the anterosuperior chondrolabral junction.",
      },
    ],
  },
  {
    title: "AVN — ARCO staging & the collapse hinge",
    items: [
      {
        label: "Stage I",
        detail:
          "MRI-POSITIVE / radiograph-NEGATIVE, pre-collapse. Double-line sign with maintained sphericity and NO subchondral crescent. A radiograph-negative double-line hip is strictly ARCO I.",
      },
      {
        label: "Stage II",
        detail:
          "Radiographic sclerosis and/or cysts appear, but STILL pre-collapse (no crescent, no flattening).",
      },
      {
        label: "Stage III",
        detail:
          "Subchondral crescent / early collapse — the articular surface is no longer congruent. This is the management hinge: post-collapse changes the conversation toward salvage/arthroplasty.",
      },
      {
        label: "Stage IV",
        detail: "Secondary osteoarthritis with joint-space loss and acetabular involvement.",
      },
      {
        label: "Double-line sign",
        detail:
          "On T2/fluid-sensitive: inner hyperintense granulation tissue paralleling an outer hypointense sclerotic rim. Highly specific for osteonecrosis; distinguishes AVN from transient marrow edema, which lacks it.",
      },
      {
        label: "Lesion size / Kerboul",
        detail:
          "Necrotic-segment size (e.g., modified Kerboul combined-angle, or >2/3 weight-bearing head involvement) predicts collapse risk and lower core-decompression success. The hinge for joint preservation is catching it PRE-collapse — and AVN is frequently bilateral, so image the contralateral hip.",
      },
    ],
  },
  {
    title: "SIFFH vs transient bone-marrow-edema syndrome",
    items: [
      {
        label: "The distinguishing feature",
        detail:
          "A subchondral low-signal FRACTURE BAND at the femoral head (often irregular and convex toward the surface, with or without focal flattening) marks subchondral insufficiency fracture of the femoral head (SIFFH). Transient BME syndrome shows diffuse marrow edema WITHOUT a discrete fracture band or collapse.",
      },
      {
        label: "SIFFH — collapse risk",
        detail:
          "The subchondral line plus any flattening signals structural failure and collapse risk; it is not benign self-limited edema. Protected weight-bearing and orthopedic referral, especially in older/osteopenic patients.",
      },
      {
        label: "Transient BME syndrome",
        detail:
          "Self-limited diffuse femoral-head/neck edema that resolves over months. Isolated marrow edema is a differential, not a diagnosis — chase a subchondral line or a double-line rim before reassuring.",
      },
    ],
  },
  {
    title: "Femoral-neck stress fracture — which side",
    items: [
      {
        label: "Superolateral (tension side)",
        detail:
          "Tension-side fracture line along the SUPEROLATERAL cortex is the SURGICAL-URGENCY pattern — prone to displacement and AVN. Treat as urgent: protected/non-weight-bearing and prompt orthopedic referral.",
      },
      {
        label: "Inferomedial (compression side)",
        detail:
          "An incomplete compression-side line involving <50% of the neck width is lower-risk and is often managed conservatively with protected weight-bearing and close follow-up. A line reaching ≥50%, a fracture gap, significant pain, or inability to straight-leg raise shifts toward fixation.",
      },
      {
        label: "Look for the line, not just edema",
        detail:
          "A discrete low-signal fracture line within marrow edema (confirmed on T1) defines and locates the stress fracture and changes the weight-bearing protocol. Estimate the percentage of neck width involved.",
      },
    ],
  },
  {
    title: "Cartilage grading (Outerbridge-type 0–IV)",
    items: [
      { label: "Grade 0", detail: "Normal cartilage — uniform thickness, smooth surface, homogeneous signal." },
      { label: "Grade I", detail: "Softening/signal heterogeneity (swelling) with an intact surface." },
      { label: "Grade II", detail: "Partial-thickness defect/fissuring <50% of cartilage depth." },
      {
        label: "Grade III",
        detail: "Deep defect >50% of depth, extending to but not through the subchondral plate.",
      },
      {
        label: "Grade IV",
        detail: "Full-thickness loss with exposed subchondral bone, often with reactive marrow edema.",
      },
      {
        label: "Chondrolabral junction in FAI",
        detail:
          "In cam-type FAI, the surgically significant lesion is anterosuperior acetabular RIM chondral delamination at the chondrolabral junction. Co-located rim chondral injury + cam + labral tear after failed rehab weights toward arthroscopic referral.",
      },
      {
        label: "Don't overcall the stellate lesion",
        detail:
          "The stellate lesion is a NORMAL bare-area variant of the SUPEROMEDIAL acetabular roof (medial to the supra-acetabular fossa, continuous with the acetabular notch) — not the anterosuperior weight-bearing dome. Do not mistake this medial bare cartilage gap for a chondral defect; true chondrolabral pathology is anterosuperior.",
      },
    ],
  },
  {
    title: "GTPS / abductor tear — the hip's rotator cuff",
    items: [
      {
        label: "What GTPS really is",
        detail:
          "Greater trochanteric pain syndrome is usually gluteus medius/minimus (the abductor 'rotator cuff of the hip') tendinopathy or footprint tear — most labeled 'trochanteric bursitis' is actually gluteal tendinopathy. Name the tendon.",
      },
      {
        label: "Grade the abductor lesion",
        detail:
          "Distinguish tendinopathy (thickening/signal, intact fibers) from partial-thickness footprint tear from full-thickness tear with retraction and muscle fatty atrophy.",
      },
      {
        label: "What changes management",
        detail:
          "A full-thickness, retracted abductor tear (especially with fatty atrophy) is a SURGICAL referral, analogous to a rotator cuff tear — not a bursitis to inject and forget.",
      },
    ],
  },
  {
    title: "Proximal hamstring avulsion & athletic pubalgia",
    items: [
      {
        label: "Hamstring — surgical-referral criteria",
        detail:
          "Count tendons and measure retraction at the ischial tuberosity. A complete 3-tendon avulsion, or 2 tendons with >2 cm retraction in an active patient, is a commonly used surgical-referral threshold; symptoms, chronicity, activity goals, and failed rehabilitation also matter. State both measurements and assess the nearby sciatic nerve.",
      },
      {
        label: "Repair window",
        detail:
          "The window for primary repair is best within a few weeks before further retraction and scarring — so flag the surgical pattern promptly.",
      },
      {
        label: "Athletic pubalgia — secondary cleft sign",
        detail:
          "Rectus abdominis–adductor longus aponeurosis injury at the symphysis. The SECONDARY cleft sign (fluid tracking inferolaterally from the symphysis) indicates the tear. The PRIMARY cleft is the normal midline symphyseal cleft — don't confuse them.",
      },
      {
        label: "Snapping hip is dynamic, not static MRI",
        detail:
          "Internal (iliopsoas) and external (ITB over the trochanter) snapping hip are DYNAMIC ULTRASOUND diagnoses. Static MRI may be normal — recognize the limitation.",
      },
    ],
  },
  {
    title: "Protocol — when each study changes management",
    items: [
      {
        label: "Non-contrast MRI (most questions)",
        detail:
          "Dedicated small-FOV hip with oblique-axial neck sequences with or without radial reformats. Best first study for AVN, SIFFH/stress fracture, marrow edema, abductor and hamstring tendons, and cam morphology (alpha angle).",
      },
      {
        label: "MR arthrogram",
        detail:
          "A selective problem-solving study for subtle labral/chondrolabral pathology when routine MRI is equivocal or discordant with the examination. High-quality dedicated 3-T MRI can approach MR-arthrography sensitivity for labral tears, so direct arthrography is not automatically required.",
      },
      {
        label: "CT",
        detail:
          "Best for precise bony morphology and version (cam/pincer, acetabular version, femoral version) when osseous quantification will change hip-preservation surgical planning.",
      },
      {
        label: "Radiograph",
        detail:
          "First-line and decisive for AVN staging (radiograph-negative double-line = ARCO I; sclerosis/cysts = II; crescent/collapse = III; secondary OA = IV). Also screens for OA, dysplasia (LCEA), and pincer overcoverage, and is where the crossover sign of retroversion is read. A large-FOV pelvis screen cannot reliably measure the alpha angle — order the dedicated hip study for that.",
      },
    ],
  },
];
