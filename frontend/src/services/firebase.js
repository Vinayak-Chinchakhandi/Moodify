import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// ✅ Fallback safeguard (prevents crash if env missing)
if (!firebaseConfig.apiKey) {
  console.warn("⚠️ Firebase API key missing — using mock fallback config");
  firebaseConfig.apiKey = "FAKE_API_KEY_FOR_DEV";
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
