import CourseReference from "@/components/ui/CourseReference";
import { useActiveCourse } from "@/hooks/useActiveCourse";

export default function ReferencePage() {
  const activeCourse = useActiveCourse();
  const region = activeCourse.bodyRegion;
  const isKnee = region === "knee";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Quick Reference</h1>
      <p className="mt-1 mb-6 text-gray-500">
        {isKnee
          ? "Visual atlas, anatomy guide, MRI measurements, and grading scales."
          : "Normal anatomy, planes and sequences, key measurements, and grading scales."}
      </p>
      <CourseReference region={region} />
    </div>
  );
}
