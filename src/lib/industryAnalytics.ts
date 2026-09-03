import {
  getOpportunityApplications,
} from "@/lib/firestoreApplications";

import type { JobOpportunity } from "@/lib/jobMatcher";

export type IndustryAnalytics = {
  totalApplicants: number;
  screening: number;
  shortlisted: number;
  interviews: number;
  selected: number;
  rejected: number;
};

export async function calculateIndustryAnalytics(
  opportunities: JobOpportunity[]
): Promise<IndustryAnalytics> {
  let totalApplicants = 0;
  let screening = 0;
  let shortlisted = 0;
  let interviews = 0;
  let selected = 0;
  let rejected = 0;

  for (const opportunity of opportunities) {
    if (!opportunity.id) continue;

    const applications =
      await getOpportunityApplications(
        opportunity.id
      );

    totalApplicants += applications.length;

    screening += applications.filter(
      (item) =>
        item.status === "Screening"
    ).length;

    shortlisted += applications.filter(
      (item) =>
        item.status === "Shortlisted"
    ).length;

    interviews += applications.filter(
      (item) =>
        item.status ===
        "Interview Scheduled"
    ).length;

    selected += applications.filter(
      (item) =>
        item.status === "Selected"
    ).length;

    rejected += applications.filter(
      (item) =>
        item.status === "Rejected"
    ).length;
  }

  return {
    totalApplicants,
    screening,
    shortlisted,
    interviews,
    selected,
    rejected,
  };
}
