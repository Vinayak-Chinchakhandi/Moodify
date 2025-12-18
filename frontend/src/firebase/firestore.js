import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export { db, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, arrayUnion, arrayRemove };

// Convenience helpers
export const userDocRef = (userId) => doc(db, "users", userId);
