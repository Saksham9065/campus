export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Interview Completed"
  | "Selected"
  | "Offer Released"
  | "Enrolled"
  | "Completed"
  | "Rejected";

export type Application = {
  id: string;

  studentId: string;
  studentName: string;
  studentEmail: string;

  opportunityId: string;
  opportunityTitle: string;
  company: string;

  resumeUrl?: string;
  resumeName?: string;

  coverLetter?: string;

  status: ApplicationStatus;

  interviewDate?: string;
  interviewTime?: string;
  interviewMode?: "Online" | "Offline";
  interviewLink?: string;
  interviewNotes?: string;

  recruiterNotes?: string;
  rejectedReason?: string;

  appliedAt?: unknown;
  updatedAt?: unknown;
};

export const applicationStatuses: ApplicationStatus[] = [
  "Applied",
  "Screening",
  "Shortlisted",
  "Interview Scheduled",
  "Interview Completed",
  "Selected",
  "Offer Released",
  "Enrolled",
  "Completed",
];

export function getStatusIndex(
  status: ApplicationStatus
) {
  if (status === "Rejected") {
    return -1;
  }

  return applicationStatuses.indexOf(status);
}

export function canMoveToStatus(
  current: ApplicationStatus,
  next: ApplicationStatus
) {
  if (current === "Rejected") {
    return false;
  }

  if (next === "Rejected") {
    return true;
  }

  const currentIndex =
    getStatusIndex(current);

  const nextIndex =
    getStatusIndex(next);

  return nextIndex === currentIndex + 1;
}

export function getStatusDescription(
  status: ApplicationStatus
) {
  const descriptions: Record<
    ApplicationStatus,
    string
  > = {
    Applied:
      "Your application has been submitted successfully.",

    Screening:
      "The company is reviewing your profile and application.",

    Shortlisted:
      "You have been shortlisted for the next stage.",

    "Interview Scheduled":
      "An interview has been scheduled.",

    "Interview Completed":
      "Your interview has been completed and is under review.",

    Selected:
      "You have been selected for this opportunity.",

    "Offer Released":
      "The company has released an offer.",

    Enrolled:
      "You have enrolled in the opportunity.",

    Completed:
      "The opportunity has been completed.",

    Rejected:
      "The application was not selected for the next stage.",
  };

  return descriptions[status];
}

export function getStudentMessage(
  status: ApplicationStatus
) {
  return getStatusDescription(status);
}
