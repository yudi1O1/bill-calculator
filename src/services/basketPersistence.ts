import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { BasketEntry } from "../types";
import { db, firebaseConfigError, isFirebaseConfigured } from "../lib/firebase";

const basketDocId = import.meta.env.FIREBASE_BASKET_DOC_ID || "default-basket";
const basketDocPath = ["baskets", basketDocId] as const;

interface BasketDocument {
  items: BasketEntry[];
  savedAt?: {
    toDate?: () => Date;
  };
}

export interface BasketSnapshot {
  items: BasketEntry[];
  savedAt: string | null;
}

const getBasketDocRef = () => {
  if (!db) {
    throw new Error(firebaseConfigError || "Firebase is not configured.");
  }

  return doc(db, ...basketDocPath);
};

export const loadBasketFromFirestore = async (): Promise<BasketSnapshot | null> => {
  if (!isFirebaseConfigured) {
    throw new Error(firebaseConfigError || "Firebase is not configured.");
  }

  const snapshot = await getDoc(getBasketDocRef());

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as BasketDocument;

  return {
    items: Array.isArray(data.items) ? data.items : [],
    savedAt: data.savedAt?.toDate?.().toISOString() ?? null,
  };
};

export const saveBasketToFirestore = async (items: BasketEntry[]): Promise<string> => {
  if (!isFirebaseConfigured) {
    throw new Error(firebaseConfigError || "Firebase is not configured.");
  }

  await setDoc(getBasketDocRef(), {
    items,
    savedAt: serverTimestamp(),
  });

  return new Date().toISOString();
};
