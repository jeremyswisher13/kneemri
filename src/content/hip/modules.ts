import type { ModuleMetadata } from "@/content/modules";

/**
 * Hip MRI course modules (primary-care sports-medicine audience).
 * Blueprint + per-topic teaching content, authored and MSK-adversarially verified.
 * Mirrors shoulderModuleRegistry.
 */
export const hipModuleRegistry: ModuleMetadata[] = [
  {
    id: "hip-mri-basics",
    number: 1,
    title: "Hip MRI Basics",
    subtitle: "Protocols, planes, sequences, and when arthrography changes management",
    searchPatternStep: 1,
    estimatedMinutes: 16,
    essentialTopics: [0, 1, 4],
    topics: [
      "Large-FOV pelvis screen vs small-FOV dedicated hip protocol",
      "Planes: axial, coronal, sagittal, and oblique-axial along the femoral neck",
      "Core sequences: T1, PD/T2 fat-sat, STIR, and what each is best for",
      "Fluid vs fat: reading signal behavior across sequences",
      "Non-contrast MRI vs MR arthrography: when labral/chondral detail changes management",
    ],
    learningObjectives: [
      "Differentiate a large-FOV pelvis screen from a small-FOV dedicated hip protocol and state which the clinical question requires",
      "Identify the oblique-axial plane prescribed along the femoral neck and explain why it is essential for cam morphology and the alpha angle",
      "Match each sequence (T1 for marrow/anatomy, PD/T2 FS and STIR for fluid/edema) to the tissue question it best answers, and distinguish STIR from chemical fat-sat over a large pelvic FOV",
      "Decide when direct MR arthrography adds management-relevant labral or chondral detail versus when non-contrast MRI suffices",
    ],
    commonMistakes: [
      { mistake: "Ordering or reading a dedicated small-FOV hip when the pain is poorly localized or possibly referred", correction: "Use a large-FOV pelvis screen first when the pain generator is unclear or extra-articular/referred causes are in play (sacrum, marrow, contralateral); reserve the small-FOV dedicated hip (with oblique-axial along the neck) for a focused intra-articular question." },
      { mistake: "Defaulting to MR arthrography for every labral question, or assuming it is always superior", correction: "Ask whether the added detail changes the next step. Most 3T non-contrast hips answer the labral/chondral question; reserve direct arthrography (optionally with traction) for equivocal cases where confirming a tear or chondral delamination would shift management toward surgical referral." },
      { mistake: "Treating any bright signal on a T2/PD FS sequence as pathologic fluid", correction: "Confirm fluid on more than one sequence: true fluid follows CSF (dark on T1, bright on fluid-sensitive); fat is bright on T1/PD and suppresses on FS/STIR. Magic-angle and chemical-shift artifacts can mimic signal abnormality." },
    ],
    topicContent: [
      {
        content: "### Large-FOV Pelvis Screen vs Small-FOV Dedicated Hip Protocol\n\nThe first decision when you open a hip study: **what protocol was actually ordered?** These are not interchangeable.\n\n**Large-FOV pelvis screen** (~32–40 cm FOV, both hips on every slice):\n- Best for **bilateral and referred problems**: insufficiency/sacral fractures, sacroiliitis, occult marrow lesions, muscle/tendon injury, an unclear hip-vs-back-vs-pelvis story\n- Catches the **contralateral hip** and the pelvic ring you would otherwise miss\n- Trade-off: lower spatial resolution — labrum and cartilage are blurred\n\n**Small-FOV dedicated hip** (~16–20 cm FOV, single joint, thin slices):\n- Built to resolve the **labrum, chondral surface, and cam/pincer morphology**\n- The protocol you want for **FAI, labral tear, chondral delamination** workups\n\n| Question | Order |\n|---|---|\n| \"Where is the pain coming from?\" | Large-FOV screen |\n| \"Is the labrum/cartilage torn?\" | Small-FOV dedicated |\n\nIf the clinical question is intra-articular, a screen alone will underdiagnose it.",
        pearl: "If you are chasing a labral or chondral diagnosis, a large-FOV pelvis screen is the wrong tool — its resolution blurs the joint surfaces; reorder a small-FOV dedicated hip before you commit to a management plan.",
      },
      {
        content: "### Planes: Axial, Coronal, Sagittal, and Oblique-Axial Along the Femoral Neck\n\n**Coronal** — your workhorse for **marrow, femoral head/neck, abductors, and superior labrum**; STIR/T2 FS here is the screen for stress fractures and AVN.\n\n**Sagittal** — anterior–posterior labrum, anterior femoral head-neck junction, and chondral surfaces.\n\n**Axial (true)** — anterior/posterior structures, iliopsoas, and anterior/posterior labrum.\n\n**Oblique-axial along the femoral neck** — slices prescribed *parallel to the long axis of the femoral neck* (off the coronal). This is the **money plane for cam morphology**:\n- It profiles the **anterosuperior head–neck junction** for the **alpha angle**\n- The historic >55° cutoff remains widely cited; **≥60°** is better supported for classifying cam morphology\n- Radial reformats add the clock-face map of where the bump is\n\nA true-axial slice can over- or under-estimate the angle. Report the measured value and plane, and remember that morphology alone is not symptomatic FAI.",
        pearl: "Cam morphology lives at the anterosuperior head-neck junction — only the oblique-axial (or radial) plane measures the alpha angle correctly; never quote an alpha angle off a standard axial slice.",
      },
      {
        content: "### Core Sequences: T1, PD/T2 Fat-Sat, STIR — and What Each Is Best For\n\nMatch the **sequence to the tissue question**:\n\n| Sequence | Reads | Use it for |\n|---|---|---|\n| **T1** | Anatomy + **marrow fat** | Normal fatty marrow = bright; **red flag = confluent low-T1 darker than muscle/disc** (tumor/marrow replacement); fracture lines |\n| **PD/T2 fat-sat** | **Fluid + edema**, cartilage | Labral/chondral detail, joint effusion, bone marrow edema |\n| **STIR** | **Fluid/edema**, robust fat suppression | Stress fracture, AVN, marrow edema over a **large FOV** |\n\n**STIR vs chemical (spectral) fat-sat:** chemical fat-sat is sharper and higher-resolution but **fails at the edges of a large FOV and near metal** (heterogeneous B0). STIR suppresses fat uniformly across a wide field and around hardware, so it is the **edema screen of choice on large-FOV pelvis** imaging. On a tight, dedicated hip, PD FS gives you the crisp cartilage/labral picture.\n\nThink: **T1 = anatomy/marrow, fluid-sensitive sequences = pathology/edema.**",
        pearl: "On a large-FOV pelvis or any study near hardware, trust STIR over chemical fat-sat — failed fat suppression at the field edge can hide or mimic marrow edema and send you down the wrong path.",
      },
      {
        content: "### Fluid vs Fat: Reading Signal Behavior Across Sequences\n\nYou confirm what a structure *is* by tracking its signal across sequences, not from one image.\n\n**Fluid** (effusion, edema, cyst, simple fluid):\n- **T1 dark**, **T2/PD FS bright**, **STIR bright**\n- \"Follows fluid\" = bright on fluid-sensitive, dark on T1\n\n**Fat** (normal marrow, lipoma, fat within a lesion):\n- **T1 bright**, bright on conventional (non-fat-sat) **T2/PD**, and **drops out (goes dark) on fat-sat / STIR**\n- The fat-sat \"drop\" is the proof it is fat\n\n| | T1 | T2/PD (non-FS) | Fat-sat / STIR |\n|---|---|---|---|\n| Fluid/edema | dark | bright | bright |\n| Fat | bright | bright | **dark** |\n\n**Why it matters:** a **T1-bright** marrow signal that **suppresses** on fat-sat is reassuring fat. A lesion staying **bright on fat-sat** is not fat — characterize it. And **edema-only** marrow (bright on fluid-sensitive, no T1 fracture line) is a different management animal than a true subchondral fracture.",
        pearl: "Always pair a fat-sat sequence with T1: a marrow signal that is bright on T1 and suppresses on fat-sat is fat (benign); one that stays bright on fat-sat demands characterization.",
      },
      {
        content: "### Non-Contrast MRI vs MR Arthrography: When It Changes Management\n\n**MR arthrography (MRA)** = intra-articular dilute gadolinium that **distends the joint and outlines the labrum and chondral surface**, letting contrast track into tears.\n\n**When MRA earns its needle:**\n- The clinical question is a **surgically relevant labral or chondrolabral tear** (younger patient, FAI, positive impingement signs, considering arthroscopy)\n- You need to confirm a **subtle labral detachment or chondral delamination** that non-contrast may miss\n- High-resolution **3T non-contrast** can approach MRA for the labrum and is often tried first\n\n**When non-contrast is enough:**\n- **Marrow** questions — stress fracture, AVN, transient BME, occult fracture, tumor — contrast adds nothing\n- **Tendon/muscle** injury (abductors, hamstrings)\n- **Advanced OA** — once cartilage is gone, distending the joint changes no decision\n\n**Management hinge:** order MRA when a positive labral/chondral finding would **push toward arthroscopy or change the operative plan** — not as a reflex.",
        pearl: "Reach for MR arthrography only when a labral or chondral finding would change the surgical decision; for marrow, tendon, or advanced-OA questions it adds cost and a needle with no management payoff.",
      },
    ],
  },
  {
    id: "hip-anatomy",
    number: 2,
    title: "Hip & Pelvis Anatomy",
    subtitle: "Labrum, capsuloligamentous complex, the muscle-tendon groups, and variants that mimic pathology",
    searchPatternStep: null,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 2, 3, 5],
    topics: [
      "Acetabulum, labrum, chondrolabral junction, femoral head/neck, and articular cartilage",
      "Capsule, zona orbicularis, iliofemoral ligament, and ligamentum teres",
      "Muscle-tendon groups: abductors (gluteus medius/minimus), flexors (iliopsoas, rectus femoris/AIIS)",
      "Hamstring origin, adductors, and the pubic symphysis / rectus abdominis-adductor aponeurosis",
      "Bursae around the hip and pelvis (trochanteric, iliopsoas)",
      "Normal variants that mimic pathology: os acetabuli, supra-acetabular fossa, sublabral sulcus, stellate lesion, herniation pit",
    ],
    learningObjectives: [
      "Identify the acetabular labrum, chondrolabral junction, articular cartilage, ligamentum teres, and the capsuloligamentous complex on standard planes",
      "Locate the major periarticular muscle-tendon groups (abductors, iliopsoas, rectus femoris/AIIS, hamstring origin, adductors) and their attachment sites, including the gluteus medius/minimus footprints on the greater trochanter",
      "Distinguish common normal variants (sublabral sulcus, supra-acetabular fossa, stellate lesion, herniation pit, os acetabuli) from true labral, chondral, or marrow pathology",
      "Recognize the rectus abdominis-adductor aponeurosis at the pubic symphysis as the anatomic crossroads for athletic pubalgia",
    ],
    commonMistakes: [
      { mistake: "Calling a supra-acetabular fossa, central acetabular fossa, or normal stellate lesion a cartilage defect", correction: "These are predictable midline/bare-area variants with no surrounding marrow edema; the cotyloid fossa is non-articular and normally contains fat and ligamentum teres. True chondral loss is eccentric, weight-bearing, and usually has subchondral reaction." },
      { mistake: "Reading a herniation pit at the femoral neck as an aggressive lesion", correction: "A herniation pit is a small, well-corticated subcortical cyst at the anterosuperior head-neck junction (T1-low/T2-high), classically benign and often a marker of cam-type FAI; note it but do not escalate to a tumor workup." },
      { mistake: "Calling every focal fluid-signal cleft at the labral base a tear", correction: "A normal sublabral sulcus/recess follows fluid signal but lacks the morphology, displacement, and paralabral cyst of a true tear; smooth contrast that does not extend into labral substance on arthrography favors a normal recess. Correlate with the typical anterosuperior location of true tears." },
    ],
    topicContent: [
      {
        content: "### Acetabulum, Labrum, Chondrolabral Junction, Femoral Head/Neck & Cartilage\n\nThe **acetabular labrum** is a triangular fibrocartilaginous rim — uniformly **low signal** on all sequences — best seen on **radial and oblique-axial** images. It deepens the socket and seals the joint. The **chondrolabral junction** is where labrum meets hyaline cartilage; this is the **anterosuperior** weight-bearing zone where most pathologic tears and FAI rim chondral damage occur.\n\n- **Femoral head**: spherical, fatty marrow (bright T1). Loss of sphericity at the head-neck junction (asphericity/bump) suggests **cam morphology**.\n- **Femoral neck**: scrutinize cortex on T1/fluid-sensitive — tension-side (superolateral) edema or a fracture line is a red flag for a high-risk stress fracture.\n- **Articular cartilage**: thin, intermediate signal; assess on fluid-sensitive and (best) **MR arthrogram**.\n\n| Structure | Normal signal | Key sequence |\n|---|---|---|\n| Labrum | Uniform low | Radial / oblique-axial |\n| Cartilage | Intermediate | Fluid-sensitive / arthrogram |\n\n**Management:** anterosuperior chondrolabral disruption with adjacent cartilage delamination shifts FAI toward surgical referral; an intact labrum and cartilage favor conservative care.",
        pearl: "Anterosuperior chondrolabral-junction tears with adjacent cartilage delamination drive the surgical weighting in FAI — location of the labral abnormality matters more than its mere presence.",
      },
      {
        content: "### Capsule, Zona Orbicularis, Iliofemoral Ligament & Ligamentum Teres\n\nThe **capsuloligamentous complex** stabilizes the hip and is read on oblique-axial and coronal images.\n\n- **Zona orbicularis**: circular low-signal capsular condensation that **waists** the femoral neck on coronal images — looks like a constriction; do not call it a tear or a paralabral cyst.\n- **Iliofemoral ligament (Y of Bigelow)**: the strongest anterior capsular thickening; primary restraint to **extension and external rotation**. Anterior capsule/iliofemoral integrity matters after dislocation or hip arthroscopy (an unrepaired capsulotomy can cause **microinstability**).\n- **Ligamentum teres**: runs from the **fovea capitis** to the **transverse acetabular ligament / margins of the acetabular notch**; carries a small artery. Best seen on oblique-axial/coronal; tears (sprain → full rupture) cause mechanical pain and can be a hidden source of groin pain in athletes.\n\n**Management:** a full ligamentum teres tear or an unrepaired anterior capsulotomy with instability symptoms warrants arthroscopy referral; an isolated zona orbicularis is **normal** and needs no action.",
        pearl: "The zona orbicularis is a normal circular capsular waist around the neck — mistaking it for a tear or cyst is a classic over-call that sends a normal hip to arthroscopy.",
      },
      {
        content: "### Muscle-Tendon Groups: Abductors & Flexors\n\n**Abductors (gluteus medius/minimus):** insert on the **greater trochanter** — medius onto the lateral and superoposterior facets, minimus onto the anterior facet. They are the **rotator cuff of the hip**. On fluid-sensitive coronal/axial images look for tendinosis (thickening/signal), partial tears (footprint signal), and **full-thickness retracted tears** with a fluid gap.\n\n**Flexors:**\n- **Iliopsoas**: psoas + iliacus joining to insert on the **lesser trochanter**; the tendon lies anterior to the hip and can cause snapping or bursitis.\n- **Rectus femoris**: two heads — **direct head from the AIIS** (anterior inferior iliac spine) and **indirect/reflected head from the superior acetabular ridge/rim**. Proximal strains and AIIS apophyseal avulsions are common in kicking/sprinting athletes.\n\n**Management:** a **full-thickness, retracted gluteus medius/minimus tear** (true cuff failure) is a surgical-referral lesion; tendinosis and low-grade partial tears get rehab. Distinguish an abductor tear from simple trochanteric bursitis — management diverges.",
        pearl: "A full-thickness retracted abductor (gluteus medius/minimus) tear is the hip's rotator-cuff failure and earns surgical referral — don't bury it under the label 'trochanteric bursitis.'",
      },
      {
        content: "### Hamstring Origin, Adductors & the Rectus Abdominis–Adductor Aponeurosis\n\n**Proximal hamstring origin**: the **conjoint tendon (semitendinosus + biceps femoris long head)** and the **semimembranosus** arise from the **ischial tuberosity**. On oblique-coronal/axial fluid-sensitive images, document **how many of the tendons are torn** and the **retraction distance** — both influence management.\n\n**Adductors**: longus, brevis, magnus, gracilis, and pectineus arise from the **pubic body/inferior ramus**; adductor longus strains are the classic groin injury.\n\n**Rectus abdominis–adductor aponeurosis** at the **pubic symphysis**: the rectus abdominis and adductor longus blend into a common aponeurotic plate. This is the **athletic-pubalgia (\"sports hernia\") crossroads** — disruption here produces the **secondary cleft sign** (fluid tracking inferolaterally from the symphysis on coronal fluid-sensitive images).\n\n**Management:** a complete 3-tendon avulsion, or a 2-tendon avulsion with **>2 cm retraction** in an active patient, commonly prompts surgical referral. Partial or single-tendon injuries usually begin with rehabilitation, but persistent symptoms and activity goals also influence referral. Aponeurotic/secondary-cleft injuries go to a core-muscle-injury (athletic pubalgia) specialist.",
        pearl: "Common proximal hamstring referral pattern: a complete 3-tendon avulsion, or 2 tendons torn with >2 cm retraction in an active patient. Lesser tears usually start with rehabilitation but are not automatically nonsurgical. Report tendon count, retraction, chronicity, and sciatic-nerve findings.",
      },
      {
        content: "### Bursae: Trochanteric & Iliopsoas\n\nBursae are normally collapsed; a thin sliver of fluid is physiologic. They become conspicuous (bright on fluid-sensitive, fluid-equivalent) when inflamed.\n\n- **Trochanteric (peritrochanteric) bursa**: lies superficial to the greater trochanter beneath the gluteus maximus/IT band. Distension is part of **greater trochanteric pain syndrome**. Crucially, **always interrogate the underlying gluteus medius/minimus tendons** — bursal fluid is frequently the visible flag for an abductor tendon tear, not an isolated diagnosis.\n- **Iliopsoas bursa**: largest in the body; lies deep to the iliopsoas tendon, anterior to the joint. Communicates with the hip in ~15%, so a **distended iliopsoas bursa can be a marker of intra-articular pathology** (effusion, synovitis, OA). Anteromedial location; can cause snapping or femoral-nerve/vessel mass effect when large.\n\n**Management:** image-guided injection helps both diagnosis and treatment, but treat the **driver** — repair an underlying abductor tear; address the joint pathology feeding an iliopsoas bursa rather than just aspirating.",
        pearl: "Peritrochanteric bursal fluid is a signpost, not a diagnosis — always check the abductor tendons underneath before settling on 'trochanteric bursitis.'",
      },
      {
        content: "### Normal Variants — Don't Call Them Pathology\n\nThese benign findings are routinely over-called. Recognize them to avoid needless arthrograms and referrals.\n\n| Variant | Location | How to call it normal |\n|---|---|---|\n| **Os acetabuli** | Anterosuperior acetabular rim | Corticated ossicle, smooth margins (vs. acute rim fracture — sharp margins, marrow edema) |\n| **Supra-acetabular fossa** | Acetabular **dome (12 o'clock)** | Midline cartilage-filled notch, smooth — not a chondral defect |\n| **Sublabral sulcus/recess** | Posteroinferior / anteroinferior junction | Smooth linear cleft paralleling the labral base, **no displacement or paralabral cyst** |\n| **Stellate lesion** | **Superomedial** acetabular roof — medial to the supra-acetabular fossa, continuous with the acetabular notch | Star-shaped bare area of absent cartilage, clean margins, no marrow edema — a midline/bare-area variant, NOT the anterosuperior weight-bearing zone where true tears live |\n| **Herniation pit (fibrocystic pit)** | Anterosuperior femoral neck | Small T2-bright, T1-dark corticated cyst; associated with **cam morphology** but often incidental |\n\n**Pitfall:** a cleft at the **anterosuperior** chondrolabral junction is NOT automatically a tear or a normal variant. Location raises suspicion, but margins, trajectory, displacement, and secondary signs decide it.\n\n**Management:** isolated variants → reassure and correlate clinically. A herniation pit can prompt a measured cam-morphology assessment (alpha angle on an appropriate plane; ≥60° is the better-supported classification threshold), but neither finding diagnoses symptomatic FAI by itself.",
        pearl: "Variant vs. pathology comes down to location: a posteroinferior sublabral sulcus is benign, but the same-looking cleft anterosuperiorly is the prime site for a true tear — never reflexively call an anterosuperior cleft a normal variant.",
      },
    ],
  },
  {
    id: "hip-search-pattern",
    number: 3,
    title: "Search Pattern Overview",
    subtitle: "A repeatable, satisfaction-of-search-proof read for groin, lateral, and posterior hip pain",
    searchPatternStep: null,
    estimatedMinutes: 14,
    essentialTopics: [1, 3, 4],
    topics: [
      "Why a fixed search order beats lesion-spotting",
      "The seven-step hip/pelvis search pattern",
      "Anchor slices: the oblique-axial neck and the mid-coronal joint",
      "Localizing by region: anterior/groin vs lateral vs posterior/buttock pain",
      "Satisfaction-of-search traps and blind spots (tension-side femoral neck, sacrum, symphysis, marrow)",
      "Translating findings into rehab vs injection vs referral vs urgent",
    ],
    learningObjectives: [
      "Apply a reproducible seven-step hip and pelvis MRI search pattern to every study",
      "Use pain location (groin, lateral, posterior) to weight the search toward the likely pain generator",
      "Explain how satisfaction-of-search causes missed second findings (e.g., a tension-side stress fracture behind an obvious labral tear) and adopt a habit that defeats it",
      "Convert the read into a management hierarchy rather than an anatomic list",
    ],
    commonMistakes: [
      { mistake: "Stopping the read once a labral tear or trochanteric bursitis is found", correction: "Labral tears are common and frequently incidental; the obvious finding is exactly when a tension-side femoral neck stress fracture, early AVN, marrow-replacing lesion, or sacral stress fracture gets missed. Finish all seven steps every time." },
      { mistake: "Reviewing only the small-FOV hip and ignoring the pelvic ring, contralateral side, and soft-tissue edges", correction: "Sacral stress fractures, contralateral pathology, marrow disease, and soft-tissue masses live outside the small FOV. Always review the large-FOV/coronal STIR of the whole pelvis and weight the read by symptom location." },
    ],
    topicContent: [
      {
        content: "### Why a Fixed Search Order Beats Lesion-Spotting\n\nThe natural instinct is to **chase the obvious finding** — a labral tear, a big effusion — and then quit. That is **satisfaction of search**, and on hip/pelvis MRI it is how the high-stakes lesion gets missed: the eye that locks onto a labral tear glides right past a **tension-side femoral-neck stress fracture** two slices away.\n\nA reproducible order forces you to **visit every compartment regardless of where your attention is pulled**, so the second (often more dangerous) finding still gets seen.\n\n**Why it works:**\n- **Coverage, not recall** — you check structures because they are next on the list, not because you remembered them.\n- **Calibrates attention** — the dangerous compartment (bone/marrow) is visited *early*, while attention is freshest.\n- **Reproducible dictation** — the report writes itself in a fixed sequence reviewers can audit.\n\n**Management impact:** lesion-spotting tends to over-call the symptomatic structure and under-call the silent emergency. A fixed order keeps you from discharging a hip to rehab when the marrow held a surgical fracture.",
        pearl: "The first finding you see is rarely the one that changes disposition — a fixed order exists precisely to make you keep looking after you have already found something.",
      },
      {
        content: "### The Seven-Step Hip/Pelvis Search Pattern\n\nDrive every study through the same sequence. **Bone and marrow go early** (step 2), while attention is freshest, because that is where the disposition-changing lesions hide.\n\n| Step | Region | High-yield target |\n|---|---|---|\n| **1 Verify** | Protocol & question | Side, arthrogram status, oblique-axial neck present, pain location |\n| **2 Bones/Marrow** | Femur, acetabulum, ring | **Tension-side neck fracture**, AVN, SIFFH, T1 marrow replacement |\n| **3 Cartilage** | Joint surface, effusion | Delamination vs full-thickness loss, complex/septic effusion |\n| **4 Labrum/FAI** | Labrum, morphology | Tear by quadrant, measured alpha angle, rim chondral injury |\n| **5 Abductors/Hamstring** | Lateral & posterior | Full-thickness retracted abductor tear, hamstring tendon count |\n| **6 Flexors/Adductors** | Anterior & groin | Iliopsoas, rectus/AIIS, **rectus-adductor aponeurosis** |\n| **7 Don't-Miss** | Safety sweep + plan | Re-check neck/AVN/marrow/ring, then state disposition |\n\n**Use both T1 and fluid-sensitive on every step** — T1 for marrow replacement, STIR/T2 FS for edema and fracture lines.",
        pearl: "Always run bone/marrow as step 2, not last — the femoral-neck fracture and the confluent marrow lesion are the findings that change today's disposition, and fatigue-at-the-end is where they get missed.",
      },
      {
        content: "### Anchor Slices: The Oblique-Axial Neck and the Mid-Coronal Joint\n\nTwo slices orient the entire read. Find them first; everything else hangs off them.\n\n**Mid-coronal joint** — the workhorse for:\n- **Femoral-neck fracture line** — and which cortex it touches (inferomedial **compression** vs superolateral **tension**).\n- **Superior acetabular cartilage** and the superolateral labrum.\n- **Abductor footprints** on the greater trochanter.\n- Marrow signal of head, neck, and acetabular roof on one image.\n\n**Oblique-axial along the femoral neck** — the dedicated plane for **cam morphology**:\n- Anterosuperior **head-neck junction bump**.\n- **Alpha angle**, measured here or on radial reformats: the historic >55-degree cutoff remains common, while **≥60 degrees** is better supported for classification.\n- A standard (non-oblique) axial can misrepresent the bump and angle.\n\n**Before you quote an alpha angle, confirm the oblique-axial-along-the-neck or radial images actually exist** — and do not equate an elevated angle with symptomatic FAI.",
        pearl: "An alpha angle measured on a routine axial instead of a dedicated oblique-axial-along-the-neck or radial plane is unreliable — if the dedicated plane is missing, say so rather than report a number you cannot defend.",
      },
      {
        content: "### Localizing by Region: Anterior/Groin vs Lateral vs Posterior/Buttock\n\nPain location tells you **where to spend your time** — it weights the search without replacing it.\n\n| Pain location | Weight the search toward | Common culprits |\n|---|---|---|\n| **Anterior / groin** | Intra-articular + adductor/symphysis | Labral tear, FAI, **athletic pubalgia (rectus-adductor aponeurosis)**, iliopsoas |\n| **Lateral** | Peritrochanteric | **Abductor (glute med/min) tendinopathy/tear**, GTPS, ITB |\n| **Posterior / buttock** | Hamstring origin + sacrum | **Proximal hamstring tear**, ischial bursitis, **sacral stress fracture**, deep gluteal/sciatic |\n\n**Key discriminator for groin pain:** intra-articular (labrum/cartilage) vs extra-articular (**adductor longus origin, pubic symphysis**). They look adjacent but are managed completely differently.\n\nWeighting means you read *more carefully* in the suspected region — it does **not** mean skipping the rest. Lateral pain still gets a marrow sweep; the sacrum and symphysis are exactly where referred pain and second lesions hide.",
        pearl: "Groin pain has an intra-articular and an extra-articular answer — read the labrum AND the rectus-adductor aponeurosis/symphysis on every groin study, because the management diverges sharply.",
      },
      {
        content: "### Satisfaction-of-Search Traps (Tension-Side Neck, Sacrum, Symphysis, Marrow)\n\nThese are the lesions that **hide behind the obvious finding** and change disposition. Defeat satisfaction of search by *always* completing the fixed order and revisiting these on step 7.\n\n**The classic traps:**\n- **Tension-side (superolateral) femoral-neck stress fracture** — a *surgical emergency*; easy to skim past once you have found a labral tear. Always state which cortex the line touches.\n- **Sacrum / pubic rami** — insufficiency and stress fractures sit at the edge of FOV and field of attention; check T1 marrow there.\n- **Pubic symphysis** — edema and the **secondary cleft sign** (athletic pubalgia) are missed when the eye stops at the hip joint.\n- **Marrow** — **confluent low-T1 marrow darker than muscle or disc** is a tumor red flag that outranks every degenerative finding. A **lesser-trochanter avulsion in an adult without trauma** is a marrow-lesion red flag (pathologic fracture), not a sprain.\n\n**Defeat tactic:** a deliberate second pass dedicated only to bone/marrow and the pelvic ring, after the soft-tissue read.",
        pearl: "After you have found the finding that explains the symptoms, do one more dedicated marrow/bone pass — that is the pass that catches the tension-side neck fracture and the confluent low-T1 tumor.",
      },
      {
        content: "### Translating Findings Into Rehab vs Injection vs Referral vs Urgent\n\nEvery read should communicate the safest next step.\n\n**URGENT (escalate today):**\n- **Tension-side (superolateral) femoral-neck stress fracture** — non-weight-bearing + urgent surgical referral.\n- Septic joint concern, SCFE, an unstable/displaced fracture, or **confluent low-T1 marrow / mass** with an acute safety concern.\n\n**PROMPT ORTHOPEDIC / HIP-PRESERVATION REFERRAL:**\n- **Pre-collapse AVN** — the joint-preserving window depends on lesion size, location, symptoms, and absence of collapse.\n- **SIFFH** (subchondral insufficiency fracture of the femoral head) — protected weight-bearing and prompt review because of collapse risk.\n- **Full-thickness retracted abductor tear**; proximal hamstring tear by **tendon count + retraction** threshold.\n- Symptomatic FAI with concordant chondrolabral injury after appropriate nonoperative care.\n\n**INJECTION:** selected focal tendinopathy, bursitis, or suspected intra-articular pain as a diagnostic/therapeutic step after clinical assessment.\n\n**REHAB / CLOSE FOLLOW-UP:** lower-risk **compression-side (inferomedial)** neck stress reaction, **transient BME without a fracture line**, and grade 1-2 muscle strains.",
        pearl: "A superolateral femoral-neck line is the same-day surgical-urgency pattern. A femoral-head subchondral fracture line (SIFFH) also requires offloading and prompt orthopedic review, while diffuse transient BME without a fracture line is generally managed conservatively after exclusion of AVN and fracture.",
      },
    ],
  },
  {
    id: "hip-bones-stress",
    number: 4,
    title: "Bones, Marrow & Stress Injury",
    subtitle: "Tension-side stress fracture, AVN, marrow-edema syndromes, insufficiency fracture, and avulsions",
    searchPatternStep: 2,
    estimatedMinutes: 22,
    essentialTopics: [0, 1, 2, 4],
    topics: [
      "Femoral-neck stress fracture: compression (inferomedial) vs TENSION (superolateral) side — a surgical emergency",
      "AVN of the femoral head: double-line sign, pattern, and ARCO staging (pre- vs post-collapse)",
      "Transient osteoporosis / bone-marrow-edema syndrome (BMES)",
      "Subchondral insufficiency fracture of the femoral head",
      "Apophyseal avulsions (ASIS, AIIS, ischial tuberosity, lesser trochanter)",
      "Sacral and pubic-ramus stress / insufficiency fracture",
    ],
    learningObjectives: [
      "Differentiate compression-side from tension-side femoral-neck stress fractures and recognize the tension side as a surgical emergency requiring urgent referral and protected weight-bearing",
      "Recognize the AVN double-line sign and stage femoral-head osteonecrosis using ARCO (pre- vs post-collapse)",
      "Distinguish transient bone-marrow-edema syndrome from AVN and from subchondral insufficiency fracture",
      "Identify apophyseal avulsion sites and the associated muscle origin, and recognize a lesser-trochanter avulsion in an adult without major trauma as a red flag for an underlying marrow-replacing lesion",
      "Recognize sacral and pubic-ramus stress fractures as causes of buttock/groin pain in runners and the female athlete triad",
    ],
    commonMistakes: [
      { mistake: "Calling all femoral-neck marrow edema a stress reaction and clearing the athlete to load", correction: "Find and side the fracture line. A superolateral (tension-side) line is at high risk of completion and displacement: it is non-weight-bearing and an urgent orthopedic referral, not progressive loading. The side determines management and must be stated." },
      { mistake: "Reading marrow edema with a subchondral double line as simply transient osteoporosis", correction: "A double-line sign (outer low-signal sclerotic rim + inner T2-high granulation line) and a serpiginous demarcated lesion indicate AVN, not BMES; BMES shows diffuse edema without a demarcating interface and is self-limited. Misclassification changes prognosis and follow-up." },
      { mistake: "Calling diffuse femoral-head/neck marrow edema pure BMES and stopping", correction: "In an older or osteopenic patient, exclude a subchondral insufficiency fracture (low-signal subchondral line paralleling the cortex with surrounding edema); it carries a real collapse risk and is managed differently from self-limited BMES." },
    ],
    topicContent: [
      {
        content: "### Femoral-Neck Stress Fracture: Compression vs Tension\n\nA runner or recruit with groin/anterior-hip pain and a normal radiograph needs **fluid-sensitive MRI** plus T1. Marrow edema alone can represent stress reaction; a discrete **low-signal fracture line** establishes a stress fracture.\n\nLocation and extent drive management:\n\n| Type | Site | Risk | Plan |\n|---|---|---|---|\n| **Incomplete compression (<50% width)** | **Infero-medial** neck | Lower | Protected weight-bearing, close follow-up |\n| **Complete compression (≥50% width) or gap** | Infero-medial neck | Higher | Urgent orthopedic review; fixation commonly indicated |\n| **Any tension-side line** | **Supero-lateral** neck | High — completion/displacement | **Non-weight-bearing + urgent fixation referral** |\n\n- Also escalate significant pain or inability to straight-leg raise even when a compression line appears incomplete.\n- Watch for **RED-S / low energy availability and bone-health drivers**.",
        pearl: "A superolateral (tension-side) femoral-neck fracture line is a surgical emergency — make the patient non-weight-bearing and call ortho the same day, because completion can displace and cause AVN.",
      },
      {
        content: "### AVN of the Femoral Head: Double-Line Sign & ARCO Staging\n\nSuspect osteonecrosis with steroid use, alcohol, sickle cell, or prior trauma. The classic MRI pattern is a **serpiginous reactive interface** rimming a geographic subchondral segment.\n\n- **Double-line sign** (T2): outer **low-signal** sclerotic rim + inner **high-signal** hyperemic/granulation line — highly characteristic when present, but interpret it with the full geographic T1 pattern.\n- T1 shows a geographic subchondral lesion with a low-signal margin; the enclosed marrow may retain near-normal fat early.\n\n**ARCO staging — the hinge is collapse:**\n\n| Stage | Finding |\n|---|---|\n| I | MRI+ / radiograph normal |\n| II | Sclerosis/cysts, **no** collapse |\n| **III** | **Subchondral fracture / crescent sign → collapse** |\n| IV | Secondary osteoarthritis |\n\n- **Pre-collapse (I–II)** = potential joint-preserving window; treatment depends on symptoms, lesion size/location, and patient factors.\n- **Post-collapse (III–IV)** = structural failure and a different surgical conversation, often including arthroplasty.\n- Always look at the **contralateral hip**; osteonecrosis is frequently bilateral.",
        pearl: "The pre- vs post-collapse line (ARCO II→III, the subchondral crescent) is the single most management-relevant finding: pre-collapse hips can be salvaged, post-collapse usually head toward replacement.",
      },
      {
        content: "### Transient Osteoporosis / Bone-Marrow-Edema Syndrome (BMES)\n\nClassically a **middle-aged man** or a **third-trimester pregnant woman** with acute atraumatic hip pain and a limp. MRI shows **diffuse marrow edema** of the femoral head extending into the neck/intertrochanteric region — **bright on STIR/T2, dark on T1** — with a possible reactive effusion.\n\nKey distinguishing features:\n\n- **No subchondral fracture line, no focal necrotic segment, no double-line sign** (vs AVN/SIFFH).\n- Edema is **diffuse and homogeneous**, often crossing into the neck — not the geographic antero-superior lesion of AVN.\n- It is generally **self-limiting** over weeks to months.\n\n**Management:** protected weight-bearing and analgesia; it is a **diagnosis of exclusion**, so actively rule out a fracture line and osteonecrotic segment. BMES can overlap with or evolve alongside subchondral insufficiency fracture, so a developing subchondral low-signal line changes the diagnosis and risk.",
        pearl: "BMES is diffuse marrow edema with NO fracture line and NO necrotic segment — but always scrutinize the subchondral bone, because a low-signal line converts it to a subchondral insufficiency fracture with real collapse risk.",
      },
      {
        content: "### Subchondral Insufficiency Fracture of the Femoral Head (SIFFH)\n\nOften encountered in older or osteopenic adults, but reported across a wider adult age range, SIFFH can present with abrupt hip pain and may mimic osteonecrosis or BMES. Unlike isolated BMES, there is a structural fracture.\n\nMRI hallmarks:\n\n- **Subchondral low-signal band** on T1 with surrounding **marrow edema** on fluid-sensitive sequences.\n- The band is often **irregular and convex toward the articular surface**, unlike the smoother, geographic segment-bounding interface of osteonecrosis.\n- Look for **flattening / subtle collapse** of the articular contour; lesion extent and collapse change prognosis and management.\n\n| Feature | BMES | SIFFH | AVN |\n|---|---|---|---|\n| Subchondral fracture band | No | **Yes** | Crescent if collapsing |\n| Double-line / geographic necrotic rim | No | No | **Characteristic when present** |\n| Collapse risk | Low when truly isolated | **Yes** | Yes |\n\n**Management:** protected or non-weight-bearing and prompt orthopedic review; evaluate bone health and lesion extent, because larger lesions or collapse may require surgery.",
        pearl: "SIFFH = a femoral-head subchondral fracture band with surrounding edema and real collapse risk. Offload the joint, assess lesion extent and bone health, and do not dismiss it as transient marrow edema.",
      },
      {
        content: "### Apophyseal Avulsions (ASIS, AIIS, Ischial Tuberosity, Lesser Trochanter)\n\nIn **adolescents/young athletes**, sudden muscle pull avulses the un-fused apophysis. MRI shows a **displaced ossific fragment**, marrow edema, and tendon/muscle strain at the donor site.\n\n| Site | Muscle | Mechanism |\n|---|---|---|\n| **ASIS** | Sartorius | Sprinting |\n| **AIIS** | Rectus femoris (direct/straight head) | Kicking |\n| **Ischial tuberosity** | Hamstring origin | Hurdling/splits |\n| **Lesser trochanter** | Iliopsoas | Sudden flexion |\n\n- Most are managed **conservatively**; large displacement (often cited **>1.5–2 cm**, especially ischial) prompts surgical discussion.\n- **Red flag:** a **lesser-trochanter avulsion in an ADULT without significant trauma** is a **pathologic-fracture marker** — assume an underlying metastasis/marrow lesion until proven otherwise.",
        pearl: "A lesser-trochanter avulsion in an adult with no real trauma is a malignancy red flag — scrutinize the marrow for confluent low-T1 infiltration (darker than muscle/disc) and work up for metastatic disease.",
      },
      {
        content: "### Sacral & Pubic-Ramus Stress / Insufficiency Fractures\n\nTwo populations: **young athletes** (fatigue fracture of normal bone under load — distance runners, the female athlete triad) and **older/osteoporotic or post-radiation** patients (insufficiency fracture of weak bone under normal load).\n\nMRI findings:\n\n- **Sacrum:** marrow edema in the **sacral ala** with a **vertical low-signal line** paralleling the SI joint; bilateral ala edema **± a horizontal component = the H/Honda sign** (classic for insufficiency).\n- **Pubic ramus:** edema and a low-signal line; can mimic or coexist with athletic pubalgia, so read the whole pelvis.\n- Radiographs are often negative — **MRI (STIR) or bone scan** makes the diagnosis.\n\n**Management:** relative rest/protected weight-bearing and pain control. Critically, **work up the cause**: bone-density evaluation, and in young women screen for the **female athlete triad / RED-S** (energy deficiency, menstrual dysfunction, low bone density).",
        pearl: "Sacral ala or pubic-ramus stress fracture in a young female athlete should trigger a female-athlete-triad (RED-S) work-up; in an older patient, bilateral ala edema with the Honda/H sign points to an osteoporotic insufficiency fracture needing bone-health treatment.",
      },
    ],
  },
  {
    id: "hip-fai-labrum",
    number: 5,
    title: "FAI & the Acetabular Labrum",
    subtitle: "Cam vs pincer morphology, the alpha angle, labral tears, paralabral cysts, and chondral injury",
    searchPatternStep: 4,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 2],
    topics: [
      "Cam morphology and the alpha angle (oblique-axial/radial measurement)",
      "Pincer morphology: crossover sign, coxa profunda, acetabular retroversion/over-coverage (LCEA)",
      "Anterosuperior labral tears: appearance and pitfalls vs normal sublabral recess",
      "Paralabral cysts as a secondary sign of a tear, and os acetabuli",
      "FAI-associated acetabular rim chondral injury and delamination at the chondrolabral junction",
    ],
    learningObjectives: [
      "Measure the alpha angle in the correct plane (oblique-axial along the neck or radial), recognizing ≥60 degrees as the better-supported classification threshold while treating the angle as a continuous, context-dependent measurement",
      "Differentiate cam from pincer (and mixed) FAI using femoral and acetabular morphologic signs",
      "Identify an anterosuperior labral tear, distinguish it from a normal sublabral recess, and recognize a paralabral cyst as a secondary indicator that should trigger a directed search for the tear",
      "Localize associated acetabular chondral injury/delamination and explain why its presence (more than the labral tear alone) weights management toward surgical referral",
      "Recognize that asymptomatic cam/pincer morphology is common, so FAI is a clinical-plus-imaging diagnosis",
    ],
    commonMistakes: [
      { mistake: "Using a single universal alpha-angle cutoff or measuring it on a standard axial slice", correction: "Measure the alpha angle on an oblique-axial plane along the femoral neck or on radial images. The historic >55-degree cutoff remains common, but systematic-review evidence supports ≥60 degrees for classifying cam morphology; report the value and plane rather than turning one cutoff into a diagnosis." },
      { mistake: "Reporting cam or pincer morphology as 'FAI' without symptoms, or calling every anterosuperior labral signal a tear", correction: "Cam/pincer morphology and labral signal changes (including the normal sublabral recess) are common in asymptomatic hips. FAI is a clinical-imaging diagnosis: describe the morphology and require fluid/contrast undercutting into labral substance before calling a tear, then correlate with exam." },
      { mistake: "Reporting a labral tear but not searching the adjacent acetabular cartilage", correction: "Anterosuperior labral tears are frequently accompanied by chondrolabral-junction chondral injury or delamination, which is often the more management-relevant finding for surgical planning and prognosis." },
    ],
    topicContent: [
      {
        content: "### Cam Morphology and the Alpha Angle\n\n**Cam morphology** is asphericity at the anterosuperior **femoral head-neck junction** — a bump that loses the normal concave waist and may contribute to chondrolabral shear during flexion/internal rotation.\n\n**Measuring the alpha angle:**\n- Center a circle on the femoral head. Draw line 1 from head center down the **femoral neck axis**; line 2 from head center to the point where the head first exits the circle. The angle between them is alpha.\n- Plane matters: measure on **oblique-axial** images angled along the neck, or **radial** reformats. A standard axial can under-sample the **anterosuperior (12–3 o'clock)** peak.\n- The historic >55° cutoff remains widely cited, but systematic-review evidence supports **≥60°** as the better classification threshold. This is a classification aid, not a stand-alone clinical diagnosis.\n\n**Management:** report the measured value, plane, morphology, and any concordant labral/cartilage injury. Symptomatic FAI requires compatible symptoms and examination; surgery is considered only in the full clinical context, often after appropriate nonoperative care.",
        pearl: "Measure the alpha angle on oblique-axial/radial images where the anterosuperior bump actually lives — a normal straight-axial alpha angle can hide a clinically important cam at 1–2 o'clock.",
      },
      {
        content: "### Pincer: Crossover, Coxa Profunda, Retroversion, Over-coverage\n\n**Pincer** is acetabular **over-coverage** — the rim contacts the neck and levers the labrum. Read it from the bony acetabulum, not just the labrum.\n\n**Patterns to recognize:**\n- **Crossover sign** — a radiographic sign on a true AP pelvis where the anterior rim line crosses the posterior rim line near the top, indicating focal **cranial acetabular retroversion** (anterior over-coverage). On MRI, correlate version and rim coverage on axial/oblique slices.\n- **Coxa profunda / protrusio** — deep socket; in coxa profunda the acetabular floor touches or passes the **ilioischial line**, and in protrusio the femoral head crosses it. Global over-coverage.\n- **LCEA (lateral center-edge angle) >40°** = lateral over-coverage (vs. <20–25° = dysplasia/under-coverage).\n\n**MRI clues:** rim-side labral degeneration/ossification, a **contrecoup** posteroinferior chondral injury (the femoral head pivots away from the impinging anterior rim).\n\n**Management:** pincer is treated by **rim trimming with labral refixation**; over-resection risks iatrogenic instability. Most FAI is **mixed (cam + pincer)** — name both because each drives a different part of the bony correction.",
        pearl: "A contrecoup posteroinferior chondral injury is the tell of pincer impingement — the lesion sits opposite the impinging anterior rim, not at the point of contact.",
      },
      {
        content: "### Anterosuperior Labral Tear vs. Normal Sublabral Recess\n\nThe acetabular labrum is a **low-signal triangle** on the rim. Tears and a normal recess both show fluid signal at the chondrolabral junction — distinguishing them prevents over-calling.\n\n| Feature | Normal sublabral recess | Labral tear |\n|---|---|---|\n| Margins | Smooth, follows cartilage, no displacement | Frayed, blunted, displaced |\n| Contrast extension | Partial, smooth, at the **base** only | Into labral **substance**, irregular |\n| Adjacent findings | None | Paralabral cyst, chondral loss, FAI morphology |\n\n- A recess is a **smooth-walled cleft** paralleling the cartilage; it does not enter the body of the labrum. Sublabral sulci/recesses are recognized at the **anterosuperior** rim as well as posteroinferiorly, so location alone does not settle it.\n- **MR arthrography** (or traction/leg-pull) improves sensitivity for the anterosuperior tear typical of cam FAI.\n- The classic cam tear zone is **anterosuperior (12–3 o'clock)** — weigh trajectory, margins, and secondary signs rather than location alone.\n\n**Management:** isolated degenerative fraying is treated conservatively; an unstable, symptomatic anterosuperior tear with FAI is refixed at arthroscopy.",
        pearl: "Trajectory and margins decide it, not location: contrast that tracks smoothly along the cartilage base is a recess; contrast extending INTO the labral substance with frayed margins — especially with a paralabral cyst — is a tear.",
      },
      {
        content: "### Paralabral Cysts and Os Acetabuli\n\n**Paralabral cyst** — a **T2-bright, lobulated** fluid collection adjacent to the labrum, often tracking along the rim or into the surrounding soft tissues. It forms when joint fluid is pumped through a **full-thickness labral tear** (one-way valve).\n\n- **Key role: a secondary sign.** A paralabral cyst is highly specific for an underlying tear — find the cyst, then scrutinize the adjacent labrum, even if the tear itself looks subtle.\n- Large anterior cysts can abut the iliopsoas or extend toward adjacent neurovascular structures (e.g., femoral neurovascular bundle) — note mass effect.\n\n**Os acetabuli** — an ossicle at the acetabular rim. It may be an unfused secondary ossification center or, in FAI, a **rim stress fracture / chronic pincer apophyseal fragment**. On MRI: a corticated bony fragment at the anterosuperior rim, sometimes with adjacent marrow edema if active.\n\n**Management:** the cyst confirms the tear and supports labral repair. An os acetabuli matters surgically — it can represent rim overload, and the surgeon decides excision vs. incorporation/fixation based on size and fragment viability.",
        pearl: "Treat a paralabral cyst as a strong secondary sign of an adjacent labral tear — trace the cyst neck back to the labrum, but describe the actual tear only when its location and morphology are supported.",
      },
      {
        content: "### Rim Chondral Injury / Delamination at the Chondrolabral Junction\n\nFAI damages cartilage where the impingement lands: the **anterosuperior acetabular rim**, at the **chondrolabral junction**. This is the lesion that pushes management toward surgery.\n\n**What to look for on MRI:**\n- **Delamination** — fluid/contrast undercutting the cartilage, separating it from subchondral bone (the \"carpet lifting off the floor\"); the surface can look deceptively intact.\n- **Wave sign** — a mobile cartilage flap. Look for an **outer-edge chondral fissure** at the chondrolabral junction adjacent to a cam lesion.\n- **Subchondral changes** — rim marrow edema, cysts, early sclerosis.\n- Cam → **acetabular-sided** anterosuperior delamination; pincer → narrower rim chondral injury plus **contrecoup** posteroinferior loss.\n\n**Why it weights toward surgery:** intact labrum + reparable chondral lesion = good candidate for **osteochondroplasty + chondrolabral repair**. **Diffuse full-thickness cartilage loss / Tönnis 2–3 (joint-space narrowing)** predicts poor arthroscopic outcomes — that patient is steered toward conservative care or arthroplasty, not scope.",
        pearl: "The amount and depth of rim chondral damage — not the labral tear — is the strongest imaging driver of the surgical decision; delamination is repairable, but diffuse full-thickness loss predicts a failed scope.",
      },
    ],
  },
  {
    id: "hip-cartilage-oa",
    number: 6,
    title: "Cartilage & Early OA",
    subtitle: "Chondral delamination, subchondral change, and the joint-preservation-vs-arthroplasty conversation",
    searchPatternStep: 3,
    estimatedMinutes: 18,
    essentialTopics: [0, 1, 3],
    topics: [
      "Systematic acetabular and femoral-head cartilage assessment",
      "Chondral delamination vs full-thickness loss (the cam-related shear injury)",
      "Subchondral cysts and subchondral marrow change as load markers",
      "Joint-space narrowing and the early-osteoarthritis pattern",
      "When MR arthrography (with traction) improves chondral detection and changes management",
    ],
    learningObjectives: [
      "Assess acetabular and femoral cartilage systematically and grade chondral loss as partial-thickness, full-thickness, or delamination separate from surface fibrillation",
      "Differentiate focal FAI-related rim chondral injury from diffuse early osteoarthritis, and a degenerative subchondral cyst/geode from an aggressive lytic process",
      "Recognize the degree of cartilage loss and joint-space narrowing at which joint preservation becomes less effective, shifting referral from arthroscopy toward arthroplasty",
      "State when direct MR arthrography, particularly with traction, increases sensitivity for chondral and chondrolabral lesions and will change management",
    ],
    commonMistakes: [
      { mistake: "Assuming standard non-contrast MRI reliably excludes early acetabular chondral delamination", correction: "Hip cartilage is thin and closely apposed; delamination is a fluid cleft undermining an intact-looking surface and is easy to miss. Direct MR arthrography (optionally with leg traction) improves detection of chondral/chondrolabral lesions when this will change management." },
      { mistake: "Equating any subchondral cyst or marrow edema with early OA, or a labral tear with a surgically correctable problem regardless of cartilage", correction: "Interpret subchondral cysts alongside cartilage status, joint space, and morphology; isolated edema without chondral loss may be a stress/insufficiency phenomenon. Diffuse cartilage loss predicts poor outcomes from labral repair and shifts management away from joint preservation." },
    ],
    topicContent: [
      {
        content: "### Systematic acetabular and femoral-head cartilage assessment\n\nGrade hip cartilage the same way every time so you don't miss the focal lesion that changes the operation. Use **fluid-sensitive sequences** (intermediate-weighted/PD fat-sat, T2 fat-sat) where cartilage is intermediate signal against bright fluid and dark subchondral bone.\n\nA reproducible system:\n- **Clock-face the acetabulum** on radial/sagittal images (anterosuperior, roughly the 12-3 o'clock zone, is where FAI damage clusters).\n- Track each surface: **acetabular** then **femoral head**, looking for surface fibrillation, fissures, thinning, focal full-thickness defects, and subchondral signal.\n- Note **location** (anterosuperior vs global), **depth** (partial vs full-thickness), and **size**.\n\n| Finding | Read as |\n|---|---|\n| Focal anterosuperior loss | FAI/cam shear |\n| Diffuse circumferential loss | Early OA |\n\n**Management:** a small, well-shouldered focal defect with preserved joint space favors **joint-preserving arthroscopy/osteoplasty**; diffuse loss does not.",
        pearl: "Always localize cartilage damage on a clock face: focal anterosuperior loss points to a correctable FAI lesion, while diffuse loss signals OA and shifts you away from arthroscopy.",
      },
      {
        content: "### Chondral delamination vs full-thickness loss (cam shear injury)\n\nThe **cam bump** shears the acetabular cartilage off the subchondral plate during impingement, so the earliest FAI cartilage injury is often a **delamination** with an intact-looking surface, which is easy to miss.\n\n**Delamination** = cartilage separates from bone at the tidemark while the surface stays continuous. Look for:\n- A thin line of **fluid/high signal undercutting the cartilage** (the \"carpet lifting off the floor\").\n- Cartilage that looks normal in thickness but is **unstable/wavy** or shows a hypointense interface.\n- Typically **anterosuperior**, adjacent to the chondrolabral junction.\n\n**Full-thickness loss** = focal defect down to bone, often with reactive subchondral edema or cyst.\n\n| | Surface | Depth | Detection |\n|---|---|---|---|\n| Delamination | Intact | Deep cleavage | Often needs arthrography/traction |\n| Full-thickness | Disrupted | To bone | Visible on standard MR |\n\n**Management:** delaminated flaps are unstable and arthroscopically treatable (debridement, microfracture/fixation) **together with** cam osteoplasty; flagging them changes the surgical plan.",
        pearl: "A delaminated flap can look like normal-thickness cartilage on standard MRI; the giveaway is a thin fluid signal undercutting it, and missing it leaves an unstable flap that fails after isolated cam correction.",
      },
      {
        content: "### Subchondral cysts and marrow change as load markers\n\nSubchondral signal tells you where the joint is **overloaded**, not just where cartilage is gone.\n\n- **Subchondral BME-like marrow change**: ill-defined T2-hyperintense/T1-hypointense signal beneath a cartilage defect = active focal overload, usually anterosuperior in FAI.\n- **Subchondral cysts (geodes)**: well-defined, rounded, **T2-bright/T1-dark** lesions, typically **at or near the cartilage defect** and the bony stress point.\n\nGeode vs aggressive lesion, the reassuring features:\n\n| Geode (benign) | Aggressive (red flag) |\n|---|---|\n| Small, rounded, well-corticated | Confluent, ill-defined |\n| At joint surface/load point | Away from surface, marrow-replacing |\n| Paired with cartilage loss | Low T1 **darker than muscle/disc** |\n| No soft-tissue mass | Cortical breakthrough, mass |\n\n**Management:** cysts/BME tracking the load point confirm a mechanical, treatable problem. A **confluent low-T1 marrow lesion darker than muscle or disc** is a tumor red flag, so stop and work it up rather than calling it OA.",
        pearl: "A confluent marrow lesion lower in T1 signal than adjacent muscle or disc is marrow replacement, not a degenerative geode: treat it as a tumor red flag, not early OA.",
      },
      {
        content: "### Joint-space narrowing and the early-OA pattern\n\nEarly OA on MRI is **diffuse**, not focal: circumferential cartilage thinning, **global joint-space narrowing**, marginal osteophytes, subchondral sclerosis/cysts, and effusion/synovitis. Contrast this with FAI's focal anterosuperior wear.\n\nReading early OA:\n- **Cartilage**: diffuse thinning across acetabular and femoral surfaces, not one clock-position.\n- **Joint space**: narrowing best confirmed on the **weightbearing radiograph**; MRI tends to overcall preserved space because it is non-weightbearing.\n- **Osteophytes, sclerosis, subchondral cysts** at multiple sites.\n\nThe threshold that matters:\n\n| Pattern | Procedure |\n|---|---|\n| Focal lesion, **joint space preserved** | Joint-preserving arthroscopy/osteoplasty |\n| Diffuse loss, **joint space ≤2 mm / Tönnis grade ≥2** | Arthroplasty territory |\n\n**Management:** advanced/diffuse cartilage loss with established narrowing predicts **arthroscopy failure**; these patients are headed for arthroplasty, and recognizing it prevents an operation that won't help.",
        pearl: "Confirm joint-space narrowing on a weightbearing radiograph, not MRI: diffuse loss with narrowing (Tönnis grade ≥2) moves the patient out of arthroscopy and into arthroplasty planning.",
      },
      {
        content: "### When MR arthrography with traction improves chondral detection\n\nNative cartilage surfaces are apposed, so subtle defects and **delamination** hide. **Direct MR arthrography (MRA)** distends the joint with dilute gadolinium; adding **axial traction** pulls the surfaces apart and lets contrast fill defects and undercut delaminated flaps.\n\nUse MRA ± traction when:\n- You **suspect FAI/labral or chondral pathology** but standard MRI is equivocal.\n- You need to characterize a **delamination** or surface flap before surgery.\n- The clinical picture (young athlete, mechanical symptoms) outpaces the standard study.\n\n| | Standard MRI | MRA + traction |\n|---|---|---|\n| Surfaces | Apposed | Separated by contrast |\n| Delamination | Often missed | Contrast undercuts flap |\n| Sensitivity | Lower for early chondral | Higher |\n\n**Management:** a traction MRA that confirms a stable, focal, treatable lesion in a young patient supports **joint preservation**; if it instead shows diffuse loss, it appropriately steers toward non-operative or arthroplasty pathways. It is an invasive test, so reserve it for cases where the result changes the plan.",
        pearl: "Traction MR arthrography unmasks delamination and early chondral defects by pulling apposed surfaces apart: order it when standard MRI is equivocal and the answer will change whether you operate.",
      },
    ],
  },
  {
    id: "hip-tendons-muscles",
    number: 7,
    title: "Tendons & Muscles",
    subtitle: "Abductor cuff/GTPS, hamstring origin, iliopsoas/snapping hip, and athletic pubalgia",
    searchPatternStep: 5,
    estimatedMinutes: 24,
    essentialTopics: [0, 1, 4],
    topics: [
      "Gluteus medius/minimus ('rotator cuff of the hip') and greater trochanteric pain syndrome (GTPS)",
      "Proximal hamstring origin: tendinosis, partial tear, and tendon count/retraction that triggers surgical referral",
      "Rectus femoris / AIIS injury and the universal muscle-strain grading framework",
      "Iliopsoas: tendinosis, internal snapping hip, and iliopsoas bursa",
      "Adductor injury and athletic pubalgia / core-muscle injury (rectus-adductor aponeurosis, secondary cleft sign)",
    ],
    learningObjectives: [
      "Recognize gluteus medius/minimus tendinopathy and tears at the trochanteric footprint and explain why GTPS is usually a rehab/injection problem until a full-thickness retracted abductor tear shifts it toward referral",
      "Grade proximal hamstring origin injury and identify the features (number of tendons involved, retraction) that change management from rehab to surgical referral",
      "Apply the universal muscle-strain grading framework (grade 1 feathery edema, grade 2 partial with fluid, grade 3 complete with retraction) to rectus femoris/AIIS and adductor injuries",
      "Differentiate internal (iliopsoas) snapping hip from intra-articular causes of anterior hip pain and recognize iliopsoas tendinosis/bursa findings",
      "Identify athletic pubalgia / core-muscle injury at the rectus abdominis-adductor aponeurosis (secondary cleft sign) and distinguish it from a labral tear",
    ],
    commonMistakes: [
      { mistake: "Attributing all lateral hip pain to 'trochanteric bursitis'", correction: "GTPS is most often gluteus medius/minimus tendinopathy or tearing (the hip's rotator cuff), with peritrochanteric fluid usually secondary. Read the abductor footprint for tendon signal/thickness change and undersurface tears; a full-thickness retracted tear is the finding that prompts surgical referral." },
      { mistake: "Reporting a proximal hamstring tear without tendon count and retraction", correction: "Management hinges on how many of the three tendons are involved and how far the stump has retracted. Acute multi-tendon avulsions with retraction are surgical-referral injuries; isolated tendinosis is rehab. Always state both, and note sciatic nerve proximity." },
      { mistake: "Calling groin pain a labral tear when the problem is at the pubic symphysis, or mistaking the normal primary cleft for the secondary cleft sign", correction: "Athletic pubalgia / core-muscle injury at the rectus-adductor aponeurosis (secondary cleft sign — fluid extending inferolaterally from the symphysis — and aponeurotic plate disruption) is extra-articular and managed differently. The central primary cleft is normal; inspect the symphysis on every groin-pain study." },
    ],
    topicContent: [
      {
        content: "### Gluteus Medius/Minimus — the 'Rotator Cuff of the Hip' and GTPS\n\n**Greater trochanteric pain syndrome (GTPS)** is usually abductor **tendinopathy/tearing**, not bursitis. The gluteus medius/minimus insert on the **greater trochanter** at named facets (minimus → anterior facet; medius → lateral + superoposterior facets).\n\n**What to read on MRI (fluid-sensitive fat-sat coronal/axial):**\n- **Tendinopathy:** thickened tendon, intermediate T2 signal, peritrochanteric edema.\n- **Partial tear:** focal fluid signal at the facet, fraying, often with reactive **trochanteric bursal fluid**.\n- **Full-thickness tear:** fluid-filled gap, **tendon retraction**, fatty atrophy of the muscle belly (best on **T1**).\n\n| Finding | Management |\n|---|---|\n| Tendinopathy / low-grade partial | PT, load management, image-guided injection |\n| Full-thickness **retracted** tear + atrophy | **Surgical referral** |\n\nThe classic look: peritrochanteric T2 hyperintensity tracking along the facets. Don't call it \"bursitis\" reflexively — interrogate the tendon footprint itself.",
        pearl: "A full-thickness, **retracted** abductor tear with fatty muscle atrophy is a surgical-referral lesion — an isolated \"trochanteric bursitis\" report should prompt you to scrutinize the gluteus medius/minimus tendon footprint before settling for conservative care.",
      },
      {
        content: "### Proximal Hamstring Origin — Tendinosis, Partial Tear, and the Referral Triggers\n\nThe hamstrings (**semitendinosus + biceps femoris conjoint tendon, semimembranosus**) arise from the **ischial tuberosity**. Injury ranges from chronic insertional **tendinosis** to acute **avulsion**.\n\n**MRI read (oblique-coronal/axial fat-sat):**\n- **Tendinosis:** thickened, intermediate-signal tendon at the tuberosity, no fiber gap.\n- **Partial tear:** focal fluid signal, some intact fibers.\n- **Complete avulsion:** all tendons discontinuous, fluid gap, **measurable retraction**.\n\n**Two numbers that change management:**\n1. **Tendon count** — how many of the **3 tendons** are torn (free-tendon avulsion of ≥2 tendons trends surgical).\n2. **Retraction** — measured from the tuberosity; **>2 cm** retraction of a 2–3 tendon avulsion favors **surgical repair**, especially in active patients.\n\n| Pattern | Management |\n|---|---|\n| Tendinosis / low-grade partial | PT, eccentric load |\n| 2–3 tendon avulsion, retraction >2 cm | **Surgical referral** |",
        pearl: "For proximal hamstring avulsions, your report needs **two data points the surgeon cares about: tendon count and retraction distance.** A 2–3 tendon avulsion retracted >2 cm in an active patient is a repair candidate — vague \"high-grade tear\" wording underserves the decision.",
      },
      {
        content: "### Rectus Femoris / AIIS Injury and the Universal Muscle-Strain Grading Framework\n\nThe **rectus femoris** has a **direct head (AIIS)** and an **indirect/reflected head (superior acetabular rim)**. Its central intramuscular tendon (the \"bull's-eye\" on axial) is a common strain site; in skeletally immature athletes the **AIIS apophysis avulses** instead.\n\n**Universal muscle-strain grades (apply to ANY muscle — rectus, adductor, hamstring):**\n\n| Grade | MRI finding | Management |\n|---|---|---|\n| **1** | Feathery T2 edema, **<5%** fibers, no architectural disruption | Relative rest, RTP days–~2 wk |\n| **2** | Partial tear, fluid at myotendinous junction, some fiber discontinuity | PT, RTP weeks |\n| **3** | **Complete** rupture ± retraction, hematoma | Consider surgical referral (esp. proximal/retracted) |\n\nMost strains occur at the **myotendinous junction**. Read fat-sat fluid-sensitive sequences for the edema pattern and look for a discrete fiber gap that upgrades a grade 1 to grade 2/3.",
        pearl: "Strain grading is **universal** — grade 1 is edema only, grade 2 is a partial tear, grade 3 is complete rupture. In an adolescent, the same mechanism avulses the **AIIS apophysis** rather than tearing muscle, so check the apophysis on T1 before calling it a simple strain.",
      },
      {
        content: "### Iliopsoas — Tendinosis, Internal Snapping Hip, and the Iliopsoas Bursa\n\nThe **iliopsoas tendon** crosses the anterior hip to insert on the **lesser trochanter**; the **iliopsoas bursa** sits between the tendon and the joint and communicates with the hip in ~15%.\n\n**MRI read:**\n- **Tendinosis:** thickened, intermediate-signal tendon anterior to the joint.\n- **Iliopsoas bursitis:** fluid-distended bursa anteromedial to the hip — can be reactive to intra-articular pathology.\n- **Internal snapping hip:** a **dynamic** diagnosis (tendon snapping over the **iliopectineal eminence / femoral head**). MRI is often normal at rest; **dynamic ultrasound** is the confirmatory test.\n\n**Differentiating snapping causes:**\n\n| Type | Cause | Test |\n|---|---|---|\n| **Internal** | Iliopsoas over iliopectineal eminence | Dynamic US |\n| **External** | IT band/gluteus maximus over greater trochanter | Exam/US |\n| **Intra-articular** | Labral tear, loose body | MR arthrogram |",
        pearl: "**Internal snapping hip is a dynamic, often MRI-negative diagnosis** — confirm with dynamic ultrasound, and don't attribute the snap to an incidental labral tear. A tense iliopsoas bursa should prompt a hunt for the intra-articular process driving it.",
      },
      {
        content: "### Adductor Injury and Athletic Pubalgia (\"Sports Hernia\")\n\nThe **adductor longus** origin at the pubis is the classic strain site; apply the **universal 1–3 grading**. **Athletic pubalgia** is an overlapping but distinct entity centered on the **rectus abdominis–adductor longus aponeurosis** at the pubic symphysis — *not* a true hernia.\n\n**MRI read (fluid-sensitive, large FOV pelvis):**\n- **Adductor strain:** myotendinous/origin edema, ± partial tear.\n- **Athletic pubalgia:** disruption/edema at the **rectus-adductor aponeurosis**; the **secondary cleft sign** — fluid extending **inferolaterally** from the symphysis along the adductor origin — is the key marker.\n- **Osteitis pubis:** symmetric subchondral marrow edema about the symphysis (often coexists).\n\n**Why it matters:** athletic pubalgia is groin pain from the **aponeurosis**, managed with targeted PT/core rehab and sometimes surgery — a **labral tear** is intra-articular and presents with mechanical/C-sign symptoms. Distinguishing them changes the whole pathway.",
        pearl: "The **secondary cleft sign** (fluid tracking inferolaterally from the symphysis) localizes pain to the **rectus-adductor aponeurosis** of athletic pubalgia — anatomically and managerially distinct from an intra-articular **labral tear**, so don't let an incidental labral finding hijack the workup.",
      },
    ],
  },
  {
    id: "hip-dont-miss",
    number: 8,
    title: "Don't-Miss / Red Flags",
    subtitle: "Findings that escalate management today: tension-side fracture, AVN, septic joint, tumor, SCFE/Perthes",
    searchPatternStep: 7,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      "Tension-side femoral-neck stress fracture and occult/insufficiency fracture in the elderly",
      "AVN of the femoral head before collapse",
      "Septic arthritis and osteomyelitis pattern",
      "Soft-tissue mass / sarcoma and marrow-replacement / metastasis",
      "Athletic pubalgia as a commonly missed groin-pain source",
      "SCFE and Legg-Calve-Perthes in the skeletally immature; referred pelvic/oncologic pathology",
    ],
    learningObjectives: [
      "Triage the hip MRI findings that require urgent escalation (tension-side femoral-neck fracture, septic arthritis, aggressive marrow/soft-tissue lesion) versus routine referral, and route each to the correct disposition",
      "Recognize an occult or subchondral insufficiency fracture in the elderly that explains a 'negative x-ray' painful hip and changes weight-bearing instructions",
      "Identify imaging red flags for tumor (confluent low-T1 marrow replacement darker than muscle or disc, soft-tissue mass, periosteal reaction) that warrant oncologic workup rather than a sports diagnosis",
      "Recognize SCFE and Legg-Calve-Perthes in the skeletally immature and explain the urgency of SCFE (non-weight-bearing, prompt pediatric-ortho referral)",
    ],
    commonMistakes: [
      { mistake: "Dismissing hip/groin pain with negative radiographs as soft-tissue strain", correction: "A negative radiograph does not exclude an occult femoral-neck fracture, tension-side stress fracture, AVN, or a marrow-replacing lesion. MRI (T1 plus fluid-sensitive) is the sensitive test; the tension-side fracture and occult elderly fracture change weight-bearing and referral immediately." },
      { mistake: "Anchoring on a sports diagnosis and overlooking a marrow-replacing lesion or treating an effusion with synovitis as a degenerative flare", correction: "Confluent low-T1 marrow that is darker than skeletal muscle or an intervertebral disc, or a soft-tissue mass/periosteal reaction, should trigger an oncologic workup. In the right clinical setting (fever, raised inflammatory markers), a tense effusion with synovitis and periarticular edema is septic arthritis until proven otherwise — urgent aspiration, not injection." },
      { mistake: "Treating a subtle SCFE as a benign physeal variant", correction: "In an adolescent, even a subtle slipped capital femoral epiphysis is an orthopedic urgency: make non-weight-bearing and refer promptly to prevent further slip and AVN. Look for physeal widening/edema and posteromedial epiphyseal slip." },
    ],
    topicContent: [
      {
        content: "### Tension-Side Femoral-Neck Stress Fracture and Occult/Insufficiency Fracture\n\nNot all femoral-neck stress fractures are equal — **location and extent dictate urgency.**\n\n- An **incomplete compression-side (inferomedial) line involving <50% of neck width** is the lower-risk pattern and is often managed with protected weight-bearing and close follow-up.\n- A **compression-side line involving ≥50%**, a fracture gap, significant pain/inability to straight-leg raise, or any **tension-side (superolateral) line** needs urgent orthopedic review; tension-side fractures are particularly unstable and commonly fixed.\n\n**MRI signs:**\n- Diffuse femoral-neck **marrow edema** is sensitive but nonspecific\n- A **linear T1-hypointense fracture line** establishes and localizes the fracture\n- State the side, percentage of neck width, cortical break/gap, and displacement\n\n**Occult fracture in an older patient:**\n- Hip pain + **negative radiograph** + inability to bear weight → MRI, not reassurance\n- Look for a **subcapital/intertrochanteric T1-hypointense line** within marrow edema\n- MRI can detect fractures missed on early radiographs and CT\n\n| Finding | Management |\n|---|---|\n| Edema only, no line | Protect activity; exclude an occult line and follow clinically |\n| Incomplete compression line <50% | Protected weight-bearing + close review |\n| Compression ≥50%, gap, or tension-side line | **NWB + urgent ortho** |",
        pearl: "A superolateral (tension-side) femoral-neck fracture line is a surgical emergency — make the patient non-weight-bearing and call ortho the same day. In an elderly patient who can't bear weight with a negative x-ray, the next test is MRI, not reassurance.",
      },
      {
        content: "### AVN of the Femoral Head Before Collapse\n\nThe goal is to detect osteonecrosis **before articular-surface collapse**, when joint-preserving options may still be considered.\n\n**Characteristic MRI pattern:**\n- A geographic subchondral lesion with a **serpiginous low-signal rim on T1**\n- A **double-line sign** on T2/fluid-sensitive imaging: inner high-signal granulation tissue paralleling an outer low-signal sclerotic rim\n\n**The collapse hinge (ARCO staging):**\n- **Pre-collapse (ARCO I–II):** intact contour → joint-preserving options depend on symptoms, lesion size/location, and patient factors\n- **ARCO III+:** **subchondral fracture / crescent sign** with or without depression; increasing collapse changes the surgical conversation\n\n**What changes management on every read:**\n- Report the subchondral fracture/collapse status, lesion size, and weight-bearing location\n- Osteonecrosis is often bilateral; inspect the contralateral hip\n- Note relevant risk factors such as **corticosteroids, alcohol exposure, sickle cell disease, and prior trauma**",
        pearl: "The geographic T1 lesion and characteristic double-line pattern support AVN; prognosis and treatment hinge on lesion size/location and whether a subchondral fracture or collapse has occurred. Always inspect the other hip.",
      },
      {
        content: "### Septic Arthritis and Osteomyelitis Pattern\n\nA hot, painful hip with fever is a **can't-miss, joint-threatening emergency** — cartilage is destroyed within hours to days. **Imaging supports, but never delays, joint aspiration.**\n\n**Septic arthritis on MRI:**\n- **Joint effusion** with thick, **avidly enhancing synovium** (give contrast if sepsis is suspected)\n- **Perisynovial / soft-tissue edema** and reactive marrow edema on both sides of the joint\n- A complex or loculated effusion raises concern but cannot exclude infection\n\n**Osteomyelitis on MRI:**\n- **Confluent T1-hypointense marrow** replacing normal fat, bright on T2/STIR, with **post-contrast enhancement**\n- **Rim-enhancing intraosseous/soft-tissue abscess**, cortical breakthrough, sinus tract\n- Adjacent **myositis** or fluid collection\n\n**Management triggers:**\n- Suspicion of septic arthritis → **urgent aspiration** for cell count/Gram stain/culture; do not wait on MRI\n- Confirmed infection → surgical **drainage/washout** + organism-directed antibiotics\n- Distinguish from transient synovitis (especially in children): septic hips have higher fever, refusal to bear weight, and inflammatory markers",
        pearl: "MRI can suggest septic arthritis, but the diagnosis is made by aspiration — never let imaging delay tapping a hot hip. Treat a confluent marrow-replacing T1-dark, enhancing lesion adjacent to an effusion as osteomyelitis until proven otherwise.",
      },
      {
        content: "### Soft-Tissue Mass / Sarcoma and Marrow Replacement / Metastasis\n\nThe hip and pelvis are common sites for incidental — and dangerous — masses. Your job is to separate benign from **aggressive** and route the patient correctly, **without biopsying through the wrong plane.**\n\n**Marrow-replacement red flag:**\n- **Confluent low-T1 marrow that is DARKER than adjacent skeletal muscle or disc** = abnormal marrow replacement (tumor/infiltration), not benign red marrow\n- Benign hematopoietic marrow stays **brighter than muscle** on T1 — this single comparison is the highest-yield check\n\n**Aggressive lesion features:**\n- **Cortical destruction**, **periosteal reaction** (lamellated/sunburst), wide zone of transition\n- Associated **soft-tissue mass** extending beyond bone\n- Enhancing soft-tissue component\n\n**Soft-tissue sarcoma red flags:**\n- **Deep**, **> 5 cm**, **enlarging**, heterogeneous, non-fatty mass — these are sarcoma until proven otherwise\n\n**Management:**\n- Do **not** biopsy or resect locally — refer to a **sarcoma/orthopedic-oncology center** so the biopsy tract can be planned and excised en bloc\n- Confluent marrow replacement in an at-risk patient → **metastatic/myeloma workup**",
        pearl: "On T1, normal marrow is brighter than muscle; marrow that is darker than muscle or disc is replaced and abnormal — that is your tumor red flag. A deep, enlarging soft-tissue mass over 5 cm goes to a sarcoma center, never to a local excision, so the biopsy tract isn't contaminated.",
      },
      {
        content: "### Athletic Pubalgia — A Commonly Missed Groin-Pain Source\n\n**Athletic pubalgia (\"sports hernia\")** is chronic activity-related groin/lower-abdominal pain that is **routinely missed** because it is *not* an inguinal hernia and the hip joint itself looks normal. The injury is at the **rectus abdominis–adductor longus aponeurosis** at its pubic attachment.\n\n**Where to look (dedicated pubic-symphysis protocol):**\n- Edema/disruption at the **common rectus-adductor aponeurosis** on the symphysis\n- **Secondary cleft sign** — abnormal fluid/contrast extending inferolaterally from the symphysis along the adductor/rectus origin, indicating a microtear of the aponeurosis\n- **Adductor longus** enthesopathy/tendinosis or partial tear at the pubic origin\n- Often coexists with **osteitis pubis** (subchondral symphyseal marrow edema)\n\n**Why it's missed:**\n- A standard hip MRI may **not cover the symphysis** adequately\n- Coexisting **FAI/labral findings** distract from the true pain source\n\n**Management:** Most respond to **rehab/core-and-adductor program**; refractory cases → surgical repair. Reporting the secondary cleft sign directs the surgeon to the aponeurosis.",
        pearl: "Anterior groin pain in an athlete with a normal-looking hip joint — look at the rectus-adductor aponeurosis on the pubic symphysis. The secondary cleft sign localizes the aponeurotic microtear and explains pain that a routine hip MRI would otherwise call normal.",
      },
      {
        content: "### SCFE, Legg-Calvé-Perthes, and Referred Pelvic/Oncologic Pathology\n\nIn the **skeletally immature** hip — and in any patient with vague hip/groin/knee pain — think beyond soft tissue.\n\n**SCFE (slipped capital femoral epiphysis):**\n- Adolescent (often obese), groin/**referred knee** pain, externally rotated limb\n- MRI: **physeal widening and marrow edema**, posteromedial slip of the epiphysis off the metaphysis\n- **Urgent** — **make non-weight-bearing and refer for in-situ pinning**; weight-bearing risks further slip and AVN\n\n**Legg-Calvé-Perthes (idiopathic AVN, ~4–8 yr):**\n- Early MRI: epiphyseal **marrow edema** then **T1-low necrosis**, later fragmentation/flattening\n- Management is staged; refer to pediatric ortho for containment decisions\n\n**Referred / oncologic red flags — do not anchor on a sports diagnosis:**\n- **Lesser-trochanter avulsion in an adult without trauma** = pathologic fracture through a marrow lesion until proven otherwise → metastatic workup\n- **Night pain, systemic symptoms, confluent marrow replacement** → tumor protocol\n- Pelvic pathology and spine disease refer pain to the hip",
        pearl: "A lesser-trochanter avulsion in an adult who didn't sustain real trauma is a pathologic fracture until proven otherwise — work up the marrow, don't call it a strain. And SCFE is urgent: make the adolescent non-weight-bearing and refer for pinning the same day.",
      },
    ],
  },
];
