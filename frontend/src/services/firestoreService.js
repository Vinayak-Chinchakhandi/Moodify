import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

/**
 * Add song to user's favorites
 */
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

/**
 * Remove song from favorites
 */
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
  } catch (err) {
    console.error("Remove from favorites error:", err);
    throw err;
  }
};

/**
 * Add song to a playlist (or create if doesn't exist)
 */
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
      // Playlist exists, add song
      playlists[playlistIndex].songs = playlists[playlistIndex].songs || [];
      
      // Avoid duplicates
      if (!playlists[playlistIndex].songs.some((s) => s.videoId === song.videoId)) {
        playlists[playlistIndex].songs.push(songData);
      }
    } else {
      // Create new playlist
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

/**
 * Create a new playlist
 */
export const createPlaylist = async (userId, playlistName) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const playlists = userSnap.data().playlists || [];
    
    // Check if playlist already exists
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

/**
 * Add song to user's history (last 100 plays)
 */
export const addToHistory = async (userId, song) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    let history = userSnap.data().history || [];

    const historyEntry = {
      videoId: song.videoId,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      playedAt: new Date().toISOString(),
    };

    history.unshift(historyEntry); // Add to front

    // Keep only last 100 plays
    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    await updateDoc(userRef, { history });
    return { success: true, message: "Added to history" };
  } catch (err) {
    console.error("Add to history error:", err);
    throw err;
  }
};

/**
 * Get user's playlists
 */
export const getUserPlaylists = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return [];
    }

    return userSnap.data().playlists || [];
  } catch (err) {
    console.error("Get playlists error:", err);
    throw err;
  }
};

/**
 * Get user's favorites
 */
export const getUserFavorites = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return [];
    }

    return userSnap.data().favorites || [];
  } catch (err) {
    console.error("Get favorites error:", err);
    throw err;
  }
};

/**
 * Get user's history
 */
export const getUserHistory = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return [];
    }

    return userSnap.data().history || [];
  } catch (err) {
    console.error("Get history error:", err);
    throw err;
  }
};
