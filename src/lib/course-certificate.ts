import type { CourseId } from "@/content/courses";

export interface CourseCertificateFields {
  sentField: string;
  sentAtField: string;
}

const CERTIFICATE_FIELDS: Record<CourseId, CourseCertificateFields> = {
  "knee-mri": {
    sentField: "certificateSent",
    sentAtField: "certificateSentAt",
  },
  "shoulder-mri": {
    sentField: "certificateSentShoulder",
    sentAtField: "certificateSentAtShoulder",
  },
  "hip-mri": {
    sentField: "certificateSentHip",
    sentAtField: "certificateSentAtHip",
  },
  "elbow-mri": {
    sentField: "certificateSentElbow",
    sentAtField: "certificateSentAtElbow",
  },
};

export function certificateFieldsForCourse(courseId: CourseId): CourseCertificateFields {
  return CERTIFICATE_FIELDS[courseId];
}
