import type { CampusUser } from "@/types";
import type { Application } from "@/lib/applications";
import type { Enrollment } from "@/lib/firestoreLearning";

export type PlacementStage =
  | "Not Assessed"
  | "Foundation"
  | "Skill Building"
  | "Placement Ready"
  | "Interview Ready"
  | "Placed";

export type PlacementReadiness = {
  score: number;
  stage: PlacementStage;

  skillScore: number;
  profileScore: number;
  learningScore: number;
  applicationScore: number;

  strengths: string[];
  gaps: string[];
  recommendations: string[];
};

function average(values: number[]) {
  if (!values.length) return 0;

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) /
      values.length
  );
}

export function calculatePlacementReadiness(
  profile: CampusUser,
  applications: Application[],
  enrollments: Enrollment[]
): PlacementReadiness {
  const skillValues = Object.values(
    profile.skillScores || {}
  );

  const skillScore = average(skillValues);

  const profileFields = [
    profile.name,
    profile.email,
    profile.college,
    profile.degree,
    profile.branch,
    profile.year,
    profile.careerRole,
    profile.resumeUrl,
  ];

  const completedProfileFields = profileFields.filter(
    Boolean
  ).length;

  const profileScore = Math.round(
    (completedProfileFields / profileFields.length) * 100
  );

  const learningScore =
    enrollments.length > 0
      ? average(
          enrollments.map(
            (enrollment) => enrollment.progress || 0
          )
        )
      : 0;

  let applicationScore = 0;

  if (applications.length > 0) {
    const successfulApplications = applications.filter(
      (application) =>
        application.status === "Shortlisted" ||
        application.status === "Interview Scheduled" ||
        application.status === "Interview Completed" ||
        application.status === "Selected" ||
        application.status === "Offer Released" ||
        application.status === "Enrolled" ||
        application.status === "Completed"
    ).length;

    applicationScore = Math.min(
      100,
      Math.round(
        (successfulApplications / applications.length) * 100
      ) + Math.min(applications.length * 5, 30)
    );
  }

  const selectedApplication = applications.some(
    (application) =>
      application.status === "Selected" ||
      application.status === "Offer Released" ||
      application.status === "Enrolled" ||
      application.status === "Completed"
  );

  if (selectedApplication) {
    return {
      score: 100,
      stage: "Placed",
      skillScore,
      profileScore,
      learningScore,
      applicationScore,
      strengths: [
        "Successful recruitment outcome",
        "Demonstrated industry readiness",
      ],
      gaps: [],
      recommendations: [
        "Complete onboarding and maintain your Skill Passport.",
        "Continue building advanced industry skills.",
      ],
    };
  }

  const score = Math.round(
    skillScore * 0.5 +
      profileScore * 0.15 +
      learningScore * 0.2 +
      applicationScore * 0.15
  );

  let stage: PlacementStage;

  if (skillValues.length === 0) {
    stage = "Not Assessed";
  } else if (score >= 80 && applicationScore >= 40) {
    stage = "Interview Ready";
  } else if (score >= 75) {
    stage = "Placement Ready";
  } else if (score >= 55) {
    stage = "Skill Building";
  } else {
    stage = "Foundation";
  }

  const strengths = Object.entries(
    profile.skillScores || {}
  )
    .filter(([, value]) => value >= 75)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([skill]) => skill);

  const gaps = Object.entries(
    profile.skillScores || {}
  )
    .filter(([, value]) => value < 70)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  const recommendations: string[] = [];

  if (skillScore < 70) {
    recommendations.push(
      "Improve your core technical skills before applying broadly."
    );
  }

  if (profileScore < 80) {
    recommendations.push(
      "Complete your profile and upload a strong resume."
    );
  }

  if (learningScore < 60) {
    recommendations.push(
      "Complete recommended learning programs to close skill gaps."
    );
  }

  if (applications.length === 0) {
    recommendations.push(
      "Start applying to opportunities matching your strongest skills."
    );
  }

  if (
    applications.length > 0 &&
    applicationScore < 40
  ) {
    recommendations.push(
      "Review job requirements and improve missing skills before your next applications."
    );
  }

  if (score >= 75) {
    recommendations.push(
      "Practice interviews and focus on high-match opportunities."
    );
  }

  return {
    score,
    stage,
    skillScore,
    profileScore,
    learningScore,
    applicationScore,
    strengths,
    gaps,
    recommendations,
  };
}
