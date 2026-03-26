import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const apiKey = import.meta.env.FIREBASE_API_KEY;
const authDomain = import.meta.env.FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.FIREBASE_APP_ID;
const measurementId = import.meta.env.FIREBASE_MEASUREMENT_ID;

const missingKeys: string[] = [];

if (!apiKey) missingKeys.push("FIREBASE_API_KEY");
if (!authDomain) missingKeys.push("FIREBASE_AUTH_DOMAIN");
if (!projectId) missingKeys.push("FIREBASE_PROJECT_ID");
if (!storageBucket) missingKeys.push("FIREBASE_STORAGE_BUCKET");
if (!messagingSenderId) missingKeys.push("FIREBASE_MESSAGING_SENDER_ID");
if (!appId) missingKeys.push("FIREBASE_APP_ID");

export const isFirebaseConfigured = missingKeys.length === 0;

export const firebaseConfigError = isFirebaseConfigured
  ? null
  : `Missing Firebase env vars: ${missingKeys.join(", ")}`;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const db = app ? getFirestore(app) : null;
