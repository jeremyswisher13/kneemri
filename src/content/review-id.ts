/**
 * Course-namespaced review id for a workstation/advanced item. Workstation item
 * ids collide across courses (both knee and shoulder have `axi-q1`, `t1-q1`, …),
 * so review-card doc ids carry the course id. Kept in its own (dependency-free)
 * file so the workstation pages can build ids without importing the full
 * `review-registry` (which pulls in all content + module quizzes).
 */
export function workstationReviewId(courseId: string, itemId: string): string {
  return `${courseId}::${itemId}`;
}
