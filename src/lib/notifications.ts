import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type NotificationType =
  | "application"
  | "opportunity"
  | "certificate"
  | "learning"
  | "system";

export type CampusNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt?: unknown;
};

export type CreateNotificationData = {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
};

export async function createNotification(
  data: CreateNotificationData
) {
  return addDoc(collection(db, "notifications"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifications: CampusNotification[]) => void,
  onError?: (error: Error) => void
) {
  const notificationQuery = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    notificationQuery,
    (snapshot) => {
      const notifications = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<CampusNotification, "id">),
      }));

      callback(notifications);
    },
    (error) => {
      console.error("Notification listener error:", error);
      if (onError) onError(error as Error);
    }
  );
}

export async function markNotificationAsRead(
  notificationId: string
) {
  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
}

export async function markAllNotificationsAsRead(
  userId: string
) {
  const notificationQuery = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(notificationQuery);

  if (snapshot.empty) return;

  const batch = writeBatch(db);

  snapshot.docs.forEach((item) => {
    batch.update(item.ref, {
      read: true,
    });
  });

  await batch.commit();
}
