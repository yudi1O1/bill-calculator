import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { BasketEntry } from "../types";
import { db, firebaseConfigError, isFirebaseConfigured } from "../lib/firebase";

const basketDocId = import.meta.env.FIREBASE_BASKET_DOC_ID || "default-basket";

interface BasketDocument {
  items?: BasketEntry[];
  savedAt?: {
    toDate?: () => Date;
  };
}

export interface BasketSnapshot {
  items: BasketEntry[];
  savedAt: string | null;
}

export const loadBasketFromFirestore = async (): Promise<BasketSnapshot | null> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error(firebaseConfigError || "Firebase is not configured.");
  }

  const basketRef = doc(db, "baskets", basketDocId);
  const snapshot = await getDoc(basketRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as BasketDocument;
  const items = Array.isArray(data.items) ? data.items : [];
  const savedAt = data.savedAt?.toDate ? data.savedAt.toDate().toISOString() : null;

  return {
    items,
    savedAt,
  };
};

export const saveBasketToFirestore = async (items: BasketEntry[]): Promise<string> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error(firebaseConfigError || "Firebase is not configured.");
  }

  const basketRef = doc(db, "baskets", basketDocId);

  await setDoc(basketRef, {
    items,
    savedAt: serverTimestamp(),
  });

  return new Date().toISOString();
};
