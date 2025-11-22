import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from "firebase/auth";

// Signup (Email + Password)
export const signup = async (email, password, displayName, photoURL) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName, photoURL });
  return userCredential.user;
};

// Login (Email + Password)
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Google Sign In (Login + Signup)
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // Ensure profile fields exist
  if (result.user && !result.user.displayName) {
    await updateProfile(result.user, {
      displayName: result.user.email.split("@")[0],
      photoURL: result.user.photoURL || null,
    });
  }

  return result.user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};

// Get current logged-in user
export const getCurrentUser = () => auth.currentUser;

// Delete account (Firebase Auth)
export const deleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) return;

  await deleteUser(user); 
};
