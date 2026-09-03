import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { JobOpportunity } from "@/lib/jobMatcher";

export async function getIndustryOpportunities(
  companyId: string
): Promise<JobOpportunity[]> {
  const q = query(
    collection(db, "opportunities"),
    where("companyId", "==", companyId),
    orderBy("postedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as JobOpportunity[];
}

export async function updateOpportunityStatus(
  opportunityId: string,
  status: "open" | "closed"
) {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

  await updateDoc(
    doc(db, "opportunities", opportunityId),
    {
      status,
      updatedAt: serverTimestamp(),
    }
  );
}
