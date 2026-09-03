import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { createNotification } from "@/lib/notifications";

import type {
  Application,
  ApplicationStatus,
} from "@/lib/applications";

export type CreateApplicationData = {
  studentId: string;
  studentName: string;
  studentEmail: string;

  opportunityId: string;
  opportunityTitle: string;
  company: string;
  companyId: string;

  resumeUrl?: string;
  resumeName?: string;

  coverLetter?: string;
};

export async function hasApplied(
  studentId: string,
  opportunityId: string
) {
  const q = query(
    collection(db, "applications"),
    where("studentId", "==", studentId),
    where(
      "opportunityId",
      "==",
      opportunityId
    ),
    limit(1)
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;
}

export async function createApplication(
  data: CreateApplicationData
) {
  const alreadyApplied =
    await hasApplied(
      data.studentId,
      data.opportunityId
    );

  if (alreadyApplied) {
    throw new Error(
      "You have already applied to this opportunity."
    );
  }

  return addDoc(
    collection(db, "applications"),
    {
      ...data,
      status: "Applied",
      appliedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getStudentApplications(
  studentId: string
): Promise<Application[]> {
  const q = query(
    collection(db, "applications"),
    where("studentId", "==", studentId),
    orderBy("appliedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Application[];
}

export async function getOpportunityApplications(
  opportunityId: string
): Promise<Application[]> {
  const q = query(
    collection(db, "applications"),
    where(
      "opportunityId",
      "==",
      opportunityId
    ),
    orderBy("appliedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Application[];
}

export function subscribeToStudentApplications(
  studentId: string,
  callback: (applications: Application[]) => void
) {
  const q = query(
    collection(db, "applications"),
    where("studentId", "==", studentId),
    orderBy("appliedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const applications =
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Application[];

    callback(applications);
  });
}

export function subscribeToOpportunityApplications(
  opportunityId: string,
  callback: (applications: Application[]) => void
) {
  const q = query(
    collection(db, "applications"),
    where(
      "opportunityId",
      "==",
      opportunityId
    ),
    orderBy("appliedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const applications =
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Application[];

    callback(applications);
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  const applicationRef = doc(
    db,
    "applications",
    applicationId
  );

  const snapshot = await getDoc(applicationRef);

  if (!snapshot.exists()) {
    throw new Error("Application not found.");
  }

  const application = snapshot.data() as Application;

  await updateDoc(applicationRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  await createNotification({
    userId: application.studentId,
    title: `Application ${status}`,
    message: `Your application for ${application.opportunityTitle} at ${application.company} is now "${status}".`,
    type: "application",
    link: "/applications",
  });
}

export async function getApplication(
  applicationId: string
): Promise<Application | null> {
  const snapshot = await getDoc(
    doc(
      db,
      "applications",
      applicationId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Application;
}

export async function updateApplicationDetails(
  applicationId: string,
  data: {
    interviewDate?: string;
    interviewTime?: string;
    interviewMode?: "Online" | "Offline";
    interviewLink?: string;
    interviewNotes?: string;
    recruiterNotes?: string;
    rejectedReason?: string;
  }
) {
  const applicationRef = doc(
    db,
    "applications",
    applicationId
  );

  await updateDoc(applicationRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
