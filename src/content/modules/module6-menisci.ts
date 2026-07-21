import type { TopicContent } from './index';

export const module6Content: TopicContent[] = [
  {
    content: `### Meniscal Signal Grading

Meniscal signal on MRI is graded using a **three-tier system** that directly guides clinical decision-making.

| Grade | Signal Pattern | Clinical Significance |
|-------|---------------|----------------------|
| **Grade 1** | Small focus of intrameniscal signal, does not extend to articular surface | Early **mucinous degeneration** -- not surgical |
| **Grade 2** | More extensive linear intrameniscal signal (often horizontal), does not reach articular surface | **Degenerative** change -- not surgical |
| **Grade 3** | Increased signal unequivocally extending to at least one articular surface (assessed on PD / short-TE images) | **True meniscal tear** -- surgical consideration |

### Diagnosing Grade 3 Signal

- **Grade 3 signal** is defined as increased signal intensity that **unequivocally extends to at least one articular surface**, best assessed on **proton density / intermediate-weighted (short-TE) sequences** -- the most sensitive sequences for meniscal signal
- Surface extension on **at least two consecutive standard slices** (the **two-slice-touch rule**) greatly increases specificity and helps avoid false positives from volume averaging; a one-slice finding is lower confidence, not automatically degeneration
- On **PD / short-TE** images, surface-reaching **intermediate-to-high** signal is enough — it need **not** approach fluid intensity. (Requiring fluid-bright signal is the **T2 / long-TE** criterion, which is exactly why T2 is *less* sensitive for tears and degeneration.)
- Low-grade signal that barely touches a surface on a single image should be correlated with morphology, adjacent slices, and orthogonal planes before it is called a tear`,
    pearl: `Grade 2 signal in the posterior horn of the medial meniscus is extremely common in patients over 40 and should not be overcalled as a tear. Surface contact on two consecutive standard slices markedly increases confidence; treat a one-slice finding cautiously and look for orthogonal or morphologic corroboration.`,
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

The **two-slice-touch rule** is a high-specificity confidence rule for meniscal tears: surface-reaching signal on **at least two consecutive images** (using standard 3--4 mm slice thickness) has a much higher positive predictive value than contact on one image. It is not an absolute gate; a small or radial tear may be conspicuous on only one slice or primarily in an orthogonal plane.

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

**Meniscal root tears** are avulsions or radial tears occurring **within 1 cm of the meniscal root attachment**. They are **functionally equivalent to a total meniscectomy** because they completely disrupt the circumferential hoop stresses that allow the meniscus to distribute axial load.

- The **posterior root of the medial meniscus** is the most commonly affected
- Often seen in **middle-aged women** with an acute-on-chronic mechanism
- Associated with **rapid progression of osteoarthritis** if untreated

### MRI Signs by Plane

**Sagittal images:**
- **"Ghost sign"** or **"truncation sign"** -- posterior horn appears absent or blunted at its expected root attachment adjacent to the **PCL**

**Coronal images:**
- Vertical linear cleft at the tibial attachment or radial disruption near the root
- **Meniscal extrusion > 3 mm** is a strong secondary sign of root tear

**Axial images:**
- Direct visualization of the root
- Disruption of the normal **low-signal root attachment** is diagnostic

### The Root Tear Triad

**Posterior medial root tears** are frequently associated with **subchondral insufficiency fractures** of the medial tibial plateau or medial femoral condyle, creating a triad of:
- **Root tear**
- **Extrusion**
- **Subchondral fracture**`,
    pearl: `When you see a subchondral insufficiency fracture of the medial femoral condyle or medial tibial plateau, scrutinize the posterior medial meniscal root. A root tear is often a key biomechanical driver; if missed, ongoing compartment overload may persist or progress.`,
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
- **Notoriously underdiagnosed** on preoperative MRI, with sensitivity reported as low as **48--65%**
- In the setting of an ACL tear, **carefully evaluate the posterior meniscocapsular junction on every sequence**
- Arthroscopic examination through a standard anterior portal may also miss these lesions, requiring a **posteromedial portal** or **trans-notch view** for diagnosis`,
    pearl: `In every ACL tear case, actively search for a ramp lesion by scrutinizing the posterior meniscocapsular junction of the medial meniscus on sagittal and axial sequences. These lesions are missed on up to half of preoperative MRIs and can be repaired at the time of ACL reconstruction.`,
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
    pearl: `The "absent bow-tie sign" is a reliable indicator of a displaced meniscal tear. Normally, on sagittal images through the meniscal body, you should see at least two consecutive images with a bow-tie configuration. Fewer than two body segments suggests a bucket-handle tear with displacement of the central fragment.`,
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

**Meniscal extrusion** is measured on **coronal images** at the level of the mid-body of the meniscus.

### How to Measure
- Draw a vertical line along the **outer margin of the tibial plateau**
- Measure the distance from this line to the **outermost edge of the meniscal body**
- **> 3 mm** = pathologic
- **> 3 mm** is the validated pathologic (major) threshold — report the measured value; there is no separately validated "> 5 mm severe" cut-off

### Clinical Significance

| Extrusion | Significance |
|-----------|-------------|
| **< 3 mm** | Normal |
| **> 3 mm** | Pathologic (validated threshold): search for a root/radial tear and cartilage loss. Larger values indicate greater dysfunction — report the measured number; no separate validated ">5 mm severe" tier exists |

**Medial meniscal extrusion** is more clinically significant than lateral extrusion because the medial meniscus bears a greater role in **load distribution**. Extrusion effectively converts the meniscus from a functional load-sharing structure to a **non-functional extruded body**, accelerating cartilage wear.

### Reporting Extrusion
- Specify the measurement in **millimeters**
- Search for and report any associated **root tear** (this combination has important prognostic implications and may alter surgical management)
- Measure with the knee in **non-weight-bearing position** as obtained during standard MRI
- On weight-bearing or semi-flexed MRI, extrusion values may be greater`,
    pearl: `Measure meniscal extrusion on the coronal image where the medial meniscal body is widest, using a reference line at the tibial plateau margin. Greater than 3 mm is pathologic and should trigger a careful root-tear search; report the measured value rather than assigning a "severe" tier, as no separate validated cut-off exists.`,
    images: [
      {
        src: '/images/teaching/modules/module6-menisci/09_Meniscus_Displacement_Coronal.jpg',
        alt: 'Medial meniscal extrusion — coronal',
        caption: 'Medial meniscal body extruded beyond the medial tibial plateau margin on a coronal image (arrows). Measure perpendicular to the plateau edge — > 3 mm is pathologic.',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Parameniscal Cysts

**Parameniscal cysts** are fluid collections that form adjacent to the meniscus, most commonly in association with an **underlying meniscal tear** that serves as a **one-way valve** allowing joint fluid to decompress through the tear into the parameniscal soft tissues.

- Reported **medial-vs-lateral predominance varies** in the literature (several series find medial parameniscal cysts somewhat more common); either way, the cyst overlies an underlying meniscal tear
- Lateral parameniscal cysts are classically associated with **horizontal cleavage tears** of the lateral meniscus

### MRI Appearance
- Well-defined **lobulated fluid-signal collections** (high T2, low T1) at the periphery of the meniscus, often at the joint line
- May extend into adjacent soft tissues and can become quite large
- **Key diagnostic step:** identify the underlying meniscal tear -- the cyst will recur if only the cyst is treated without addressing the tear

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
- Meniscal remnant will be **truncated and blunted** but should have a **smooth, well-defined free edge** with **uniformly low signal**
- Persistent or recurrent **grade 3 signal** extending to the new articular surface suggests a **re-tear**

### After Meniscal Repair
- Increased intrameniscal signal is **expected for the first 6--12 months** and may persist indefinitely without clinical significance
- Criteria for **re-tear** are more stringent:
  - **Fluid-signal intensity** (equivalent to joint fluid on T2-weighted sequences) that **unequivocally reaches the articular surface**
  - Grade 2-type signal at the repair site may represent **healing granulation tissue** -- do not call this a re-tear
- **MR arthrography** with dilute gadolinium can improve accuracy in equivocal cases (contrast extending into the repair site is more specific for a persistent or recurrent tear)

### After Meniscal Transplant
- Evaluate for:
  - **Signal characteristics**
  - **Sizing** (extrusion)
  - **Horn attachment integrity**
- The transplant will demonstrate some increased signal as it incorporates but should **not show fluid-signal clefts** reaching the surface`,
    pearl: `After meniscal repair, do not overcall intermediate signal at the repair site as a re-tear. Only fluid-bright signal (matching joint fluid on T2) that clearly extends to the articular surface should be considered a definite re-tear. When in doubt, recommend MR arthrography.`,
  },
];
