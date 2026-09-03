import type { SkillResult } from "@/lib/skillEngine";

export function getCourseImprovement(
  level: SkillResult["level"]
) {
  if (level === "Beginner") return 8;
  if (level === "Intermediate") return 12;

  return 15;
}

export function improveSkillsFromCourse(
  currentScores: Record<string, number>,
  courseSkills: string[]
) {
  const updated = {
    ...currentScores,
  };

  for (const courseSkill of courseSkills) {
    const existingEntry =
      Object.keys(updated).find(
        (skill) =>
          skill.toLowerCase() ===
          courseSkill.toLowerCase()
      );

    if (!existingEntry) {
      updated[courseSkill] = 8;
      continue;
    }

    const currentScore =
      updated[existingEntry];

    const improvement =
      currentScore < 60
        ? 8
        : currentScore < 80
        ? 12
        : 15;

    updated[existingEntry] = Math.min(
      100,
      currentScore + improvement
    );
  }

  return updated;
}

export function calculateLearningProgress(
  enrollments: {
    progress: number;
  }[]
) {
  if (!enrollments.length) return 0;

  const total = enrollments.reduce(
    (sum, enrollment) =>
      sum + enrollment.progress,
    0
  );

  return Math.round(
    total / enrollments.length
  );
}
