import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { createNotification } from "@/lib/notifications";

export type Certificate = {
  id: string;
  certificateNumber: string;

  studentId: string;
  studentName: string;

  programId: string;
  programTitle: string;
  provider: string;

  skills: string[];

  issuedAt?: unknown;
};

export async function issueCertificate(
  data: {
    studentId: string;
    studentName: string;
    programId: string;
    programTitle: string;
    provider: string;
    skills: string[];
  }
) {
  const existingQuery = query(
    collection(db, "certificates"),
    where("studentId", "==", data.studentId),
    where("programId", "==", data.programId)
  );

  const existing = await getDocs(existingQuery);

  if (!existing.empty) {
    return existing.docs[0].id;
  }

  const certificateNumber =
    `CL-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

  const certificate = await addDoc(
    collection(db, "certificates"),
    {
      ...data,
      certificateNumber,
      issuedAt: serverTimestamp(),
    }
  );

  await createNotification({
    userId: data.studentId,
    title: "Certificate Issued 🎓",
    message: `Your certificate for ${data.programTitle} has been issued and verified.`,
    type: "certificate",
    link: "/learning/certificates",
  });

  return certificate.id;
}

export async function getStudentCertificates(
  studentId: string
): Promise<Certificate[]> {
  const q = query(
    collection(db, "certificates"),
    where("studentId", "==", studentId),
    orderBy("issuedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  ) as Certificate[];
}
