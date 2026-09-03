import {
  doc,
  getDocFromServer,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { CampusUser } from "@/types";

export async function createUserProfile(user: CampusUser) {
  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      ...user,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function getUserProfile(
  uid: string
): Promise<CampusUser | null> {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDocFromServer(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as CampusUser;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<CampusUser>
) {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}
