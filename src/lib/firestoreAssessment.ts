import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Question } from "@/lib/assessmentQuestions";
import type { AssessmentAttempt } from "@/lib/skillEngine";

export type AssessmentData = {
  studentId: string;
  roles: string[];
  answers: Record<string, number>;
  score: number;
  total: number;
  skillScores: Record<string, number>;
  questions?: Question[];
  attempt?: AssessmentAttempt;
  suggestedRole?: string;
};

export async function saveAssessment(
  data: AssessmentData
) {
  return addDoc(collection(db, "assessments"), {
    ...data,
    completedAt: serverTimestamp(),
  });
}

export async function getLatestAssessment(
  studentId: string
): Promise<(AssessmentData & { id: string }) | null> {
  const assessmentQuery = query(
    collection(db, "assessments"),
    where("studentId", "==", studentId),
    orderBy("completedAt", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(assessmentQuery);

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return {
    id: item.id,
    ...(item.data() as AssessmentData),
  };
}
