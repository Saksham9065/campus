import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/lib/firebase";

const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadResume(
  uid: string,
  file: File
): Promise<{ url: string; name: string }> {
  if (file.type !== "application/pdf") {
    throw new Error("Resume must be a PDF.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Resume must be under 10MB.");
  }

  const safeName =
    file.name.replace(/[^a-zA-Z0-9._-]/g, "_") ||
    "resume.pdf";

  const path = `resumes/${uid}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: "application/pdf",
  });

  const url = await getDownloadURL(storageRef);

  return { url, name: file.name };
}