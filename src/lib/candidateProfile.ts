import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { CampusUser } from "@/types";

export async function getCandidateProfile(
  studentId: string
): Promise<CampusUser | null> {
  const userRef = doc(db, "users", studentId);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as CampusUser;
}
