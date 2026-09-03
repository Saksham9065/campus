import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { CampusUser } from "@/types";
import type { Application } from "@/lib/applications";
import type { JobOpportunity } from "@/lib/jobMatcher";

export type InstitutionAnalytics = {
  totalStudents: number;
  assessedStudents: number;

  averageReadiness: number;
  placementReady: number;

  totalApplications: number;
  selectedStudents: number;
  rejectedApplications: number;

  totalInternships: number;
  activeOpportunities: number;

  departments: DepartmentAnalytics[];
  skillDemand: SkillDemand[];

  placementStages: {
    stage: string;
    count: number;
  }[];
};

export type DepartmentAnalytics = {
  department: string;
  students: number;
  assessed: number;
  averageReadiness: number;
  placementReady: number;
};

export type SkillDemand = {
  skill: string;
  students: number;
};

export async function getInstitutionStudents(
  institution: string
): Promise<CampusUser[]> {
  const studentQuery = query(
    collection(db, "users"),
    where("role", "==", "student"),
    where("college", "==", institution),
    limit(500)
  );

  const snapshot = await getDocs(studentQuery);

  return snapshot.docs.map((item) => ({
    uid: item.id,
    ...(item.data() as Omit<CampusUser, "uid">),
  }));
}

export async function getInstitutionApplications(
  studentIds: string[]
): Promise<Application[]> {
  if (studentIds.length === 0) {
    return [];
  }

  const result: Application[] = [];

  /*
   * Firestore where-in supports limited values per query,
   * so process students in chunks.
   */
  for (let i = 0; i < studentIds.length; i += 10) {
    const chunk = studentIds.slice(i, i + 10);

    const applicationQuery = query(
      collection(db, "applications"),
      where("studentId", "in", chunk),
      limit(500)
    );

    const snapshot = await getDocs(applicationQuery);

    snapshot.docs.forEach((item) => {
      result.push({
        id: item.id,
        ...(item.data() as Omit<Application, "id">),
      });
    });
  }

  return result;
}

export async function getInstitutionOpportunities(): Promise<
  JobOpportunity[]
> {
  const opportunityQuery = query(
    collection(db, "opportunities"),
    limit(500)
  );

  const snapshot = await getDocs(opportunityQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<JobOpportunity, "id">),
  }));
}

function calculateDepartmentAnalytics(
  students: CampusUser[]
): DepartmentAnalytics[] {
  const grouped = new Map<string, CampusUser[]>();

  for (const student of students) {
    const department =
      student.branch ||
      "Unspecified";

    const current = grouped.get(department) || [];

    current.push(student);

    grouped.set(department, current);
  }

  return Array.from(grouped.entries())
    .map(([department, members]) => {
      const assessed = members.filter(
        (student) =>
          student.readiness !== undefined
      );

      const readinessValues = assessed
        .map((student) => student.readiness || 0);

      const averageReadiness =
        readinessValues.length > 0
          ? Math.round(
              readinessValues.reduce(
                (sum, value) => sum + value,
                0
              ) / readinessValues.length
            )
          : 0;

      return {
        department,
        students: members.length,
        assessed: assessed.length,
        averageReadiness,
        placementReady: members.filter(
          (student) =>
            (student.readiness || 0) >= 75
        ).length,
      };
    })
    .sort(
      (a, b) =>
        b.averageReadiness -
        a.averageReadiness
    );
}

function calculateSkillDemand(
  students: CampusUser[]
): SkillDemand[] {
  const skillMap = new Map<string, number>();

  for (const student of students) {
    for (const skill of Object.keys(
      student.skillScores || {}
    )) {
      skillMap.set(
        skill,
        (skillMap.get(skill) || 0) + 1
      );
    }
  }

  return Array.from(skillMap.entries())
    .map(([skill, students]) => ({
      skill,
      students,
    }))
    .sort(
      (a, b) => b.students - a.students
    )
    .slice(0, 10);
}

export async function getInstitutionAnalytics(
  institution: string
): Promise<InstitutionAnalytics> {
  const students =
    await getInstitutionStudents(institution);

  const studentIds = students.map(
    (student) => student.uid
  );

  const [applications, opportunities] =
    await Promise.all([
      getInstitutionApplications(studentIds),
      getInstitutionOpportunities(),
    ]);

  const assessedStudents = students.filter(
    (student) =>
      student.readiness !== undefined ||
      student.skillScores
  );

  const readinessValues = assessedStudents
    .map((student) => student.readiness || 0);

  const averageReadiness =
    readinessValues.length > 0
      ? Math.round(
          readinessValues.reduce(
            (sum, value) => sum + value,
            0
          ) / readinessValues.length
        )
      : 0;

  const placementReady = students.filter(
    (student) =>
      (student.readiness || 0) >= 75
  ).length;

  const selectedStudents = applications.filter(
    (application) =>
      application.status === "Selected" ||
      application.status === "Offer Released" ||
      application.status === "Enrolled" ||
      application.status === "Completed"
  ).length;

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

  const totalInternships =
    opportunities.filter(
      (opportunity) =>
        opportunity.type === "Internship"
    ).length;

  const activeOpportunities =
    opportunities.filter(
      (opportunity) =>
        opportunity.status !== "closed"
    ).length;

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

  const placementStages = Array.from(
    stageMap.entries()
  ).map(([stage, count]) => ({
    stage,
    count,
  }));

  return {
    totalStudents: students.length,
    assessedStudents: assessedStudents.length,

    averageReadiness,
    placementReady,

    totalApplications: applications.length,
    selectedStudents,
    rejectedApplications,

    totalInternships,
    activeOpportunities,

    departments:
      calculateDepartmentAnalytics(
        students
      ),

    skillDemand:
      calculateSkillDemand(students),

    placementStages,
  };
}
