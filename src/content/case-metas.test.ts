import { describe, it, expect } from 'vitest'
import { kneeCaseMetas, shoulderCaseMetas, type CaseMeta } from '@/content/case-metas'
import { caseRegistry, type CaseMetadata } from '@/content/cases'
import { shoulderCaseRegistry } from '@/content/shoulder/cases'
import { caseContentById } from '@/content/cases/content-by-id'

// The lightweight case metas are generated from the full registries and kept
// eager (the heavy case bodies are lazy). This test guarantees they never drift.
const project = (c: CaseMetadata): CaseMeta => ({
  id: c.id,
  title: c.title,
  difficulty: c.difficulty,
  tier: c.tier,
  residentVisible: c.residentVisible,
  clinicalScenario: c.clinicalScenario,
  keyDiagnoses: c.keyDiagnoses,
  tags: c.tags,
})

describe('case metas are in sync with the full registry (no drift)', () => {
  it('knee', () => {
    expect(kneeCaseMetas).toEqual(caseRegistry.map(project))
  })
  it('shoulder', () => {
    expect(shoulderCaseMetas).toEqual(shoulderCaseRegistry.map(project))
  })
  it('every meta id resolves in the lazy content map', () => {
    for (const c of [...kneeCaseMetas, ...shoulderCaseMetas]) {
      expect(caseContentById[c.id], `missing content for case ${c.id}`).toBeTruthy()
    }
  })
})
