import type { TopicContent } from './index';

export const module8Content: TopicContent[] = [
  {
    content: `### Quadriceps Tendon Tears

**Quadriceps tendon tears** are more common than patellar tendon tears and typically occur in patients **over 40 years of age**.

### Anatomy
The quadriceps tendon is a **trilaminar structure** composed of:
- **Rectus femoris** (superficial)
- **Vastus lateralis and medialis** (middle)
- **Vastus intermedius** (deep)

On sagittal MRI, the intact quadriceps tendon appears as a well-defined, low-signal band inserting on the superior pole of the patella, approximately **8--10 mm thick**.

### Partial Tears
- Most commonly involve the **deep layer** (vastus intermedius)
- Appear as **focal discontinuity**, increased signal, or **fluid-filled defects** within the tendon substance with some intact fibers remaining
- Key differentiator from tendinopathy: a **discrete fluid-signal defect** versus diffuse intermediate signal thickening

### Complete Tears
- Full-thickness discontinuity with a palpable gap
- **Retraction** of the proximal tendon stump
- Loss of active knee extension

MRI findings in complete tears:
- **Fluid-filled gap** at the superior pole of the patella with proximal retraction
- **Patella baja** (low-riding patella) due to the unopposed pull of the patellar tendon
- **Large, hemorrhagic joint effusion**
- Prepatellar or suprapatellar hematoma

### Reporting Checklist
- Number of **layers involved**
- **Percentage of tendon width** affected
- **Degree of retraction**
- In older patients, consider **bilateral tears**`,
    pearl: `Partial quadriceps tendon tears most commonly involve the deep (vastus intermedius) layer. On sagittal images, look for a fluid-signal defect at the deep aspect of the tendon near the patellar insertion. The superficial fibers may appear intact, creating a deceptively normal appearance on physical exam.`,
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
- Focal areas of **fluid-signal intensity** within the tendon substance, most often at the proximal insertion

**Complete tears:**
- Full-thickness discontinuity with proximal retraction of the patella (patella alta)
- **Patella alta** (high-riding patella with Insall-Salvati ratio **> 1.2**)
- Loss of the normal tendon on sagittal images

### Tendinopathy vs. Partial Tear

| Feature | Tendinopathy | Partial Tear |
|---------|-------------|-------------|
| **Signal** | Intermediate (not fluid-bright on T2) | **Fluid-signal intensity** within tendon |
| **Morphology** | Thickening, diffuse | **Discrete defect** |
| **Management** | Conservative | May require surgical intervention |

### Post-Surgical Patellar Tendon
After **bone-patellar tendon-bone graft harvest** (for ACL reconstruction), expect a **thinned central portion** of the tendon with surrounding scar tissue. This is a **normal postoperative finding** and should not be called a tear.`,
    pearl: `Patellar tendinopathy (jumper's knee) characteristically involves the proximal posterior fibers at the inferior patellar pole. The signal will be intermediate (not fluid-bright) on T2 sequences. A true partial tear shows a discrete fluid-signal defect. This distinction matters because tendinopathy is managed conservatively while significant partial tears may require surgical intervention.`,
    images: [
      {
        src: '/images/teaching/cases/patellar-tendon-rupture/patellar_tendon_rupture_sagittal_t2.jpg',
        alt: 'Patellar tendon rupture — sagittal T2',
        caption: 'Patellar tendon rupture — sagittal T2 shows discontinuity of the patellar tendon (here at the distal tibial-tubercle insertion). A normal tendon is uniformly thin and dark; focal thickening with intermediate signal = tendinopathy, a fluid-filled gap = rupture.',
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

**Painful bipartite patella:** When bipartite patella becomes symptomatic with stress or trauma, **bone marrow edema** will be seen at the synchondrosis. This may require treatment.

### Sleeve Fractures (Pediatric)
- **Cartilaginous sleeve** of the inferior pole is avulsed, often with only a small bony fragment visible on radiographs
- MRI is valuable because the **cartilaginous component** (invisible on radiographs) is clearly seen as a fragment with surrounding edema at the inferior pole`,
    pearl: `Bipartite patella (superolateral pole, smooth corticated margins) is a normal variant, not a fracture. However, if there is bone marrow edema at the synchondrosis, it has become symptomatic ("painful bipartite patella") and may require treatment. The key differentiator from fracture is the location, smooth margins, and corticated edges.`,
  },
  {
    content: `### Joint Effusion

**Joint effusion** on MRI provides diagnostic information beyond simply noting its presence.

### Effusion Types
- **Simple effusions:** Homogeneously bright on T2-weighted sequences and dark on T1-weighted sequences
- **Complex effusions:** Contain debris, septations, or layering components suggesting **hemarthrosis**, **infection**, or **inflammatory arthropathy**

### Lipohemarthrosis

**Lipohemarthrosis** is a critical finding that indicates an **intra-articular fracture until proven otherwise**.

MRI appearance:
- **Fat-fluid level** within the suprapatellar bursa (best seen on sagittal or axial T2-weighted or STIR sequences with the knee in extension)
- **Superior layer:** Fat signal (bright on T1, intermediate on T2)
- **Inferior layer:** Serous or hemorrhagic fluid
- **Gradient echo sequences** may show susceptibility ("blooming") in the dependent hemorrhagic layer from acute-to-early-subacute blood products (deoxyhemoglobin and intracellular methemoglobin) — not hemosiderin, which is a chronic blood product (e.g., PVNS)

### Fracture Search When Lipohemarthrosis is Identified
Carefully search for an occult fracture, most commonly involving:
- **Tibial plateau** (especially the lateral plateau in association with ACL tears)
- **Patella**
- **Femoral condyles**

### Secondary Effects of Large Effusions
- Distension of the **suprapatellar bursa**
- Displacement of the **prefemoral and infrapatellar fat pads**
- May impede venous return, causing **periarticular soft tissue edema**

The presence and character of the effusion should be **documented in every knee MRI report**.`,
    pearl: `A lipohemarthrosis (fat-fluid level in the suprapatellar bursa) indicates an intra-articular fracture until proven otherwise. When identified, perform a systematic search for occult fractures of the tibial plateau, patella, and femoral condyles. It is best seen on a non-fat-suppressed sequence — fat saturation nulls the fatty layer and the level can vanish. This finding is particularly important because the fracture may not be visible on initial radiographs.`,
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
- **Complicated cysts:** Internal debris, hemorrhage, loose bodies, or thick walls suggesting **PVNS** or **synovial chondromatosis**
- **Popliteal artery aneurysm** -- check for flow void
- **Synovial sarcoma** -- most common malignant mass in the popliteal fossa
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
    content: `### Synovial Pathology: PVNS and Synovial Chondromatosis

Synovial pathology on knee MRI includes two important proliferative conditions.

### PVNS (Tenosynovial Giant Cell Tumor)

Two forms:
- **Diffuse** -- affecting the entire synovium
- **Localized** (focal nodular synovitis)

**Hallmark MRI finding:** Synovial proliferation with **low signal intensity on all pulse sequences** due to **hemosiderin deposition**, best demonstrated by **"blooming" artifact on gradient echo (GRE)** sequences.

**Diffuse PVNS:**
- Widespread **synovial thickening** with nodular masses
- Joint effusion and **hemosiderin staining** creating diffusely low-signal synovium on T1 and T2
- **Bone erosions on both sides of the joint** (unlike RA, which typically produces marginal erosions at bare areas)
- **Relative preservation of joint space** distinguishes PVNS from inflammatory arthritis

**Localized PVNS:**
- Focal, well-defined, **low-signal nodule**, most commonly in the anterior compartment near **Hoffa's fat pad**

### Synovial Chondromatosis

Characterized by **metaplastic formation of cartilaginous nodules** within the synovium.
- **Primary:** De novo formation
- **Secondary:** Trauma or degenerative loose bodies becoming embedded in the synovium

MRI findings:
- Multiple intra-articular bodies with **cartilage signal characteristics** (intermediate T1, high T2)
- Variable degrees of **calcification or ossification** (low signal on all sequences if calcified)
- **Ring-and-arc calcification** pattern is classic
- Thickened synovium that enhances on post-contrast imaging

### Key Distinction

| Feature | PVNS | Synovial Chondromatosis |
|---------|------|------------------------|
| **Signal** | Low on all sequences (hemosiderin) | Cartilage signal (intermediate T1, high T2) |
| **GRE blooming** | **Present** | Absent |
| **Bodies** | Nodular synovial masses | Cartilaginous/ossified loose bodies |`,
    pearl: `PVNS demonstrates low signal on all sequences due to hemosiderin and "blooms" on gradient echo imaging. This distinguishes it from synovial chondromatosis (cartilage-signal bodies without blooming) and inflammatory synovitis (intermediate signal synovial thickening that enhances). If you see diffusely low-signal synovium with blooming, PVNS is the diagnosis.`,
  },
  {
    content: `### The Universal MRI Muscle-Strain Framework

Muscle strains are graded on fluid-sensitive sequences (**PD-FS / STIR / T2-FS**). The same three-tier scheme applies to **any** muscle — what changes is the location and what you measure. The **myotendinous junction (MTJ)** is the most common strain site because it is the mechanically weakest link of the muscle-tendon unit.

| Grade | Key MRI findings | Architecture |
|-------|------------------|--------------|
| **Grade 1** | Interstitial / perifascial edema; **"feathery"** or stellate high T2/PD-FS signal along fascial planes | Intact, **no fiber gap** |
| **Grade 2** | Disrupted fibers + perifascial/intramuscular fluid or hematoma; a **partial gap** | Distorted but **not complete** |
| **Grade 3** | **Full fiber discontinuity** with retracted, wavy/serpentine stump; hematoma fills the gap | **Complete tear** |

For every strain, characterize: the **muscle and the specific MTJ** involved, the **% cross-sectional area** of fibers torn, the **craniocaudal length** of abnormal signal, and the presence/size of an **intramuscular hematoma**.

### Proximal Hamstring Avulsion (Ischial Tuberosity)

A tendinous **avulsion at the ischial tuberosity origin** — the classic "water-skier" or sprinter injury (sudden hip flexion + knee extension).

- The origin has **two tendinous components**: the **conjoint tendon** (biceps femoris long head + semitendinosus fused into one tendon) and the **separate semimembranosus** tendon.
- Report **which components are torn and how many** — e.g., isolated semimembranosus, isolated conjoint, or a complete avulsion of all three hamstring components (conjoint + semimembranosus). Also report the **retraction distance in cm** (tendon stump to the tuberosity footprint) and **proximity to the sciatic nerve** (which lies just lateral — tethering or perineural scar drives sciatic-type symptoms).
- **Complete 2–3-component avulsions with significant retraction** are commonly referred for surgical repair. A **~2 cm retraction** is a frequently cited operative trigger; some surgeons instead use a **2-tendon threshold** regardless of exact distance. Present these as guides, not absolutes — the decision integrates component number, retraction, activity level, and nerve involvement.

### Medial Gastrocnemius "Tennis Leg"

- Tear at the **distal MTJ of the MEDIAL gastrocnemius** head.
- Signature finding: **fluid tracking between the medial gastrocnemius and the soleus aponeurosis** (a crescentic interfascial fluid collection), often with a retracted aponeurotic edge.
- **Plantaris tendon/muscle rupture** is a classically cited but much less common cause of the same presentation; the dominant lesion is the medial gastrocnemius distal MTJ tear. Look for an intact vs torn plantaris, but do not over-attribute tennis leg to it.
- **Always check the differential** on a calf-pain study: **DVT** (interrogate the popliteal vein for thrombus/non-compressibility) and **ruptured Baker's cyst** (look for a popliteal cyst and inferior fluid dissection). These three are clinically indistinguishable.

### Other Common Knee-Region Strains

- **Adductor (groin) strains** — most often the **adductor longus** proximal MTJ/origin; common in pivoting/kicking athletes.
- **Rectus femoris strains** — the only biarticular quadriceps head; injured at the **distal MTJ** (sprinting/kicking) or the **proximal direct/indirect head** near the AIIS.

### Reporting Checklist

- **Muscle + specific MTJ** involved, and the **strain grade (1/2/3)**.
- **% cross-sectional area** torn and **craniocaudal length** of edema; size of any **hematoma**.
- For hamstring avulsion: **which/how many components torn (conjoint vs semimembranosus), retraction in cm, sciatic-nerve proximity**.
- For calf/tennis leg: confirm **distal medial gastrocnemius MTJ** and **gastrocnemius–soleus interfascial fluid**; explicitly **clear the popliteal vein (DVT)** and **comment on any Baker's cyst**.`,
    pearl: `The myotendinous junction is the weakest link, so most strains — and the highest-grade fiber disruption — cluster there; that's where you measure % cross-section and craniocaudal length. The single most consequential miss is treating calf "tennis leg" as purely musculoskeletal: always interrogate the popliteal vein, because DVT and a ruptured Baker's cyst look identical at the bedside.`,
  },
];
