import { describe, it, expect } from 'vitest'
import { kneeModuleMetas, shoulderModuleMetas, hipModuleMetas, elbowModuleMetas, type ModuleMeta } from '@/content/module-metas'
import { moduleRegistry, type ModuleMetadata } from '@/content/modules'
import { shoulderModuleRegistry } from '@/content/shoulder/modules'
import { hipModuleRegistry } from '@/content/hip/modules'
import { elbowModuleRegistry } from '@/content/elbow/modules'
import { moduleContentById } from '@/content/modules/content-by-id'

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
  it('hip', () => {
    expect(hipModuleMetas).toEqual(hipModuleRegistry.map(project))
  })
  it('elbow', () => {
    expect(elbowModuleMetas).toEqual(elbowModuleRegistry.map(project))
  })
  it('every meta id is unique and present in the content map', () => {
    const ids = [...kneeModuleMetas, ...shoulderModuleMetas, ...hipModuleMetas, ...elbowModuleMetas].map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(moduleContentById[id], `missing content for module ${id}`).toBeTruthy()
    }
  })
})
