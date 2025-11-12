import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

// -------------------------
// USERS
// -------------------------
export const createUserProfile = async (uid, data) => {
  // data: { name, email, profilePicURL, languages: [] }
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { ...data, createdAt: new Date() });
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};

// -------------------------
// FAVORITES
// -------------------------
export const addToFavorites = async (uid, song) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { favorites: arrayUnion(song) });
};

export const removeFromFavorites = async (uid, song) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { favorites: arrayRemove(song) });
};

export const getFavorites = async (uid) => {
  const user = await getUserProfile(uid);
  return user?.favorites || [];
};

// -------------------------
// PLAYLISTS
// -------------------------
export const createPlaylist = async (uid, playlistName) => {
  const userRef = doc(db, "users", uid);
  const playlist = { name: playlistName, songs: [], createdAt: new Date() };
  await updateDoc(userRef, { playlists: arrayUnion(playlist) });
};

export const addSongToPlaylist = async (uid, playlistName, song) => {
  const userRef = doc(db, "users", uid);
  const userData = await getUserProfile(uid);
  if (!userData?.playlists) return;

  const updatedPlaylists = userData.playlists.map((pl) =>
    pl.name === playlistName ? { ...pl, songs: [...pl.songs, song] } : pl
  );
  await updateDoc(userRef, { playlists: updatedPlaylists });
};

export const removeSongFromPlaylist = async (uid, playlistName, songId) => {
  const userRef = doc(db, "users", uid);
  const userData = await getUserProfile(uid);
  if (!userData?.playlists) return;

  const updatedPlaylists = userData.playlists.map((pl) =>
    pl.name === playlistName
      ? { ...pl, songs: pl.songs.filter((s) => s.id !== songId) }
      : pl
  );
  await updateDoc(userRef, { playlists: updatedPlaylists });
};

export const getPlaylists = async (uid) => {
  const user = await getUserProfile(uid);
  return user?.playlists || [];
};

// -------------------------
// HISTORY
// -------------------------
export const addToHistory = async (uid, song) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { history: arrayUnion({ ...song, playedAt: new Date() }) });
};

export const getHistory = async (uid, limitCount = 20) => {
  const user = await getUserProfile(uid);
  return user?.history
    ?.sort((a, b) => b.playedAt.toMillis() - a.playedAt.toMillis())
    .slice(0, limitCount) || [];
};
