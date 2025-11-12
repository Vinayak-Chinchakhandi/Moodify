import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// Signup
export const signup = async (email, password, displayName, photoURL) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName, photoURL });
  return userCredential.user;
};

// Login
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};

// Current logged-in user
export const getCurrentUser = () => auth.currentUser;
