import type { TopicContent } from './index';

export const module6Content: TopicContent[] = [
  {
    content: `### Meniscal Signal Grading

Meniscal signal can be described with a **three-tier system**. It supports diagnosis, but morphology, symptoms, examination, age, tear pattern, tissue quality, and patient goals determine treatment.

| Grade | Signal Pattern | Clinical Significance |
|-------|---------------|----------------------|
| **Grade 1** | Small focus of intrameniscal signal, does not extend to articular surface | Intrasubstance degeneration, not a tear by signal criteria |
| **Grade 2** | More extensive linear intrameniscal signal (often horizontal), does not reach articular surface | Intrasubstance degeneration, not a tear by signal criteria |
| **Grade 3** | Increased signal unequivocally extending to at least one articular surface (assessed on PD / short-TE images) | MRI criterion for a tear; not an automatic indication for surgery |

### Diagnosing Grade 3 Signal

- **Grade 3 signal** is defined as increased signal intensity that **unequivocally extends to at least one articular surface**, best assessed on **proton density / intermediate-weighted (short-TE) sequences** -- the most sensitive sequences for meniscal signal
- Surface extension on **at least two matching images** (the **two-slice-touch rule**) greatly increases positive predictive value. The images need not be consecutive and may be one sagittal plus one coronal image through the same site; a one-image finding is lower confidence, not automatically degeneration
- On **PD / short-TE** images, surface-reaching **intermediate-to-high** signal is enough — it need **not** approach fluid intensity. (Requiring fluid-bright signal is the **T2 / long-TE** criterion, which is exactly why T2 is *less* sensitive for tears and degeneration.)
- Low-grade signal that barely touches a surface on a single image should be correlated with morphology, adjacent slices, and orthogonal planes before it is called a tear`,
    pearl: `Grade 2 signal in the posterior horn of the medial meniscus is common with aging and should not be overcalled as a tear. Surface contact on two or more matching images markedly increases confidence; those images need not be contiguous. Treat a one-image finding cautiously and look for orthogonal or morphologic corroboration.`,
    images: [
      {
        src: '/images/modules/meniscal-anatomy.svg',
        alt: 'Meniscal anatomy diagram',
        caption: 'Normal meniscal anatomy and zones',
      },
      {
        src: '/images/modules/meniscal-signal-grading.svg',
        alt: 'Meniscal signal grading diagram',
        caption: 'Grade 1, 2, and 3 meniscal signal patterns',
      },
      {
        src: '/images/modules/meniscal-tear-mri-appearance.svg',
        alt: 'Meniscal tear MRI appearance showing normal, grade 2 signal, and grade 3 tear',
        caption: 'MRI appearance: normal meniscus vs intrameniscal signal (not a tear) vs grade 3 tear reaching articular surface',
      },
      {
        src: '/images/teaching/modules/module6-menisci/10_Meniscus_Signal_Grade.jpg',
        alt: 'Meniscal signal grading — surface-reaching signal (grade 3 tear)',
        caption: 'Meniscal signal grading — intrasubstance signal that reaches the articular surface (arrows) is grade 3 (a tear); grade 1–2 signal does not reach a surface.',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### The Two-Slice-Touch Confidence Rule

The **two-slice-touch rule** is a high-confidence rule for meniscal tears: surface-reaching signal on **at least two matching images** has a much higher positive predictive value than contact on one image. The images do not have to be consecutive; matching sagittal and coronal images can satisfy the rule. It is not an absolute gate, because a small or radial tear may be conspicuous on only one image.

This criterion was developed to reduce false-positive diagnoses caused by:
- **Partial volume averaging**
- **Truncation artifacts**
- Normal **vascular signal** near the meniscal periphery

### Applying the Rule

- Requires **systematic scrolling** through sagittal images and **correlating findings on coronal and axial planes**
- If increased signal touches the surface on **only one image**, scrutinize morphology, adjacent slices, and orthogonal planes. Without corroboration, describe it cautiously or as equivocal rather than automatically labeling it degeneration or a definite tear
- Apply the rule primarily to standard **proton-density / intermediate-weighted short-TE sequences** at **1.5T and 3T**

### Pitfalls at 3T

At **3T**, be cautious of **artifactually increased intrameniscal signal** due to:
- **Magic angle effect**
- **Magnetization transfer**

These can mimic tears, particularly in the **posterior horn of the lateral meniscus** near the **popliteal hiatus**.`,
    pearl: `The two-slice-touch rule was developed for standard 3-4 mm slices. On thin-slice or 3D isotropic acquisitions, judge spatial continuity and multiplanar reformats rather than applying a fixed image count mechanically.`,
    images: [
      {
        src: '/images/teaching/modules/module6-menisci/14_Meniscus_Transverse_Ligament_Normal.jpg',
        alt: 'Normal anterior transverse ligament — mimics tear',
        caption: 'Normal anterior transverse ligament — mimics tear',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
      {
        src: '/images/teaching/modules/module6-menisci/17_Meniscus_Humphrey_Ligament.jpg',
        alt: 'Humphrey ligament — mimics posterior horn tear',
        caption: 'Humphrey ligament — mimics posterior horn tear',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
      {
        src: '/images/teaching/modules/module6-menisci/18_Meniscus_Wrisberg_Pseudotear.jpg',
        alt: 'Wrisberg ligament — pseudotear appearance',
        caption: 'Wrisberg ligament — a pseudotear that resolves on adjacent slices (the two-slice-touch rule in action).',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Meniscal Tear Morphology

Meniscal tear morphology is classified into several distinct patterns, each with different biomechanical consequences and treatment implications.

| Tear Type | Orientation | Key Features |
|-----------|-------------|-------------|
| **Horizontal (cleavage)** | Parallel to tibial plateau | Splits meniscus into upper/lower leaves; most common degenerative pattern |
| **Vertical longitudinal** | Perpendicular to tibial plateau, parallel to circumferential fibers | Peripheral tears may be repairable (red zone) |
| **Radial** | Perpendicular to tibial plateau and free edge | Disrupts **circumferential hoop fibers**; biomechanically significant even when small |
| **Complex** | Combines two or more patterns | Most often degenerative; common in older patients |

### Horizontal (Cleavage) Tears
- Run **parallel to the tibial plateau**, splitting the meniscus into upper and lower leaves
- Most common **degenerative tear pattern**, typically originating in the **posterior horn of the medial meniscus**
- On coronal images: horizontal line of fluid signal dividing the meniscus

### Vertical Longitudinal Tears
- Run **perpendicular to the tibial plateau** and parallel to the circumferential collagen fibers
- When small and **peripheral**, may be amenable to **repair** given the vascular supply in the **red zone**

### Radial Tears
- **Perpendicular** to both the tibial plateau and the free edge
- Disrupt the **circumferential hoop fibers** -- even small radial tears can be **biomechanically significant**
- MRI findings:
  - **Truncated, blunted, or absent ("ghost meniscus")** appearance on the slice that cuts ACROSS the tear (tear perpendicular to the imaging plane)
  - **"Cleft sign"** — a vertical linear gap extending in from the free edge — on the slice where the tear lies IN-PLANE (parallel to the imaging plane)

### Complex Tears
- Combine two or more morphologic patterns
- Most often **degenerative** in nature, frequently seen in older patients`,
    pearl: `Radial tears are easily missed because they may only be apparent on one or two images as a blunted or absent meniscal segment. Always look for the "ghost meniscus" sign on sagittal images through the meniscal body when a radial tear is suspected.`,
    images: [
      {
        src: '/images/modules/meniscal-tear-types.svg',
        alt: 'Meniscal tear morphology types',
        caption: 'Horizontal, vertical longitudinal, radial, and complex tear patterns',
      },
      {
        src: '/images/teaching/cases/bucket-handle/08_Meniscus_Complex_Tear_Sagittal.jpg',
        alt: 'Complex meniscal tear with fragment displacement — sagittal',
        caption: 'Complex meniscal tear with intra-articular fragment displacement — sagittal PD.',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
      {
        src: '/images/teaching/modules/module6-menisci/19_Meniscus_Horizontal_Tear_Chronic.jpg',
        alt: 'Chronic horizontal tear lateral meniscus',
        caption: 'Chronic horizontal tear lateral meniscus',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
      {
        src: '/images/teaching/modules/module6-menisci/22_ESSR_Meniscal_Tear_Types_Overview.jpg',
        alt: 'Meniscal tear types overview with schematics',
        caption: 'Meniscal tear types overview with schematics',
        attribution: 'ESSR Practice Recommendations, Eur Radiol, 2024. PMC11399221. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Meniscal Root Tears

**Meniscal root tears** are avulsions or radial tears occurring **within 1 cm of the meniscal root attachment**. A complete root-disrupting tear can abolish hoop-stress function. In a cadaveric medial posterior-root model, contact mechanics approached those after total medial meniscectomy; this biomechanical comparison should not be generalized to every partial, lateral, or degenerative root abnormality.

- The **posterior root of the medial meniscus** is the most commonly affected
- Often seen in **middle-aged women** with an acute-on-chronic mechanism
- Complete function-disrupting root tears are associated with accelerated compartment overload and osteoarthritis progression; rate and treatment response vary with cartilage, alignment/loading, chronicity, and patient factors

### MRI Signs by Plane

**Sagittal images:**
- **"Ghost sign"** or **"truncation sign"** -- posterior horn appears absent or blunted at its expected root attachment adjacent to the **PCL**

**Coronal images:**
- Vertical linear cleft at the tibial attachment or radial disruption near the root
- **Medial meniscal extrusion ≥3 mm** is a common major-extrusion threshold and a useful secondary clue, but it is neither specific for nor required by a root tear

**Axial images:**
- Direct visualization of the root
- Direct disruption of the normal **low-signal root attachment** is a primary tear sign; confirm the exact root and morphology across planes

### The Root Tear Triad

**Posterior medial root tears** are frequently associated with **subchondral insufficiency fractures** of the medial tibial plateau or medial femoral condyle, creating a triad of:
- **Root tear**
- **Extrusion**
- **Subchondral fracture**`,
    pearl: `When you see a subchondral insufficiency fracture of the medial femoral condyle or medial tibial plateau, scrutinize the posterior medial meniscal root and measure extrusion. A complete root tear can be an important contributor to compartment overload, but cartilage, alignment/loading, bone quality, and other whole-joint factors also matter.`,
    images: [
      {
        src: '/images/modules/meniscal-extrusion.svg',
        alt: 'Meniscal extrusion measurement diagram',
        caption: 'Measuring meniscal extrusion on coronal images',
      },
      {
        src: '/images/teaching/cases/meniscal-root-tear/33_KneeMRI_Lateral_Root_Tear_GhostMeniscus.jpg',
        alt: 'Lateral meniscal root tear — ghost meniscus sign',
        caption: 'Lateral meniscal root tear — the ghost meniscus sign (faint/absent posterior horn at its root on sagittal), with posterior-horn extrusion on the coronal.',
        attribution: 'Sports Health, 2013. PMC3548666. CC-BY-NC 3.0.',
      },
    ],
  },
  {
    content: `### Ramp Lesions

**Ramp lesions** are peripheral longitudinal tears of the **posterior horn of the medial meniscus** at the **meniscocapsular junction** (the "ramp" zone). They occur at the attachment of the meniscus to the posterior capsule.

### Association with ACL Injuries
- Strongly associated with **ACL injuries**, found in approximately **16--24% of ACL-deficient knees**
- Mechanism: **anterior tibial translation** and **rotational forces** stress the meniscocapsular junction posteriorly

### MRI Detection

Ramp lesions can be subtle and are best identified on **sagittal and axial images** through the posterior horn of the medial meniscus. Key findings:
- **Fluid signal or irregularity** at the meniscocapsular junction
- **Separation** of the meniscus from the capsule
- **Focal edema** at the posterior medial capsule
- Coronal images may show **fluid interposed** between the peripheral meniscus and capsule

### Diagnostic Challenges
- **Notoriously underdiagnosed** on preoperative MRI — pooled sensitivity only **~65--71%** (specificity ~88--94%), and missed in **up to half** of cases in some series
- In the setting of an ACL tear, **carefully evaluate the posterior meniscocapsular junction on every sequence**
- Arthroscopic examination through a standard anterior portal may also miss these lesions, requiring a **posteromedial portal** or **trans-notch view** for diagnosis`,
    pearl: `In every ACL tear case, actively search for a ramp lesion by scrutinizing the posterior meniscocapsular junction of the medial meniscus in multiple planes. MRI sensitivity is limited; a seen or suspected lesion should be reported clearly, and repairability is determined at targeted arthroscopic assessment in the full clinical context.`,
    images: [
      {
        src: '/images/teaching/modules/module6-menisci/15_Meniscus_Meniscotibial_MCL_Normal.jpg',
        alt: 'Normal medial meniscocapsular junction — coronal PD',
        caption: 'Normal medial meniscal peripheral attachment on coronal PD — deep MCL (arrowhead), meniscocapsular junction (thick arrow), and meniscotibial (coronary) ligament (thin arrow). A ramp lesion is a tear of this meniscocapsular junction at the posterior horn.',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Bucket-Handle Tears

**Bucket-handle tears** are displaced vertical longitudinal tears where the central (inner) fragment flips into the **intercondylar notch**. They are the most common type of displaced meniscal tear and most frequently involve the **medial meniscus**. Clinically, they present with **acute locking** or **loss of full extension**.

### Cardinal MRI Signs

| Sign | Description |
|------|-------------|
| **Double PCL sign** | Displaced fragment lies parallel and anterior to the PCL on sagittal images, mimicking a second PCL |
| **Absent bow-tie sign** | Fewer than two consecutive sagittal images showing the normal bow-tie configuration of the meniscal body |
| **Flipped meniscus sign** | Displaced fragment lies adjacent to the anterior horn, making it appear disproportionately large |

### Coronal Image Findings
- **Fragment in the intercondylar notch**
- **Truncated or diminished donor site** -- shortened, blunted residual meniscus

### Reporting Checklist
- Always evaluate **both compartments** systematically (bilateral bucket-handle tears can occur, though rare)
- Report the **donor site location**
- Report the **fragment position**
- Report the **approximate length** of the tear`,
    pearl: `The absent-bow-tie sign suggests a displaced meniscal tear. Normally, standard sagittal images show at least two consecutive body segments. Fewer than two should trigger a fragment search, while prior meniscectomy, a very small meniscus, and slice thickness must be considered before calling a bucket-handle tear.`,
    images: [
      {
        src: '/images/teaching/cases/bucket-handle/bh_double_pcl_sign.jpg',
        alt: 'Double PCL sign of a bucket-handle tear',
        caption: 'Double PCL sign — the displaced meniscal fragment sits anteroinferior to and parallel with the native PCL, mimicking a second PCL (arrow). The hallmark of a displaced bucket-handle tear on the sagittal notch image.',
        attribution: 'Nacey NC et al., Cureus, 2023. PMC10493472. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Meniscal Extrusion

**Meniscal extrusion** is measured on **coronal images** at the level of the mid-body. The conventional 3 mm threshold is best established for the medial meniscus and should not be transferred mechanically to the lateral meniscus.

### How to Measure
- Draw a vertical line along the **outer margin of the tibial plateau**, excluding osteophytes from the reference margin
- Measure the distance from this line to the **outermost edge of the meniscal body**
- **≥3 mm** is commonly termed major medial extrusion; report the continuous measurement and clinical context
- There is no separately validated universal ">5 mm severe" tier

### Clinical Significance

| Extrusion | Significance |
|-----------|-------------|
| **< 3 mm** | Below the conventional major medial-extrusion threshold; does not exclude a root tear or dysfunction |
| **≥ 3 mm** | Major medial extrusion: search for a root/radial tear and cartilage loss, while recognizing extrusion is not diagnostic by itself |

Medial and lateral extrusion have different normal ranges, mechanisms, and evidence bases. Major medial extrusion is associated with loss of coverage and osteoarthritis progression, but the meniscus is not necessarily completely nonfunctional and the measurement alone does not establish a root tear.

### Reporting Extrusion
- Specify the measurement in **millimeters**
- Search for and report any associated **root tear** (this combination has important prognostic implications and may alter surgical management)
- Measure with the knee in **non-weight-bearing position** as obtained during standard MRI
- On weight-bearing or semi-flexed MRI, extrusion values may be greater`,
    pearl: `Measure medial extrusion on the coronal mid-body image from the tibial margin, excluding osteophytes. At least 3 mm is a useful major-extrusion threshold and should trigger a root, radial-tear, and cartilage search, but it is not synonymous with a root tear and a smaller value does not exclude one.`,
    images: [
      {
        src: '/images/teaching/modules/module6-menisci/09_Meniscus_Displacement_Coronal.jpg',
        alt: 'Medial meniscal extrusion — coronal',
        caption: 'Medial meniscal body extruded beyond the medial tibial plateau margin on a coronal image (arrows). Measure perpendicular to the tibial margin while excluding osteophytes; at least 3 mm is a conventional major medial-extrusion threshold, not a standalone root-tear diagnosis.',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Parameniscal Cysts

**Parameniscal cysts** are fluid collections that form adjacent to the meniscus, most commonly in association with an **underlying meniscal tear** that serves as a **one-way valve** allowing joint fluid to decompress through the tear into the parameniscal soft tissues.

- Reported **medial-vs-lateral predominance varies** in the literature. Most parameniscal cysts communicate with an underlying meniscal tear, but a communication may be subtle or occult on routine MRI
- Lateral parameniscal cysts are classically associated with **horizontal cleavage tears** of the lateral meniscus

### MRI Appearance
- Well-defined **lobulated fluid-signal collections** (high T2, low T1) at the periphery of the meniscus, often at the joint line
- May extend into adjacent soft tissues and can become quite large
- **Key diagnostic step:** identify an underlying meniscal tear; recurrence risk is higher when the tear communication is not addressed

### Important Distinctions
- **Lateral parameniscal cysts** vs. **popliteal (Baker's) cysts** -- Baker's cysts arise from the posteromedial joint
- Large lateral cysts near the **fibular head** can compress the **common peroneal nerve**, presenting with **foot drop**
- **Intrameniscal cysts** remain within the substance of the meniscus and appear as well-defined round or oval fluid-signal foci within the meniscal body`,
    pearl: `Most parameniscal cysts have an underlying meniscal tear acting as a one-way valve. If you see a parameniscal cyst, trace it back to the meniscus to identify the causative tear. The tear usually dictates management more than the cyst alone.`,
    images: [],
  },
  {
    content: `### Post-Surgical Meniscus Evaluation

Evaluating the **post-surgical meniscus** requires understanding the expected appearances after different procedures.

### After Partial Meniscectomy
- The remnant is expected to be **truncated or reduced in size**, ideally with a smooth contour
- Conventional surface-signal criteria lose specificity after surgery. Favor re-tear when there is a displaced fragment, a new or changed surface-reaching fluid-signal line compared with prior imaging, or morphology not explained by the operation

### After Meniscal Repair
- Increased intrameniscal signal can persist for years after repair and is not diagnostic of failure by itself
- Criteria for **re-tear** are more stringent:
  - **Fluid-signal intensity** extending into the repair/tear site, especially when new or accompanied by changed morphology or a displaced fragment
  - Grade 2-type signal at the repair site may represent **healing granulation tissue** -- do not call this a re-tear
- **Direct MR arthrography** can improve accuracy in selected equivocal postoperative cases, particularly after resection of more than 25% of the meniscus or when conventional MRI lacks a helpful joint effusion; it is not required for every postoperative meniscus

### After Meniscal Transplant
- Evaluate for:
  - **Signal characteristics**
  - **Sizing** (extrusion)
  - **Horn attachment integrity**
- The transplant will demonstrate some increased signal as it incorporates but should **not show fluid-signal clefts** reaching the surface`,
    pearl: `After meniscal surgery, compare with the operative report and prior MRI. Persistent signal alone is not a re-tear; prioritize new fluid-signal extension, changed morphology, or a displaced fragment. Consider MR arthrography selectively when conventional MRI remains equivocal and the answer will change management.`,
  },
];
