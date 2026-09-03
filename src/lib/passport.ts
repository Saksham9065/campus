import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { CampusUser } from "@/types";
import type { SkillResult } from "@/lib/skillEngine";
import { generateSkillResults } from "@/lib/skillEngine";
import { getLatestAssessment } from "@/lib/firestoreAssessment";
import { getStudentCertificates } from "@/lib/firestoreCertificates";
import { getStudentApplications } from "@/lib/firestoreApplications";

export type PassportSkill = {
  name: string;
  score: number;
  level: string;
  status: string;
};

export type PassportCertificate = {
  id: string;
  certificateNumber: string;
  programTitle: string;
  provider: string;
  skills: string[];
  issuedAt?: unknown;
};

export type PassportApplication = {
  id: string;
  opportunityTitle: string;
  company: string;
  status: string;
  appliedAt?: unknown;
};

export type SkillPassport = {
  id?: string;
  passportId: string;

  studentId: string;
  studentName: string;
  studentEmail: string;

  college?: string;
  degree?: string;
  branch?: string;
  year?: string;

  careerRole?: string;

  readiness: number;
  skills: PassportSkill[];

  certificates: PassportCertificate[];
  applications: PassportApplication[];

  verified: boolean;

  createdAt?: unknown;
  updatedAt?: unknown;
};

function generatePassportId() {
  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `CL-PASS-${Date.now().toString(36).toUpperCase()}-${random}`;
}

export async function getPassportByStudent(
  studentId: string
): Promise<SkillPassport | null> {
  const passportQuery = query(
    collection(db, "skillPassports"),
    where("studentId", "==", studentId),
    limit(1)
  );

  const snapshot = await getDocs(passportQuery);

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return {
    id: item.id,
    ...(item.data() as Omit<SkillPassport, "id">),
  };
}

export async function getPassportById(
  passportId: string
): Promise<SkillPassport | null> {
  const passportRef = doc(db, "skillPassports", passportId);
  const snapshot = await getDoc(passportRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<SkillPassport, "id">),
  };
}

export async function createOrUpdatePassport(
  profile: CampusUser
): Promise<SkillPassport> {
  const existing = await getPassportByStudent(profile.uid);

  const assessment = await getLatestAssessment(profile.uid);

  let skills: SkillResult[] = [];

  if (assessment?.skillScores) {
    skills = generateSkillResults(assessment.skillScores);
  } else if (profile.skillScores) {
    skills = generateSkillResults(profile.skillScores);
  }

  const readiness =
    assessment?.score !== undefined && assessment?.total
      ? Math.round((assessment.score / assessment.total) * 100)
      : profile.readiness ?? 0;

  const certificates = await getStudentCertificates(profile.uid);

  const applications = await getStudentApplications(profile.uid);

  const passportData: Omit<
    SkillPassport,
    "id" | "passportId" | "createdAt" | "updatedAt"
  > = {
    studentId: profile.uid,
    studentName: profile.name,
    studentEmail: profile.email,

    college: profile.college,
    degree: profile.degree,
    branch: profile.branch,
    year: profile.year,

    careerRole: profile.careerRole,

    readiness,

    skills: skills.map((skill) => ({
      name: skill.name,
      score: skill.score,
      level: skill.level,
      status: skill.status,
    })),

    certificates: certificates.map((certificate) => ({
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      programTitle: certificate.programTitle,
      provider: certificate.provider,
      skills: certificate.skills,
      issuedAt: certificate.issuedAt,
    })),

    applications: applications.map((application) => ({
      id: application.id,
      opportunityTitle: application.opportunityTitle,
      company: application.company,
      status: application.status,
      appliedAt: application.appliedAt,
    })),

    verified: true,
  };

  if (existing?.id) {
    const passportRef = doc(db, "skillPassports", existing.id);

    const { updateDoc } = await import("firebase/firestore");

    await updateDoc(passportRef, {
      ...passportData,
      updatedAt: serverTimestamp(),
    });

    return {
      ...existing,
      ...passportData,
    };
  }

  const passportId = generatePassportId();

  const passportRef = await addDoc(collection(db, "skillPassports"), {
    passportId,
    ...passportData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: passportRef.id,
    passportId,
    ...passportData,
  };
}
