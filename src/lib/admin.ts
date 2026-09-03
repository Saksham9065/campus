import {
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { CampusUser } from "@/types";
import type { JobOpportunity } from "@/lib/jobMatcher";
import type { Application } from "@/lib/applications";

export type AdminAnalytics = {
  totalUsers: number;
  students: number;
  industries: number;
  academicians: number;
  institutions: number;

  totalOpportunities: number;
  activeOpportunities: number;

  totalApplications: number;
  selectedApplications: number;
  rejectedApplications: number;

  assessedStudents: number;
  placementReadyStudents: number;

  skillDistribution: {
    skill: string;
    count: number;
  }[];

  roleDistribution: {
    role: string;
    count: number;
  }[];

  placementStages: {
    stage: string;
    count: number;
  }[];
};

export async function getAllUsers(): Promise<CampusUser[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "users"),
      limit(1000)
    )
  );

  return snapshot.docs.map((item) => ({
    uid: item.id,
    ...(item.data() as Omit<CampusUser, "uid">),
  }));
}

export async function getAllOpportunities(): Promise<
  JobOpportunity[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, "opportunities"),
      limit(1000)
    )
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<JobOpportunity, "id">),
  }));
}

export async function getAllApplications(): Promise<
  Application[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, "applications"),
      limit(2000)
    )
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Application, "id">),
  }));
}

function buildSkillDistribution(
  students: CampusUser[]
) {
  const map = new Map<string, number>();

  for (const student of students) {
    for (const skill of Object.keys(
      student.skillScores || {}
    )) {
      map.set(
        skill,
        (map.get(skill) || 0) + 1
      );
    }
  }

  return Array.from(map.entries())
    .map(([skill, count]) => ({
      skill,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const [users, opportunities, applications] =
    await Promise.all([
      getAllUsers(),
      getAllOpportunities(),
      getAllApplications(),
    ]);

  const students = users.filter(
    (user) => user.role === "student"
  );

  const industries = users.filter(
    (user) => user.role === "industry"
  );

  const academicians = users.filter(
    (user) => user.role === "academia"
  );

  const institutions = users.filter(
    (user) => user.role === "institution"
  );

  const assessedStudents = students.filter(
    (student) =>
      student.readiness !== undefined ||
      student.skillScores
  );

  const placementReadyStudents =
    students.filter(
      (student) =>
        (student.readiness || 0) >= 75
    );

  return {
    totalUsers: users.length,

    students: students.length,
    industries: industries.length,
    academicians: academicians.length,
    institutions: institutions.length,

    totalOpportunities: opportunities.length,

    activeOpportunities:
      opportunities.filter(
        (opportunity) =>
          opportunity.status !== "closed"
      ).length,

    totalApplications: applications.length,

    selectedApplications:
      applications.filter(
        (application) =>
          application.status === "Selected" ||
          application.status ===
            "Offer Released" ||
          application.status === "Enrolled" ||
          application.status === "Completed"
      ).length,

    rejectedApplications:
      applications.filter(
        (application) =>
          application.status === "Rejected"
      ).length,

    assessedStudents:
      assessedStudents.length,

    placementReadyStudents:
      placementReadyStudents.length,

    skillDistribution:
      buildSkillDistribution(students),

    roleDistribution: [
      {
        role: "Students",
        count: students.length,
      },
      {
        role: "Industry",
        count: industries.length,
      },
      {
        role: "Academia",
        count: academicians.length,
      },
      {
        role: "Institutions",
        count: institutions.length,
      },
    ],

    placementStages: (() => {
      const stageMap = new Map<string, number>();

      for (const student of students) {
        const readiness = student.readiness || 0;
        const hasSkills =
          Object.keys(student.skillScores || {}).length > 0;
        const selected = applications.some(
          (application) =>
            application.studentId === student.uid &&
            (application.status === "Selected" ||
              application.status === "Offer Released" ||
              application.status === "Enrolled" ||
              application.status === "Completed")
        );

        if (selected) {
          stageMap.set(
            "Placed",
            (stageMap.get("Placed") || 0) + 1
          );
        } else if (!hasSkills) {
          stageMap.set(
            "Not Assessed",
            (stageMap.get("Not Assessed") || 0) + 1
          );
        } else if (readiness >= 80) {
          stageMap.set(
            "Interview Ready",
            (stageMap.get("Interview Ready") || 0) + 1
          );
        } else if (readiness >= 75) {
          stageMap.set(
            "Placement Ready",
            (stageMap.get("Placement Ready") || 0) + 1
          );
        } else if (readiness >= 55) {
          stageMap.set(
            "Skill Building",
            (stageMap.get("Skill Building") || 0) + 1
          );
        } else {
          stageMap.set(
            "Foundation",
            (stageMap.get("Foundation") || 0) + 1
          );
        }
      }

      return Array.from(stageMap.entries()).map(
        ([stage, count]) => ({
          stage,
          count,
        })
      );
    })(),
  };
}
