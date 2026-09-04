import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { JobOpportunity } from "@/lib/jobMatcher";

export async function createOpportunity(
  data: Omit<
    JobOpportunity,
    "id" | "postedAt"
  > & {
    companyId: string;
  }
) {
  return addDoc(
    collection(db, "opportunities"),
    {
      ...data,
      status: "open",
      postedAt: serverTimestamp(),
    }
  );
}

export async function getOpenOpportunities(): Promise<
  JobOpportunity[]
> {
  const opportunitiesQuery = query(
    collection(db, "opportunities"),
    where("status", "==", "open"),
    orderBy("postedAt", "desc"),
    limit(50)
  );

  const snapshot = await getDocs(
    opportunitiesQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as JobOpportunity[];
}

export async function deleteOpportunity(
  opportunityId: string
) {
  const batch = writeBatch(db);

  const applicationsQuery = query(
    collection(db, "applications"),
    where("opportunityId", "==", opportunityId)
  );

  const applicationSnapshot =
    await getDocs(applicationsQuery);

  applicationSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(
    doc(db, "opportunities", opportunityId)
  );

  await batch.commit();

  return opportunityId;
}

