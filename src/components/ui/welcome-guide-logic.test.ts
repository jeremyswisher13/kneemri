import { describe, it, expect } from 'vitest'
import { getCourseById } from '@/content/courses'
import {
  buildStepData,
  getStepStatuses,
  getStepSubtext,
  stepDone,
  type WelcomeGuideProgress,
} from './welcome-guide-logic'

const knee = getCourseById('knee-mri')
const shoulder = getCourseById('shoulder-mri')
const hip = getCourseById('hip-mri')
const elbow = getCourseById('elbow-mri')

function progress(overrides: Partial<WelcomeGuideProgress> = {}): WelcomeGuideProgress {
  return {
    preAssessmentComplete: false,
    modulesCompleted: 0,
    totalModules: 5,
    casesCompleted: 0,
    totalCases: 5,
    normalMriComplete: false,
    postAssessmentUnlocked: false,
    postAssessmentComplete: false,
    ...overrides,
  }
}

describe('buildStepData order', () => {
  it('knee puts the Normal-MRI workstation before the modules', () => {
    expect(buildStepData(knee).map((s) => s.kind)).toEqual(['pre', 'normal', 'modules', 'post'])
  })
  it('shoulder leads with the workstation, then modules, then required cases', () => {
    expect(buildStepData(shoulder).map((s) => s.kind)).toEqual([
      'pre',
      'normal',
      'modules',
      'cases',
      'post',
    ])
  })
  it('hip and elbow include their normal-MRI workstations', () => {
    expect(buildStepData(hip).map((s) => s.kind)).toEqual([
      'pre',
      'normal',
      'modules',
      'cases',
      'post',
    ])
    expect(buildStepData(elbow).map((s) => s.kind)).toEqual([
      'pre',
      'normal',
      'modules',
      'cases',
      'post',
    ])
  })
})

describe('buildStepData links are course-scoped', () => {
  it('knee (default course) uses namespaced paths like every course', () => {
    const byKind = Object.fromEntries(buildStepData(knee).map((s) => [s.kind, s.link]))
    expect(byKind.pre).toBe('/courses/knee-mri/pre-assessment')
    expect(byKind.normal).toBe('/courses/knee-mri/normal-knee-mri')
    expect(byKind.modules).toBe('/courses/knee-mri/modules')
    expect(byKind.post).toBe('/courses/knee-mri/post-assessment')
  })
  it('shoulder uses namespaced paths', () => {
    const byKind = Object.fromEntries(buildStepData(shoulder).map((s) => [s.kind, s.link]))
    expect(byKind.pre).toBe('/courses/shoulder-mri/pre-assessment')
    expect(byKind.normal).toBe('/courses/shoulder-mri/normal-shoulder-mri')
    expect(byKind.modules).toBe('/courses/shoulder-mri/modules')
    expect(byKind.cases).toBe('/courses/shoulder-mri/cases')
  })
  it('elbow workstation link uses the elbow route, not the shoulder fallback', () => {
    const byKind = Object.fromEntries(buildStepData(elbow).map((s) => [s.kind, s.link]))
    expect(byKind.normal).toBe('/courses/elbow-mri/normal-elbow-mri')
  })
})

describe('buildStepData copy is course-aware', () => {
  it('uses the active course Normal MRI title in post-assessment guidance', () => {
    const kneePost = buildStepData(knee).find((s) => s.kind === 'post')
    const shoulderPost = buildStepData(shoulder).find((s) => s.kind === 'post')
    const hipPost = buildStepData(hip).find((s) => s.kind === 'post')
    const elbowPost = buildStepData(elbow).find((s) => s.kind === 'post')

    expect(kneePost?.description).toContain('Normal Knee MRI')
    expect(shoulderPost?.description).toContain('Normal Shoulder MRI')
    expect(hipPost?.description).toContain('Normal Hip MRI')
    expect(elbowPost?.description).toContain('Normal Elbow MRI')
  })
})

describe('stepDone', () => {
  it('reflects each kind’s completion field', () => {
    const p = progress({ preAssessmentComplete: true, modulesCompleted: 5, totalModules: 5 })
    expect(stepDone('pre', p)).toBe(true)
    expect(stepDone('modules', p)).toBe(true)
    expect(stepDone('normal', p)).toBe(false)
    expect(stepDone('cases', progress({ casesCompleted: 5, totalCases: 5 }))).toBe(true)
    expect(stepDone('cases', progress({ casesCompleted: 2, totalCases: 5 }))).toBe(false)
  })
})

describe('getStepStatuses (order-driven walk)', () => {
  const steps = buildStepData(knee)

  it('fresh progress: only the first step is current', () => {
    expect(getStepStatuses(steps, progress())).toEqual(['current', 'future', 'future', 'future'])
  })
  it('pre done → normal (workstation) becomes current', () => {
    const s = getStepStatuses(steps, progress({ preAssessmentComplete: true }))
    expect(s).toEqual(['complete', 'current', 'future', 'future'])
  })
  it('pre + normal done → modules current', () => {
    const s = getStepStatuses(
      steps,
      progress({ preAssessmentComplete: true, normalMriComplete: true }),
    )
    expect(s).toEqual(['complete', 'complete', 'current', 'future'])
  })
  it('everything but post done → post current', () => {
    const s = getStepStatuses(
      steps,
      progress({
        preAssessmentComplete: true,
        normalMriComplete: true,
        modulesCompleted: 5,
        totalModules: 5,
      }),
    )
    expect(s).toEqual(['complete', 'complete', 'complete', 'current'])
  })
  it('a later step done out of order does not steal "current" from an earlier undone step', () => {
    // post complete but pre not: pre stays current, post shows complete.
    const s = getStepStatuses(steps, progress({ postAssessmentComplete: true }))
    expect(s).toEqual(['current', 'future', 'future', 'complete'])
  })
})

describe('getStepSubtext', () => {
  it('complete → "Complete"; future → null', () => {
    expect(getStepSubtext('modules', 'complete', progress())).toBe('Complete')
    expect(getStepSubtext('modules', 'future', progress())).toBeNull()
  })
  it('current subtext is kind-specific', () => {
    expect(getStepSubtext('pre', 'current', progress())).toBe('Start here')
    expect(getStepSubtext('normal', 'current', progress())).toMatch(/knowledge check/i)
    expect(getStepSubtext('modules', 'current', progress({ modulesCompleted: 2 }))).toBe(
      'Continue with Module 3',
    )
    expect(getStepSubtext('post', 'current', progress({ postAssessmentUnlocked: true }))).toBe(
      'Ready to take',
    )
    expect(getStepSubtext('post', 'current', progress({ postAssessmentUnlocked: false }))).toMatch(
      /unlock/i,
    )
  })
})
