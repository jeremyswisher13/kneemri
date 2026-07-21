import type { TopicContent } from './index';

export const module8Content: TopicContent[] = [
  {
    content: `### Quadriceps Tendon Tears

**Quadriceps tendon tears** are more common than patellar tendon tears and typically occur in patients **over 40 years of age**.

### Anatomy
The quadriceps tendon has a **multilayered architecture** commonly described as:
- **Rectus femoris** (superficial)
- **Vastus lateralis and medialis** (middle)
- **Vastus intermedius** (deep)

On sagittal MRI, the intact quadriceps tendon appears as a well-defined, low-signal band inserting on the superior pole of the patella, approximately **8--10 mm thick**.

### Partial Tears
- May involve only one layer, including the deep vastus-intermedius contribution, while other fibers remain intact
- Appear as **focal discontinuity**, increased signal, or **fluid-filled defects** within the tendon substance with some intact fibers remaining
- Focal fiber disruption is the key morphologic distinction from tendinopathy; a fluid-signal cleft supports a higher-grade partial tear, but signal intensity alone is not absolute

### Complete Tears
- Full-thickness discontinuity, often with a palpable gap
- **Retraction** of the proximal tendon stump
- Usually loss of active knee extension, although intact retinacula can preserve some function

MRI findings in complete tears:
- **Fluid-filled gap** at the superior pole of the patella with proximal retraction
- **Patella baja** (low-riding patella) due to the unopposed pull of the patellar tendon
- Joint effusion/hemarthrosis and prepatellar or suprapatellar hematoma may accompany the tear

### Reporting Checklist
- Number of **layers involved**
- **Percentage of tendon width** affected
- **Degree of retraction**
- In older patients, consider **bilateral tears**`,
    pearl: `A partial quadriceps-tendon tear may be confined to one layer while the remaining fibers stay continuous. Inspect superficial, middle, and deep contributions in sagittal and axial planes for a discrete fluid-signal defect, and correlate MRI morphology with extensor function on examination.`,
    images: [
      {
        src: '/images/modules/extensor-mechanism.svg',
        alt: 'Extensor mechanism anatomy diagram',
        caption: 'Quadriceps tendon, patella, and patellar tendon anatomy',
      },
    ],
  },
  {
    content: `### Patellar Tendon Pathology

**Patellar tendon pathology** ranges from tendinopathy (**jumper's knee**) to partial and complete tears.

### Patellar Tendinopathy (Jumper's Knee)
- Characterized by **tendon thickening** and **intermediate increased signal**, most conspicuous on short-TE (T1 / proton density) sequences and remaining **below fluid (water) intensity on T2**
- Most commonly affects the **proximal posterior fibers** at the inferior pole of the patella
- On MRI: thickened, fusiform tendon with **intermediate signal** that does not reach fluid intensity

### Patellar Tendon Tears
- Less frequent than quadriceps tendon tears
- More common in patients **under 40**, particularly athletes

**Partial tears:**
- Focal fiber disruption with some continuity remaining, sometimes with a **fluid-signal cleft**, most often at the proximal insertion

**Complete tears:**
- Full-thickness discontinuity with a gap/retraction of the torn tendon ends and proximal displacement of the patella (patella alta)
- **Patella alta** can support the diagnosis, but do not calculate an Insall-Salvati ratio across a disrupted tendon
- Loss of the normal tendon on sagittal images

### Tendinopathy vs. Partial Tear

| Feature | Tendinopathy | Partial Tear |
|---------|-------------|-------------|
| **Signal** | Usually intermediate | Often higher, but may overlap |
| **Morphology** | Thickening with preserved fibers | **Focal fiber defect** with some continuity remaining |
| **Clinical implication** | Usually treated initially without surgery | May prompt orthopedic evaluation depending on extent, function, symptoms, and patient factors |

### Post-Surgical Patellar Tendon
After **bone-patellar tendon-bone graft harvest** (for ACL reconstruction), a central donor-site defect, thinning, and scar can be expected. Compare with operative history and prior imaging rather than labeling the expected central change a tear.`,
    pearl: `Patellar tendinopathy commonly involves the proximal posterior fibers at the inferior patellar pole, with thickening and increased signal but preserved overall continuity. A partial tear requires focal fiber disruption, sometimes with a fluid-signal cleft. Report tear extent and remaining fibers; management depends on symptoms, function, rehabilitation response, and patient context rather than MRI alone.`,
    images: [
      {
        src: '/images/teaching/cases/patellar-tendon-rupture/patellar_tendon_rupture_sagittal_t2.jpg',
        alt: 'Patellar tendon rupture — sagittal T2',
        caption: 'Patellar tendon rupture — sagittal T2 shows tendon discontinuity at the distal tibial-tubercle insertion. Compare the gap with the expected continuous low-signal fibers; focal thickening and signal with preserved fibers instead support tendinopathy.',
        attribution: 'Pagdal et al., Cureus, 2021. PMC8547195. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Patellar Fractures and Bipartite Patella

**Patellar fractures** may be transverse, stellate (comminuted), or vertical. On MRI, fractures appear as **linear low-signal lines on T1-weighted images** with surrounding **bone marrow edema** on fluid-sensitive sequences. **Transverse fractures** of the mid-patella are the most common pattern and may be associated with extensor mechanism disruption.

Key determination: whether the fracture is **displaced** and whether the **extensor retinaculum is intact** (guides operative vs. non-operative management).

### Bipartite Patella

**Bipartite patella** is a normal developmental variant present in **2--3%** of the population that must be distinguished from fracture. Most commonly occurs at the **superolateral pole** (Saupe type III, ~75% of cases).

| Feature | Bipartite Patella | Acute Fracture |
|---------|------------------|----------------|
| **Margins** | Smooth, well-corticated | Sharp, irregular |
| **Location** | Superolateral pole | Mid-patella (most common) |
| **Bilaterality** | ~50% bilateral | Usually unilateral |

**Symptomatic bipartite patella:** Stress or trauma may produce edema-like marrow signal and soft-tissue edema at the synchondrosis, supporting it as a pain generator. Absence of edema does not independently settle symptom causality; correlate with focal tenderness and the clinical history.

### Sleeve Fractures (Pediatric)
- **Cartilaginous sleeve** of the inferior pole is avulsed, often with only a small bony fragment visible on radiographs
- MRI is valuable because the **cartilaginous component** (invisible on radiographs) is clearly seen as a fragment with surrounding edema at the inferior pole`,
    pearl: `Bipartite patella (usually superolateral with smooth corticated margins) is a developmental variant, not an acute fracture. Edema-like signal at the synchondrosis after stress or trauma supports, but does not by itself prove, that the variant is symptomatic. Use location, cortication, donor-site morphology, soft-tissue findings, and focal clinical tenderness.`,
  },
  {
    content: `### Joint Effusion

**Joint effusion** on MRI provides diagnostic information beyond simply noting its presence.

### Effusion Types
- **Simple effusions:** Homogeneously bright on T2-weighted sequences and dark on T1-weighted sequences
- **Complex effusions:** Contain debris, septations, or layering components suggesting **hemarthrosis**, **infection**, or **inflammatory arthropathy**

### Lipohemarthrosis

In acute nonoperative trauma, **lipohemarthrosis** strongly indicates an **intra-articular fracture**. Recent surgery, aspiration, or another intra-articular procedure is an important contextual exception.

MRI appearance:
- **Fat-fluid level** within the suprapatellar recess, best appreciated on a non-fat-suppressed T1- or intermediate-weighted image obtained after the layers have had time to separate; fat-suppressed/STIR images may obscure the fatty layer
- **Superior layer:** Fat signal (bright on T1, intermediate on T2)
- **Inferior layer:** Serous or hemorrhagic fluid
- **Gradient echo sequences** may show susceptibility ("blooming") in a hemorrhagic layer from blood products; chronic hemosiderin can also bloom, including in TGCT

### Fracture Search When Lipohemarthrosis is Identified
Carefully search for an occult fracture, most commonly involving:
- **Tibial plateau** (especially the lateral plateau in association with ACL tears)
- **Patella**
- **Femoral condyles**

### Secondary Effects of Large Effusions
- Distension of the **suprapatellar bursa**
- Displacement of the **prefemoral and infrapatellar fat pads**
- A very large effusion can contribute to local mass effect, but periarticular edema remains nonspecific

The presence and character of the effusion should be **documented in every knee MRI report**.`,
    pearl: `In acute nonoperative trauma, a lipohemarthrosis (fat-fluid level in the suprapatellar recess) strongly indicates an intra-articular fracture. Search the tibial plateaus, patella, femoral condyles, and osteochondral surfaces. It is best seen on a non-fat-suppressed sequence because fat saturation can erase the fatty layer; remember recent surgery or an intra-articular procedure as an exception.`,
  },
  {
    content: `### Baker's Cysts (Popliteal Cysts)

**Baker's cysts** arise from the **posteromedial aspect** of the knee between the **medial head of the gastrocnemius** and the **semimembranosus tendon**. They communicate with the joint through a valve-like mechanism at the gastrocnemius-semimembranosus bursa.

Baker's cysts are **commonly secondary** to underlying intra-articular pathology:
- **Meniscal tears**
- **Cartilage degeneration**
- **Inflammatory arthropathy**

### MRI Appearance

**Uncomplicated Baker's cyst:**
- Well-defined, thin-walled, **fluid-signal collection** in the posteromedial popliteal fossa
- Characteristic **"speech bubble"** or comma shape on axial images
- The neck can be traced to the interval between the **medial gastrocnemius** and **semimembranosus tendons**

**Ruptured Baker's cyst:**
- Inferior extension of fluid along the fascial planes of the **medial gastrocnemius**
- Resembles an **inverted "U"** on sagittal images
- Surrounding edema in the calf
- Can mimic **deep venous thrombosis** clinically (**pseudothrombophlebitis**)

### Important Mimics and Complications
- **Complicated cysts:** Internal debris, hemorrhage, loose bodies, or thick walls should prompt evaluation for the source, including synovitis, synovial chondromatosis, or another mass-like process
- **Popliteal artery aneurysm or other vascular lesion** -- assess flow-related signal and enhancement when available, and recommend dedicated vascular imaging when suspected
- **Soft-tissue neoplasm** (including synovial sarcoma) -- consider when a lesion is solid, enhancing, infiltrative, or not centered in the gastrocnemius-semimembranosus bursa
- **Ganglia** arising from the proximal tibiofibular joint`,
    pearl: `Baker's cysts are commonly secondary to internal derangement. When reporting a Baker's cyst, search for underlying intra-articular pathology (meniscal tear, cartilage loss, synovitis). A ruptured Baker's cyst dissects inferiorly along the calf and clinically mimics DVT -- include this differential when clinically relevant.`,
    images: [
      {
        src: '/images/teaching/cases/baker-cyst/baker_cyst_sagittal.jpg',
        alt: "Baker's cyst — sagittal PD FS",
        caption: "Baker's cyst on sagittal PD FS — a bright fluid-filled collection in the posteromedial knee, between the medial head of gastrocnemius and the semimembranosus tendon, extending distally (arrow). Look for the internal-derangement cause.",
        attribution: 'Feiler & Rosenberg, Cureus, 2025. PMC11828661. CC-BY 4.0.',
      },
    ],
  },
  {
    content: `### Bursitis Patterns Around the Knee

Bursitis patterns around the knee have characteristic locations and clinical associations.

| Bursa | Location | Key Associations |
|-------|----------|-----------------|
| **Prepatellar** ("housemaid's knee") | Anterior to the patella | Repetitive kneeling |
| **Superficial infrapatellar** | Anterior to distal patellar tendon insertion on tibial tubercle | Kneeling on hard surfaces |
| **Deep infrapatellar** | Posterior to the distal patellar tendon, anterior to the proximal tibia (just above the tibial tuberosity) | Repetitive extensor overload / running; Osgood-Schlatter |
| **Pes anserine** | Medial proximal tibia, ~4--5 cm below joint line | Overweight patients, runners |
| **ITB friction syndrome** | Deep to ITB at lateral femoral epicondyle | Runners, cyclists |
| **Semimembranosus-tibial collateral ligament (TCL)** | Posteromedially between these structures | Degenerative knees |

### Pes Anserine Bursitis
- Located beneath the conjoined insertion of the **sartorius, gracilis, and semitendinosus** tendons
- On MRI: fluid collection or edema between the **MCL** and the **pes anserine tendons**
- Common cause of **medial knee pain** in overweight patients and runners
- Can clinically **mimic a medial meniscal tear or MCL injury**

### Iliotibial Band Friction Syndrome
- Inflammation of the bursa (or synovial recess) between the **ITB** and the **lateral femoral epicondyle**
- On MRI: fluid or edema deep to the ITB at the level of the lateral epicondyle (best seen on **coronal and axial images**)

Each bursitis pattern should be reported with its **specific location** and any **associated underlying pathology**.`,
    pearl: `Pes anserine bursitis is located approximately 4-5 cm below the medial joint line, deep to the sartorius/gracilis/semitendinosus tendons. It commonly mimics medial meniscal tear clinically. On MRI, the fluid collection between the MCL and pes tendons is the key finding. Do not mistake this for an MCL injury.`,
  },
  {
    content: `### Synovial Pathology: Tenosynovial Giant Cell Tumor and Synovial Chondromatosis

Synovial pathology on knee MRI includes two important proliferative conditions.

### Tenosynovial Giant Cell Tumor (TGCT; formerly PVNS)

Two forms:
- **Diffuse** -- affecting the entire synovium
- **Localized** (focal nodular synovitis)

**Characteristic MRI pattern:** Nodular or diffuse synovial proliferation with foci of low signal from hemosiderin and susceptibility blooming on GRE or other susceptibility-sensitive sequences. Signal is variable, and blooming is supportive rather than pathognomonic.

**Diffuse-type TGCT:**
- Widespread **synovial thickening** with nodular masses
- Joint effusion and **hemosiderin staining** creating diffusely low-signal synovium on T1 and T2
- Pressure erosions may occur, particularly in tighter joints; inflammatory and other synovial disorders can also erode bone, so distribution is not independently diagnostic
- **Relative preservation of joint space** may favor TGCT over longstanding inflammatory arthritis but is not a standalone discriminator

**Localized TGCT:**
- Focal, well-defined, **low-signal nodule**, most commonly in the anterior compartment near **Hoffa's fat pad**

### Synovial Chondromatosis

Characterized by **metaplastic formation of cartilaginous nodules** within the synovium.
- **Primary:** De novo formation
- **Secondary:** Trauma or degenerative loose bodies becoming embedded in the synovium

MRI findings:
- Multiple intra-articular bodies with **cartilage signal characteristics** (intermediate T1, high T2)
- Variable degrees of **calcification or ossification** (low signal on all sequences if calcified)
- **Ring-and-arc mineralization** can be seen on radiographs/CT when chondroid bodies calcify
- Thickened synovium that enhances on post-contrast imaging

### Key Distinction

| Feature | TGCT | Synovial Chondromatosis |
|---------|------|------------------------|
| **Signal** | Often contains low-signal hemosiderin foci | Usually cartilage-like, with variable mineralization/ossification |
| **Susceptibility** | Common when hemosiderin-rich | Can occur when bodies are mineralized; radiographs/CT help |
| **Bodies** | Nodular synovial masses | Cartilaginous/ossified loose bodies |`,
    pearl: `Diffuse-type TGCT often contains hemosiderin, producing low signal and susceptibility blooming. The pattern is highly suggestive but not pathognomonic; blood products, postoperative change, and other mineralized or hemorrhagic synovial processes remain considerations. Use morphology, distribution, radiographs/CT when relevant, and histologic confirmation for a mass.`,
  },
  {
    content: `### A Practical MRI Muscle-Strain Framework

Muscle strains are assessed on fluid-sensitive sequences (**PD-FS / STIR / T2-FS**). A three-tier descriptive scheme is useful across muscles, but published classification systems and prognostic value vary by muscle group and sport. The **myotendinous junction (MTJ)** is a common strain site.

| Grade | Key MRI findings | Architecture |
|-------|------------------|--------------|
| **Grade 1** | Interstitial / perifascial edema; **"feathery"** or stellate high T2/PD-FS signal along fascial planes | Intact, **no fiber gap** |
| **Grade 2** | Disrupted fibers + perifascial/intramuscular fluid or hematoma; a **partial gap** | Distorted but **not complete** |
| **Grade 3** | **Full fiber discontinuity** with retracted, wavy/serpentine stump; hematoma fills the gap | **Complete tear** |

For every strain, characterize the **muscle and specific MTJ** involved, fiber disruption/retraction, craniocaudal extent, and any hematoma. Estimate cross-sectional involvement when reproducible and clinically useful, recognizing that measurement and prognostic evidence vary by muscle and classification system.

### Medial Gastrocnemius "Tennis Leg"

- Tear at the **distal MTJ of the MEDIAL gastrocnemius** head.
- Signature finding: **fluid tracking between the medial gastrocnemius and the soleus aponeurosis** (a crescentic interfascial fluid collection), often with a retracted aponeurotic edge.
- **Plantaris tendon/muscle rupture** is a classically cited but much less common cause of the same presentation; the dominant lesion is the medial gastrocnemius distal MTJ tear. Look for an intact vs torn plantaris, but do not over-attribute tennis leg to it.
- **Always consider the differential** on a calf-pain study: **DVT** and **ruptured Baker's cyst**. A routine knee MRI may reveal gross venous abnormality but cannot assess compressibility or exclude DVT; obtain dedicated venous duplex ultrasound when clinically suspected.

### Other Common Knee-Region Strains

- **Distal hamstrings** — trace the semimembranosus and semitendinosus posteromedially and the biceps femoris to the fibular head; report tendon involvement, fiber gap, and retraction.
- **Popliteus** — inspect the tendon from its femoral origin through the popliteal hiatus and the muscle belly for edema or fiber disruption, especially with posterolateral-corner injury.
- **Distal quadriceps muscle/MTJ** — describe the involved head and craniocaudal extent, while separately assessing the quadriceps tendon insertion.
- **Proximal calf** — assess both gastrocnemius heads, soleus, plantaris when visible, and any interfascial hematoma.

The ischial hamstring origin, adductor longus origin, and proximal rectus femoris near the AIIS are usually outside a routine knee MRI field of view. They require a pelvis/hip or dedicated thigh examination when clinically suspected.

### Reporting Checklist

- **Muscle + specific MTJ** involved, and the **strain grade (1/2/3)**.
- **% cross-sectional area** torn and **craniocaudal length** of edema; size of any **hematoma**.
- For distal hamstring or popliteus injury: **specific tendon/muscle, fiber continuity, retraction, and associated corner injury**.
- For calf/tennis leg: assess the **distal medial gastrocnemius MTJ**, **gastrocnemius–soleus interfascial fluid**, and any **Baker's cyst**; state that dedicated venous ultrasound is needed if DVT is clinically suspected rather than claiming MRI clearance.`,
    pearl: `For a muscle injury, describe the exact muscle/MTJ, fiber disruption, retraction, craniocaudal extent, and hematoma rather than relying on grade alone. Calf pain also requires clinical consideration of DVT and ruptured Baker's cyst; routine knee MRI does not exclude venous thrombosis.`,
  },
];
