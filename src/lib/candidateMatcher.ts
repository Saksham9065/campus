import { calculateJobMatch, type JobMatchResult, type JobOpportunity } from "@/lib/jobMatcher";
import type { CampusUser } from "@/types";

export type RankedCandidate = {
  studentId: string;
  studentName: string;
  studentEmail: string;

  applicationId: string;
  applicationStatus: string;

  skills: Record<string, number>;
  readiness: number;

  match: JobMatchResult;

  resumeUrl?: string;
  resumeName?: string;
  coverLetter?: string;
};

export function rankCandidates(
  candidates: RankedCandidate[]
) {
  return [...candidates].sort((a, b) => {
    const scoreA =
      a.match.match * 0.7 +
      a.readiness * 0.3 +
      (a.applicationStatus === "Shortlisted" ? 5 : 0);

    const scoreB =
      b.match.match * 0.7 +
      b.readiness * 0.3 +
      (b.applicationStatus === "Shortlisted" ? 5 : 0);

    return scoreB - scoreA;
  });
}

export function createCandidateRanking(
  student: CampusUser,
  application: {
    id: string;
    studentName: string;
    studentEmail: string;
    status: string;
    resumeUrl?: string;
    resumeName?: string;
    coverLetter?: string;
  },
  opportunity: JobOpportunity
): RankedCandidate {
  const skillScores = student.skillScores || {};

  const match = calculateJobMatch(
    skillScores,
    opportunity.requiredSkills,
    opportunity.preferredSkills
  );

  return {
    studentId: student.uid,
    studentName: application.studentName,
    studentEmail: application.studentEmail,

    applicationId: application.id,
    applicationStatus: application.status,

    skills: skillScores,
    readiness: student.readiness || 0,

    match,

    resumeUrl: application.resumeUrl,
    resumeName: application.resumeName,
    coverLetter: application.coverLetter,
  };
}
