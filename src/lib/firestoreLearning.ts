import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { createNotification } from "@/lib/notifications";

export type Enrollment = {
  id: string;
  studentId: string;
  programId: string;
  programTitle: string;
  provider: string;
  duration: string;
  skills: string[];
  progress: number;
  status: "enrolled" | "completed";
  enrolledAt?: unknown;
  completedAt?: unknown;
};

export async function enrollInProgram(data: {
  studentId: string;
  programId: string;
  programTitle: string;
  provider: string;
  duration: string;
  skills: string[];
}) {
  const existingQuery = query(
    collection(db, "enrollments"),
    where("studentId", "==", data.studentId),
    where("programId", "==", data.programId)
  );

  const existing = await getDocs(existingQuery);

  if (!existing.empty) {
    throw new Error(
      "You are already enrolled in this program."
    );
  }

  return addDoc(collection(db, "enrollments"), {
    ...data,
    progress: 0,
    status: "enrolled",
    enrolledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEnrollmentProgress(
  enrollmentId: string,
  progress: number
) {
  const safeProgress = Math.min(
    100,
    Math.max(0, Math.round(progress))
  );

  const enrollmentRef = doc(
    db,
    "enrollments",
    enrollmentId
  );

  const snapshot = await getDoc(enrollmentRef);

  if (!snapshot.exists()) {
    throw new Error("Enrollment not found.");
  }

  const enrollment = snapshot.data() as Enrollment;

  const completed = safeProgress === 100;

  await updateDoc(enrollmentRef, {
    progress: safeProgress,
    status: completed ? "completed" : "enrolled",
    ...(completed
      ? {
          completedAt: serverTimestamp(),
        }
      : {}),
    updatedAt: serverTimestamp(),
  });

  if (completed && enrollment.status !== "completed") {
    await createNotification({
      userId: enrollment.studentId,
      title: "Learning Program Completed 🎉",
      message: `You completed ${enrollment.programTitle}. Your certificate is ready.`,
      type: "learning",
      link: "/learning/certificates",
    });
  }
}

export function subscribeToStudentEnrollments(
  studentId: string,
  callback: (data: Enrollment[]) => void
) {
  const q = query(
    collection(db, "enrollments"),
    where("studentId", "==", studentId),
    orderBy("enrolledAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const enrollments =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Enrollment[];

      callback(enrollments);
    },
    (error) => {
      console.error("Enrollment listener error:", error);
    }
  );
}
