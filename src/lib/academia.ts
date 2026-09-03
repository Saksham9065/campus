import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type AcademiaOpportunityType =
  | "Faculty Internship"
  | "Industrial Training"
  | "FDP"
  | "Consultancy"
  | "Research Project"
  | "Mentorship"
  | "Guest Lecture"
  | "Workshop"
  | "Innovation Challenge"
  | "Live Project";

export type AcademiaOpportunityMode =
  | "Online"
  | "Offline"
  | "Hybrid";

export type AcademiaOpportunity = {
  id: string;

  title: string;
  organization: string;
  organizationId: string;

  type: AcademiaOpportunityType;
  mode: AcademiaOpportunityMode;

  location?: string;

  description: string;

  requiredExpertise: string[];
  preferredExpertise: string[];

  duration?: string;
  compensation?: string;

  deadline?: string;

  status: "open" | "closed";

  postedAt?: unknown;
  updatedAt?: unknown;
};

export type AcademiaApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected"
  | "Completed";

export type AcademiaApplication = {
  id: string;

  academicianId: string;
  academicianName: string;
  academicianEmail: string;

  opportunityId: string;
  opportunityTitle: string;
  organization: string;

  status: AcademiaApplicationStatus;

  coverLetter?: string;

  appliedAt?: unknown;
  updatedAt?: unknown;
};

export async function createAcademiaOpportunity(
  data: Omit<
    AcademiaOpportunity,
    "id" | "status" | "postedAt" | "updatedAt"
  >
) {
  return addDoc(
    collection(db, "academiaOpportunities"),
    {
      ...data,
      status: "open",
      postedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getOpenAcademiaOpportunities() {
  const opportunityQuery = query(
    collection(db, "academiaOpportunities"),
    where("status", "==", "open"),
    orderBy("postedAt", "desc"),
    limit(100)
  );

  const snapshot = await getDocs(opportunityQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<AcademiaOpportunity, "id">),
  }));
}

export async function getAcademiaOpportunitiesByOwner(
  organizationId: string
) {
  const opportunityQuery = query(
    collection(db, "academiaOpportunities"),
    where("organizationId", "==", organizationId),
    orderBy("postedAt", "desc"),
    limit(100)
  );

  const snapshot = await getDocs(opportunityQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<AcademiaOpportunity, "id">),
  }));
}

export async function updateAcademiaOpportunityStatus(
  opportunityId: string,
  status: "open" | "closed"
) {
  await updateDoc(
    doc(db, "academiaOpportunities", opportunityId),
    {
      status,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function createAcademiaApplication(
  data: Omit<
    AcademiaApplication,
    "id" | "status" | "appliedAt" | "updatedAt"
  >
) {
  const existingQuery = query(
    collection(db, "academiaApplications"),
    where("academicianId", "==", data.academicianId),
    where("opportunityId", "==", data.opportunityId),
    limit(1)
  );

  const existing = await getDocs(existingQuery);

  if (!existing.empty) {
    throw new Error(
      "You have already applied to this opportunity."
    );
  }

  return addDoc(
    collection(db, "academiaApplications"),
    {
      ...data,
      status: "Applied",
      appliedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getAcademicianApplications(
  academicianId: string
) {
  const applicationQuery = query(
    collection(db, "academiaApplications"),
    where("academicianId", "==", academicianId),
    orderBy("appliedAt", "desc"),
    limit(100)
  );

  const snapshot = await getDocs(applicationQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<AcademiaApplication, "id">),
  }));
}

export async function getOpportunityAcademiaApplications(
  opportunityId: string
) {
  const applicationQuery = query(
    collection(db, "academiaApplications"),
    where("opportunityId", "==", opportunityId),
    orderBy("appliedAt", "desc"),
    limit(100)
  );

  const snapshot = await getDocs(applicationQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<AcademiaApplication, "id">),
  }));
}

export async function updateAcademiaApplicationStatus(
  applicationId: string,
  status: AcademiaApplicationStatus
) {
  await updateDoc(
    doc(db, "academiaApplications", applicationId),
    {
      status,
      updatedAt: serverTimestamp(),
    }
  );
}
