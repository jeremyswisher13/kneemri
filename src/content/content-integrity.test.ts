import { describe, it, expect } from 'vitest'
import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  normalKneeLearn,
  structurePearl,
  structureReading,
  structureCase,
  structureCorrelate,
  crossPlane,
  advancedChallenge,
  kneeImageCaq,
} from '@/content/normal-knee-learn'
import {
  normalShoulderLearn,
  structureShoulderPearl,
  structureShoulderReading,
  structureShoulderCase,
  shoulderStructureCorrelate,
  shoulderAdvanced,
  shoulderImageCaq,
  shoulderCrossPlane,
} from '@/content/normal-shoulder-learn'
import {
  normalHipLearn,
  structureHipPearl,
  structureHipReading,
  structureHipCase,
  hipStructureCorrelate,
  hipAdvanced,
  hipImageCaq,
  hipCrossPlane,
} from '@/content/normal-hip-learn'
import {
  normalElbowLearn,
  structureElbowPearl,
  structureElbowReading,
  structureElbowCase,
  elbowStructureCorrelate,
  elbowAdvanced,
  elbowImageCaq,
  elbowCrossPlane,
} from '@/content/normal-elbow-learn'
import { moduleQuizzes } from '@/content/quizzes/module-quizzes'
import { moduleFlashcards } from '@/content/flashcards/module-flashcards'
import { courseRegistry, getCourseById } from '@/content/courses'
import { moduleInteractives } from '@/content/module-interactives'
import { moduleContentById } from '@/content/modules/content-by-id'
import { reviewQuestionById } from '@/content/review-registry'
import { workstationReviewId } from '@/content/review-id'
import { prePostQuizQuestions as kneePrePostQuizQuestions } from '@/content/quizzes/pre-post-quiz'
import { shoulderPrePostQuizQuestions } from '@/content/shoulder/pre-post-quiz'
import { hipPrePostQuizQuestions } from '@/content/hip/pre-post-quiz'
import { elbowPrePostQuizQuestions } from '@/content/elbow/pre-post-quiz'
import type { PlaneLearn, AdvancedQ } from '@/content/normal-mri-types'

// Plane id -> stack folder (mirrors the SERIES tables in the workstation pages).
const PLANE_DIRS: Record<string, Record<string, string>> = {
  'knee-mri': {
    'sag-pdfs': 'normal-knee-sagittal',
    'cor-pdfs': 'normal-knee-coronal',
    'axi-t2fs': 'normal-knee-axial',
    'sag-t1': 'normal-knee-sagittal-t1',
  },
  'shoulder-mri': {
    'sag-t2fs': 'normal-shoulder-sagittal',
    'cor-t2fs': 'normal-shoulder-coronal',
    'axi-t2fs': 'normal-shoulder-axial',
    'sag-t1': 'normal-shoulder-sagittal-t1',
  },
  'hip-mri': {
    'cor-t2fs': 'normal-hip-coronal',
    axi: 'normal-hip-axial',
    sag: 'normal-hip-sagittal',
  },
  'elbow-mri': {
    'cor-t2fs': 'normal-elbow-coronal',
    'axi-t2fs': 'normal-elbow-axial',
    'sag-ir': 'normal-elbow-sagittal',
  },
}

const STACK_ROOT = join(process.cwd(), 'public/images/teaching/stacks')
const sliceCount = (folder: string) =>
  readdirSync(join(STACK_ROOT, folder)).filter((f) => f.endsWith('.jpg')).length
const folderOf = (dir: string) => dir.split('/').filter(Boolean).pop() as string

const inRange = (n: number) => typeof n === 'number' && n >= 0 && n <= 100

// ── Interactive workstation: tours + knowledge checks ──────────────────────
describe.each([
  ['knee-mri', normalKneeLearn as Record<string, PlaneLearn>],
  ['shoulder-mri', normalShoulderLearn as Record<string, PlaneLearn>],
  ['hip-mri', normalHipLearn as Record<string, PlaneLearn>],
  ['elbow-mri', normalElbowLearn as Record<string, PlaneLearn>],
])('%s workstation planes', (courseId, planes) => {
  const dirs = PLANE_DIRS[courseId]

  for (const [planeId, plane] of Object.entries(planes)) {
    describe(`plane ${planeId}`, () => {
      it('has a known stack folder', () => {
        expect(dirs[planeId], `no stack-dir mapping for plane ${planeId}`).toBeTruthy()
      })
      const count = dirs[planeId] ? sliceCount(dirs[planeId]) : 0

      it('tour markers and sliceIndices are valid', () => {
        for (const step of plane.tour) {
          expect(step.sliceIndex, `${step.title} sliceIndex`).toBeGreaterThanOrEqual(0)
          expect(step.sliceIndex, `${step.title} sliceIndex < ${count}`).toBeLessThan(count)
          for (const m of step.markers) {
            expect(inRange(m.x) && inRange(m.y), `${step.title} marker ${m.x},${m.y}`).toBe(true)
          }
        }
      })

      it('quiz items are well-formed (4 unique options, valid answer, in-range marker/slice)', () => {
        for (const q of plane.quiz) {
          expect(q.options.length, `${q.id} option count`).toBe(4)
          expect(new Set(q.options).size, `${q.id} duplicate options`).toBe(4)
          expect(q.answer, `${q.id} answer index`).toBeGreaterThanOrEqual(0)
          expect(q.answer, `${q.id} answer index`).toBeLessThan(4)
          expect(q.prompt.trim().length, `${q.id} empty prompt`).toBeGreaterThan(0)
          expect(q.explanation.trim().length, `${q.id} empty explanation`).toBeGreaterThan(0)
          expect(inRange(q.marker.x) && inRange(q.marker.y), `${q.id} marker`).toBe(true)
          expect(q.sliceIndex, `${q.id} sliceIndex`).toBeGreaterThanOrEqual(0)
          expect(q.sliceIndex, `${q.id} sliceIndex < ${count}`).toBeLessThan(count)
        }
      })

      // Two items may share a (slice, marker) anchor on purpose — an "ID the
      // structure" check followed by a clinical-reasoning question about it —
      // but only if they have DIFFERENT correct answers. Two items at the same
      // anchor with the same correct answer render as the identical question
      // twice in one Knowledge Check, which is the redundancy the audit caught.
      it('has no exact-duplicate quiz items (same slice + marker + correct answer)', () => {
        const seen = new Map<string, string>()
        for (const q of plane.quiz) {
          const key = `${q.sliceIndex}@${q.marker.x},${q.marker.y}=${q.options[q.answer]}`
          const prior = seen.get(key)
          expect(
            prior,
            `${q.id} duplicates ${prior} (identical slice/marker/answer) — give it a distinct anchor or remove it`,
          ).toBeUndefined()
          seen.set(key, q.id)
        }
      })
    })
  }
})

// ── No duplicate ids across each course's interactive item banks ───────────
describe('workstation ids are unique within each course', () => {
  it('knee', () => {
    const ids = [
      ...Object.values(normalKneeLearn).flatMap((p) => p.quiz.map((q) => q.id)),
      ...advancedChallenge.map((a) => a.id),
      ...crossPlane.map((x) => x.id),
    ]
    expect(new Set(ids).size, 'duplicate knee ids').toBe(ids.length)
  })
  it('shoulder', () => {
    const ids = [
      ...Object.values(normalShoulderLearn).flatMap((p) => p.quiz.map((q) => q.id)),
      ...shoulderAdvanced.map((a) => a.id),
      ...shoulderCrossPlane.map((x) => x.id),
    ]
    expect(new Set(ids).size, 'duplicate shoulder ids').toBe(ids.length)
  })
  it('hip', () => {
    const ids = [
      ...Object.values(normalHipLearn).flatMap((p) => p.quiz.map((q) => q.id)),
      ...hipAdvanced.map((a) => a.id),
      ...hipCrossPlane.map((x) => x.id),
    ]
    expect(new Set(ids).size, 'duplicate hip ids').toBe(ids.length)
  })
  it('elbow', () => {
    const ids = [
      ...Object.values(normalElbowLearn).flatMap((p) => p.quiz.map((q) => q.id)),
      ...elbowAdvanced.map((a) => a.id),
      ...elbowCrossPlane.map((x) => x.id),
    ]
    expect(new Set(ids).size, 'duplicate elbow ids').toBe(ids.length)
  })
})

// ── Pearls and case-bridges resolve (catches orphans / dangling refs) ──────
describe.each([
  ['knee', normalKneeLearn, structurePearl, structureCase, 'knee-mri'],
  ['shoulder', normalShoulderLearn, structureShoulderPearl, structureShoulderCase, 'shoulder-mri'],
  ['hip', normalHipLearn, structureHipPearl, structureHipCase, 'hip-mri'],
  ['elbow', normalElbowLearn, structureElbowPearl, structureElbowCase, 'elbow-mri'],
] as const)('%s pearls & case bridges', (_label, planes, pearls, bridges, courseId) => {
  const tourTitles = new Set(
    Object.values(planes as Record<string, PlaneLearn>).flatMap((p) => p.tour.map((t) => t.title)),
  )
  const caseIds = new Set(getCourseById(courseId).cases.map((c) => c.id))

  it('every pearl key matches a real tour-step title (no orphans)', () => {
    for (const key of Object.keys(pearls)) {
      expect(tourTitles.has(key), `orphan pearl key: "${key}"`).toBe(true)
    }
  })
  it('every case bridge points at a real case id', () => {
    for (const [key, v] of Object.entries(bridges)) {
      expect(caseIds.has(v.caseId), `bridge "${key}" -> missing case "${v.caseId}"`).toBe(true)
    }
  })
})

// ── Tour "reading point" keys resolve to real tour-step titles + carry text ─
// These render inline under each Guided Tour step; a mistyped key would silently
// never appear, so pin them to real titles (and ensure they're non-empty).
describe.each([
  ['knee', normalKneeLearn, structureReading],
  ['shoulder', normalShoulderLearn, structureShoulderReading],
  ['hip', normalHipLearn, structureHipReading],
  ['elbow', normalElbowLearn, structureElbowReading],
] as const)('%s tour reading points', (_label, planes, reading) => {
  const tourTitles = new Set(
    Object.values(planes as Record<string, PlaneLearn>).flatMap((p) => p.tour.map((t) => t.title)),
  )
  it('every reading-point key matches a real tour-step title (no orphans)', () => {
    for (const key of Object.keys(reading)) {
      expect(tourTitles.has(key), `orphan reading-point key: "${key}"`).toBe(true)
    }
  })
  it('every reading point carries a variant or a measure with text', () => {
    for (const [key, r] of Object.entries(reading)) {
      const hasText = (r.variant?.trim().length ?? 0) > 0 || (r.measure?.trim().length ?? 0) > 0
      expect(hasText, `${key} reading point is empty`).toBe(true)
    }
  })
})

// ── Ultrasound correlate keys resolve to real tour-step titles ─────────────
// A mistyped key (e.g. a hyphen where the tour title uses an en-dash) would
// silently never render its panel — this catches that class of bug.
describe.each([
  ['knee', normalKneeLearn, structureCorrelate],
  ['shoulder', normalShoulderLearn, shoulderStructureCorrelate],
  ['hip', normalHipLearn, hipStructureCorrelate],
  ['elbow', normalElbowLearn, elbowStructureCorrelate],
] as const)('%s ultrasound correlate', (_label, planes, correlate) => {
  const tourTitles = new Set(
    Object.values(planes as Record<string, PlaneLearn>).flatMap((p) => p.tour.map((t) => t.title)),
  )
  it('every correlate key matches a real tour-step title (no silent orphans)', () => {
    for (const key of Object.keys(correlate)) {
      expect(tourTitles.has(key), `orphan correlate key: "${key}"`).toBe(true)
    }
  })
  it('every correlate entry has non-empty appearance text', () => {
    for (const [key, c] of Object.entries(correlate)) {
      expect(c.ultrasound.appearance.trim().length, `${key} empty appearance`).toBeGreaterThan(0)
    }
  })
  it('every correlate image src points at a real file under public/', () => {
    for (const [key, c] of Object.entries(correlate)) {
      const img = c.ultrasound.image
      if (img) {
        expect(existsSync(join(process.cwd(), 'public', img.src)), `${key} image missing: ${img.src}`).toBe(true)
      }
    }
  })
})

// ── Cross-plane drill (knee) ───────────────────────────────────────────────
describe.each([
  ['knee', crossPlane],
  ['shoulder', shoulderCrossPlane],
  ['hip', hipCrossPlane],
])('%s cross-plane drill', (_label, drill) => {
  it('each item has valid answer index, candidates, coords, and slice bounds', () => {
    for (const x of drill) {
      expect(x.to.candidates.length, `${x.id} candidates`).toBeGreaterThan(1)
      expect(x.to.answer, `${x.id} answer`).toBeGreaterThanOrEqual(0)
      expect(x.to.answer, `${x.id} answer < candidates`).toBeLessThan(x.to.candidates.length)
      expect(inRange(x.from.x) && inRange(x.from.y), `${x.id} from coords`).toBe(true)
      for (const c of x.to.candidates) {
        expect(inRange(c.x) && inRange(c.y), `${x.id} candidate coords`).toBe(true)
      }
      const fromN = sliceCount(folderOf(x.from.dir))
      const toN = sliceCount(folderOf(x.to.dir))
      expect(x.from.sliceIndex, `${x.id} from sliceIndex`).toBeGreaterThanOrEqual(0)
      expect(x.from.sliceIndex, `${x.id} from sliceIndex`).toBeLessThan(fromN)
      expect(x.to.sliceIndex, `${x.id} to sliceIndex`).toBeGreaterThanOrEqual(0)
      expect(x.to.sliceIndex, `${x.id} to sliceIndex`).toBeLessThan(toN)
    }
  })

  it('each item carries non-empty teaching text (prompt, explanation, from label)', () => {
    for (const x of drill) {
      expect(x.prompt.trim().length, `${x.id} empty prompt`).toBeGreaterThan(0)
      expect(x.explanation.trim().length, `${x.id} empty explanation`).toBeGreaterThan(0)
      expect(x.from.label.trim().length, `${x.id} empty from.label`).toBeGreaterThan(0)
      expect(x.from.plane.trim().length, `${x.id} empty from.plane`).toBeGreaterThan(0)
      expect(x.to.plane.trim().length, `${x.id} empty to.plane`).toBeGreaterThan(0)
    }
  })
})

// ── Advanced challenge banks ───────────────────────────────────────────────
describe.each([
  ['knee', advancedChallenge],
  ['shoulder', shoulderAdvanced],
  ['hip', hipAdvanced],
  ['elbow', elbowAdvanced],
])('%s advanced challenge', (_label, bank: AdvancedQ[]) => {
  it('every item has 4 unique options and a valid answer', () => {
    for (const a of bank) {
      expect(a.options.length, `${a.id} option count`).toBe(4)
      expect(new Set(a.options).size, `${a.id} duplicate options`).toBe(4)
      expect(a.answer, `${a.id} answer`).toBeGreaterThanOrEqual(0)
      expect(a.answer, `${a.id} answer`).toBeLessThan(4)
      expect(a.explanation.trim().length, `${a.id} explanation`).toBeGreaterThan(0)
    }
  })
})

// ── Module quizzes (both courses, keyed by module id) ──────────────────────
describe('module quizzes', () => {
  const knownModuleIds = new Set(courseRegistry.flatMap((c) => c.modules.map((m) => m.id)))

  it('every module-quiz key is a real module id', () => {
    for (const key of Object.keys(moduleQuizzes)) {
      expect(knownModuleIds.has(key), `unknown module-quiz key: ${key}`).toBe(true)
    }
  })

  it('every question is well-formed (unique keys, correctAnswer present)', () => {
    const allIds: string[] = []
    for (const [mod, qs] of Object.entries(moduleQuizzes)) {
      for (const q of qs) {
        allIds.push(q.id)
        const keys = q.options.map((o) => o.key)
        expect(new Set(keys).size, `${mod}/${q.id} duplicate option keys`).toBe(keys.length)
        expect(keys.includes(q.correctAnswer), `${mod}/${q.id} correctAnswer not an option`).toBe(true)
        expect(q.stem.trim().length, `${mod}/${q.id} empty stem`).toBeGreaterThan(0)
        expect(q.explanation.trim().length, `${mod}/${q.id} empty explanation`).toBeGreaterThan(0)
      }
    }
    expect(new Set(allIds).size, 'duplicate module-quiz ids').toBe(allIds.length)
  })
})

// ── Pre/post assessment instrument (both courses) ──────────────────────────
describe('pre/post assessment instrument', () => {
  const VALID = new Set(['identical', 'parallel-pre', 'parallel-post', 'pre-only', 'post-only'])
  for (const course of courseRegistry) {
    describe(course.id, () => {
      it('items are well-formed with valid mappings', () => {
        const ids = course.prePostQuizQuestions.map((q) => q.id)
        expect(new Set(ids).size, 'duplicate assessment ids').toBe(ids.length)
        for (const q of course.prePostQuizQuestions) {
          const keys = q.options.map((o) => o.key)
          expect(new Set(keys).size, `${q.id} duplicate keys`).toBe(keys.length)
          expect(keys.includes(q.correctAnswer), `${q.id} correctAnswer not an option`).toBe(true)
          expect(VALID.has(q.prePostMapping), `${q.id} bad mapping`).toBe(true)
        }
      })
      it('every parallel pair has exactly one pre and one post', () => {
        const groups = new Map<string, { pre: number; post: number }>()
        for (const q of course.prePostQuizQuestions) {
          if (q.prePostMapping !== 'parallel-pre' && q.prePostMapping !== 'parallel-post') continue
          const pid = q.parallelId ?? q.id
          const g = groups.get(pid) ?? { pre: 0, post: 0 }
          if (q.prePostMapping === 'parallel-pre') g.pre++
          else g.post++
          groups.set(pid, g)
        }
        for (const [pid, g] of groups) {
          expect(g.pre, `parallel pair ${pid} pre count`).toBe(1)
          expect(g.post, `parallel pair ${pid} post count`).toBe(1)
        }
      })

      // ── Psychometric / effectiveness-evidence invariants ──────────────────
      it('every domain is matched: at least one pre AND one post item', () => {
        const byDomain = new Map<string, { pre: number; post: number }>()
        for (const q of course.prePostQuizQuestions) {
          const d = byDomain.get(q.domain) ?? { pre: 0, post: 0 }
          if (q.prePostMapping === 'parallel-pre' || q.prePostMapping === 'identical' || q.prePostMapping === 'pre-only') d.pre++
          if (q.prePostMapping === 'parallel-post' || q.prePostMapping === 'identical' || q.prePostMapping === 'post-only') d.post++
          byDomain.set(q.domain, d)
        }
        for (const [domain, d] of byDomain) {
          expect(d.pre, `domain ${domain} has no pre item`).toBeGreaterThan(0)
          expect(d.post, `domain ${domain} has no post item`).toBeGreaterThan(0)
        }
      })

      // Every confidence-survey domain must be backed by a knowledge item, so the
      // per-domain research export / growth report can join confidence↔knowledge
      // by domain without silently dropping a self-efficacy axis.
      it('every confidence-survey domain is covered by the knowledge instrument', () => {
        const quizDomains = new Set(course.prePostQuizQuestions.map((q) => q.domain))
        for (const s of course.confidenceStatements) {
          expect(
            quizDomains.has(s.domain),
            `confidence domain "${s.domain}" has no matched pre/post quiz item`,
          ).toBe(true)
        }
      })

      it('confidence statements pair 1:1 with knowledge domains (same domain ids)', () => {
        const knowledgeDomains = new Set(course.prePostQuizQuestions.map((q) => q.domain))
        const confDomains = course.confidenceStatements.map((s) => s.domain)
        // Each confidence domain must be a real knowledge domain, and no duplicates.
        expect(new Set(confDomains).size, 'duplicate confidence domains').toBe(confDomains.length)
        for (const d of confDomains) {
          expect(knowledgeDomains.has(d), `confidence domain "${d}" has no matching knowledge items`).toBe(true)
        }
        // And every knowledge domain has a confidence statement (full coverage).
        for (const d of knowledgeDomains) {
          expect(confDomains.includes(d), `knowledge domain "${d}" has no confidence statement`).toBe(true)
        }
      })

      it('no answer-key position dominates either form (guards against test-wiseness)', () => {
        const dist = (mapping: string) => {
          const counts: Record<string, number> = {}
          let n = 0
          for (const q of course.prePostQuizQuestions) {
            if (q.prePostMapping !== mapping) continue
            counts[q.correctAnswer] = (counts[q.correctAnswer] ?? 0) + 1
            n++
          }
          return { max: Math.max(0, ...Object.values(counts)), n }
        }
        for (const mapping of ['parallel-pre', 'parallel-post']) {
          const { max, n } = dist(mapping)
          if (n >= 5) {
            // No single letter may hold more than 50% of the keyed answers.
            expect(max / n, `${course.id} ${mapping} key skew`).toBeLessThanOrEqual(0.5)
          }
        }
      })

      it('items carry blueprint traceability (real moduleId) and no negative stems', () => {
        const moduleIds = new Set(course.modules.map((m) => m.id))
        for (const q of course.prePostQuizQuestions) {
          if (q.moduleId) {
            expect(moduleIds.has(q.moduleId), `${q.id} moduleId "${q.moduleId}" is not a real module`).toBe(true)
          }
          // Negatively-worded stems ("EXCEPT", "NOT") are a flagged item-writing flaw.
          expect(/\bEXCEPT\b|\bNOT\b/.test(q.stem), `${q.id} has a negatively-worded stem`).toBe(false)
        }
      })
    })
  }
})

// ── Flashcards (both courses, merged by module id) ─────────────────────────
describe('flashcards', () => {
  const knownModuleIds = new Set(courseRegistry.flatMap((c) => c.modules.map((m) => m.id)))
  it('every flashcard key is a real module id', () => {
    for (const key of Object.keys(moduleFlashcards)) {
      expect(knownModuleIds.has(key), `unknown flashcard key: ${key}`).toBe(true)
    }
  })
  it('every card has a non-empty question and answer', () => {
    for (const [mod, topics] of Object.entries(moduleFlashcards)) {
      for (const t of topics) {
        for (const card of t.cards) {
          expect(card.question.trim().length, `${mod} empty question`).toBeGreaterThan(0)
          expect(card.answer.trim().length, `${mod} empty answer`).toBeGreaterThan(0)
        }
      }
    }
  })

  const allFlashcardIds = Object.values(moduleFlashcards).flatMap((topics) =>
    topics.flatMap((t) => t.cards.map((c) => c.id)),
  )

  it('every card has a unique fc- id (globally unique across both files)', () => {
    for (const [mod, topics] of Object.entries(moduleFlashcards)) {
      for (const t of topics) {
        for (const card of t.cards) {
          expect(card.id, `${mod} card missing id`).toMatch(/^fc-/)
        }
      }
    }
    expect(new Set(allFlashcardIds).size, 'duplicate flashcard ids').toBe(allFlashcardIds.length)
  })

  it('no flashcard id collides with any module-quiz id', () => {
    const quizIds = new Set(Object.values(moduleQuizzes).flatMap((qs) => qs.map((q) => q.id)))
    for (const id of allFlashcardIds) {
      expect(quizIds.has(id), `flashcard id collides with module-quiz id: ${id}`).toBe(false)
    }
  })
})

// ── Unified review registry (module quizzes + workstation + flashcards + pre/post)
describe('review registry', () => {
  it('every entry has >=2 options with a valid correctAnswer key, OR a flashcard', () => {
    for (const [id, q] of Object.entries(reviewQuestionById)) {
      if (q.flashcard) {
        expect(q.flashcard.front.trim().length, `${id} empty flashcard front`).toBeGreaterThan(0)
        expect(q.flashcard.back.trim().length, `${id} empty flashcard back`).toBeGreaterThan(0)
        continue
      }
      expect(q.options.length, `${id} option count`).toBeGreaterThanOrEqual(2)
      const keys = q.options.map((o) => o.key)
      expect(keys.includes(q.correctAnswer), `${id} correctAnswer not an option`).toBe(true)
    }
  })

  it('image-anchored CAQ items are well-formed (anchor slice in range, 4 unique options, valid answer)', () => {
    const banks: [string, typeof kneeImageCaq][] = [
      ['knee', kneeImageCaq],
      ['shoulder', shoulderImageCaq],
      ['hip', hipImageCaq],
    ]
    const ids: string[] = []
    for (const [region, bank] of banks) {
      for (const q of bank) {
        ids.push(q.id)
        expect(q.count, `${region}/${q.id} count`).toBeGreaterThan(0)
        expect(q.startIndex, `${region}/${q.id} startIndex >= 0`).toBeGreaterThanOrEqual(0)
        expect(q.startIndex, `${region}/${q.id} startIndex < count`).toBeLessThan(q.count)
        expect(q.options.length, `${region}/${q.id} option count`).toBe(4)
        expect(new Set(q.options).size, `${region}/${q.id} duplicate options`).toBe(4)
        expect(q.answer, `${region}/${q.id} answer in range`).toBeGreaterThanOrEqual(0)
        expect(q.answer, `${region}/${q.id} answer in range`).toBeLessThan(q.options.length)
        expect(q.vignette.trim().length, `${region}/${q.id} empty vignette`).toBeGreaterThan(0)
        expect(q.dir.startsWith('/images/teaching/stacks/'), `${region}/${q.id} bad dir`).toBe(true)
      }
    }
    expect(new Set(ids).size, 'duplicate imageCaq ids').toBe(ids.length)
  })

  it('key count equals the sum of its sources (no silent overwrite collisions)', () => {
    const moduleQuizCount = Object.values(moduleQuizzes).reduce((n, qs) => n + qs.length, 0)
    const flashcardCount = Object.values(moduleFlashcards).reduce(
      (n, topics) => n + topics.reduce((m, t) => m + t.cards.length, 0),
      0,
    )
    const prePostCount =
      kneePrePostQuizQuestions.length + shoulderPrePostQuizQuestions.length + hipPrePostQuizQuestions.length + elbowPrePostQuizQuestions.length
    const workstationCount =
      Object.values(normalKneeLearn).reduce((n, p) => n + p.quiz.length, 0) +
      Object.values(normalShoulderLearn).reduce((n, p) => n + p.quiz.length, 0) +
      Object.values(normalHipLearn).reduce((n, p) => n + p.quiz.length, 0) +
      Object.values(normalElbowLearn).reduce((n, p) => n + p.quiz.length, 0) +
      advancedChallenge.length +
      shoulderAdvanced.length +
      hipAdvanced.length +
      elbowAdvanced.length +
      kneeImageCaq.length +
      shoulderImageCaq.length +
      hipImageCaq.length +
      elbowImageCaq.length

    const expected =
      moduleQuizCount + workstationCount + flashcardCount + prePostCount
    expect(Object.keys(reviewQuestionById).length, 'registry key collision').toBe(expected)
  })

  it('pre/post entries are keyed by course-namespaced prepost ids', () => {
    for (const [courseId, bank] of [
      ['knee-mri', kneePrePostQuizQuestions],
      ['shoulder-mri', shoulderPrePostQuizQuestions],
      ['hip-mri', hipPrePostQuizQuestions],
      ['elbow-mri', elbowPrePostQuizQuestions],
    ] as const) {
      for (const q of bank) {
        const key = workstationReviewId(courseId, `prepost-${q.id}`)
        expect(reviewQuestionById[key], `missing pre/post entry ${key}`).toBeTruthy()
        expect(reviewQuestionById[key].source).toBe('Pre/Post assessment')
      }
    }
  })
})

// ── Module interactive blocks (meniscus + cartilage) ───────────────────────
describe('module interactive blocks', () => {
  const knownModuleIds = new Set(courseRegistry.flatMap((c) => c.modules.map((m) => m.id)))

  it('every block is well-formed (real module, valid topic, in-range markers/slices)', () => {
    for (const [moduleId, byTopic] of Object.entries(moduleInteractives)) {
      expect(knownModuleIds.has(moduleId), `unknown interactive module id: ${moduleId}`).toBe(true)
      const content = moduleContentById[moduleId]
      expect(content, `no content for module ${moduleId}`).toBeTruthy()
      if (!content) continue
      const topicCount = content.topics.length
      for (const [topicIdxStr, blocks] of Object.entries(byTopic)) {
        const ti = Number(topicIdxStr)
        expect(ti, `${moduleId} topic index >= 0`).toBeGreaterThanOrEqual(0)
        expect(ti, `${moduleId} topic index < ${topicCount}`).toBeLessThan(topicCount)
        for (const block of blocks) {
          expect(block.title.trim().length, `${moduleId}[${ti}] empty title`).toBeGreaterThan(0)
          if (block.kind === 'scroll-drill') {
            const n = sliceCount(folderOf(block.dir))
            expect(block.count, `${moduleId}[${ti}] scroll-drill count matches stack`).toBe(n)
            expect(block.startIndex ?? 0, `${moduleId}[${ti}] startIndex < ${n}`).toBeLessThan(n)
            expect(block.teaching.trim().length, `${moduleId}[${ti}] empty teaching`).toBeGreaterThan(0)
          } else if (block.kind === 'shape-shift') {
            expect(block.views.length, `${moduleId}[${ti}] needs >=2 views`).toBeGreaterThan(1)
            for (const v of block.views) {
              const n = sliceCount(folderOf(v.dir))
              expect(v.sliceIndex, `shape-shift sliceIndex >= 0`).toBeGreaterThanOrEqual(0)
              expect(v.sliceIndex, `shape-shift sliceIndex < ${n}`).toBeLessThan(n)
              expect(inRange(v.marker.x) && inRange(v.marker.y), `shape-shift marker`).toBe(true)
            }
          } else if (block.kind === 'spot-quiz') {
            const n = sliceCount(folderOf(block.dir))
            for (const q of block.items) {
              expect(q.options.length, `${q.id} option count`).toBe(4)
              expect(new Set(q.options).size, `${q.id} duplicate options`).toBe(4)
              expect(q.answer, `${q.id} answer >= 0`).toBeGreaterThanOrEqual(0)
              expect(q.answer, `${q.id} answer < 4`).toBeLessThan(4)
              expect(q.prompt.trim().length, `${q.id} empty prompt`).toBeGreaterThan(0)
              expect(q.explanation.trim().length, `${q.id} empty explanation`).toBeGreaterThan(0)
              expect(inRange(q.marker.x) && inRange(q.marker.y), `${q.id} marker`).toBe(true)
              expect(q.sliceIndex, `${q.id} sliceIndex < ${n}`).toBeLessThan(n)
            }
          } else if (block.kind === 'annotate') {
            const n = sliceCount(folderOf(block.dir))
            expect(block.sliceIndex, `${moduleId}[${ti}] annotate sliceIndex < ${n}`).toBeLessThan(n)
            for (const m of block.markers) {
              expect(inRange(m.x) && inRange(m.y), `${moduleId}[${ti}] annotate marker`).toBe(true)
            }
          }
        }
      }
    }
  })

  it('spot-quiz item ids are unique across all interactive blocks', () => {
    const ids: string[] = []
    for (const byTopic of Object.values(moduleInteractives)) {
      for (const blocks of Object.values(byTopic)) {
        for (const block of blocks) {
          if (block.kind === 'spot-quiz') ids.push(...block.items.map((q) => q.id))
        }
      }
    }
    expect(new Set(ids).size, 'duplicate interactive quiz ids').toBe(ids.length)
  })
})
