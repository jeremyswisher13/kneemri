import type { TopicContent } from './index';

export const module10Content: TopicContent[] = [
  {
    content: `### Posterior Medial Meniscal Root Tears

**Posterior medial meniscal root tears with extrusion** are among the most consequential diagnoses to identify on knee MRI because they are **functionally equivalent to total meniscectomy** and lead to rapid, progressive medial compartment arthritis if untreated.

The root tear disrupts the **circumferential hoop stress mechanism**, rendering the meniscus unable to distribute axial load across the tibial plateau.

### MRI Signs by Plane

**Sagittal images:**
- **"Ghost sign"** -- absence of the normal dark posterior horn root attachment adjacent to the **PCL insertion**

**Coronal images:**
- Measure **meniscal extrusion** at the mid-body level
- **> 3 mm** = pathologic/major extrusion (validated threshold) — report the measured value; there is no separately validated "> 5 mm severe" tier

**Axial images:**
- Direct visualization of the root and any **radial cleft** at the attachment

### Downstream Consequences of Missed Root Tears
- **Subchondral insufficiency fractures** of the medial femoral condyle or tibial plateau (often the presenting finding)
- **Accelerated cartilage loss**
- **Progressive varus malalignment**
- Eventual need for **arthroplasty**

### Reporting Checklist
When reporting a root tear, always include:
- **Extrusion measurement**
- **Status of articular cartilage**
- **Subchondral bone changes**

These factors determine whether **root repair is viable**. Early identification and repair can prevent the cascade of joint degeneration.`,
    pearl: `The triad of posterior medial root tear + meniscal extrusion greater than 3 mm + subchondral insufficiency fracture is a pattern you must recognize. The root tear is the cause, and if you only report the fracture without identifying the root tear, the underlying problem will not be addressed.`,
  },
  {
    content: `### Ramp Lesions

**Ramp lesions** (meniscocapsular tears of the posterior medial meniscus) are missed on preoperative MRI in **up to 50% of cases**, making them one of the most underdiagnosed findings in knee imaging. They are present in approximately **16--24% of ACL-injured knees**.

### Where to Look

The key to detection is knowing where to look and **actively searching** in every ACL tear case.

**Sagittal images:**
- Fluid signal or irregularity at the **meniscocapsular junction** of the posterior medial meniscus, posterior to the MCL attachment

**Axial images:**
- Fluid interposed between the **peripheral meniscus** and the **capsule**

**Coronal images:**
- Subtle separation at the **inferior meniscocapsular junction**

**Secondary signs:**
- Focal edema at the **posterior medial capsule**
- Small amount of fluid tracking along the capsular attachment

### Surgical Significance
- Contribute to **anterior tibial translation** and **rotational instability**
- If unrepaired at the time of ACL reconstruction, may **increase the risk of graft failure**

### Reporting Recommendation
- **Specifically state** the presence or absence of a ramp lesion in **every ACL tear case**
- When equivocal, recommend **intraoperative assessment** through a **posteromedial portal** or **trans-notch approach** (standard anterior arthroscopic portals frequently miss these lesions)`,
    pearl: `Make it a habit to include a specific statement about the presence or absence of a ramp lesion in every ACL tear report. The sensitivity of MRI for ramp lesions is modest (around 50-65%), so when findings are equivocal, recommend intraoperative assessment through a posteromedial portal.`,
  },
  {
    content: `### Bucket-Handle Tears

**Bucket-handle tears** represent displaced vertical longitudinal meniscal tears where the central fragment flips into the **intercondylar notch**. They cause **mechanical locking** and require **urgent surgical intervention**. Missing a bucket-handle tear can result in unnecessary delay while the displaced fragment causes **progressive cartilage damage**.

### Three Cardinal Signs

| # | Sign | What to Look For |
|---|------|-----------------|
| 1 | **Absent bow-tie sign** | Fewer than 2 consecutive sagittal images with the bow-tie configuration of the meniscal body |
| 2 | **Double PCL sign** | Displaced fragment in the notch parallel to and anterior to the PCL on sagittal images |
| 3 | **Flipped meniscus sign** | Displaced fragment adjacent to the anterior horn, making it appear disproportionately large |

### Coronal Image Confirmation
- **Truncated donor site** -- shortened, blunted residual meniscal tissue
- **Fragment in the intercondylar notch**

### Key Details
- The **medial meniscus** is most commonly affected
- Always **trace the displaced fragment** to determine its extent and location (guides the surgical approach)

### Reporting Checklist
- **Donor site** location
- **Fragment position**
- **Approximate length** of the tear
- Associated findings: joint effusion (often large), clinical locking, inability to achieve full extension`,
    pearl: `If you see fewer than two sagittal bow-tie images through the meniscal body, immediately suspect a bucket-handle tear and search for the displaced fragment in the intercondylar notch (double PCL sign) or flipped against the anterior horn. Always report the donor site and fragment location.`,
    images: [
      {
        src: '/images/modules/bucket-handle-signs.svg',
        alt: 'Cardinal signs of bucket-handle meniscal tear',
        caption: 'Cardinal signs of a bucket-handle tear: the double PCL sign and absent bow-tie on sagittal images, with the truncated body and displaced fragment in the intercondylar notch and gutter confirmed on coronal images.',
      },
    ],
  },
  {
    content: `### Unstable Osteochondral Defects (OCD)

**Unstable osteochondral defects** are critical to identify because they determine whether surgical intervention is needed. The distinction between **stable** and **unstable** fundamentally changes management:
- **Stable** lesions may be managed **conservatively** (especially in skeletally immature patients)
- **Unstable** lesions typically require **surgical fixation or reconstruction**

### MRI Signs of Instability
- **High-signal-intensity line** (fluid signal on T2) at the interface between the OCD fragment and the parent bone -- indicating fluid undermining the fragment
- **Fluid-filled cyst** beneath the lesion
- **Displaced or partially displaced** fragment
- **Disruption** of the overlying articular cartilage surface
- **Loose bodies** in the joint

The **most reliable sign** of instability is a **high-signal rim surrounding the fragment on T2-weighted sequences**, representing fluid undermining the lesion.

On T1-weighted images, a low-signal rim may represent either **fibrous healing** or a **cleavage plane** -- making **T2 assessment essential**.

### OCD Location

| Location | Frequency |
|----------|-----------|
| **Lateral aspect of medial femoral condyle** | ~70–80% of cases |
| **Lateral femoral condyle** | Less common |
| **Trochlea** | Less common |
| **Patella** | Rare |

### Reporting Checklist
- **Exact location**
- **Dimensions** (length, width, and depth)
- **Status of overlying cartilage**
- Presence of any **instability signs**
- Whether **loose bodies** are present
- For **juvenile OCD** (open physes): prognosis is generally better with conservative management than for adult OCD`,
    pearl: `The most reliable MRI sign of OCD instability is fluid-signal intensity (matching joint fluid on T2) at the interface between the fragment and parent bone, indicating undermining. A low-signal rim on T1 is non-specific and can represent either healing fibrous tissue or an unstable cleavage plane. Always use T2 sequences to assess stability.`,
    images: [
      {
        src: '/images/modules/ocd-stability.svg',
        alt: 'OCD stability assessment — stable vs unstable',
        caption: 'MRI signs of OCD instability: fluid interface, subchondral cysts, cartilage breach, fragment displacement',
      },
    ],
  },
  {
    content: `### Posterolateral Corner (PLC) Injuries

**Posterolateral corner injuries** involving the **LCL** and **popliteus tendon complex** are among the most commonly missed diagnoses on knee MRI, yet their identification is essential for successful ligament reconstruction.

An unrecognized PLC injury is a **major and frequently overlooked cause of ACL and PCL graft failure** because persistent external rotation and varus laxity overload the reconstruction (the most common *technical* cause of ACL graft failure is non-anatomic tunnel placement).

### Three Key Structures to Evaluate

| Structure | Best Imaging Plane | Normal Appearance |
|-----------|-------------------|-------------------|
| **LCL** (fibular collateral ligament) | Coronal | Thin, low-signal cord from lateral femoral epicondyle to fibular head |
| **Popliteus tendon** | Axial + sagittal | Courses through popliteal hiatus, inserts on lateral femoral condyle |
| **Popliteofibular ligament** | Axial | Connects popliteus tendon to fibular styloid |

### Signs of PLC Injury
- **Edema and disruption** of any of the three structures
- **Arcuate fracture** (fibular styloid avulsion) -- a **strong PLC injury marker**
- Bone contusions on the **anteromedial tibia and femoral condyle** (varus mechanism)
- **Peroneal nerve** edema or displacement around the fibular neck

### Associations
- Commonly accompany **PCL tears** (up to **60%** of grade III PCL injuries)
- Also seen with **ACL tears** with varus mechanism
- Always report PLC injuries explicitly with **specification of each involved structure**`,
    pearl: `Failure to diagnose a PLC injury is a major and commonly overlooked cause of cruciate ligament graft failure. In every knee with a cruciate tear, systematically evaluate the LCL, popliteus tendon, and popliteofibular ligament. An arcuate fracture (fibular styloid avulsion) is a strong marker that should prompt direct evaluation of the full PLC.`,
  },
  {
    content: `### MPFL Tear with Osteochondral Injury

**MPFL tear with an associated osteochondral fragment** is the hallmark of **lateral patellar dislocation**, a diagnosis that requires identification of all components to guide management.

### Classic Injury Triad
1. **MPFL tear**
2. **Osteochondral injury** to the medial patellar facet or lateral femoral condyle
3. **Possible loose body** from the osteochondral shear injury

### Diagnostic Bone Bruise Pattern
**Medial patellar facet edema + anterolateral femoral condyle edema** is a **classic, highly suggestive** pattern for transient lateral patellar dislocation, even if the patella has spontaneously reduced at the time of MRI.

### Evaluation Checklist

- **MPFL tear location** (femoral attachment, patellar attachment, or midsubstance) -- influences surgical reconstruction technique
- **Osteochondral injury** -- search for chondral or osteochondral fragments in:
  - Suprapatellar pouch
  - Lateral gutter
  - Posterior recesses
- **Size and location** of any defect on the medial patella or lateral trochlea (large defects may require osteochondral repair)

### Predisposing Anatomy Assessment
- **Trochlear dysplasia** (Dejour classification)
- **Patella alta** (Insall-Salvati ratio **> 1.2**)
- **Lateralized tibial tubercle** (TT-TG distance **> 20 mm on CT** is abnormal, 15–20 mm borderline; MRI measures ~3–4 mm lower, so the corresponding **MRI abnormal threshold is ~15 mm** — always state the modality)

Recurrent dislocation risk is **high** when multiple anatomic risk factors are present.`,
    pearl: `When you see medial patellar facet + anterolateral femoral condyle bone bruises, the diagnosis is lateral patellar dislocation. Your checklist: (1) MPFL tear location, (2) osteochondral injury and loose bodies, (3) trochlear dysplasia, (4) patella alta, (5) TT-TG distance. Missing the loose body can result in ongoing mechanical symptoms.`,
  },
  {
    content: `### Lipohemarthrosis

**Lipohemarthrosis** (a fat–fluid level) on knee MRI indicates an **intra-articular fracture until proven otherwise** and requires an immediate systematic search for the fracture source. It is best seen on a **non–fat-suppressed** sequence — fat saturation nulls the fatty layer and the level can disappear.

The **fat-fluid level** is caused by marrow fat released from a fracture line communicating with the joint space, mixing with hemorrhagic joint fluid. Best visualized on **sagittal or axial T2-weighted or STIR images** through the suprapatellar bursa.

### Most Common Associated Fractures
- **Tibial plateau fractures** (particularly the lateral plateau in ACL tear mechanisms)
- **Distal femoral fractures**
- **Patellar fractures**

### Subtle Tibial Plateau Fractures
**Tibial plateau fractures** may be subtle on MRI:
- Look for **cortical step-off**
- **Impaction of subchondral bone**
- **Linear low-signal fracture lines** on T1-weighted images surrounded by bone marrow edema
- **Depression fractures** of the lateral tibial plateau are particularly easy to miss (subtle depression, edema pattern mimics a bone contusion)

### Second-Look Search Protocol

When a lipohemarthrosis is identified but no obvious fracture is seen, perform a **dedicated second-look search**:
- **Tibial plateaus** -- sagittal and coronal images for cortical irregularity and subchondral impaction
- **Patella** -- transverse or vertical fracture lines
- **Femoral condyles** -- osteochondral fractures
- **Fibular head** -- avulsion fractures

**CT** may be recommended for surgical planning if a tibial plateau fracture is identified, as MRI can underestimate the degree of articular depression and comminution.`,
    pearl: `A lipohemarthrosis without an identified fracture should prompt a second dedicated search. The most commonly missed fractures are subtle lateral tibial plateau depression fractures -- look for cortical irregularity and subchondral impaction on coronal images. If a plateau fracture is found, recommend CT for surgical planning.`,
  },
  {
    content: `### Segond Fracture

The **Segond fracture** is a small avulsion fracture of the **lateral tibial rim**, representing avulsion of the **anterolateral ligament (ALL)** or lateral capsular structures. It is a **highly specific marker of associated ACL injury**, reported with an ACL injury in approximately **75--100%** of cases; still assess the ACL directly.

Despite its small size, this fracture has **enormous diagnostic significance** and should never be overlooked or dismissed as clinically insignificant.

### MRI Appearance
- **Thin sliver of bone** avulsed from the lateral tibial plateau, just distal to the joint line, with surrounding soft tissue edema
- **Coronal images:** Small, vertically oriented bone fragment lateral to the tibial plateau with **marrow edema at the donor site**
- **Axial images:** Avulsed fragment located anterolateral to the tibial plateau
- The fragment may be **very small and easily missed** -- always scrutinize the anterolateral tibial rim when an ACL tear is identified or suspected

### Reverse Segond Fracture
- Avulsion of the **medial tibial rim**
- Associated with **PCL tears** rather than ACL tears
- Less common but equally important as an indicator of cruciate injury

### Associated Findings to Evaluate
- **ACL status** (should be torn)
- **Meniscal tears** (particularly the lateral meniscus)
- **Posterolateral corner injury**

The Segond fracture is often **more conspicuous on radiographs** than on MRI, so do not assume prior imaging has identified it.`,
    pearl: `A Segond fracture (lateral tibial rim avulsion) is highly specific for associated ACL injury. Even a tiny bone fragment at the anterolateral tibial plateau should prompt direct ACL evaluation. The reverse Segond fracture (medial tibial rim avulsion) is associated with PCL tears. These fractures are small but carry enormous diagnostic weight.`,
    images: [
      {
        src: '/images/modules/segond-fracture.svg',
        alt: 'Segond fracture diagram — lateral tibial avulsion strongly associated with ACL tear',
        caption: 'Segond fracture: lateral capsular avulsion strongly associated with ACL tear',
      },
      {
        src: '/images/teaching/modules/module7-ligaments/06_ACL_Segond_Fracture.jpg',
        alt: 'Segond fracture — anterolateral ligament avulsion',
        caption: 'Segond fracture — anterolateral ligament avulsion',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
      },
    ],
  },
  {
    content: `### Multiligament Injury Patterns

**Multiligament injury patterns** indicate severe knee trauma and potential knee dislocation, carrying significant risk of **vascular and neurological injury**. Any combination of **two or more major ligament tears** (ACL, PCL, MCL, LCL/PLC) constitutes a multiligament knee injury.

**ACL + PCL disruption = knee dislocation until proven otherwise**, even if the knee has spontaneously reduced.

### Vascular and Nerve Assessment

- **Popliteal artery injury** occurs in a clinically important minority of knee dislocations -- can lead to **limb loss** if not identified promptly
- MRI signs: **perivascular hematoma**, loss of the normal **popliteal artery flow void**, or intimal irregularity
- **Common peroneal nerve injury** accompanies PLC injuries in **25--40%** of cases; trace the nerve on **axial images** around the fibular neck

### Systematic Reporting Checklist

Address **every stabilizing structure individually**:
- **ACL** -- complete vs. partial
- **PCL** -- complete vs. partial, location
- **MCL** -- superficial and deep layers, grade
- **LCL** -- grade and location
- **Popliteus tendon**
- **Popliteofibular ligament**
- **POL**
- **Extensor mechanism**
- **Both menisci**
- **Cartilage** in all compartments
- **Bone injuries**

This comprehensive assessment is essential for **surgical planning**, as multiligament reconstruction is staged in many centers and the surgeon needs to **prioritize structures** based on your report.`,
    pearl: `ACL + PCL disruption = knee dislocation pattern until proven otherwise. Recommend urgent vascular assessment if not already documented; vascular exam/ABI plus CTA/MRA when abnormal or equivocal, or per trauma protocol. Always include a recommendation for vascular evaluation in your report when you identify combined cruciate tears. Document every injured structure individually for surgical planning.`,
  },
  {
    content: `### Post-Surgical Re-Tear vs. Expected Appearance

Distinguishing **post-surgical re-tear from expected postoperative appearance** is a common and high-stakes diagnostic challenge. The key principles vary by structure and timing.

### Meniscal Repair

| Signal | Interpretation |
|--------|---------------|
| **Intermediate signal** at repair site | **Expected healing** -- granulation tissue (do not overcall) |
| **Fluid-bright signal** (matching joint fluid on T2) reaching articular surface | **Re-tear** |

- Increased intrameniscal signal is expected for at least **12 months** after surgery

### ACL Graft

| Timeframe | Expected Appearance | Signs of Failure |
|-----------|-------------------|-----------------|
| **0--12 months** | Increased signal (ligamentization phase) | N/A -- expected |
| **> 12--18 months** | **Uniformly low signal** | **Fluid-signal** within graft, discontinuity, lax/horizontal graft, recurrent secondary signs |

**Partial graft tear:** Focal thinning or signal change with some intact fibers
**Complete graft failure:** Discontinuity + recurrence of secondary signs (anterior tibial translation, new pivot-shift bone contusions) + tunnel widening

### Meniscectomy Sites
- Residual rim should have a **smooth, well-corticated free edge** with **uniformly low signal**
- New **grade 3 signal** extending to the articular surface of the residual rim = **re-tear**

### Cartilage Repair Sites (Microfracture, OATS, ACI)
- Repair tissue signal **evolves over time** and should progressively mature to approximate normal hyaline cartilage signal
- Report: **fill percentage**, **surface congruity**, **integration** with adjacent cartilage, and **subchondral bone status**

When findings are equivocal, **MR arthrography** can significantly improve diagnostic accuracy.`,
    pearl: `The critical distinction for post-surgical meniscus: fluid-bright signal (matching joint fluid on T2) at the surface = re-tear; intermediate signal at the repair site = expected healing. For ACL grafts: uniform low signal by 12-18 months is normal; fluid-signal within the graft or recurrence of secondary signs indicates failure. When in doubt, recommend MR arthrography.`,
  },
  {
    content: `### What Surgeons Need from Your MRI Read

Understanding what findings **change surgical management** transforms a descriptive report into a clinically actionable document. Surgeons rely on your report to plan their approach, counsel patients, and determine surgical timing.

### Findings That Change the Surgical Plan

**Meniscal tear characteristics that determine repair vs. resection:**
- **Location** (peripheral red-red zone = repairable; central white-white zone = resection)
- **Morphology** (vertical longitudinal = repairable; complex degenerative = usually resection)
- **Displacement** (bucket-handle with locked knee = urgent)

**ACL tear nuances:**
- **Complete vs. partial** -- partial tears may be managed non-operatively
- **Associated injuries** that expand the surgical plan (ramp lesion, PLC injury, root tear)

**Cartilage lesion details that guide treatment:**
- **Size of the defect** (in centimeters) -- determines microfracture vs. OATS vs. ACI
- **Location** (weight-bearing vs. non-weight-bearing surface)
- **Subchondral bone status** -- cysts or edema affect reconstruction options

**Post-surgical assessment:**
- **Graft integrity** (intact fibers vs. partial vs. complete failure)
- **Re-tear vs. expected healing** in repaired menisci
- **Tunnel position** in revision ACL planning

### The Bottom Line

Your report should answer the surgeon's three key questions: (1) **What is the diagnosis?** (2) **What associated injuries are present?** (3) **Does anything change my planned approach?** Anticipating these questions and addressing them proactively makes your report significantly more valuable.`,
    pearl: `Think like the surgeon reading your report. For meniscal tears, address repairability (location, morphology, acuity). For cartilage lesions, specify size, location, and subchondral bone status. For ACL tears, highlight associated injuries that expand the surgery. Answer the clinical question, not just describe the anatomy.`,
  },
  {
    content: `### Critical Findings Requiring Direct Communication

Certain MRI findings require **direct communication** with the referring clinician -- picking up the phone or sending a direct message -- because they change immediate management and delayed recognition can lead to serious patient harm.

### Emergent Findings (Communicate Immediately)

- **Knee dislocation or multiligament injury** (ACL + PCL = dislocation until proven otherwise) -- requires urgent **vascular assessment** because popliteal artery injury can be occult
- **Locked knee from displaced bucket-handle tear** -- may require **urgent surgery** to prevent progressive cartilage damage
- **Suspected septic arthritis** -- complex effusion with synovial enhancement and periarticular changes

### Urgent Findings (Communicate Same Day)

- **Aggressive bone lesion or suspected tumor** identified incidentally -- delays in oncologic workup can be consequential
- **Displaced osteochondral fragments** in a weight-bearing compartment -- loose bodies cause ongoing cartilage damage
- **Unexpected findings that change the planned surgery** -- e.g., a patient scheduled for isolated ACL reconstruction who has a concurrent PLC injury requiring repair, or a meniscal root tear requiring a different approach

### Documentation

Per **ACR practice parameters**, when you directly communicate a significant finding:
- Document **who** was contacted
- Document the **method** of communication
- Document the **time**

Even for non-emergent findings, a brief call to highlight an unexpected result that could change management demonstrates excellent clinical partnership and ensures nothing falls through the cracks.`,
    pearl: `Always pick up the phone for these findings: multiligament knee injury (dislocation risk requiring vascular assessment), locked bucket-handle tear, suspected septic arthritis, incidental aggressive bone lesion, and any unexpected finding that would change the planned surgery. Document every direct communication in your report.`,
    images: [
      {
        src: '/images/modules/critical-findings-checklist.svg',
        alt: 'Critical findings requiring direct communication checklist',
        caption: 'Findings that require picking up the phone — communicate directly with the referring clinician',
      },
    ],
  },
];
