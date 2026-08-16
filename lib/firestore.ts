import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import app from "./firebase";

export const db = getFirestore(app);

/*
  Save uploaded file information
*/
export async function saveFileRecord(data: {
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  sha256Hash: string;
  storageUrl?: string;
  blockchainTx?: string;
}) {
  const docRef = await addDoc(collection(db, "files"), {
    userId: data.userId,
    fileName: data.fileName,
    fileSize: data.fileSize,
    fileType: data.fileType,
    sha256Hash: data.sha256Hash,
    storageUrl: data.storageUrl || "",
    blockchainTx: data.blockchainTx || "",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/*
  Get files belonging to the logged-in user
*/
export async function getUserFiles(userId: string) {
  const filesQuery = query(
    collection(db, "files"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(filesQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}