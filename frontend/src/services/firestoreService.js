// frontend/src/services/firestoreService.js
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ... all functions you already had, unmodified ... */
/* This is the same file you provided; no functional changes needed here. */
export const addToFavorites = async (userId, song) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      favorites: arrayUnion({
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
        addedAt: new Date().toISOString(),
      }),
    });
    return { success: true, message: "Added to favorites" };
  } catch (err) {
    console.error("Add to favorites error:", err);
    throw err;
  }
};

export const removeFromFavorites = async (userId, videoId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const favorites = (userSnap.data().favorites || []).filter(
        (fav) => fav.videoId !== videoId
      );
      await updateDoc(userRef, { favorites });
      return { success: true, message: "Removed from favorites" };
    }
    return { success: false };
  } catch (err) {
    console.error("Remove from favorites error:", err);
    throw err;
  }
};

export const addToPlaylist = async (userId, playlistName, song) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const playlists = userSnap.data().playlists || [];
    const playlistIndex = playlists.findIndex((p) => p.name === playlistName);

    const songData = {
      videoId: song.videoId,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      addedAt: new Date().toISOString(),
    };

    if (playlistIndex >= 0) {
      playlists[playlistIndex].songs = playlists[playlistIndex].songs || [];
      if (!playlists[playlistIndex].songs.some((s) => s.videoId === song.videoId)) {
        playlists[playlistIndex].songs.push(songData);
      }
    } else {
      playlists.push({
        name: playlistName,
        createdAt: new Date().toISOString(),
        songs: [songData],
      });
    }

    await updateDoc(userRef, { playlists });
    return { success: true, message: `Added to playlist "${playlistName}"` };
  } catch (err) {
    console.error("Add to playlist error:", err);
    throw err;
  }
};

export const createPlaylist = async (userId, playlistName) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const playlists = userSnap.data().playlists || [];

    if (playlists.some((p) => p.name === playlistName)) {
      throw new Error("Playlist already exists");
    }

    playlists.push({
      name: playlistName,
      createdAt: new Date().toISOString(),
      songs: [],
    });

    await updateDoc(userRef, { playlists });
    return { success: true, message: `Playlist "${playlistName}" created` };
  } catch (err) {
    console.error("Create playlist error:", err);
    throw err;
  }
};

export const addToHistory = async (userId, song) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    let history = userSnap.data().history || [];

    history = history.filter(
      item => item.videoId !== song.videoId
    );

    const historyEntry = {
      videoId: song.videoId,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      playedAt: new Date().toISOString(),
    };

    history.unshift(historyEntry);
    if (history.length > 100) history = history.slice(0, 100);

    await updateDoc(userRef, { history });
    return { success: true, message: "Added to history" };
  } catch (err) {
    console.error("Add to history error:", err);
    throw err;
  }
};

export const getUserPlaylists = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return [];
    return userSnap.data().playlists || [];
  } catch (err) { console.error("Get playlists error:", err); throw err; }
};

export const getUserFavorites = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return [];
    return userSnap.data().favorites || [];
  } catch (err) { console.error("Get favorites error:", err); throw err; }
};

export const getUserHistory = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return [];
    return userSnap.data().history || [];
  } catch (err) { console.error("Get history error:", err); throw err; }
};

export const removeFromPlaylist = async (userId, playlistName, videoId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { success: false };
    const playlists = userSnap.data().playlists || [];
    const idx = playlists.findIndex((p) => p.name === playlistName);
    if (idx >= 0) {
      playlists[idx].songs = (playlists[idx].songs || []).filter((s) => s.videoId !== videoId);
      await updateDoc(userRef, { playlists });
      return { success: true };
    }
    return { success: false };
  } catch (err) { console.error("Remove from playlist error:", err); throw err; }
};

export const removePlaylist = async (userId, playlistName) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { success: false };
    let playlists = userSnap.data().playlists || [];
    playlists = playlists.filter((p) => p.name !== playlistName);
    await updateDoc(userRef, { playlists });
    return { success: true };
  } catch (err) { console.error("Remove playlist error:", err); throw err; }
};

export const clearHistory = async (userId) => {
  try { const userRef = doc(db, "users", userId); await updateDoc(userRef, { history: [] }); return { success: true }; } catch (err) { console.error("Clear history error:", err); throw err; }
};

export const removeFromHistory = async (userId, videoId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { success: false };
    const history = (userSnap.data().history || []).filter((h) => h.videoId !== videoId);
    await updateDoc(userRef, { history });
    return { success: true };
  } catch (err) { console.error("Remove from history error:", err); throw err; }
};
