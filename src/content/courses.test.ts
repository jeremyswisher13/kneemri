import { describe, it, expect } from 'vitest'
import {
  courseRegistry,
  defaultCourse,
  getCourseById,
  getCourseBasePath,
  coursePath,
  getVisibleCoreCases,
  getVisibleAdvancedCases,
  getPreQuizQuestions,
  getPostQuizQuestions,
} from '@/content/courses'

const knee = getCourseById('knee-mri')
const shoulder = getCourseById('shoulder-mri')

describe('course registry invariants', () => {
  it('knee is the default course (registry[0])', () => {
    expect(defaultCourse.id).toBe('knee-mri')
    expect(courseRegistry[0].id).toBe('knee-mri')
  })

  it('every course id is unique', () => {
    const ids = courseRegistry.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getCourseById', () => {
  it('resolves known ids', () => {
    expect(getCourseById('knee-mri').id).toBe('knee-mri')
    expect(getCourseById('shoulder-mri').id).toBe('shoulder-mri')
  })
  it('falls back to the default course for unknown / undefined', () => {
    expect(getCourseById('does-not-exist').id).toBe(defaultCourse.id)
    expect(getCourseById(undefined).id).toBe(defaultCourse.id)
  })
})

describe('getCourseBasePath', () => {
  it('is namespaced for every course (incl. the default knee course)', () => {
    // Every course now lives under /courses/:id — the app opens on a course-picker
    // home page at /, so knee no longer occupies the bare root paths.
    expect(getCourseBasePath(knee)).toBe('/courses/knee-mri')
    expect(getCourseBasePath(shoulder)).toBe('/courses/shoulder-mri')
  })
})

describe('coursePath', () => {
  it('namespaces paths for the default (knee) course too', () => {
    expect(coursePath(knee, '/')).toBe('/courses/knee-mri')
    expect(coursePath(knee)).toBe('/courses/knee-mri')
    expect(coursePath(knee, '/modules')).toBe('/courses/knee-mri/modules')
    expect(coursePath(knee, '/normal-knee-mri')).toBe('/courses/knee-mri/normal-knee-mri')
  })
  it('namespaces paths for non-default courses', () => {
    expect(coursePath(shoulder, '/')).toBe('/courses/shoulder-mri')
    expect(coursePath(shoulder, '/modules')).toBe('/courses/shoulder-mri/modules')
    expect(coursePath(shoulder, '/normal-shoulder-mri')).toBe('/courses/shoulder-mri/normal-shoulder-mri')
  })
  it('normalizes a path missing its leading slash', () => {
    expect(coursePath(shoulder, 'modules')).toBe('/courses/shoulder-mri/modules')
  })
  it('treats empty string like the course base', () => {
    expect(coursePath(knee, '')).toBe('/courses/knee-mri')
    expect(coursePath(shoulder, '')).toBe('/courses/shoulder-mri')
  })
})

describe('resident case visibility', () => {
  it('non-residents see all core/advanced cases', () => {
    expect(getVisibleCoreCases(knee, false)).toEqual(knee.coreCases)
    expect(getVisibleAdvancedCases(knee, false)).toEqual(knee.advancedCases)
  })
  it('residents see only residentVisible cases (a subset)', () => {
    const visible = getVisibleCoreCases(knee, true)
    expect(visible.length).toBeLessThanOrEqual(knee.coreCases.length)
    expect(visible.every((c) => c.residentVisible)).toBe(true)
  })
})

describe('pre/post assessment partition', () => {
  const PRE_OK = new Set(['identical', 'parallel-pre', 'pre-only'])
  const POST_OK = new Set(['identical', 'parallel-post', 'post-only'])
  for (const course of courseRegistry) {
    it(`${course.id}: pre quiz only draws pre-eligible mappings`, () => {
      const pre = getPreQuizQuestions(course)
      expect(pre.length).toBeGreaterThan(0)
      expect(pre.every((q) => PRE_OK.has(q.prePostMapping))).toBe(true)
    })
    it(`${course.id}: post quiz only draws post-eligible mappings`, () => {
      const post = getPostQuizQuestions(course)
      expect(post.length).toBeGreaterThan(0)
      expect(post.every((q) => POST_OK.has(q.prePostMapping))).toBe(true)
    })
    it(`${course.id}: every 'identical' item appears on both pre and post`, () => {
      const ident = course.prePostQuizQuestions.filter((q) => q.prePostMapping === 'identical')
      const preIds = new Set(getPreQuizQuestions(course).map((q) => q.id))
      const postIds = new Set(getPostQuizQuestions(course).map((q) => q.id))
      expect(ident.every((q) => preIds.has(q.id) && postIds.has(q.id))).toBe(true)
    })
    it(`${course.id}: parallel-pre and parallel-post counts match (balanced pairs)`, () => {
      const pre = course.prePostQuizQuestions.filter((q) => q.prePostMapping === 'parallel-pre').length
      const post = course.prePostQuizQuestions.filter((q) => q.prePostMapping === 'parallel-post').length
      expect(pre).toBe(post)
    })
  }
})
