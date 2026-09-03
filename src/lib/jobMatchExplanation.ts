import type { JobMatchResult } from "@/lib/jobMatcher";

export function getMatchLabel(
  match: number
) {
  if (match >= 90) return "Excellent Match";
  if (match >= 80) return "Strong Match";
  if (match >= 70) return "Good Match";
  if (match >= 50) return "Potential Match";

  return "Needs Improvement";
}

export function getMatchExplanation(
  result: JobMatchResult
) {
  const parts: string[] = [];

  if (result.matchedSkills.length) {
    parts.push(
      `${result.matchedSkills.length} required skill${
        result.matchedSkills.length > 1
          ? "s"
          : ""
      } matched`
    );
  }

  if (result.partialSkills.length) {
    parts.push(
      `${result.partialSkills.length} skill${
        result.partialSkills.length > 1
          ? "s"
          : ""
      } developing`
    );
  }

  if (result.missingSkills.length) {
    parts.push(
      `${result.missingSkills.length} skill${
        result.missingSkills.length > 1
          ? "s"
          : ""
      } to improve`
    );
  }

  return parts.join(" • ");
}
