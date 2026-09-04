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
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { createNotification } from "@/lib/notifications";

import type { Lesson } from "@/lib/learningEngine";
import { getProgramLessons } from "@/lib/learningEngine";

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
  updatedAt?: unknown;
};

export type LessonProgress = {
  id: string;
  enrollmentId: string;
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  completedAt?: unknown;
};

function lessonProgressRef(
  enrollmentId: string,
  lessonId: string
) {
  return doc(
    db,
    "enrollments",
    enrollmentId,
    "lessonProgress",
    lessonId
  );
}

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

export async function completeLesson(
  enrollmentId: string,
  lesson: Lesson
) {
  const ref = lessonProgressRef(enrollmentId, lesson.id);

  const snapshot = await getDoc(ref);

  const wasCompleted =
    snapshot.exists() &&
    (snapshot.data() as LessonProgress)?.completed;

  await setDoc(
    ref,
    {
      enrollmentId,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      completed: true,
      completedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { wasCompleted };
}

export async function uncompleteLesson(
  enrollmentId: string,
  lessonId: string
) {
  const ref = lessonProgressRef(enrollmentId, lessonId);

  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    await setDoc(
      ref,
      {
        completed: false,
        completedAt: null,
      },
      { merge: true }
    );
  }
}

export function subscribeToLessonProgress(
  enrollmentId: string,
  callback: (data: LessonProgress[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(
      db,
      "enrollments",
      enrollmentId,
      "lessonProgress"
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const progress =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as LessonProgress[];

      callback(progress);
    },
    (error) => {
      console.error(
        "Lesson progress listener error:",
        error
      );
      if (onError) onError(error as Error);
    }
  );
}

export function calculateEnrollmentProgress(
  lessons: Lesson[],
  completedLessonIds: Set<string>
): number {
  if (!lessons.length) return 0;

  const completed = lessons.filter((lesson) =>
    completedLessonIds.has(lesson.id)
  ).length;

  return Math.round(
    (completed / lessons.length) * 100
  );
}

export async function syncEnrollmentProgress(
  enrollment: Enrollment
): Promise<number> {
  const lessons = getProgramLessons(
    enrollment.programId
  );

  if (!lessons.length) {
    return enrollment.progress;
  }

  const q = query(
    collection(
      db,
      "enrollments",
      enrollment.id,
      "lessonProgress"
    )
  );

  const snapshot = await getDocs(q);

  const completedLessonIds = new Set(
    snapshot.docs
      .map((doc) => doc.data() as LessonProgress)
      .filter((item) => item.completed)
      .map((item) => item.lessonId)
  );

  const progress = calculateEnrollmentProgress(
    lessons,
    completedLessonIds
  );

  const completed = progress === 100;

  const updates: Record<string, unknown> = {
    progress,
    status: completed ? "completed" : "enrolled",
    updatedAt: serverTimestamp(),
  };

  if (completed) {
    updates.completedAt = serverTimestamp();
  }

  await updateDoc(
    doc(db, "enrollments", enrollment.id),
    updates
  );

  return progress;
}

export function subscribeToStudentEnrollments(
  studentId: string,
  callback: (data: Enrollment[]) => void,
  onError?: (error: Error) => void
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
      if (onError) onError(error as Error);
    }
  );
}
