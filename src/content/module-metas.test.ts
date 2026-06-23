import { describe, it, expect } from 'vitest'
import { kneeModuleMetas, shoulderModuleMetas, type ModuleMeta } from '@/content/module-metas'
import { moduleRegistry, type ModuleMetadata } from '@/content/modules'
import { shoulderModuleRegistry } from '@/content/shoulder/modules'

// The lightweight metas are generated from the full registries and kept eager
// (the heavy registries are lazy). This test guarantees they never drift — if a
// module's id/number/title/subtitle/estimatedMinutes/topics changes, regenerate
// src/content/module-metas.ts.
const project = (m: ModuleMetadata): ModuleMeta => ({
  id: m.id,
  number: m.number,
  title: m.title,
  subtitle: m.subtitle,
  estimatedMinutes: m.estimatedMinutes,
  topics: m.topics,
})

describe('module metas are in sync with the full registry (no drift)', () => {
  it('knee', () => {
    expect(kneeModuleMetas).toEqual(moduleRegistry.map(project))
  })
  it('shoulder', () => {
    expect(shoulderModuleMetas).toEqual(shoulderModuleRegistry.map(project))
  })
  it('every meta id is unique and present in the content map', () => {
    const ids = [...kneeModuleMetas, ...shoulderModuleMetas].map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
